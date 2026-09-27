// Pool-Studio – Konfigurator (7 Schritte + Versand). Animationen mit Motion (motion.dev).
// Regeln/Zusammenfassung: summary.ts (auch in der Cloudflare-Funktion genutzt), PDF: pdf.ts.
import { animate, stagger } from 'motion';
import {
  type Katalog, type Man, type Model, type Equip, type Config, type Contact,
  colorsFor, equipFor, blockedFor, summarize, validContact, ledSelected, LED_LABELS,
} from './summary';

type Data = Katalog & { base: string; pdfBase: string; logo: string; api: string; privacy: string };
const data: Data = JSON.parse(document.getElementById('kf-data')!.textContent!);
const img = (f: string | null) => (f ? data.base + f : '');
const root = document.getElementById('kf')!;
const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => window.matchMedia('(max-width: 900px)').matches;
const premium = [0.16, 1, 0.3, 1] as const;
const smooth = [0.65, 0, 0.35, 1] as const;
const fmt = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
const esc = (s: string) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const STEPS = [
  { title: 'Welcher Hersteller passt zu Ihnen?', intro: 'Wählen Sie zuerst Bauweise und Designsprache. Danach zeigen wir nur passende Becken.' },
  { title: 'Wählen Sie Ihr Becken', intro: 'Alle Modelle und Maße aus den Herstellerkatalogen 2026. Filtern Sie nach Länge.' },
  { title: 'Farbe & LED', intro: 'Wählen Sie die Oberfläche, die zu Garten und Architektur passt – und auf Wunsch eine Lichtlinie am Beckenrand.' },
  { title: 'Wie soll Ihr Pool abgedeckt werden?', intro: 'Eine Abdeckung erhöht Komfort, Sicherheit und Energieeffizienz.' },
  { title: 'Wo sitzt die Technik?', intro: 'Kompakte Technikbox neben dem Pool oder flexible Technikwand für Gartenhaus und Garage – dazu die Rückspülung.' },
  { title: 'Wärme & Licht', intro: 'Verlängern Sie die Badesaison mit einer Wärmepumpe und setzen Sie Ihren Pool abends in Szene.' },
  { title: 'Ihr Pool ist geplant', intro: 'Wir schicken Ihnen die Konfiguration als PDF per E-Mail. Auf Wunsch melden wir uns zur kostenlosen Beratung.' },
];
const SIZES = [
  { id: 'all', label: 'Alle', test: () => true },
  { id: 's', label: 'bis 6 m', test: (m: Model) => m.l < 6 },
  { id: 'm', label: '6–8 m', test: (m: Model) => m.l >= 6 && m.l < 8 },
  { id: 'l', label: '8–10 m', test: (m: Model) => m.l >= 8 && m.l < 10 },
  { id: 'xl', label: 'über 10 m', test: (m: Model) => m.l >= 10 },
];
// Badesaison je Wärmepumpe (Monate 0–11)
const SEASON: Record<string, [number, number]> = { none: [5, 7], standard: [4, 8], premium: [3, 9] };
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

// ---------- Zustand ----------
type State = Config & { view: 'start' | 'studio' | 'done'; step: number; size: string; compare: string | null; night: boolean };
const KEY = 'pk-konfig-v2';
const empty: Config = { man: null, model: null, color: null, led: null, cover: null, tech: null, iwash: null, heat: null, light: null };
let state: State = { ...empty, view: 'start', step: 1, size: 'all', compare: null, night: false };
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) state = { ...state, ...s, view: 'start' }; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
// Kontaktdaten bewusst nicht speichern (gemeinsam genutzte Geräte)
const contact: Contact = { name: '', email: '', phone: '', street: '', zip: '', city: '', slot: '', wishes: '', consult: true, privacy: false, website: '' };
let errors: Record<string, string> = {};
let doneRef = ''; let testMode = false;

const byId = <T extends { id: string }>(l: T[], id: string | null) => l.find((x) => x.id === id) || null;
const man = () => byId(data.manufacturers, state.man);
const model = () => byId(data.models, state.model);
const eq = (id: string | null) => byId(data.equipment, id);
const modelsOf = (id: string | null) => data.models.filter((m) => m.man === id);
const heroOf = (id: string) => modelsOf(id).find((m) => m.img) || data.models[0];
const ledCap = () => model()?.led || 'none';

// ---------- Bühne: Foto-Übergang ----------
// Neues Bild wird mit weichem, schrägem Verlauf freigelegt und zoomt langsam aus; das alte wird unscharf.
let front = 'a'; let currentPhoto = ''; let photoAnims: { stop: () => void }[] = []; let hoverTimer = 0;
function setPhoto(file: string | null, focus?: { x: number; y: number }, delay = 0) {
  if (!file || file === currentPhoto) return;
  window.clearTimeout(hoverTimer);
  if (delay) { hoverTimer = window.setTimeout(() => setPhoto(file, focus), delay); return; }
  currentPhoto = file;
  const next = $<HTMLImageElement>(`[data-layer="${front === 'a' ? 'b' : 'a'}"]`);
  const prev = $<HTMLImageElement>(`[data-layer="${front}"]`);
  front = front === 'a' ? 'b' : 'a';
  next.style.objectPosition = focus ? `${focus.x}% ${focus.y}%` : '50% 50%';
  const show = () => {
    photoAnims.forEach((a) => a.stop()); photoAnims = [];
    next.style.zIndex = '2'; prev.style.zIndex = '1';
    if (reduce) { next.style.opacity = '1'; prev.style.opacity = '0'; return; }
    next.style.opacity = '1'; next.style.filter = 'none';
    const mask = (p: number) => {
      const a = -35 + p * 150; const m = `linear-gradient(105deg, #000 ${a}%, transparent ${a + 35}%)`;
      next.style.maskImage = m; (next.style as any).webkitMaskImage = m;
    };
    mask(0);
    photoAnims.push(
      animate(0, 1, { duration: 1.25, ease: smooth, onUpdate: mask, onComplete: () => { next.style.maskImage = ''; (next.style as any).webkitMaskImage = ''; prev.style.opacity = '0'; } }),
      animate(next, { scale: [1.12, 1] }, { duration: 2.2, ease: premium }),
      animate(prev, { scale: [Number(prev.style.scale) || 1, 1.05], filter: ['blur(0px)', 'blur(6px)'] }, { duration: 1.25, ease: smooth }),
    );
  };
  next.onload = null; next.src = img(file);
  if (next.complete && next.naturalWidth) show(); else next.onload = show;
}
const modelPhoto = (delay = 0) => { const m = model(); if (m) setPhoto(m.img, { x: m.fx, y: m.fy }, delay); };

