import { ScrollTrigger } from './motion';

/*
 * Einblenden beim Scrollen: Elemente mit `data-rv` (steigen auf) und `data-rv-line` (Linie zieht auf) bekommen beim
 * Hereinscrollen die Klasse `is-in`, mehrere gleichzeitig gestaffelt. Ausgangszustand und Übergänge: global.css.
 */
export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ScrollTrigger.batch('[data-rv], [data-rv-line]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      els.forEach((el, i) => {
        (el as HTMLElement).style.setProperty('--d', `${i * 0.1}s`);
        el.classList.add('is-in');
      }),
  });
}
