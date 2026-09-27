// Pool-Studio – Prototyp: Start → Schritt 1 (Hersteller) → Schritt 2 (Becken); Schritte 3–7 folgen.
// Animationen mit Motion (motion.dev). Zustand im Browser gespeichert.
import { animate, stagger } from 'motion';

type Man = { id: string; name: string; tech: string; tagline: string; points: string[]; accent: string; logo: string };
type Model = {
  id: string; man: string; name: string; desc: string; l: number; w: number; d: number[]; dims: string;
  stairs: string | null; led: string; excluded: string[]; img: string; thumb: string; fx: number; fy: number;
};
type Data = { manufacturers: Man[]; models: Model[]; base: string };

const data: Data = JSON.parse(document.getElementById('kf-data')!.textContent!);
const img = (f: string) => data.base + f;
const root = document.getElementById('kf')!;
const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => window.matchMedia('(max-width: 900px)').matches;
const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: 'spring', stiffness: 380, damping: 28 } as const;
const fmt = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const STEPS = [
  { title: 'Welcher Hersteller passt zu Ihnen?', intro: 'Wählen Sie zuerst Bauweise und Designsprache. Danach zeigen wir nur passende Becken.' },
  { title: 'Wählen Sie Ihr Becken', intro: 'Alle Modelle und Maße aus den Herstellerkatalogen 2026. Filtern Sie nach Länge.' },
  { title: 'Farbe & LED', intro: '' }, { title: 'Abdeckung', intro: '' }, { title: 'Technik', intro: '' },
  { title: 'Wärme & Licht', intro: '' }, { title: 'Ihr Pool & Kontakt', intro: '' },
];
const SIZES = [
  { id: 'all', label: 'Alle', test: () => true },
  { id: 's', label: 'bis 6 m', test: (m: Model) => m.l < 6 },
  { id: 'm', label: '6–8 m', test: (m: Model) => m.l >= 6 && m.l < 8 },
  { id: 'l', label: '8–10 m', test: (m: Model) => m.l >= 8 && m.l < 10 },
  { id: 'xl', label: 'über 10 m', test: (m: Model) => m.l >= 10 },
];

// ---------- Zustand ----------
type State = { view: 'start' | 'studio'; step: number; man: string | null; model: string | null; size: string; compare: string | null };
const KEY = 'pk-konfig-v1';
let state: State = { view: 'start', step: 1, man: null, model: null, size: 'all', compare: null };
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) state = { ...state, ...s, view: 'start' }; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
const man = () => data.manufacturers.find((m) => m.id === state.man) || null;
const model = () => data.models.find((m) => m.id === state.model) || null;
const modelsOf = (id: string | null) => data.models.filter((m) => m.man === id);
const heroOf = (id: string) => modelsOf(id).find((m) => m.img) || data.models[0];

// ---------- Bühne: Foto-Überblendung ----------
let front = 'a';
let currentPhoto = '';
function setPhoto(file: string, focus?: { x: number; y: number }) {
  if (!file || file === currentPhoto) return;
  currentPhoto = file;
  const next = $<HTMLImageElement>(`[data-layer="${front === 'a' ? 'b' : 'a'}"]`);
  const prev = $<HTMLImageElement>(`[data-layer="${front}"]`);
  front = front === 'a' ? 'b' : 'a';
  next.style.objectPosition = focus ? `${focus.x}% ${focus.y}%` : '50% 50%';
  next.src = img(file);
  const show = () => {
    next.style.zIndex = '2'; prev.style.zIndex = '1';
    if (reduce) { next.style.opacity = '1'; prev.style.opacity = '0'; return; }
    animate(next, { opacity: [0, 1], scale: [1.06, 1] }, { duration: 0.9, ease });
    animate(prev, { opacity: 0 }, { duration: 0.9, delay: 0.15, ease });
  };
  if (next.complete && next.naturalWidth) show(); else next.onload = show;
}