// Text/Karte auf der Bühne: alt unscharf nach oben weg, neu Zeile für Zeile weich herein
let infoToken = 0; let infoKey = '';
function swapInfo(key: string, html: string, after?: () => void) {
  if (key === infoKey && key) { after?.(); return; }
  infoKey = key;
  const box = $('[data-stage-info]');
  const token = ++infoToken;
  const put = () => {
    if (token !== infoToken) return;
    box.innerHTML = html; after?.();
    if (reduce) return;
    const parts = box.querySelectorAll(':scope > * > *, :scope > .kf-card');
    animate(parts, { opacity: [0, 1], y: [26, 0], filter: ['blur(10px)', 'blur(0px)'] }, { delay: stagger(0.07, { startDelay: 0.1 }), duration: 1.1, ease: premium });
  };
  if (reduce || !box.firstElementChild) return put();
  animate(box.querySelectorAll(':scope > * > *, :scope > .kf-card'), { opacity: 0, y: -10, filter: 'blur(8px)' }, { duration: 0.35, ease: [0.4, 0, 1, 1] }).then(put);
}

// ---------- Bühne je Schritt ----------
function stage(preview?: { brand?: Man; color?: string; equip?: Equip | null }) {
  const st = $('[data-stage]');
  const s = state.step;
  st.classList.toggle('is-dim', state.view === 'studio' && (s === 4 || s === 5 || (s === 6 && !state.night)));
  // Nachtmodus: LED (Schritt 3) bzw. Licht (Schritt 6)
  const led = ledSelected(state);
  const rgb = /rgb/i.test(eq(state.light)?.name || '');
  const nightStep = state.view === 'studio' && ((s === 3 && led) || (s === 6 && (led || !!state.light)));
  st.classList.toggle('is-night', nightStep && state.night);
  st.classList.toggle('has-led', led); st.classList.toggle('has-rgb', !led && rgb);
  const dn = $('[data-daynight]'); dn.hidden = !nightStep; dn.textContent = state.night ? '☀ Tag' : '☾ Nacht';

  if (state.view === 'done') return summaryCard();
  if (s === 1) { const m = preview?.brand || man() || data.manufacturers[0]; return brandInfo(m); }
  if (s === 2) { const md = model(); if (!md) { swapInfo('', ''); return; } modelPhoto(); return plan(md); }
  modelPhoto();
  if (s === 3) return colorCard(preview?.color || state.color);
  if (s === 4) return productCard('cover', preview?.equip ?? eq(state.cover));
  if (s === 5) return productCard('technology', preview?.equip ?? eq(state.tech));
  if (s === 6) return productCard('heatpump', preview?.equip ?? eq(state.heat));
  if (s === 7) return summaryCard();
}

function brandInfo(m: Man) {
  const n = modelsOf(m.id).length;
  swapInfo('brand-' + m.id, `<div class="kf-brand">
      <div class="kf-brand-logo"><img src="${img(m.logo)}" alt="${esc(m.name)}"></div>
      <span class="kf-tag">${esc(m.tech)}</span>
      <h2>${esc(m.tagline)}</h2>
      <ul>${m.points.slice(1, 4).map((p) => `<li>${esc(p)}</li>`).join('')}<li>${n} Becken im Katalog 2026</li></ul>
    </div>`);
  const h = heroOf(m.id); setPhoto(h.img, { x: h.fx, y: h.fy });
}

