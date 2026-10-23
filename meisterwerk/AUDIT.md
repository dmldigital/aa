# Audit Meisterwerk Malermanufaktur (Astro 7, Tailwind 4, GSAP 3, Lenis)

Stand: 23.10.2026. Nur lesend geprüft, nichts am Code geändert. Grundlage: gebauter Stand in `/tmp/audit-dist` (Basis `/aa/meisterwerk-preview-auswahl/`, Site `https://dmldigital.github.io`) und der Quellcode im Arbeitsverzeichnis `meisterwerk/` (enthält zum Messzeitpunkt uncommittete Änderungen einer parallelen Sitzung, Zeilenangaben beziehen sich darauf). 53 HTML-Seiten gebaut, 51 davon gewichtet (ohne die Testseiten `/stil/` und `/startseite-a/`; `/hero-flug/` existiert nur als Bildordner in `public/`).

Messmethodik: alle HTML-Dateien mit BeautifulSoup geparst (Skripte im Scratchpad `/tmp/claude-0/-home-user-aa/ca73a2cc-31b5-54f3-9c1c-498306bf1069/scratchpad/`: `parse.py`, `links.py`, `imgs.py`, `imgan2.py`, `perf.cjs`, `imgscan.cjs`, `cls.cjs`). Browser-Messung mit Playwright/Chromium gegen einen lokalen `python http.server` (keine Kompression, deshalb sind "Bytes" unkomprimiert, dazu eine gzip-Schätzung). Zeiten wie LCP in Millisekunden sind auf localhost nicht aussagekräftig, belastbar sind das LCP-Element, Bytes, Requests und Layout-Verschiebungen. Mobil mit 390 px und Gerätepixelverhältnis 2, Desktop mit 1440 px und Faktor 1.

## Kurzfazit

Die Seite ist technisch sauber gebaut: kein einziger toter interner Link, keine fehlenden Anker, durchgehend `Picture` mit AVIF/WebP und sinnvollen `sizes`, selbst gehostete Schriften über die Astro Fonts API, Bewegungsreduzierung wird fast überall beachtet. Die größte Schwachstelle für Nutzer ist die Startseite: Die Hero-Bildfolge lädt beim Öffnen 193 Einzelbilder (Desktop 13,7 MB, Handy 5,0 MB, insgesamt 212 Requests), und die gescrubbte Hero-Animation verschiebt Layout-Eigenschaften (gemessene CLS 0,42 am Desktop und 0,82 mobil beim Durchscrollen). Für lokales SEO fehlt die gesamte Grundausstattung: kein Canonical, kein Open Graph, kein JSON-LD, keine Sitemap, keine robots.txt, keine 404-Seite, 28 von 51 Seiten ohne Meta-Description, und die Fließtexte der Leistungsseiten nennen Ludwigsburg und Stuttgart kein einziges Mal (nur Title, Description und Bild-Alt tun es), Ortsseiten gibt es nicht. Beim Livegang gibt es drei Fallen: der `noindex`-Schalter ist ein reiner Build-Parameter (`PUBLIC_INDEXABLE=true`), die Testseiten `/stil/` und `/startseite-a/` würden dann mit indexierbar, und 60 Links (Exklusive-Menü "Kontakt", Kategorie-Links) zeigen noch auf die alte WordPress-Domain. Die Doppelstruktur Hauptseite plus Teil-Website `/meisterwerk-exklusive/` erzeugt identische Rechtstexte (je 6.202 Wörter doppelt) und ähnliche Profilseiten, hier braucht es eine bewusste Canonical-Strategie.

## Top 10 Maßnahmen (priorisiert)

| # | Maßnahme | Schwere | Aufwand |
|---|---|---|---|
| 1 | Hero-Bildfolge entschlacken: statt 193 WebP-Einzelbilder (13,7 MB Desktop, 5,0 MB mobil, 212 Requests) ein kurzes komprimiertes Video (H.264/AV1, etwa 1 bis 2 MB) mit `currentTime`-Scrubbing, oder höchstens jedes 2. Bild, Laden erst nach `load`/Leerlauf und nicht bei `saveData`/schlechter Verbindung (`Hero.astro:33,165`, `flug.ts:84`) | hoch | mittel |
| 2 | SEO-Kopf zentral nachrüsten: eine `BaseHead`-Komponente in `Layout.astro` mit Canonical, Open Graph, Twitter, `og:image` (1200x630), `theme-color`, Apple-Touch-Icon; dazu `@astrojs/sitemap`, `public/robots.txt` und `src/pages/404.astro` | hoch | klein |
| 3 | Strukturierte Daten: `HousePainter` (LocalBusiness) mit NAP, `geo`, `openingHours`, `areaServed`, `sameAs`, `hasMap`, `vatID`; `Service` je Leistungsseite, `BreadcrumbList`, optional `FAQPage` für die 10 Fragen der Startseite. Kein `aggregateRating` aus dem statischen 5.0-Badge. Öffnungszeiten und Geokoordinaten fehlen im Projekt, müssen vom Kunden bzw. aus dem Google-Unternehmensprofil kommen | hoch | mittel |
| 4 | Livegang absichern: `PUBLIC_INDEXABLE=true` nur für Produktion, Preview-Umgebungen bleiben `noindex`; `/stil/` und `/startseite-a/` aus dem Produktions-Build nehmen (Unterstrich-Ordner oder `import.meta.env.DEV`-Guard); CI-Prüfung "kein `noindex` im Produktions-`dist`"; `_redirects` für alte WordPress-Duplikate (`/services/lackieren/`, `/spachteltechniken/`) und für die 60 Links auf `meisterwerk-lb.de` (`nav.ts:80`, Kategorie-Links) | hoch | klein |
| 5 | Meta-Daten vervollständigen: 28 von 51 Seiten ohne Description, `/kontakt/` und `/schnellkontakt/` haben identischen Title und identische Description, 11 Titles über 60 Zeichen, `/leistungen/` ohne Description und ohne Ort im Title, drei Trennzeichen-Varianten. `description` im Content-Collection-Schema auf Pflicht setzen (`content.config.ts:22`) | hoch | klein |
| 6 | Ortsbezug im Text und Ortsseiten: Leistungsseiten (je 350 bis 490 Wörter) nennen "Ludwigsburg" im Fließtext 0 mal, die Exklusive-Site nennt Ludwigsburg nur auf 3 von 24 Seiten; Marbach und Bietigheim stehen nur auf der Startseite und auf `/leistungen/`. Eigene Collection `orte` mit Template für `/maler-ludwigsburg/`, `/maler-marbach/` usw. (Angebot sieht bis zu 20 Ortsseiten vor), mit eigenem Inhalt, Verlinkung aus Hub, Footer und Leistungsseiten | hoch | groß |
| 7 | Hero-Scrub auf Transform/Clip-Path umstellen: GSAP animiert `left/top/right/bottom` des Bildcontainers (`Hero.astro:217,220,268,272`), das erzeugt Layout pro Frame und die gemessene CLS von 0,42 (Desktop) bzw. 0,82 (mobil) | hoch | mittel |
| 8 | Doppelte Inhalte klären: Impressum und Datenschutz existieren zweimal textgleich (6.202 Wörter), Profilseiten sind zu 70 Prozent identisch (`/baldassarre-fortino/` und `/meisterwerk-exklusive/baldassarre-fortino/`), `/urlaubsservice/` zu 84 Prozent. Rechtstexte der Exklusive-Site per Canonical auf die Hauptseite, Profile entweder zusammenlegen oder Canonical setzen; Beziehung zur externen Domain `meisterwerk-exklusive.de` (Footer-Logo, `Logos.astro:61`) klären | mittel | klein |
| 9 | Bild-SEO: Alt-Tippfehler "Baldasarre" im Logo-Alt (58 Vorkommen auf 29 Seiten, `Brand.astro:32`, `Logos.astro:43`), Projektgalerien mit `alt=""` (`Gallery.astro:68`) oder immer dem Seitentitel als Alt (`ProjectPage.astro:91,136,156`: "Traumhaus" 20 mal auf einer Seite), Dateinamen wie `216-meisterwerk-20230120-Bearbeitet-1-scaled-e1758184263171` | mittel | mittel |
| 10 | Überschriftenstruktur und interne Verlinkung: 6 Seiten ohne H1 (`/reviews/`, vier Exklusive-Seiten, `/meisterwerk-exklusive/partner-sponsoring/`), `/studio/` mit zwei H1 (`StudioTeam.astro:158,236`), H6-Eyebrows vor der H1 und Sprünge H1 zu H6; Hub `/leistungen/` hat keinen einzigen Link aus dem Inhaltsbereich einer anderen Seite, Leistungsseiten verlinken sich kaum untereinander | mittel | klein |

## 1. Codequalität

### 1.1 Astro

