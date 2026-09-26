# Hinweise für Claude

## Arbeitsweise
- Mit dem Nutzer auf Deutsch kommunizieren.
- Tokensparsam arbeiten: Aufgaben, die nicht zwingend das Hauptmodell brauchen, an Subagents delegieren
  - **Haiku** für einfache Dinge: Dateien suchen/lesen, Recherche, Screenshots sammeln, mechanische Umbauten.
  - **Sonnet** für mittlere Aufgaben: Umsetzen klar spezifizierter Änderungen, Zusammenfassungen, Auswertungen.
  - Das Hauptmodell nur für Planung, Architekturentscheidungen und die finale Prüfung.
- Keine eigenen Tools/Skills bauen, wenn es etablierte, gut bewertete Lösungen gibt (z. B. auf GitHub) – erst danach suchen.

## Nachbau nach Vorlage (Design-Referenz, Animations-Beispiele)
- **1:1 heißt 1:1.** Layout, Abstände, Radien, Schriftgrößen, Buttons, Menüs, Badges und Animationen exakt aus dem Original übernehmen (Werte aus Computed Style/CSS des Originals, Original-Assets wie SVG-Formen nachbauen). Getauscht werden nur Farben, Texte, Bilder, Logo – und nur so, wie der Nutzer es festgelegt hat.
- **Nicht interpretieren.** Jede bewusste Abweichung vom Original vorher als Liste nennen und bestätigen lassen. Keine „Verbesserungen“ auf eigene Faust.
- **Referenz-Verhalten bestätigen.** Bei jedem Animations-Beispiel alle Zustände messen (Laden, Ruhe, Hover, Klick/Tap, Maus weg, Scroll) und dem Nutzer in einem Satz zurückmelden, wie es funktioniert – erst dann bauen.
- **Pflicht-Vergleich vor jedem Zeigen:** Original und Nachbau nebeneinander bei 1440 / 768 / 390 px, jeweils Normal-, Hover-, Aktiv-Zustand, offenes Mobile-Menü und mehrere Scroll-Positionen. Dazu automatische Prüfung auf Layout-Verschiebung bei Hover/Fokus (Bounding-Boxen vorher/nachher). Erst zeigen, wenn der Vergleich passt; Vergleichsbilder mitliefern.

## Projektentscheidungen Poolbau Koch (vom Nutzer festgelegt)
- Design-Vorlage: Space Kit (`design-system/design.md`), 1:1. Hero hell wie im Original (freistehendes Foto, dunkle große leichte Headline, Pill darüber, weißer Kreis mit Umlauftext unten rechts).
- Farben aus dem Logo; Button-Unterkante (im Original Orange) = Dunkelblau `#004A80`.
- Button-Gruppen: Animation aus 21st.dev `bundled/10` – im Ruhezustand gestapelt, bei Hover federnd auffächern, bei Maus weg zusammenklappen; auf Touch-Geräten beim Antippen auffächern.
- Hero-Hintergrund: Köpfer-Video (Higgsfield) scroll-gesteuert als Bildfolge; Hero-Buttons = runde Pills in Dunkelblau/Türkis/Grau; Handy: Buttons senkrecht gestapelt.
- Sektion 2: Space-Kit-Bento; kleine Karten = Textfelder; Bild-Animation aus 21st.dev `bundled/1959` (Fläche wächst aus der Mitte, Ecken durchgehend 8px), startet beim Hereinscrollen und läuft selbstständig fertig; Text blendet gleichzeitig ein.
- Ergebnisse immer über GitHub Pages zeigen: https://dmldigital.github.io/aa/ (Push auf `website/**` deployt automatisch).
- Aktueller Stand und nächste Schritte: `HANDOVER.md`.

## Setup
- `.mcp.json`: Playwright MCP und Chrome DevTools MCP (Wrapper in `.claude/mcp/`), headless mit vorinstalliertem Chromium.
- `.mcp.json`: 21st MCP (UI-Komponenten von 21st.dev) – API-Schlüssel kommt aus der Umgebungsvariable `API_KEY_21ST` (nie ins Repo schreiben).
