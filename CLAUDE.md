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
- **Kurz prüfen, dann zeigen:** Nutzer will keine langen Prüf-Schleifen. Beim Bauen die Originalwerte messen; vor dem Deploy nur ein kurzer Blick (1440 + 390 px, Hover/Menü falls betroffen) auf offensichtliche Fehler wie Überlauf oder verschobene Elemente. Dann sofort auf GitHub Pages deployen und nachbessern, was der Nutzer anmerkt.

## Projektentscheidungen Poolbau Koch (vom Nutzer festgelegt)
- Design-Vorlage: Space Kit (`design-system/design.md`), 1:1. Hero hell wie im Original (freistehendes Foto, dunkle große leichte Headline, Pill darüber, weißer Kreis mit Umlauftext unten rechts).
- Header: smart sticky (runterscrollen = ausblenden, hoch = einblenden), Radius 8px wie die Bilder, ganz leichter Schlagschatten. Alle Bilder mit 8px Radius – außer Ecken, die am Bildschirmrand liegen (dort eckig; gilt für Desktop UND Handy, z. B. Bilder über die volle Handybreite ganz ohne Rundung).
- Menü und Buttons sind verlinkt: Pools → `#pools`, Komplettpakete → `#pakete` (Karte „Technik, Lieferung und Einbau“ in Sektion 2), Ohne Beton → `#ohne-beton`, Projekte → Galerie der alten Seite, Über uns → `#leistungen`; „Beratung anfragen“ → vorbereitete E-Mail (`website/src/lib/links.ts`). Auf dem Konfigurator (Handy/Tablet bis 1024 px) erscheint der Header beim Laden kurz und zieht sich nach ca. 4 s nach oben ein (`<Header smart={false} peek />`); er kommt nur beim Hochscrollen bzw. Herunterziehen am Seitenanfang wieder. Am Seitenanfang schiebt er den Inhalt nach unten, sonst überlagert er ihn; die Startansicht passt in 100svh. Die Leiste „Schritt x/7 · Ihr Pool“ klebt ganz oben; „Schritt x/7“ klappt eine Liste aller Schritte auf (erreichte Schritte anwählbar). Auf dem Desktop bleibt der Header dort fest sichtbar.
- Texte ohne Gedankenstriche (Komma, Doppelpunkt oder Punkt statt „ – “); Bis-Striche bei Zahlen (6–8 m, 08:00–10:00) bleiben.
- Farben aus dem Logo; Button-Unterkante (im Original Orange) = Dunkelblau `#004A80`.
- Button-Gruppen: Animation aus 21st.dev `bundled/10` – im Ruhezustand gestapelt, bei Hover federnd auffächern, bei Maus weg zusammenklappen; auf Touch-Geräten beim Antippen auffächern. Hinweis-Animation im Ruhezustand: weich hinaus und zurück (ease-in-out, 14/28 px, Handy 8/16 px nach unten), erstes Mal schon ab 1,3 s, zweiter hinterer Button 0,35 s später, danach alle 4,5 s.
- Hero-Hintergrund: Köpfer-Video (Higgsfield) als Bildfolge – läuft beim ersten Scrollen automatisch durch und scrollt danach selbst zu Sektion 2, ganz oben läuft es rückwärts; im Ruhezustand oben nur Standbild (keine Wasser-Animation); Hero-Buttons = runde Pills in Dunkelblau/Türkis/Grau; Handy: Buttons senkrecht gestapelt. Handy-Ein-/Ausstieg: beim Laden fährt der Preis-Kasten von oben herein (unter dem Header durch), H1 blendet auf, Buttons steigen auf und fächern auf; beim Scrollen fächern die Buttons zu und fahren nach unten weg, Kasten nach links raus, H1 blendet aus; zurück oben alles wieder rein. Darunter (nur Handy) ein Scroll-Hinweis: kleine hochkante Glas-Pille (dezenter als der Header) mit zwei Chevrons, schwebt sanft; kommt als Letztes von unten herein, Antippen startet das Scrollen.
- Sektion 2: Space-Kit-Bento; kleine Karten = Textfelder; Bild-Animation aus 21st.dev `bundled/1959` (Fläche wächst aus der Mitte, Ecken durchgehend 8px), startet beim Hereinscrollen und läuft selbstständig fertig; Text blendet gleichzeitig ein.
- Partner-Sektion (zwischen Sektion 2 und 3): Logos grau, farbige Welle läuft beim Scrollen von links nach rechts nahtlos durch; Hover kehrt um (grau → farbig, farbig → grau).
- Sektion „Warum Poolbau Koch?“: Scroll-Bento aus 21st.dev `bundled/1849` mit 6 Bildboxen + Text (große Box geteilt).
- Pool-Konfigurator: eigene Seite `/konfigurator/` im Website-Look (Header/Footer der Website, Konfigurator 100vh), kein PHP – Hosting später Cloudflare (Pages Functions, D1, R2; Mails via Resend). Kunde bekommt die Konfiguration als PDF per E-Mail. Hover: übrige Logos/Bilder grau. Animationen weich/premium (keine Federn beim Schrittwechsel). Auswahlkarten immer gleich groß; jede Option mit rundem Chevron-Knopf unten rechts (gleiche Größe und Abstand wie der Haken oben rechts, öffnet das Info-Fenster), „Gut zu wissen“-Hinweis je Schritt. Bühnenbild wechselt per Wachsen aus der Mitte (wie Bento). Übergang Start → Studio ruhig (1,5 s, gleichmäßig weich). Handy/Tablet (bis 1024 px): die Seite scrollt, Bühne bleibt oben stehen, Panel gleitet darüber, Zurück/Weiter klebt unten.
- Ergebnisse immer über GitHub Pages zeigen: https://dmldigital.github.io/aa/ (Push auf `website/**` deployt automatisch).
- Aktueller Stand und nächste Schritte: `HANDOVER.md`.

## Setup
- `.mcp.json`: Playwright MCP und Chrome DevTools MCP (Wrapper in `.claude/mcp/`), headless mit vorinstalliertem Chromium.
- `.mcp.json`: 21st MCP (UI-Komponenten von 21st.dev) – API-Schlüssel kommt aus der Umgebungsvariable `API_KEY_21ST` (nie ins Repo schreiben).
