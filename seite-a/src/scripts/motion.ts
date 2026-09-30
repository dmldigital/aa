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
}

// Frame sequence on a canvas: the wanted position is eased towards (so scroll steps never show as jumps) and the two
// neighbouring frames are cross-blended for every fractional position. Both sets are AVIF cut from the original footage:
// desktop full HD (`-d` data attributes, 14.5 MB), phones portrait with a pan on the wheel loader (`-m`, 3.5 MB). Browsers
// without AVIF fall back to the older 1280 px WebP frames. Phones load right away; with a mouse the rest of the sequence
// waits for the first interaction.
const AVIF_TEST = 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAEOAAEAAAAAAAAAFwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEAYIDBAAAAB9tZGF0EgAKBzgANhAQ0GkyChgAAABAALASmpg=';
const avifOk = () => new Promise<boolean>(res => { const im = new Image(); im.onload = () => res(im.width === 2); im.onerror = () => res(false); im.src = AVIF_TEST; });
function frameSequence(canvas: HTMLCanvasElement, phone: boolean) {
  const d = canvas.dataset;
  let N = Number(d.frames), base = d.base!, ext = 'webp';
  const ctx = canvas.getContext('2d')!;
  let imgs: (HTMLImageElement | undefined)[] = [];
  let target = 0, cur = 0, raf = 0, dead = false, lastKey = '', loaded = 0;
  const load = (i: number) => new Promise<void>(res => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { imgs[i] = im; loaded++; if (!dead) kick(); res(); };
    im.onerror = () => res();
    im.src = `${base}f${String(i).padStart(3, '0')}.${ext}`;
  });
  const near = (i: number) => { for (let d = 0; d < N; d++) { if (imgs[i - d]) return imgs[i - d]; if (imgs[i + d]) return imgs[i + d]; } return undefined; };
  const cover = (im: HTMLImageElement) => {
    const s = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(im, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };
  const draw = () => {
    // Phones draw at up to 2x so the portrait frames stay crisp on high-density screens.
    const dpr = Math.min(devicePixelRatio || 1, phone ? 2 : 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h || !imgs.length) return;
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
  // Phones load the whole flight straight away (it is the first thing they scroll); with a mouse only the first frame comes
  // right away and the rest once the visitor interacts (or after a long idle time).
  avifOk().then(ok => {
    if (ok && phone) { N = Number(d.framesM); base = d.baseM!; ext = 'avif'; }
    else if (ok) { N = Number(d.framesD); base = d.baseD!; ext = 'avif'; }
    imgs = new Array(N);
    const idx = Array.from({ length: N }, (_, i) => i);
    const queue = [0, N - 1, ...idx.filter(i => i % 8 === 0 && i !== 0), ...idx.filter(i => i % 8 !== 0 && i !== N - 1)];
    const worker = async () => { while (queue.length && !dead) await load(queue.shift()!); };
    load(queue.shift()!);
    (phone ? Promise.resolve() : afterFirstVisit()).then(() => Array.from({ length: 6 }, worker));
  });
  const onResize = () => { lastKey = ''; kick(); };
  addEventListener('resize', onResize);
  return {
    to(p: number) { target = Math.min(1, Math.max(0, p)); kick(); },
    destroy() { dead = true; if (raf) cancelAnimationFrame(raf); removeEventListener('resize', onResize); },
  };
}

// Desktop: the hero is pinned and its framed drone flight grows to full screen while scrolling. Phones and tablets (up to
// 1023 px) show the flight full screen from the start, from portrait frames cut from the original footage with a camera pan
// that follows the orange wheel loader (public/media/hero-m). Everywhere the flight is scrubbed by the scroll position.
function heroScrub() {
  const stage = document.querySelector<HTMLElement>('.hero-stage')!;
  const media = stage.querySelector<HTMLElement>('.hero-media')!;
  const frame = stage.querySelector<HTMLElement>('.hero-frame')!;
  const mouse = matchMedia(DESKTOP).matches;
  const phone = matchMedia('(max-width: 1023px)').matches;
  const seq = frameSequence(stage.querySelector<HTMLCanvasElement>('.hero-canvas')!, phone);
  const lines = heroText();
  const inset = () => {
    const s = stage.getBoundingClientRect(), f = frame.getBoundingClientRect();
    return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px)`;
  };
  const OUT = (i: number) => ({ x: EDGE(i, true), ease: 'power2.in', duration: .6, immediateRender: false });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: mouse ? '+=260%' : '+=210%', pin: true, scrub: SCRUB, anticipatePin: 1, invalidateOnRefresh: true },
  })
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
  if (!phone) tl.fromTo(media, { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0);
  // The flight ends a little before the pin ends, so the last frames hold while the box is read.
  tl.eventCallback('onUpdate', () => seq.to(tl.progress() / .9));
  return () => seq.destroy();
}

// ---------- SHARED ENTRANCES ------------------------------------------------------------------
function entrances(splits: SplitText[]) {
  all('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: once(el, 'top 90%') }));
  all('[data-rise]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: EASE, scrollTrigger: once(el, 'top 88%') }));
  all('[data-lines]').forEach(el => splits.push(SplitText.create(el, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: self => { gsap.set(el, { visibility: 'visible' }); return gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: .09, ease: EASE, scrollTrigger: once(el, 'top 88%') }); },
  })));
  // Images and media blocks: no wipe. They drift in a short way, alternating from the left and from the right, while
  // fading in; the picture inside settles from a slight zoom a little longer.
  all('[data-clip]').forEach((el, i) => slideIn(el, i % 2 ? 1 : -1));
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

// Calm entrance for images: fade plus a short horizontal drift (half the distance on phones), the media inside eases
// out of a 6 % zoom. `side` -1 comes from the left, 1 from the right.
function slideIn(el: HTMLElement, side: number, delay = 0) {
  const media = el.matches('img, video') ? null : el.querySelector('img, video');
  const dist = matchMedia('(max-width: 899px)').matches ? 24 : 48;
  const tl = gsap.timeline({ delay, scrollTrigger: once(el, 'top 88%') })
    .fromTo(el, { opacity: 0, x: side * dist }, { opacity: 1, x: 0, duration: 1.6, ease: EASE, clearProps: 'transform' });
  if (media) tl.fromTo(media, { scale: 1.06 }, { scale: 1, duration: 2.2, ease: 'power2.out', clearProps: 'transform' }, 0);
  return tl;
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
// Desktop: a preview follows the cursor; the images cross-fade out of a slight zoom.
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
    images.forEach((img, k) => { img.style.zIndex = k === i ? '2' : '1'; });
    gsap.fromTo(images[i], { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: .9, ease: EASE, overwrite: true });
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
  ScrollTrigger.batch('.service', { start: 'top 90%', once: true, onEnter: b => gsap.from(b.map(r => [...r.querySelectorAll('.service-row > *')]).flat(), { y: 20, opacity: 0, duration: 1, stagger: .07, ease: EASE }) });
}
// Phone (21st.dev "Services Stack" / "Stacking Cards"): the section holds with its heading, and each card slides up over the one
// before. The covered card shrinks a little from its top edge and darkens; its shadow fades out, so only the card on the move
// casts one and shadows never add up under the stack. All cards share one box, so they land exactly on top of each other.
function serviceStack() {
  const section = document.querySelector<HTMLElement>('.services')!;
  const inner = section.querySelector<HTMLElement>('.services-inner')!;
  const list = section.querySelector<HTMLElement>('.service-list')!;
  const cards = all('.service', list);
  const fit = () => {
    section.classList.remove('is-stacked');
    list.style.setProperty('--card-h', `${Math.max(...cards.map(c => c.offsetHeight))}px`);
    section.classList.add('is-stacked');
  };
  fit();
  const SHADOW = 'inset 0 0 0 1px rgba(244, 242, 238, .12), 0 -22px 44px -18px rgba(0, 0, 0, .6)';
  const NONE = 'inset 0 0 0 1px rgba(244, 242, 238, .12), 0 -22px 44px -18px rgba(0, 0, 0, 0)';
  const tl = gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: {
      trigger: inner, start: 'top top', end: () => `+=${(cards.length - 1) * innerHeight * .75}`,
      pin: true, scrub: SCRUB, anticipatePin: 1, invalidateOnRefresh: true, onRefreshInit: fit,
    },
  });
  cards.forEach((card, i) => {
    if (!i) return;
    const prev = cards[i - 1];
    tl.fromTo(card, { y: () => innerHeight - list.getBoundingClientRect().top + inner.getBoundingClientRect().top }, { y: 0, ease: 'power1.out' }, i - 1)
      .fromTo(prev, { scale: 1, boxShadow: SHADOW }, { scale: .92, boxShadow: NONE }, i - 1)
      .fromTo(prev.querySelector('.service-dim'), { opacity: 0 }, { opacity: .55 }, i - 1);
  });
  tl.to({}, { duration: .25 });
  return () => { section.classList.remove('is-stacked'); list.style.removeProperty('--card-h'); gsap.set(cards, { clearProps: 'transform,boxShadow' }); };
}

// ---------- IMPRESSIONS (Zoom Parallax) --------------------------------------------------------
function zoomParallax() {
  const scales = [4, 5, 6, 5, 6, 8, 9];
  const layers = all('.zoom-layer');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.zoom', start: 'top top', end: '+=200%', pin: true, scrub: SCRUB, anticipatePin: 1 } });
  layers.forEach((layer, i) => tl.fromTo(layer, { scale: 1 }, { scale: scales[i] ?? 5, ease: 'power1.in', duration: 1 }, 0));
  tl.to('.zoom-center .media-badge', { opacity: 0, duration: .1 }, 0);
  // Entrance: each picture fades in, drifting in from the side it sits on.
  const mid = innerWidth / 2;
  gsap.timeline({ scrollTrigger: once('.zoom', 'top 75%') }).fromTo(layers.map(l => l.querySelector('.zoom-item')), {
    opacity: 0, x: (_: number, el: HTMLElement) => { const r = el.getBoundingClientRect(); return Math.sign(r.left + r.width / 2 - mid) * 48; },
  }, { opacity: 1, x: 0, duration: 1.6, stagger: .08, ease: EASE });
}
function stripReveal() {
  gsap.fromTo(all('.zoom-item'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 1.6, stagger: .1, ease: EASE, clearProps: 'transform', scrollTrigger: once('.zoom', 'top 85%') });
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
  mm.add('all', heroScrub);
  mm.add('(max-width: 899px)', serviceStack);
  mm.add('(min-width: 1024px)', zoomParallax);
  mm.add('(max-width: 1023px)', stripReveal);
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
