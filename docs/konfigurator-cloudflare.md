# Pool-Konfigurator auf Cloudflare einrichten

Der Konfigurator (`/konfigurator/`) ist eine normale Seite der Astro-Website. Der Versand läuft über eine
**Cloudflare Pages Function** (`website/functions/api/konfiguration.ts`). Auf GitHub Pages gibt es diese Funktion
nicht – dort läuft der Konfigurator im **Testmodus** (Erfolgsseite + PDF-Vorschau im Browser, kein Versand).

## 1. Pages-Projekt
- Cloudflare Dashboard → Workers & Pages → Pages-Projekt mit dem GitHub-Repo verbinden.
- Root-Verzeichnis: `website`, Build-Befehl: `npm run build`, Ausgabe: `dist`.
- Umgebungsvariable `SITE_URL` = echte Domain (z. B. `https://poolbau-kochgmbh.de`), `BASE_PATH` leer lassen.
- Der Ordner `website/functions/` wird automatisch als Pages Functions erkannt.

## 2. Datenbank (D1, kostenlos) – optional, empfohlen
```
npx wrangler d1 create poolbau-koch
npx wrangler d1 execute poolbau-koch --remote --file=docs/konfigurator-schema.sql
```
Im Pages-Projekt → Einstellungen → Bindings: D1-Datenbank mit Variablenname **`DB`** verbinden.

## 3. PDF-Ablage (R2, kostenlos bis 10 GB) – optional
R2-Bucket anlegen (z. B. `konfigurator-pdfs`) und im Pages-Projekt als Binding **`PDFS`** verbinden.

## 4. E-Mail-Versand (Resend, kostenlos bis 3.000 Mails/Monat)
Cloudflare selbst schickt nur an bestätigte eigene Adressen – für Mails an Kunden braucht es einen Mail-Dienst.
1. Konto bei resend.com anlegen, Domain `poolbau-kochgmbh.de` hinzufügen und die angezeigten DNS-Einträge bei
   Cloudflare DNS eintragen (SPF/DKIM).
2. API-Key erzeugen.
3. Im Pages-Projekt → Einstellungen → Variablen:
   - `RESEND_API_KEY` (als **Secret**)
   - `MAIL_FROM` = `Poolbau Koch <konfigurator@poolbau-kochgmbh.de>`
   - `MAIL_TEAM` = `info@poolbau-kochgmbh.de`

Ohne `RESEND_API_KEY` speichert die Funktion nur (D1/R2) und antwortet trotzdem mit Erfolg.

## Ablauf pro Anfrage
1. Auswahl wird gegen den Katalog geprüft (`src/konfigurator/summary.ts`), Kontaktdaten validiert, Honeypot gegen Bots.
2. PDF wird erzeugt (`src/konfigurator/pdf.ts`, Beckenbild aus `public/konfig/pdf/<becken>.jpg`).
3. Speichern in D1 (`anfragen`) und R2 (`<ref>.pdf`), falls verbunden.
4. Mail an den Kunden (PDF im Anhang) und an Poolbau Koch (PDF + Kontaktdaten, Antworten gehen an den Kunden).

## Katalog pflegen
Katalogdaten: `website/src/konfigurator/katalog.json` (3 Hersteller, 78 Becken, 22 Farben, 16 Ausstattungen),
Bilder: `website/public/konfig/img/`. Übernommen aus dem alten Konfigurator (Snapshot in `medien/konfigurator/`).
Später möglich: Katalog in D1 + kleine Admin-Seite.
