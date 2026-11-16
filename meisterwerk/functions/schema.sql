-- Tabelle für die Formular-Anfragen (Cloudflare D1, Binding DB)
-- Anlegen: npx wrangler d1 execute meisterwerk --remote --file=functions/schema.sql
CREATE TABLE IF NOT EXISTS anfragen (
  ref       TEXT PRIMARY KEY,   -- z. B. MW-261116-3F2A9C
  erstellt  TEXT NOT NULL,      -- ISO-Zeitpunkt (UTC)
  art       TEXT NOT NULL,      -- projekt | kurz
  seite     TEXT NOT NULL,      -- Pfad der Seite mit dem Formular
  name      TEXT NOT NULL,
  email     TEXT,
  telefon   TEXT,
  daten     TEXT NOT NULL,      -- JSON: [{ label, value }]
  bilder    INTEGER NOT NULL DEFAULT 0  -- Zahl der Bilder (Ablage in R2 unter <ref>/)
);
CREATE INDEX IF NOT EXISTS anfragen_erstellt ON anfragen (erstellt);
