import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, CustomEase);
// Handy: Das Ein- und Ausfahren der Browserleiste ändert nur die Höhe und soll keine Neuberechnung der Pins auslösen (Sprünge)
ScrollTrigger.config({ ignoreMobileResize: true });

// Kurven wie im Original: CSS "ease" (Elementor-Animationen) und VamTam-Bildreveal
CustomEase.create('css', '0.25,0.1,0.25,1');
CustomEase.create('grow', '0,0.55,0.45,1');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 767.98px)').matches;

/* Weiches Scrollen */
export const lenis = reduced ? null : new Lenis({ lerp: 0.07, anchors: true });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* Einblend-Animationen (Elementor/animate.css nachgebaut) */
type From = gsap.TweenVars;
const PRESETS: Record<string, From> = {
  fadeIn: { opacity: 0 },
  fadeInUp: { opacity: 0, yPercent: 100 },
  fadeInDown: { opacity: 0, yPercent: -100 },
  fadeInLeft: { opacity: 0, xPercent: -100 },
  fadeInRight: { opacity: 0, xPercent: 100 },
  slideInUp: { yPercent: 100 },
  slideInDown: { yPercent: -100 },
  slideInLeft: { xPercent: -100 },
  slideInRight: { xPercent: 100 },
};
const DURATION: Record<string, number> = { slow: 2, fast: 0.75 };

export function playAnim(el: HTMLElement, name: string) {
  const from = PRESETS[name];
  const delay = Number(el.dataset.animDelay || 0) / 1000;
  // Handy: Einblenden mit kleinem Weg und etwas länger, damit es ruhig wirkt (Vollmaße wie 100 % springen auf kleinen Bildschirmen)
  const soft = isMobile() && name.startsWith('fadeIn');
  const duration = (DURATION[el.dataset.animDur || ''] ?? 1.25) * (soft ? 1.2 : 1);
  if (!from) {
    el.style.visibility = 'visible';
    return;
  }
  const start: gsap.TweenVars = soft
    ? { ...from, xPercent: ((from.xPercent as number) ?? 0) * 0.2, yPercent: ((from.yPercent as number) ?? 0) * 0.2 }
    : from;
  const to: gsap.TweenVars = { opacity: 1, xPercent: 0, yPercent: 0 };
  gsap.fromTo(el, start, {
    ...to,
    duration,
    delay,
    ease: 'css',
    immediateRender: false,
    onStart: () => {
      el.style.visibility = 'visible';
    },
    clearProps: 'transform,opacity',
  });
}

function animName(el: HTMLElement) {
  if (isMobile() && el.dataset.animMobile) return el.dataset.animMobile;
  return el.dataset.anim || 'none';
}

function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-anim], [data-anim-mobile]').forEach((el) => {
    if (el.closest('[data-anim-manual]')) return;
    const name = animName(el);
    if (reduced || name === 'none') {
      el.style.visibility = 'visible';
      return;
    }
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      playAnim(el, name);
    };
    // Auch beim schnellen Überspringen auslösen, damit nichts unsichtbar bleibt
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      once: true,
      onEnter: play,
      onEnterBack: play,
      onLeave: play,
      onLeaveBack: play,
    });
  });

  /* Bild wächst aus einer Kante und zoomt dabei von 1,4 auf 1 (VamTam imageGrowWithScale) */
  const INSET: Record<string, string> = {
    bottom: 'inset(0% 0% 100% 0%)',
    top: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  };
  document.querySelectorAll<HTMLElement>('[data-grow]').forEach((wrap) => {
    const dir = wrap.dataset.grow || 'bottom';
    const img = wrap.querySelector('img');
    if (reduced) {
      wrap.style.clipPath = 'none';
      return;
    }
    wrap.style.clipPath = INSET[dir];
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const delay = Number(wrap.dataset.animDelay || 0) / 1000;
      gsap.fromTo(
        wrap,
        { clipPath: INSET[dir] },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.25,
          delay,
          ease: 'grow',
          onComplete: () => {
            wrap.style.clipPath = 'none';
          },
        },
      );
      if (img)
        gsap.fromTo(
          img,
          { scale: 1.4 },
          { scale: 1, duration: 1.25, delay, ease: 'grow', clearProps: 'transform' },
        );
    };
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      once: true,
      onEnter: play,
      onEnterBack: play,
      onLeave: play,
      onLeaveBack: play,
    });
  });
}

initReveals();
window.addEventListener('load', () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger };
