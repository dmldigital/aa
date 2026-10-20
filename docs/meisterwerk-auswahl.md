# Vorschau Meisterwerk (Auswahl): Übergabe

Live: https://dmldigital.github.io/aa/meisterwerk-preview-auswahl/
Ordner: `website/public/meisterwerk-preview-auswahl/` (nur `index.html` + `_astro/`).
Werkzeuge und Tests: `tools/meisterwerk-auswahl/` (siehe dort README).

## Wichtig zuerst
- **Es gibt keinen Astro-Quellcode.** Die Seite ist ein gebauter Stand der Original-Seite von Meisterwerk Malermanufaktur
  (Freiberg am Neckar). `index.html` (inline Tailwind-CSS, Markup) und die eigenen Dateien in `_astro/` werden **direkt
  bearbeitet**. Die Original-Skripte mit Hash im Namen (`gsap.*.js`, `motion.*.js`, `Hero…js`, `Menu…js`, `Layout…js`, …)
  sind minifiziert; nur `WelcomeScroll.astro_astro_type_script_index_0_lang.n8bjhO38.js` wurde von uns angepasst.
- **Die Quelle der Wahrheit ist der Repo-Stand.** Frühere Erzeugungsskripte (`gen.py`) existieren nicht mehr; spätere
  Änderungen an `index.html` wurden von Hand gemacht.
- **Nach jeder Änderung an eigenen CSS/JS:** `python3 tools/meisterwerk-auswahl/bust.py`, dann committen. Sonst sehen
  Browser (GitHub Pages: `max-age=600`) alte Fassungen.
- **Deploy:** Workflow `.github/workflows/deploy-website.yml` läuft nur bei Push auf `claude/poolbau-koch-website-408frj`
  (Pfade `website/**`). Arbeitsbranch ist `claude/admiring-gates-cn5mu9`; Pushes immer auf beide:
  `git push origin claude/admiring-gates-cn5mu9` und `git push origin claude/admiring-gates-cn5mu9:claude/poolbau-koch-website-408frj`.
  Nach dem Push 1 bis 2 Minuten warten, bis die neue `?v=`-Nummer live ist.
- Zusammenarbeit: Deutsch, ohne Gedankenstriche in neuen Texten (Komma, Doppelpunkt), keine Nummerierung in Menüs.
  Ergebnisse immer über GitHub Pages zeigen. Der schwebende Button „Projekt starten“ (unten links) wurde bewusst nicht angefasst.

## Eigene Dateien (`_astro/`)
| Datei | Zweck |
|---|---|
| `LeistungenStack.css/js` | **Streifenabstand wird in `u()` berechnet**, damit die letzte Karte rechts denselben Randabstand hat wie die Überschrift links (Desktop/Tablet). Leistungen als gestapelte weiße Karten (1 px Rahmen, kein Schatten), Hover-Zoom 1,05, Link-Icon-Kreis. Letzte Karte = Logo-Box „Meisterwerk Exklusive“ |
| `TabsFade.css/js` | **Zwei Sektionen mit `[data-tb]`:** (1) „Meisterliche Malerarbeiten“ (Pin, Slides), (2) FAQ (`data-tb-accordion`, aufklappbare Tabs) |
| `HeaderLock.css/js` | Sperrt den Sticky-Header in Zonen mit `data-header-lock` (Hero, Willkommen, Leistungen, Fachsektion, Bild/CTA, Projekte-Überlagerung) |
| `CtaReveal.css/js` | „Jede Oberfläche ist einzigartig“: Parallax, Pin, CTA-Box + Kontaktformular-Box, Projekte schieben sich darüber |
| `FaqCover.js` | FAQ schiebt sich von unten über „Unsere Exklusive Projekte“ (Sticky + Wrapper-Höhe), FAQ hat Mindesthöhe der Projekte |
| `WelcomeChain.css/js` | Willkommens-Sektion: H2, Absätze, Link, Schlusssatz kommen verzögert nacheinander hoch („Kette“); Schlusssatz ist ein Zitat in „…“ |
| `WelcomeZoom.css/js` | Desktop: letztes Bild der Willkommens-Sektion zoomt mit Pin auf Vollbild, 24 px Rand (wie Hero-Ende) |
| `WelcomeScroll.astro_…n8bjhO38.js` | Original-Skript, angepasst: Handy/Tablet-Bildstapel wächst am Ende auf Vollbild (12 px Rand), Schlusssatz-Animation entfernt |

