# Meisterwerk: Umzug der Website zu Cloudflare (Anleitung für die lokale Sitzung)

Stand 16.11.2026. Diese Anleitung ist für eine **lokale Claude-Code-Sitzung mit Zugriff auf das Cloudflare-Konto** gedacht.
Die Cloud-Sitzung, die die Website baut, hat diesen Zugriff nicht. Unten steht ein fertiger Auftrag zum Hineinkopieren.

## Ausgangslage (vom Nutzer festgelegt)
- **Domain** `meisterwerk-lb.de` bleibt bei **IONOS** registriert. Bei IONOS werden nur die Nameserver auf Cloudflare umgestellt.
- **Website** zieht komplett zu **Cloudflare Pages** (Astro-Build aus `meisterwerk/` im Repo `dmldigital/aa`).
- **E-Mail läuft über Microsoft** (Microsoft 365 / Exchange Online). **Das darf zu keinem Zeitpunkt ausfallen.**
- **Formulare:** Versand über eine Cloudflare Pages Function mit **Turnstile** (Spam-Schutz), **Resend** (Mail-Versand),
  **D1** (Anfragen speichern) und **R2** (hochgeladene Bilder). Heute (WordPress) gehen die Formular-Mails über den IONOS-Webserver.
- Bis zur Umstellung der Website bleibt WordPress online, auch nach dem Nameserver-Wechsel (der A-Eintrag zeigt weiter auf IONOS).

## Die eine Regel
**Die Nameserver werden erst umgestellt, wenn Cloudflare nachweislich dieselben DNS-Einträge liefert wie IONOS.**
Prüfen mit `meisterwerk/tools/dns-vergleich.sh` (0 Abweichungen). Mail-Einträge in Cloudflare immer **„Nur DNS“ (graue Wolke)**,
nie „Proxied“ (orange). Die DNS-Zone bei IONOS **nicht löschen**, sie ist der Weg zurück.

## Ablauf

### Phase 0: Bestand sichern (nur lesen)
1. IONOS: DNS-Einstellungen der Domain öffnen und **alle Einträge** notieren oder als Liste exportieren, auch Unterdomains.
2. IONOS: prüfen, ob **DNSSEC** aktiv ist. Wenn ja: vor dem Nameserver-Wechsel bei IONOS deaktivieren und mindestens 24 Stunden warten
   (sonst ist die Domain nach dem Wechsel nicht erreichbar, auch die Mail). Nach erfolgreichem Umzug kann DNSSEC in Cloudflare neu aktiviert werden.
3. **Kein Microsoft-Login nötig:** Die Mail funktioniert heute, also stehen alle Einträge, die Microsoft braucht, schon in der IONOS-Zone.
   Sie werden 1:1 übernommen. Beim Abgleich besonders auf diese Einträge achten (typisch für Exchange Online, maßgeblich ist, was bei IONOS steht):
   - `MX @` → `meisterwerk-lb-de.mail.protection.outlook.com` (genauer Wert wie bei IONOS)
   - `TXT @` → `v=spf1 include:spf.protection.outlook.com -all` (eventuell mit weiteren `include:`)
   - `TXT @` → `MS=ms…` (Domänen-Nachweis)
   - `CNAME autodiscover` → `autodiscover.outlook.com`
   - `CNAME selector1._domainkey` und `selector2._domainkey` → `…._domainkey.<tenant>.onmicrosoft.com` (DKIM)
   - `TXT _dmarc` (falls vorhanden)
   - ggf. Teams/Skype (`sip`, `lyncdiscover`, SRV `_sip._tls`, `_sipfederationtls._tcp`) und Intune (`enterpriseregistration`, `enterpriseenrollment`)
4. Notieren, worauf `@` und `www` heute zeigen (WordPress bei IONOS).

### Phase 1: Zone in Cloudflare vorbereiten (Nameserver noch NICHT ändern)
1. Cloudflare → Website hinzufügen → `meisterwerk-lb.de`, Plan **Free**. Cloudflare liest vorhandene Einträge ein, das ist **unvollständig**.
2. Jeden Eintrag aus der IONOS-Liste (Phase 0) übernehmen, Werte exakt gleich, fehlende ergänzen. Dabei:
   - MX, alle TXT, `autodiscover`, `_domainkey`-CNAMEs, `sip`, `lyncdiscover`, `enterprise…`: **Nur DNS (grau)**.
   - `@` und `www` (WordPress): vorerst **Nur DNS (grau)** mit denselben Werten wie bei IONOS. So ändert sich beim Wechsel nichts.
   - Es darf nur **einen** SPF-Eintrag (`v=spf1 …`) auf `@` geben.
