/**
 * E-Mails der Formulare im Design der Website, Werte gemessen am 17.11.2026 (Leistungen-Seite):
 * - Überschriften Urbanist Medium mit leicht engem Zeichenabstand, Fließtext DM Sans 16 px / 1,6 in Schwarz 70 %
 * - Buttons wie `ui/Button.astro`: Pille, Urbanist 13 px halbfett, Großbuchstaben, 0,5 px Abstand, 48 px hoch
 * - Kein Gold außer im Logo, Angaben in hellgrauen Karten (16 px Rundung), Mail-Karte weiß mit 24 px Rundung
 * Die Schriften kommen von der eigenen Domain (`/mail/fonts/`, variable Fonts). Apple Mail und iOS zeigen sie,
 * Gmail und Outlook nehmen Helvetica bzw. Arial. Tabellen-Layout mit Inline-Stilen, auf dem Handy kleinere Ränder,
 * Angaben untereinander und Buttons in voller Breite.
 *
 * Drei Arten (`Art`), je nach Formular:
 * - `schnell`  Schnellkontakt: Kurzformular im Menü und Seite /schnellkontakt/
 * - `kontakt`  Kontaktanfrage: Kontaktformular mit Leistungsfeldern (z. B. Exklusive Kontakt)
 * - `projekt`  Projektanfrage: Assistent mit 9 Fragen auf /kontakt/
 *
 * `mailBetrieb` geht an info@ (nur HTML), `mailKunde` ist die Eingangsbestätigung an den Kunden (HTML und Textfassung).
 * Reine Funktionen ohne Abhängigkeit von Cloudflare. Benutzt von: functions/api/anfrage.ts
 */
import { site } from '../data/site';

export type Art = 'projekt' | 'kontakt' | 'schnell';
export interface Zeile {
  label: string;
  value: string;
}
export interface Anfrage {
  art: Art;
  ref: string;
  /** Zeitpunkt des Eingangs (Anzeige in deutscher Zeit) */
  datum: Date;
  /** Seite, auf der das Formular abgeschickt wurde (Pfad) */
  seite: string;
  name: string;
  email: string;
  telefon: string;
  zeilen: Zeile[];
  /** Zahl der hochgeladenen Bilder */
  bilder: number;
  /** Bilder hängen an der Mail an den Betrieb (sonst nur in der Ablage) */
  bilderAngehaengt: boolean;
}
export interface Mail {
  subject: string;
  html: string;
  /** Nur bei der Kundenmail (Textfassung für Programme ohne HTML) */
  text?: string;
}

/** Online-Terminkalender von Meisterwerk (Ausstellung 30 Min., Vor-Ort-Termin 60 Min.) */
export const CAL = 'https://cal.com/meisterwerk';

const C = {
  bg: '#f1f1f1', // Token fog
  card: '#ffffff',
  soft: '#f7f7f7', // Token soft
  ink: '#090402', // Token ink
  text: '#4d4a49', // Schwarz 70 % auf Weiß (Fließtext der Seite)
  muted: '#7a7673',
  line: '#e6e4e1',
};
const HEAD = "'Urbanist','Helvetica Neue',Helvetica,Arial,sans-serif";
const BODY = "'DM Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

const ARTNAME: Record<Art, string> = { schnell: 'Schnellkontakt', kontakt: 'Kontaktanfrage', projekt: 'Projektanfrage' };

export const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const nl = (s: string) => esc(s).replace(/\r?\n/g, '<br>');
const exklusive = (a: Anfrage) => a.seite.startsWith('/meisterwerk-exklusive/');
const marke = (a: Anfrage) => (exklusive(a) ? 'Meisterwerke Exklusive' : 'Meisterwerk Malermanufaktur');
const wann = (d: Date) =>
  d.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr';
