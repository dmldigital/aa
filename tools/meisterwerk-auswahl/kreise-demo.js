/*
 * Ideen-Vorschau „drei Kreise im Hintergrund“ (Startseite). Wird von kreise-demo.py in eine Kopie der Startseite
 * eingebaut, nichts davon gehört in die echte Seite. Vier Ideen zum Umschalten (Hash #a #b #c #d #aus), Regler für die Stärke.
 * Ebene: fixiert, hinter dem Inhalt (z-index -1), Abschnitte mit `bg-soft` sind dafür durchsichtig gesetzt.
 * Alles läuft über transform und opacity (leicht für den Browser), geglätteter Scrollstand, reduzierte Bewegung: ohne Nachlaufen.
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GOLD = [165, 147, 113], TAUPE = [150, 128, 118], BLUE = [118, 134, 150], SAND = [206, 190, 164];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const smooth = (t) => t * t * (3 - 2 * t);
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const soft = (c, a) => `radial-gradient(circle, ${rgba(c, a)} 0%, ${rgba(c, a * 0.62)} 38%, ${rgba(c, 0)} 70%)`;

  const style = document.createElement('style');
  style.textContent = `
    html{background:#f7f7f7}
    body{background:transparent!important}
    .bg-soft{background-color:transparent!important}
    #kreise-layer{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
    #kreise-layer i{position:absolute;left:0;top:0;display:block;border-radius:50%;will-change:transform,opacity;transform-origin:50% 50%}
    #kreise-ui{position:fixed;right:14px;bottom:14px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:calc(100vw - 28px);padding:10px 12px;background:#fff;border:1px solid rgba(0,0,0,.18);box-shadow:0 4px 18px rgba(0,0,0,.14);font:500 12px/1.3 system-ui,sans-serif;color:#090402}
    #kreise-ui .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    #kreise-ui button{cursor:pointer;padding:6px 10px;border:1px solid rgba(0,0,0,.35);background:#fff;font:inherit;color:inherit}
    #kreise-ui button[aria-pressed=true]{background:#090402;color:#fff;border-color:#090402}
    #kreise-ui small{display:block;max-width:330px;font-weight:400;color:rgba(0,0,0,.68)}
    #kreise-ui input{width:110px;accent-color:#a59371}
    @media (max-width:700px){#kreise-ui{right:8px;bottom:8px;padding:8px 10px}#kreise-ui small{max-width:none}}
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.id = 'kreise-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.prepend(layer);
  const els = [0, 1, 2].map(() => layer.appendChild(document.createElement('i')));

  let W = innerWidth, H = innerHeight, V = Math.min(W, H), docH = document.documentElement.scrollHeight;
  const S = { sy: scrollY, vel: 0, t: 0, mx: 0.5, my: 0.5 };
  let strength = 1;
  let mode = 'a';
  const cur = [[0, 0], [0, 0], [0, 0]];
  let first = true;

  const apply = (i, x, y, k, op, bg) => {
    const e = els[i];
    const w = e._w;
    e.style.transform = `translate3d(${(x - w / 2).toFixed(1)}px,${(y - w / 2).toFixed(1)}px,0) scale(${k.toFixed(3)})`;
    e.style.opacity = clamp(op * strength, 0, 1).toFixed(3);
    if (bg) e.style.background = bg;
  };
  const progress = () => clamp(S.sy / Math.max(1, docH - H));

  // Vier Ideen, jede mit Aufbau (setup) und Bewegung (frame)
  const modes = {
    // A: weiche Farbtupfer, wandern unterschiedlich schnell auf eigenen Bahnen mit dem Scroll
    a: {
      note: 'A · Farbtupfer: drei weiche Tupfer in Gold, Taupe und Sand. Jeder wandert mit dem Scroll auf einer eigenen Bahn, unterschiedlich schnell.',
      sizes: [0.78, 0.58, 0.46], base: [[0.86, 0.18], [0.1, 0.56], [0.74, 0.9]], col: [GOLD, TAUPE, SAND], alpha: [0.5, 0.42, 0.55], op: 0.38,
      setup() { els.forEach((e, i) => { e.style.border = '0'; e.style.background = soft(this.col[i], this.alpha[i]); }); },
      frame() {
        els.forEach((_, i) => {
          const k = [900, 1300, 1700][i], ph = i * 2.1;
          const x = W * this.base[i][0] + Math.cos((S.sy / k) + ph) * W * 0.08;
          const y = H * this.base[i][1] + Math.sin((S.sy / k) * 1.3 + ph) * H * 0.2;
          apply(i, x, y, 1 + Math.sin(S.sy / 1500 + i) * 0.05 + clamp(S.vel / 120) * 0.06, this.op);
        });
      },
    },
    // B: feine goldene Ringe (wie die Haarlinien der Seite), umkreisen sich beim Scrollen
    b: {
      note: 'B · Haarlinien: drei feine Ringe in Gold, wie die dünnen Linien der Seite. Beim Scrollen umkreisen sie sich und ergeben immer neue Überlappungen.',
      sizes: [1.05, 0.74, 0.48], ring: [0.5, 0.38, 0.3], op: 1,
      setup() { els.forEach((e, i) => { e.style.background = 'none'; e.style.border = `1px solid ${rgba(GOLD, this.ring[i])}`; }); },
      frame() {
        els.forEach((_, i) => {
          const a = S.sy * 0.0006 * (1 + i * 0.4) + i * 2.094;
          const R = V * 0.24 * (1 + i * 0.2);
          apply(i, W / 2 + Math.cos(a) * R, H / 2 + Math.sin(a * 1.1) * R * 0.8, 1 + clamp(S.vel / 160) * 0.05, this.op);
        });
      },
    },
    // C: tanzen von Sektion zu Sektion, federn nach, atmen mit der Scrollgeschwindigkeit, folgen leicht der Maus
    c: {
      note: 'C · Tanz: die Kreise springen nicht, sondern schweben beim Scrollen zu neuen Plätzen (links, rechts, Mitte), federn nach und werden bei schnellem Scrollen größer. Am Desktop folgen sie leicht der Maus.',
      sizes: [0.7, 0.54, 0.4], col: [GOLD, SAND, TAUPE], alpha: [0.5, 0.55, 0.42], op: 0.4,
      anchors: [
        [[0.86, 0.2], [0.14, 0.4], [0.86, 0.6], [0.2, 0.78], [0.84, 0.84], [0.5, 0.3]],
        [[0.12, 0.6], [0.82, 0.3], [0.2, 0.2], [0.8, 0.5], [0.14, 0.46], [0.7, 0.7]],
        [[0.7, 0.88], [0.4, 0.8], [0.7, 0.12], [0.4, 0.6], [0.78, 0.3], [0.2, 0.82]],
      ],
      setup() { els.forEach((e, i) => { e.style.border = '0'; e.style.background = soft(this.col[i], this.alpha[i]); }); },
      frame() {
        const p = progress();
        els.forEach((_, i) => {
          const a = this.anchors[i], n = a.length - 1, f = p * n, j = Math.min(n - 1, Math.floor(f)), t = smooth(f - j);
          const tx = (a[j][0] + (a[j + 1][0] - a[j][0]) * t) * W + (S.mx - 0.5) * [-40, 60, -90][i];
          const ty = (a[j][1] + (a[j + 1][1] - a[j][1]) * t) * H + (S.my - 0.5) * [-30, 50, -70][i];
          if (first || reduce) { cur[i][0] = tx; cur[i][1] = ty; } else { cur[i][0] += (tx - cur[i][0]) * 0.07; cur[i][1] += (ty - cur[i][1]) * 0.07; }
          apply(i, cur[i][0], cur[i][1], 1 + clamp(S.vel / 70) * 0.2, this.op);
        });
      },
    },
    // D: wie Wandfarben aus dem Showroom: die Kreise wechseln beim Scrollen die Farbe und bewegen sich auf Achterbahnen
    d: {
      note: 'D · Wandfarben: die Kreise wechseln beim Scrollen langsam die Farbe (Gold, Taupe, Graublau, Sand), wie Farbmuster im Showroom, und ziehen Achterbahnen.',
      sizes: [0.74, 0.56, 0.42], pal: [GOLD, TAUPE, BLUE, SAND, GOLD], alpha: 0.5, op: 0.36,
      setup() { els.forEach((e) => { e.style.border = '0'; }); },
      color(p) { const n = this.pal.length - 1, f = clamp(p) * n, j = Math.min(n - 1, Math.floor(f)); return mix(this.pal[j], this.pal[j + 1], smooth(f - j)); },
      frame() {
        els.forEach((_, i) => {
          const a = S.sy * 0.0009 * (1 + i * 0.25) + S.t * 0.00004 + i * 2.1;
          const x = W * (0.5 + 0.4 * Math.sin(a * 0.9 + i)), y = H * (0.5 + 0.34 * Math.sin(a * 1.3 + i * 1.7));
          apply(i, x, y, 1 + Math.sin(a * 2) * 0.06, this.op, soft(this.color(progress() + i * 0.1), this.alpha));
        });
      },
    },
  };

  const size = () => {
    const m = modes[mode];
    els.forEach((e, i) => { e._w = (m.sizes[i] || 0.5) * V; e.style.width = e.style.height = e._w + 'px'; });
  };
  const setMode = (key) => {
    mode = key;
    first = true;
    layer.style.display = key === 'aus' ? 'none' : '';
    ui.querySelectorAll('[data-k]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === key)));
    note.textContent = key === 'aus' ? 'Ohne Kreise (zum Vergleich).' : modes[key].note;
    if (key !== 'aus') { modes[key].setup(); size(); }
    history.replaceState(null, '', '#' + key);
  };

  // Bedienfeld (nur in der Vorschau)
  const ui = document.createElement('div');
  ui.id = 'kreise-ui';
  ui.innerHTML = `<div class="row"><b>Kreise</b>
      <button type="button" data-k="aus">Aus</button><button type="button" data-k="a">A</button><button type="button" data-k="b">B</button><button type="button" data-k="c">C</button><button type="button" data-k="d">D</button></div>
    <div class="row"><label>Stärke <input type="range" min="0.4" max="3" step="0.1" value="1"></label></div><small></small>`;
  document.body.appendChild(ui);
  const note = ui.querySelector('small');
  ui.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) setMode(b.dataset.k); });
  ui.querySelector('input').addEventListener('input', (e) => { strength = Number(e.target.value); });

  addEventListener('resize', () => { W = innerWidth; H = innerHeight; V = Math.min(W, H); docH = document.documentElement.scrollHeight; if (mode !== 'aus') size(); });
  addEventListener('pointermove', (e) => { S.mx = e.clientX / W; S.my = e.clientY / H; }, { passive: true });
  new ResizeObserver(() => { docH = document.documentElement.scrollHeight; }).observe(document.body);

  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(64, now - last);
    last = now;
    S.t += dt;
    const y = scrollY;
    if (reduce) { S.vel = 0; S.sy = y; } else { S.vel = y - S.sy; S.sy += (y - S.sy) * 0.08; }
    if (mode !== 'aus') { modes[mode].frame(); first = false; }
    requestAnimationFrame(tick);
  };

  const start = (location.hash || '#a').slice(1);
  setMode(modes[start] || start === 'aus' ? start : 'a');
  requestAnimationFrame(tick);
})();