// Maßkarte mit maßstabsgetreuer Draufsicht (SVG): Maßlinien zeichnen sich, Zahlen zählen hoch
function plan(md: Model) {
  const cmp = state.compare && state.compare !== md.id ? byId(data.models, state.compare) : null;
  const depth = md.d.length > 1 ? `${fmt(md.d[0])}–${fmt(md.d[1])}` : fmt(md.d[0]);
  swapInfo(`plan-${md.id}-${state.compare || ''}`, `<div class="kf-card kf-plan">
    <div>
      <div class="kf-plan-title"><h2>${esc(md.name)}</h2><span>${esc(man()?.name || '')}</span></div>
      <div class="kf-plan-nums">
        <div><b data-count="${md.l}">0</b><small>Länge m</small></div>
        <div><b data-count="${md.w}">0</b><small>Breite m</small></div>
        <div><b>${depth}</b><small>Tiefe m</small></div>
      </div>
      ${md.stairs || md.desc ? `<p class="kf-plan-desc">${esc([md.stairs, md.desc].filter(Boolean).join(' · '))}</p>` : ''}
      <button type="button" class="kf-link" data-compare>${state.compare ? (cmp ? '✕ Vergleich beenden' : '✕ Vergleich beenden – jetzt zweites Becken wählen') : '⇆ Mit anderem Becken vergleichen'}</button>
      ${cmp ? `<div class="kf-legend"><span><i style="background:#7cc5d8"></i>${esc(md.name)}</span><span><i style="border:2px dashed var(--pk-teal)"></i>${esc(cmp.name)} · ${fmt(cmp.l)} × ${fmt(cmp.w)} m</span></div>` : ''}
    </div>
    <svg viewBox="0 0 320 170" aria-hidden="true" data-plan></svg>
  </div>`, () => {
    drawPlan(md, cmp);
    $('[data-stage-info]').querySelector('[data-compare]')?.addEventListener('click', () => { state.compare = state.compare ? null : md.id; save(); stage(); });
  });
}
function drawPlan(md: Model, cmp: Model | null) {
  const svg = $('[data-plan]') as unknown as SVGSVGElement;
  if (!svg) return;
  const L = Math.max(md.l, cmp?.l || 0), W = Math.max(md.w, cmp?.w || 0);
  const k = Math.min(270 / L, 120 / W); const x0 = 10, y0 = 30;
  const rect = (m: Model, cls: string) => `<rect class="${cls}" x="${x0}" y="${y0}" width="${m.l * k}" height="${m.w * k}" rx="6" />`;
  svg.innerHTML = `<defs><linearGradient id="kfw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c6e8f1"/><stop offset="1" stop-color="#6fbad0"/></linearGradient></defs>
    ${rect(md, 'p-main')}${cmp ? rect(cmp, 'p-cmp') : ''}
    <line class="p-dim" x1="${x0}" y1="14" x2="${x0 + md.l * k}" y2="14" />
    <line class="p-tick" x1="${x0}" y1="9" x2="${x0}" y2="19" /><line class="p-tick" x1="${x0 + md.l * k}" y1="9" x2="${x0 + md.l * k}" y2="19" />
    <text class="p-lbl" x="${x0 + (md.l * k) / 2}" y="9" text-anchor="middle">${fmt(md.l)} m</text>
    <line class="p-dim" x1="${x0 + md.l * k + 14}" y1="${y0}" x2="${x0 + md.l * k + 14}" y2="${y0 + md.w * k}" />
    <text class="p-lbl" x="${x0 + md.l * k + 20}" y="${y0 + (md.w * k) / 2 + 4}">${fmt(md.w)} m</text>
    <style>.p-main{fill:url(#kfw);stroke:#004A80;stroke-width:2}.p-cmp{fill:none;stroke:#20AFAD;stroke-width:2.5;stroke-dasharray:7 5}.p-dim,.p-tick{stroke:#004A80;stroke-width:1.4}.p-lbl{font:500 11px Satoshi,sans-serif;fill:#004A80}</style>`;
  const counts = svg.parentElement!.querySelectorAll<HTMLElement>('[data-count]');
  if (reduce) { counts.forEach((b) => (b.textContent = fmt(+b.dataset.count!))); return; }
  counts.forEach((b) => animate(0, +b.dataset.count!, { duration: 1.2, ease: premium, onUpdate: (v) => (b.textContent = fmt(Math.round(v * 100) / 100)) }));
  if (!svg.getClientRects().length) return; // Draufsicht ausgeblendet (Handy)
  svg.querySelectorAll<SVGGeometryElement>('rect.p-main, line').forEach((el, i) => {
    const len = el.getTotalLength(); el.style.strokeDasharray = `${len}`; el.style.strokeDashoffset = `${len}`;
    animate(el, { strokeDashoffset: [len, 0] }, { duration: 1.1, delay: 0.1 + i * 0.06, ease: premium });
  });
  animate(svg.querySelectorAll('.p-main'), { fillOpacity: [0, 1] }, { duration: 1, delay: 0.5 });
  animate(svg.querySelectorAll('.p-lbl, .p-cmp'), { opacity: [0, 1] }, { duration: 0.6, delay: 0.7 });
}

