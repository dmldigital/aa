# Meisterwerk Malermanufaktur: Website (Astro)

Astro 7, Tailwind 4, GSAP und Lenis. Aktuell nur die Startseite (Design 1:1 nach der WordPress-Seite).

## Befehle

- `npm run dev`: Entwicklungsserver
- `npm run build`: Produktions-Build nach `dist/` (Vorschau-Build: `SITE_URL=… BASE_PATH=/pfad/ npm run build`)
- `npm run check`: Typen und Astro-Prüfung (`astro check`)
- `npm run format`: Prettier, sortiert auch die Tailwind-Klassen

## Aufbau

- `src/pages`: Seiten. `src/layouts/Layout.astro`: Grundgerüst, Schrift (Astro Fonts API), Skripte.
- `src/components/sections`: Sektionen der Startseite, `src/components/ui`: Button und Pfeil-Link, `Icon.astro`: Inline-SVG-Icons.
- `src/data`: alle Inhalte (`faq`, `skills`, `services`, `projects`, `hero`, `nav`), Firmendaten (`site.ts`) und Links (`links.ts`).
- `src/scripts`: `motion.ts` (Lenis, GSAP, Einblenden per `data-anim`) und `accordion.ts` (alle Akkordeons per `data-accordion`).
- `src/styles/global.css`: Tailwind-Theme mit Farben, Typografie-Skala (`text-h2` …), Container und Breakpoints (`md` ab 768 px, `lg` ab 1025 px, wie im Original).

## Konventionen

- Nur Tailwind-Klassen im Markup. Wiederkehrende Werte gehören als Token in `@theme`, nicht als Pixelwert in Klammern.
- Bilder liegen in `src/assets/img` und laufen über `<Picture>` (AVIF mit WebP-Fallback (formats und fallbackFormat)).
- Links nur über `href()` aus `src/data/links.ts`. Eine fertige Astro-Seite dort in `ASTRO_PAGES` eintragen.
- Vorschau-Builds sind `noindex`. Für den Livegang `PUBLIC_INDEXABLE=true` setzen (`.env.example`).
