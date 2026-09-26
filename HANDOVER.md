# Übergabe – Poolbau Koch Website (Stand 26.09.2026)

Kurzfassung für die nächste Sitzung. Arbeitsregeln und festgelegte Entscheidungen stehen in `CLAUDE.md` – **zuerst lesen**.

## Wo alles liegt

| Was | Wo |
|---|---|
| Repo / Branch | `dmldigital/aa`, Branch `claude/poolbau-koch-website-408frj` (= Standard-Branch) |
| Live-Vorschau | https://dmldigital.github.io/aa/ – jeder Push auf `website/**` deployt automatisch (`.github/workflows/deploy-website.yml`, ca. 1 Min.) |
| Website (Astro 7) | `website/` – `npm ci && npm run build`; lokal `npx astro preview --port 4321` |
| Design-Vorlage | `design-system/design.md` + Screenshots (Space Kit, spacekit-template.webflow.io) |
| Inhalte alte Website | `analyse/inhalte.md`, `analyse/bilder.md` (Haiku-Auszug, teils gekürzt – Originaltexte bei Bedarf direkt von poolbau-kochgmbh.de holen) |
| Logo als SVG | `brand/` (hell, dunkel, Bildmarke + Differenzbild) – **noch nicht eingebaut**, Header nutzt `website/public/brand/logo-temp.png` |
| Animations-Referenzen | `website/ANIMATIONEN.md` |
| Köpfer-Video (Quelle) | `medien/koepfer/koepfer-v1.mp4` (2560×1440, 24 fps, 8 s) + Start-/Endbilder |
| Originalfotos alte Seite | `medien/poolbau-bilder-original/` |

## Aktueller Stand der Startseite (`website/src/pages/index.astro`)

1. **Header** (`components/Header.astro`) – 1:1 Space Kit (Glas-Leiste, Lade-Animation, Mobile-Menü gleitet 0,4 s von oben). Abweichungen auf Nutzerwunsch: smart sticky (runter = weg, hoch = da), Radius 8px (auch Mobile-Menü), ganz leichter Schatten. Button „Beratung anfragen“ = runder Pill-Button dunkelblau.
2. **Hero** (`components/Hero.astro`) – Space-Kit-Aufbau (Pill mit Preis „Komplettpaket ab 22.700 € zzgl. Erdarbeiten“, Headline „Ihr Traumpool. Fertig in 48 Stunden.“, Wellen-Kreis mit Umlauftext; Hotspots auf Wunsch entfernt).
   - Hintergrund = **Köpfer-Video als Bildfolge**: 96 Einzelbilder in `website/public/koepfer/d/` (1920×1080) und `m/` (720×1280, Hochformat), per Canvas gezeichnet. Beim ersten Scrollen läuft es von selbst in 3,2 s bis unter Wasser durch (Seite steht so lange), Text/Buttons blenden aus; zurück ganz oben läuft es genauso rückwärts. Am Ende der Fahrt scrollt die Seite automatisch zu Sektion 2 (Lenis `scrollTo`, `window.lenis`). Im Ruhezustand oben steht das Standbild (Wasser-Animation auf Nutzerwunsch wieder entfernt; der Higgsfield-Wasserclip mit fester Kamera liegt noch als Quelle in `medien/koepfer/wasser-loop.mp4`).
   - Drei runde Buttons (Dunkelblau/Türkis/Grau) in `components/ButtonGroup.astro`: Ruhezustand gestapelt, Hover fächert auf (21st.dev bundled/10); Handy: senkrecht gestapelt, Antippen fächert nach unten auf. Hinweis-Animation im Ruhezustand (`translate`, stoppt bei Hover/Antippen): weich hinaus und zurück (14/28 px, Handy 8/16 px nach unten), erstes Mal ab 1,3 s, hinterer Button 0,35 s versetzt, danach alle 4,5 s.
