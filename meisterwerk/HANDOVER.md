# Übergabe: Meisterwerk Malermanufaktur (Astro-Umzug)

Stand: 19.10.2026. Für eine neue Sitzung oder ein anderes Konto. Zuerst `../CLAUDE.md` lesen (Arbeitsregeln: Deutsch, tokensparsam, keine Nummerierung in Menüs; der Poolbau-Teil dort betrifft dieses Projekt nicht).

## Auftrag und Kunde

- Kunde: Meisterwerk Malermanufaktur, https://meisterwerk-lb.de (Freiberg a. N., Inhaber Baldassarre Fortino). Der Nutzer ist die Agentur.
- Angebot (999 € netto, 15 % Skonto bei Vorauszahlung oder 60/40): Astro-Umzug mit GSAP und Lenis, lokales SEO mit bis zu 20 Ortsseiten, Google-Ads-Einrichtung und -Betreuung. Texte: `../seo/angebot-meisterwerk-texte.md`, interaktive Fassung `../seo/meisterwerk-angebot.html` (auch als `website/public/angebot-meisterwerk/`, noindex), Konkurrenzanalyse `../seo/meisterwerk-lb-konkurrenzanalyse.md`.
- Nicht im Repo: Bankdaten und Kontonummer für das Angebot (neue Kontonummer ist offen), der Angebots- und Rechnungsgenerator des Nutzers (liegt nur auf dessen Rechner).
- Aufgabe dieses Ordners: die komplette WordPress-Seite als Astro + Tailwind + GSAP + Lenis nachbauen. Design nahezu pixelgenau, Animationen später eigene. Status: alle 51 Seiten gebaut.

## Stand

- 51 Seiten mit denselben Adressen wie im Original, inklusive Teil-Website `/meisterwerk-exklusive/` mit eigenem Kopf und Fuß.
- Alles Mehrfache ist nur einmal gebaut (`src/components/sections`, per Props und Daten).
- Inhalte: Content Collections `src/content/*` (Beiträge, Profile, Leistungen, Kollektionen, je Exklusiv-Variante), übrige Inhalte in `src/data`. Details im `README.md`.
- Pixelgleich geprüft: 153 Vollseiten-Screenshots (51 Seiten × 390/1024/1440) gegen die Version vor der Content-Collections-Umstellung, nur das bekannte Hero-Wort rauscht.
- Alle Seiten sind `noindex` (`PUBLIC_INDEXABLE` nicht `true`). Auf `meisterwerk-lb.de` läuft weiter WordPress. Die Astro-Seite ist nicht live.

## Branches und Vorschau

- Arbeitsbranch dieser Sitzung: `ccr-f2051171-tlg9yu` (enthält alles, inklusive Content Collections). Standard-Branch und Pages-Quelle: `claude/poolbau-koch-website-408frj`.
- Die Vorschau https://dmldigital.github.io/aa/meisterwerk-preview/ ist eine statische Kopie des Builds unter `website/public/meisterwerk-preview/` auf dem Standard-Branch. Der Stand dort ist älter (vor Exklusiv-Seiten und Content Collections), optisch aber derselbe Ansatz.
- Vorschau aktualisieren: `SITE_URL=https://dmldigital.github.io BASE_PATH=/aa/meisterwerk-preview/ npm run build`, `dist/` nach `website/public/meisterwerk-preview/` kopieren, nur unbenutzte `.webp` entfernen (Größe ca. 18 MB statt 134 MB), diesen Ordner per Commit auf den Standard-Branch legen (Push auf `website/**` deployt über `.github/workflows/deploy-website.yml`). Der Meisterwerk-Quellcode selbst liegt nur auf dem Arbeitsbranch.
- Ein anderes Konto braucht: GitHub-Zugriff auf `dmldigital/aa`, die verbundene Claude-GitHub-App, eigene Geheimnisse (z. B. `API_KEY_21ST`, nicht im Repo).

