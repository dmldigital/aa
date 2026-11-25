/**
 * Video als Bildfolge auf einem Canvas (Hero-Flug: Haus des Kunden, durch das Fenster im Untergeschoss ins Wohnzimmer).
 * Die Bilder (Anzahl `data-frames`, derzeit 177) liegen in `public/hero-flug/` (Desktop `d/`, Handy `m/` als Hochformat-Ausschnitt).
 * Es gibt kein eigenes Abspielen: `seek(p)` stellt das Video auf 0 bis 1, wer es aufruft (das Abspielen im Hero,
 * `HeroFull.astro`), bestimmt Tempo und Richtung. Zwischen zwei Bildern wird überblendet. Den Ausschnitt macht CSS (object-fit), das Standbild darunter ist das erste Bild.
 *
 * Ruckelfrei: Die Dateien werden der Reihe nach geladen und als Blob gehalten. Dekodiert (ImageBitmap, im Hintergrund) wird nur ein
 * Fenster rund um die aktuelle Stelle; so muss beim Zeichnen nie ein Bild entpackt werden und der Speicher bleibt klein.
 * `ready(p)` sagt, ob die Bilder für diese Stelle bereit sind, das Abspielen wartet sonst kurz, statt zu springen.
 */
export interface Flug {
  /** Video auf Stand 0 bis 1 stellen */
  seek(p: number): void;
  /** Bilder laden: zuerst Anfang und Ende, dann der Reihe nach, 6 gleichzeitig */
  load(): Promise<void>;
  /** Sind die Bilder für diese Stelle (0 bis 1) fertig dekodiert? */
  ready(p: number): boolean;
}

const AHEAD = 18; // Bilder im Voraus dekodiert (in Laufrichtung)
const BEHIND = 6; // und gegen die Laufrichtung

export function createFlug(canvas: HTMLCanvasElement): Flug {
  const ctx = canvas.getContext('2d')!;
  const N = Number(canvas.dataset.frames);
  const END = N - 1;
  const set = window.matchMedia('(max-aspect-ratio: 4/5)').matches ? 'm' : 'd';
  // `?v=` ändert sich mit jedem neuen Flug, damit Browser keine alten Bilder mit gleichem Namen zeigen
  const src = (i: number) => `${canvas.dataset.base}${set}/${String(i).padStart(3, '0')}.webp?v=${canvas.dataset.v ?? ''}`;
  const blobs: (Blob | null)[] = new Array(N).fill(null);
  const bitmaps: (ImageBitmap | null)[] = new Array(N).fill(null);
  const pending = new Set<number>();
  let pos = 0; // in Bildern, 0 bis END
  let dir = 1;

  const span = () => {
    const i = Math.floor(pos);
    const lo = Math.max(0, i - (dir > 0 ? BEHIND : AHEAD));
    const hi = Math.min(END, i + 1 + (dir > 0 ? AHEAD : BEHIND));
    return [lo, hi] as const;
  };

  // Fenster dekodieren, alles weit davon entfernte wieder freigeben
  const sync = () => {
    const [lo, hi] = span();
    for (let i = 0; i < N; i++) {
      const b = bitmaps[i];
      if (b && (i < lo - 2 || i > hi + 2)) {
        b.close();
        bitmaps[i] = null;
      }
    }
    for (let i = lo; i <= hi; i++) {
      const blob = blobs[i];
      if (!blob || bitmaps[i] || pending.has(i)) continue;
      pending.add(i);
      createImageBitmap(blob)
        .then((bm) => {
          pending.delete(i);
          const [l, h] = span();
          if (i < l - 2 || i > h + 2) {
            bm.close();
            return;
          }
          bitmaps[i] = bm;
          const cur = Math.floor(pos);
          if (i === cur || i === cur + 1) draw();
          sync();
        })
        .catch(() => pending.delete(i));
    }
  };

  const loadOne = async (i: number) => {
    try {
      const r = await fetch(src(i));
      if (!r.ok) return;
      blobs[i] = await r.blob();
      sync();
    } catch {
      /* fehlendes Bild: das Abspielen überspringt es nach kurzer Wartezeit */
    }
  };
  // Ladereihenfolge: erst Anfang und Ende, dann der Reihe nach (so wird auch abgespielt)
  const order = [0, END];
  for (let i = 1; i < END; i++) order.push(i);

  // Fehlt ein Bild noch, bleibt das letzte geladene davor stehen (nie abwechselnd vor und zurück springen)
  const nearest = (i: number) => {
    for (let j = i; j >= 0; j--) if (bitmaps[j]) return j;
    for (let j = i + 1; j < N; j++) if (bitmaps[j]) return j;
    return -1;
  };

  // Der Rest der Bildfolge (mobil ~4,5 MB, Desktop ~9 MB) startet gleich nach dem Laden der Seite oder sobald jemand
  // scrollt oder tippt: so konkurrieren die Bilder nicht mit dem ersten Seitenaufbau, stehen aber früh bereit
  const afterLoad = () =>
    new Promise<void>((resolve) => {
      const inputs = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
      const go = () => {
        inputs.forEach((t) => window.removeEventListener(t, go));
        resolve();
      };
      inputs.forEach((t) => window.addEventListener(t, go, { passive: true }));
      if (document.readyState === 'complete') setTimeout(go, 50);
      else window.addEventListener('load', () => setTimeout(go, 50), { once: true });
    });

  function draw() {
    const i = Math.floor(pos);
    const a = nearest(i);
    if (a < 0) return;
    const img = bitmaps[a]!;
    if (canvas.width !== img.width) {
      canvas.width = img.width;
      canvas.height = img.height;
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0);
    const next = bitmaps[i + 1];
    if (a === i && next && pos > i) {
      ctx.globalAlpha = pos - i;
      ctx.drawImage(next, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
    canvas.classList.add('is-ready');
  }

  return {
    seek(p) {
      const np = Math.min(1, Math.max(0, p)) * END;
      if (np !== pos) dir = np > pos ? 1 : -1;
      pos = np;
      sync();
      draw();
    },
    ready(p) {
      const i = Math.floor(Math.min(1, Math.max(0, p)) * END);
      return !!bitmaps[i] && (i >= END || !!bitmaps[i + 1]);
    },
    async load() {
      await loadOne(0);
      draw();
      await afterLoad();
      const queue = order.filter((i) => !blobs[i]);
      const worker = async () => {
        while (queue.length) await loadOne(queue.shift()!);
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    },
  };
}
