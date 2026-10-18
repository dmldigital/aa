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
- `src/components/sections`: Sektionen (jede nur einmal, per Props und Daten für mehrere Seiten genutzt), `src/components/ui`: Button, Pfeil-Link, Projektkarte, `Icon.astro`: Inline-SVG-Icons.
- `src/data` und `src/data/pages`: alle Inhalte, Firmendaten (`site.ts`) und Links (`links.ts`, Liste `ASTRO_PAGES`). `src/lib`: kleine Helfer (`img.ts` holt Bilder per Dateiname).
- `src/scripts`: `motion.ts` (Lenis, GSAP, Einblenden per `data-anim`) und `accordion.ts` (alle Akkordeons per `data-accordion`).
- `src/styles/global.css`: Tailwind-Theme mit Farben, Typografie-Skala (`text-h2`, `text-button`, `text-15` …), Container (`max-w-page`, `max-w-tablet`), Absatzabstand (`mb-para`) und Breakpoints (`md` ab 768 px, `lg` ab 1025 px, wie im Original).

## Konventionen

- Nur Tailwind-Klassen im Markup. Abstände in der Skala (`gap-5` statt `gap-[20px]`), wiederkehrende Werte als Token in `@theme`, Pixelwerte in Klammern nur für einmalige Sonderfälle.
- Beim Dev-Server nach neuen Klassen in neuen Dateien einmal `touch src/styles/global.css` ausführen, sonst fehlt das CSS.
- Rohe `<img>` nur, wo `<Picture>` nicht geht: SVG in `Faq.astro`, Lightbox-Bild in `Gallery.astro` (Quelle wird per Skript gesetzt). `alt` ohne Wert bedeutet bewusst dekorativ.
- Bilder liegen in `src/assets/img` und laufen über `<Picture>` (AVIF mit WebP-Fallback (formats und fallbackFormat)).
- Links nur über `href()` aus `src/data/links.ts`. Eine fertige Astro-Seite dort in `ASTRO_PAGES` eintragen.
- Vorschau-Builds sind `noindex`. Für den Livegang `PUBLIC_INDEXABLE=true` setzen (`.env.example`).
