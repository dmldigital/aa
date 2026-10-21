/**
 * Video als Bildfolge auf einem Canvas (Hero-Flug: Terrasse des Altbaus, durch das Fenster ins Wohnzimmer).
 * Die 97 Bilder liegen in `public/hero-flug/` (Desktop `d/`, Handy `m/` als Hochformat-Ausschnitt).
 * Es gibt kein eigenes Abspielen: `seek(p)` stellt das Video auf 0 bis 1, wer es aufruft (die Scroll-Zeitleiste des Heros),
 * bestimmt Tempo und Richtung, Anhalten und Zurückscrollen gehen damit von selbst. Zwischen zwei Bildern wird
 * überblendet. Den Ausschnitt macht CSS (object-fit), das Standbild darunter ist das erste Bild.
 */
export interface Flug {
  /** Video auf Stand 0 bis 1 stellen */
  seek(p: number): void;
  /** Bilder laden: zuerst Anfang und Ende, dann der Rest im Hintergrund, 6 gleichzeitig */
  load(): Promise<void>;
}

export function createFlug(canvas: HTMLCanvasElement): Flug {
  const ctx = canvas.getContext('2d')!;
  const N = Number(canvas.dataset.frames);
  const END = N - 1;
  const set = window.matchMedia('(max-aspect-ratio: 4/5)').matches ? 'm' : 'd';
  const src = (i: number) => `${canvas.dataset.base}${set}/${String(i).padStart(3, '0')}.webp`;
  const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);
  let pos = 0; // in Bildern, 0 bis END

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

  return {
    seek(p) {
      pos = Math.min(1, Math.max(0, p)) * END;
      draw();
    },
    async load() {
      await loadOne(0);
      draw();
      const queue = order.filter((i) => !frames[i]);
      const worker = async () => {
        while (queue.length) {
          await loadOne(queue.shift()!);
          draw();
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    },
  };
}