Alle laden `gsap.CvDoa17S.js` und `motion.B5Hf7-lS.js` (ScrollTrigger-Klasse = Export `r`):
`import { t as gsap } from "./gsap.CvDoa17S.js"; import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";`

## Sektionen und Verhalten
1. **Willkommen (unter dem Hero)**: Beim Hereinscrollen laufen die „Kette“ (Abstände 0 / 0,3 / 0,2 / 0,2 / 0,22 / 0,42 s, Dauer 1,3 s, `power3.out`, spätere
   Glieder +16 px mehr Weg). Danach Bildwechsel (Desktop: Bilder laufen unter dem stehenden Text; Handy: Stapel mit Pin). Am Ende zoomt das letzte
   Bild auf Vollbild (Desktop ab 1025 px mit 24 px Rand und Pin über 0,9 Bildschirmhöhen; Handy 12 px Rand im bestehenden Pin, Pin-Ende `+=260%`).
   Die Textspalte blendet beim Zoom aus. **Die drei Bilder haben keine Eingangsanimation** (weder Aufrollen noch Zoom beim Hereinkommen ins Bild, vom Nutzer nicht gewünscht); der Zoom des letzten Bildes auf Vollbild bleibt dagegen ausdrücklich erhalten. Reduzierte Bewegung: nichts davon.
2. **Leistungen** (`.lk`): gestapelte Karten, Texte lokal SEO-optimiert (Freiberg, Ludwigsburg, Marbach, Bietigheim-Bissingen, Stuttgart).
3. **Meisterliche Malerarbeiten** (`[data-tb]`, ohne `data-faq`): Ab 1200 px Breite und 600 px Höhe gepinnt (`.tb--pin`, Sektionshöhe per JS = 1 Bildschirm + Zeitplan).
   Statt des Bildes (`.tb-media` im Pin ausgeblendet) steht am linken Rand der Bühne ein feststehender Trennstrich (`.tb-line`, per JS eingefügt,
   Höhe per JS: höchster Tab-Text plus 16 % Bildschirmhöhe, höchstens bis 24 px vor den Bildschirmrand, liegt in `.tb-right`, Enden per Maske weich auslaufend, rechts nur angedeuteter Schatten 6 px / 5 % als Erhebung). Wechsel (scroll-gesteuert, rückwärts genauso): Der Text gleitet nur 21 % der Fensterbreite (max. 300 px) von links unter dem Strich hindurch nach rechts heraus und blendet dabei ein (`.tb-view` schneidet per `clip-path` nur links am Strich ab). Beim Tab-Wechsel gleitet der alte Text nach rechts und blendet aus, der neue beginnt überlappend, sobald der alte halb draußen ist. Tempo: 0,3 px Bewegung je Scroll-Pixel (`SPEED` in `TabsFade.js`), der Referenzwert ist der Bilderstreifen im Hero mit 0,2. Text passt immer in 100vh (`--tb-s`, Mindestmaßstab 0,62, iteratives Messen in `fitPanels`).
   Darunter (Handy, Tablet, reduzierte Bewegung, flache Fenster): aufklappbare Tabs, erster Tab offen.
   Typografie im Seitensystem: Urbanist für Überschriften/Labels, Fließtext in der Seitenschrift (15/22,5, Schwarz 70 %), goldene Chevrons, keine Linien in den Tab-Texten.
4. **Bild + Linien + CTA-Box + Kontaktformular** (`.mz`): Parallax, Pin, CTA von links, Kontaktbox (weiß, ohne senkrechte Linien) läuft unter der CTA-Box durch,
   Stopp, Kontaktbox nach rechts raus, zeitversetzt und schneller folgt die CTA nach links (beide verschwinden kurz hintereinander), dann schiebt sich „Unsere Exklusive Projekte“ darüber.