| Befund | Beleg | Schwere | Vorschlag |
|---|---|---|---|
| Startseite lädt 193 Hero-Frames sofort (Bildfolge über Canvas), 6 parallel | `Hero.astro:33` (`FRAMES = 193`), `Hero.astro:165` (`flug.load()` beim Start), `flug.ts:84` (6 Worker). Messung: 1440 px 212 Requests und 14,54 MB, 390 px 210 Requests und 5,82 MB, davon 13,73 MB bzw. 4,99 MB aus `hero-flug/` | hoch | Siehe Top 1. Zusätzlich Ladestart per `requestIdleCallback`, `navigator.connection.saveData` und `prefers-reduced-data` respektieren |
| Hero-Frames liegen in `public/` und umgehen die Bild-Pipeline (ungehashte Namen, kein AVIF, lange Cache-Dauer nur mit Zusatzkonfiguration möglich) | `public/hero-flug/d` (14 MB, 193 Dateien), `public/hero-flug/m` (5,2 MB) | mittel | Als Video unter `public/` mit festem Cache-Header (`_headers`) oder gehasht über `src/assets` |
| Veralteter Kommentar | `flug.ts:3` nennt 97 Bilder, tatsächlich 193 | niedrig | Kommentar anpassen |
| Inline-CSS wird in jede Seite kopiert: `inlineStylesheets: 'always'`, Kommentar nennt "eine einzelne Seite", es sind aber 53 Seiten | `astro.config.mjs:30-33`. Gemessen: 105 KB roh (19 KB gzip) CSS pro Seite, HTML 160 bis 330 KB roh (29 bis 47 KB gzip), nichts davon zwischen Seiten cachebar | mittel | `inlineStylesheets: 'auto'` (Standard) oder `'never'`; einmaliges, gecachtes CSS spart bei jeder Folgeseite etwa 19 KB gzip |
| Client-JS pro Seite: 4 bis 8 Dateien, 149 bis 159 KB roh, 56 bis 60 KB gzip; 140 KB davon (52,6 KB gzip) ist der gemeinsame `motion`-Chunk (GSAP, ScrollTrigger, CustomEase, Lenis) auf jeder Seite, auch auf Impressum und Datenschutz | `Layout.astro:32-35` lädt `motion` und `accordion` global; Chunk `motion.D-dvbJ_e.js`. Je Seite: Startseite 7 Dateien 154 KB (58,7 KB gzip), `/kontakt/` 5 Dateien 159 KB (60,2 KB gzip), `/leistungen/` 5 Dateien 150 KB | niedrig | Vertretbar, weil Menü und Scroll-Szenen GSAP brauchen. Falls nötig: Reveals auf CSS/IntersectionObserver umstellen und `motion` nur auf Seiten mit Pin-Szenen laden |
| Skripte, die CSS sein könnten | `motion.ts:65-90` (ein ScrollTrigger je `[data-anim]`-Element, gemessen 28 auf der Startseite) für reines Einblenden mit `opacity`/`transform`; `accordion.ts:25,46,54` tweent `height` (Layout) | niedrig | Reveals per IntersectionObserver oder `animation-timeline: view()`; Akkordeon per `<details>` mit `interpolate-size: allow-keywords` bzw. `grid-template-rows: 0fr` zu `1fr` |
| Tote Komponenten (nirgends importiert) | `components/sections/Feature.astro`, `Intro.astro`, `PageHero.astro`, `Pillars.astro`, `SectionHeading.astro`, `Showcase.astro` | niedrig | Löschen (ihre Klassen landen sonst weiter im Tailwind-CSS) |
| Testseiten im Produktions-Build | `src/pages/stil/index.astro`, `src/pages/startseite-a.astro` (und `HeroFull.astro` nur dafür) | mittel | Beim Livegang entfernen oder per Unterstrich-Präfix/Guard ausschließen, sonst indexierbar (siehe 2) |
| Ungenutzte Exporte und Dateien | `data/pages/intro.ts` `serviceParts` (nirgends genutzt); `src/assets/img/cropped-Malermanufaktur_neu.png` im Quelltext nicht referenziert (steckt aber im Altbuild, Stand der parallelen Sitzung prüfen) | niedrig | Entfernen |
| Doppelte Bilddateien im Repo | 16 Gruppen mit identischem Inhalt (md5), insgesamt 5,7 MB überflüssig, z. B. `138-mw-20241125-HDR-scaled.jpg` = `138-mw-20241125-HDR-2-scaled.jpg` = `Fugenlose-Dusche-Nero-Fine-scaled.jpg`. Im Build entstehen dadurch getrennte Dateien mit getrennten URLs | niedrig | Eine Datei behalten, in `content/*.json` und `data/*.ts` darauf zeigen |
| Hintergrundbilder umgehen `Picture` | `Surface.astro:30,37`, `ContactSection.astro:22,132`, `HolidaySteps.astro:17,54`: `getImage(... format: 'webp')` und `style="background-image:url(...)"`, eine einzige Größe (2000 bzw. 1600 px) für alle Geräte, kein AVIF, kein `loading=lazy`. Gemessen auf `/projekte/`: 217 KB WebP auch mobil | mittel | `<Picture>` absolut positioniert mit `object-cover`, AVIF, `sizes="100vw"` |
| Schriften | Astro Fonts API mit Google-Provider, beide Familien mit `preload`, selbst gehostet, `font-display: swap`, Fallback mit `size-adjust` (`astro.config.mjs:10-29`, `Layout.astro:24-25`). Urbanist und DM Sans je eine Datei für alle Gewichte, zusammen 63 KB | gut | Nichts zu tun. Optional: nur die Schrift preloaden, die über der Falz gebraucht wird (beide werden verwendet) |
| Content Collections | 6 Collections (JSON, `glob`-Loader, Zod, `image()`), aber `description` ist bei Beiträgen optional (`content.config.ts:22`) und in 7 von 8 Beitrags-Einträgen leer (nur `unser-showroom.json` hat eine), deshalb fehlen Descriptions auf den Beitragsseiten | mittel | Pflichtfeld mit Länge 70 bis 160, Build bricht bei fehlender Beschreibung ab |
| Texte teils außerhalb der Collections | `data/pages/*.ts` (Meta, Intro, Partner usw.), `data/faq.ts` | niedrig | Konsistenz: Meta-Daten aller Seiten in einem Schema führen (z. B. Collection `seiten`) |
| View Transitions / `ClientRouter` | nicht verwendet (reine MPA) | neutral | Kein Handlungsbedarf. Optional `@view-transition { navigation: auto }` per CSS für weiche Seitenwechsel |
| Duplizierte Inline-SVGs | Sterne (`ui/Stars.astro`) je 1,4 KB, 40 Stück pro Seite, auf der Startseite 99 KB SVG in 124 Elementen (Anteil am 323-KB-HTML) | niedrig | Einmal als `<symbol>` definieren und mit `<use>` einbinden |
| `is:inline` | nur ein Mal, `Layout.astro:26` (Klasse `js` gegen Flackern), sinnvoll | gut | |
| Doppelter Rohtext auf Seiten | Menü Desktop (V2) und Handy (V3) liegen beide im HTML: je Seite 68 bis 69 von 74 bis 90 Links liegen außerhalb von `<main>` (Menü, Fuß) | niedrig | Akzeptabel, aber Crawler sehen jeden Menülink dreifach. Handy-Menü per `<template>` erst bei Bedarf einsetzen |
| Auto-Verlinkung per Middleware | `middleware.ts:5-13` läuft über jede HTML-Antwort (im Build einmal je Seite), Regex-Tokenizer in `lib/autolink.ts` | niedrig | Funktioniert; langfristig als Remark/Rehype-Schritt oder Komponente, weil Middleware-HTML-Umbau im Dev-Server jede Anfrage verlangsamt |

### 1.2 Tailwind 4