function colorCard(id: string | null) {
  const c = byId(data.colors, id);
  const led = ledSelected(state) ? LED_LABELS[state.led!] : '';
  if (!c) { swapInfo('color-none', `<div class="kf-card kf-product"><div class="kf-product-img is-cover"></div><div><span class="kf-kicker">Beckenfarbe</span><h2>Bitte wählen</h2><p>Die Farbe verändert die Wasserwirkung – von strahlendem Türkis bis zu tiefem Blau.</p></div></div>`); return; }
  swapInfo('color-' + c.id + led, `<div class="kf-card kf-product">
    <div class="kf-product-img is-cover"><img src="${img(c.img)}" alt="" style="object-position:${c.fx}% ${c.fy}%"></div>
    <div><span class="kf-kicker">Beckenfarbe</span><h2>${esc(c.name)}</h2><p>${esc(c.desc)}</p>${led ? `<span class="kf-badge-inline">${esc(led)}</span>` : ''}</div>
  </div>`);
}
function productCard(cat: Equip['cat'], e: Equip | null) {
  const kick = { cover: 'Abdeckung', technology: 'Technik', iwash: 'Rückspülung', heatpump: 'Wärmepumpe', lighting: 'Beleuchtung' }[cat];
  const season = state.step === 6 ? seasonHtml() : '';
  if (!e) { swapInfo(cat + '-none', `<div class="kf-card kf-product"><div class="kf-product-img"></div><div><span class="kf-kicker">${kick}</span><h2>Bitte wählen</h2>${season}</div></div>`); return; }
  const light = state.step === 6 && !ledSelected(state) && eq(state.light) ? `<span class="kf-badge-inline">${esc(eq(state.light)!.name)}</span>` : '';
  swapInfo(`${cat}-${e.id}-${state.light || ''}`, `<div class="kf-card kf-product">
    <div class="kf-product-img">${e.img ? `<img src="${img(e.img)}" alt="">` : '<span style="font-size:2rem;color:#c9c8c3">—</span>'}</div>
    <div><span class="kf-kicker">${kick}</span><h2>${esc(e.name)}</h2><p>${esc(e.desc)}</p>${e.badge ? `<span class="kf-badge-inline">${esc(e.badge)}</span>` : ''} ${light}${season}</div>
  </div>`, () => {
    const on = $('[data-stage-info]').querySelectorAll('.kf-season-bar .on');
    if (on.length && !reduce) animate(on, { scaleX: [0, 1], opacity: [0, 1] }, { delay: stagger(0.06, { startDelay: 0.4 }), duration: 0.6, ease: premium });
  });
}
function seasonKey() {
  const n = eq(state.heat)?.name.toLowerCase() || '';
  return n.includes('premium') ? 'premium' : n.includes('standard') ? 'standard' : 'none';
}
function seasonHtml() {
  const [a, b] = SEASON[seasonKey()];
  return `<div class="kf-season"><div class="kf-season-bar">${MONTHS.map((_, i) => `<span class="${i >= a && i <= b ? 'on' : ''}"></span>`).join('')}</div>
    <div class="kf-season-lbl">${MONTHS.map((m) => `<span>${m}</span>`).join('')}</div></div>`;
}
function summaryCard() {
  const rows = summarize(data, state);
  swapInfo('sum-' + state.view + rows.map((r) => r.v).join('|'), `<div class="kf-card kf-sum">
    <h2>Ihr Pool</h2>
    <ul>${rows.map((r) => `<li><span>${esc(r.k)}</span><span>${esc(r.v)}${r.m ? `<small>${esc(r.m)}</small>` : ''}</span>${state.view === 'done' ? '<span></span>' : `<button type="button" class="kf-link" data-goto-step="${r.step}">ändern</button>`}</li>`).join('')}</ul>
  </div>`, () => $$('[data-goto-step]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.gotoStep!))));
}

// ---------- Panel ----------
function head() {
  const s = STEPS[state.step - 1];
  $('[data-head]').innerHTML = `<p class="kf-eyebrow"><span class="dot"></span>Schritt ${state.step} von 7</p><h1>${s.title}</h1>${s.intro ? `<p>${s.intro}</p>` : ''}`;
}
const tick = '<span class="kf-tick" aria-hidden="true">✓</span>';
function optCard(attrs: string, checked: boolean, media: string, title: string, sub = '', badge = '') {
  return `<li><button type="button" class="kf-opt" role="radio" aria-checked="${checked}" ${attrs}>${media}<h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}${badge ? `<span class="kf-badge-inline">${esc(badge)}</span>` : ''}${tick}</button></li>`;
}
function equipList(cat: Equip['cat'], key: keyof Config, cols = 2) {
  const list = equipFor(data, state, cat);
  const blocked = blockedFor(data, state, cat);
  const note = blocked.length ? `<div class="kf-note">ⓘ <span>${esc(blocked.map((b) => b.name).join(', '))} ist für ${esc(model()?.name || 'dieses Becken')} bauartbedingt nicht möglich.</span></div>` : '';
  return note + `<ul class="kf-opts ${cols === 2 ? 'is-2' : ''}" role="radiogroup">${list.map((e) => optCard(
    `data-pick="${key}" data-val="${e.id}"`, state[key] === e.id,
    e.img ? `<span class="kf-media is-product"><img src="${img(e.img)}" alt="" loading="lazy"></span>` : '<span class="kf-media is-empty">—</span>',
    e.name, e.desc, e.badge)).join('')}</ul>`;
}
function body() {
  const b = $('[data-body]');
  const s = state.step;
  if (s === 1) {
    b.innerHTML = `<ul class="kf-opts" role="radiogroup" aria-label="Hersteller">${data.manufacturers.map((m) => `
      <li><button type="button" class="kf-opt kf-opt-brand" role="radio" aria-checked="${state.man === m.id}" data-man="${m.id}">
        <span class="logo"><img src="${img(m.logo)}" alt=""></span>
        <span><span class="kf-kicker">${esc(m.tech)}</span><h3>${esc(m.name)}</h3><p>${esc(m.tagline)}</p>
          <span class="meta"><span>${modelsOf(m.id).length} Becken</span><span>${esc(m.points[1] || '')}</span></span></span>
        ${tick}</button></li>`).join('')}</ul>`;
  } else if (s === 2) {
    const list = modelsOf(state.man).sort((a, c) => a.l - c.l);
    b.innerHTML = `<div class="kf-filter" role="group" aria-label="Länge">${SIZES.filter((x) => x.id === 'all' || list.some(x.test)).map((x) => `<button type="button" class="kf-fchip" aria-pressed="${state.size === x.id}" data-size="${x.id}">${x.label}</button>`).join('')}<span class="kf-count" data-count-lbl></span></div>
      <ul class="kf-opts is-2 is-models" role="radiogroup" aria-label="Becken">${list.map((m) => `<li data-mid="${m.id}">${optCard(`data-model="${m.id}"`, state.model === m.id,
        `<span class="kf-media"><img src="${img(m.thumb)}" alt="" loading="lazy" style="object-position:${m.fx}% ${m.fy}%"></span>`, m.name, m.dims + (m.stairs ? ' · ' + m.stairs : '')).replace(/^<li>|<\/li>$/g, '')}</li>`).join('')}</ul>`;
    applyFilter(false);
  } else if (s === 3) {
    const cols = colorsFor(data, state);
    const cap = ledCap();
    const ledOpts = cap === 'none' ? [] : cap === 'side-selectable'
      ? [['none', 'Ohne LED-Streifen'], ['one-side', 'Einseitig'], ['both-sides', 'Beidseitig']]
      : [['none', 'Ohne LED-Streifen'], ['yes', 'Mit LED-Streifen']];
    b.innerHTML = `<ul class="kf-opts is-2" role="radiogroup" aria-label="Beckenfarbe">${cols.map((c) => optCard(`data-pick="color" data-val="${c.id}"`, state.color === c.id,
      `<span class="kf-media"><img src="${img(c.thumb)}" alt="" loading="lazy" style="object-position:${c.fx}% ${c.fy}%"></span>`, c.name, c.desc)).join('')}</ul>
      ${ledOpts.length ? `<p class="kf-section-t">LED-Streifen am Beckenrand</p>
        <div class="kf-filter" role="radiogroup" aria-label="LED-Streifen">${ledOpts.map(([v, t]) => `<button type="button" class="kf-fchip" role="radio" aria-checked="${state.led === v}" data-pick="led" data-val="${v}">${t}</button>`).join('')}</div>
        <p class="kf-muted">Die integrierte Lichtlinie setzt die Beckenform abends in Szene. Mit LED-Streifen entfällt die Wahl der Scheinwerfer.</p>`
      : `<div class="kf-note">ⓘ <span>Für ${esc(model()?.name || 'dieses Becken')} ist kein integrierter LED-Streifen vorgesehen – die Beleuchtung wählen Sie in Schritt 6.</span></div>`}`;
  } else if (s === 4) {
    b.innerHTML = equipList('cover', 'cover');
  } else if (s === 5) {
    b.innerHTML = equipList('technology', 'tech') + `<p class="kf-section-t">Rückspülung</p>` + equipList('iwash', 'iwash');
  } else if (s === 6) {
    b.innerHTML = `<p class="kf-section-t" style="margin-top:0">Wärmepumpe</p>` + equipList('heatpump', 'heat') +
      (ledSelected(state)
        ? `<div class="kf-note" style="margin-top:1rem">✦ <span>Ihre Beleuchtung übernimmt der LED-Streifen am Beckenrand – zusätzliche Scheinwerfer sind nicht nötig.</span></div>`
        : `<p class="kf-section-t">Scheinwerfer</p>` + equipList('lighting', 'light'));
  } else if (s === 7) {
    b.innerHTML = formHtml();
  }
  bindBody();
}

function field(key: keyof Contact, label: string, type = 'text', attrs = '', req = true) {
  return `<div class="kf-field ${errors[key] ? 'has-error' : ''}"><label for="kf-${key}">${label}${req ? ' *' : ''}</label>
    <input id="kf-${key}" name="${key}" type="${type}" value="${esc(String(contact[key] ?? ''))}" ${attrs}>${errors[key] ? `<span class="kf-err">${errors[key]}</span>` : ''}</div>`;
}
function formHtml() {
  const c = contact.consult;
  return `<form class="kf-form" data-form novalidate>
    <div class="kf-grid2">${field('name', 'Vor- und Nachname', 'text', 'autocomplete="name"')}${field('email', 'E-Mail', 'email', 'autocomplete="email"')}</div>
    <label class="kf-switch"><input type="checkbox" name="consult" ${c ? 'checked' : ''}><span class="tr"></span><span><b>Persönliche Beratung anfragen</b><small>Wir rufen Sie an und planen alles mit Ihnen – kostenlos und unverbindlich.</small></span></label>
    <div class="kf-consult" data-consult ${c ? '' : 'hidden'}>
      <div class="kf-grid2">${field('phone', 'Telefon', 'tel', 'autocomplete="tel"', c)}${field('street', 'Straße und Nr.', 'text', 'autocomplete="street-address"', false)}</div>
      <div class="kf-grid3">${field('zip', 'PLZ', 'text', 'inputmode="numeric" maxlength="5" autocomplete="postal-code"', c)}${field('city', 'Ort', 'text', 'autocomplete="address-level2"', c)}</div>
      <div class="kf-field"><label>Rückruf am besten *</label>
        <div class="kf-filter" role="radiogroup" style="margin:0">${data.slots.map((s) => `<button type="button" class="kf-fchip" role="radio" aria-checked="${contact.slot === s}" data-slot="${esc(s)}">${esc(s)}</button>`).join('')}</div>
        ${errors.slot ? `<span class="kf-err">${errors.slot}</span>` : ''}</div>
    </div>
    <div class="kf-field"><label for="kf-wishes">Ihre Wünsche (optional)</label><textarea id="kf-wishes" name="wishes" maxlength="2000" placeholder="Gartensituation, Wunschtermin, Besonderheiten …">${esc(contact.wishes)}</textarea></div>
    <label class="kf-check"><input type="checkbox" name="privacy" ${contact.privacy ? 'checked' : ''}><span>Ich habe die <a href="${data.privacy}" target="_blank" rel="noopener">Datenschutzhinweise</a> gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. *</span></label>
    ${errors.privacy ? `<span class="kf-err">${errors.privacy}</span>` : ''}
    <label class="kf-hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
  </form>`;
}

let hoverTimer2 = 0;
function bindBody() {
  const b = $('[data-body]');
  b.querySelectorAll<HTMLElement>('[data-man]').forEach((el) => {
    el.addEventListener('click', () => pickMan(el.dataset.man!, el));
    el.addEventListener('mouseenter', () => { if (!mobile()) { window.clearTimeout(hoverTimer2); hoverTimer2 = window.setTimeout(() => stage({ brand: byId(data.manufacturers, el.dataset.man!)! }), 180); } });
    el.addEventListener('mouseleave', () => { if (!mobile()) { window.clearTimeout(hoverTimer2); hoverTimer2 = window.setTimeout(() => stage(), 260); } });
  });
  b.querySelectorAll<HTMLElement>('[data-size]').forEach((el) => el.addEventListener('click', () => {
    state.size = el.dataset.size!; save();
    b.querySelectorAll('[data-size]').forEach((x) => x.setAttribute('aria-pressed', String(x === el)));
    applyFilter(true);
  }));
  b.querySelectorAll<HTMLElement>('[data-model]').forEach((el) => {
    el.addEventListener('click', () => pickModel(el.dataset.model!, el));
    el.addEventListener('mouseenter', () => { if (!mobile()) { const m = byId(data.models, el.dataset.model!)!; setPhoto(m.img, { x: m.fx, y: m.fy }, 180); } });
    el.addEventListener('mouseleave', () => { if (!mobile()) modelPhoto(260); });
  });
  b.querySelectorAll<HTMLElement>('[data-pick]').forEach((el) => {
    el.addEventListener('click', () => pick(el.dataset.pick as keyof Config, el.dataset.val!, el));
    el.addEventListener('mouseenter', () => {
      if (mobile()) return; const k = el.dataset.pick;
      window.clearTimeout(hoverTimer2);
      hoverTimer2 = window.setTimeout(() => {
        if (k === 'color') stage({ color: el.dataset.val! });
        else if (k === 'cover' || k === 'tech' || k === 'heat') stage({ equip: eq(el.dataset.val!) });
      }, 180);
    });
    el.addEventListener('mouseleave', () => { if (!mobile()) { window.clearTimeout(hoverTimer2); hoverTimer2 = window.setTimeout(() => stage(), 260); } });
  });
  // Formular
  const form = b.querySelector<HTMLFormElement>('[data-form]');
  if (form) {
    form.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.name && t.name in contact && t.type !== 'checkbox') (contact as any)[t.name] = t.value;
      clearErr(t.name, t.closest('.kf-field'));
    });
    form.addEventListener('change', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.name === 'privacy') { contact.privacy = t.checked; if (t.checked) clearErr('privacy', form.querySelector('[name="privacy"]')!.closest('.kf-check')!.nextElementSibling as HTMLElement, true); }
      if (t.name === 'consult') {
        contact.consult = t.checked;
        const box = form.querySelector<HTMLElement>('[data-consult]')!;
        if (t.checked) { box.hidden = false; if (!reduce) animate(box, { opacity: [0, 1], y: [-12, 0], filter: ['blur(6px)', 'blur(0px)'] }, { duration: 0.7, ease: premium }); }
        else box.hidden = true;
      }
      updateNav();
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    form.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => el.addEventListener('click', () => {
      contact.slot = el.dataset.slot!; clearErr('slot', el.closest('.kf-field'));
      form.querySelectorAll('[data-slot]').forEach((x) => x.setAttribute('aria-checked', String(x === el)));
      if (!reduce) animate(el, { scale: [0.94, 1] }, { duration: 0.5, ease: premium });
    }));
  }
}

