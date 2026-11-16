/**
 * Versand der Formulare an die Cloudflare Pages Function `/api/anfrage` (functions/api/anfrage.ts).
 * - Spam-Schutz: Cloudflare Turnstile (unsichtbar, fragt nur bei Verdacht nach), Site-Key aus `PUBLIC_TURNSTILE_SITE_KEY`.
 * - Bilder werden vor dem Senden verkleinert (längste Seite 2000 px, JPEG), damit 12 Fotos sicher als Anhang passen.
 * - Testmodus: Ohne Site-Key (Vorschau auf GitHub Pages, dort gibt es keine Functions) wird nichts gesendet,
 *   das Formular meldet Erfolg mit dem Hinweis `test`.
 */
export type Zeile = { label: string; value: string };
export type Ergebnis = { ok: boolean; test?: boolean; ref?: string; error?: string };

const SITE_KEY = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? '';
const ENDPOINT = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}api/anfrage`;
export const testModus = !SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let laden: Promise<Turnstile> | null = null;
function turnstileLaden(): Promise<Turnstile> {
  laden ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    s.onerror = () => {
      laden = null;
      reject(new Error('turnstile'));
    };
    document.head.append(s);
  });
  return laden;
}

/** Skript schon beim ersten Kontakt mit dem Formular laden, damit das Senden ohne Wartezeit klappt. */
export function vorbereiten(form: HTMLFormElement) {
  if (testModus) return;
  const los = () => turnstileLaden().catch(() => {});
  form.addEventListener('focusin', los, { once: true });
  form.addEventListener('pointerenter', los, { once: true });
}

const widgets = new WeakMap<HTMLFormElement, { id: string; warte?: (t: string) => void; fehler?: () => void }>();
async function token(form: HTMLFormElement): Promise<string> {
  const ts = await turnstileLaden();
  let w = widgets.get(form);
  if (!w) {
    const box = document.createElement('div');
    box.dataset.turnstile = '';
    box.style.cssText = 'margin-top:12px';
    (form.querySelector('[data-turnstile-slot]') ?? form).append(box);
    const eintrag: { id: string; warte?: (t: string) => void; fehler?: () => void } = { id: '' };
    eintrag.id = ts.render(box, {
      sitekey: SITE_KEY,
      language: 'de',
      appearance: 'interaction-only',
      execution: 'execute',
      callback: (t: string) => eintrag.warte?.(t),
      'error-callback': () => eintrag.fehler?.(),
      'expired-callback': () => ts.reset(eintrag.id),
    });
    widgets.set(form, eintrag);
    w = eintrag;
  }
  const ziel = w;
  return new Promise((resolve, reject) => {
    ziel.warte = resolve;
    ziel.fehler = () => reject(new Error('turnstile'));
    ts.execute(ziel.id);
  });
}

/** Bild verkleinern (längste Seite höchstens 2000 px, JPEG 0,82). Kleine Bilder und GIF/SVG bleiben unverändert. */
async function verkleinern(f: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) || f.size < 600 * 1024) return f;
  try {
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.82));
    if (!blob || blob.size >= f.size) return f;
    return new File([blob], f.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return f;
  }
}

export async function senden(o: {
  form: HTMLFormElement;
  art: 'projekt' | 'kurz';
  zeilen: Zeile[];
  name: string;
  email?: string;
  telefon?: string;
  bilder?: File[];
}): Promise<Ergebnis> {
  const falle = o.form.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? '';
  if (testModus) {
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true, test: true };
  }
  const fd = new FormData();
  fd.append('art', o.art);
  fd.append('seite', location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/');
  fd.append('name', o.name);
  fd.append('email', o.email ?? '');
  fd.append('telefon', o.telefon ?? '');
  fd.append('daten', JSON.stringify(o.zeilen.filter((z) => z.value)));
  fd.append('website', falle);
  try {
    fd.append('cf-turnstile-response', await token(o.form));
  } catch {
    return { ok: false, error: 'Die Sicherheitsprüfung konnte nicht geladen werden. Bitte laden Sie die Seite neu oder rufen Sie uns an.' };
  }
  for (const f of await Promise.all((o.bilder ?? []).map(verkleinern))) fd.append('bilder', f, f.name);
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', body: fd });
    const j = (await r.json().catch(() => ({}))) as Ergebnis;
    if (r.ok && j.ok) return { ok: true, ref: j.ref };
    return { ok: false, error: j.error || 'Das Senden hat nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an.' };
  } catch {
    return { ok: false, error: 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung und senden Sie erneut.' };
  } finally {
    const w = widgets.get(o.form);
    if (w && window.turnstile) window.turnstile.reset(w.id);
  }
}

/** Zeilen aus einem einfachen Formular: Beschriftung aus dem Label, Wert aus dem Feld (Mehrfachauswahl zusammengefasst). */
export function zeilenAus(form: HTMLFormElement, labels: Record<string, string>): Zeile[] {
  const fd = new FormData(form);
  return Object.entries(labels).map(([name, label]) => ({
    label,
    value: fd
      .getAll(name)
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean)
      .join(', '),
  }));
}
