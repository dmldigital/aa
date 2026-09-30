// Motion for the free redesign. Each pattern was chosen on 21st.dev and rebuilt with GSAP for this site:
// Hero Scrub / Scroll Video Pin Reveal, Scroll Velocity, scroll word reveal, Kinetic list with cursor preview,
// Zoom Parallax, Animated Blur Number, Scroll Portrait Wall, Motion Footer.
// One shared curve ("soft", cubic-bezier .22, 1, .36, 1), fixed durations (reveals 0.9 to 1.3 s, hover 0.4 to 0.6 s,
// stagger 0.06 to 0.1 s), short travel distances and no springs.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { afterFirstVisit } from './defer';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('soft', '.22,1,.36,1');
const all = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
const EASE = 'soft';
const once = (trigger: Element | string, start = 'top 85%') => ({ trigger, start, once: true });
const DESKTOP = '(min-width: 1024px) and (pointer: fine)';
// Touch scrolling is already smoothed by the OS; a scrub delay on top of it only makes the page trail behind the finger.
const SCRUB = matchMedia('(pointer: coarse)').matches ? true : 1;

// ---------- HERO ----------------------------------------------------------------------------
// The three headline lines drive in from a screen edge (line 1 from the left, line 2 from the right, line 3 from the left).
// On scroll, lines 1 and 2 keep going the same way and leave through the opposite edge. No masks, no fading;
// scrolling back reverses it.
const FROM = [-1, 1, -1];
const EDGE = (i: number, out = false) => `${(out ? -1 : 1) * FROM[i] * 105}vw`;
let heroLines: HTMLElement[] | null = null;
function heroText() {
  if (!heroLines) {
    heroLines = all('.ht-in');
    heroLines.forEach((el, i) => gsap.set(el, { x: EDGE(i), visibility: 'visible' }));
  }
  return heroLines;
}
const CHAR_IN = { x: 0 };

function heroIntro() {
  const lines = heroText();
  const tl = gsap.timeline({ defaults: { ease: EASE } })
    .fromTo('#site-header', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, clearProps: 'transform,opacity' }, .2)
    .fromTo('.hero-video, .hero-canvas', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2 }, 0);
  lines.forEach((line, i) => tl.to(line, { ...CHAR_IN, duration: 1.7, ease: 'power3.out' }, .4 + i * .22));
  tl.from('.hero-frame b', { opacity: 0, duration: 1, stagger: .06 }, 1)
    .from('.hero-scroll', { opacity: 0, y: 12, duration: 1 }, 1.6);
  // Phone/tablet: the box follows the headline (on desktop it arrives at the end of the scrub).
  if (!matchMedia(DESKTOP).matches) gsap.fromTo('.hero-box', { y: 60, clipPath: 'inset(100% -60px -60px -60px)' }, { y: 0, clipPath: 'inset(0% -60px -60px -60px)', duration: 1.3, ease: EASE, delay: 1.2, clearProps: 'clipPath,transform' });
}

// Frame sequence on a canvas: the wanted position is eased towards (so scroll steps never show as jumps) and the two
// neighbouring frames are cross-blended for every fractional position.
function frameSequence(canvas: HTMLCanvasElement) {
  const N = Number(canvas.dataset.frames);
  const base = canvas.dataset.base!;
  const ctx = canvas.getContext('2d')!;
  const imgs: (HTMLImageElement | undefined)[] = new Array(N);
  let target = 0, cur = 0, raf = 0, dead = false, lastKey = '', loaded = 0;
  const load = (i: number) => new Promise<void>(res => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { imgs[i] = im; loaded++; if (!dead) kick(); res(); };
    im.onerror = () => res();
    im.src = `${base}f${String(i).padStart(3, '0')}.webp`;
  });
  const near = (i: number) => { for (let d = 0; d < N; d++) { if (imgs[i - d]) return imgs[i - d]; if (imgs[i + d]) return imgs[i + d]; } return undefined; };
  const cover = (im: HTMLImageElement) => {
    const s = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };
  const draw = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; lastKey = ''; }
    const f = cur * (N - 1), a = Math.min(N - 1, Math.floor(f)), t = f - a;
    const key = `${a}|${Math.round(t * 40)}|${w}|${loaded}`;
    if (key === lastKey) return;
    lastKey = key;
    const A = near(a), B = near(Math.min(N - 1, a + 1));
    if (A) cover(A);
    if (A && B && B !== A && t > .02) { ctx.globalAlpha = t; cover(B); ctx.globalAlpha = 1; }
  };
  const tick = () => {
    raf = 0;
    cur += (target - cur) * .16;
    if (Math.abs(target - cur) < .0004) cur = target;
    draw();
    if (cur !== target && !dead) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(tick); };
  // Loading order: first frame (immediately), then the last frame, then every 8th, then the rest (six at a time).
  const idx = Array.from({ length: N }, (_, i) => i);
  const queue = [0, N - 1, ...idx.filter(i => i % 8 === 0 && i !== 0), ...idx.filter(i => i % 8 !== 0 && i !== N - 1)];
  const worker = async () => { while (queue.length && !dead) await load(queue.shift()!); };
  // Only the first frame is requested right away; the rest follows once the visitor interacts (or after a long idle time).
  load(queue.shift()!);
  afterFirstVisit().then(() => Array.from({ length: 6 }, worker));
  const onResize = () => { lastKey = ''; kick(); };
  addEventListener('resize', onResize);
  return {
    to(p: number) { target = Math.min(1, Math.max(0, p)); kick(); },
    destroy() { dead = true; if (raf) cancelAnimationFrame(raf); removeEventListener('resize', onResize); },
  };
}