5. **Unsere Exklusive Projekte** (`[data-ep]`): bleibt stehen (Sticky), das FAQ schiebt sich darüber.
6. **FAQ**: kein Scroll-Effekt. Zweispaltig 50/50 (je 5 Fragen), aufklappbare Tabs, **immer nur ein Tab offen (spaltenübergreifend), zu Beginn alle geschlossen**.
   Plus wird Minus, goldener Strich über der Oberkante, Inhalt gleitet ein. Unter 768 px eine Spalte. Kein Hausbild mehr.

## Stolpersteine (bitte beachten)
- **ScrollTrigger-Reihenfolge:** Pins weiter oben auf der Seite verschieben alles darunter. Der Zoom-Pin (`WelcomeZoom.js`) hat deshalb `refreshPriority: 10`.
  Neue Pins weiter oben ebenso auszeichnen und danach `cta2.cjs`, `cover2.cjs`, `slide.cjs` laufen lassen.
- **Header-Sperre:** Zonen per `data-header-lock`; bei Pin-/Überlagerungs-Sektionen eigene Sperrzone (`.mz-lockzone`, `.ep-lockzone`) mit passender Höhe.
- **Überlauf vermeiden:** Nach Änderungen `overflow.cjs` und `fit.cjs` laufen lassen (kein horizontales Scrollen, Fachsektion passt in 100vh). Die gemeldeten
  `TH scrollWidth`-Treffer ab 600 px Breite sind die absichtlich unsichtbare Tabellenkopfzeile auf dem Handy.
- **Tab-Typografie nutzt `em`:** `--tb-s` skaliert alles in `.tb-inner`. Neue Größen in `em` angeben.
- **FAQ-Mindesthöhe:** Das FAQ muss die Projekte-Sektion überdecken (`faq.style.minHeight`), sonst schaut sie unten heraus.
- **Pro Tab-Sektion gilt `data-tb-panel`/`data-tb-tab`/`.tb-view`/`.tb-left`.** FAQ hat zwei `ol[data-tb-tabs]` in `.tb-faqcols`; das Skript sammelt Tabs über die ganze Sektion.
- Die Seite nutzt `sans-serif` für Fließtext (Seitenstandard), Urbanist nur für Überschriften, Labels, Links und Zitate.

## Offene Punkte / Ideen
- Überschrift „Meisterliche Malerarbeiten vom Meisterbetrieb in Freiberg am Neckar“ und Einleitung wurden von Claude gewählt (lokal SEO); Nutzer hat keine Variante vorgegeben.
- Ergänzung „Ausbildungsbetrieb“ in den Team-Skills ist Claudes Formulierung (ersetzt die doppelte Firmen-App-Zeile), von der Kundin noch nicht bestätigt.
- FAQ-Antworten sind inhaltlich Original; lokale SEO-Erweiterung wäre möglich (mit FAQPage-JSON-LD).
- Aufklappbare Tabs in „Meisterliche Malerarbeiten“ auf Handy: erster Tab offen (FAQ: alle zu). Auf Wunsch angleichen.
- Der Zoom-Weg des letzten Bildes (0,9 Bildschirmhöhen) ist ein einzelner Wert in `WelcomeZoom.js` (`dist`).
- Der schwebende „Projekt starten“-Button soll später angepasst werden (Nutzer: „noch nicht“).

## Scroll-Tempo (Richtwert: Bilderstreifen im Hero)
- Der Bilderstreifen im Hero bewegt sich 0,2 px je Scroll-Pixel (`scrub: 1`). Das ist der Referenzwert für „fein und ruhig“; die Fachsektion läuft mit 0,3.
- Die übrigen Scroll-Animationen laufen langsamer als vorher, aber nicht streng nach dem Richtwert (die Karten und Boxen legen 400 bis 1700 px zurück, das wären zig Bildschirme): Leistungen `.lk` 520vh statt 335vh, jede Karte mit gleicher Geschwindigkeit (Dauer = Strecke, `power1.inOut`); Welcome-Zoom `dist` 1,6 vh statt 0,9; CTA/Kontakt `CtaReveal.js` Abschnitte etwa verdoppelt (Gesamt 4,1 vh statt 2,15); Welcome-Pin Handy `+=340%` statt 260 %. Alle `scrub: 1`. Lenis `lerp: 0.07` seitenweit.

