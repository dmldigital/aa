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
const SLIDE = 56; // px
const PRESETS: Record<string, From> = {
  fadeIn: { opacity: 0 },
  // Alles kommt als Ganzes ein kurzes Stück herein und blendet dabei ein, nie aus einer Maske oder von der Kante aufgezogen
  fadeInUp: { opacity: 0, y: SLIDE },
  fadeInDown: { opacity: 0, y: -SLIDE },
  fadeInLeft: { opacity: 0, x: -SLIDE },
  fadeInRight: { opacity: 0, x: SLIDE },
  slideInUp: { opacity: 0, y: SLIDE },
  slideInDown: { opacity: 0, y: -SLIDE },
  slideInLeft: { opacity: 0, x: -SLIDE },
  slideInRight: { opacity: 0, x: SLIDE },
};
const DURATION: Record<string, number> = { slow: 2, fast: 0.75 };

export function playAnim(el: HTMLElement, name: string) {
  const from = PRESETS[name];
  const delay = Number(el.dataset.animDelay || 0) / 1000;
  // Handy: Einblenden mit kleinem Weg und etwas länger, damit es ruhig wirkt (Vollmaße wie 100 % springen auf kleinen Bildschirmen)
  const soft = isMobile();
  const duration = (DURATION[el.dataset.animDur || ''] ?? 1.25) * (soft ? 1.2 : 1);
  if (!from) {
    el.style.visibility = 'visible';
    return;
  }
  const start: gsap.TweenVars = soft
    ? { ...from, x: ((from.x as number) ?? 0) * 0.5, y: ((from.y as number) ?? 0) * 0.5 }
    : from;
  const to: gsap.TweenVars = { opacity: 1, x: 0, y: 0 };
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

  /* Bilder und Boxen kommen als Ganzes ein Stück hoch und blenden ein (kein Aufziehen aus einer Kante, kein Zoom) */
  document.querySelectorAll<HTMLElement>('[data-grow]').forEach((wrap) => {
    if (reduced) {
      wrap.style.opacity = '1';
      return;
    }
    gsap.set(wrap, { opacity: 0, y: SLIDE });
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const delay = Number(wrap.dataset.animDelay || 0) / 1000;
      gsap.to(wrap, { opacity: 1, y: 0, duration: 1.25, delay, ease: 'css', clearProps: 'transform' });
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