| Befund | Beleg | Schwere | Vorschlag |
|---|---|---|---|
| Konvention im README "nur Tailwind-Klassen im Markup" wird in 12 Dateien durch 2.922 Zeilen gescoptes CSS gebrochen | `kontakt/ProjectRequest.astro` (707 Zeilen `<style>`), `profile/ProfileTemplate.astro` (635), `qualifikationen/QualiScene.astro` (319), `leistungen/LeistungenOverview.astro` (288), `sections/StudioTeam.astro` (274), `TimelinePin.astro` (161), `urlaub/HolidayFlow.astro` (143), `service/ServiceGallery.astro` (125), `ServiceExcellence.astro` (94), `ServiceBenefits.astro` (85), `ui/Lightbox.astro` (83) | mittel | Für Animations-Zustände und `cqw`-Layouts ist gescoptes CSS vertretbar; wiederkehrende Werte (Farben, Radien, Abstände) in `@theme` ziehen, README anpassen oder Block für Block in Utilities überführen |
| Breakpoint-Chaos: Theme definiert nur `md` (768) und `lg` (1025) (`global.css:5-7`), im Markup stehen 101 mal `min-[701px]`, 33 mal `max-[700px]` und insgesamt etwa 150 weitere `min-[…px]`/`max-[…px]`, dazu Sondervarianten `hero-d`, `hero-m`, `ws-m` (`global.css:69-73`) und in Skripten handgeschriebene Queries (`timeline.ts:20,94`, `StudioTeam.astro:309`: `64.0625rem`, `1024.98px`) | siehe links | mittel | Einen dritten Breakpoint `--breakpoint-sm: 43.8rem` (701 px) im Theme anlegen und überall nutzen; Skript-Queries aus einer Konstanten ableiten |
| Arbitrary Values: 445 Stück in 270 Varianten, davon 91 Pixelwerte; Spitzenreiter `FloatingMenu.astro` (36), `Hero.astro` (22), `Surface.astro` (21), `Faq.astro` (20). Wiederholt: `mt-[20vh]` 12 mal, `mt-[10vh]` 9 mal, `pl-[10%]` 8 mal, `duration-[450ms]` 6 mal, `gap-x-[6vw]` 6 mal | z. B. `Surface.astro` `rootClass = 'mt-[14vh] md:mt-[20vh] lg:mt-[20vh]'` (`lg` identisch zu `md`) | niedrig | Tokens `--spacing-section`, `--duration-base`; redundante `lg:`-Wiederholungen entfernen |
| Typografie-Skala existiert (`text-h1…text-small`), wird aber noch umgangen | 16 Stellen mit `text-[Npx]` (z. B. `text-[40px]/[22.5px]`), `data/footer.ts:22-26` baut Größen aus Pixel-Klassen | niedrig | Auf Skala umstellen |
| Duplizierte Klassenstrings kaum vorhanden | nur 3 Strings ab 60 Zeichen mit 3 oder mehr Wiederholungen | gut | |
| Inline `style=` | 14 Stellen, fast alle dynamische CSS-Variablen oder Hintergrundbilder (siehe oben) | niedrig | Hintergrundbilder auf `<Picture>`, Variablen so lassen |
| Roh-Hexfarben im Markup | 15 `bg-[#…]`/`text-[#…]`, z. B. `Button.astro` `hover:bg-[#f1f1f1]`, `MapPlaceholder.astro` `bg-[#e2e2e2]`, Badge `#cecece` | niedrig | In `@theme` als `--color-*` aufnehmen |

### 1.3 GSAP und Lenis

| Befund | Beleg | Schwere | Vorschlag |
|---|---|---|---|
| Plugins einmal registriert | `motion.ts:6` (`ScrollTrigger`, `CustomEase`), alle anderen Skripte importieren aus `motion.ts` | gut | |
| Layout-Eigenschaften werden gescrubbt | `Hero.astro:217` (`left`), `:220` (`top/right/bottom/left`), `:268` (`top/bottom`), `:272` (`left/right/bottom/top`). Messung der Layout-Shifts auf der Startseite: Desktop 0,418 (16 Einträge), mobil 0,821 (24 Einträge), Verursacher `div.absolute.inset-0` (Hero-Bild) und das Canvas | hoch | Container fest auf Endgröße setzen und per `clip-path: inset()` plus `scale` animieren (wie Menü und Reveal es schon tun), Bildinhalt per `transform` |
| Weitere Layout-Tweens (nicht gescrubbt) | `accordion.ts:25,46,54` (`height`, Padding), `ProjectRequest.astro:533-534` (`height`) | niedrig | Akzeptabel, bei Bedarf `grid-template-rows` |
| Bewegungsreduzierung | Wird beachtet: `motion.ts:12,16,69,102` (Lenis aus, Reveals sichtbar), Hero, Welcome, Studio, Zeitleiste, Leistungen über `matchMedia`-Bedingung `prefers-reduced-motion: no-preference`; CSS-Varianten `hero-d`/`hero-m`/`ws-m` enthalten die Bedingung. Das Laden der Hero-Bilder hängt an derselben Bedingung | gut | Ergänzen: `saveData` |
| ScrollTrigger-Anzahl (Laufzeit, direkt nach dem Laden, danach nach vollständigem Scrollen; `once`-Trigger töten sich selbst) | Startseite 35 (Desktop) bzw. 43 (mobil) zu 8 bzw. 2; `/leistungen/` 16 zu 7 bzw. 14 zu 4; `/services/malerarbeiten/` 14 zu 5 bzw. 13 zu 1; `/kontakt/` 5 bzw. 3; `/projekte/` 22 zu 6 bzw. 19 zu 3 | niedrig | Unkritisch; Großteil sind Einblenden-Trigger (siehe 1.1) |
| Aufräumen | MPA ohne Router, daher nur `matchMedia`-Kontexte nötig; `mm.add` räumt beim Wechsel auf, `StudioTeam.astro:321-322`, `timeline.ts:79-80,134-136` killen sauber | gut | |
| Scroll-Listener | `Menu.astro:50` ohne `passive`, `Footer.astro:185` und `FloatingMenu.astro:208` mit `passive` | niedrig | `passive` ergänzen |
| `will-change` | nur `Hero.astro:92` (`will-change-transform`) | gut | |
| Lenis | nur ohne Bewegungsreduzierung, an `gsap.ticker` gekoppelt, `lagSmoothing(0)`, Stopp/Start bei Menü und Lightbox (`Menu.astro:53,58`, `lightbox.ts:34,44`) | gut | |

### 1.4 Barrierefreiheit nur mit SEO-Bezug

| Befund | Beleg | Schwere | Vorschlag |
|---|---|---|---|
| `lang="de"` überall gesetzt | `Layout.astro:16` | gut | |
| Name wird in Spans zerlegt, Text ohne Leerzeichen | Startseite `<h1>`: `<span>Meisterwerk Malermanufaktur</span>Malerarbeiten in …` ergibt als Text "MalermanufakturMalerarbeiten"; Profil-H1 "BaldassarreFortino" (nur per `aria-label` korrekt, `ProfileTemplate.astro:74`) | niedrig | Leerzeichen oder `<br>` zwischen den Teilen; Markenzeile aus der H1 herausnehmen |
| Footer-Frage ist auf jeder Seite eine H3 | `footer/Frage.astro:15` ("Sie haben Fragen?") | niedrig | Als `<p class="…">` ausgeben, sonst steht auf Seiten ohne H2 (z. B. `/reviews/`) eine H3 als einzige Überschrift |
| H6 als Zierzeile | Eyebrows in Großbuchstaben als `h6` vor der H1 und für Labels (`StudioTeam.astro:67,116,127,155,163,183,233`, Profil: "Baujahr", "Lebensmotto") | mittel | `<p>` mit Klasse |
| "Related" als H3 mit englischem Wort und Selbstverweis | `PostRelated.astro:28,33`: bei nur 2 Beiträgen werden 3 Karten durch `items[i % items.length]` aufgefüllt, ein Beitrag verlinkt dadurch sich selbst und erscheint doppelt | mittel | Aktuellen Beitrag ausfiltern, Überschrift "Weitere Projekte", nur vorhandene Karten zeigen |

## 2. Lokales SEO

### 2.1 Seitenübersicht (51 Seiten, Testseiten ausgenommen)

Alle Seiten: `lang="de"`, `robots` = `noindex, nofollow` (Preview), kein Canonical, keine Open-Graph- und Twitter-Tags, kein JSON-LD, kein `hreflang`. Spalte "Sprünge" zählt übersprungene Überschriftenebenen (z. B. H1 zu H6), "Ort im Text" zählt Ludwigsburg / Stuttgart / Freiberg im `<main>`.