// Fehlermeldung eines Felds entfernen, sobald es bearbeitet wird
function clearErr(name: string, box: Element | null, isMsg = false) {
  if (!errors[name]) return;
  delete errors[name];
  if (!box) return;
  const msg = isMsg ? (box.classList.contains('kf-err') ? box : null) : box.querySelector('.kf-err');
  box.classList.remove('has-error');
  if (msg) { if (reduce) msg.remove(); else animate(msg, { opacity: 0, y: -4 }, { duration: 0.3 }).then(() => msg.remove()); }
}

// Filter mit FLIP: Karten gleiten an ihre neuen Plätze, neue blenden ein
function applyFilter(anim: boolean) {
  const test = SIZES.find((s) => s.id === state.size)?.test || (() => true);
  const items = $$<HTMLLIElement>('[data-mid]');
  const before = new Map(items.map((li) => [li, li.getBoundingClientRect()]));
  let n = 0;
  items.forEach((li) => { const show = test(byId(data.models, li.dataset.mid!)!); li.hidden = !show; if (show) n++; });
  const lbl = root.querySelector('[data-count-lbl]'); if (lbl) lbl.textContent = `${n} Becken`;
  if (!anim || reduce) return;
  items.filter((li) => !li.hidden).forEach((li, i) => {
    const a = before.get(li)!, b = li.getBoundingClientRect();
    if (a.width === 0) animate(li, { opacity: [0, 1], y: [24, 0], filter: ['blur(8px)', 'blur(0px)'] }, { duration: 0.8, delay: Math.min(i, 8) * 0.04, ease: premium });
    else animate(li, { x: [a.left - b.left, 0], y: [a.top - b.top, 0] }, { duration: 0.7, ease: premium });
  });
}

