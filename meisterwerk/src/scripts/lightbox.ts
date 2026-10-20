import { lenis } from './motion';

/**
 * Bedient die Großansicht (`components/ui/Lightbox.astro`) in `root`: Ein Klick auf eines der `items` öffnet das Bild
 * aus `data-full`, Pfeile, Pfeiltasten, Esc und Wischen blättern, der Fokus bleibt im Dialog, Lenis ruht solange.
 */
export function initLightbox(root: HTMLElement, items: HTMLElement[]) {
  const lb = root.querySelector<HTMLElement>('[data-lb]');
  if (!lb || !items.length) return;
  const img = lb.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const closeBtn = lb.querySelector<HTMLElement>('[data-lb-close]')!;
  const prevBtn = lb.querySelector<HTMLElement>('[data-lb-prev]')!;
  const nextBtn = lb.querySelector<HTMLElement>('[data-lb-next]')!;
  let current = 0;
  let opener: HTMLElement | null = null;
  let closing: number | undefined;

  const show = (i: number) => {
    current = (i + items.length) % items.length;
    img.classList.remove('is-in');
    const next = new Image();
    next.onload = () => {
      img.src = next.src;
      requestAnimationFrame(() => img.classList.add('is-in'));
    };
    next.src = items[current].dataset.full!;
  };
  const open = (i: number) => {
    opener = document.activeElement as HTMLElement;
    window.clearTimeout(closing);
    lb.hidden = false;
    show(i);
    requestAnimationFrame(() => lb.classList.add('is-open'));
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = () => {
    lb.classList.remove('is-open');
    closing = window.setTimeout(() => {
      lb.hidden = true;
      img.removeAttribute('src');
    }, 350);
    lenis?.start();
    document.documentElement.style.overflow = '';
    opener?.focus();
  };

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => {
    if (e.target === lb || (e.target as HTMLElement).classList.contains('lb-fig')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') {
      const f = [closeBtn, prevBtn, nextBtn];
      const idx = f.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  // Wischen
  let x0 = 0;
  lb.addEventListener('pointerdown', (e) => (x0 = e.clientX));
  lb.addEventListener('pointerup', (e) => {
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 60) show(current + (dx < 0 ? 1 : -1));
  });
}