// ---------- Bühne: Info ----------
function stageInfo() {
  const box = $('[data-stage-info]');
  if (state.step === 1) {
    const m = man() || data.manufacturers[0];
    brandInfo(m);
    return;
  }
  const md = model();
  if (state.step === 2 || md) {
    if (!md) { box.innerHTML = ''; return; }
    box.innerHTML = planHtml(md);
    drawPlan(md);
    box.querySelector('[data-compare]')?.addEventListener('click', () => {
      state.compare = state.compare ? null : md.id; save(); stageInfo();
    });
    return;
  }
  box.innerHTML = '';
}
function brandInfo(m: Man) {
  const box = $('[data-stage-info]');
  const n = modelsOf(m.id).length;
  box.innerHTML = `<div class="kf-brand">
      <div class="kf-brand-logo"><img src="${img(m.logo)}" alt="${esc(m.name)}"></div>
      <span class="kf-tag">${esc(m.tech)}</span>
      <h2>${esc(m.tagline)}</h2>
      <ul>${m.points.slice(1, 4).map((p) => `<li>${esc(p)}</li>`).join('')}<li>${n} Becken im Katalog 2026</li></ul>
    </div>`;
  if (!reduce) animate(box.firstElementChild!.children, { opacity: [0, 1], y: [18, 0] }, { delay: stagger(0.06), duration: 0.6, ease });
  const h = heroOf(m.id); setPhoto(h.img, { x: h.fx, y: h.fy });
}

// Maßkarte mit maßstabsgetreuer Draufsicht (SVG), Maßlinien zeichnen sich, Zahlen zählen hoch
function planHtml(md: Model) {
  const cmp = state.compare && state.compare !== md.id ? data.models.find((m) => m.id === state.compare) : null;
  const depth = md.d.length > 1 ? `${fmt(md.d[0])}–${fmt(md.d[1])}` : fmt(md.d[0]);
  return `<div class="kf-plan">
    <div>
      <div class="kf-plan-title"><h2>${esc(md.name)}</h2><span>${esc(man()?.name || '')}</span></div>
      <div class="kf-plan-nums">
        <div><b data-count="${md.l}">0</b><small>Länge m</small></div>
        <div><b data-count="${md.w}">0</b><small>Breite m</small></div>
        <div><b>${depth}</b><small>Tiefe m</small></div>
      </div>
      ${md.stairs || md.desc ? `<p class="kf-plan-desc">${esc([md.stairs, md.desc].filter(Boolean).join(' · '))}</p>` : ''}
      <button type="button" class="kf-compare" data-compare>${state.compare ? (cmp ? '✕ Vergleich beenden' : '✕ Vergleich beenden – jetzt zweites Becken wählen') : '⇆ Mit anderem Becken vergleichen'}</button>
      ${cmp ? `<div class="kf-legend"><span><i style="background:#7cc5d8"></i>${esc(md.name)}</span><span><i style="border:2px dashed var(--pk-teal)"></i>${esc(cmp.name)} · ${fmt(cmp.l)} × ${fmt(cmp.w)} m</span></div>` : ''}
    </div>
    <svg viewBox="0 0 320 170" aria-hidden="true" data-plan></svg>
  </div>`;
}
function drawPlan(md: Model) {
  const svg = $('[data-plan]') as unknown as SVGSVGElement;
  if (!svg) return;
  const cmp = state.compare && state.compare !== md.id ? data.models.find((m) => m.id === state.compare) : null;
  const L = Math.max(md.l, cmp?.l || 0), W = Math.max(md.w, cmp?.w || 0);
  const k = Math.min(270 / L, 120 / W);
  const x0 = 10, y0 = 30;
  const rect = (m: Model, cls: string) => `<rect class="${cls}" x="${x0}" y="${y0}" width="${m.l * k}" height="${m.w * k}" rx="6" />`;
  svg.innerHTML = `
    <defs><linearGradient id="kfw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c6e8f1"/><stop offset="1" stop-color="#6fbad0"/></linearGradient></defs>
    ${rect(md, 'p-main')}
    ${cmp ? rect(cmp, 'p-cmp') : ''}
    <line class="p-dim" x1="${x0}" y1="14" x2="${x0 + md.l * k}" y2="14" />
    <line class="p-tick" x1="${x0}" y1="9" x2="${x0}" y2="19" /><line class="p-tick" x1="${x0 + md.l * k}" y1="9" x2="${x0 + md.l * k}" y2="19" />
    <text class="p-lbl" x="${x0 + (md.l * k) / 2}" y="9" text-anchor="middle">${fmt(md.l)} m</text>
    <line class="p-dim" x1="${x0 + md.l * k + 14}" y1="${y0}" x2="${x0 + md.l * k + 14}" y2="${y0 + md.w * k}" />
    <text class="p-lbl" x="${x0 + md.l * k + 20}" y="${y0 + (md.w * k) / 2 + 4}">${fmt(md.w)} m</text>
    <style>
      .p-main { fill: url(#kfw); stroke: #004A80; stroke-width: 2; }
      .p-cmp { fill: none; stroke: #20AFAD; stroke-width: 2.5; stroke-dasharray: 7 5; }
      .p-dim, .p-tick { stroke: #004A80; stroke-width: 1.4; }
      .p-lbl { font: 500 11px Satoshi, sans-serif; fill: #004A80; }
    </style>`;
  const counts = svg.parentElement!.querySelectorAll<HTMLElement>('[data-count]');
  if (reduce) { counts.forEach((b) => (b.textContent = fmt(+b.dataset.count!))); return; }
  counts.forEach((b) => {
    const to = +b.dataset.count!;
    animate(0, to, { duration: 1, ease, onUpdate: (v) => (b.textContent = fmt(Math.round(v * 100) / 100)) });
  });
  if (!svg.getClientRects().length) return; // Draufsicht ausgeblendet (Handy)
  svg.querySelectorAll<SVGGeometryElement>('rect, line').forEach((el, i) => {
    const len = el.getTotalLength();
    el.style.strokeDasharray = el.classList.contains('p-cmp') ? '7 5' : `${len}`;
    if (!el.classList.contains('p-cmp')) {
      el.style.strokeDashoffset = `${len}`;
      animate(el, { strokeDashoffset: [len, 0] }, { duration: 0.9, delay: 0.1 + i * 0.05, ease });
    }
  });
  animate(svg.querySelectorAll('.p-main'), { fillOpacity: [0, 1] }, { duration: 0.8, delay: 0.5 });
  animate(svg.querySelectorAll('.p-lbl, .p-cmp'), { opacity: [0, 1] }, { duration: 0.5, delay: 0.7 });
}

// ---------- Panel ----------
function head() {
  const s = STEPS[state.step - 1];
  $('[data-head]').innerHTML = `<p class="kf-eyebrow"><span class="dot"></span>Schritt ${state.step} von 7</p><h1>${s.title}</h1>${s.intro ? `<p>${s.intro}</p>` : ''}`;
}
function body() {
  const b = $('[data-body]');
  if (state.step === 1) {
    b.innerHTML = `<div class="kf-opts" role="radiogroup" aria-label="Hersteller">${data.manufacturers.map((m) => `
      <button type="button" class="kf-opt kf-opt-brand" role="radio" aria-checked="${state.man === m.id}" data-man="${m.id}">
        <span class="logo"><img src="${img(m.logo)}" alt=""></span>
        <span>
          <span class="kf-kicker">${esc(m.tech)}</span>
          <h3>${esc(m.name)}</h3>
          <p>${esc(m.tagline)}</p>
          <span class="meta"><span>${modelsOf(m.id).length} Becken</span><span>${esc(m.points[1] || '')}</span></span>
        </span>
        <span class="kf-tick" aria-hidden="true">✓</span>
      </button>`).join('')}</div>`;
    b.querySelectorAll<HTMLElement>('[data-man]').forEach((el) => {
      el.addEventListener('click', () => pickMan(el.dataset.man!, el));
      el.addEventListener('mouseenter', () => { if (!mobile()) brandInfo(data.manufacturers.find((m) => m.id === el.dataset.man)!); });
      el.addEventListener('mouseleave', () => { if (!mobile()) brandInfo(man() || data.manufacturers.find((m) => m.id === el.dataset.man)!); });
    });
  } else if (state.step === 2) {
    const list = modelsOf(state.man);
    b.innerHTML = `<div class="kf-filter" role="group" aria-label="Länge">${SIZES.filter((s) => s.id === 'all' || list.some(s.test)).map((s) => `<button type="button" class="kf-fchip" aria-pressed="${state.size === s.id}" data-size="${s.id}">${s.label}</button>`).join('')}<span class="kf-count" data-count-lbl></span></div>
      <ul class="kf-opts is-models" role="radiogroup" aria-label="Becken">${list.sort((a, c) => a.l - c.l).map((m) => `
        <li data-mid="${m.id}"><button type="button" class="kf-opt kf-opt-model" role="radio" aria-checked="${state.model === m.id}" data-model="${m.id}">
          <span class="thumb"><img src="${img(m.thumb)}" alt="" loading="lazy" style="object-position:${m.fx}% ${m.fy}%"></span>
          <span><h3>${esc(m.name)}</h3><p>${m.dims}</p>${m.stairs ? `<p>${esc(m.stairs)}</p>` : ''}</span>
          <span class="kf-tick" aria-hidden="true">✓</span>
        </button></li>`).join('')}</ul>`;
    applyFilter(false);
    b.querySelectorAll<HTMLElement>('[data-size]').forEach((el) => el.addEventListener('click', () => {
      state.size = el.dataset.size!; save();
      b.querySelectorAll('[data-size]').forEach((x) => x.setAttribute('aria-pressed', String(x === el)));
      applyFilter(true);
    }));
    b.querySelectorAll<HTMLElement>('[data-model]').forEach((el) => {
      el.addEventListener('click', () => pickModel(el.dataset.model!, el));
      el.addEventListener('mouseenter', () => { if (!mobile()) { const m = data.models.find((x) => x.id === el.dataset.model)!; setPhoto(m.img, { x: m.fx, y: m.fy }); } });
      el.addEventListener('mouseleave', () => { if (!mobile()) { const m = model(); if (m) setPhoto(m.img, { x: m.fx, y: m.fy }); } });
    });
  } else {
    b.innerHTML = `<div class="kf-soon"><h3>Dieser Schritt folgt im nächsten Ausbau</h3><p>Im Prototyp sind Start, Hersteller und Becken fertig. Farbe & LED, Abdeckung, Technik, Wärme & Licht und die Zusammenfassung mit PDF per E-Mail kommen als Nächstes.</p></div>`;
  }
}

// Filter mit FLIP: Karten gleiten an ihre neuen Plätze, neue blenden ein
function applyFilter(anim: boolean) {
  const test = SIZES.find((s) => s.id === state.size)?.test || (() => true);
  const items = $$<HTMLLIElement>('[data-mid]');
  const before = new Map(items.map((li) => [li, li.getBoundingClientRect()]));
  let n = 0;
  items.forEach((li) => {
    const m = data.models.find((x) => x.id === li.dataset.mid)!;
    const show = test(m); li.hidden = !show; if (show) n++;
  });
  $('[data-count-lbl]').textContent = `${n} Becken`;
  if (!anim || reduce) return;
  items.filter((li) => !li.hidden).forEach((li, i) => {
    const a = before.get(li)!, b = li.getBoundingClientRect();
    if (a.width === 0) animate(li, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.45, delay: Math.min(i, 8) * 0.03, ease });
    else animate(li, { x: [a.left - b.left, 0], y: [a.top - b.top, 0] }, { ...spring });
  });
}

// ---------- Auswahl ----------
function flyChip(from: HTMLElement, label: string) {
  const target = $('[data-cart]');
  if (reduce) return bumpBadge();
  const a = from.getBoundingClientRect(), t = target.getBoundingClientRect();
  const chip = document.createElement('div');
  chip.className = 'kf-chip kf-fly'; chip.textContent = label;
  document.body.append(chip);
  const c = chip.getBoundingClientRect();
  const sx = a.left + a.width / 2 - c.width / 2, sy = a.top + a.height / 2 - c.height / 2;
  const tx = t.left + t.width / 2 - c.width / 2, ty = t.top + t.height / 2 - c.height / 2;
  chip.style.left = '0px'; chip.style.top = '0px';
  animate(chip, { x: [sx, (sx + tx) / 2, tx], y: [sy, Math.min(sy, ty) - 80, ty], scale: [1, 1.08, 0.4], opacity: [1, 1, 0] }, { duration: 0.85, ease: [0.5, 0, 0.3, 1] })
    .then(() => { chip.remove(); bumpBadge(); });
}
function bumpBadge() {
  const n = (state.man ? 1 : 0) + (state.model ? 1 : 0);
  const badge = $('[data-badge]');
  badge.textContent = String(n);
  if (!reduce) animate(badge, { scale: [1.5, 1] }, { type: 'spring', stiffness: 500, damping: 12 });
  cartList();
}
function markChecked(sel: string, el: HTMLElement) {
  $$(sel).forEach((x) => x.setAttribute('aria-checked', String(x === el)));
  if (!reduce) {
    animate(el, { scale: [0.97, 1] }, { type: 'spring', stiffness: 500, damping: 15 });
    animate(el.querySelector('.kf-tick')!, { scale: [0, 1], rotate: [-40, 0] }, { type: 'spring', stiffness: 500, damping: 14 });
  }
}
function pickMan(id: string, el: HTMLElement) {
  const changed = state.man !== id;
  state.man = id; if (changed) { state.model = null; state.compare = null; state.size = 'all'; }
  save(); markChecked('[data-man]', el);
  brandInfo(man()!);
  if (changed) flyChip(el, man()!.name);
  updateNav(); chips();
}
function pickModel(id: string, el: HTMLElement) {
  const changed = state.model !== id;
  if (state.compare && state.compare !== id) {
    // Vergleich: gewähltes Becken bleibt Hauptbecken, das angeklickte wird zum Vergleich
    state.compare = id; save(); stageInfo(); return;
  }
  state.model = id; save(); markChecked('[data-model]', el);
  const m = model()!; setPhoto(m.img, { x: m.fx, y: m.fy });
  stageInfo();
  if (changed) flyChip(el, m.name);
  updateNav(); chips();
}

// ---------- Navigation ----------
const canNext = () => (state.step === 1 ? !!state.man : state.step === 2 ? !!state.model : state.step < 7);
function updateNav() {
  const next = $('[data-next]');
  next.setAttribute('aria-disabled', String(!canNext()));
  $('[data-hint]').textContent = canNext() ? '' : state.step === 1 ? 'Bitte Hersteller wählen' : 'Bitte Becken wählen';
  $('[data-back]').style.visibility = 'visible';
  $$('[data-pstep]').forEach((li) => {
    const i = +li.dataset.pstep!;
    li.classList.toggle('is-current', i === state.step);
    li.classList.toggle('is-done', i < state.step);
    const btn = li.querySelector('button')!;
    btn.disabled = !(i < state.step || (i === 2 && !!state.man) || i === 1);
  });
  $('[data-mstep]').textContent = String(state.step);
  $$('[data-pfill]').forEach((f) => animate(f, { width: `${(state.step / 7) * 100}%` }, reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }));
}
function chips() {
  const parts = [man()?.name, model()?.name].filter(Boolean) as string[];
  $('[data-chips]').innerHTML = state.step === 1 ? '' : parts.map((p) => `<span class="kf-chip">${esc(p)}</span>`).join('');
}
function cartList() {
  const rows: [string, string][] = [];
  if (man()) rows.push(['Hersteller', man()!.name]);
  if (model()) rows.push(['Becken', `${model()!.name} · ${model()!.dims}`]);
  $('[data-cart-list]').innerHTML = rows.length ? rows.map(([k, v]) => `<li><span>${k}</span><span>${esc(v)}</span></li>`).join('') : '<li class="empty">Noch nichts gewählt.</li>';
}