3. **Sektion 2** (`components/BentoSection.astro`) – Space-Kit-Bento: Laufband, Überschrift, 2 Reihen (Text-Feld 35 % + Bild 65 %, Reihe 2 gespiegelt). Bild-Animation: Fläche wächst aus der Mitte, Ecken durchgehend 8 px, startet beim Hereinscrollen und läuft 1,4 s selbstständig; Text blendet gleichzeitig ein.
4. **Partner-Sektion** (`components/PartnerSection.astro`, `#partner`, zwischen Bento und Sektion 3; Nutzerwunsch, kein Space-Kit-Vorbild): Überschrift „Unsere Partner“ + Satz von der alten Seite, 5 Logos in einer Reihe (COMPASS, Waterrows, Mon de Pra, Leisure Pools, Böckenholt; `public/partner/`, Quellen in `medien/partner/`, weiße Hintergründe entfernt, Böckenholt dunkel eingefärbt). Logos grau, beim Scrollen läuft eine farbige Welle von links nach rechts durch (zweite farbige Reihe mit Verlaufsmaske, scroll-gekoppelt). Hover kehrt den Zustand um: graues Logo wird farbig, gerade farbiges (in der Welle) wird grau.
5. **Sektion 3** (`components/StickySection.astro`, `#pools`) – 1:1 Space Kit „Mindful Living“-Sektion: links Bild sticky (50 %, 90vh, top 5vh), rechts scrollen großes Bild, Textblock „Pools für Jahrzehnte“ (Marken, bis 40 J. Garantie), zwei gleich hohe Bilder nebeneinander (4:5), Textblock „Technik, die mitdenkt“ (Technikbox, Salz/Chlor), breites flaches Bild (16:7) – Bildanordnung auf Nutzerwunsch statt Original (klein/mittel/klein). Das linke Bild bleibt nur stehen, bis der zweite Textblock oben bündig mit ihm ist; danach scrollt alles normal (Höhe der linken Spalte per Script). Scroll-Animation (Nutzerwunsch): linkes und erstes rechtes Bild ziehen sich beim Hereinscrollen von unten nach oben auf (clip-path, Bild skaliert 1,15 → 1 von unten); ab dem Stopp-Punkt zieht sich das breite Bild nach oben ein, ab Höhe der Unterkante des linken Bildes zieht sich das linke mit ein (nur Desktop). Ecken dabei durchgehend 8 px, am Bildschirmrand eckig. Parallax wie Original: Bild 110 % hoch, 0 → −10 % linear während der Rahmen durchs Fenster läuft. Handy (≤767): untereinander, links-Bild nicht sticky (50vh). Bilder aus `medien/poolbau-bilder-original/` (in `src/assets/img/`).
6. **Sektion „Warum Poolbau Koch?“** (`components/LeistungenSection.astro`, `#leistungen`) – Scroll-Bento nach 21st.dev `bundled/1849` (Nutzerwunsch): Strecke 350vh, Bühne sticky; 6 Bildboxen mit Titel + Text (große Box der Vorlage geteilt): Poolbau ohne Beton, Poolbecken nach Maß, Wasseraufbereitung, Bis zu 40 J. Garantie, Rückbaubar, Beratung vor Ort. Start: Boxen 50 % + 35 % nach links, Mitteltext („Über 30 Jahre Erfahrung im Poolbau“ + 2 Pill-Buttons); beim Scrollen wachsen die Boxen linear ins Raster (fertig bei 90 %), Mitteltext schrumpft/verblasst in der ersten Hälfte. Handy: 2 × 3 Raster, Mitteltext auf heller Fläche. Angebote auf Nutzerwunsch weggelassen.
7. **FAQ** (`components/FaqSection.astro`, `#faq`) – 1:1 Space Kit: „Häufige Fragen“, 6 Fragen (Kosten ab 22.700 € zzgl. Erdarbeiten, 48 h, ohne Beton/rückbaubar, Salz oder Chlor, Garantie bis 40 J., Baugenehmigung). Hereinscrollen: Überschrift/Fragen gleiten 100px hoch (~1 s); Hover weiß; Klick klappt in 0,5 s auf (Antwort rutscht von −2rem nach, Pfeil dreht), mehrere gleichzeitig offen.
8. **Footer** (`components/Footer.astro`) – 1:1 Space Kit: Logo, 4 Spalten (Entdecken, Service, Kontakt, Online), 4 runde Icons (Telefon, E-Mail, Route, Konfigurator; Hover dunkelblau), Linkzeile Impressum | Datenschutz (vorerst auf die alte Seite) | Nach oben, Firmenzeile mit Adresse und Öffnungszeiten. Teile gleiten beim Hereinscrollen ein.
- Weiches Scrollen: **Lenis** (`layouts/Base.astro`).
- Schriften: Satoshi lokal (`src/assets/fonts/`), Farben/Tokens in `src/styles/global.css`.

