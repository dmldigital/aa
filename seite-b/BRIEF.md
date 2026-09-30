# Seite B – Manfred Weber, bestehende Seite (Original)

**Herkunft:** lokaler Ordner `C:\Users\denni\Desktop\mw-bauen-recovered` (lief lokal auf Port 4340). Kopie ohne `node_modules`, `dist`, `.astro`, `.wrangler` und **ohne `public/videos/` (467 MB Originalvideos, siehe unten)**.

## Firma und Zweck
Manfred Weber GmbH & Co. KG, Bauunternehmen aus 67273 Weisenheim am Berg (Region Rhein-Neckar & Pfalz): Hochbau, Tiefbau, Sanierungsbau, Umbau & Renovierung, Gewerbe- & Hallenbau. Einseitige Startseite, Ziel „Angebot anfragen“ (Telefon 0 63 53 / 80 60, info@mw-bauen.de). Aufgebaut auf dem Webflow-Theme „Foundix“ (Architektur-Vorlage), angepasst auf Weber-Rot.

## Stack, Start, Port
- Astro 4.16, `@astrojs/tailwind` + Tailwind 3.4 (Utility-Klassen direkt im Markup), GSAP ^3.12 (ScrollTrigger), Lenis ^1.1.
- Start: `npm install`, dann `npm run dev` (Skript: `astro dev --port 4321 --host`, also Port 4321). Lokal lief es mit `astro dev --port 4340`.
- Build: `npm run build` → `dist/`. Deploy per `wrangler.jsonc` auf den Cloudflare Worker `mw-bauen`. `public/.assetsignore` schließt `videos/*.mp4|mov` aus, weil die Dateien zu groß sind. Die Seite lädt die Videos deshalb live über eine zweite `<source>` von `https://mw-bauen.de/wp-content/uploads/2025/02/…` nach.

## Seitenaufbau (Reihenfolge)
1. `Header.astro`: absoluter Header mit Logo und weißer Navigations-Leiste plus rotem Button „Angebot anfragen“. Auf dem Handy öffnet sich ein Drawer (GSAP).
2. `Hero.astro`: Hintergrundvideo DJI_0144, „Träume verwirklichen, Werte schaffen.“, dazu eine weiß-rote Box mit Text und „Unsere Leistungen“.
3. `AboutIntro.astro` `#ueber-uns`:
   - Laufband
   - zwei Textspalten
   - rollender Zähler „25+ Jahre“
   - Video DJI_0165 mit rot-schwarzem Vorhang
   - rote Zitat-Box von Manfred Weber
4. `ServicesList.astro` `#leistungen`: 4 Karten. Am Desktop öffnen sich rot-schwarze Vorhänge, auf dem Handy ein eigener Sticky-Stapel.
5. `CompanyShowcase.astro` `#unternehmen`: dunkles 5-Spalten-Raster mit Text, Video DJI_0100, Kennzahlen und roter CTA-Kachel, dazu ein Panorama-Video DJI_0145.
6. `TeamSection.astro` `#team`: 11 Profile. Am Desktop Raster mit rot-schwarzem Hover-Vorhang, auf dem Handy 3er-Raster mit Dialog.
7. `Footer.astro` `#kontakt`: Raster mit Intro, Video DJI_0204, 2 Fotos, Navigation, Standort, roter Kontakt-Kachel, Bürozeiten und Rechtlichem.

**Unterseiten:** keine (nur `src/pages/index.astro`). Impressum/Datenschutz verlinken auf mw-bauen.de. `LogoShowcase.astro` (Vergleich von 6 Logo-Varianten) ist vorhanden, wird aber nirgends eingebunden.

