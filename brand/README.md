# Poolbau Koch – Logo (Nachbau als SVG)

Nachbau des Original-Logos (`logo.png`, 1920×396 px) als reines Vektor-SVG,
Text als Pfade (keine Rasterbilder, kein `<text>`), numerisch gegen die
Pixel-Vorlage optimiert.

## Dateien

- `poolbau-koch-logo-hell.svg` – weiße Schrift, für dunkle Hintergründe (entspricht dem Original)
- `poolbau-koch-logo-dunkel.svg` – schwarze Schrift, für helle Hintergründe (Farbe aus `logo-navbar.png`)
- `poolbau-koch-bildmarke.svg` – nur die drei Wellen, auf den Inhalt zugeschnittene viewBox
- `vergleich-differenz.png` – Differenzbild Original vs. Nachbau (weiß = Deckung, rot = nur Original, grün = nur Nachbau), auf dunklem Grund

Alle Logo-Dateien: `viewBox="0 0 1920 396"`, Gruppen `waves`, `wordmark` (mit `line1-poolbau-koch`, `line2-tagline`), Farben als `fill`/`stroke`, Pfadkoordinaten auf 1–2 Nachkommastellen gerundet.

## Farben (pixelgenau aus der Vorlage gemessen)

| Element              | Hex       |
|-----------------------|-----------|
| Welle oben            | `#BAB9B4` |
| Welle Mitte           | `#20AFAD` |
| Welle unten           | `#004A80` |
| Schrift (hell/Original) | `#FFFFFF` |
| Schrift (dunkel/Navbar) | `#000000` |

## Schrift

- **Comfortaa**, Schnitt **Regular (400)**, Google Fonts, Lizenz **SIL Open Font License 1.1**.
  Bezug: `fonts.googleapis.com` / `fonts.gstatic.com` (Google-Fonts-Spiegel von github.com/google/fonts).
- Ermittlung: Getestet wurden Comfortaa in den Schnitten 300–700 (inkl. Variable-Font-Zwischenwerten)
  sowie Quicksand und Varela Round als Alternativkandidaten. Comfortaa 400 lieferte mit Abstand
  die beste Übereinstimmung (Buchstabenbreiten-Verhältnisse über alle Großbuchstaben von "POOLBAU KOCH"
  stimmen mit Standardabweichung < 0,5 px überein; charakteristische Rundungen an allen Strichenden
  von P, L, K etc. sowie kreisrunde "O" passen exakt). Quicksand/Varela Round erreichten nur
  ~0,67–0,70 IoU und wurden verworfen.
- Zeile 1 „POOLBAU KOCH": Schriftgröße ≈ 169 px (Skalierung 0,1683 × 1000 UPM).
- Zeile 2 „Ihr Traumpool. Unsere Mission.": Schriftgröße ≈ 72,3 px (Skalierung 0,0723).
- Buchstabenabstand: kein einheitlicher globaler Tracking-Wert, sondern pro Buchstabe einzeln an die
  Vorlage angepasste Position (siehe Vorgehen) – wie bei manueller optischer Kerning-Korrektur in
  Grafikprogrammen üblich.
- Text wurde mit `fontTools` aus der TTF-Datei in Bézier-Pfade umgewandelt (keine Nachzeichnung von Hand).

## Wellen (Bildmarke)

- Drei identisch geformte Wellen (eine Bézier-Pfad-Definition, dreifach vertikal versetzt um
  92,1 px bzw. 185,0 px), gerendert als Stroke mit `stroke-linecap="round"`.
- Strichstärke: 34,4 px.
- Kurvenform (Kontrollpunkte) wurde per numerischer Optimierung (`scipy.optimize`, Least-Squares
  auf die gemessene Pixel-Mittellinie, anschließend Nelder-Mead-Feinabstimmung auf IoU der
  Alpha-Masken) bestimmt. Die Welle ist punktsymmetrisch aufgebaut (zweite Hälfte = 180°-Rotation
  der ersten Hälfte um den Mittelpunkt).

## Messwerte (Nachbau vs. `logo.png`, gerendert exakt 1920×396 px mit cairosvg)

| Element                        | IoU (Alpha-Masken) | Max. Kantenabweichung |
|--------------------------------|---------------------|------------------------|
| Welle oben                     | 0,9953              | ≈ 1 px |
| Welle Mitte                    | 0,9929              | ≈ 1 px |
| Welle unten                    | 0,9905              | ≈ 1 px |
| Zeile 1 „POOLBAU KOCH"          | 0,9966              | ≈ 1 px |
| Zeile 2 „Ihr Traumpool. …"      | 0,9921              | ≈ 1 px |
| **Gesamtbild**                  | **0,9948**          | – |

**Ziel erreicht:** Alle 5 Elemente erreichen IoU ≥ 0,99 (Zielvorgabe). Von insgesamt ca. 87.000
Vordergrund-Pixeln weichen nur 458 (≈ 0,5 %) ab – ausschließlich einzelne Antialiasing-Randpixel
an Rundungen/Strichenden, kein systematischer Form-, Größen- oder Positionsfehler. Die maximale
Kantenabweichung liegt an der Auflösungsgrenze von 1 px (Diskretisierung/Antialiasing der
50-%-Alpha-Schwelle) – im gerenderten Bild optisch nicht vom Original unterscheidbar
(siehe `vergleich-differenz.png`).

## Nutzungshinweis

- `poolbau-koch-logo-hell.svg` auf dunklen/farbigen Hintergründen einsetzen (wie im Original).
- `poolbau-koch-logo-dunkel.svg` auf hellen/weißen Hintergründen einsetzen.
- `poolbau-koch-bildmarke.svg` als Favicon/App-Icon/Ladeanimation, wenn nur das Wellensymbol
  benötigt wird.
- Die Comfortaa-Schriftdatei selbst ist nicht Teil der SVGs (Text liegt als Pfad vor) – für
  weitere Bearbeitung in Grafikprogrammen ggf. Comfortaa (Google Fonts, OFL) zusätzlich installieren.
