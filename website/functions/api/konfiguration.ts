// Cloudflare Pages Function: POST /api/konfiguration
// Prüft die Auswahl gegen den Katalog, speichert die Anfrage (D1, optional), erzeugt das PDF (pdf-lib),
// legt es optional in R2 ab und verschickt zwei E-Mails über Resend: an den Kunden (PDF) und an Poolbau Koch.
// Einrichtung: docs/konfigurator-cloudflare.md
import katalog from '../../src/konfigurator/katalog.json';
import { type Config, type Contact, type Katalog, summarize, missing, validContact } from '../../src/konfigurator/summary';
import { buildPdf } from '../../src/konfigurator/pdf';

type Env = {
  DB?: D1Database;             // D1-Datenbank (Tabelle anfragen, siehe docs/konfigurator-schema.sql)
  PDFS?: R2Bucket;             // R2-Bucket für PDFs (optional)
  RESEND_API_KEY?: string;     // Secret
  MAIL_FROM?: string;          // z. B. "Poolbau Koch <konfigurator@poolbau-kochgmbh.de>" (Domain bei Resend verifiziert)
  MAIL_TEAM?: string;          // z. B. "info@poolbau-kochgmbh.de"
};

const K = katalog as unknown as Katalog;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const esc = (s: string) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const clip = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n);
const b64 = (bytes: Uint8Array) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s); };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { config?: Config; contact?: Contact };
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Ungültige Anfrage.' }, 400); }
  const c = body.config as Config; const raw = body.contact as Contact;
  if (!c || !raw) return json({ ok: false, error: 'Ungültige Anfrage.' }, 400);
  if (raw.website) return json({ ok: true, ref: 'PK-OK' }); // Honeypot: Bots bekommen „ok“, es passiert nichts

  const ct: Contact = {
    name: clip(raw.name, 120), email: clip(raw.email, 160), phone: clip(raw.phone, 40), street: clip(raw.street, 160),
    zip: clip(raw.zip, 5), city: clip(raw.city, 80), slot: clip(raw.slot, 20), wishes: clip(raw.wishes, 2000),
    consult: !!raw.consult, privacy: !!raw.privacy,
  };
  const errs = validContact(ct);
  if (Object.keys(errs).length) return json({ ok: false, error: 'Bitte prüfen Sie Ihre Angaben.', fields: errs }, 422);
  const miss = missing(K, c);
  if (miss.length) return json({ ok: false, error: `Konfiguration unvollständig: ${miss.join(', ')}` }, 422);

  const rows = summarize(K, c);
  const model = K.models.find((m) => m.id === c.model)!;
  const man = K.manufacturers.find((m) => m.id === c.man)!;
  const now = new Date();
  const ref = `PK-${now.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const date = now.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });

  // Bilder vom eigenen Auftritt holen (statische Dateien der Seite)
  const origin = new URL(request.url).origin;
  const get = (p: string) => fetch(origin + p).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
  const [photo, logo] = await Promise.all([get(`/konfig/pdf/${model.id}.jpg`), get('/brand/logo-temp.png')]);
  const pdf = await buildPdf({ ref, date, modelName: model.name, manName: man.name, rows, contact: ct, photo, logo });

  // Speichern (optional)
  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO anfragen (ref, erstellt, name, email, telefon, strasse, plz, ort, zeitfenster, wuensche, beratung, konfiguration, zusammenfassung)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(ref, now.toISOString(), ct.name, ct.email, ct.phone, ct.street, ct.zip, ct.city, ct.slot, ct.wishes, ct.consult ? 1 : 0,
      JSON.stringify(c), JSON.stringify(rows)).run();
  }
  if (env.PDFS) await env.PDFS.put(`${ref}.pdf`, pdf, { httpMetadata: { contentType: 'application/pdf' } });

  // E-Mails
  if (env.RESEND_API_KEY && env.MAIL_FROM) {
    const table = rows.map((r) => `<tr><td style="padding:6px 16px 6px 0;color:#5e5d59">${esc(r.k)}</td><td style="padding:6px 0"><b>${esc(r.v)}</b>${r.m ? `<br><span style="color:#5e5d59;font-size:13px">${esc(r.m)}</span>` : ''}</td></tr>`).join('');
    const attach = [{ filename: `Pool-Konfiguration-${ref}.pdf`, content: b64(pdf) }];
    const send = (payload: Record<string, unknown>) => fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const kunde = `<div style="font-family:Arial,sans-serif;color:#151515;max-width:560px">
      <p>Hallo ${esc(ct.name)},</p>
      <p>vielen Dank für Ihre Konfiguration im Pool-Studio von Poolbau Koch. Im Anhang finden Sie Ihre Auswahl als PDF.</p>
      <table style="border-collapse:collapse;font-size:14px">${table}</table>
      <p>${ct.consult ? `Wir melden uns${ct.slot ? ` im Zeitfenster ${esc(ct.slot)} Uhr` : ''} bei Ihnen zur kostenlosen Beratung.` : 'Sie möchten beraten werden? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: 0177 450 95 00.'}</p>
      <p>Ihre Referenz: <b>${ref}</b></p>
      <p style="color:#5e5d59;font-size:12px">Planungsgrundlage, kein verbindliches Angebot.<br>Poolbau Koch · Garten- und Landschaftsbau Koch GmbH · Mozartstraße 33, 59227 Ahlen</p></div>`;
    const team = `<div style="font-family:Arial,sans-serif;color:#151515">
      <h2 style="font-weight:400">Neue Konfiguration ${ref}${ct.consult ? ' (Beratung gewünscht)' : ''}</h2>
      <p><b>${esc(ct.name)}</b><br>${esc(ct.email)}${ct.phone ? `<br>${esc(ct.phone)}` : ''}${ct.street ? `<br>${esc(ct.street)}` : ''}${ct.zip ? `<br>${esc(ct.zip)} ${esc(ct.city)}` : ''}${ct.slot ? `<br>Rückruf: ${esc(ct.slot)} Uhr` : ''}</p>
      ${ct.wishes ? `<p><b>Wünsche:</b><br>${esc(ct.wishes).replace(/\n/g, '<br>')}</p>` : ''}
      <table style="border-collapse:collapse;font-size:14px">${table}</table></div>`;
    const results = await Promise.all([
      send({ from: env.MAIL_FROM, to: [ct.email], reply_to: env.MAIL_TEAM, subject: `Ihre Pool-Konfiguration ${ref} | Poolbau Koch`, html: kunde, attachments: attach }),
      env.MAIL_TEAM ? send({ from: env.MAIL_FROM, to: [env.MAIL_TEAM], reply_to: ct.email, subject: `Konfigurator: ${ct.name}, ${model.name}${ct.consult ? ' (Beratung)' : ''}`, html: team, attachments: attach }) : Promise.resolve(null),
    ]);
    if (results[0] && !results[0].ok) return json({ ok: false, error: 'Die E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut.' }, 502);
  }
  return json({ ok: true, ref });
};