function renderStep(dir: 1 | -1 = 1) {
  const scroll = $('[data-scroll]');
  const content = [$('[data-head]'), $('[data-body]')];
  const draw = () => {
    head(); body(); stageInfo(); updateNav(); chips(); scroll.scrollTop = 0;
    if (state.step >= 2 && model()) setPhoto(model()!.img, { x: model()!.fx, y: model()!.fy });
    if (!reduce) {
      animate(content[0].children, { opacity: [0, 1], y: [16, 0] }, { delay: stagger(0.06), duration: 0.6, ease });
      const cards = $$('[data-body] .kf-opt, [data-body] .kf-fchip, [data-body] .kf-soon').slice(0, 14);
      animate(cards, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, { delay: stagger(0.045, { startDelay: 0.12 }), type: 'spring', stiffness: 260, damping: 24 });
    }
  };
  if (reduce || !content[0].innerHTML) return draw();
  animate(content, { opacity: 0, x: -24 * dir }, { duration: 0.22, ease: 'easeIn' }).then(() => {
    content.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; });
    draw();
  });
}
function go(step: number) {
  const dir = step > state.step ? 1 : -1;
  state.step = Math.min(7, Math.max(1, step)); save(); renderStep(dir as 1 | -1);
}

// ---------- Start → Studio ----------
function enterStudio() {
  const swap = () => {
    root.dataset.view = 'studio';
    $('[data-start]').hidden = true;
    $('[data-studio]').hidden = false;
    renderStep();
    if (!man()) { const h = heroOf('waterrows'); setPhoto(h.img, { x: h.fx, y: h.fy }); }
  };
  state.view = 'studio';
  const vt = (document as any).startViewTransition;
  if (vt && !reduce) vt.call(document, swap); else swap();
}

// ---------- Ereignisse ----------
$('[data-begin]').addEventListener('click', enterStudio);
$('[data-next]').addEventListener('click', () => { if (canNext()) go(state.step + 1); else if (!reduce) animate($('[data-next]'), { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 }); });
$('[data-back]').addEventListener('click', () => {
  if (state.step === 1) {
    const back = () => { root.dataset.view = 'start'; $('[data-studio]').hidden = true; $('[data-start]').hidden = false; };
    const vt = (document as any).startViewTransition;
    if (vt && !reduce) vt.call(document, back); else back();
  } else go(state.step - 1);
});
$$('[data-goto]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.goto!)));
const pop = $('[data-cart-pop]');
$('[data-cart]').addEventListener('click', (e) => {
  e.stopPropagation(); cartList();
  const open = pop.hidden; pop.hidden = !open; $('[data-cart]').setAttribute('aria-expanded', String(open));
  if (open && !reduce) animate(pop, { opacity: [0, 1], y: [-10, 0], scale: [0.98, 1] }, { duration: 0.3, ease });
});
document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target as Node)) { pop.hidden = true; $('[data-cart]').setAttribute('aria-expanded', 'false'); } });
document.addEventListener('keydown', (e) => {
  if (state.view !== 'studio' || (e.target as HTMLElement).closest('input, textarea')) return;
  if (e.key === 'ArrowRight' && canNext()) go(state.step + 1);
  if (e.key === 'ArrowLeft' && state.step > 1) go(state.step - 1);
});

// Start-Animation
bumpBadge();
if (!reduce) animate($$('[data-rise]'), { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.12, { startDelay: 0.15 }), duration: 0.9, ease });
