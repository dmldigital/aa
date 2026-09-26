# Hinweise für Claude

## Arbeitsweise
- Mit dem Nutzer auf Deutsch kommunizieren.
- Tokensparsam arbeiten: Aufgaben, die nicht zwingend das Hauptmodell brauchen, an Subagents delegieren
  - **Haiku** für einfache Dinge: Dateien suchen/lesen, Recherche, Screenshots sammeln, mechanische Umbauten.
  - **Sonnet** für mittlere Aufgaben: Umsetzen klar spezifizierter Änderungen, Zusammenfassungen, Auswertungen.
  - Das Hauptmodell nur für Planung, Architekturentscheidungen und die finale Prüfung.
- Keine eigenen Tools/Skills bauen, wenn es etablierte, gut bewertete Lösungen gibt (z. B. auf GitHub) – erst danach suchen.

## Setup
- `.mcp.json`: Playwright MCP und Chrome DevTools MCP (Wrapper in `.claude/mcp/`), headless mit vorinstalliertem Chromium.