const tel = site.phoneHref.startsWith('+') ? site.phoneHref : `+49${site.phoneHref.replace(/^0/, '')}`;
const telLink = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`;
const maps = (adresse: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`;
/** Domain der Website aus der Logo-Adresse (für Schriften) */
const origin = (logo: string) => {
  try {
    return new URL(logo).origin;
  } catch {
    return '';
  }
};

const KONTAKT_LABELS = /^(Name|E-Mail|Rufnummer|Telefon|Telefon oder E-Mail|Adresse|Adresse Bauvorhaben)$/i;
const NACHRICHT_LABELS = /^Nachricht$/i;
const wert = (a: Anfrage, re: RegExp) => a.zeilen.find((z) => re.test(z.label))?.value ?? '';

/* ---------- Bausteine ---------- */

function rahmen(o: { titel: string; vorschau: string; logo: string; inhalt: string; fuss: string }) {
  const base = origin(o.logo);
  return `<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(o.titel)}</title>
<style>
  @font-face{font-family:'Urbanist';font-style:normal;font-weight:100 900;src:url('${base}/mail/fonts/urbanist.woff2') format('woff2');}
  @font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;src:url('${base}/mail/fonts/dm-sans.woff2') format('woff2');}
  body{margin:0;padding:0;-webkit-text-size-adjust:100%;}
  a{color:${C.ink};}
  @media only screen and (max-width:620px){
    .wrap{padding:10px 8px!important;}
    .px{padding-left:24px!important;padding-right:24px!important;}
    .h1{font-size:28px!important;line-height:1.15!important;}
    .h2{font-size:20px!important;}
    .btn{display:block!important;text-align:center!important;margin:0 0 10px 0!important;}
    .col{display:block!important;width:100%!important;padding-right:0!important;}
    .colwert{padding-top:2px!important;border-top:0!important;}
    .collabel{padding-bottom:0!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};font-size:1px;line-height:1px;">${esc(o.vorschau)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
<tr><td class="wrap" align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${C.card};border-radius:24px;">
<tr><td class="px" style="padding:40px 44px 0 44px;">
<img src="${esc(o.logo)}" alt="${esc(site.name)}" width="170" style="display:block;width:170px;max-width:170px;height:auto;border:0;outline:none;">
</td></tr>
<tr><td class="px" style="padding:12px 44px 44px 44px;">${o.inhalt}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td class="px" style="padding:24px 44px 8px 44px;font-family:${BODY};font-size:13px;line-height:1.6;color:${C.muted};">${o.fuss}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Große Überschrift der Mail (wie H1/H2 der Seite: Urbanist Medium, eng) */
const h1 = (t: string) =>
  `<h1 class="h1" style="margin:32px 0 14px 0;font-family:${HEAD};font-size:34px;line-height:1.12;font-weight:500;letter-spacing:-0.9px;color:${C.ink};">${esc(t)}</h1>`;
/** Abschnittsüberschrift (wie H3 der Seite: Urbanist, 25 px am Desktop, hier etwas kleiner) */
const h2 = (t: string) =>
  `<h2 class="h2" style="margin:36px 0 14px 0;font-family:${HEAD};font-size:22px;line-height:1.25;font-weight:500;letter-spacing:-0.3px;color:${C.ink};">${esc(t)}</h2>`;
/** Fließtext (DM Sans 16 px / 1,6) */
const p = (html: string, o: { farbe?: string; abstand?: string } = {}) =>
  `<p style="margin:${o.abstand ?? '0 0 16px 0'};font-family:${BODY};font-size:16px;line-height:1.6;color:${o.farbe ?? C.text};">${html}</p>`;

/** Hellgraue Karte (16 px Rundung) */
const karte = (inhalt: string, pad = '6px 24px') =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border-radius:16px;"><tr><td style="padding:${pad};">${inhalt}</td></tr></table>`;

/** Angaben als Zeilen: Bezeichnung links, Wert rechts, auf dem Handy untereinander */
const felder = (zeilen: Zeile[]) =>
  karte(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${zeilen
      .map(
        (z, i) =>
          `<tr><td class="col collabel" valign="top" width="38%" style="padding:16px 16px 16px 0;${i ? `border-top:1px solid ${C.line};` : ''}font-family:${BODY};font-size:14px;line-height:1.5;color:${C.muted};">${esc(z.label)}</td><td class="col colwert" valign="top" style="padding:16px 0;${i ? `border-top:1px solid ${C.line};` : ''}font-family:${BODY};font-size:16px;line-height:1.5;color:${C.ink};font-weight:500;">${nl(z.value)}</td></tr>`,
      )
      .join('')}</table>`,
  );

/** Schritte als ruhige Liste in der Karte: Trennlinien statt Punkte, Schritt-Text in Schwarz */
const schritte = (items: string[]) =>
  karte(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
      .map(
        (t, i) =>
          `<tr><td style="padding:15px 0;${i ? `border-top:1px solid ${C.line};` : ''}font-family:${BODY};font-size:16px;line-height:1.5;color:${C.ink};">${t}</td></tr>`,
      )
      .join('')}</table>`,
  );

/** Button wie auf der Website: Pille, Urbanist 13 px halbfett, Großbuchstaben. Dunkel = Hauptweg, hell = zweiter Weg */
const knopf = (href: string, text: string, dunkel = true) =>
  `<a class="btn" href="${esc(href)}" style="display:inline-block;margin:0 8px 10px 0;padding:17px 40px;border-radius:999px;font-family:${HEAD};font-size:13px;line-height:14px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;${
    dunkel ? `background:${C.ink};color:#ffffff;border:1px solid ${C.ink};` : `background:#ffffff;color:${C.ink};border:1px solid #d9d6d3;`
  }">${esc(text)}</a>`;