// ---------- Auswahl ----------
function flyChip(from: HTMLElement, label: string) {
  const target = $('[data-cart]');
  if (reduce) return bumpBadge();
  const a = from.getBoundingClientRect(), t = target.getBoundingClientRect();
  const chip = document.createElement('div');
  chip.className = 'kf-chip kf-fly'; chip.textContent = label; chip.style.left = '0px'; chip.style.top = '0px';
  document.body.append(chip);
  const c = chip.getBoundingClientRect();
  const sx = a.left + a.width / 2 - c.width / 2, sy = a.top + a.height / 2 - c.height / 2;
  const tx = t.left + t.width / 2 - c.width / 2, ty = t.top + t.height / 2 - c.height / 2;
  animate(chip, { x: [sx, (sx + tx) / 2, tx], y: [sy, Math.min(sy, ty) - 90, ty], scale: [1, 1.06, 0.4], opacity: [1, 1, 0] }, { duration: 1, ease: [0.45, 0, 0.2, 1] })
    .then(() => { chip.remove(); bumpBadge(); });
}
function bumpBadge() {
  const n = summarize(data, state).filter((r) => r.v !== 'über LED-Streifen').length;
  const badge = $('[data-badge]');
  if (badge.textContent !== String(n) && !reduce) animate(badge, { scale: [1.5, 1] }, { type: 'spring', stiffness: 420, damping: 14 });
  badge.textContent = String(n);
  cartList();
}
function markChecked(group: HTMLElement[], el: HTMLElement) {
  group.forEach((x) => x.setAttribute('aria-checked', String(x === el)));
  if (!reduce) {
    animate(el, { scale: [0.98, 1] }, { duration: 0.5, ease: premium });
    const t = el.querySelector('.kf-tick'); if (t) animate(t, { scale: [0, 1], rotate: [-40, 0] }, { type: 'spring', stiffness: 420, damping: 16 });
  }
}
function pickMan(id: string, el: HTMLElement) {
  const changed = state.man !== id;
  if (changed) Object.assign(state, { ...empty, man: id, size: 'all', compare: null });
  save(); markChecked($$('[data-man]'), el);
  stage();
  if (changed) flyChip(el, man()!.name);
  updateNav(); chips();
}
function pickModel(id: string, el: HTMLElement) {
  if (state.compare && state.compare !== id && state.model) { state.compare = id; save(); stage(); return; }
  const changed = state.model !== id;
  state.model = id;
  if (changed) {
    Object.assign(state, { color: null, led: null, light: null });
    const ex = model()?.excluded || []; if (state.cover && ex.includes(state.cover)) state.cover = null;
  }
  save(); markChecked($$('[data-model]'), el);
  stage();
  if (changed) flyChip(el, model()!.name);
  updateNav(); chips();
}
function pick(key: keyof Config, val: string, el: HTMLElement) {
  const changed = state[key] !== val;
  (state as any)[key] = val;
  if (key === 'led') { if (ledSelected(state)) { state.light = null; state.night = true; } else state.night = false; }
  if (key === 'light') state.night = true;
  save();
  markChecked([...el.closest('[role="radiogroup"]')!.querySelectorAll<HTMLElement>('[data-pick]')], el);
  stage();
  const label = key === 'led' ? LED_LABELS[val] : (byId(data.colors, val)?.name || eq(val)?.name || val);
  if (changed && key !== 'led') flyChip(el, label); else bumpBadge();
  updateNav(); chips();
}

