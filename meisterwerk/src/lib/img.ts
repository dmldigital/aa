/** Bild aus src/assets/img per Dateiname (für Daten-Dateien mit vielen Bildern). */
const all = import.meta.glob<ImageMetadata>('../assets/img/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export function img(file: string): ImageMetadata {
  const meta = all[`../assets/img/${file}`];
  if (!meta) throw new Error(`Bild nicht gefunden: src/assets/img/${file}`);
  return meta;
}
