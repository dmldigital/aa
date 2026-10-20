import { gsap } from 'gsap';

/**
 * Endlos-Karussell (Original 3472c30: „Unsere Exklusive Projekte“). Erwartet in `root`:
 * `[data-viewport]` mit `[data-track]` (Karten dreifach: Klon-Satz, echte Karten, Klon-Satz), optional
 * `[data-prev]`, `[data-next]` und `[data-dots] button`. Gezogen wird mit Maus und Finger, nach dem Ziehen
 * löst die Karte unter dem Zeiger nicht aus.
 */
export function initCarousel(root: HTMLElement) {
  const view = root.querySelector<HTMLElement>('[data-viewport]');
  const track = root.querySelector<HTMLElement>('[data-track]');
  if (!view || !track) return;

  const slides = [...track.children] as HTMLElement[];
  const COUNT = slides.length / 3;
  const dots = [...root.querySelectorAll<HTMLElement>('[data-dots] button')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos = COUNT; // Platz im Track; die erste echte Karte steht an Position COUNT
  let step = 0;
  let tween: gsap.core.Tween | undefined;

  const markDots = () => {
    const active = ((pos % COUNT) + COUNT) % COUNT;
    dots.forEach((d, i) =>
      i === active ? d.setAttribute('data-active', '') : d.removeAttribute('data-active'),
    );
  };

  // Gleiche Anzahl sichtbarer Karten wie die Swiper-Haltepunkte im Original
  const layout = () => {
    const w = window.innerWidth;
    track.style.setProperty('--n', String(w >= 1024 ? 3 : w >= 767 ? 2 : 1));
    step =
      slides[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).columnGap || '0');
    gsap.set(track, { x: -pos * step });
  };

  // Springt nach einer Schleife unsichtbar zurück zu den echten Karten
  const normalize = () => {
    const shift = pos < COUNT ? COUNT : pos >= 2 * COUNT ? -COUNT : 0;
    if (!shift) return;
    pos += shift;
    gsap.set(track, { x: Number(gsap.getProperty(track, 'x')) - shift * step });
  };

  const goTo = (target: number) => {
    tween?.kill();
    normalize();
    pos = target;
    markDots();
    tween = gsap.to(track, {
      x: -pos * step,
      duration: reduced ? 0 : 0.5,
      ease: 'power2.out',
      onComplete: normalize,
    });
  };

  root.querySelector('[data-prev]')?.addEventListener('click', () => goTo(pos - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => goTo(pos + 1));
  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      const current = ((pos % COUNT) + COUNT) % COUNT;
      goTo(pos + (i - current));
    }),
  );

  // Wischen und Ziehen
  let startX = 0;
  let startTrackX = 0;
  let down = false;
  let moved = false;
  view.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    tween?.kill();
    normalize();
    down = true;
    moved = false;
    startX = e.clientX;
    startTrackX = Number(gsap.getProperty(track, 'x'));
  });
  view.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      view.setPointerCapture(e.pointerId);
    }
    if (moved) gsap.set(track, { x: startTrackX + dx });
  });
  const release = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    if (!moved) return;
    const dx = e.clientX - startX;
    const threshold = Math.min(60, step * 0.15);
    goTo(dx < -threshold ? pos + 1 : dx > threshold ? pos - 1 : pos);
  };
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);
  // Nach dem Ziehen darf die Karte nicht auslösen
  view.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );

  new ResizeObserver(layout).observe(view);
  layout();
  markDots();
}
