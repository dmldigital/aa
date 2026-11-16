# Meisterwerk: Paket für die lokale Cloudflare-Sitzung

Stand 16.11.2026. In diesem Paket steckt alles, was eine lokale Claude-Code-Sitzung mit Cloudflare-Zugriff braucht, um die neue
Meisterwerk-Website einzurichten und die Domain `meisterwerk-lb.de` von IONOS nach Cloudflare umzuziehen.

## Was drin ist
| Pfad | Inhalt |
|---|---|
| `meisterwerk/` | Die komplette Website (Astro 7, Tailwind 4, GSAP, Lenis), Quellcode, Bilder, Formular-Funktion, Werkzeuge |
| `meisterwerk/functions/api/anfrage.ts` | Cloudflare Pages Function für die Formulare (Turnstile, Resend, D1, R2) |
| `meisterwerk/functions/schema.sql` | Tabelle für die Anfragen (D1) |
| `meisterwerk/tools/dns-vergleich.sh` | Vergleicht die DNS-Antworten von IONOS und Cloudflare, Eintrag für Eintrag |
| `meisterwerk/tools/test-anfrage.mjs` | Test der Formular-Funktion ohne Konto (`npm run test:functions`) |
| `docs/cloudflare-umzug-meisterwerk.md` | **Die Anleitung** in Phasen (Bestand sichern, Zone vorbereiten, Nameserver, Dienste, Livegang) |
| `docs/dns-eintraege-ionos.md` | Vorlage für die DNS-Einträge von IONOS (wird aus den Fotos befüllt) |
| `CLAUDE.md` | Arbeitsregeln des Projekts (Texte, SEO, Tailwind) |

## Rahmenbedingungen
- Domain bleibt bei **IONOS** registriert, die Nameserver zeigen später auf **Cloudflare**.
- Die Website läuft komplett auf **Cloudflare Pages**.
- Die **E-Mail läuft über Microsoft** und darf nicht ausfallen: DNS-Einträge 1:1 übernehmen, alle Mail-Einträge auf „Nur DNS“.
- Formulare: **Turnstile** (Spam-Schutz), **Resend** (Mail-Versand), **D1** (Anfragen), **R2** (Bilder).
- Bestätigungsmail an Kunden kommt von `formular@meisterwerk-lb.de`, Antworten darauf gehen an `info@meisterwerk-lb.de`.

## So geht es los
1. Das Paket entpacken und in dem Ordner eine lokale Claude-Code-Sitzung starten (Cloudflare-Zugriff vorhanden).
   Alternativ das Repository klonen: `https://github.com/dmldigital/aa`, Branch `claude/poolbau-koch-website-408frj`.
2. Die DNS-Einträge von IONOS stehen schon in `docs/dns-eintraege-ionos.md` (16 Einträge aus dem Screenshot). Vier Werte darin sind
   abgeschnitten und müssen vor dem Anlegen vollständig abgelesen werden (siehe Datei, oberster Abschnitt).
3. Den **Auftrag** unten in die lokale Sitzung kopieren.

## Auftrag für die lokale Sitzung (zum Hineinkopieren)
```text
Lies docs/cloudflare-umzug-meisterwerk.md und docs/cloudflare-start-hier.md vollständig und halte dich genau daran.
Ziel heute: Phase 0 und Phase 1, danach anhalten. Phase 2 (Nameserver bei IONOS) und Phase 4 (Livegang) machst du nicht ohne
meine ausdrückliche Freigabe im Chat. Phase 3 nur, soweit ich es dir sage.

Wichtig: Die E-Mail von meisterwerk-lb.de läuft über Microsoft 365 und darf nicht ausfallen.
- Hol dir die fehlenden Angaben aus der IONOS-Oberfläche mit Claude in Chrome. Ich bin dort in meinem Chrome schon angemeldet, ändere nichts
  und gib kein Passwort aus. Nur lesen: Bei jedem der 16 Einträge in docs/dns-eintraege-ionos.md den Stift-Dialog öffnen und den ganzen Wert,
  die Priorität (MX, SRV) und die TTL eintragen, dann den Dialog ohne Speichern schließen. Außerdem die Nameserver der Domain und den
  DNSSEC-Status ablesen. Trage alles in die Datei ein und zeig mir die fertige Tabelle, bevor du Cloudflare anlegst.
- Lege in Cloudflare die Zone meisterwerk-lb.de an (Free), ändere aber nichts bei IONOS.
- Übernimm alle DNS-Einträge 1:1 aus docs/dns-eintraege-ionos.md (die Liste der IONOS-Zone). Ein Microsoft-Login ist nicht nötig.
  Mail-Einträge (MX, alle TXT, autodiscover, DKIM-CNAMEs) immer "Nur DNS". @ und www vorerst mit den alten IONOS-Werten, "Nur DNS".
- Lass meisterwerk/tools/dns-vergleich.sh mit einem IONOS- und einem Cloudflare-Nameserver laufen und zeig mir das Ergebnis.
  Erst bei 0 Abweichungen ist Phase 1 fertig.
- Prüfe, ob DNSSEC bei IONOS aktiv ist, und sag es mir.
- Lösche nichts bei IONOS. Proxy (orange Wolke) nur für Web-Einträge und erst beim Livegang.
Zum Schluss: kurze Liste, welche Einträge du angelegt hast, das Ergebnis des Vergleichs und die beiden Cloudflare-Nameserver.
```

## Spätere Schritte (erst nach Freigabe)
- **Phase 2:** Nameserver bei IONOS auf Cloudflare stellen (macht der Kunde oder Dennis in der IONOS-Oberfläche).
- **Phase 3:** Pages-Projekt, Turnstile, D1, R2, Resend einrichten. Variablen und Namen stehen in der Anleitung.
- **Phase 4:** Livegang der Website auf `meisterwerk-lb.de`, `PUBLIC_INDEXABLE=true`, SEO-Prüfung mit `python3 meisterwerk/tools/seo-check.py <dist> --indexable`.

## Was noch offen ist
- Datenschutzerklärung um Cloudflare, Resend und die Speicherung der Anfragen ergänzen.
- Echter Versandtest der Formular-Mails (Zustellung in Outlook prüfen, Kopfzeilen `dkim=pass`, `dmarc=pass`).
- Vom Kunden: Öffnungszeiten (`meisterwerk/src/data/site.ts`, `openingHours`), echte WhatsApp-Nummer, Ortsseiten.
- Das Exklusive-Formular hatte im alten WordPress eine kleine Preisberechnung, sie ist nicht nachgebaut.