// ---------- Navigation ----------
function canNextAt(step: number) {
  switch (step) {
    case 1: return !!state.man;
    case 2: return !!state.model;
    case 3: return !!state.color && (ledCap() === 'none' || !!state.led);
    case 4: return !!state.cover;
    case 5: return !!state.tech && !!state.iwash;
    case 6: return !!state.heat && (ledSelected(state) || !!state.light);
    case 7: return true;
  }
  return false;
}
const canNext = () => canNextAt(state.step);
const HINTS = ['Bitte Hersteller wählen', 'Bitte Becken wählen', 'Bitte Farbe (und LED) wählen', 'Bitte Abdeckung wählen', 'Bitte Technik und Rückspülung wählen', 'Bitte Wärmepumpe und Licht wählen', ''];
function maxStep() { let s = 1; for (let i = 1; i < 7; i++) { if (canNextAt(i)) s = i + 1; else break; } return s; }
function updateNav() {
  const next = $('[data-next]');
  const last = state.step === 7;
  next.textContent = last ? 'Konfiguration senden →' : 'Weiter →';
  next.setAttribute('aria-disabled', String(!canNext()));
  $('[data-hint]').textContent = canNext() ? (last ? 'PDF kommt per E-Mail' : '') : HINTS[state.step - 1];
  const reach = maxStep();
  $$('[data-pstep]').forEach((li) => {
    const i = +li.dataset.pstep!;
    li.classList.toggle('is-current', i === state.step && state.view !== 'done');
    li.classList.toggle('is-done', i < state.step || state.view === 'done');
    li.querySelector('button')!.disabled = state.view === 'done' || i > reach;
  });
  $('[data-mstep]').textContent = String(state.step);
  const pct = state.view === 'done' ? 100 : (state.step / 7) * 100;
  $$('[data-pfill]').forEach((f) => animate(f, { width: `${pct}%` }, reduce ? { duration: 0 } : { duration: 0.9, ease: premium }));
}
function chips() {
  const parts = state.step === 1 || state.view === 'done' ? [] : [man()?.name, state.step > 2 ? model()?.name : null].filter(Boolean) as string[];
  $('[data-chips]').innerHTML = parts.map((p) => `<span class="kf-chip">${esc(p)}</span>`).join('');
}
function cartList() {
  const rows = summarize(data, state);
  $('[data-cart-list]').innerHTML = rows.length ? rows.map((r) => `<li><span>${esc(r.k)}</span><span>${esc(r.v)}</span></li>`).join('') : '<li class="empty">Noch nichts gewählt.</li>';
}

function renderStep(dir: 1 | -1 = 1) {
  const scroll = $('[data-scroll]');
  const content = [$('[data-head]'), $('[data-body]')];
  const draw = () => {
    head(); body(); stage(); updateNav(); chips(); scroll.scrollTop = 0;
    if (reduce) return;
    content.forEach((c) => { c.style.opacity = '1'; c.style.transform = ''; c.style.filter = ''; });
    animate(content[0].children, { opacity: [0, 1], y: [34 * dir, 0], filter: ['blur(10px)', 'blur(0px)'] }, { delay: stagger(0.08), duration: 1.1, ease: premium });
    const cards = $$('[data-body] .kf-opt, [data-body] .kf-fchip, [data-body] .kf-count, [data-body] .kf-note, [data-body] .kf-section-t, [data-body] .kf-field, [data-body] .kf-switch, [data-body] .kf-check')
      .filter((el) => !el.closest('[hidden]')).slice(0, 18);
    animate(cards, { opacity: [0, 1], y: [48, 0], filter: ['blur(8px)', 'blur(0px)'] }, { delay: stagger(0.05, { startDelay: 0.18 }), duration: 1.1, ease: premium });
  };
  if (reduce || !content[0].innerHTML) return draw();
  animate(content, { opacity: 0, y: -18 * dir, filter: 'blur(8px)' }, { duration: 0.38, ease: [0.4, 0, 1, 1] }).then(draw);
}
function go(step: number) {
  if (state.view === 'done') return;
  const dir = step > state.step ? 1 : -1;
  state.step = Math.min(7, Math.max(1, step));
  if (state.step !== 3 && state.step !== 6) state.night = false;
  save(); renderStep(dir as 1 | -1);
}