## Offene Punkte / nächste Schritte

1. **Offen auf der Startseite:** Kontakt-Sektion mit Formular (Ziel für `#beratung`, Formular braucht Dienst wie Formspree o. ä., GitHub Pages kann nicht senden). Angebote/Komplettpakete vom Nutzer vorerst weggelassen – `#pakete` hat noch kein Ziel. Impressum/Datenschutz verlinken vorerst auf poolbau-kochgmbh.de. – jeweils Original vermessen, 1:1 nachbauen, nur Texte/Bilder/Farben tauschen.
2. **Logo-SVG einbauen** (`brand/poolbau-koch-logo-dunkel.svg` in Header; hell-Variante für dunkle Flächen) – Messwerte in `brand/README.md` prüfen.
3. **Sitemap** noch nicht als Dokument angelegt (Vorschlag aus der Sitzung: Start, Pools (je Marke), Komplettpakete, Poolbau ohne Beton, Technik & Wasserpflege, Wasseraufbereitung, Projekte, Über uns, Ratgeber/FAQ, Kataloge, Kontakt, Impressum, Datenschutz; extern: Konfigurator, Shop).
4. **Unterseiten-Links** im Menü führen noch ins Leere (`/pools/` usw.), `#beratung`/`#pakete` haben noch keine Ziel-Sektion.
5. Köpfer-Video: Desktop-Bildsatz 10,9 MB, Handy 5,1 MB – ggf. weiter optimieren (AVIF, weniger Bilder). Tonspur wird nicht genutzt.
6. Rechtliches vor Livegang: Preisangaben, Garantie-Aussagen („bis zu 40 Jahre“ herstellerabhängig), Bildrechte (Fotos der alten Seite teils Herstellerfotos) mit dem Kunden klären.

## Werkzeuge / Zugänge

- **MCP**: Playwright + Chrome DevTools (`.mcp.json`, Wrapper in `.claude/mcp/`), 21st.dev (braucht `API_KEY_21ST`, noch nicht hinterlegt), **Higgsfield** (vom Nutzer verbunden; ca. 78 Credits übrig; MiniMax H3 2K mit Start-/Endbild = 16 Credits pro 8 s).
- Freigegebene Bash-Tools: `npx -y dembrandt@latest`, `npx skillui` (Design-Extraktion).
- Browser für Screenshots: Playwright global (`npm root -g`), Chromium `/opt/pw-browsers/chromium`, bei externen Seiten `proxy: { server: process.env.HTTPS_PROXY }`.
- ffmpeg: `pip install imageio-ffmpeg` (das Playwright-ffmpeg kann kein MP4).

## Was dem Nutzer wichtig ist (aus dieser Sitzung)

- Vorlage **1:1** umsetzen, nicht interpretieren; Abweichungen vorher nennen.
- Ergebnis **online** zeigen (GitHub Pages), keine langen Prüf-Schleifen vor dem Zeigen – lieber schnell deployen und nachbessern.
- Runde Pill-Buttons in Logofarben; Ecken der Bilder immer wie im Original (8 px).
- Kein selbstgebautes Ersatz-Tool, wenn es etablierte Lösungen gibt.
