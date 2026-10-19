# Nachbau der Unterseiten von meisterwerk-lb.de in Astro (gemeinsame Regeln, Teil 2)

Lies zuerst `BRIEF-startseite.md` im selben Ordner (Breakpoints, Tailwind-Regeln, Datenattribute für Animationen, Pflicht zur Prüfung). Dieses Dokument ändert und ergänzt es. S = Ordner `meisterwerk/tools` (Arbeitsordner für die Ausgaben: `tools/out`, `tools/pages`). Projekt: /home/user/aa/meisterwerk (siehe dort README.md: Aufbau und Konventionen).

## Wichtigste Regel: sparsam arbeiten (Tokens)
- Der Auftraggeber verlangt ausdrücklich sparsamen Verbrauch. Keine Fleißarbeit, keine Wiederholungen.
- Bilder (Screenshots) nur ansehen, wenn die gemessene Abweichung über 2,5 % liegt, und dann nur die `-sbs.png`-Datei, höchstens zweimal pro Sektion und Breite. Niemals Vollseiten-Screenshots ansehen.
- Spec-Dateien nicht komplett lesen: mit `grep`, `cut -c1-220` und `head` gezielt die Zeilen holen, die du brauchst.
- `refcap.js` höchstens einmal pro Seite starten (erzeugt alles für alle drei Breiten).
- Wiederverwendung vor Neubau: Eine Sektion, die auf mehreren Seiten (auch denen anderer Teams) vorkommt, wird EINMAL als Komponente gebaut und über Props/Daten befüllt. Vorher `ls src/components/sections src/components/ui src/data` ansehen. Neue gemeinsame Komponenten bekommen sprechende Namen (z. B. `Gallery.astro`), eine `id`-Prop für `data-section` und werden im Bericht genannt.
- Die vorhandenen Startseiten-Komponenten (Projects, Surface, Faq, Skills, Services, Welcome, Partner, Masterly, Hero, Header, Footer) wiederverwenden: wenn dafür eine Prop (z. B. `id`, Texte, Daten) fehlt, ergänze sie rückwärtskompatibel. Die Startseite darf sich dadurch NICHT verändern.

## Design ja, Animationen schlicht
Nur das statische Design muss pixelnah stimmen (1440 / 1024 / 390). Animationen: höchstens schlichtes `data-anim` wie in BRIEF.md oder gar keine. Karussell/Akkordeon/Galerie-Lightbox: einfache, funktionierende Bedienung genügt.

## Seiten und Adressen
- Die neuen Seiten behalten exakt die Adressen der alten Seite (Slash am Ende), z. B. `/services/tapezieren/`. Dateien in `src/pages/…`. Mehrere ähnliche Seiten über eine dynamische Route (`[slug].astro` mit `getStaticPaths`) und Inhalte in `src/data/pages/<thema>.ts`, nicht pro Seite eine Kopie.
- Jede Seite nutzt `PageLayout` (`src/layouts/PageLayout.astro`, enthält Header und Footer; Prop `current` = Pfad der Seite für den aktiven Menüpunkt). Titel und Meta-Description der Seiten vom Original übernehmen (`<title>` und `meta[name=description]`, per Playwright auslesen).
- Texte, Überschriften, Bildunterschriften, Alt-Texte, Links vom Original übernehmen (live per Playwright auslesen und in Daten-Dateien ablegen, nicht von Hand abtippen). Offensichtliche Copy-Paste-Fehler im Originaltext korrigieren und im Bericht nennen (z. B. steht auf der Lackierarbeiten-Seite „Vorteile professioneller Verputzarbeiten“). Gedankenstriche im Original bleiben stehen.
- Bilder: neue Originalbilder per `curl` (Proxy ist vorkonfiguriert) von den Original-URLs nach `src/assets/img/` laden (Datei nicht doppelt laden, vorher `ls`), nur die in der Seite verwendeten, dann über `<Picture formats={['avif','webp']}>` einbinden wie in den vorhandenen Komponenten (Größen/`sizes` passend, deutsches `alt`).
- Links nur über `href()`/`routes` aus `src/data/links.ts`. DIESE DATEI NICHT ÄNDERN (die Liste fertiger Seiten pflegt der Auftraggeber). Nenne im Bericht die Pfade, die du gebaut hast.
- Nicht ändern: `src/styles/global.css`, `src/scripts/motion.ts`, `src/layouts/*`, `package.json`, `astro.config.mjs`. Brauchst du dort etwas, beschreibe es im Bericht. Neue Tailwind-Tokens: nur wenn zwingend, dann als Bitte im Bericht.
- Keine Git-Befehle, keinen `astro build`, keinen eigenen Dev-Server. Ein gemeinsamer Dev-Server läuft auf Port 4500 (`http://127.0.0.1:4500/<pfad>`); er lädt Änderungen automatisch. Prüfe Typen mit `cd /home/user/aa/meisterwerk && npx astro check` und formatiere nur deine Dateien mit `npx prettier --write <Dateien>`.

## Werkzeuge (statt der Werkzeuge aus BRIEF.md)
Vorher `export PW=$(npm root -g)/playwright` setzen.
1. Original vermessen: `cd $S && node refcap.js <Originalpfad> <name>` (z. B. `node refcap.js /services/tapezieren/ tapezieren`). Erzeugt in `$S/pages/<name>/`: `sections-<w>.json` (Wurzel-Sektionen mit Elementor-ID, y, Höhe), `spec-<ID>-<w>.txt` (Computed-Style-Baum je Sektion), `ref-<ID>-<w>.png` (Original-Ausschnitt), `full-<w>.png`. w = d (1440), t (1024), m (390). Header und Footer stecken in eigenen Vorlagen und sind schon gebaut; hier geht es um den Inhalt unter dem Header (y ab 95 bei 1440, ab 50/65 bei 1024/390).
2. Vergleichen: `cd $S && node cmp.js <unsere-Adresse> <name> <ID> <w>`. Das misst `[data-section="<ID>"]` unserer Seite und vergleicht mit `ref-<ID>-<w>.png`. Ausgabe: Größen, Prozent abweichender Pixel, Überlauf, JS-Fehler; Bild: `$S/out/<name>-<ID>-<w>-sbs.png` (links Original, Mitte Nachbau, rechts rot = Abweichung). Jede Wurzel-Sektion bekommt `data-section="<Original-ID>"` (bei wiederverwendeten Komponenten per `id`-Prop). Ziel: Höhe auf wenige Pixel, Abweichung unter 2 % (Kantenglättung und Bildkompression sind ok).
3. Sektionen, die es auf mehreren Original-Seiten mit gleichem Aufbau gibt, vermisst du nur auf EINER Seite genau; auf den anderen prüfst du nur die Höhe und eine Stichprobe.
4. Die Slider/Karussell-Zustände im Original sind Momentaufnahmen. Vergleich dort nur auf Layout, nicht auf das gerade sichtbare Bild.

## Abschlussbericht (max. 200 Wörter)
Gebaute Seiten (Pfade), neue gemeinsame Komponenten, Abweichungen mit Grund, korrigierte Originalfehler, gewünschte Änderungen an gesperrten Dateien. Nichts weiter.