| Seite | Title (Z.) | Description (Z.) | H1 | Sprünge | Ort im Title | Ludwigsburg / Stuttgart / Freiberg im Text |
|---|---|---|---|---|---|---|
| `/` | 66 | 155 | 1 | 0 | ja | 3/1/5 |
| `/2021/05/01/kernsanierung/` | 43 | fehlt | 1 | 0 | nein | 1/0/0 |
| `/2025/05/03/unser-showroom/` | 44 | 145 | 1 | 0 | nein | 0/0/1 |
| `/2025/05/22/altbau-wdvs/` | 41 | fehlt | 1 | 0 | nein | 1/0/0 |
| `/2025/09/18/frisch-gestrichen/` | 47 | fehlt | 1 | 0 | nein | 1/0/0 |
| `/2025/09/18/traumhaus/` | 39 | fehlt | 1 | 0 | nein | 1/0/0 |
| `/baldassarre-fortino/` | 58 | 149 | 1 | 1 | ja | 2/2/0 |
| `/datenschutzerklaerung/` | 50 | 122 | 1 | 6 | nein | 0/0/1 |
| `/fabio-fortino/` | 63 | 138 | 1 | 1 | ja | 0/0/0 |
| `/impressum/` | 39 | 114 | 1 | 0 | nein | 0/2/1 |
| `/kontakt/` | 62 | 143 | 1 | 0 | ja | 0/0/1 |
| `/leistungen/` | 47 | fehlt | 1 | 0 | nein | 2/1/2 |
| `/lorenzo-fortino/` | 57 | 140 | 1 | 1 | ja | 0/0/0 |
| `/meisterwerk-exklusive/` | 60 | 149 | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/2021/05/01/masterbad-fugenlos/` | 43 | fehlt | 1 | 1 | nein | 1/0/0 |
| `/meisterwerk-exklusive/2025/05/03/spachteltechnik-fuer-lotter-baederausstellung/` | 68 | fehlt | 1 | 1 | nein | 2/0/0 |
| `/meisterwerk-exklusive/2025/05/22/fugenloses-wohnen/` | 40 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/baldassarre-fortino/` | 44 | fehlt | 1 | 2 | nein | 5/3/0 |
| `/meisterwerk-exklusive/datenschutzerklaerung/` | 45 | fehlt | 1 | 6 | nein | 0/0/1 |
| `/meisterwerk-exklusive/fabio-fortino/` | 38 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/fugenlos/` | 33 | fehlt | 1 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/fugenlose-baeder/` | 40 | fehlt | 1 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/fugenloser-boden/` | 40 | fehlt | 1 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/impressum/` | 34 | fehlt | 1 | 0 | nein | 0/2/1 |
| `/meisterwerk-exklusive/kontakt/` | 32 | fehlt | 1 | 1 | nein | 0/0/2 |
| `/meisterwerk-exklusive/lorenzo-fortino/` | 40 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/partner-sponsoring/` | 45 | 123 | 0 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/projekte/` | 40 | fehlt | 0 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/samet-erenuglu/` | 39 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/spachteltechnik-oberflaechen/` | 52 | fehlt | 1 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/spachteltechniken/` | 42 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/stefano-pulia/` | 38 | fehlt | 1 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/stuckleisten/` | 37 | fehlt | 1 | 0 | nein | 0/0/0 |
| `/meisterwerk-exklusive/studio/` | 31 | fehlt | 0 | 1 | nein | 0/0/2 |
| `/meisterwerk-exklusive/unsere-leistungen/` | 42 | fehlt | 0 | 2 | nein | 0/0/0 |
| `/meisterwerk-exklusive/urlaub/` | 31 | fehlt | 0 | 1 | nein | 0/0/0 |
| `/meisterwerk-exklusive/vincenzo-fortino/` | 41 | fehlt | 1 | 2 | nein | 0/0/0 |
| `/projekte/` | 51 | 153 | 1 | 0 | nein | 4/0/1 |
| `/qualifikationen/` | 57 | 149 | 1 | 0 | ja | 0/0/0 |
| `/reviews/` | 37 | fehlt | 0 | 0 | nein | 0/0/0 |
| `/samet-erenuglu/` | 57 | 157 | 1 | 1 | nein | 0/0/0 |
| `/schnellkontakt/` | 62 | 143 | 1 | 1 | ja | 0/0/2 |
| `/services/glatte-waende/` | 55 | 156 | 1 | 0 | ja | 0/0/1 |
| `/services/lackierarbeiten/` | 61 | 150 | 1 | 0 | ja | 0/0/1 |
| `/services/malerarbeiten/` | 68 | 148 | 1 | 0 | ja | 0/0/1 |
| `/services/tapezieren/` | 66 | 131 | 1 | 0 | ja | 0/0/1 |
| `/services/verputzen/` | 70 | 154 | 1 | 0 | ja | 0/0/1 |
| `/stefano-pulia/` | 60 | 168 | 1 | 1 | ja | 0/0/0 |
| `/studio/` | 72 | 174 | 2 | 4 | ja | 0/0/4 |
| `/urlaubsservice/` | 54 | 137 | 1 | 0 | nein | 0/0/0 |
| `/vincenzo-fortino/` | 65 | 165 | 1 | 1 | ja | 0/0/0 |

Auffälligkeiten aus der Tabelle:

- Titles: 33 Seiten mit " - ", 20 mit " | " als Trenner, Markenname mal "Meisterwerk Malermanufaktur", "Meisterwerk Ludwigsburg", "Meisterwerk LB", "Meisterwerke Exklusive", "Meisterwerk". 11 Titles über 60 Zeichen (Startseite 66, `/studio/` 72, `/services/verputzen/` 70, `/services/malerarbeiten/` 68, Lotter-Beitrag 68).
- Doppelt vergeben: Title und Description von `/kontakt/` und `/schnellkontakt/` (identisch), obwohl die Seiten verschiedene Zwecke haben (Projektanfrage-Assistent und Kontaktseite). Startseite und `/startseite-a/` (Test) teilen Title und Description.
- Descriptions über 160 Zeichen: `/studio/` (174), `/stefano-pulia/` (168), `/vincenzo-fortino/` (165). Ganze Seitengruppen ohne Description: vier der fünf Projektbeiträge (nur Showroom hat eine), `/leistungen/`, die Exklusive-Site bis auf Startseite und Partner.
- `/leistungen/` ist die wichtigste Hub-Seite, hat aber Title "Unsere Leistungen - Meisterwerk Malermanufaktur" ohne Ort, keine Description, 196 Wörter Text.
- H1 fehlt auf `/reviews/` (leere Seite "nichts gefunden", 0 Wörter), `/meisterwerk-exklusive/partner-sponsoring/`, `/meisterwerk-exklusive/projekte/`, `/meisterwerk-exklusive/studio/`, `/meisterwerk-exklusive/unsere-leistungen/`, `/meisterwerk-exklusive/urlaub/` (sie nutzen `PageIntro` mit `headingTag="h2"`, z. B. `pages/meisterwerk-exklusive/unsere-leistungen/index.astro:19,30`). `/studio/` hat zwei H1 (Mobil- und Desktopvariante im DOM: `StudioTeam.astro:158` und `:236`).
- Vor der H1 stehen auf 8 Seiten H6-Eyebrows (Profile, Startseite von Exklusive, `/studio/`), das ergibt Sprünge H1 zu H6.
- Datenschutz (beide Fassungen): H2 zu H4 und H2 zu H5 mehrfach.

### 2.2 Prüfpunkte

| Punkt | Befund | Schwere | Vorschlag |
|---|---|---|---|
| `noindex`-Steuerung | `Layout.astro:11-12,22`: `noindex = import.meta.env.PUBLIC_INDEXABLE !== 'true'` (fail-closed, gut), Meta `noindex, nofollow` auf jeder Seite. Es ist ein Build-Parameter (`PUBLIC_`-Variablen werden beim Build eingesetzt; `.env.example` wird nicht geladen, es braucht `.env` oder Umgebungsvariable der Plattform). Zusätzlich keine `robots.txt`, kein `X-Robots-Tag`. Für Produktion nötig: `PUBLIC_INDEXABLE=true`, `SITE_URL` und `BASE_PATH` leer lassen (Standard `https://meisterwerk-lb.de` und `/`, `astro.config.mjs:6,9`), `nofollow` mit entfernen, Preview-Branches in Cloudflare weiter mit `noindex` bauen oder per `_headers` (`X-Robots-Tag: noindex`) für `*.pages.dev` absichern | hoch | Siehe Top 4; Release-Check per Skript: `grep -r 'noindex' dist` muss leer sein |
| Testseiten | `/stil/` und `/startseite-a/` werden mit `PUBLIC_INDEXABLE=true` indexierbar, `/stil/` hat keine Description und ist verwaist | mittel | Aus Produktion entfernen |
| Canonical | fehlt auf allen Seiten | hoch | `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`, `trailingSlash: 'always'` ist gesetzt (`astro.config.mjs:8`) und alle gebauten Links enden einheitlich auf `/` (0 Abweichungen) |
| Open Graph / Twitter | fehlt vollständig, kein `og:image`-Asset im Projekt, nur `favicon.png` in `public/` | hoch | Siehe Top 2 |
| JSON-LD | nirgends (weder LocalBusiness noch BreadcrumbList, Service, FAQPage). `data/site.ts:1` kündigt es an, enthält Name, E-Mail, Telefon, Adresse, `mapsUrl`, aber keine Koordinaten, keine Öffnungszeiten, keine Social-Links (Instagram/Facebook stehen dreifach hartkodiert in `footer/Social.astro:14,27` und `menu/KontaktPanel.astro:68,76`) | hoch | `site.ts` um `geo`, `openingHours`, `sameAs`, `areaServed`, `vatID` (Impressum: DE295434217) erweitern und daraus ein `HousePainter`-Objekt mit `@id` erzeugen; Leistungsseiten mit `Service` (`provider` per `@id`), Breadcrumbs nur, wenn sichtbar angezeigt (aktuell keine vorhanden). `aggregateRating`: nicht verwenden, siehe nächste Zeile |
| Bewertungs-Badge | "Bestbewerteter Anbieter 2026, 5.0, verifiziert von Trustindex" ist ein statischer Nachbau ohne Trustindex-Widget (`footer/Badge.astro:2,26`, `sections/HeroRating.astro`, Zähler animiert 0,0 auf 5,0) | mittel | Echte Widget-Einbindung oder Hinweis entfernen (Irreführungsrisiko nach UWG); Selbstbewertungen sind für `aggregateRating` bei LocalBusiness nicht zulässig, daher kein JSON-LD dafür |
| FAQPage | 10 Fragen auf der Startseite (`data/faq.ts`), ebenso auf `/meisterwerk-exklusive/` | niedrig | `FAQPage`-JSON-LD ist technisch sinnvoll, bringt in Google für Gewerbe kaum Rich Results mehr; der Link im Antworttext `www.meisterwerke-exklusive.de` ist tot (`data/faq.ts:17`, Tippfehler, 2 Vorkommen) |
| NAP-Konsistenz | Telefon überall `07141 / 23982 90` (53 Seiten) und `tel:+4971412398290` (53 Seiten, einheitlich), E-Mail einheitlich `info@meisterwerk-lb.de`. Abweichungen: Exklusive-Seiten zeigen `07 141 / 23982 90` (26 Seiten; `data/footer.ts:40`, `ContactSection.astro:91`, `kontakt/ContactStrip.astro:18`). Adresse überall "Einsteinstr. 10, 71691 Freiberg", Ortsname ohne "am Neckar" (Impressum, Footer), in Title/H2 der Startseite aber "Freiberg am Neckar". Firmenname: Impressum "Baldassarre Fortino, Meisterwerk", Datenschutz "Meisterwerk", `site.ts` "Meisterwerk Malermanufaktur", Alt "Meisterwerk Maler Manufaktur" (8 Stellen, `Masterly.astro:23`, `data/projects.ts:30`, Leistungstexte), Exklusive "Meisterwerke Exklusive" bzw. "Meisterwerk Exklusive" | mittel | Eine Schreibweise festlegen, mit dem Google-Unternehmensprofil abgleichen (Name, "Freiberg am Neckar", Telefonformat) und überall aus `site.ts` ziehen |
| WhatsApp | `site.ts:8`: Festnetznummer als WhatsApp-Ziel, laut Kommentar noch nicht geklärt | niedrig | Beim Kunden klären |
| sitemap.xml / robots.txt | existieren nicht (`@astrojs/sitemap` nicht installiert, kein `public/robots.txt`) | hoch | `npx astro add sitemap` mit Filter für Testseiten und `/reviews/`; `robots.txt` mit Sitemap-Zeile |
| 404-Seite | fehlt (`src/pages/404.astro` nicht vorhanden) | mittel | Eigene 404 mit Menü und Links zu Leistungen |
| Trailing Slash | konsistent `always`, alle internen Links enden auf `/` | gut | Beim Hosting (Cloudflare Pages) sicherstellen, dass `/seite` auf `/seite/` weiterleitet |
| URL-Struktur | Hub `/leistungen/`, Kinder aber unter `/services/…` (`/services/malerarbeiten/`, `…/tapezieren/`, `…/lackierarbeiten/`, `…/verputzen/`, `…/glatte-waende/`): Sprachmix und Hub passt nicht zu den Unterseiten. Projekte unter Datums-URLs wie `/2025/09/18/frisch-gestrichen/` und `/2021/05/01/kernsanierung/`, Exklusive spiegelt dasselbe unter `/meisterwerk-exklusive/2025/…`. Kontakt: `/kontakt/` ist die Projektanfrage, `/schnellkontakt/` die Kontaktseite (Menüpunkt "Kontakt" führt auf `/schnellkontakt/`, "Projektanfrage" auf `/kontakt/`) | mittel | Die gleichen Adressen wie auf WordPress sind bewusst gewählt (Ranking-Erhalt, `astro.config.mjs:7`), das ist gut. Entscheidung dokumentieren: entweder so lassen oder mit 301 auf `/leistungen/malerarbeiten/` und `/projekte/<slug>/` umziehen. Vor Livegang `_redirects` anlegen (alte Duplikate laut HANDOVER) |
| Ortsseiten | keine. Orte im Fließtext: Marbach und Bietigheim nur auf `/` und `/leistungen/`, Stuttgart nur auf 4 inhaltlichen Seiten (`/`, `/leistungen/`, beide Fassungen von Baldassarre Fortino), Kornwestheim, Remseck, Asperg nirgends; Ludwigsburg auf der Exklusive-Site nur bei zwei Beiträgen und einem Profil. Leistungsseiten nennen den Ort nur in Title, Description und Alt | hoch | Siehe Top 6: Collection `orte` mit je 400 bis 600 Wörtern eigenem Inhalt (Projekte vor Ort, Anfahrt, Besonderheiten, ein Projekt-Beispiel), `Service` plus `areaServed` pro Ort, interne Links vom Hub und aus den Leistungsseiten |
| Google Maps / Unternehmensprofil | Kein Karten-Embed, nur Platzhalterfläche mit Link auf die Kurz-URL `https://maps.app.goo.gl/xUpACLa2gyAQ1G8K7` (`site.ts:13`, `MapPlaceholder.astro`); Bewertungs-Badge verlinkt `share.google/DnitNH9jIeNPjNxgP` (88 Links); ein zweiter Kurzlink `maps.app.goo.gl/TKguvHRLF81DRLoH6` steht im Fuß | mittel | Langform-URL des Unternehmensprofils als `hasMap` und `sameAs` in JSON-LD; Karte als verzögert geladener Embed (Klick-zum-Laden) oder statisches Kartenbild mit Link; NAP exakt wie im Profil |
| Öffnungszeiten | auf keiner Seite vorhanden | mittel | Beim Kunden erfragen, sichtbar auf Kontaktseite und in JSON-LD |
| Hreflang | nicht nötig (nur Deutsch) | neutral | |
| Duplicate Content | Impressum und Datenschutz auf Hauptseite und Exklusive-Site Wort für Wort identisch (25 bzw. 6.202 Wörter, Jaccard 1,00), Profile `/baldassarre-fortino/` zu `/meisterwerk-exklusive/baldassarre-fortino/` 0,70, `/urlaubsservice/` zu `/meisterwerk-exklusive/urlaub/` 0,84, `/studio/` zu Exklusive-Studio 0,45 | mittel | Canonical der Exklusive-Rechtstexte auf die Hauptseite; Profile: Exklusive-Fassung nur kurz halten oder Canonical setzen. Außerdem verlinken 29 Seiten das Footer-Logo auf die externe Domain `https://meisterwerk-exklusive.de/` (`Logos.astro:61`): klären, ob diese Domain weiterlebt oder per 301 auf `/meisterwerk-exklusive/` zeigen soll |
| Dünne Inhalte | Leistungsseiten 350 bis 490 Wörter, `/leistungen/` 196, `/urlaubsservice/` 163, `/qualifikationen/` 203, Beiträge 230 bis 275, Profile 90 bis 280, `/reviews/` 0 | mittel | `/reviews/` entweder mit echten Bewertungen füllen oder `noindex` und aus Sitemap lassen; Leistungsseiten um lokale Abschnitte, Preisfaktoren und Ablauf ergänzen |
| Datenschutz-Altlasten | Text enthält Verweise auf Elementor (4 Links `elementor.com`), Cloudflare, TidyCal, obwohl die Seite nach Umzug Astro nutzt | niedrig | Rechtstext vom Kunden bzw. Datenschutzbeauftragten prüfen lassen |

