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

  // Header: transparent over the hero, anthracite once scrolled, hidden while scrolling down.
  const header = document.getElementById('site-header')!;
  let last = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (!document.body.classList.contains('menu-open')) {
      if (y > last + 5 && y > 300) header.classList.add('is-hidden');
      else if (y < last - 5) header.classList.remove('is-hidden');
    }
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
        // The panel is still growing from the button when the entries start: labels drive in from the right through the row,
        // numbers and arrows follow, then the button and contact block rise.
        const tl = gsap.timeline({ defaults: { ease: 'soft' }, delay: .5 });
        tl.fromTo(drawer.querySelectorAll('.drawer-label'), { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, stagger: .08 }, 0)
          .fromTo(drawer.querySelectorAll('.drawer-num'), { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .9, stagger: .08 }, .1)
          .fromTo(drawer.querySelectorAll('.drawer-arrow'), { x: -18, opacity: 0 }, { x: 0, opacity: .55, duration: .9, stagger: .08 }, .2)
          .fromTo(drawer.querySelectorAll('.drawer-cta, .drawer-foot > *'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .09 }, .5);
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