// Desktop: the flight is scrubbed by the scroll position while its frame grows to full screen.
function heroScrub() {
  const stage = document.querySelector<HTMLElement>('.hero-stage')!;
  const media = stage.querySelector<HTMLElement>('.hero-media')!;
  const frame = stage.querySelector<HTMLElement>('.hero-frame')!;
  const seq = frameSequence(stage.querySelector<HTMLCanvasElement>('.hero-canvas')!);
  const lines = heroText();
  const inset = () => {
    const s = stage.getBoundingClientRect(), f = frame.getBoundingClientRect();
    return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px)`;
  };
  const OUT = (i: number) => ({ x: EDGE(i, true), ease: 'power2.in', duration: .6, immediateRender: false });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=260%', pin: true, scrub: SCRUB, anticipatePin: 1, invalidateOnRefresh: true },
  })
    .fromTo(media, { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0)
    .to(['.hero-frame', '.hero-scroll'], { opacity: 0, duration: .2 }, 0)
    // Lines 1 and 2 keep going the way they came in: line 1 leaves to the right, line 2 to the left.
    .fromTo(lines[0], CHAR_IN, OUT(0), .04)
    .fromTo(lines[1], CHAR_IN, OUT(1), .1)
    .to('.hero-shade', { opacity: 1, duration: .5 }, .45)
    // "Werte schaffen." rises to sit above the box, which is then uncovered from below; its text follows line by line.
    .to('.ht-3', { y: () => -(document.querySelector<HTMLElement>('.hero-box')!.offsetHeight + 34), ease: 'power2.inOut', duration: .4 }, .5)
    .fromTo('.hero-box', { autoAlpha: 0, clipPath: 'inset(100% -60px -60px -60px)' }, { autoAlpha: 1, clipPath: 'inset(0% -60px -60px -60px)', ease: 'power3.inOut', duration: .36 }, .64)
    .fromTo('.hero-box p, .hero-box-cta', { y: 30, clipPath: 'inset(0 0 100% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', ease: 'power2.out', duration: .3, stagger: .07 }, .74)
    .to({}, { duration: .3 });
  // The flight ends a little before the pin ends, so the last frames hold while the box is read.
  tl.eventCallback('onUpdate', () => seq.to(tl.progress() / .9));
  return () => seq.destroy();
}
function heroLoop() {
  const video = document.querySelector<HTMLVideoElement>('.hero-video')!;
  video.loop = true;
  afterFirstVisit().then(() => { video.src = video.dataset.loop!; video.play().catch(() => {}); });
  // Headline lines keep going the way they came in and leave through the opposite screen edge, the box wipes upwards.
  heroText().forEach((line, i) => gsap.fromTo(line, CHAR_IN, { x: EDGE(i, true), ease: 'power2.in', immediateRender: false,
    scrollTrigger: { trigger: '.hero', start: `${4 + i * 4}% top`, end: '50% top', scrub: true } }));
  gsap.fromTo('.hero-box', { clipPath: 'inset(0% -60px -60px -60px)' }, { clipPath: 'inset(0% -60px 100% -60px)', ease: 'power2.in', immediateRender: false,
    scrollTrigger: { trigger: '.hero', start: '15% top', end: '70% top', scrub: true } });
}

// ---------- SHARED ENTRANCES ------------------------------------------------------------------
function entrances(splits: SplitText[]) {
  all('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: once(el, 'top 90%') }));
  all('[data-rise]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: EASE, scrollTrigger: once(el, 'top 88%') }));
  all('[data-lines]').forEach(el => splits.push(SplitText.create(el, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: self => { gsap.set(el, { visibility: 'visible' }); return gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: .09, ease: EASE, scrollTrigger: once(el, 'top 88%') }); },
  })));
  all('[data-clip]').forEach(el => {
    const media = el.querySelector('img, video');
    const tl = gsap.timeline({ scrollTrigger: once(el, 'top 86%') }).to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE });
    if (media) tl.fromTo(media, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: EASE, clearProps: 'transform' }, 0);
  });
  // Statement: every word brightens gently with the scroll position.
  const statement = document.querySelector<HTMLElement>('[data-words]');
  if (statement) {
    const split = SplitText.create(statement, { type: 'words', wordsClass: 'w' });
    splits.push(split);
    gsap.to(split.words, { opacity: 1, stagger: .12, duration: .6, ease: 'sine.inOut', scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: SCRUB } });
  }
  gsap.to('.stat', { '--rule': 1, duration: 1.2, stagger: .08, ease: EASE, scrollTrigger: once('.stats', 'top 90%') });
  all('[data-roll]').forEach(rollNumber);
}

// Digits roll in one by one with a short motion blur ("Animated Blur Number").
function rollNumber(el: HTMLElement) {
  const value = el.dataset.roll!;
  el.setAttribute('aria-hidden', 'true');
  el.parentElement?.setAttribute('aria-label', el.parentElement.textContent!.replace(/\s+/g, ''));
  el.innerHTML = '';
  const roll = document.createElement('span');
  roll.className = 'roll';
  const cols = [...value].map(d => {
    const col = document.createElement('span');
    col.className = 'roll-col';
    col.innerHTML = '0123456789'.split('').map(n => `<span>${n}</span>`).join('');
    roll.append(col);
    return { col, digit: Number(d) };
  });
  el.append(roll);
  const tl = gsap.timeline({ scrollTrigger: once(el, 'top 92%') });
  cols.forEach(({ col, digit }, i) => {
    tl.fromTo(col, { yPercent: 0 }, { yPercent: -digit * 10, duration: 1.5 + i * .12, ease: EASE }, i * .08)
      .fromTo(col, { filter: 'blur(0px)' }, { filter: 'blur(3px)', duration: .3, ease: 'sine.in' }, i * .08)
      .to(col, { filter: 'blur(0px)', duration: .9, ease: 'sine.out' }, i * .08 + .3);
  });
}

// ---------- TICKER (Scroll Velocity) ----------------------------------------------------------
// Two bands drift at a calm base speed; scrolling only leans on them a little and the speed eases back on its own.
function ticker() {
  const loops = all('.ticker-row').map(row => {
    const track = row.querySelector<HTMLElement>('.ticker-track')!;
    const dir = Number(row.dataset.direction);
    return dir > 0
      ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, ease: 'none', duration: 60, repeat: -1 })
      : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 54, repeat: -1 });
  });
  let heading = 1, lean = 0, push = 0, pushDir = 1;
  const tick = () => {
    push *= .95;
    lean += (push - lean) * .05;
    heading += (pushDir - heading) * .05;
    loops.forEach(l => l.timeScale(heading * (1 + lean)));
  };
  gsap.ticker.add(tick);
  const st = ScrollTrigger.create({
    trigger: '.ticker', start: 'top bottom', end: 'bottom top',
    onToggle: self => loops.forEach(l => (self.isActive ? l.resume() : l.pause())),
    onUpdate(self) {
      const v = self.getVelocity();
      if (Math.abs(v) < 30) return;
      pushDir = v < 0 ? -1 : 1;
      push = Math.max(push, Math.min(Math.abs(v) / 1400, 1.2));
    },
  });
  return () => { gsap.ticker.remove(tick); st.kill(); loops.forEach(l => l.kill()); };
}

// ---------- SERVICES --------------------------------------------------------------------------
// Desktop: a preview follows the cursor; images wipe in by direction (21st.dev hover image reveal).
function serviceFollow() {
  const list = document.querySelector<HTMLElement>('.service-list')!;
  const follow = document.querySelector<HTMLElement>('.service-follow')!;
  const images = all('img', follow);
  gsap.set(follow, { xPercent: -50, yPercent: -50, scale: .94, opacity: 0 });
  const xTo = gsap.quickTo(follow, 'x', { duration: .8, ease: 'power3' });
  const yTo = gsap.quickTo(follow, 'y', { duration: .8, ease: 'power3' });
  let current = -1;
  const show = (i: number) => {
    if (i === current) return;
    const down = i > current;
    images.forEach((img, k) => { img.style.zIndex = k === i ? '2' : '1'; });
    gsap.fromTo(images[i], { clipPath: down ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', scale: 1.08 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: .9, ease: EASE, overwrite: true });
    current = i;
  };
  const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
  const enter = (e: PointerEvent) => { gsap.set(follow, { x: e.clientX, y: e.clientY }); gsap.to(follow, { opacity: 1, scale: 1, duration: .6, ease: EASE }); };
  const leave = () => { gsap.to(follow, { opacity: 0, scale: .96, duration: .5, ease: EASE }); current = -1; };
  const rows = all('.service', list).map((row, i) => { const h = () => show(i); row.addEventListener('pointerenter', h); return [row, h] as const; });
  list.addEventListener('pointermove', move); list.addEventListener('pointerenter', enter); list.addEventListener('pointerleave', leave);
  return () => { rows.forEach(([r, h]) => r.removeEventListener('pointerenter', h)); list.removeEventListener('pointermove', move); list.removeEventListener('pointerenter', enter); list.removeEventListener('pointerleave', leave); };
}
function serviceRows() {
  ScrollTrigger.batch('.service', { start: 'top 90%', once: true, onEnter: b => gsap.from(b.map(r => [...r.querySelectorAll('.service-row > *:not(.service-media)')]).flat(), { y: 20, opacity: 0, duration: 1, stagger: .07, ease: EASE }) });
}
// Phone: the services are plain cards in native scrolling (no sticky stacking, no scroll hijacking, no scroll-linked
// transforms); each card only rises in once when it arrives.
function serviceCards() {
  ScrollTrigger.batch('.service', { start: 'top 92%', once: true, onEnter: b => gsap.from(b, { y: 28, opacity: 0, duration: 1, stagger: .1, ease: EASE, clearProps: 'transform,opacity' }) });
}

// ---------- IMPRESSIONS (Zoom Parallax) --------------------------------------------------------
function zoomParallax() {
  const scales = [4, 5, 6, 5, 6, 8, 9];
  const layers = all('.zoom-layer');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.zoom', start: 'top top', end: '+=200%', pin: true, scrub: SCRUB, anticipatePin: 1 } });
  layers.forEach((layer, i) => tl.fromTo(layer, { scale: 1 }, { scale: scales[i] ?? 5, ease: 'power1.in', duration: 1 }, 0));
  tl.to('.zoom-center .media-badge', { opacity: 0, duration: .1 }, 0);
  gsap.from(layers.map(l => l.querySelector('.zoom-item')), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, stagger: .07, ease: EASE, scrollTrigger: once('.zoom', 'top 75%') });
}
function stripReveal() {
  gsap.from(all('.zoom-item'), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, stagger: .08, ease: EASE, scrollTrigger: once('.zoom', 'top 85%') });
}

// ---------- TEAM (Scroll Portrait Wall) --------------------------------------------------------
function portraitWall() {
}

// ---------- FOOTER (Motion Footer) -------------------------------------------------------------
function footer() {
  gsap.fromTo('.footer-inner', { yPercent: -6 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 20%', scrub: SCRUB } });
  gsap.fromTo('.footer-mark span', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer-mark', start: 'top bottom', end: 'bottom bottom', scrub: SCRUB } });
  gsap.from(all('.footer-cols > div, .footer-bottom > *'), { y: 20, opacity: 0, duration: 1, stagger: .07, ease: EASE, scrollTrigger: once('.footer-cols', 'top 90%') });
}

// Desktop: buttons lean very slightly (max 6 px) towards the cursor and settle back smoothly.
function magnetic() {
  const clamp = gsap.utils.clamp(-6, 6);
  const off = all('[data-magnetic]').map(el => {
    const x = gsap.quickTo(el, 'x', { duration: .7, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: .7, ease: 'power3' });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x(clamp((e.clientX - r.left - r.width / 2) * .06)); y(clamp((e.clientY - r.top - r.height / 2) * .1)); };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: .9, ease: EASE });
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { clearProps: 'transform' }); };
  });
  return () => off.forEach(fn => fn());
}

export function initMotion(reduced: boolean) {
  if (reduced) {
    const v = document.querySelector<HTMLVideoElement>('.hero-video');
    if (v) afterFirstVisit().then(() => { v.src = v.dataset.loop!; });
    return;
  }
  const mm = gsap.matchMedia();
  // Pins first, top to bottom, so later triggers measure positions including the spacers.
  mm.add(DESKTOP, heroScrub);
  mm.add(`not all and ${DESKTOP}`, heroLoop);
  mm.add('(min-width: 1024px)', zoomParallax);
  mm.add('(max-width: 1023px)', stripReveal);
  mm.add('(max-width: 899px)', serviceCards);
  mm.add('(min-width: 900px)', serviceRows);
  mm.add('all', () => {
    const splits: SplitText[] = [];
    heroIntro(); entrances(splits); portraitWall(); footer();
    const stopTicker = ticker();
    return () => { stopTicker(); splits.forEach(s => s.revert()); };
  });
  mm.add('(hover: hover) and (pointer: fine) and (min-width: 900px)', serviceFollow);
  mm.add('(hover: hover) and (pointer: fine)', magnetic);
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

}
