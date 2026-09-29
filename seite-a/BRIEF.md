# Seite A – Manfred Weber, freie Neugestaltung

**Herkunft:** lokaler Ordner `C:\Users\denni\Desktop\mw-bauen-v2-frei` (lief auf Port 4342). Kopie ohne `node_modules`, `dist`, `.astro`, `.wrangler` und ohne den Ordner `media-src/` (Originalvideos 467 MB + Original-Team-PNGs 27 MB, siehe unten).

## Firma und Zweck
Manfred Weber GmbH & Co. KG, Bauunternehmen aus 67273 Weisenheim am Berg (Region Rhein-Neckar & Pfalz): Hochbau, Tiefbau, Sanierungsbau, Umbau & Renovierung, Gewerbe- & Hallenbau. Einseitige Startseite mit dem Ziel „Angebot anfragen“ (Telefon 0 63 53 / 80 60, info@mw-bauen.de).
Diese Fassung ist eine **freie Neugestaltung** der bestehenden Seite (Seite B): gleiche Farben, Logo, Texte, Bilder und Videos, neuer Aufbau und neue Animationen.

## Stack, Start, Port
- Astro 4.16 (statisch), `@astrojs/tailwind` / Tailwind 3 installiert, aber **nicht mehr benutzt** (eigenes CSS in `src/styles/`).
- GSAP 3.15 (ScrollTrigger, SplitText, Observer), Lenis 1.3.26.
- Start: `npm install`, dann `npm run dev` (Skript startet auf Port 4321 mit `--host`). Lokal lief es mit `npx astro dev --port 4342`.
- Build: `npm run build` → `dist/`. `wrangler.jsonc` zeigt auf den Cloudflare Worker **`mw-bauen`** – das ist derselbe Name wie bei der Live-/Originalseite. Ein `wrangler deploy` aus diesem Ordner würde die bestehende Seite überschreiben.

## Seitenaufbau (Reihenfolge)
1. Header (fix, transparent über dem Hero, danach Anthrazit mit Blur; blendet beim Runterscrollen aus) + Handy-Menü als Vollbild-Sheet
2. Hero `#start` – „Träume verwirklichen, Werte schaffen.“ + Drohnenvideo DJI_0144
3. Laufband mit Werten (zwei Bänder)
4. Über uns `#ueber-uns` – Zähler 25+, Statement, „Unser Bestreben“, Video DJI_0165 + rote Zitat-Box
5. Leistungen `#leistungen` – 4 Leistungen
6. Impressionen `#impressionen` – Standbilder aus den Drohnenvideos + Video DJI_0145
7. Unternehmen `#unternehmen` – Leitmotiv, Fuhrpark-Video DJI_0100, Versprechen, Kennzahlen, CTA
8. Team `#team` – 11 Profile (9 Personen, 2 Hunde) mit Dialog
9. Footer `#kontakt` – CTA mit Telefon, Medien (Video DJI_0204 + 2 Fotos), Navigation, Standort, Bürozeiten, Rechtliches

**Unterseiten:** keine. Nur Anker innerhalb der Startseite; Impressum/Datenschutz verlinken auf mw-bauen.de.

Inhalte zentral in `src/data/content.ts`, Sektionen in `src/components/`, Animationen in `src/scripts/motion.ts`, Seiten-Logik in `src/scripts/main.ts`, Touch-„Halten“ der Kartenstapel in `src/scripts/hold.ts`.

## Schrift, Farben, Animation
- **Schrift:** Schibsted Grotesk (Google Fonts, variabel 400–900), Überschriften in Großbuchstaben, meist 700–800.
- **Farben:** Rot `#e41e13`, Rot-Hover `#c51910`, Tinte `#111111`, Anthrazit `#17191c` (mit Körnung `/footer-grain.svg`), Anthrazit 2 `#202328`, Papier `#f2f1ee`, Grau `#62666d`, Weiß `#ffffff`.
- **Effekte:**
  - Hero am Desktop: Das Video wird **scroll-gescrubbt** (eigene Datei `DJI_0144-scrub.mp4` mit Keyframe alle 4 Bilder) und wächst gepinnt aus einem Rahmen zum Vollbild.
  - Hero auf Touch-Geräten: Das Video läuft als Schleife.
  - Laufband reagiert auf die Scrollgeschwindigkeit.
  - Statement leuchtet Wort für Wort auf.
  - Zahlen rollen ziffernweise mit kurzer Unschärfe ein.
  - Leistungen am Desktop: große Liste mit Vorschaubild, das dem Cursor folgt.
  - Leistungen auf dem Handy: gestapelte Karten; auf Touch-Geräten hält die Seite am Stapel, eine Wischbewegung = eine Karte.
  - Impressionen am Desktop: gepinnte Zoom-Parallax.
  - Team: Porträts skalieren beim Scrollen; am Desktop läuft der Titel sticky mit und invertiert über den Fotos.
  - Footer wird per Parallax aufgedeckt.
  - Buttons sind magnetisch.
  - Lenis nur für das Mausrad; Touch scrollt nativ.
  - `prefers-reduced-motion` wird respektiert.

## Medien
- `public/media/video/*.mp4`: komprimierte Web-Fassungen (1600 px, ohne Ton, 5–14 MB je Datei, zusammen ca. 64 MB).
- `public/media/still/`: Standbilder aus den Videos.
- `public/media/team/`: Team-Fotos als WebP (zusammen ca. 0,5 MB).
- `public/media/img/`: Portfolio-Bilder und Logo.
- **Nicht im Repo:** `media-src/videos/` (Originale, 467 MB) und `media-src/team/` (Original-PNGs, 27 MB). Die Originale liegen lokal beim Nutzer.

## Schwächen / offene Punkte
- **Überschriften sehr groß und sehr fett:** Hero bis 8,6 rem und Großbuchstaben mit Gewicht 800. Das wirkt laut und nimmt viel Raum ein, gerade auf dem Handy.
- **Team-Titel am Desktop:** Der invertierte, sticky Titel liegt über Porträts und Namen. Das wirkt teils unruhig, und Namen sind kurz schlecht lesbar.
- **Englische Vorlagen-Texte:** In der Unternehmens-Sektion stehen noch Vorlagen-Texte mit nicht belegten Angaben: „Expert Architects 25+“, „Client Retention 99 %“, „Completed Projects 500+“, „Let's Talk Your Plans!“. Sie wurden bewusst unverändert aus Seite B übernommen und müssen vom Kunden bestätigt oder ersetzt werden.
- **Portfolio-Bilder:** nur 440 px breit und deshalb bei größerer Darstellung unscharf. Die Leistungen nutzen sie trotzdem.
- **Datenmenge:** Das Scrub-Video für den Hero ist 13 MB groß und wird am Desktop komplett geladen. Nur am Desktop getestet (Headless-Chrome), nicht auf echten Geräten.
- **Überladene Animationen:** Pin-Sektionen am Desktop (Hero und Impressionen) plus viele Scroll-Effekte. Auf schwächeren Rechnern möglicherweise hakelig.
- **Aufräumen:** Tailwind ist noch als Abhängigkeit installiert, wird aber nicht mehr genutzt. `astro check` ist nicht installiert.

## Screenshots
`_screenshots/desktop-1440.png` und `_screenshots/mobil-390.png`, Vollseite, aufgenommen mit reduzierter Bewegung. Scroll-Animationen zeigen deshalb ihren Endzustand, der Hero sein Standbild.
