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
- Aus dem Astro-Quellcode (`meisterwerk/`) gebaut und zusätzlich in den Auswahl-Ordner gelegt, **ohne** `deploy-preview.sh` (das würde den ganzen Ordner überschreiben). Vorgehen: `BASE_PATH=/aa/meisterwerk-preview-auswahl/ npx astro build --outDir /tmp/studio-dist`, dann `studio/index.html` und alle darin (und in den eingebundenen JS/CSS) genannten Dateien aus `_astro/` kopieren, vorhandene Dateien nie überschreiben (im Skript geprüft: gleiche Namen sind gleicher Inhalt).
- Zeitleiste (Desktop ab 1025 px, Quelle `Timeline.astro`, `StudioTeam.astro`, Ausgangszustand in `global.css` über `data-tl-pending`): Die Linie steht schon, das Foto von Vincenzo fährt von rechts über die Linie an seinen Platz (2 s, `power3.inOut`), danach fahren die Meilensteine nacheinander aus dem Linienanfang an ihre Plätze und der Text blendet aus der Linie auf. Läuft einmal, sobald die Zeitleiste im Bild ist. Handy, Tablet und reduzierte Bewegung unverändert.
