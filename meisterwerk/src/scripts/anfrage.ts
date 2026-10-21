import { gsap, lenis } from './motion';

/** Gemeinsame Hilfen der Projektanfrage-Varianten (Fokus und Satz): Bilder, Abschluss, Wortmaske, E-Mail, Scrollen. */

export const MAX_FILES = 12;
export const MAX_BYTES = 60 * 1024 * 1024;

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Bildauswahl mit Vorschau und Grenzen (12 Bilder, 60 MB). Ablegen auf `zone` und Auswählen über `input`. */
export function initFiles(o: {
  input: HTMLInputElement;
  zone: HTMLElement;
  thumbs: HTMLElement;
  msg: HTMLElement;
  onChange?: (count: number) => void;
}) {
  const reduced = reducedMotion();
  let files: File[] = [];

  const sync = () => {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    o.input.files = dt.files;
    o.thumbs.querySelectorAll('img').forEach((i) => URL.revokeObjectURL(i.src));
    o.thumbs.innerHTML = '';
    files.forEach((f, i) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.alt = f.name;
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.setAttribute('aria-label', `${f.name} entfernen`);
      rm.textContent = '×';
      rm.addEventListener('click', () => {
        files.splice(i, 1);
        sync();
      });
      li.append(img, rm);
      o.thumbs.append(li);
      if (!reduced) gsap.fromTo(li, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'css' });
    });
    o.onChange?.(files.length);
  };

  const add = (list: FileList | File[]) => {
    const next = [...files, ...[...list].filter((f) => f.type.startsWith('image/'))];
    if (next.length > MAX_FILES || next.reduce((s, f) => s + f.size, 0) > MAX_BYTES) {
      o.msg.textContent = 'Bitte wählen Sie höchstens 12 Bilder mit zusammen höchstens 60 MB.';
      o.msg.hidden = false;
      o.input.value = '';
      return;
    }
    o.msg.hidden = true;
    files = next;
    sync();
  };

  o.input.addEventListener('change', () => add(o.input.files ?? []));
  ['dragenter', 'dragover'].forEach((t) =>
    o.zone.addEventListener(t, (e) => {
      e.preventDefault();
      o.zone.classList.add('is-over');
    }),
  );
  ['dragleave', 'drop'].forEach((t) =>
    o.zone.addEventListener(t, (e) => {
      e.preventDefault();
      o.zone.classList.remove('is-over');
    }),
  );
  o.zone.addEventListener('drop', (e) => {
    const dt = (e as DragEvent).dataTransfer;
    if (dt?.files) add(dt.files);
  });

  return { count: () => files.length };
}

/** `mailto:`-Link mit allen Angaben (solange der Versand nicht angebunden ist). */
export function mailto(email: string, subject: string, rows: { label: string; value: string }[]) {
  const body = rows.map((r) => `${r.label}: ${r.value}`).join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Abschluss: Kreis und Haken zeichnen sich, danach steigen Text und Links auf. `done` enthält `[data-done-circle]`, `[data-done-check]`. */
export function playDone(done: HTMLElement) {
  done.focus({ preventScroll: true });
  if (reducedMotion()) return;
  const circle = done.querySelector<SVGGeometryElement>('[data-done-circle]')!;
  const check = done.querySelector<SVGGeometryElement>('[data-done-check]')!;
  const cl = circle.getTotalLength();
  const kl = check.getTotalLength();
  gsap.set(circle, { strokeDasharray: cl, strokeDashoffset: cl });
  gsap.set(check, { strokeDasharray: kl, strokeDashoffset: kl });
  gsap
    .timeline()
    .to(circle, { strokeDashoffset: 0, duration: 0.9, ease: 'grow' })
    .to(check, { strokeDashoffset: 0, duration: 0.6, ease: 'css' }, '-=0.25')
    .fromTo(
      done.querySelectorAll('[data-done-in]'),
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'css', stagger: 0.1, clearProps: 'opacity,visibility,transform' },
      '-=0.5',
    );
}

/** Zerlegt einen Text in Wörter, die aus einer Maske hochfahren (wie die Überschrift der Qualifikationen). Gibt die inneren Spans zurück. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent?.trim() ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const inner: HTMLElement[] = [];
  text.split(/\s+/).forEach((w, i, all) => {
    const outer = document.createElement('span');
    outer.setAttribute('aria-hidden', 'true');
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:0.04em 0.06em 0.16em 0;margin:-0.04em -0.06em -0.16em 0';
    const word = document.createElement('span');
    word.style.display = 'inline-block';
    word.textContent = w;
    outer.append(word);
    el.append(outer);
    if (i < all.length - 1) el.append(' ');
    inner.push(word);
  });
  return inner;
}

/** Hält den Abschnitt beim Schrittwechsel im Bild. */
export function keepInView(el: HTMLElement, offset = 110) {
  const top = el.getBoundingClientRect().top;
  if (top >= 0 && top <= window.innerHeight * 0.5) return;
  const y = top + window.scrollY - offset;
  if (lenis) lenis.scrollTo(y, { duration: 0.9 });
  else window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
}