3. Die beiden zugewiesenen Cloudflare-Nameserver notieren (Dashboard → DNS → Einträge, unten „Cloudflare-Nameserver“).
4. Vergleich laufen lassen:
   ```bash
   dig NS meisterwerk-lb.de +short
   ```
   ```bash
   meisterwerk/tools/dns-vergleich.sh <ein IONOS-Nameserver> <ein Cloudflare-Nameserver>
   ```
   Namen aus dem IONOS-Bestand, die das Skript nicht kennt, über `EXTRA_NAMES="name1 name2"` vor dem Aufruf ergänzen.
   Erst bei **0 Abweichungen** weiter. (Falls die Cloudflare-Nameserver vor der Aktivierung nicht antworten: Liste im Dashboard
   von Hand gegen Phase 0 prüfen.)

### Phase 2: Nameserver bei IONOS umstellen (Nutzer bestätigt diesen Schritt ausdrücklich)
1. Zeitpunkt: werktags vormittags, nicht vor einem Wochenende.
2. IONOS → Domains → `meisterwerk-lb.de` → Nameserver → **eigene Nameserver** → die beiden Cloudflare-Nameserver eintragen.
3. Warten, bis Cloudflare die Zone als **aktiv** meldet (Minuten bis wenige Stunden).
4. Prüfen:
   - `dig MX meisterwerk-lb.de @1.1.1.1 +short` und `@8.8.8.8` liefern den Microsoft-MX.
   - Mail von außen (z. B. Gmail) an `info@meisterwerk-lb.de` kommt an, Antwort aus Outlook kommt beim Absender an.
   - Website (noch WordPress) lädt unter `meisterwerk-lb.de` und `www.meisterwerk-lb.de`.
5. **Zurück, falls etwas nicht stimmt:** bei IONOS wieder die IONOS-Standard-Nameserver einstellen. Die alte Zone bei IONOS ist noch da.

### Phase 3: Cloudflare-Dienste für die neue Website einrichten
Der Code liegt fertig im Repo: Function `meisterwerk/functions/api/anfrage.ts` (POST `/api/anfrage`), Mail-Vorlagen
`meisterwerk/src/lib/anfrage-mail.ts`, Versand im Browser `meisterwerk/src/scripts/senden.ts`, Tabelle `meisterwerk/functions/schema.sql`.
Die Namen unten sind genau die, die der Code erwartet. Prüfen vorher: `cd meisterwerk && npm run test:functions` (22 Prüfungen, kein Konto nötig).
1. **Pages-Projekt** `meisterwerk`: mit GitHub `dmldigital/aa` verbinden, Produktions-Branch `claude/poolbau-koch-website-408frj`,
   Root-Verzeichnis `meisterwerk`, Build `npm ci && npm run build`, Ausgabe `dist`, Node 22. Der Ordner `meisterwerk/functions/` wird
   automatisch als Pages Functions erkannt. Build-Variablen (Produktion): `SITE_URL=https://meisterwerk-lb.de`, `BASE_PATH` leer,
   `PUBLIC_INDEXABLE` erst beim Livegang auf `true`.
2. **Turnstile**: Widget „Meisterwerk Formulare“, Modus **Managed**, Hostnamen `meisterwerk-lb.de`, `www.meisterwerk-lb.de`
   und `meisterwerk.pages.dev`. Der **Site-Key** kommt als **Build-Variable** `PUBLIC_TURNSTILE_SITE_KEY` ins Pages-Projekt (er wird beim Bauen
   in die Seite eingesetzt, danach neu bauen), der **Secret-Key** als **Secret** `TURNSTILE_SECRET`.
   Ohne Site-Key läuft jedes Formular im **Testmodus**: Es meldet „Vorschau, nicht gesendet“ und verschickt nichts (so ist es auf GitHub Pages).
3. **D1**: Datenbank `meisterwerk` anlegen, Tabelle erzeugen und als Binding **`DB`** verbinden:
   ```bash
   npx wrangler d1 create meisterwerk
   ```
   ```bash
   cd meisterwerk && npx wrangler d1 execute meisterwerk --remote --file=functions/schema.sql
   ```
4. **R2**: Bucket `meisterwerk-anfragen` (privat), Binding **`UPLOADS`**. Jedes Bild liegt dort unter `<Vorgang>/<nr>-<name>.jpg`.
   Bilder werden im Browser vor dem Senden auf höchstens 2000 px verkleinert. Bis 25 MB zusammen hängen sie an der Mail an den Betrieb,
   darüber steht in der Mail nur der Hinweis auf die Ablage.
