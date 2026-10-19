# Werkzeuge: Vorschau Meisterwerk (Auswahl)

Beschreibung des Projekts, der Dateien und der Entscheidungen: `docs/meisterwerk-auswahl.md`.

- `bust.py`: Cache-Busting (`?v=<hash>`) für alle eigenen CSS/JS-Dateien. Nach jeder Änderung ausführen.
- `serve.sh`: lokaler Server unter `http://localhost:4399/aa/meisterwerk-preview-auswahl/`.
- `tests/*.cjs`: Playwright-Skripte (Chromium unter `/opt/pw-browsers/chromium`, globales `playwright`).

```bash
tools/meisterwerk-auswahl/serve.sh
cd tools/meisterwerk-auswahl/tests && mkdir -p shots
NODE_PATH=$(npm root -g) node fit.cjs                 # Fachsektion passt in 100vh? (9 Fenstergrößen)
NODE_PATH=$(npm root -g) node slide.cjs 1440 900      # Slide-Wechsel der Fachsektion (Positionen + Screenshots)
NODE_PATH=$(npm root -g) node faq3.cjs 1440 900 shot  # FAQ: Tabs öffnen/schließen, Überlauf
NODE_PATH=$(npm root -g) node overflow.cjs            # Überlauf-Prüfung bei 19 Fenstergrößen (Fachsektion + FAQ)
NODE_PATH=$(npm root -g) node cover2.cjs 1440 900     # FAQ schiebt sich über die Projekte, Header-Sperre
NODE_PATH=$(npm root -g) node cta2.cjs 1440 900       # Bild/CTA-/Kontakt-Sequenz
NODE_PATH=$(npm root -g) node zoom.cjs 1440 900       # Zoom des letzten Bildes (auch 390 844)
NODE_PATH=$(npm root -g) node chain2.cjs 1440 900     # Ketten-Animation der Willkommens-Sektion (Zeitverlauf)
kill $(lsof -ti:4399)
```
Screenshots landen in `tests/shots/` (nicht im Repo). Skripte, die Positionen aus der Seite lesen, sind robust
gegen Verschiebungen; Zahlen in den Skripten (z. B. Scroll-Anteile) sind Richtwerte.