## 3. Links

Methodik: alle 53 Seiten, alle `<a href>` (Menü, Fuß, Inhalt). Basis-Pfad und Anker berücksichtigt (`id` und `name` im Zielbaum).

| Prüfung | Ergebnis | Schwere |
|---|---|---|
| Defekte interne Links (Datei fehlt) | 0 | gut |
| Fehlende Anker (`#id`) | 0 (nur `href="#"` an Fußzeile "© 2026 Meisterwerke", `footer/Copyright.astro:10`, und "Nach oben", sowie `nav.ts:68` Menüpunkt "Oberflächen" als Platzhalter) | niedrig |
| Links auf alte Domain `meisterwerk-lb.de` | 60: 48 mal `https://meisterwerk-lb.de/meisterwerk-exklusive/kontakt-2/` (Menüpunkt "Kontakt" der Exklusive-Site, `data/nav.ts:80`, auf 24 Seiten); 12 mal Kategorie-Links `…/meisterwerk-exklusive/category/portfolio/{spachteltechnik,fugenloses-bad,fugenloser-boden}/` (`data/pages/exklusive-posts.ts:18,26`, `content/exklusiv-beitraege/*.json` Zeile 9); alle ohne eigenes Ziel im Astro-Bau (`href()` fällt auf `ORIGIN` zurück, `links.ts:146,203-209`). Nach dem DNS-Wechsel wären es 404er auf der eigenen Domain | hoch (Livegang) |
| Link auf zweite Domain | `https://meisterwerk-exklusive.de/` 29 mal auf 29 Seiten (Footer-Logo, `Logos.astro:61`), ohne `rel`; dazu Textlink `www.meisterwerke-exklusive.de` (tot, `faq.ts:17`) | mittel |
| `target="_blank"` ohne `noopener` | 0. Von 715 externen Links (WhatsApp, Maps, Social, Partner, Rechtstext, alte Domain) haben alle mit `target="_blank"` ein `noopener`, Rechtstext-Links zusätzlich `nofollow` | gut |
| Externe Links ohne `rel` | nur die 29 Links auf `meisterwerk-exklusive.de` (kein `target`, eigene Domain) | niedrig |
| Partner/Sponsoring | `/meisterwerk-exklusive/partner-sponsoring/` verlinkt ca. 30 Fremdfirmen mit `rel="noopener noreferrer"`, aber ohne `nofollow`/`sponsored` | niedrig |
| Selbstverlinkung | Beiträge `…/masterbad-fugenlos/` (2 Links, davon 1 Bild) und `…/spachteltechnik-fuer-lotter-baederausstellung/` (4 Links) verlinken sich über "Related" selbst (`PostRelated.astro:28`). Auf der Startseite ist der Logo-Link im Hero (`Header` in `<main>`) ein Link auf sich selbst | mittel |
| Autolink erzeugt Selbstlinks | nein: `autolink.ts:74` filtert das eigene Ziel (`path !== here`) und `done` wird aus bereits vorhandenen Links im `<main>` gefüllt (`:80-81`) | gut |

