/**
 * Video als Bildfolge auf einem Canvas (Hero-Flug: Terrasse des Altbaus, durch das Fenster ins Wohnzimmer).
 * Die 97 Bilder liegen in `public/hero-flug/` (Desktop `d/`, Handy `m/` als Hochformat-Ausschnitt).
 * Ruhe = erstes Bild. `play(1)` lässt das Video mit gleichmäßigem Tempo bis zum Ende laufen, `play(0)` rückwärts,
 * Richtungswechsel mitten im Lauf sind weich. Zwischen zwei Bildern wird überblendet. Den Ausschnitt macht CSS (object-fit).
 */
export interface Flug {
  /** Stand 0 bis 1 */
  readonly pos: number;
  /** Ziel des laufenden Abspielens: 0 oder 1 */
  readonly target: 0 | 1;
  play(to: 0 | 1): void;
  /** Sofort an Anfang oder Ende springen */
  jump(to: 0 | 1): void;
  /** Stand von außen setzen (0 bis 1), z. B. aus einer GSAP-Zeitleiste, die den ganzen Ablauf steuert */
  seek(p: number): void;
  /** Bilder laden (zuerst Anfang oder Ende, dann der Rest im Hintergrund) */
  load(startAtEnd?: boolean): Promise<void>;
  onFrame?: (pos: number) => void;
  onDone?: (at: 0 | 1) => void;
}

export function createFlug(canvas: HTMLCanvasElement, duration = 6000): Flug {
  const ctx = canvas.getContext('2d')!;
  const N = Number(canvas.dataset.frames);
  const END = N - 1;
  const set = window.matchMedia('(max-aspect-ratio: 4/5)').matches ? 'm' : 'd';
  const src = (i: number) => `${canvas.dataset.base}${set}/${String(i).padStart(3, '0')}.webp`;
  const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);

  const loadOne = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames[i] = img;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src(i);
    });
  // Ladereihenfolge: erst Anfang und Ende, dann immer feiner verteilt
  const order = [0, END];
  for (let step = 32; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < N; i += step) if (!order.includes(i)) order.push(i);
    if (step === 1) break;
  }
  const nearest = (i: number) => {
    for (let d = 0; d < N; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  };

  let pos = 0; // in Bildern, 0 bis END
  let target: 0 | 1 = 0;
  let raf = 0;
  let last = 0;

  const draw = () => {
    const i = Math.floor(pos);
    const a = nearest(i);
    if (a < 0) return;
    const img = frames[a]!;
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0);
    const next = frames[i + 1];
    if (a === i && next && pos > i) {
      ctx.globalAlpha = pos - i;
      ctx.drawImage(next, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
    canvas.classList.add('is-ready');
  };

  const flug: Flug = {
    get pos() {
      return pos / END;
    },
    get target() {
      return target;
    },
    play(to) {
      target = to;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    jump(to) {
      target = to;
      pos = to * END;
      draw();
      flug.onFrame?.(flug.pos);
    },
    seek(p) {
      pos = Math.min(1, Math.max(0, p)) * END;
      draw();
    },
    async load(startAtEnd = false) {
      if (startAtEnd) await loadOne(END);
      await loadOne(0);
      draw();
      flug.onFrame?.(flug.pos);
      // Rest im Hintergrund laden, 6 gleichzeitig
      const queue = order.filter((i) => !frames[i]);
      const worker = async () => {
        while (queue.length) {
          await loadOne(queue.shift()!);
          if (!raf) draw();
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    },
  };

  function tick(t: number) {
    const dt = last ? Math.min(t - last, 64) : 16;
    last = t;
    const goal = target * END;
    const step = (dt / duration) * END;
    pos = goal > pos ? Math.min(goal, pos + step) : Math.max(goal, pos - step);
    draw();
    flug.onFrame?.(flug.pos);
    if (pos !== goal) {
      raf = requestAnimationFrame(tick);
      return;
    }
    raf = last = 0;
    flug.onDone?.(target);
  }

  return flug;
}