const knoepfe = (html: string) => `<div style="margin:8px 0 0 0;">${html}</div>`;

const firma = (a: Anfrage) =>
  `${esc(marke(a))}${exklusive(a) ? `, ein Angebot der ${esc(site.name)}` : ''}<br>Inhaber ${esc(site.owner)}, ${esc(site.street)}, ${esc(site.postalCode)} ${esc(site.city)}<br><a href="${telLink(tel)}" style="color:${C.muted};">${esc(site.phone)}</a> &nbsp;|&nbsp; <a href="mailto:${esc(site.email)}" style="color:${C.muted};">${esc(site.email)}</a>`;

const bilderText = (a: Anfrage) =>
  !a.bilder
    ? ''
    : `${a.bilder} ${a.bilder === 1 ? 'Bild' : 'Bilder'} ${a.bilderAngehaengt ? 'im Anhang dieser E-Mail.' : `hochgeladen, zusammen zu groß für den Anhang. Sie liegen in der Ablage (Cloudflare R2) unter ${esc(a.ref)}.`}`;

/* ---------- Mail an den Betrieb (nur HTML) ---------- */

/** Mail an den Betrieb. Antworten gehen an den Kunden (Reply-To setzt die Funktion). */
export function mailBetrieb(a: Anfrage, logo: string): Mail {
  const art = ARTNAME[a.art];
  const leistung = wert(a, /^Leistung/i);
  const subject = `${exklusive(a) ? 'Exklusive: ' : ''}${art}: ${a.name}${leistung ? `, ${leistung}` : ''}`.slice(0, 180);

  const kontakt = a.zeilen.filter((z) => KONTAKT_LABELS.test(z.label));
  if (!kontakt.some((z) => /^Name$/i.test(z.label))) kontakt.unshift({ label: 'Name', value: a.name });
  const nachricht = a.zeilen.filter((z) => NACHRICHT_LABELS.test(z.label));
  const projekt = a.zeilen.filter((z) => !KONTAKT_LABELS.test(z.label) && !NACHRICHT_LABELS.test(z.label));
  const ort = wert(a, /^Adresse Bauvorhaben$/i) || wert(a, /^Adresse$/i);

  const aktionen = [
    a.email ? knopf(`mailto:${a.email}?subject=${encodeURIComponent(`Ihre Anfrage bei ${marke(a)}`)}`, 'Antworten') : '',
    a.telefon ? knopf(telLink(a.telefon), 'Anrufen', !a.email) : '',
    ort ? knopf(maps(ort), 'Route', false) : '',
  ].join('');

  const inhalt = [
    h1(`Neue ${art}${exklusive(a) ? ' für Exklusive' : ''}`),
    p(`<strong style="color:${C.ink};font-weight:600;">${esc(a.name)}</strong> hat am ${esc(wann(a.datum))} über die Seite ${esc(a.seite)} geschrieben.`),
    aktionen ? knoepfe(aktionen) : '',
    h2('Kontakt'),
    felder(kontakt),
    projekt.length ? h2(a.art === 'projekt' ? 'Projekt' : 'Anliegen') : '',
    projekt.length ? felder(projekt) : '',
    nachricht.length ? h2('Nachricht') : '',
    nachricht.length ? karte(p(nl(nachricht.map((z) => z.value).join('\n\n')), { farbe: C.ink, abstand: '0' }), '20px 24px') : '',
    a.bilder ? h2('Bilder') : '',
    a.bilder ? karte(p(bilderText(a), { farbe: C.ink, abstand: '0' }), '20px 24px') : '',
    a.art !== 'schnell' ? h2('Nächste Schritte') : '',
    a.art !== 'schnell'
      ? schritte(['Kunde innerhalb von 24 Stunden kontaktieren', 'Besichtigungstermin vereinbaren', 'Kostenvoranschlag erstellen', 'Bei Auftrag den Ausführungstermin planen'])
      : '',
    p(
      a.email
        ? `Antworten Sie einfach auf diese E-Mail, die Antwort geht direkt an ${esc(a.name)}.`
        : 'Keine E-Mail-Adresse angegeben, bitte telefonisch melden.',
      { farbe: C.muted, abstand: '32px 0 0 0' },
    ),
  ].join('');

  const html = rahmen({
    titel: subject,
    vorschau: `${art} von ${a.name}${leistung ? `, ${leistung}` : ''}`,
    logo,
    inhalt,
    fuss: `Vorgang ${esc(a.ref)}, automatisch erzeugt durch das Formular auf ${esc(exklusive(a) ? 'meisterwerk-lb.de/meisterwerk-exklusive' : 'meisterwerk-lb.de')}.`,
  });
  return { subject, html };
}