### 3.1 Auto-Verlinkung (`src/lib/autolink.ts`, 17 Ziele)

Regeln: nur `p`, `li`, `blockquote` (oder Text ab 80 Zeichen direkt im `div`) im `<main>`, nie in Überschriften, Links, Buttons, `nav`, `header`, `footer`, `dl`; je Ziel höchstens ein Link je Seite, höchstens 6 Links je Seite (`:59`); nicht auf Impressum, Datenschutz, Kontakt, Schnellkontakt (`:69`); Exklusive verlinkt nur in sich.

Ergebnis im Build (51 Seiten ohne Testseiten): 46 Autolinks auf 21 Seiten; 30 Seiten ohne Autolink; Verteilung je Seite 0 (30 Seiten), 1 (8), 2 (6), 3 (3), 4 (3), 5 (1). Obergrenze 6 wird nie erreicht.

| Ziel | Autolinks | Ankertexte |
|---|---|---|
| `/meisterwerk-exklusive/spachteltechniken/` | 7 | "Spachteltechniken", "Spachteltechnik" |
| `/2025/05/03/unser-showroom/` | 8 | "Showroom" |
| `/studio/` | 7 | "Unser Team", "unser Team" |
| `/meisterwerk-exklusive/stuckleisten/` | 5 | "Stuckarbeiten" (4), "Stuckleisten" (1) |
| `/baldassarre-fortino/` | 5 | "Malermeister Baldassarre Fortino" (4), "Meister Baldassarre Fortino" (1) |
| `/qualifikationen/` | 3 | "Meisterbetrieb" |
| `/services/glatte-waende/` | 4 | "Glatte Wände", "glatten Wänden", "Glatte/glatte Oberflächen" |
| `/meisterwerk-exklusive/kontakt/` | 3 | "Beratungsgespräch" |
| `/meisterwerk-exklusive/fugenlose-baeder/` | 1 | "fugenlose Bäder" |
| `/services/malerarbeiten/`, `/services/tapezieren/`, `/services/lackierarbeiten/` | je 1 | "Malerarbeiten", "Tapezierarbeiten", "Lackierarbeiten" |
| `/services/verputzen/`, `/urlaubsservice/`, `/projekte/`, `/meisterwerk-exklusive/fugenloser-boden/` | 0 | Muster greifen im vorhandenen Text nicht |

Bewertung:

| Befund | Schwere | Vorschlag |
|---|---|---|
| Ankertexte sind überwiegend gut und beschreibend (Leistungsnamen, Eigennamen). Schwach: "Unser Team" (7 mal, generisch), "Showroom" (8 mal, zeigt auf einen Datums-Beitrag statt auf eine Showroom-Seite), "Beratungsgespräch" auf Kontakt | niedrig | "Unser Team" nur als Teil eines längeren Satzes verlinken oder Regel streichen; Showroom-Seite mit eigener URL erwägen |
| Die Kernseiten für lokales SEO werden kaum gespeist: Leistungsseiten bekommen je 1 Autolink (`verputzen` 0), `/leistungen/` bekommt keinen einzigen Inhalts-Link, `/urlaubsservice/` keinen | mittel | Zusätzliche Ziele aufnehmen ("Innenanstrich", "Fassadenanstrich", "Wärmedämmung/WDVS" auf `/2025/05/22/altbau-wdvs/`, "Schimmel", "Farbberatung", Ortsnamen auf die künftigen Ortsseiten), `Urlaubsservice` greift wegen Schreibung/Position nicht |
| Nur erste Nennung je Ziel, maximal 6: kein Over-Linking (höchste Zahl real 5) | gut | |
| Regex-Risiko: `Lackieren` und `Tapezieren` am Satzanfang als Verb werden verlinkt, `Referenzen`/`Meisterbriefe?` usw. sind eng gefasst | niedrig | Bei neuen Texten stichprobenartig prüfen |
| Autolink wirkt nur in Fließtext; Karten, Tabs, Akkordeons (Skills, FAQ-Antworten) sind `div`/`dd` ohne Treffer | niedrig | FAQ-Antworten bewusst manuell verlinken (`data/faq.ts` unterstützt `{ text, href }`) |

### 3.2 Linkgraph (eingehende Links, ohne Selbstlinks)

"Eingehend gesamt" zählt Quellseiten inklusive Menü und Fuß (die Menüs liegen auf jeder Seite doppelt, Desktop und Handy), "Inhaltsbereich" nur Links innerhalb von `<main>`. Sortiert nach Inhaltslinks aufsteigend. Quellen enthalten auch die zwei Testseiten.

Verwaiste Seiten (null eingehende Links): `/reviews/` (leer, auch kein Link im Menü), `/startseite-a/` und `/stil/` (Test). Fast verwaist, nur über Menü/Fuß erreichbar: `/leistungen/`, `/urlaubsservice/`, `/impressum/`, `/datenschutzerklaerung/`, `/schnellkontakt/`, `/meisterwerk-exklusive/{studio,urlaub,unsere-leistungen,fugenlos,spachteltechnik-oberflaechen}/`. Die sechs Exklusive-Profile bekommen je nur einen Inhaltslink.