## Weitere Seite: Über uns (`studio/index.html`)
- Aus dem Astro-Quellcode (`meisterwerk/`) gebaut und zusätzlich in den Auswahl-Ordner gelegt, **ohne** `deploy-preview.sh` (das würde den ganzen Ordner überschreiben). Vorgehen und Skript: `tools/meisterwerk-auswahl/add-pages.py` (Kopf des Skripts beschreibt den Build; vorhandene Dateien werden nie überschreiben, abweichende gemeldet).
- Zeitleiste Desktop (ab 1025 px, Quelle `Timeline.astro`, `StudioTeam.astro`, Ausgangszustand und Hover in `global.css`): Die Linie steht schon, das Foto von Vincenzo gleitet ganz sanft von links an seinen Platz (1,8 s, `power2.out`), danach fahren die Meilensteine nacheinander aus dem Linienanfang an ihre Plätze und der Text blendet aus der Linie auf. Läuft einmal, sobald die Zeitleiste im Bild ist. Danach (Klasse `is-ready`) feine Hover-Effekte: der Meilenstein unter der Maus wird golden, sein Strich wächst, der Text rückt 6 px von der Linie weg, die übrigen Meilensteine blenden auf 40 % ab; das Foto behält den Grau/Farbe-Hover der Karte.
- Zeitleiste Handy und Tablet (bis 1024 px): ersetzt das Aufklappen „Unsere Geschichte“ durch Pin-and-Scroll (`.tlm`, sticky-Bühne in einem hohen Wrapper, 100svh + 190svh), eingebettet zwischen Text und Team (Handy) bzw. unter Text und Team (Tablet), der Gründer steht nicht mehr im Team-Raster, sondern in der Szene. Das Foto gleitet sanft von links herein, die Jahre fahren gestaffelt ein; beim Scrollen wandert der Fokus durch die Jahre (Klassen `is-active`/`is-past`, CSS-Übergänge): das aktuelle Jahr klappt seinen Text auf, die Linie füllt sich golden. Reduzierte Bewegung: einfache Liste mit allen Texten, ohne Pin.
- Team (Desktop ab 1025 px, Quelle `StudioTeam.astro`): Text der Haltung links neu gestaltet (Lead, vier Leitsätze mit Linien und goldenen Marken, Zitat, Team-Block), rechts das Team als Bild-Akkordeon nach 21st.dev `minhxthanh/interactive-image-accordion`, aber eckig und in unseren Farben: 5 hochkante Streifen, bei Hover oder Fokus klappt einer auf (Flex-Grow 1 zu 6, 0,85 s), die übrigen werden schmal (grau). Das Bild ist eine **feste Ebene in Breite des geöffneten Streifens** (`60cqw - 24px`, mittig), die wachsende Box deckt nur mehr davon auf: kein Zoom, kein neuer Zuschnitt, keine Bildbewegung. Der Name ist **ein** Element, das sich beim Aufklappen von hochkant weich nach waagerecht dreht und auf Normalgröße wächst (Drehpunkt links unten; `top`, `left` und `transform` im selben Zug). Rolle und „Zum Profil“ steigen danach auf. Kein goldener Balken am Fuß. Samet hat noch kein Foto (`noPhoto` in `studio.ts`): statt des Platzhalterbilds ein Monogramm „SE“ in Gold-Umriss auf Steingrund mit zwei feinen Linien. Jeder Streifen verlinkt auf die Profilseite. Das Akkordeon bleibt beim Lesen des Textes stehen (sticky). Touch: erster Tipp öffnet, zweiter führt zum Profil. Auftritt: Streifen steigen gestaffelt auf. Handy und Tablet unverändert (Raster).
- Gründer in der Zeitleiste (Desktop): eigene Karte `.fc` statt `TeamCard`, Hover ohne Zoom: Foto wird farbig, unten läuft ein Schatten auf, ein feiner heller Rahmen zieht sich ein, „Zum Profil“ steigt auf, der Name wird golden.
- Zusätzlich im Auswahl-Ordner liegen die Profilseiten `baldassarre-fortino/`, `lorenzo-fortino/`, `fabio-fortino/`, `stefano-pulia/`, `samet-erenuglu/`, `vincenzo-fortino/` (gleiches Vorgehen wie bei `studio/`).

