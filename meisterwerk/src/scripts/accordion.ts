import { gsap } from 'gsap';

/**
 * Akkordeons per Datenattribut:
 *  - `data-accordion` am Wurzelelement, darin Buttons mit `aria-expanded` und `aria-controls`
 *  - `data-accordion-exclusive`: es ist höchstens ein Eintrag offen
 *  - `data-accordion-ease="power1.inOut"`: Kurve der Höhenanimation (Standard linear)
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURATION = reduced ? 0 : 0.4;

function init(root: HTMLElement) {
  const exclusive = root.hasAttribute('data-accordion-exclusive');
  const ease = root.dataset.accordionEase || 'none';
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('button[aria-expanded]')];
  const panelOf = (b: HTMLButtonElement) =>
    document.getElementById(b.getAttribute('aria-controls') || '') as HTMLElement;

  const close = (b: HTMLButtonElement) => {
    const panel = panelOf(b);
    b.setAttribute('aria-expanded', 'false');
    gsap.killTweensOf(panel);
    gsap.set(panel, { overflow: 'hidden' });
    gsap.to(panel, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
      duration: DURATION,
      ease,
      onComplete: () => {
        panel.hidden = true;
        gsap.set(panel, { clearProps: 'all' });
      },
    });
  };

  const open = (b: HTMLButtonElement) => {
    const panel = panelOf(b);
    b.setAttribute('aria-expanded', 'true');
    gsap.killTweensOf(panel);
    gsap.set(panel, { clearProps: 'all' });
    panel.hidden = false;
    const cs = getComputedStyle(panel);
    const to = {
      height: panel.getBoundingClientRect().height,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      borderBottomWidth: cs.borderBottomWidth,
    };
    gsap.set(panel, { overflow: 'hidden' });
    gsap.fromTo(
      panel,
      { height: 0, paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0 },
      {
        ...to,
        duration: DURATION,
        ease,
        onComplete: () => void gsap.set(panel, { clearProps: 'all' }),
      },
    );
  };

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const wasOpen = b.getAttribute('aria-expanded') === 'true';
      if (exclusive) {
        buttons.filter((o) => o !== b && o.getAttribute('aria-expanded') === 'true').forEach(close);
      }
      if (wasOpen) close(b);
      else open(b);
    }),
  );
}

document.querySelectorAll<HTMLElement>('[data-accordion]').forEach(init);
