# Nachbau Startseite meisterwerk-lb.de in Astro (gemeinsame Regeln)

S = Ordner `meisterwerk/tools`; Referenzdaten (`mwref`) lassen sich mit `refcap.js` neu erzeugen
Projekt: /home/user/aa/meisterwerk (Astro 7, Tailwind 4 über @tailwindcss/vite, GSAP 3.15, Lenis). Bei Fragen zu Astro die offiziellen Docs nutzen (docs.astro.build), für Tailwind die v4-Docs.

## Ziel
Die Sektionen der Startseite https://meisterwerk-lb.de so nachbauen, dass man ohne direkten Vergleich keinen Unterschied sieht: Layout, Abstände, Schriftgrößen, Zeilenhöhen, Farben, Rahmen, Bilder, Hover und Animationen. Kein Redesign, keine Verbesserungen, Texte exakt wie im Original (auch Tippfehler wie „Unser Schowroom“, auch Gedankenstriche im Original-Text).

## Breakpoints (wie Elementor im Original)
- Basis-Klassen = Handy (< 768 px), Referenzbreite 390
- `md:` = Tablet ab 768 px, Referenzbreite 1024
- `lg:` = Desktop ab 1025 px, Referenzbreite 1440
Andere Breakpoints gibt es in diesem Projekt nicht.

## Referenzdaten in $S/mwref
- `spec-<ID>-<d|t|m>.txt`: komplette Computed-Style-Bäume des Originals (d=1440, t=1024, m=390). Jede Zeile: Tag, Elementor-ID, Klassen, [x,y Breite x Höhe relativ zur Sektion], Text, und nur die Eigenschaften, die vom Standard abweichen (vererbte Eigenschaften nur, wenn sie sich zum Elternelement ändern). `transition` zeigt die Original-Übergänge.
- `ref-<ID>-<d|t|m>.png`: Screenshot der Sektion im Original (nach Ablauf aller Einblend-Animationen).
- `hover.json`, `hov-*.png`, `open-*.png`: Hover-Zustände und geöffnete Akkordeons.
- Das Original kannst du jederzeit live mit Playwright messen: `const { chromium } = require(process.env.PW)` mit `PW=$(npm root -g)/playwright`, Start mit `chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } })`, Kontext mit `ignoreHTTPSErrors: true`. Cookie-Banner vorher mit `document.querySelector('#cc--main')?.remove()` entfernen. Für Animationen/Slider: Zeiten, Kurven und Zustände live messen, nicht raten.

## Vorhandenes Grundgerüst (NICHT ändern)
`src/styles/global.css`, `src/layouts/Layout.astro`, `src/scripts/motion.ts`, `src/pages/index.astro`, `astro.config.mjs`, `package.json`. Keine neuen npm-Pakete. Wenn du dort etwas brauchst, beschreibe es im Abschlussbericht.
- Farben: `gold` #A59371, `ink` #090402, `soft` #F7F7F7, `muted` rgba(0,0,0,.7), `line` rgba(255,255,255,.3) (also `text-gold`, `bg-soft`, `border-line` …).
- Schriften: `font-display` = Urbanist (400/500/600 geladen), `font-body` = Systemschrift sans-serif. Das ist Absicht: Das Original will „DM Sans“, lädt sie aber von einer toten Domain, sichtbar ist überall die Systemschrift.
- Body-Standard: 16px/24px (Handy), 15px/22.5px ab md, Farbe `muted`.
- Utility `underline-anim`: 1-px-Unterstrich unter dem Text mit der Original-Hover-Animation (Linie zieht sich nach rechts zurück und wächst von links neu). Auf das Text-`<span>` setzen; ausgelöst durch Hover auf das Element selbst oder einen Elternteil mit Klasse `group/ul`. Abstand per `[--underline-gap:Xpx]` (Original-Wert aus dem Spec: `::before` top/margin).

## Animationen (src/scripts/motion.ts, per Datenattribut)
- Einblenden: `data-anim="fadeIn|fadeInUp|fadeInDown|fadeInLeft|fadeInRight|slideInUp|slideInDown|slideInLeft|slideInRight"`, `data-anim-delay="400"` (ms), `data-anim-dur="slow"` (2 s, Original-Klasse `animated-slow`) oder `"fast"` (0,75 s), Standard 1,25 s, Kurve wie CSS `ease`. Auslöser wie im Original: sobald das Element in den Viewport kommt.
- Nur-Handy-Animation: `data-anim-mobile="…"` (überschreibt `data-anim` unter 768 px; `"none"` schaltet ab). Elementor-Logik: `_animation_mobile` gesetzt und `_animation` leer, dann nur `data-anim-mobile` setzen.
- Bild-Reveal (Original `imageGrowWithScaleBottom/Left/Right/Top`): Wrapper `<div data-grow="bottom|left|right|top" data-anim-delay="420">` um das `<img>`: Clip-Path öffnet sich von der Kante, das Bild zoomt von 1,4 auf 1 (1,25 s, Kurve 0,.55,.45,1). Ausrichtung: Original `…Bottom` = `data-grow="bottom"` usw.
- `data-anim-manual` an einem Elternelement schaltet die automatische Auslösung für alle Kinder ab (z. B. für Slider-Inhalte, die du selbst per `import { playAnim } from '../../scripts/motion'` startest: `playAnim(el, 'fadeInLeft')`).
- Die Animationen und Verzögerungen stehen im Original jeweils in `data-settings` (`_animation`, `animation`, `_animation_delay`, `_animation_mobile`). Im Prompt sind sie pro Sektion aufgelistet; prüfe sie live.