## Vorlage Teammitglieder-Seite (`/<name>/`, Quelle `meisterwerk/src/components/profile/ProfileTemplate.astro`)
- Route `meisterwerk/src/pages/[slug].astro` nutzt die neue Vorlage für alle Profile der Collection `profile` (Exklusive-Seiten bleiben bei den alten Komponenten). Die Inhalte (`intro`, `motto`) werden zerlegt: `<p><strong>Label:</strong> Wert</p>` wird zum Fakt, alles andere zu Fließtext.
- Aufbau: **Kopf** (Linie, Tagline, Name Wort für Wort aus einer Maske, Rolle aus „Position“, Foto wächst von unten, Hinweis „Steckbrief“), **Steckbrief** (Baujahr als goldene Umriss-Zahl, daneben Fakten als Liste, Linien ziehen beim Hereinscrollen auf), **Zeitleiste** nur wenn das Profil eine hat (Baldassarre): Desktop wie auf `/studio/` (Linie steht, Meilensteine fahren ein, Hover-Effekte), Handy/Tablet Pin-and-Scroll, **Lebensmotto** (großes Zitat, das sich beim Scrollen Wort für Wort füllt, weitere Fakten wie „Fun Fact“ als Karten mit goldener Linie beim Hover), **Weitere Teammitglieder** (Grau zu Farbe, kein Zoom). Gedenkseite (Vincenzo, ohne Steckbrief-Fakten): Erinnerungstext in zwei Spalten, Daten unter dem Namen. Samet ohne Foto: Monogramm (`noPhoto` in `studio.ts`).
- Gemeinsamer Code für die Zeitleiste: `meisterwerk/src/scripts/timeline.ts` (Desktop und Pin) und `components/TimelinePin.astro`; Animationen der Seite: `scripts/profile.ts`.
- In der Auswahl-Vorschau liegen alle sechs Profilseiten (siehe oben, gleiches Vorgehen wie bei `studio/`). Inhaltsfehler korrigiert: bei Samet „des Malerhandwerks“ und „bis zur“ (fehlende Leerzeichen).

## Leistungsübersicht (`leistungen/`, Quelle `meisterwerk/src/components/leistungen/LeistungenOverview.astro`)
- Gestaltung und Maße wie die Leistungs-Sektion der Startseite (`LeistungenStack.css`, Klassen `lk-*`): graue Fläche, Label (12 px, 2 px Sperrung), goldene Überschrift (`clamp(28px, 3.2vw, 40px)`), Kurztext 15 px, weiße Karten mit Rand `#0904021f`, Bild 4:3, Titel 24 px / Kurztext 16 px, „öffnen“-Symbol, Hover wie dort (Bild `scale(1.05)` und `opacity .8`, runder Zoom-Kreis). Texte und Reihenfolge wie die Karten der Startseite, sechste Karte Meisterwerke Exklusive mit Logo und Button (`ui/Button.astro`).
- Als ruhiges Raster statt als Stapel: Links bleibt der Text stehen (sticky), rechts laufen die Karten in zwei Spalten durch; die Linie unter dem Text füllt sich beim Scrollen (wie `lk-progress`). Auftritt: Die **ganze Karte** steigt auf und öffnet sich von unten nach oben (`clip-path`, gestaffelt, `scripts` im Component), das Bild darin wird nicht eigens animiert (das Wachsen der Bilder von links hat nicht gefallen). Text links mit `data-anim="fadeIn"`. **Keine eigenen Schriftgrößen, Boxen oder Pfeile**: nur Werte, die es auf der Startseite schon gibt.
- Lehre: Neue Seiten immer aus den vorhandenen Tokens und Komponenten der Website bauen (Typo-Skala in `global.css`, Karten/Buttons der Startseite), nicht frei gestalten.
- Meisterwerke-Exklusive-Box: breite, höhere Karte über beide Spalten. Das Bild ist genau so breit wie die Bilder der Boxen darüber (`calc((100% - 22px) / 2)`, gemessen 415 px bei 1440 px), ebenso das Bild der breiten Reihe Verputzarbeiten. Die vier Leistungen der Exklusive-Seite stehen als **feste Liste** (Titel 20/24 px, Kurztext aus der Leistungsseite, „Mehr erfahren“ mit der Unterstreichung der Buttons), ohne Symbol. **Beim Überfahren ändert sich nur das Bild** (Überblenden mit `.45s ease-in-out` wie bei den Karten); Texte bleiben, die Box behält ihre Größe (gemessen: gleich bei allen Zuständen). Wichtig: Keine Hover-Bewegung von Text (Verschieben, Aufklappen, Abblenden) – die Tab-Animation der Fachsektion wird dort vom Scrollen gesteuert, nicht vom Mauszeiger, und gehört nicht auf Hover. Links erweitert um einen zweiten Absatz unter „Unsere Leistungen“ (frei formuliert). Die Exklusive-Seiten liegen nicht im Auswahl-Ordner (Links führen dort ins Leere).