/* ---------- Eingangsbestätigung an den Kunden (HTML und Text) ---------- */

/** Bestätigung an den Kunden (nur wenn eine E-Mail-Adresse angegeben ist). */
export function mailKunde(a: Anfrage, logo: string): Mail {
  const schnell = a.art === 'schnell';
  const subject = `Ihre Anfrage bei ${marke(a)}`;
  const uebersicht = a.zeilen.filter((z) => !/^(Name|E-Mail|Rufnummer|Telefon|Telefon oder E-Mail)$/i.test(z.label));
  const frist = schnell ? 'zeitnah' : 'innerhalb von höchstens 2 Werktagen';
  const einleitung = schnell
    ? 'vielen Dank für Ihre Nachricht. Wir lesen sie persönlich und melden uns zeitnah bei Ihnen.'
    : `vielen Dank für Ihr Vertrauen. Wir sehen uns Ihr Vorhaben genau an und melden uns ${frist} bei Ihnen.`;
  const tipps = [
    'Fotos vom aktuellen Zustand der Räume oder Flächen',
    'Ist der Untergrund schon vorbereitet, oder wünschen Sie dazu eine Beratung?',
    'Haben Sie schon ein Material oder eine Farbe im Kopf?',
    'Bis wann soll alles fertig sein?',
  ];
  const ablauf = [
    `Wir melden uns ${frist} bei Ihnen.`,
    'Wir vereinbaren einen kostenlosen Besichtigungstermin.',
    'Sie erhalten einen detaillierten Kostenvoranschlag.',
    'Mit Ihrer Zustimmung planen wir den Termin für die Ausführung.',
  ];

  const inhalt = [
    h1('Vielen Dank für Ihre Anfrage'),
    p(`Guten Tag ${esc(a.name)},`, { farbe: C.ink }),
    p(einleitung),
    h2(schnell ? 'Damit es schneller geht' : 'So geht es weiter'),
    schnell ? p('Für ein genaues Angebot helfen uns diese Angaben. Antworten Sie dazu einfach auf diese E-Mail.') : '',
    schritte(schnell ? tipps : ablauf),
    h2('Termin direkt buchen'),
    p('Sie möchten nicht warten? Wählen Sie selbst einen Termin, in unserer Ausstellung in Freiberg (30 Minuten) oder direkt bei Ihnen vor Ort (60 Minuten).'),
    knoepfe(knopf(CAL, 'Termin wählen')),
    uebersicht.length ? h2(schnell ? 'Ihre Nachricht' : 'Ihre Angaben') : '',
    uebersicht.length ? felder(uebersicht) : '',
    h2('So erreichen Sie uns'),
    p(
      `Telefon <a href="${telLink(tel)}" style="color:${C.ink};">${esc(site.phone)}</a><br>E-Mail <a href="mailto:${esc(site.email)}" style="color:${C.ink};">${esc(site.email)}</a><br>Ausstellung ${esc(site.street)}, ${esc(site.postalCode)} ${esc(site.city)}`,
    ),
    knoepfe(`${knopf(telLink(tel), 'Anrufen', false)}${knopf(site.mapsUrl, 'Anfahrt', false)}`),
    p(`Herzliche Grüße<br>${esc(site.owner)}<br>${esc(marke(a))}`, { farbe: C.ink, abstand: '32px 0 0 0' }),
  ].join('');

  const html = rahmen({
    titel: subject,
    vorschau: `Danke für Ihre Anfrage. Wir melden uns ${frist} bei Ihnen.`,
    logo,
    inhalt,
    fuss: `${firma(a)}<br><br>Diese E-Mail wurde automatisch versendet, weil Sie am ${esc(wann(a.datum))} über unsere Website eine Anfrage gestellt haben (Vorgang ${esc(a.ref)}).`,
  });

  const zeilenText = uebersicht.map((z) => `${z.label}: ${z.value}`).join('\n');
  const text = [
    'Vielen Dank für Ihre Anfrage',
    '',
    `Guten Tag ${a.name},`,
    '',
    einleitung,
    '',
    schnell ? 'Damit es schneller geht' : 'So geht es weiter',
    ...(schnell ? ['Für ein genaues Angebot helfen uns diese Angaben. Antworten Sie dazu einfach auf diese E-Mail.'] : []),
    ...(schnell ? tipps : ablauf).map((t) => `* ${t}`),
    '',
    'Termin direkt buchen',
    'Sie möchten nicht warten? Wählen Sie selbst einen Termin, in unserer Ausstellung in Freiberg (30 Minuten) oder direkt bei Ihnen vor Ort (60 Minuten):',
    CAL,
    ...(zeilenText ? ['', schnell ? 'Ihre Nachricht' : 'Ihre Angaben', zeilenText] : []),
    '',
    'So erreichen Sie uns',
    `Telefon ${site.phone}`,
    `E-Mail ${site.email}`,
    `Ausstellung ${site.street}, ${site.postalCode} ${site.city}`,
    `Anfahrt ${site.mapsUrl}`,
    '',
    'Herzliche Grüße',
    site.owner,
    marke(a),
    '',
    '--',
    `${marke(a)}${exklusive(a) ? `, ein Angebot der ${site.name}` : ''}, Inhaber ${site.owner}, ${site.street}, ${site.postalCode} ${site.city}`,
    `Automatische Eingangsbestätigung Ihrer Anfrage vom ${wann(a.datum)} (Vorgang ${a.ref}).`,
  ].join('\n');

  return { subject, html, text };
}
