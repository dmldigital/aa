import { gsap } from './motion';

/**
 * Bewertung zählt hoch: Zahl von 0,0 auf den Wert in `data-rating` (5), die goldene Füllung der Sterne (`--p` von 0 bis 1,
 * siehe ui/Stars.astro) zieht synchron dazu von links nach rechts. Startet einmal, sobald die Bewertung zu sehen ist, mit
 * kurzer Verzögerung. Bei reduzierter Bewegung steht sie gleich auf dem Endwert.
 */
export function initRating(root: ParentNode = document) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll<HTMLElement>('[data-rating]').forEach((el) => {
    const num = el.querySelector<HTMLElement>('[data-rating-num]');
    const target = Number(el.dataset.rating) || 5;
    if (!num) return;
    const show = (p: number) => {
      el.style.setProperty('--p', String(p));
      num.textContent = (target * p).toFixed(1);
    };
    if (reduce) {
      show(1);
      el.setAttribute('data-rating-on', '');
      return;
    }
    show(0);
    el.setAttribute('data-rating-on', '');
    const state = { p: 0 };
    const play = () =>
      gsap.to(state, { p: 1, duration: 2.6, delay: 0.5, ease: 'power2.out', onUpdate: () => show(state.p) });
    // Erst zählen, wenn die Seite und die Schrift geladen sind (sonst läuft es ab, bevor man hinsieht)
    const loaded = Promise.all([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      }),
    ]);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        loaded.then(play);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
  });
}
