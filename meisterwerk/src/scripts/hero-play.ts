import { gsap, lenis } from './motion';
import type { Flug } from './flug';

/**
 * Steuerung des Hero-Ablaufs (Startseite und ihre Varianten): EIN Ablauf aus einer pausierten GSAP-Zeitleiste, an deren
 * Fortschritt das Video (`Flug`) hängt. Beim ersten Scrollen nach unten läuft er von selbst vorwärts (der Kunde kann ihn
 * nicht anhalten, die Seite steht so lange), danach scrollt die Seite von selbst zur nächsten Sektion. Ganz oben nach
 * Hochscrollen läuft alles gemeinsam rückwärts. Anker-Links überspringen den Ablauf.
 */
export function createHeroPlayer(hero: HTMLElement, flug: Flug, duration: number) {
  let tl: gsap.core.Timeline | null = null;
  let loaded = false;
  let locked = false;
  let leftTop = false; // erst nach echtem Wegscrollen löst „ganz oben“ das Rückwärtslaufen aus

  const atTop = () => window.scrollY <= 2;
  const ended = () => !!tl && tl.progress() >= 1;
  const lock = (on: boolean) => {
    locked = on;
    if (on) lenis?.stop();
    else lenis?.start();
  };
  const toTop = () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0));
  const toNext = () => {
    const y = hero.offsetTop + hero.offsetHeight;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const finish = (at: 'start' | 'end') => {
    lock(false);
    if (at === 'end') {
      leftTop = false;
      toNext();
    }
  };
  const forward = () => {
    if (!tl || locked || tl.progress() >= 1) return;
    leftTop = false;
    if (!atTop()) toTop();
    lock(true);
    tl.play();
  };
  const backward = () => {
    if (!tl || locked || tl.progress() <= 0) return;
    lock(true);
    tl.reverse();
  };

  const block = (e: Event) => {
    if (e.cancelable) e.preventDefault();
    (e as Event & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
  };
  window.addEventListener(
    'wheel',
    (e) => {
      if (!tl) return;
      if (e.deltaY > 0 && atTop()) forward();
      else if (e.deltaY < 0 && atTop() && ended()) backward();
      if (locked) block(e);
    },
    { capture: true, passive: false },
  );
  let touchY = 0;
  window.addEventListener('touchstart', (e) => (touchY = e.touches[0].clientY), { capture: true, passive: true });
  window.addEventListener(
    'touchmove',
    (e) => {
      if (!tl) return;
      const dy = touchY - e.touches[0].clientY; // > 0 = nach unten scrollen
      if (dy > 8 && atTop()) forward();
      else if (dy < -8 && atTop() && ended()) backward();
      if (locked) block(e);
    },
    { capture: true, passive: false },
  );
  window.addEventListener(
    'keydown',
    (e) => {
      if (!tl) return;
      const down = ['ArrowDown', 'PageDown', 'End', ' '].includes(e.key);
      const typing = (e.target as HTMLElement).closest?.('input, textarea, select');
      if (down && atTop() && !typing) forward();
      if (locked && (down || ['ArrowUp', 'PageUp', 'Home'].includes(e.key)) && !typing) e.preventDefault();
    },
    { capture: true },
  );
  // Anker-Links (Menü, Buttons): Ablauf überspringen und direkt zum Ziel scrollen
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || !tl || ended()) return;
      const u = new URL(a.href, location.href);
      if (u.pathname !== location.pathname || !u.hash || u.hash === '#') return;
      tl.progress(1);
      leftTop = true;
      lock(false);
    },
    true,
  );
  window.addEventListener(
    'scroll',
    () => {
      if (!tl) return;
      const y = window.scrollY;
      if (locked) {
        if (y > 2) toTop(); // Scrollleiste gezogen o. Ä.: festhalten
        return;
      }
      if (y > 40) leftTop = true;
      if (y > 10 && tl.progress() === 0) forward(); // z. B. Scrollleiste gezogen
      else if (atTop() && leftTop && ended()) backward(); // zurück ganz oben: alles rückwärts
    },
    { passive: true },
  );

  return {
    /** Neue pausierte Zeitleiste, deren Fortschritt das Video steuert. `duration` Sekunden für den ganzen Ablauf. */
    timeline(): gsap.core.Timeline {
      const t: gsap.core.Timeline = gsap.timeline({
        paused: true,
        onUpdate: () => flug.seek(t.progress()),
        onComplete: () => finish('end'),
        onReverseComplete: () => finish('start'),
      });
      return t;
    },
    /** Zeitleiste fertig aufgebaut: Länge setzen, Endstand bei Neuladen weiter unten, Bilder laden. */
    ready(t: gsap.core.Timeline) {
      t.duration(duration);
      tl = t;
      if (window.scrollY > 2) t.progress(1);
      if (!loaded) {
        loaded = true;
        flug.load(window.scrollY > 2);
      }
    },
    /** Zeitleiste wird verworfen (anderer Bildschirmzuschnitt, reduzierte Bewegung) */
    detach() {
      tl = null;
      flug.jump(0);
    },
  };
}
