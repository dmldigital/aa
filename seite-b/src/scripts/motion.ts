/**
 * Gemeinsames Bewegungsmodul der Seite (ersetzt die verstreuten DOMContentLoaded-Skripte).
 *
 * Regeln:
 *  - eine Kurve (cubic-bezier(.22, 1, .36, 1), in GSAP als "mw"), feste Zeiten, kleine Wege, kein Überschwingen
 *  - GSAP + ScrollTrigger für Einblendungen, Lenis nur für Mausrad auf dem Desktop (Touch scrollt nativ)
 *  - prefers-reduced-motion wird vollständig respektiert: keine Einblendungen, kein Lenis, kein Autoplay
 *  - alles, was gsap.matchMedia() anlegt, wird beim Wechsel der Bedingung sauber zurückgesetzt;
 *    Ereignis-Listener hängen an einem AbortController und verschwinden mit destroy()
 *
 * Markup-Konventionen:
 *  [data-lines]       Überschrift, wird zeilenweise sanft hochgeblendet
 *  [data-reveal]      Block, wird beim Hereinscrollen weich eingeblendet (gestaffelt, wenn mehrere zugleich)
 *  [data-media]       Bild/Video-Kachel mit .media-curtain und .media-zoom, wird von unten aufgedeckt
 *  [data-video-tile]  Kachel mit Video: Hover/Klick spielt ab
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

declare global {
  interface Window {
    __mwReady?: boolean;
    __mw?: { destroy: () => void };
  }
}

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('mw', '0.22, 1, 0.36, 1');
ScrollTrigger.config({ ignoreMobileResize: true });

/** Feste Zeiten und Wege */
const T = {
  reveal: 1.1, // Einblenden 0.9 bis 1.2 s
  media: 1.15, // Aufdecken von Bildern und Videos
  stagger: 0.08, // 0.06 bis 0.1 s
  dist: 24, // 16 bis 28 px
};

const root = document.documentElement;
const q = <E extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<E>(sel);
const qa = <E extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<E>(sel));

let lenis: Lenis | null = null;

/** Element als eingeblendet markieren und Inline-Stile entfernen, damit CSS-Hover wieder greift */
function markIn(...els: Array<Element | null | undefined>) {
  els.forEach((el) => {
    if (!el) return;
    el.classList.add('is-in');
    gsap.set(el, { clearProps: 'opacity,transform,visibility,clipPath' });
  });
}

/* ==========================================================================
   Header: Ein- und Ausblenden beim Scrollen
   ========================================================================== */
function initHeader(signal: AbortSignal, isDrawerOpen: () => boolean) {
  const header = q('[data-header]');
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 60);

    if (isDrawerOpen()) {
      last = y;
      return;
    }
    if (y > 240) {
      if (y - last > 6) header.classList.add('is-hidden');
      else if (last - y > 6) header.classList.remove('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    last = y;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true, signal },
  );

  // Tastaturfokus im Header blendet ihn immer ein
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'), { signal });
  update();
}

/* ==========================================================================
   Drawer (Handy/Tablet): Klassenwechsel, Übergänge stehen im CSS
   ========================================================================== */
