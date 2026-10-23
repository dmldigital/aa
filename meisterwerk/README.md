# Meisterwerk Malermanufaktur: Website (Astro)

Astro 7, Tailwind 4, GSAP und Lenis. Aktuell nur die Startseite (Design 1:1 nach der WordPress-Seite).

## Befehle

- `npm run dev`: Entwicklungsserver
- `npm run build`: Produktions-Build nach `dist/` (Vorschau-Build: `SITE_URL=… BASE_PATH=/pfad/ npm run build`)
- `npm run check`: Typen und Astro-Prüfung (`astro check`)
- `npm run format`: Prettier, sortiert auch die Tailwind-Klassen

## Aufbau

- `src/pages`: Seiten. `src/layouts/Layout.astro`: Grundgerüst, Schrift (Astro Fonts API), Skripte.
- `src/pages`: alle Seiten mit denselben Adressen wie auf der alten WordPress-Seite. Ähnliche Seiten laufen über dynamische Routen (`services/[slug]`, `meisterwerk-exklusive/[slug]`, `[year]/[month]/[day]/[slug]`, `[slug]` für Profile).
- Kopfbereich: `Header.astro` (Zeile oben: Logo, Ort, Kontakt, MENÜ; Variante `hero` liegt im Hero), `FloatingMenu.astro` (schwebende Menü-Pille oben rechts statt mitlaufender Kopfzeile: Klick öffnet das Menü, Überfahren klappt die Kontaktwege auf), `Menu.astro` (Desktop und Tablet: geteiltes Vollbild-Menü `menu/V2`, rechts Untermenü, Seitenvorschau aus `data/menu-preview.ts` oder Kontakt mit Kurzformular; Handy: Seitenfläche `menu/V3`), Bausteine in `components/header/`. `Hero.astro`: Scroll-Hero der Startseite (Desktop: Bilderstreifen, Text und Fläche schieben sich weg, Bild wächst; Handy: Fläche fährt hoch). Die Zustände laufen über die Tailwind-Varianten `hero-d` und `hero-m` (`global.css`). `HeroSlider.astro`: Karussell nur für die Startseite von Meisterwerke Exklusive.
- `src/components/sections`: Sektionen (jede nur einmal, per Props und Daten für mehrere Seiten genutzt), `src/components/ui`: Button (der einzige Button der Seite), Projektkarte, `Icon.astro`: Inline-SVG-Icons.
- `src/content` und `src/content.config.ts`: Content Collections für Einträge mit eigener Adresse (`beitraege`, `exklusiv-beitraege`, `profile`, `leistungen`, `exklusiv-leistungen`, `kollektionen`): eine JSON-Datei pro Eintrag, Zod-Schema in `content.config.ts`, Bilder als relativer Pfad nach `src/assets/img` (`image()`). Neue Seite dieser Art = neue JSON-Datei, die Route (`getCollection` + `getStaticPaths`) bleibt unverändert; Adresse bei Bedarf in `ASTRO_PAGES` eintragen.
- `src/data` und `src/data/pages`: übrige Inhalte, Firmendaten (`site.ts`) und Links (`links.ts`, Liste `ASTRO_PAGES`). `src/lib`: kleine Helfer (`img.ts` holt Bilder per Dateiname).
- `src/scripts`: `motion.ts` (Lenis, GSAP, Einblenden per `data-anim`) und `accordion.ts` (alle Akkordeons per `data-accordion`).
- `src/styles/global.css`: Tailwind-Theme mit Farben, Typografie-Skala (`text-h2`, `text-button`, `text-15` …), Container (`max-w-page`, `max-w-tablet`), Absatzabstand (`mb-para`) und Breakpoints (`md` ab 768 px, `lg` ab 1025 px, wie im Original).

## Konventionen