| Seite | Eingehend gesamt (Seiten) | Davon aus dem Inhaltsbereich | Davon Autolink | Ausgehend im Inhaltsbereich |
|---|---|---|---|---|
| `/reviews/` | 0 | 0 | 0 | 0 |
| `/meisterwerk-exklusive/datenschutzerklaerung/` | 23 | 0 | 0 | 0 |
| `/meisterwerk-exklusive/fugenlos/` | 23 | 0 | 0 | 0 |
| `/meisterwerk-exklusive/impressum/` | 23 | 0 | 0 | 0 |
| `/meisterwerk-exklusive/spachteltechnik-oberflaechen/` | 23 | 0 | 0 | 1 |
| `/meisterwerk-exklusive/studio/` | 23 | 0 | 0 | 6 |
| `/meisterwerk-exklusive/unsere-leistungen/` | 23 | 0 | 0 | 8 |
| `/meisterwerk-exklusive/urlaub/` | 23 | 0 | 0 | 0 |
| `/datenschutzerklaerung/` | 28 | 0 | 0 | 0 |
| `/impressum/` | 28 | 0 | 0 | 0 |
| `/leistungen/` | 28 | 0 | 0 | 12 |
| `/schnellkontakt/` | 28 | 0 | 0 | 0 |
| `/urlaubsservice/` | 28 | 0 | 0 | 1 |
| `/meisterwerk-exklusive/partner-sponsoring/` | 52 | 0 | 0 | 0 |
| `/meisterwerk-exklusive/baldassarre-fortino/` | 1 | 1 | 0 | 1 |
| `/meisterwerk-exklusive/fabio-fortino/` | 1 | 1 | 0 | 0 |
| `/meisterwerk-exklusive/lorenzo-fortino/` | 1 | 1 | 0 | 0 |
| `/meisterwerk-exklusive/samet-erenuglu/` | 1 | 1 | 0 | 0 |
| `/meisterwerk-exklusive/stefano-pulia/` | 1 | 1 | 0 | 0 |
| `/meisterwerk-exklusive/vincenzo-fortino/` | 1 | 1 | 0 | 0 |
| `/` | 52 | 1 | 0 | 13 |
| `/meisterwerk-exklusive/` | 52 | 1 | 0 | 10 |
| `/2021/05/01/kernsanierung/` | 2 | 2 | 0 | 5 |
| `/meisterwerk-exklusive/fugenloser-boden/` | 52 | 3 | 0 | 5 |
| `/services/verputzen/` | 52 | 3 | 0 | 5 |
| `/2025/05/22/altbau-wdvs/` | 4 | 4 | 0 | 3 |
| `/2025/09/18/frisch-gestrichen/` | 4 | 4 | 0 | 3 |
| `/2025/09/18/traumhaus/` | 4 | 4 | 0 | 4 |
| `/meisterwerk-exklusive/kontakt/` | 23 | 4 | 3 | 0 |
| `/qualifikationen/` | 28 | 4 | 4 | 4 |
| `/meisterwerk-exklusive/fugenlose-baeder/` | 52 | 4 | 1 | 8 |
| `/services/lackierarbeiten/` | 52 | 4 | 1 | 6 |
| `/services/malerarbeiten/` | 52 | 4 | 1 | 5 |
| `/services/tapezieren/` | 52 | 4 | 1 | 4 |
| `/fabio-fortino/` | 6 | 6 | 0 | 6 |
| `/lorenzo-fortino/` | 6 | 6 | 0 | 6 |
| `/samet-erenuglu/` | 6 | 6 | 0 | 6 |
| `/stefano-pulia/` | 6 | 6 | 0 | 6 |
| `/vincenzo-fortino/` | 6 | 6 | 0 | 6 |
| `/meisterwerk-exklusive/projekte/` | 23 | 6 | 0 | 5 |
| `/meisterwerk-exklusive/2025/05/22/fugenloses-wohnen/` | 7 | 7 | 0 | 6 |
| `/projekte/` | 28 | 7 | 0 | 8 |
| `/services/glatte-waende/` | 52 | 7 | 4 | 4 |
| `/meisterwerk-exklusive/stuckleisten/` | 52 | 8 | 5 | 6 |
| `/meisterwerk-exklusive/2021/05/01/masterbad-fugenlos/` | 9 | 9 | 0 | 13 |
| `/meisterwerk-exklusive/2025/05/03/spachteltechnik-fuer-lotter-baederausstellung/` | 9 | 9 | 0 | 12 |
| `/baldassarre-fortino/` | 11 | 11 | 5 | 7 |
| `/meisterwerk-exklusive/spachteltechniken/` | 52 | 11 | 8 | 6 |
| `/2025/05/03/unser-showroom/` | 12 | 12 | 8 | 5 |
| `/studio/` | 28 | 13 | 7 | 6 |
| `/kontakt/` | 32 | 18 | 0 | 0 |

Empfehlungen: Leistungsseiten um einen Block "Weitere Leistungen" mit Verlinkung aller Geschwister erweitern, in jeder Leistungsseite und Startseite auf `/leistungen/` und die Ortsseiten verlinken, in Projektbeiträgen die genutzte Leistung und den Ort verlinken (`services` und `info.place` aus der Collection sind bereits Daten).

## 4. Bilder

Alle 53 Seiten: 1.096 AVIF- und 1.461 WebP-Dateien im Build (`_astro/`), alle Inhaltsbilder laufen über `<Picture>` mit AVIF-Source und WebP-Fallback, `decoding="async"`, `sizes` gesetzt. Die Browser laden AVIF (525 von 525 gemessenen Bildern).

| Prüfung | Ergebnis | Schwere | Vorschlag |
|---|---|---|---|
| `alt` vorhanden | Bei allen `<img>` vorhanden (0 ohne Attribut). Leer (`alt=""`) 61 mal auf 25 Seiten, davon bewusst dekorativ: Hero-Streifen, Zierbilder. Nicht dekorativ gemeint, aber leer: Projektgalerien in `sections/Gallery.astro:68` (Lightbox-Raster der Beiträge, besonders `/meisterwerk-exklusive/2021/05/01/masterbad-fugenlos/` mit 13 leeren Alts, Lotter-Beitrag 11) | mittel | Alt-Texte pro Bild in den Collection-JSONs (`gallery` als Objekte `{ image, alt }`) |
| `alt` aussagekräftig | Gut: Startseiten- und Leistungsbilder (z. B. "Helle Treppe mit Holzstufen und perfekt glatten, weiß gestrichenen Wänden"), Oberflächenmuster, Zertifikate. Schwach: alle Bilder eines Beitrags tragen denselben Alt (`ProjectPage.astro:91,136,156`: "Traumhaus" 20 mal, "Kernsanierung" 17, "Unser Showroom" 9, "Frisch Gestrichen" 7, "Altbau WDVS" 4), Exklusive-Galerien "Fugenlose Bäder von Meisterwerke Exklusive" 21 mal, "Spachteltechniken von Meisterwerke Exklusive" 21, "Stuckleisten von …" 15; Leistungsgalerie `ServiceGallery.astro:44` setzt einen Alt für alle ("Malerarbeiten bei Meisterwerk" 8 mal auf einer Seite) | mittel | Pro Bild beschreiben, Ort und Leistung einmal nennen, nicht wiederholen |
| Tippfehler im Logo-Alt | "Meisterwerk Malermanufaktur by Baldasarre Fortino" (58 Vorkommen auf 29 Seiten, `header/Brand.astro:32`, `footer/Logos.astro:43`), daneben die richtige Schreibung "Baldassarre" in `Logos.astro:55` und Exklusive-Fassungen | mittel | Korrigieren, besser nur "Meisterwerk Malermanufaktur" (Logo-Alt soll den Markennamen tragen, nicht "by …") |
| Logo als Bitmap | PNG 779x239 (13 KB Quelle), Anzeige 128 bis 178 px | niedrig | Als SVG liefern |
| `width`/`height` (CLS) | Gesetzt bei allen Bildern der Pipeline. Ausnahmen: Hero-Standbild `hero-flug/d/000.webp` (`Hero.astro:49-52`, absolut positioniert, daher ohne CLS), Lightbox-Bild (`Gallery.astro:127`, per Skript) | niedrig | Kein Handlungsbedarf |
| `loading` / `fetchpriority` | Lazy für alle unter der Falz; `eager` für Logo und je Seite 1 bis 2 Kopfbilder. `fetchpriority="high"` nur im Hero der Startseite (`Hero.astro:53`) und in nicht genutzten bzw. Testkomponenten (`PageHero.astro:41`, `HeroSlider.astro:48`, `HeroFull.astro:34`). Gemessene LCP-Elemente: Startseite Desktop Hero-Frame `000.webp` (fetchpriority gesetzt, gut), Startseite mobil H1-Text; `/leistungen/` mobil ein `loading="lazy"`-Bild (`337-meisterwerk-20230120-2-scaled…avif`, erstes Karten-Bild: LCP mit Lazy-Attribut verzögert); `/services/malerarbeiten/` Desktop und mobil `216-meisterwerk-20230120-Bearbeitet-1-scaled…` mit `loading="eager"`, aber ohne `fetchpriority` | mittel | Erstes sichtbares Bild jeder Seite (`PostArticle.astro:58`, `ProfileHero.astro:34`, `ProfileTemplate.astro:99`, `ProjectPage.astro:94`, `WelcomeScroll.astro:122`, Leistungsbilder) mit `fetchpriority="high"`; in `LeistungenOverview.astro:90` das erste Bild auf `eager` |
| Formate | AVIF + WebP-Fallback im Auslieferungsweg, kein JPEG/PNG in einem HTML referenziert. Aber: `dist/_astro` enthält 141 JPG-Originale (48 MB) und 1 PNG, die von keiner Seite verwendet werden, dazu 1.461 WebP-Fallback-Dateien (75 MB) neben 1.096 AVIF (17 MB). Gesamtausgabe 169 MB, davon 19 MB Hero-Frames | niedrig | Ungenutzte Original-Assets nicht deployen (Build-Schritt, der `_astro/*.{jpg,png}` ohne Verweis löscht, oder Bilder über `public/`-freie Pfade einbinden); WebP-Fallback auf weniger Breiten begrenzen |
| `sizes` | Auf allen `Picture` gesetzt (z. B. `(min-width: 1760px) 840px, (min-width: 1025px) calc(50vw - 40px), calc(100vw - 40px)`). Ein Bild je Startseite und Testseite ohne `sizes` (Hero-Frame, kein Problem) | gut | |
| Gerenderte vs. intrinsische Breite (tatsächlich geladene Datei, Browser wählt AVIF; Faktor = Dateibreite / (CSS-Breite x DPR)) | Desktop 1440 px: Median 1,11; 217 von 525 Bildern über 1,25; 15 über 1,5; 1 über 2,0; geschätzte Überlieferung 329 KB von 3.940 KB. Mobil 390 px (DPR 2): Median 1,20; 179 von 516 über 1,25; 17 über 1,5; 0 über 2; geschätzt 615 KB von 5.487 KB. Spitzen: Exklusive-Profilfotos 960 px bei 480 px Anzeige (Faktor 2,0 am Desktop), `/leistungen/` Karten 700 px bei 416 px (1,68), Oberflächenmuster auf `/meisterwerk-exklusive/spachteltechnik-oberflaechen/` 790 px bei 310 px mobil (je 50 bis 90 KB). Zu klein: `Papa-Vincenzo-Fortino` Quelle 438 px bei 674 px Anzeige (Faktor 0,65), Galerien von `masterbad-fugenlos` 480 px bei 675 px (0,71, sichtbar unscharf) | niedrig | `widths`-Listen bei Profil- und Mustern verfeinern (z. B. 480/720); schwache Quellbilder (`Image-20…26.jpg`, 480 px) austauschen |
| Bildgewicht je Seite nach vollständigem Scrollen | Spitzenwerte: `/meisterwerk-exklusive/spachteltechnik-oberflaechen/` 697 KB mobil (22 Bilder), Startseite 322 KB mobil und 168 KB Desktop (ohne Hero-Frames), `/leistungen/` 152 KB mobil, `/services/malerarbeiten/` 110 KB mobil, einfache Seiten 12 bis 27 KB | gut | |
| Hintergrundbilder per CSS | siehe 1.1 (3 Komponenten, 217 KB WebP, nicht responsiv) | mittel | `Picture` |
| Dateinamen | Quellen und Auslieferung tragen Kamera-/WordPress-Namen: `216-meisterwerk-20230120-Bearbeitet-1-scaled-e1758184263171`, `Image-23.jpg`, `44.jpg`, `Papa-Vincenzo-Fortino-e1753863670297`, `IMG`/`ORO-19-1024x1024` | mittel | Sprechende Namen vergeben, z. B. `maler-ludwigsburg-treppenhaus-wandgestaltung.jpg`; da Astro den Namen mit Hash übernimmt, bleibt er in der URL erhalten |
| Bilder außerhalb der Pipeline | Nur `public/favicon.png` und `public/hero-flug/{d,m}` (386 Frames, 19 MB, davon je Gerät 193 geladen) | mittel | Siehe Top 1; Favicon zusätzlich als SVG/ICO und Apple-Touch-Icon |
| Redundante Bilddateien | 16 identische Gruppen, 5,7 MB (siehe 1.1) | niedrig | |