## Schrift, Farben, Animation
- **Schrift:** Schibsted Grotesk (Überschriften, Großbuchstaben, meist Gewicht 500) und Inter (Fließtext), beide über Google Fonts.
- **Farben:**
  - Rot `#e41e13`, Hover `#c51910`, Akzent `#ff2d20` (Tailwind-Konfiguration), Team-Codes `#ff4d40`
  - Schwarz `#111111`, Anthrazit `#17191c` (mit Körnung `/footer-grain.svg`, über `!important`-Regeln erzwungen), `#1d1d1d`
  - Grautöne `#555555`, `#666666`, `#acabab`, `#808080`, dazu Weiß
- **Effekte:**
  - Lenis Smooth Scroll mit `touchMultiplier 1.5`, gilt auch auf Touch-Geräten
  - Hero: Einblendung und Video-Parallax
  - rot-schwarze Doppel-Vorhänge über Bildern und Videos
  - rollender Ziffern-Zähler
  - CSS-Laufband
  - Hover-Vorhänge auf Team-Karten
  - Buttons mit Hintergrund, der aus der Mitte wächst
  - Videos starten bei Hover oder Klick
  - Die Animationen liegen verteilt als `<script>` in den einzelnen Komponenten.

## Medien
- `public/team/*.png`: 12 Team-Fotos mit je ca. 2–2,8 MB, zusammen 27 MB. Mitgeliefert.
- `public/portfolio_0–5.jpg`: nur 440 × 425 px.
- **Nicht im Repo:** `public/videos/` mit 467 MB, Originale mit ca. 35 Mbit/s:
  - DJI_0099 (71 MB)
  - DJI_0100 (73 MB)
  - DJI_0144 (38 MB)
  - DJI_0145 (67 MB)
  - DJI_0165 (125 MB)
  - DJI_0204 (86 MB)
  - IMG_0572.mov (26 MB)
  - dazu Poster-JPGs

  Komprimierte Web-Fassungen derselben Videos liegen in `seite-a/public/media/video/`. Lokal fehlen die Videos in dieser Kopie. Die Seite fällt dann auf die mw-bauen.de-Quellen zurück, die Poster fehlen.

## Feste Vorgaben des Kunden
- **Keine Nummerierung in Menüs** (kein „01, 02, 03 …“ neben Navigationspunkten, weder am Desktop noch im Handy-Menü). Gilt als veraltet bzw. KI-Slop.

## Schwächen / offene Punkte
- **Kaputter Menüpunkt:** „Impressionen“ verlinkt auf `#impressionen`, diese Sektion gibt es nicht.
- **Englische Vorlagen-Texte:** In `CompanyShowcase` stehen noch Vorlagen-Texte mit nicht belegten Angaben: „WHY CHOOSE US?“, „Expert Architects 25+“, „Client Retention 99 %“, „Completed Projects 500+“, „Let's Talk Your Plans!“.
- **Schwere Medien:**
  - Die Videos sind viel zu groß fürs Web und werden deshalb von der alten WordPress-Seite nachgeladen.
  - Die Team-PNGs sind unnötig schwer (27 MB).
  - Die Portfolio-Bilder sind sehr klein.
- **Scrollen auf dem Handy:** Lenis greift auch auf Touch-Geräten. Das kann sich zäh anfühlen.
- **Animations-Code:** verteilt auf viele Komponenten-Skripte mit `DOMContentLoaded`. Es gibt keine gemeinsame Bewegungslogik, und `prefers-reduced-motion` wird nur teilweise beachtet.
- **CSS:** viele `!important`-Überschreibungen für die Körnung auf Tailwind-Klassen-Selektoren.
- **Wirkung:** Kleine Fließtexte (13–15 px) und viele kleine Großbuchstaben-Labels wirken insgesamt eng. Die Handy-Galerie im Team ist mit 3 Spalten sehr klein.
- **Inter als Fließtext-Schrift:** Das ist sehr generisch.

## Screenshots
`_screenshots/desktop-1440.png` und `_screenshots/mobil-390.png`, Vollseite, aufgenommen mit reduzierter Bewegung vom lokalen Originalordner (mit Videos).