- Nur Tailwind-Klassen im Markup. Abstände in der Skala (`gap-5` statt `gap-[20px]`), wiederkehrende Werte als Token in `@theme`, Pixelwerte in Klammern nur für einmalige Sonderfälle.
- Beim Dev-Server nach neuen Klassen in neuen Dateien einmal `touch src/styles/global.css` ausführen, sonst fehlt das CSS.
- Rohe `<img>` nur, wo `<Picture>` nicht geht: SVG in `Faq.astro`, Lightbox-Bild in `Gallery.astro` (Quelle wird per Skript gesetzt). `alt` ohne Wert bedeutet bewusst dekorativ.
- Bilder liegen in `src/assets/img` und laufen über `<Picture>` (AVIF mit WebP-Fallback (formats und fallbackFormat)).
- Links nur über `href()` aus `src/data/links.ts`. Eine fertige Astro-Seite dort in `ASTRO_PAGES` eintragen.
- Vorschau-Builds sind `noindex`. Für den Livegang `PUBLIC_INDEXABLE=true` setzen (`.env.example`).

## SEO und Livegang

- **Umgebungsvariablen (Build):** `SITE_URL` (Standard `https://meisterwerk-lb.de`), `BASE_PATH` (Standard `/`, nur für Vorschau unter einem Unterpfad setzen), `PUBLIC_INDEXABLE` (nur `true` gibt die Seite für Suchmaschinen frei; fehlt sie, ist alles `noindex` und `robots.txt` sperrt, es entsteht keine Sitemap).
- **Livegang (Cloudflare Pages, Produktion):** `PUBLIC_INDEXABLE=true`, `SITE_URL` und `BASE_PATH` leer lassen. Preview-Umgebungen ohne `PUBLIC_INDEXABLE` bauen (bleiben gesperrt). Danach prüfen: `python3 tools/seo-check.py <dist> --indexable`.
- **Was der Kopf liefert** (`src/components/seo/BaseHead.astro`, `JsonLd.astro`, Regeln in `src/lib/seo.ts`, Daten in `src/lib/schema.ts`): Canonical (absolut, mit Schrägstrich am Ende), Open Graph und Twitter-Card mit Vorschaubild 1200x630 (Standardbild je Auftritt, per Prop `image` des Layouts überschreibbar), `theme-color`, Apple-Touch-Icon, JSON-LD (`HousePainter` und `WebSite` und `FAQPage` auf der Startseite, `BreadcrumbList` auf allen Unterseiten, `Service` auf den Leistungsseiten).
- **Titel** setzt `PageLayout` zusammen: „Thema | Marke“, genau ein Trennzeichen, Marke „Meisterwerk Malermanufaktur“ bzw. „Meisterwerke Exklusive“. Seiten geben nur das Thema (alte Markenzusätze werden entfernt). Höchstens 60 Zeichen. Beschreibungen sind Pflicht (110 bis 160 Zeichen, in den Collections vom Schema geprüft).
- **Nie im Index** (auch in Produktion): `/stil/`, `/404/`, `/reviews/` (Liste `NOINDEX_PATHS` in `src/lib/seo.ts`). Nicht in der Sitemap sind außerdem Duplikate mit fremdem Canonical: Impressum, Datenschutz und die sechs Profile der Teil-Website zeigen per Canonical auf die Hauptseite (Entscheidung noch vom Nutzer zu bestätigen).
- **Weiterleitungen:** `public/_redirects` (Cloudflare Pages) mit den alten WordPress-Adressen, deren Ziel eindeutig ist. Links auf `meisterwerk-lb.de` gibt es im Bau nicht mehr.
- **Vom Kunden nötig (noch offen, nichts erfunden):** Öffnungszeiten (`site.openingHours`), Koordinaten (`site.geo`, aus dem Google-Unternehmensprofil), echte WhatsApp-Nummer (`site.whatsappHref`), Gründungsjahr (`site.foundingYear`, optional), USt-IdNr. (`site.vatId`, nur wenn öffentlich gewünscht). Felder in `src/data/site.ts` anlegen die Ausgabe automatisch, sobald sie befüllt sind. Außerdem: Schreibweise des Firmennamens und „Freiberg am Neckar“ mit dem Google-Unternehmensprofil abgleichen. `aggregateRating` wird bewusst nicht ausgegeben (statisches Selbstbewertungs-Badge).
