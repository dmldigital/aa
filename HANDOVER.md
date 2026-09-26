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

1. **Header** (`components/Header.astro`) – 1:1 Space Kit (Glas-Leiste, Lade-Animation, Mobile-Menü gleitet 0,4 s von oben). Button „Beratung anfragen“ = runder Pill-Button dunkelblau.
2. **Hero** (`components/Hero.astro`) – Space-Kit-Aufbau (Pill mit Preis „Komplettpaket ab 22.700 € zzgl. Erdarbeiten“, Headline „Ihr Traumpool. Fertig in 48 Stunden.“, Wellen-Kreis mit Umlauftext; Hotspots auf Wunsch entfernt).
   - Hintergrund = **Köpfer-Video als Bildfolge**: 96 Einzelbilder in `website/public/koepfer/d/` (1920×1080) und `m/` (720×1280, Hochformat), per Canvas gezeichnet. Beim ersten Scrollen läuft es von selbst in 3,2 s bis unter Wasser durch (Seite steht so lange), Text/Buttons blenden aus; zurück ganz oben läuft es genauso rückwärts. Am Ende der Fahrt scrollt die Seite automatisch zu Sektion 2 (Lenis `scrollTo`, `window.lenis`). Im Ruhezustand oben bewegt sich nur das Wasser: eigener Higgsfield-Clip mit fester Kamera (`medien/koepfer/wasser-loop.mp4`, MiniMax H3 2K, Start- = Endbild = Bild 0, daher nahtlos), daraus 95 Pool-Ausschnitte mit weichem Rand in `website/public/koepfer/w/` (abgespielt mit 6 Bilder/s = halbe Geschwindigkeit, zwischen den Bildern weich überblendet; 3,6 MB; auf Bild 0 ausgerichtet), werden über Bild 0 gezeichnet. Skript dafür lag im Sitzungs-Scratchpad (ECC-Ausrichtung mit OpenCV + Maske = Pool-Polygon nach außen vergrößert (730,500)(1114,500)(1712,832)(102,832), weicher Rand liegt auf der Poolkante, Wasser voll abgedeckt; Ausschnitt x80–1740/y480–850 bei 1920×1080).
   - Drei runde Buttons (Dunkelblau/Türkis/Grau) in `components/ButtonGroup.astro`: Ruhezustand gestapelt, Hover fächert auf (21st.dev bundled/10); Handy: senkrecht gestapelt, Antippen fächert nach unten auf.
3. **Sektion 2** (`components/BentoSection.astro`) – Space-Kit-Bento: Laufband, Überschrift, 2 Reihen (Text-Feld 35 % + Bild 65 %, Reihe 2 gespiegelt). Bild-Animation: Fläche wächst aus der Mitte, Ecken durchgehend 8 px, startet beim Hereinscrollen und läuft 1,4 s selbstständig; Text blendet gleichzeitig ein.
4. Darunter Platzhalter „Weitere Sektionen folgen.“
- Weiches Scrollen: **Lenis** (`layouts/Base.astro`).
- Schriften: Satoshi lokal (`src/assets/fonts/`), Farben/Tokens in `src/styles/global.css`.

## Offene Punkte / nächste Schritte

1. **Weitere Sektionen** nach Space-Kit-Vorlage (nächste: Sektion 3 „Mindful Living …“-Stil, Produkte/Pools, FAQ, Footer) – jeweils Original vermessen, 1:1 nachbauen, nur Texte/Bilder/Farben tauschen.
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
