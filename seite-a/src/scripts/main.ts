import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initMotion } from './motion';
import { afterFirstVisit } from './defer';

gsap.registerPlugin(ScrollTrigger);

export function initSite() {
  // Mobile address bars resize the viewport while scrolling; refreshing then makes scroll effects jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add('ready');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lenis smooths the mouse wheel only; touch keeps native scrolling and momentum.
  let lenis: Lenis | undefined;
  if (!reduced && !matchMedia('(pointer: coarse)').matches) {
    lenis = new Lenis({ lerp: .085, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Header: white "Plankopf" at the top; once scrolled it floats (desktop: it morphs into the floating bar), hidden while scrolling down.
  const header = document.getElementById('site-header')!;
  // Desktop morph, FLIP style: logo, menu labels and button are measured before and after the class switch and glide from the old
  // to the new place; frame, shadow and size run through the CSS transitions. The button changes its size, so its box is scaled
  // while the label is scaled back to keep its natural size.
  const morphHeader = (on: boolean) => {
    const parts = [...header.querySelectorAll<HTMLElement>('.brand img, .brand-text, .main-nav .roll-text')];
    const cta = header.querySelector<HTMLElement>('.header-cta')!;
    const label = cta.querySelector<HTMLElement>('span')!;
    gsap.killTweensOf([...parts, cta, label]);
    gsap.set([...parts, cta, label], { clearProps: 'transform' });
    const read = (el: Element) => { const r = el.getBoundingClientRect(), b = header.getBoundingClientRect(); return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }; };
    const from = parts.map(read), cFrom = read(cta);
    header.classList.add('is-morphing');
    header.classList.toggle('is-scrolled', on);
    const to = parts.map(read), cTo = read(cta);
    const opts = { x: 0, y: 0, duration: .85, ease: 'soft', clearProps: 'transform' };
    parts.forEach((el, i) => gsap.fromTo(el, { x: from[i].x - to[i].x, y: from[i].y - to[i].y }, opts));
    gsap.set(cta, { transformOrigin: '0 0' });
    gsap.fromTo(cta, { x: cFrom.x - cTo.x, y: cFrom.y - cTo.y, scaleX: cFrom.w / cTo.w, scaleY: cFrom.h / cTo.h }, {
      ...opts, scaleX: 1, scaleY: 1,
      onUpdate: () => { gsap.set(label, { scaleX: 1 / (gsap.getProperty(cta, 'scaleX') as number), scaleY: 1 / (gsap.getProperty(cta, 'scaleY') as number) }); },
      onComplete: () => { gsap.set(label, { clearProps: 'transform' }); header.classList.remove('is-morphing'); },
    });
  };
  const setScrolled = (on: boolean, animate: boolean) => {
    if (header.classList.contains('is-scrolled') === on) return;
    if (animate && !reduced && matchMedia('(min-width: 1024px)').matches) morphHeader(on);
    else header.classList.toggle('is-scrolled', on);
  };
  let last = scrollY;
  const onScroll = (animate = true) => {
    const y = scrollY;
    setScrolled(y > 40, animate);
    if (!document.body.classList.contains('menu-open')) {
      if (y > last + 5 && y > 300) header.classList.add('is-hidden');
      else if (y < last - 5) header.classList.remove('is-hidden');
    }
    last = y;
  };
  addEventListener('scroll', () => onScroll(), { passive: true });
  onScroll(false);

  // Phone menu
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const drawer = document.getElementById('drawer')!;
  const setMenu = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    drawer.classList.toggle('is-open', open);
    drawer.inert = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) {
      lenis?.stop();
      if (!reduced) {
        // While the panel is still sliding down, the entries are revealed downwards through their mask, one after another;
        // the button and contact block follow.
        gsap.timeline({ defaults: { ease: 'soft' }, delay: .38 })
          .fromTo(drawer.querySelectorAll('.drawer-label'), { yPercent: -110 }, { yPercent: 0, duration: 1.1, stagger: .07 }, 0)
          .fromTo(drawer.querySelector('.drawer-bottom'), { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .35);
      }
    } else lenis?.start();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // In-page links glide to their target below the header (and past the held card stack on touch).
  document.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    const target = link && document.getElementById(link.getAttribute('href')!.slice(1));
    if (!target) return;
    event.preventDefault();
    if (drawer.classList.contains('is-open')) setMenu(false);
    const top = target.id === 'start' ? 0 : target.getBoundingClientRect().top + scrollY - header.offsetHeight + 1;
    if (lenis) lenis.scrollTo(top, { duration: 1.4 });
    else if (reduced) window.scrollTo(0, top);
    else window.scrollTo({ top, behavior: 'smooth' });
  });

  // Videos play only while they are on screen (muted, looping). Their posters and the videos themselves are only requested
  // after the first visit interaction (or a long idle time), so they never weigh on the first paint or a page speed run.
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target as HTMLVideoElement;
    if (entry.isIntersecting) { if (video.preload === 'none') video.preload = 'auto'; video.play().catch(() => {}); }
    else video.pause();
  }), { threshold: .25, rootMargin: '200px 0px' });
  afterFirstVisit().then(() => document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach(v => {
    if (v.dataset.poster) v.poster = v.dataset.poster;
    io.observe(v);
  }));

  initMotion(reduced);
}