5. **Resend** (resend.com, kostenlos bis 3.000 Mails im Monat): Domain `meisterwerk-lb.de` hinzufügen. Resend zeigt die nötigen Einträge an
   (in der Regel DKIM `resend._domainkey` sowie MX und SPF auf der Unterdomain `send`). **Diese Einträge berühren die Microsoft-Einträge
   auf `@` nicht** und werden in Cloudflare zusätzlich angelegt, alle **Nur DNS**. Verlangt Resend wider Erwarten einen SPF auf `@`,
   wird **kein zweiter** SPF angelegt, sondern der vorhandene ergänzt (ein Eintrag, beide `include:`). Danach in Resend „Verify“.
   API-Key erzeugen und im Pages-Projekt als **Secret** `RESEND_API_KEY` hinterlegen.
   Weitere Variablen: `MAIL_FROM` = `Meisterwerk Malermanufaktur <formular@meisterwerk-lb.de>`, `MAIL_TEAM` = `info@meisterwerk-lb.de`.
   Der Absender `formular@` braucht kein Postfach bei Microsoft.
6. **Formular-Mails testen**, sobald Variablen und Bindings gesetzt sind (Pages-Projekt neu bereitstellen): Anfrage über
   `meisterwerk.pages.dev/kontakt/` absenden. Es kommen zwei Mails: an `info@` (Antworten gehen an den Kunden, Bilder im Anhang) und die
   Bestätigung an den Kunden. Die Mail an `info@` darf in Outlook nicht im Junk landen. In den Nachrichtenkopfzeilen müssen `dkim=pass` mit
   `d=meisterwerk-lb.de` und `dmarc=pass` stehen. Landet sie im Junk: nicht den Absender pauschal freigeben, sondern erst DKIM und DMARC prüfen.
   Danach in der Cloudflare-D1-Tabelle `anfragen` nachsehen, dass der Vorgang gespeichert wurde.
7. **Datenschutzerklärung**: Muss vor dem Livegang um Cloudflare (Hosting, Turnstile), Resend (Mail-Versand) und die Speicherung der
   Formular-Anfragen ergänzt werden. Die Formulare verlinken bereits auf `/datenschutzerklaerung/`.

### Phase 4: Livegang der Website (eigener Termin, Nutzer bestätigt)
1. Pages-Projekt → Benutzerdefinierte Domains → `meisterwerk-lb.de` und `www.meisterwerk-lb.de` hinzufügen. Cloudflare ersetzt dabei
   die A- und CNAME-Einträge für `@` und `www` (WordPress ist dann nicht mehr erreichbar). Mail-Einträge bleiben unverändert.
2. `PUBLIC_INDEXABLE=true` setzen und neu bauen. Prüfen: `python3 meisterwerk/tools/seo-check.py <dist> --indexable`.
3. Weiterleitungen der alten WordPress-Adressen liegen in `meisterwerk/public/_redirects` und greifen automatisch.
4. WordPress-Formulare sind ab jetzt aus. Vor diesem Schritt einmal in Elementor → Übermittlungen nachsehen, dass keine offene Anfrage verloren geht.
   Die Bestätigungsmail an Kunden verlinkt auf die Terminbuchung `https://cal.com/meisterwerk`, dieser Link bleibt unverändert.
5. WordPress bei IONOS noch einige Wochen als Sicherung behalten, erst danach kündigen.

## Auftrag für die lokale Sitzung (zum Hineinkopieren)
```text
Du arbeitest im Repo dmldigital/aa. Lies zuerst docs/cloudflare-umzug-meisterwerk.md vollständig und halte dich genau daran.
Ziel heute: Phase 0 und Phase 1, danach anhalten. Phase 2 (Nameserver bei IONOS) und Phase 4 (Livegang) machst du nicht ohne
meine ausdrückliche Freigabe im Chat. Phase 3 nur, soweit ich es dir sage.

Wichtig: Die E-Mail von meisterwerk-lb.de läuft über Microsoft 365 und darf nicht ausfallen.
- Lege in Cloudflare die Zone meisterwerk-lb.de an (Free), ändere aber nichts bei IONOS.
- Übernimm alle DNS-Einträge 1:1 aus der IONOS-Zone (ein Microsoft-Login ist nicht nötig, die Mail-Einträge stehen bei IONOS).
  Ich gebe dir die IONOS-Liste, falls du sie nicht selbst lesen kannst. Mail-Einträge und alle TXT immer "Nur DNS". @ und www vorerst mit den alten IONOS-Werten, "Nur DNS".
- Lass meisterwerk/tools/dns-vergleich.sh mit einem IONOS- und einem Cloudflare-Nameserver laufen und zeig mir das Ergebnis.
- Prüfe, ob DNSSEC bei IONOS aktiv ist, und sag es mir.
- Lösche nichts bei IONOS. Proxy (orange Wolke) nur für Web-Einträge und erst beim Livegang.
Zum Schluss: kurze Liste, welche Einträge du angelegt hast, das Ergebnis des Vergleichs und die beiden Cloudflare-Nameserver.
```
