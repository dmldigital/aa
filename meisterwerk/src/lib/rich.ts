/** Formatierung für Fließtext aus dem Original (Elementor-Texteditor: p, ul, strong, leere Überschriften). Em-Werte wie im Original. */
export const rich = [
  '[&_p]:mb-[15px] [&_p]:text-[15px] lg:[&_p]:mb-[22.5px] [&_strong]:font-bold',
  '[&_ul]:my-[1em] [&_ul]:list-disc [&_ul]:pl-[1.7em]',
  '[&_h3]:mt-[0.6em] [&_h3]:mb-[0.3em] [&_h3]:font-display [&_h3]:text-[21px]/[26.25px] [&_h3]:text-ink md:[&_h3]:text-[24px]/[30px] lg:[&_h3]:text-[32px]/[40px]',
  '[&_h4]:mt-[0.6em] [&_h4]:mb-[0.3em] [&_h4]:font-display [&_h4]:font-medium [&_h4]:text-ink [&_h4]:text-[19px]/[24.7px] md:[&_h4]:text-h5 lg:[&_h4]:text-h4',
].join(' ');
