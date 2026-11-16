// Cloudflare Pages Function: POST /api/anfrage
// Nimmt die Formulare der Website an (Projektanfrage und kurze Nachricht), prüft Turnstile und Honeypot, speichert die Anfrage
// (D1, optional), legt Bilder ab (R2, optional) und verschickt über Resend eine Mail an den Betrieb (Bilder im Anhang).
// Keine Bestätigung an den Kunden. Einrichtung: docs/cloudflare-umzug-meisterwerk.md (Phase 3)
import { mailBetrieb, type Anfrage, type Art, type Zeile } from '../../src/lib/anfrage-mail';

type Env = {
  DB?: D1Database;              // Tabelle anfragen (functions/schema.sql)
  UPLOADS?: R2Bucket;           // Bilder aus dem Formular
  RESEND_API_KEY?: string;      // Secret
  TURNSTILE_SECRET?: string;    // Secret
  MAIL_FROM?: string;           // "Meisterwerk Malermanufaktur <formular@meisterwerk-lb.de>" (Domain bei Resend verifiziert)
  MAIL_TEAM?: string;           // info@meisterwerk-lb.de
};

const MAX_BILDER = 12;
const MAX_BYTES_ANHANG = 25 * 1024 * 1024; // darüber nur Ablage in R2, Mail ohne Anhang
const MAX_BYTES_GESAMT = 60 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const clip = (v: unknown, n: number) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, n);
const b64 = (bytes: Uint8Array) => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const ablageName = (ref: string, i: number, name: string) =>
  `${ref}/${String(i + 1).padStart(2, '0')}-${name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').slice(-60) || 'bild.jpg'}`;

async function turnstileOk(secret: string, token: string, ip: string | null) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body }).catch(() => null);
  if (!r || !r.ok) return false;
  const j = (await r.json().catch(() => ({}))) as { success?: boolean };
  return j.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Ungültige Anfrage.' }, 400);
  }

  // Honeypot: Bots füllen das versteckte Feld aus und bekommen „ok“, es passiert nichts
  if (clip(form.get('website'), 200)) return json({ ok: true, ref: 'OK' });

  // Spam-Schutz (Turnstile). Ohne Secret (lokale Tests) wird nicht geprüft.
  if (env.TURNSTILE_SECRET) {
    const ok = await turnstileOk(env.TURNSTILE_SECRET, clip(form.get('cf-turnstile-response'), 2048), request.headers.get('CF-Connecting-IP'));
    if (!ok) return json({ ok: false, error: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu und senden Sie erneut.' }, 403);
  }

  const art: Art = form.get('art') === 'projekt' ? 'projekt' : 'kurz';
  const name = clip(form.get('name'), 120);
  const email = clip(form.get('email'), 160).toLowerCase();
  const telefon = clip(form.get('telefon'), 40);
  const seite = clip(form.get('seite'), 200).replace(/[^\w/.-]/g, '') || '/';
  let zeilen: Zeile[] = [];
  try {
    const roh = JSON.parse(String(form.get('daten') ?? '[]'));
    if (Array.isArray(roh)) zeilen = roh.slice(0, 40).map((z) => ({ label: clip(z?.label, 80), value: clip(z?.value, 3000) })).filter((z) => z.label && z.value);
  } catch {
    zeilen = [];
  }

  const fehler: Record<string, string> = {};
  if (!name) fehler.name = 'Bitte geben Sie Ihren Namen an.';
  if (email && !EMAIL.test(email)) fehler.email = 'Bitte prüfen Sie Ihre E-Mail-Adresse.';
  if (!email && !telefon) fehler.kontakt = 'Bitte geben Sie eine E-Mail-Adresse oder Telefonnummer an.';
  if (art === 'projekt' && !email) fehler.email = 'Bitte geben Sie Ihre E-Mail-Adresse an.';
  if (!zeilen.length) fehler.daten = 'Bitte füllen Sie das Formular aus.';
  if (Object.keys(fehler).length) return json({ ok: false, error: Object.values(fehler)[0], fields: fehler }, 422);

  // Bilder
  const bilder = form.getAll('bilder').filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f && (f as File).size > 0);
  if (bilder.length > MAX_BILDER) return json({ ok: false, error: `Bitte senden Sie höchstens ${MAX_BILDER} Bilder.` }, 422);
  if (bilder.some((f) => !f.type.startsWith('image/'))) return json({ ok: false, error: 'Bitte senden Sie nur Bilder.' }, 422);
  const summe = bilder.reduce((s, f) => s + f.size, 0);
  if (summe > MAX_BYTES_GESAMT) return json({ ok: false, error: 'Die Bilder sind zusammen zu groß (höchstens 60 MB).' }, 413);

  const datum = new Date();
  const ref = `MW-${datum.toISOString().slice(2, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const daten = await Promise.all(bilder.map(async (f) => new Uint8Array(await f.arrayBuffer())));

  if (env.UPLOADS && bilder.length) {
    await Promise.all(bilder.map((f, i) => env.UPLOADS!.put(ablageName(ref, i, f.name), daten[i], { httpMetadata: { contentType: f.type } })));
  }
  if (env.DB) {
    await env.DB.prepare(
      'INSERT INTO anfragen (ref, erstellt, art, seite, name, email, telefon, daten, bilder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(ref, datum.toISOString(), art, seite, name, email, telefon, JSON.stringify(zeilen), bilder.length)
      .run();
  }

  const anhaengen = bilder.length > 0 && summe <= MAX_BYTES_ANHANG;
  const anfrage: Anfrage = { art, ref, datum, seite, name, email, telefon, zeilen, bilder: bilder.length, bilderAngehaengt: anhaengen };

  if (env.RESEND_API_KEY && env.MAIL_FROM && env.MAIL_TEAM) {
    const logo = `${new URL(request.url).origin}/mail/logo.png`;
    const send = (payload: Record<string, unknown>) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

    const intern = mailBetrieb(anfrage, logo);
    const r1 = await send({
      from: env.MAIL_FROM,
      to: [env.MAIL_TEAM],
      ...(email ? { reply_to: email } : {}),
      subject: intern.subject,
      html: intern.html,
      text: intern.text,
      ...(anhaengen ? { attachments: bilder.map((f, i) => ({ filename: ablageName('', i, f.name).slice(1), content: b64(daten[i]) })) } : {}),
    });
    if (!r1 || !r1.ok) {
      return json({ ok: false, error: `Ihre Anfrage konnte gerade nicht versendet werden. Bitte rufen Sie uns an oder versuchen Sie es später erneut.` }, 502);
    }
    // Keine automatische Bestätigung an den Kunden (Nutzerwunsch 16.11.2026), der Betrieb antwortet direkt
  }
  return json({ ok: true, ref });
};