// ---------- Versand ----------
async function submit() {
  errors = validContact(contact);
  if (Object.keys(errors).length) {
    $('[data-body]').innerHTML = formHtml(); bindBody();
    const first = $('[data-body]').querySelector('.has-error input, .kf-err');
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!reduce) animate($$('.kf-err'), { opacity: [0, 1], x: [-6, 0] }, { duration: 0.4 });
    return;
  }
  const next = $('[data-next]'); next.setAttribute('aria-busy', 'true'); next.textContent = 'Wird gesendet …';
  const cfg: Config = { man: state.man, model: state.model, color: state.color, led: state.led, cover: state.cover, tech: state.tech, iwash: state.iwash, heat: state.heat, light: state.light };
  try {
    const res = await fetch(data.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: cfg, contact }) });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('json')) throw new Error('no-api');
    const j = await res.json(); if (!j.ok) throw new Error(j.error || 'Fehler');
    doneRef = j.ref; testMode = false;
  } catch {
    // Auf GitHub Pages gibt es keine Server-Funktion → Testmodus mit PDF-Vorschau im Browser
    doneRef = 'TEST-' + Math.random().toString(36).slice(2, 7).toUpperCase(); testMode = true;
  }
  next.removeAttribute('aria-busy');
  showDone();
}
function showDone() {
  state.view = 'done'; root.dataset.view = 'done';
  const html = `<div class="kf-done">
      <div class="kf-done-icon">✓</div>
      <h2>Ihre Konfiguration ist unterwegs</h2>
      <p>Wir haben Ihnen Ihre Pool-Konfiguration als PDF an <strong>${esc(contact.email)}</strong> geschickt.${contact.consult ? ` Wir melden uns${contact.slot ? ` im Zeitfenster ${esc(contact.slot)} Uhr` : ''} zur persönlichen Beratung.` : ''}</p>
      <div class="kf-ref"><span>Ihre Referenz</span><b>${doneRef}</b></div>
      ${testMode ? `<div class="kf-test"><b>Testmodus:</b> Auf dieser Vorschau-Adresse ist der E-Mail-Versand noch nicht aktiv (läuft nach dem Umzug zu Cloudflare). So sieht das PDF aus:</div>
        <button type="button" class="btn-pill is-teal" data-pdf-preview>PDF-Vorschau öffnen</button>` : ''}
      <button type="button" class="kf-back" data-restart>Neue Konfiguration starten</button>
    </div>`;
  const scroll = $('[data-scroll]');
  const out = reduce ? Promise.resolve() : animate([$('[data-head]'), $('[data-body]')], { opacity: 0, y: -18, filter: 'blur(8px)' }, { duration: 0.38 }).then(() => {});
  out.then(() => {
    $('[data-head]').innerHTML = ''; $('[data-body]').innerHTML = html; $('[data-foot]').hidden = true; scroll.scrollTop = 0;
    [$('[data-head]'), $('[data-body]')].forEach((c) => { c.style.opacity = '1'; c.style.transform = ''; c.style.filter = ''; });
    $('[data-body]').querySelector('[data-restart]')!.addEventListener('click', restart);
    $('[data-body]').querySelector('[data-pdf-preview]')?.addEventListener('click', previewPdf);
    updateNav(); chips(); stage(); wave(); bumpBadge();
    if (!reduce) {
      animate($('[data-body]').querySelectorAll('.kf-done > *'), { opacity: [0, 1], y: [40, 0], filter: ['blur(10px)', 'blur(0px)'] }, { delay: stagger(0.08, { startDelay: 0.2 }), duration: 1.1, ease: premium });
      animate($('.kf-done-icon'), { scale: [0, 1], rotate: [-90, 0] }, { type: 'spring', stiffness: 260, damping: 14, delay: 0.25 });
    }
  });
}
// Wasserwelle über die Bühne
function wave() {
  if (reduce) return;
  const st = $('[data-stage]');
  st.querySelector('.kf-wave')?.remove();
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('class', 'kf-wave'); svg.setAttribute('viewBox', '0 0 1200 400'); svg.setAttribute('preserveAspectRatio', 'none');
  svg.innerHTML = `<path fill="rgb(32 175 173 / 0.35)"/><path fill="rgb(0 74 128 / 0.35)"/>`;
  st.append(svg);
  const paths = svg.querySelectorAll('path');
  const shape = (t: number, amp: number, off: number, level: number) => {
    let d = `M0 400 L0 ${level}`;
    for (let x = 0; x <= 1200; x += 40) d += ` L${x} ${level + Math.sin(x / 140 + t * 6 + off) * amp}`;
    return d + ' L1200 400 Z';
  };
  animate(0, 1, { duration: 2.6, ease: premium, onUpdate: (t) => {
    const level = 420 - t * 300 + Math.max(0, t - 0.6) * 520;
    paths[0].setAttribute('d', shape(t, 22 * (1 - t * 0.6), 0, level));
    paths[1].setAttribute('d', shape(t, 16 * (1 - t * 0.6), 1.7, level + 30));
  }, onComplete: () => svg.remove() });
}
async function previewPdf() {
  const { buildPdf } = await import('./pdf');
  const m = model()!;
  const [photo, logo] = await Promise.all([
    fetch(data.pdfBase + m.id + '.jpg').then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null),
    fetch(data.logo).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null),
  ]);
  const bytes = await buildPdf({
    ref: doneRef, date: new Date().toLocaleDateString('de-DE'), modelName: m.name, manName: man()?.name || '',
    rows: summarize(data, state), contact, photo, logo,
  });
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  window.open(url, '_blank');
}
function restart() {
  Object.assign(state, { ...empty, step: 1, size: 'all', compare: null, night: false });
  Object.assign(contact, { slot: '', wishes: '', privacy: false });
  errors = {}; doneRef = ''; state.view = 'studio'; root.dataset.view = 'studio';
  $('[data-foot]').hidden = false; save(); infoKey = ''; renderStep(-1); bumpBadge();
}

// ---------- Start → Studio ----------
function enterStudio() {
  const swap = () => {
    root.dataset.view = 'studio';
    $('[data-start]').hidden = true; $('[data-studio]').hidden = false;
    renderStep();
    if (!man()) { const h = heroOf('waterrows'); setPhoto(h.img, { x: h.fx, y: h.fy }); }
  };
  state.view = 'studio';
  const vt = (document as any).startViewTransition;
  if (vt && !reduce) vt.call(document, swap); else swap();
}

// ---------- Ereignisse ----------
$('[data-begin]').addEventListener('click', enterStudio);
$('[data-next]').addEventListener('click', () => {
  if ($('[data-next]').getAttribute('aria-busy') === 'true') return;
  if (state.step === 7) return void submit();
  if (canNext()) go(state.step + 1);
  else if (!reduce) animate($('[data-next]'), { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.45 });
});
$('[data-back]').addEventListener('click', () => {
  if (state.step === 1) {
    const back = () => { state.view = 'start'; root.dataset.view = 'start'; $('[data-studio]').hidden = true; $('[data-start]').hidden = false; };
    const vt = (document as any).startViewTransition;
    if (vt && !reduce) vt.call(document, back); else back();
  } else go(state.step - 1);
});
$('[data-daynight]').addEventListener('click', () => { state.night = !state.night; save(); stage(); });
$$('[data-goto]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.goto!)));
const pop = $('[data-cart-pop]');
$('[data-cart]').addEventListener('click', (e) => {
  e.stopPropagation(); cartList();
  const open = pop.hidden; pop.hidden = !open; $('[data-cart]').setAttribute('aria-expanded', String(open));
  if (open && !reduce) animate(pop, { opacity: [0, 1], y: [-10, 0], scale: [0.98, 1] }, { duration: 0.45, ease: premium });
});
document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target as Node)) { pop.hidden = true; $('[data-cart]').setAttribute('aria-expanded', 'false'); } });
document.addEventListener('keydown', (e) => {
  if (state.view !== 'studio' || (e.target as HTMLElement).closest('input, textarea')) return;
  if (e.key === 'ArrowRight' && canNext() && state.step < 7) go(state.step + 1);
  if (e.key === 'ArrowLeft' && state.step > 1) go(state.step - 1);
});

// Start
bumpBadge();
if (!reduce) animate($$('[data-rise]'), { opacity: [0, 1], y: [40, 0], filter: ['blur(10px)', 'blur(0px)'] }, { delay: stagger(0.12, { startDelay: 0.2 }), duration: 1.2, ease: premium });
// Direkt ins Studio, wenn per Link „#studio“ aufgerufen
if (location.hash === '#studio') enterStudio();
