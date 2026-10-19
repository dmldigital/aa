# Übergabe: Meisterwerk Malermanufaktur (Astro-Umzug)

Stand: 19.10.2026 (nach dem Umbau von Header, Menü, Hero und Willkommen-Szene). Für eine neue Sitzung oder ein anderes Konto. Zuerst `../CLAUDE.md` lesen (Arbeitsregeln: Deutsch, tokensparsam, keine Nummerierung in Menüs; der Poolbau-Teil dort betrifft dieses Projekt nicht).

## Auftrag und Kunde

- Kunde: Meisterwerk Malermanufaktur, https://meisterwerk-lb.de (Freiberg a. N., Inhaber Baldassarre Fortino). Der Nutzer ist die Agentur.
- Angebot (999 € netto, 15 % Skonto bei Vorauszahlung oder 60/40): Astro-Umzug mit GSAP und Lenis, lokales SEO mit bis zu 20 Ortsseiten, Google-Ads-Einrichtung und -Betreuung. Texte: `../seo/angebot-meisterwerk-texte.md`, interaktive Fassung `../seo/meisterwerk-angebot.html` (auch als `website/public/angebot-meisterwerk/`, noindex), Konkurrenzanalyse `../seo/meisterwerk-lb-konkurrenzanalyse.md`.
- Nicht im Repo: Bankdaten und Kontonummer für das Angebot (neue Kontonummer ist offen), der Angebots- und Rechnungsgenerator des Nutzers (liegt nur auf dessen Rechner).
- Aufgabe dieses Ordners: die komplette WordPress-Seite als Astro + Tailwind + GSAP + Lenis nachbauen. Design nahezu pixelgenau, Animationen später eigene. Status: alle 51 Seiten gebaut.

## Stand

- 51 Seiten mit denselben Adressen wie im Original, inklusive Teil-Website `/meisterwerk-exklusive/` mit eigenem Kopf und Fuß.
- Alles Mehrfache ist nur einmal gebaut (`src/components/sections`, per Props und Daten).
- Inhalte: Content Collections `src/content/*` (Beiträge, Profile, Leistungen, Kollektionen, je Exklusiv-Variante), übrige Inhalte in `src/data`. Details im `README.md`.
- Alle Seiten sind `noindex` (`PUBLIC_INDEXABLE` nicht `true`). Auf `meisterwerk-lb.de` läuft weiter WordPress. Die Astro-Seite ist nicht live.

### Neu gestaltet (auf Wunsch des Nutzers, Vorlage: Referenzseite „Kaisergärten“ auf kaiser.d-lesmeister.workers.dev, im Meisterwerk-Design)

- **Header** (`Header.astro`, `SmartHeader.astro`, `header/*`): Logo links, rechts MENÜ vor dem Button „KONTAKT AUFNEHMEN“. Smart Sticky: erscheint beim Hochscrollen, verschwindet beim Runterscrollen. Auf der Startseite liegt er auf der Hero-Fläche (Variante `hero`).
- **Menü** (`sections/Menu.astro`, `menu/V2`, `menu/V3`, `menu/KontaktPanel`): Tablet/Desktop (ab 701 px) geteiltes Vollbild mit feiner Mittellinie, links die Punkte, rechts Kontakt mit Kurzformular (Absenden noch nicht angebunden) und nur bei Punkten mit Untermenü (Leistungen) eine Überblendung zur Unterliste, nur Deckkraft, keine Bewegung. Handy (bis 700 px): Seitenfläche von rechts. Keine Pfeile, keine Nummerierung.
- **Hero** (`Hero.astro`): Desktop: helle Fläche links, Bilderstreifen oben links läuft durch (mit Wörtern Streichen, Lackieren, Tapezieren, Glatte Oberflächen darunter, das große Bild rechts wechselt mit), danach schiebt sich der Text weg, Bild wächst auf Vollbild mit Rand. Handy: am Anfang nur die Fläche mit Streifen, nach dem Durchlauf fährt das Bild von unten herein. Zustände über Tailwind-Varianten `hero-d`/`hero-m` (`global.css`). Offen: weißer 20-%-Streifen am Ende auf dem Handy (aus der Vorlage).
- **Willkommen-Szene** (`WelcomeScroll.astro`, nur Startseite): Desktop: Text steht (sticky), drei Bilder laufen links hoch, zuletzt gleitet die Überschrift „Ihr Partner für exklusive Malerleistungen …“ unter dem Text herein. Handy/Tablet: Pin, oben bleibt das Textende, unten schieben sich die Bilder von rechts herein. H2 und Text lokal SEO-optimiert (Freiberg a. N., Ludwigsburg, Marbach, Bietigheim-Bissingen) mit internen Textlinks (in `pages/index.astro`).
- **Footer** (`Footer.astro`, `footer/*`): kompakt, Desktop vier Spalten (Exklusive-Logo in der letzten Spalte), Handy eine Spalte; die untere Leiste blendet nach den Spalten ein. Der schwebende Link „Projekt starten“ erscheint auf der Startseite erst nach dem Hero.
- Pixelvergleiche gegen die Version vor diesen Umbauten gelten nicht mehr (`tools/checkall.sh`, Baseline neu anlegen).

## Zweiter Stand: Auswahl-Vorschau mit weiteren Sektionen (andere Sitzung)

- Eine zweite Sitzung hat unter `website/public/meisterwerk-preview-auswahl/` weitergebaut, direkt in den gebauten Dateien (kein Astro-Quellcode). Neu dort: Willkommens-Sektion mit Ketten-Animation und Zoom, Leistungen als gestapelte Karten mit lokalen SEO-Texten, „Meisterliche Malerarbeiten“ mit gepinnten Tabs, „Jede Oberfläche ist einzigartig“ (Parallax, Pin, CTA-Box, Kontaktformular-Box), FAQ als Tabs über den Projekten, Header-Sperre in Pin-Sektionen.
- Beschreibung, Dateiübersicht, Stolpersteine und Tests: `../docs/meisterwerk-auswahl.md` und `../tools/meisterwerk-auswahl/`.
- Noch NICHT im Quellcode (`meisterwerk/src`). Plan: erst nach Abnahme durch den Nutzer Sektion für Sektion zurückübertragen (mechanische Umsetzung per Subagent, Prüfung mit den Playwright-Tests dort). Bis dahin das Deploy-Skript nicht auf `meisterwerk-preview-auswahl` ausführen (überschreibt deren Stand).

## Branches und Vorschau

- Arbeitsbranch dieser Sitzung: `ccr-f2051171-tlg9yu` (enthält alles, alles gepusht). Standard-Branch und Pages-Quelle: `claude/poolbau-koch-website-408frj`.
- **Vorschau-Regel des Nutzers:** Die Hauptvorschau `meisterwerk-preview` nicht überschreiben und nicht die ganze Seite bauen. Vorschauen kommen in `https://dmldigital.github.io/aa/meisterwerk-preview-auswahl/` mit nur den betroffenen Seiten: `meisterwerk/tools/deploy-preview.sh "Commit-Text" / /leistungen/` (Seitenpfade anhängen). Das Skript baut mit passender Basis, kopiert nur diese Seiten samt Bildern und legt den Ordner per temporärem Worktree auf den Pages-Branch. Die ganze Seite in die Hauptvorschau nur auf ausdrücklichen Wunsch (`--voll`). Die Vorschau wird später gelöscht.
- Der Meisterwerk-Quellcode liegt nur auf dem Arbeitsbranch, die Vorschau-Ordner nur auf dem Pages-Branch.
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
