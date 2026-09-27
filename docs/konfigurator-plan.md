# Pool-Konfigurator – Neuaufbau (Plan, Stand 27.09.2026)

## Ist-Zustand (konfig.poolbau-koch.de, v1.12.2)
- PHP-Seite + Vanilla-JS (`medien/konfigurator/app-v1.12.2.js`). Katalog steckt als JSON im HTML (`CFG`), Snapshot: `medien/konfigurator/katalog-snapshot-2026-09-27.json`.
- Katalog: 3 Hersteller (WaterRows 13, Compass 37, Freedom 28 = 78 Becken mit Maßen, Form, Treppe, LED-Fähigkeit, Bild), 22 Farben (je Hersteller/Modell, mit Bild), 16 Ausstattungen (Abdeckung 6, Technik 3, iWash 2, Wärmepumpe 3, Licht 2).
- 10 Schritte: Hersteller → Becken → Farbe → LED-Streifen → Abdeckung → Technik → iWash → Wärmepumpe → Licht → Kontakt (Rückruf-Zeitfenster 08–20 Uhr).
- Backend: `api.php?a=submit` (Anfrage), `api.php?a=track` (Statistik). Keine Preise, nur Hinweis „Projekte ab 30.000 €“.
- Optik: klassisches Formular-Layout (Karten, Chips, Seitenleiste „Ihre Auswahl“), kaum Animation.

## Ziel
Gleicher Inhalt und gleiche Daten, aber im Space-Kit-Look der neuen Website und als erlebbares „Pool-Studio“:
große Live-Bühne mit dem gewählten Pool, jede Auswahl verändert sichtbar die Bühne.

## Konzept
- **Layout Desktop:** links große Bühne (ca. 60 %), rechts Auswahl-Panel; oben schmale Fortschrittsleiste mit Schrittnamen.
- **Layout Handy:** Bühne oben (ca. 40 % Höhe, bleibt stehen), Auswahl als Bottom-Sheet, feste Leiste unten mit Zurück/Weiter, Wischen zwischen Schritten.
- **Bühne je Schritt:**
  - Hersteller: Markenwelt (Logo, Material, Stimmungsbild) blendet über.
  - Becken: Modellbild mit Maß-Linien (Länge × Breite × Tiefe zählen hoch), Filter nach Form und Größe (Regler), Vergleich zweier Becken.
  - Farbe: Farbbild des Beckens, weiche Überblendung, große Farbmuster.
  - LED / Licht: Tag/Nacht-Schalter, Bühne dunkelt ab, Lichtlinie bzw. RGB-Farblauf.
  - Abdeckung: Abdeckung fährt animiert über das Becken (Rollo/Stangen).
  - Technik, iWash, Wärmepumpe: Technikbox-Bild, Saison-Balken verlängert sich mit Wärmepumpe.
- **Übergänge:** Schrittwechsel per View Transitions (Gleiten + leichte Unschärfe), Karten federn gestaffelt herein, Auswahl fliegt als Chip in „Ihr Pool“ (FLIP-Animation), Fortschrittsleiste läuft weich mit.
- **Abschluss:** „Ihr Pool“-Zusammenfassung als Karte mit allen Komponenten, Kontaktformular mit Zeitfenstern als Pills, Erfolgsseite mit Wasser-Welle.
- **Komfort:** Auswahl bleibt gespeichert (Browser + teilbarer Link), Tastatur/Screenreader, „Bewegung reduzieren“ respektiert.

## Technik
- Astro-Seite `/konfigurator/` im bestehenden Projekt (gleiche Schriften, Farben, Buttons, Header/Footer).
- Animationen mit der Bibliothek **Motion** (motion.dev, Federn/FLIP) + CSS/View Transitions – keine Eigenbauten.
- Daten: Katalog-JSON (vorerst Snapshot, später live vom bestehenden Backend).
- Absenden: vorhandenes `api.php?a=submit` weiterverwenden (braucht gleiche Domain oder CORS-Freigabe); für die Vorschau auf GitHub Pages nur Attrappe.

## Phasen
1. Klärung (siehe offene Fragen) + Bildmaterial sichten.
2. Klickbarer Prototyp: Start + Hersteller + Becken inkl. Bühne → auf GitHub Pages zeigen.
3. Alle Schritte, Zusammenfassung, Kontakt.
4. Feinschliff Animationen, Handy, Barrierefreiheit.
5. Livegang (Anbindung Backend, Domain).

## Offene Fragen an den Nutzer
1. Wo soll der neue Konfigurator leben – unter der neuen Website (`/konfigurator/`) oder weiter auf konfig.poolbau-koch.de?
2. Wer betreut das Backend (api.php, Katalogpflege)? Zugang vorhanden? Vorschlag: Backend behalten, nur Oberfläche neu.
3. Schritte zusammenlegen? Vorschlag 7 statt 10: Hersteller · Becken · Farbe & LED · Abdeckung · Technik & iWash · Wärme & Licht · Kontakt.
4. Preisangabe: Konfigurator sagt „ab 30.000 €“, Website „Komplettpaket ab 22.700 €“ – was gilt?