## 5. Performance (Playwright, lokal, unkomprimiert)

Gemessen wird die Übertragung ohne Kompression (lokaler Python-Server). Schätzung "gzip" setzt HTML und JS auf gzip Stufe 6, Bilder und Schriften unverändert. "Initial" = bis 3 s nach `load`, "Gesamt" = nach vollständigem Durchscrollen in 70-%-Schritten.

| Seite | Viewport | Requests initial / gesamt | Bytes initial / gesamt (roh) | Bytes gesamt (gzip-Schätzung) | HTML roh / gzip | JS roh / gzip | Bilder | LCP-Element | CLS nach Scrollen | ScrollTrigger (nach Laden / nach Scrollen) |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 1440 | 212 / 224 | 14,54 / 14,67 MB | 13.953 KB | 323 / 46 KB | 150 / 57 KB | 13.786 KB (davon Hero-Frames 13,73 MB) | `IMG` `hero-flug/d/000.webp` | 0,366 (in separatem Lauf 0,418) | 35 / 8 |
| `/` | 390 | 210 / 224 | 5,82 / 6,08 MB | 5.571 KB | 323 / 46 KB | 150 / 57 KB | 5.404 KB (Hero-Frames 4,99 MB) | `H1` | 0,837 (separat 0,821) | 43 / 2 |
| `/leistungen/` | 1440 | 21 / 21 | 0,59 / 0,59 MB | 292 KB | 230 / 35 KB | 146 / 55 KB | 137 KB | `H1` | 0 | 16 / 7 |
| `/leistungen/` | 390 | 19 / 20 | 0,59 / 0,60 MB | 298 KB | 230 / 35 KB | 146 / 55 KB | 144 KB | `IMG` (lazy) `337-meisterwerk-…avif` | 0 | 14 / 4 |
| `/services/malerarbeiten/` | 1440 | 18 / 22 | 0,53 / 0,55 MB | 249 KB | 236 / 38 KB | 148 / 56 KB | 91 KB | `IMG` `216-meisterwerk-…avif` (eager, ohne fetchpriority) | 0 | 14 / 5 |
| `/services/malerarbeiten/` | 390 | 20 / 22 | 0,55 / 0,57 MB | 268 KB | 236 / 38 KB | 148 / 56 KB | 110 KB | `IMG` `216-meisterwerk-…avif` | 0 | 13 / 1 |
| `/kontakt/` | 1440 | 11 / 11 | 0,48 / 0,48 MB | 171 KB | 238 / 37 KB | 155 / 58 KB | 12 KB | `P` (Textblock) | 0,036 | 5 / 5 |
| `/kontakt/` | 390 | 11 / 11 | 0,50 / 0,50 MB | 186 KB | 238 / 37 KB | 155 / 58 KB | 27 KB | `P` | 0 | 3 / 3 |
| `/projekte/` | 1440 | 11 / 17 | 0,69 / 0,82 MB | 521 KB | 226 / 35 KB | 145 / 55 KB | 368 KB | `P` | 0 | 22 / 6 |
| `/projekte/` | 390 | 10 / 16 | 0,68 / 0,77 MB | 475 KB | 226 / 35 KB | 145 / 55 KB | 321 KB | `P` | 0 | 19 / 3 |

Weitere Messwerte: kein horizontaler Scroll in allen 10 Läufen, keine Konsolenfehler, keine 4xx/5xx, Schriften 2 Dateien mit 63 KB.

Bewertung: Alle Unterseiten sind mit 170 bis 520 KB (gzip geschätzt) sehr leicht. Die Startseite ist durch die Hero-Bildfolge um den Faktor 25 bis 50 schwerer, belastet mobile Tarife und konkurriert beim Laden mit den eigentlichen Bildern (Priorität nicht gesteuert, 6 parallele Verbindungen ab Skriptstart). Die CLS der Startseite liegt weit über dem Grenzwert 0,1 und stammt aus den Layout-Tweens des Heros (siehe 1.3). Auf `/leistungen/` und den Leistungsseiten ist der LCP ein Bild, das nicht priorisiert bzw. sogar lazy geladen wird.

## Was schon gut ist

- Keine toten internen Links, keine fehlenden Anker, einheitlicher Trailing Slash, keine doppelten IDs, keine leeren Links.
- Alle externen Links mit `target="_blank"` tragen `rel="noopener"`; Rechtstext-Links zusätzlich `nofollow`.
- Bild-Pipeline vorbildlich: AVIF mit WebP-Fallback, `srcset` mit 3 bis 4 Breiten, passende `sizes`, `width`/`height` an allen Bildern, `loading="lazy"` unterhalb der Falz; Bildgewicht je Unterseite meist unter 200 KB.
- Schriften selbst gehostet (Astro Fonts API), `font-display: swap`, Fallback-Metriken, Preload; keine Fremdserver für Schriften.
- Kein Fremd-Tracking, kein Karten-Embed, Bewertungs-Badge ohne Fremdskript: gute Datenschutzbasis.
- `lang="de"`, eine `main`-Landmarke, `aria-label` an Logo-Links und Icon-Buttons, einheitliche Telefon-/E-Mail-Links (`tel:+4971412398290`, `mailto:`), durchgängig ein H1 auf den inhaltlichen Hauptseiten.
- Titles und Descriptions der zentralen Seiten (Startseite, Leistungen /services/, Projekte, Qualifikationen, Kontakt) sind individuell, nennen Leistung und Ort und liegen meist im Längenrahmen.
- Beitrags-, Profil- und Leistungsdaten liegen in Content Collections mit Zod-Schema und geprüften Bildpfaden; Links laufen zentral über `href()`.
- Auto-Verlinkung ist vorsichtig (max. 6, erste Nennung, nie auf sich selbst, nie in Überschriften, Rechtstexten, Navigation) und erzeugt keinen Over-Linking-Effekt.
- GSAP: Plugins einmal registriert, `matchMedia`-Kontexte räumen auf, Bewegungsreduzierung wird in den Scroll-Szenen und bei Lenis beachtet, `will-change` sparsam.
- Gleiche Adressen wie die alte WordPress-Seite (`trailingSlash: 'always'`, Datums-URLs erhalten) schützen vorhandenes Ranking.
- `noindex` ist fail-closed: ohne gesetzte Variable bleibt die Seite gesperrt.
- Klassenduplikate im Markup sind selten, es gibt einen einzigen Button (`ui/Button.astro`) und ein Typografie-Token-System.
