-- Cloudflare D1: Tabelle für Anfragen aus dem Pool-Konfigurator
-- Anlegen: npx wrangler d1 execute poolbau-koch --remote --file=docs/konfigurator-schema.sql
CREATE TABLE IF NOT EXISTS anfragen (
  ref TEXT PRIMARY KEY,
  erstellt TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  strasse TEXT,
  plz TEXT,
  ort TEXT,
  zeitfenster TEXT,
  wuensche TEXT,
  beratung INTEGER NOT NULL DEFAULT 0,
  konfiguration TEXT NOT NULL,   -- JSON mit den IDs (Hersteller, Becken, Farbe, …)
  zusammenfassung TEXT NOT NULL  -- JSON mit den lesbaren Zeilen wie im PDF
);
CREATE INDEX IF NOT EXISTS anfragen_erstellt ON anfragen (erstellt);
