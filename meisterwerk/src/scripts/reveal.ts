import { gsap, ScrollTrigger } from './motion';

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

/*
 * Auftritt einer Box (Karte, Bildkachel): Die ganze Box steigt auf und öffnet sich von unten nach oben, das Bild darin
 * bleibt ruhig. Mehrere Boxen, die gleichzeitig ins Bild kommen, folgen nacheinander. Die Boxen warten mit
 * `data-pend` (Ausgangszustand in global.css).
 */
export function initBoxReveal(elements: HTMLElement[]) {
  if (!elements.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((c) => c.removeAttribute('data-pend'));
    return;
  }
  ScrollTrigger.batch(elements, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      batch.forEach((c) => c.removeAttribute('data-pend'));
      gsap.fromTo(
        batch,
        { clipPath: 'inset(100% 0% 0% 0%)', y: 48 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 1.3,
          ease: 'power3.out',
          stagger: 0.16,
          clearProps: 'clipPath,transform',
        },
      );
    },
  });
}