## Leistungsseiten (`services/<name>/`, Schema in `meisterwerk/src/pages/services/[slug].astro`)
- Schema für alle Leistungen: **Willkommen-Szene wie auf der Startseite** (`WelcomeScroll.astro`, mit Props `images`, `headingTag`, `cta`, `closing={null}`, `rootClass`): Text rechts bleibt stehen (sticky), die Bilder der Seite (Kopfbild, Einleitungsbild, ein weiteres, höchstens drei) laufen links vorbei; Handy/Tablet: Pin, die Bilder schieben sich von rechts herein. Überschrift und Text wie bisher, dazu ein zweiter Absatz (Showroom, sauber und termingerecht). Zur Kopfzeile bleibt ein **kleiner Abstand** (Handy 24 px, Tablet 32 px, Desktop 40 px; „direkt unter der Kopfzeile“ wurde ausprobiert und vom Nutzer verworfen), am Szenenende steht wie auf der Startseite Luft (`lg:mb-[20vh]`, Handy 10vh), damit die graue Fläche nicht direkt am „Projekt starten“-Link anschließt (`rootClass`).
- **Vorteile** (`components/service/ServiceBenefits.astro`): graue Fläche, links stehender Text, rechts weiße Karten mit Rand, die als Box aufsteigen. Dann die beiden **Textblöcke** (`ServiceBlocks.astro`).
- **Bilder** (`ServiceGallery.astro`): **Karussell wie „Unsere Exklusive Projekte“ auf der Startseite** (gleiche Überschrift-Größe in Gold, „Unser Portfolio“ oben rechts, 3 Bilder nebeneinander, Handy eins mit Link und Punkten darunter, goldene Pfeile außen, Endlosschleife, Ziehen/Wischen). Die Logik liegt jetzt gemeinsam in `scripts/carousel.ts` (`initCarousel`), auch `Projects.astro` nutzt sie. Alle Bilder der Leistung (zuerst die, die nicht in der Szene laufen, danach die der Szene), gleich große Slides (3:2), Hover wie die Projektkarten (`scale-110`, heller, runder Plus-Kreis), Karussell steigt als ganze Box auf. Klick (auch auf Klon-Slides) öffnet die **Großansicht** mit Pfeilen, Pfeiltasten, Esc und Wischen (Fokus-Falle, Lenis angehalten). Ersetzt `Showcase` und `Gallery` auf diesen Seiten. Die Pfeile sitzen bei 1440 px wie auf der Startseite halb am Rand (`left/right -60px`), erst ab ca. 1500 px ganz sichtbar.
- **Exzellenz ist unser Maßstab** (`ServiceExcellence.astro`): graue Fläche, goldene Überschrift, die Säulen als weiße Karten. Die großen Leerflächen am Seitenende (`h-195`) sind entfernt.
- Gemeinsamer Auftritt von Boxen: `initBoxReveal` in `scripts/reveal.ts` (Ausgangszustand `data-box data-pend` in `global.css`).
- Beispiel in der Auswahl-Vorschau: `services/malerarbeiten/`. Die übrigen vier Leistungen bauen mit demselben Schema, liegen aber noch nicht im Auswahl-Ordner.