## Befehle

`npm ci`, `npm run dev`, `npm run build`, `npm run check` (muss 0 Fehler haben), `npm run format`. Bei neuen Klassen in neuen Dateien im Dev-Server einmal `touch src/styles/global.css`.

## Werkzeuge in `tools/`

Regressions- und Messskripte (Playwright, Pillow). Mehr in den Kopfkommentaren.

- `checkall.sh`: Build, Screenshots aller Seiten (`regall.js`, Seitenliste `pages.txt`, Preview-Server auf Port 4600 mit Basis `/aa/meisterwerk-preview/` nötig), Vergleich (`cmpall.py`) gegen `tools/shots/basis`. Die Baseline (153 PNGs) liegt nicht im Repo, vor einer Änderung aus dem aktuellen Stand erzeugen.
- `refcap.js <Pfad> <name>`: misst die Originalseite (Computed-Style-Baum je Sektion, Referenzbilder in 3 Breiten). `cmp.js` / `sbs.py`: Sektionsvergleich Original gegen Nachbau.
- `BRIEF-startseite.md`, `BRIEF-unterseiten.md`: Regeln, mit denen die Unterseiten (per Subagenten) gebaut wurden: Breakpoints (Basis Handy <768, `md` ≥768, `lg` ≥1025), Animations-Datenattribute, Tailwind-Regeln. Pfade darin sind Sitzungspfade, sinngemäß auf `tools/` übertragen.

## Wichtige Entscheidungen

- Tailwind-Tokens statt Pixelwerte, nur ganzzahlige Skalenwerte (`top-25.2` erzeugt kein CSS), wiederkehrende Werte in `@theme` (`src/styles/global.css`).
- Links nur über `href()` aus `src/data/links.ts`; `ASTRO_PAGES` listet die gebauten Pfade, der Rest zeigt auf das Original.
- Schrift Urbanist über die Astro Fonts API (Latin 400/500/600). Das Original lädt „DM Sans“ von einer toten Domain, sichtbar ist dort die Systemschrift (`font-body`).
- Bilder: `<Picture formats={['avif']} fallbackFormat="webp">`, leeres `alt` ist bewusst dekorativ.
- Tipp: Kein `pkill -f` per Muster im Befehl (beendet die eigene Shell); Astro 7 erlaubt nur einen Dev-Server pro Projekt.

## Offen (Entscheidung des Nutzers nötig)

- SEO (Sitemap, robots, Canonical, OG, h1, Meta, Alt-Texte, strukturierte Daten, Weiterleitungen alter Duplikate wie `/services/lackieren/`, `/spachteltechniken/`): nur auf ausdrücklichen Auftrag, nicht automatisch.
- Kontrast und Touch-Ziele: nicht anfassen. Neue Animationen und neuer Hero: später.
- Urlaubsservice Desktop: zweite Spalte „Warum unser Urlaubsservice?“ ist eine Änderung gegenüber dem doppelten Ablauf im Original.
- „Roma 01“ → „Roma 08“ im Original geändert; Jahr der Kernsanierung (2021) geraten.
- Beiträge bei Tablet/Handy nur teilweise gegen das Original abgeglichen; Reviews-Seite im Original leer.
- Kontaktformular: Absenden nicht angebunden (nur Meldung), Karte nur Platzhalter. Backend später (Cloudflare, Mails via Resend).
- Link `www.meisterwerke-exklusive.de` im FAQ-Text (Tippfehler im Original, tot); `© 2026 Meisterwerke` verlinkt auf `#`; Cookie-Banner fehlt.
- Livegang: DNS/Hosting, `PUBLIC_INDEXABLE=true`, Weiterleitungen, Ortsseiten, Google-Unternehmensprofil. Ads: Zugriff über Verwaltungskonto (MCC) oder Nutzereinladung im Kundenkonto, Google-Unternehmensprofil über Manager-Eintrag.