function initDrawer(signal: AbortSignal) {
  const drawer = q('[data-drawer]');
  const openBtn = q<HTMLButtonElement>('[data-drawer-open]');
  if (!drawer || !openBtn) return () => false;

  const panel = q('.drawer-panel', drawer) as HTMLElement;
  const closeBtn = q<HTMLButtonElement>('button[data-drawer-close]', drawer);
  let open = false;

  const focusables = () =>
    qa<HTMLElement>('a[href], button:not([disabled])', panel).filter((el) => el.offsetParent !== null);

  const setOpen = (next: boolean) => {
    if (next === open) return;
    open = next;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-locked', open);
    if (open) {
      lenis?.stop();
      window.setTimeout(() => closeBtn?.focus({ preventScroll: true }), 80);
    } else {
      lenis?.start();
      openBtn.focus({ preventScroll: true });
    }
  };

  openBtn.addEventListener('click', () => setOpen(true), { signal });
  qa('[data-drawer-close]', drawer).forEach((el) => el.addEventListener('click', () => setOpen(false), { signal }));
  qa('[data-drawer-link]', drawer).forEach((el) =>
    el.addEventListener(
      'click',
      () => {
        // Ziel erst nach dem Schließen ansteuern, Fokus nicht zurück auf den Burger zwingen
        open = false;
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        openBtn.setAttribute('aria-expanded', 'false');
        root.classList.remove('is-locked');
        lenis?.start();
      },
      { signal },
    ),
  );

  window.addEventListener(
    'keydown',
    (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal },
  );

  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', (e) => e.matches && setOpen(false), { signal });

  return () => open;
}

/* ==========================================================================
   Video-Kacheln: Hover (Maus) oder Klick/Tippen spielt ab, Verlassen pausiert
   ========================================================================== */
function initVideos(signal: AbortSignal) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  qa('[data-video-tile]').forEach((tile) => {
    const video = q<HTMLVideoElement>('video', tile);
    const toggle = q('[data-video-toggle]', tile);
    if (!video) return;

    const set = (playing: boolean) => {
      tile.classList.toggle('is-playing', playing);
      toggle?.setAttribute('aria-label', playing ? 'Video pausieren' : 'Video abspielen');
    };
    const play = () => {
      video.play().then(() => set(true)).catch(() => set(false));
    };
    const pause = () => {
      video.pause();
      set(false);
    };

    tile.addEventListener(
      'pointerenter',
      (e) => {
        if (e.pointerType === 'mouse' && !reduce.matches) play();
      },
      { signal },
    );
    tile.addEventListener(
      'pointerleave',
      (e) => {
        if (e.pointerType === 'mouse') pause();
      },
      { signal },
    );
    toggle?.addEventListener('click', () => (video.paused ? play() : pause()), { signal });

    // Außerhalb des Bildschirms anhalten (Touch-Geräte, Energie sparen)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => !en.isIntersecting && !video.paused && pause()),
      { threshold: 0 },
    );
    io.observe(tile);
    signal.addEventListener('abort', () => io.disconnect());
  });
}

/* ==========================================================================
   Team-Dialog (Handy/Tablet)
   ========================================================================== */
function initTeamDialog(signal: AbortSignal) {
  const mobileTeam = q('[data-team-mobile]');
  const dialog = mobileTeam ? q<HTMLDialogElement>('[data-team-dialog]', mobileTeam) : null;
  if (!mobileTeam || !dialog) return;

  const set = (sel: string, text: string) => {
    const el = q(sel, mobileTeam);
    if (el) el.textContent = text;
  };

  mobileTeam.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement;
      const trigger = target.closest<HTMLElement>('[data-team-open]');
      if (trigger) {
        const d = trigger.dataset;
        const img = q<HTMLImageElement>('[data-team-dialog-image]', mobileTeam);
        if (img) {
          img.src = d.teamImage || '';
          img.alt = d.teamName || '';
        }
        set('[data-team-dialog-code]', d.teamCode || '');
        set('[data-team-dialog-department]', d.teamDepartment || '');
        set('[data-team-dialog-name]', d.teamName || '');
        set('[data-team-dialog-role]', d.teamRole || '');
        set('[data-team-dialog-qualification]', d.teamQualification || '');
        set('[data-team-dialog-quote]', d.teamQuote || '');
        const exp = q('[data-team-dialog-experience]', mobileTeam);
        if (exp) {
          exp.hidden = !d.teamExperience;
          exp.textContent = d.teamExperience ? `${d.teamExperience} Erfahrung` : '';
        }
        dialog.showModal();
        return;
      }
      if (target.closest('[data-team-dialog-close]')) dialog.close();
    },
    { signal },
  );

  dialog.addEventListener('click', (event) => event.target === dialog && dialog.close(), { signal });
}

