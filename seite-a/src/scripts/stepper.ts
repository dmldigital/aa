// Prev/next buttons for a horizontal snap row: one tap moves one item to the centre; the buttons dim at either end.
export function stepper(row: HTMLElement, itemSelector: string, prev: HTMLButtonElement, next: HTMLButtonElement) {
  const items = [...row.querySelectorAll<HTMLElement>(itemSelector)];
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const offset = (el: HTMLElement) => {
    const r = el.getBoundingClientRect(), box = row.getBoundingClientRect();
    return row.scrollLeft + r.left - box.left + r.width / 2 - row.clientWidth / 2;
  };
  const current = () => {
    let best = 0, bestD = Infinity;
    items.forEach((el, i) => { const d = Math.abs(offset(el) - row.scrollLeft); if (d < bestD) { bestD = d; best = i; } });
    return best;
  };
  const go = (dir: number) => {
    const i = Math.min(items.length - 1, Math.max(0, current() + dir));
    row.scrollTo({ left: offset(items[i]), behavior: smooth ? 'smooth' : 'auto' });
  };
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    prev.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft >= max - 2;
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let raf = 0;
  row.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', update);
  update();
}
