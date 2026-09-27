// PDF „Ihre Pool-Konfiguration“ – läuft im Browser (Testmodus) und in der Cloudflare-Funktion (Versand).
// pdf-lib mit Standardschrift Helvetica (WinAnsi: Umlaute, €, –, × sind enthalten).
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Row, Contact } from './summary';

export type PdfInput = {
  ref: string; date: string; modelName: string; manName: string; rows: Row[];
  contact?: Pick<Contact, 'name' | 'email' | 'phone' | 'zip' | 'city' | 'slot' | 'consult' | 'wishes'>;
  photo?: Uint8Array | ArrayBuffer | null; logo?: Uint8Array | ArrayBuffer | null;
};

const INK = rgb(0.082, 0.082, 0.082);
const MUTED = rgb(0.37, 0.365, 0.35);
const NAVY = rgb(0, 0.29, 0.5);
const TEAL = rgb(0.125, 0.686, 0.678);
const LINE = rgb(0.88, 0.88, 0.86);
const BG = rgb(0.937, 0.937, 0.937);

// Nur Zeichen, die WinAnsi kann
const clean = (s: string) => (s || '').replace(/[‐‑‒—]/g, '–').replace(/[“”„]/g, '"').replace(/[‘’‚]/g, "'").replace(/[^\x20-\x7E -ÿ€–×•…]/g, '');

export async function buildPdf(inp: PdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Pool-Konfiguration ${inp.ref}`); doc.setAuthor('Poolbau Koch'); doc.setCreator('Poolbau Koch Pool-Studio');
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width: W, height: H } = page.getSize();
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const M = 44;
  const text = (s: string, x: number, y: number, size: number, font = reg, color = INK) => page.drawText(clean(s), { x, y, size, font, color });
  const wrap = (s: string, size: number, maxW: number, font = reg) => {
    const words = clean(s).split(/\s+/); const lines: string[] = []; let cur = '';
    for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (font.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  };

  // Kopf
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 1, 1) });
  let y = H - M;
  if (inp.logo) {
    try { const lg = await doc.embedPng(inp.logo); const w = 150, h = (lg.height / lg.width) * w; page.drawImage(lg, { x: M, y: y - h + 6, width: w, height: h }); } catch {}
  } else text('POOLBAU KOCH', M, y - 10, 16, bold, NAVY);
  const rt = `Pool-Konfiguration · ${inp.ref}`; text(rt, W - M - reg.widthOfTextAtSize(clean(rt), 9), y - 4, 9, reg, MUTED);
  text(inp.date, W - M - reg.widthOfTextAtSize(clean(inp.date), 9), y - 17, 9, reg, MUTED);
  y -= 58;

  // Titel
  page.drawCircle({ x: M + 2.5, y: y + 3, size: 2.5, color: TEAL });
  text('IHRE POOL-KONFIGURATION', M + 10, y, 8.5, bold, INK);
  y -= 34;
  text(`${inp.modelName}`, M, y, 28, reg, INK);
  y -= 18;
  text(`von ${inp.manName}`, M, y, 11, reg, MUTED);
  y -= 20;

  // Foto (vorab auf 1000 × 440 zugeschnitten)
  if (inp.photo) {
    try {
      const ph = await doc.embedJpg(inp.photo);
      const w = W - 2 * M, h = (ph.height / ph.width) * w;
      page.drawImage(ph, { x: M, y: y - h, width: w, height: h });
      y -= h + 26;
    } catch { y -= 6; }
  }

  // Tabelle
  const colK = M, colV = M + 130, maxV = W - M - colV;
  text('AUSWAHL', colK, y, 8, bold, MUTED); y -= 12;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: LINE }); y -= 16;
  for (const r of inp.rows) {
    text(r.k, colK, y, 9.5, reg, MUTED);
    text(r.v, colV, y, 10.5, bold, INK);
    let yy = y;
    if (r.m) for (const ln of wrap(r.m, 9, maxV)) { yy -= 13; text(ln, colV, yy, 9, reg, MUTED); }
    y = yy - 12;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: W - M, y: y + 4 }, thickness: 0.5, color: LINE });
    y -= 10;
  }

  // Kontakt / nächste Schritte
  y -= 8;
  const boxH = 92;
  page.drawRectangle({ x: M, y: y - boxH, width: W - 2 * M, height: boxH, color: BG });
  let by = y - 20;
  text('SO GEHT ES WEITER', M + 16, by, 8, bold, NAVY); by -= 16;
  const c = inp.contact;
  const next = c?.consult
    ? `Wir prüfen Ihre Auswahl und rufen Sie${c.slot ? ` im gewünschten Zeitfenster ${c.slot} Uhr` : ''} an – für eine persönliche, kostenlose Beratung vor Ort.`
    : 'Sie möchten beraten werden? Rufen Sie uns an oder antworten Sie einfach auf diese E-Mail – die Beratung vor Ort ist kostenlos.';
  for (const ln of wrap(next, 10, W - 2 * M - 32)) { text(ln, M + 16, by, 10); by -= 14; }
  if (c) { by -= 4; text(`Für: ${c.name}${c.email ? ` · ${c.email}` : ''}${c.phone ? ` · ${c.phone}` : ''}${c.zip ? ` · ${c.zip} ${c.city || ''}` : ''}`, M + 16, by, 8.5, reg, MUTED); }

  // Fuß
  const f1 = 'Planungsgrundlage – kein verbindliches Angebot. Preise, Maße und Ausführung laut Herstellerkatalog 2026, Änderungen vorbehalten.';
  const f2 = 'Poolbau Koch · Garten- und Landschaftsbau Koch GmbH · Mozartstraße 33, 59227 Ahlen · 0177 450 95 00 · info@poolbau-kochgmbh.de';
  page.drawLine({ start: { x: M, y: 58 }, end: { x: W - M, y: 58 }, thickness: 0.5, color: LINE });
  let fy = 44; for (const ln of wrap(f1, 7.5, W - 2 * M)) { text(ln, M, fy, 7.5, reg, MUTED); fy -= 10; }
  text(f2, M, fy - 2, 7.5, reg, MUTED);
  return doc.save();
}