/* ==========================================================================
   Nach oben
   ========================================================================== */
function initScrollTop(signal: AbortSignal) {
  qa('[data-scroll-top]').forEach((btn) =>
    btn.addEventListener(
      'click',
      () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      { signal },
    ),
  );
}

/* ==========================================================================
   Handy: Leistungen als Sticky-Stapel, jede Fläche gleitet über die vorige
   ========================================================================== */
function initMobileServices(signal: AbortSignal) {
  const track = q('[data-mobile-services-track]');
  const stage = track ? q('[data-mobile-services-stage]', track) : null;
  if (!track || !stage) return;

  const slides = qa<HTMLElement>('.service-mobile-slide', stage);
  const steps = qa('[data-service-step]', track);
  if (!slides.length || !steps.length) return;

  const mobile = window.matchMedia('(max-width: 767px)');
  let frame = 0;

  const update = () => {
    frame = 0;
    if (!mobile.matches) return;
    const line = window.innerHeight * 0.52;
    let active = 0;
    steps.forEach((step, i) => {
      if (step.getBoundingClientRect().top <= line) active = i + 1;
    });
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-revealed', i <= active);
      slide.setAttribute('aria-hidden', String(i !== active));
      slide.inert = i !== active;
      const link = q<HTMLElement>('a', slide);
      link?.setAttribute('tabindex', i === active ? '0' : '-1');
    });
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', schedule, { passive: true, signal });
  mobile.addEventListener('change', schedule, { signal });
  signal.addEventListener('abort', () => frame && window.cancelAnimationFrame(frame));
  update();
}

/* ==========================================================================
   Bewegung mit GSAP (nur ohne reduzierte Bewegung)
   ========================================================================== */

/** Überschrift zeilenweise sanft hochblenden */
function revealLines(el: HTMLElement, opts: { delay?: number; scroll?: boolean } = {}) {
  const { delay = 0, scroll = true } = opts;
  if (el.classList.contains('is-in')) return;

  SplitText.create(el, {
    type: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      // Wurde schon gezeigt (z. B. nach Größenänderung): nur Endzustand
      if (el.dataset.done) return gsap.set(self.lines, { opacity: 1, y: 0 });
      return gsap.fromTo(
        self.lines,
        { opacity: 0, y: T.dist },
        {
          opacity: 1,
          y: 0,
          duration: T.reveal,
          stagger: T.stagger + 0.02,
          ease: 'mw',
          delay,
          scrollTrigger: scroll ? { trigger: el, start: 'top 88%', once: true } : undefined,
          onComplete: () => {
            el.dataset.done = '1';
          },
        },
      );
    },
  });
}

function initHeroIntro() {
  const header = q('#main-header');
  const title = q('[data-hero-title]');
  const box = q('[data-hero-box]');

  if (header && !header.classList.contains('is-in')) {
    gsap.to(header, { opacity: 1, duration: T.reveal, ease: 'mw', delay: 0.1, onComplete: () => markIn(header) });
  }
  if (title) revealLines(title, { delay: 0.25, scroll: false });
  if (box && !box.classList.contains('is-in')) {
    gsap.fromTo(
      box,
      { opacity: 0, y: T.dist },
      { opacity: 1, y: 0, duration: T.reveal, ease: 'mw', delay: 0.7, onComplete: () => markIn(box) },
    );
  }
}

/** Schwache Parallaxe im Hero (Verschiebung höchstens 6 %) */
function initHeroParallax() {
  const hero = q('[data-hero]');
  const video = q('[data-hero-video]');
  if (!hero || !video) return;
  gsap.fromTo(
    video,
    { scale: 1.08, yPercent: 0 },
    {
      scale: 1.14,
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    },
  );
}

