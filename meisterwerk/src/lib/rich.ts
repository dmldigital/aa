/** Formatierung für Fließtext aus dem Original (Elementor-Texteditor: p, ul, strong, leere Überschriften). Em-Werte wie im Original. */
export const rich = [
  '[&_p]:mb-[1em] lg:[&_p]:mb-[1.5em] [&_strong]:font-bold',
  '[&_ul]:my-[1em] [&_ul]:list-disc [&_ul]:pl-[1.7em]',
  '[&_h2]:mt-[0.6em] [&_h2]:mb-[0.3em] [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-ink [&_h2]:text-h2',
  '[&_h3]:mt-[0.6em] [&_h3]:mb-[0.3em] [&_h3]:font-display [&_h3]:text-h3 [&_h3]:text-ink',
  '[&_h4]:mt-[0.6em] [&_h4]:mb-[0.3em] [&_h4]:font-display [&_h4]:font-medium [&_h4]:text-ink [&_h4]:text-h4',
].join(' ');