## Umsetzungsregeln
- Astro-Komponenten in `src/components/sections/<Name>.astro` (Platzhalter existieren schon, überschreiben). Eigene Unterkomponenten unter `src/components/` erlaubt.
- Styling ausschließlich mit Tailwind-Klassen im Markup; exakte Pixelwerte mit Arbitrary Values (`text-[40px]/[54px]`, `tracking-[1px]`, `px-[30px]`, `max-w-[1700px]`). Kein `style=""` außer für dynamische Werte oder Hintergrundbild-URLs. Komponenten-`<style>` nur, wenn Tailwind es nicht sauber kann (z. B. Keyframes), knapp halten.
- Elementor-Container nachbilden: Boxed-Inhalt max. 1700 px, Seitenabstand 30 px Desktop, 20 px Tablet und Handy (Werte im Spec prüfen). Keine Elementor-Hilfs-Divs nachbauen, nur was die Darstellung braucht.
- Bilder: aus `src/assets/img/` importieren, mit `<Image>`/`<Picture>` aus `astro:assets` (passende `widths` und `sizes`, deutsches `alt`). Hintergrundbilder über `getImage()` und `style="background-image:url(...)"`. Bilder im ersten Bildschirm `loading="eager"`. Bildausschnitt (object-position/background-position) wie im Original.
- Interaktives JS im Komponenten-`<script>` (TypeScript), Bewegung mit GSAP (`import { gsap } from 'gsap'`), Timing live am Original gemessen. Lenis läuft global, nichts eigenes fürs Scrollen bauen.
- Hover und Transitions mit Tailwind (`hover:`, `group-hover:`, `transition-[…]`, `duration-[…]`, `ease-[…]`) nach den Original-Werten.
- Links: vorerst absolute Original-URLs (`https://meisterwerk-lb.de/...`), Anker innerhalb der Seite bleiben Anker.
- Semantik und Zugänglichkeit: `<button aria-expanded>` für Akkordeons und Menü, nur eine `h1` auf der Seite (die steht in „Willkommen bei Meisterwerk…“), Überschriften-Hierarchie wie im Original.
- Jede Sektion bekommt am Wurzelelement `data-section="<Elementor-ID>"` (Header/Footer ebenso), damit der Vergleich sie findet.

## Prüfen (Pflicht, bei allen drei Breiten)
1. Dev-Server im Hintergrund starten: `cd /home/user/aa/meisterwerk && npx astro dev --port <DEIN_PORT> --host 127.0.0.1` (Bash mit run_in_background). Deine Testseite: `http://127.0.0.1:<PORT>/dev/<a|b|c>/`.
2. `cd $S && PW=$(npm root -g)/playwright node compare.js <url> 1440 '[data-section="ID"]' $S/out/<ID>-d.png` (gibt Box, horizontales Überlaufen und JS-Fehler aus; nutzt reduzierte Bewegung, damit alles sofort sichtbar ist).
3. `python3 $S/sbs.py $S/mwref/ref-<ID>-d.png $S/out/<ID>-d.png $S/out/<ID>-d-sbs.png` und das Ergebnis mit Read ansehen (links Original, Mitte Nachbau, rechts rot = Abweichung).
4. Für 1024 (`-t`) und 390 (`-m`) wiederholen. Korrigieren, bis nur noch Unterschiede durch Bildkompression, Kantenglättung oder Slider-Stand bleiben. Höhe und Positionen sollen auf wenige Pixel stimmen.
5. `npx astro check` ist nicht installiert; stattdessen am Ende `npx astro build` laufen lassen (muss fehlerfrei sein; nur EIN Build gleichzeitig, falls er wegen eines parallelen Builds scheitert, kurz warten und wiederholen).
6. Dev-Server am Ende beenden.

## Abschlussbericht (max. 300 Wörter)
Erstellte Dateien, was bei 1440/1024/390 übereinstimmt, verbleibende Abweichungen mit Grund, gewünschte Änderungen an gemeinsamen Dateien.