function initReveals() {
  // Überschriften (die im Hero läuft separat)
  qa('[data-lines]:not([data-hero-title])').forEach((el) => revealLines(el));

  // Blöcke: weiches Einblenden, bei gleichzeitigem Erscheinen gestaffelt
  const items = qa('[data-reveal]:not([data-hero-box])').filter((el) => !el.classList.contains('is-in'));
  if (items.length) {
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      interval: 0.1,
      batchMax: 6,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: T.dist },
          {
            opacity: 1,
            y: 0,
            duration: T.reveal,
            stagger: T.stagger,
            ease: 'mw',
            overwrite: true,
            onComplete: () => markIn(...batch),
          },
        ),
    });
  }

  // Bilder und Videos: Anthrazit-Vorhang und Bild werden von unten aufgedeckt, Bild skaliert 1.06 auf 1
  const siblingCount = new Map<Element, number>();
  qa('[data-media]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    const zoom = q('.media-zoom', el);
    const curtain = q('.media-curtain', el);
    const index = siblingCount.get(el.parentElement as Element) ?? 0;
    siblingCount.set(el.parentElement as Element, index + 1);

    gsap
      .timeline({
        defaults: { ease: 'mw' },
        delay: index * T.stagger,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => markIn(el, zoom, curtain),
      })
      .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: T.media }, 0)
      .fromTo(zoom, { scale: 1.06 }, { scale: 1, duration: 1.5 }, 0)
      .to(curtain, { opacity: 0, duration: 0.95, ease: 'power1.inOut' }, 0.12);
  });
}

/** Zähler "25+": Ziffern rollen ruhig ein */
function initCounter() {
  qa('[data-counter-col]').forEach((col, i) => {
    const to = Number(col.dataset.to || 0);
    gsap.set(col, { y: 0, yPercent: 0 });
    gsap.to(col, {
      yPercent: -to * 10,
      duration: 1.7 + i * 0.5,
      ease: 'mw',
      scrollTrigger: { trigger: col.parentElement, start: 'top 90%', once: true },
    });
  });
}

/* ==========================================================================
   Start und Aufräumen
   ========================================================================== */
export function initMotion() {
  window.__mw?.destroy();
  window.__mwReady = true;

  const ac = new AbortController();
  const { signal } = ac;
  const mm = gsap.matchMedia();
  const heroVideo = q<HTMLVideoElement>('[data-hero-video]');

  // Bedienelemente, unabhängig von der Bewegung
  const isDrawerOpen = initDrawer(signal);
  initHeader(signal, isDrawerOpen);
  initVideos(signal);
  initTeamDialog(signal);
  initScrollTop(signal);
  initMobileServices(signal);

  // Einblendungen, Zähler, Parallaxe: erst wenn die Schrift bereit ist (saubere Zeilenumbrüche)
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => window.setTimeout(resolve, 1200)),
  ]);

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('motion');
    heroVideo?.play().catch(() => {});
    let cancelled = false;

    fontsReady.then(() => {
      if (cancelled) return;
      initHeroIntro();
      initReveals();
      initCounter();
      initHeroParallax();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // Alles sofort sichtbar, Hero-Video bleibt als Standbild stehen
    root.classList.remove('motion');
    heroVideo?.pause();
  });

  // Lenis nur für Mausrad auf dem Desktop; auf Touch scrollt der Browser nativ
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    };
  });

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, { once: true, signal });

  const destroy = () => {
    ac.abort();
    mm.revert();
    ScrollTrigger.getAll().forEach((st) => st.kill());
    lenis?.destroy();
    lenis = null;
    root.classList.remove('is-locked');
    if (window.__mw?.destroy === destroy) delete window.__mw;
  };
  window.__mw = { destroy };

  // Aufräumen bei Hot Reload im Entwicklungsserver
  if (import.meta.hot) import.meta.hot.dispose(destroy);

}
