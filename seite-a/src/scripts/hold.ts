import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

// Touch only: card stacks hold the page. Entering a stack stops the momentum, each swipe moves exactly one card,
// swiping past the last card releases the page (GSAP's ScrollTrigger + Observer pattern).
// Without this a hard flick flies through a whole stack at once.
export const isTouch = matchMedia('(pointer: coarse)').matches;
const STEP_DURATION = 0.75;

type Stack = { stops: () => number[] };
let held: Stack | undefined;
let index = 0;
let heldY = 0;
let stepping = false;
let passing = false;
let touched = false;
let ignoreUntil = 0;
const proxy = { y: 0 };

const hold = () => { if (held && Math.abs(scrollY - heldY) > 1) window.scrollTo(0, heldY); };
const intent = isTouch ? Observer.create({ type: 'touch', tolerance: 12, preventDefault: true, onUp: () => step(1), onDown: () => step(-1) }) : undefined;
intent?.disable();
if (isTouch) {
  addEventListener('touchstart', () => { touched = true; }, { passive: true, once: true });
  ScrollTrigger.addEventListener('refresh', () => { if (held) { heldY = held.stops()[index]; window.scrollTo(0, heldY); } });
}

function animateTo(y: number, duration: number, done?: () => void) {
  gsap.killTweensOf(proxy);
  proxy.y = scrollY;
  passing = true;
  gsap.to(proxy, {
    y, duration, ease: 'power2.inOut',
    onUpdate: () => { if (held) heldY = proxy.y; window.scrollTo(0, proxy.y); },
    onComplete: () => { passing = false; done?.(); },
  });
}
function engage(stack: Stack, at: number) {
  if (held || passing || !touched || !intent || document.body.classList.contains('menu-open') || document.body.classList.contains('overlay-open')) return;
  held = stack; index = at; heldY = stack.stops()[at];
  window.scrollTo(0, heldY);
  addEventListener('scroll', hold, { passive: true });
  ignoreUntil = performance.now() + 250;
  intent.enable();
}
export function releaseHold() {
  held = undefined; stepping = false;
  intent?.disable();
  removeEventListener('scroll', hold);
}
function step(dir: number) {
  if (!held || stepping || performance.now() < ignoreUntil) return;
  const stops = held.stops();
  const next = index + dir;
  if (next < 0 || next >= stops.length) {
    releaseHold();
    return animateTo(dir > 0 ? stops[stops.length - 1] + 2 : stops[0] - 2, .35);
  }
  index = next; stepping = true;
  animateTo(stops[next], STEP_DURATION, () => { stepping = false; });
}

/** In-page links glide past held stacks instead of getting caught in them. */
export function passThrough(y: number, duration = 1.2) {
  if (held) releaseHold();
  animateTo(y, duration);
}

/** Registers a stack on touch devices; `stops` returns the scroll position of every card. Returns a cleanup. */
export function holdStack(trigger: Element, stops: () => number[]) {
  if (!isTouch) return () => {};
  const stack: Stack = { stops };
  const st = ScrollTrigger.create({
    trigger, start: () => stops()[0], end: () => stops()[stops().length - 1],
    onEnter: () => engage(stack, 0),
    onEnterBack: () => engage(stack, stops().length - 1),
  });
  return () => { if (held === stack) releaseHold(); st.kill(); };
}
