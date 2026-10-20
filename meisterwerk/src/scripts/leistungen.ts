import { gsap, ScrollTrigger } from './motion';
import { initReveal } from './reveal';

/*
 * Leistungsübersicht: Der Titel steigt Wort für Wort aus einer Maske auf, die Zeilen blenden gestaffelt ein.
 * Desktop: Die Bildbühne rechts bleibt stehen und blendet zum Bild der Leistung über, die gerade angewählt ist (Hover,
 * Fokus oder die Zeile in der Bildmitte beim Scrollen). Handy und Tablet: jede Zeile bringt ihr Bild selbst mit.
 */
export function initLeistungen() {
  const root = document.querySelector<HTMLElement>('[data-ls]');
  if (!root) return;

  const hero = root.querySelector<HTMLElement>('.ls-title');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = hero.querySelectorAll('.ls-word');
    gsap.set(words, { yPercent: 110 });
    hero.classList.add('is-go');
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(root.querySelector('.ls-rule'), { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0);
    tl.to(words, { yPercent: 0, duration: 1.25, ease: 'power4.out', stagger: 0.14 }, 0.1);
  }
  initReveal();

  const rows = [...root.querySelectorAll<HTMLAnchorElement>('[data-ls-row]')];
  const layers = [...root.querySelectorAll<HTMLElement>('[data-ls-layer]')];
  const go = root.querySelector<HTMLAnchorElement>('[data-ls-go]');
  if (!rows.length || !layers.length) return;

  const select = (i: number) => {
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    layers.forEach((l, k) => l.classList.toggle('is-active', k === i));
    root.classList.add('has-active');
    if (go) go.href = rows[i].href;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 64.0625rem)', () => {
    select(0);
    const triggers = rows.map((row, i) =>
      ScrollTrigger.create({
        trigger: row,
        start: 'top 58%',
        end: 'bottom 58%',
        onToggle: (self) => self.isActive && select(i),
      }),
    );
    const cleanups: (() => void)[] = [];
    rows.forEach((row, i) => {
      const enter = (e: PointerEvent) => e.pointerType === 'mouse' && select(i);
      const focus = () => select(i);
      row.addEventListener('pointerenter', enter);
      row.addEventListener('focus', focus);
      cleanups.push(() => {
        row.removeEventListener('pointerenter', enter);
        row.removeEventListener('focus', focus);
      });
    });
    return () => {
      triggers.forEach((t) => t.kill());
      cleanups.forEach((c) => c());
      rows.forEach((r) => r.classList.remove('is-active'));
      layers.forEach((l) => l.classList.remove('is-active'));
      root.classList.remove('has-active');
    };
  });
}
