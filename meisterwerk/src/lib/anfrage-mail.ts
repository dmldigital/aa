/**
 * E-Mails der Formulare (Projektanfrage und kurze Nachricht): eine an den Betrieb, eine Bestätigung an den Kunden.
 * Reine Funktionen ohne Abhängigkeit von Cloudflare, damit sie im Build und in Tests gleich laufen.
 * Inhalt angelehnt an die Vorlagen des alten WordPress-Formulars (Elementor), ohne Emojis, mit korrekten Feldern.
 * Benutzt von: functions/api/anfrage.ts
 */
import { site } from '../data/site';

export type Art = 'projekt' | 'kurz';
export interface Zeile {
  label: string;
  value: string;
}
export interface Anfrage {
  art: Art;
  ref: string;
  /** Zeitpunkt des Eingangs (für die Anzeige in deutscher Zeit) */
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
  text: string;
}

const GOLD = '#a59371';
const INK = '#090402';
const MUTED = '#5e5a55';
const SOFT = '#f7f7f7';
const CAL = 'https://cal.com/meisterwerk';

export const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const nl = (s: string) => esc(s).replace(/\r?\n/g, '<br>');
const exklusive = (a: Anfrage) => a.seite.startsWith('/meisterwerk-exklusive/');
const marke = (a: Anfrage) => (exklusive(a) ? 'Meisterwerke Exklusive' : 'Meisterwerk Malermanufaktur');
const wann = (d: Date) =>
  d.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr';
const tel = site.phoneHref.startsWith('+') ? site.phoneHref : `+49${site.phoneHref.replace(/^0/, '')}`;

/** Rahmen einer Mail: weiße Karte auf hellem Grund, Kopf mit Logo und goldener Linie, Fuß mit Firmendaten. */
function rahmen(o: { logo: string; titel: string; unterzeile: string; inhalt: string; fuss: string }) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.titel)}</title></head>
<body style="margin:0;padding:0;background:${SOFT};font-family:Arial,Helvetica,sans-serif;color:${INK};line-height:1.55">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #ebe8e3">
<tr><td style="padding:28px 28px 20px;border-bottom:3px solid ${GOLD};text-align:center">
<img src="${esc(o.logo)}" alt="Meisterwerk Malermanufaktur" width="220" style="display:block;margin:0 auto 14px;max-width:220px;height:auto;border:0">
<h1 style="margin:0;font-size:21px;font-weight:600;color:${INK}">${esc(o.titel)}</h1>
<p style="margin:6px 0 0;font-size:14px;color:${MUTED}">${o.unterzeile}</p>
</td></tr>
<tr><td style="padding:24px 28px 8px;font-size:15px">${o.inhalt}</td></tr>
<tr><td style="padding:18px 28px 24px;font-size:12px;color:${MUTED};border-top:1px solid #ebe8e3">${o.fuss}</td></tr>
</table></td></tr></table></body></html>`;
}

const tabelle = (zeilen: Zeile[]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:6px 0 18px">${zeilen
    .map(
      (z) =>
        `<tr><td style="padding:8px 14px 8px 0;border-bottom:1px solid #f0ede8;color:${MUTED};vertical-align:top;width:38%">${esc(z.label)}</td><td style="padding:8px 0;border-bottom:1px solid #f0ede8;vertical-align:top"><b style="font-weight:600">${nl(z.value)}</b></td></tr>`,
    )
    .join('')}</table>`;
const h2 = (t: string) => `<h2 style="margin:22px 0 8px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:${GOLD};font-weight:600">${esc(t)}</h2>`;
const knopf = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;padding:12px 26px;border-radius:999px;background:${INK};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600">${esc(label)}</a>`;
const firma = () =>
  `${esc(site.name)}, Inh. ${esc(site.owner)}<br>${esc(site.street)}, ${esc(site.postalCode)} ${esc(site.city)}<br>Telefon <a href="tel:${tel}" style="color:${MUTED}">${esc(site.phone)}</a>, <a href="mailto:${esc(site.email)}" style="color:${MUTED}">${esc(site.email)}</a>`;
const textZeilen = (zeilen: Zeile[]) => zeilen.map((z) => `${z.label}: ${z.value}`).join('\n');

/** Mail an den Betrieb. Antworten gehen an den Kunden (Reply-To setzt die Funktion). */
export function mailBetrieb(a: Anfrage, logo: string): Mail {
  const projekt = a.art === 'projekt';
  const titel = projekt ? 'Neue Projektanfrage' : 'Neue Nachricht über die Website';
  const leistung = a.zeilen.find((z) => /^Leistung/i.test(z.label))?.value;
  const subject = `${exklusive(a) ? 'Exklusive: ' : ''}${titel}: ${a.name}${leistung ? `, ${leistung}` : ''}`.slice(0, 180);
  const kontakt: Zeile[] = [
    { label: 'Name', value: a.name },
    ...(a.email ? [{ label: 'E-Mail', value: a.email }] : []),
    ...(a.telefon ? [{ label: 'Telefon', value: a.telefon }] : []),
  ];
  const ohneKontakt = a.zeilen.filter((z) => !/^(Name|E-Mail|Rufnummer|Telefon)$/i.test(z.label));
  const bilder = a.bilder
    ? `<p style="margin:0 0 16px">${a.bilder} ${a.bilder === 1 ? 'Bild' : 'Bilder'} ${a.bilderAngehaengt ? 'im Anhang.' : 'hochgeladen, zu groß für den Anhang. Sie liegen in der Ablage (Cloudflare R2) unter ' + esc(a.ref) + '.'}</p>`
    : '';
  const inhalt = `${h2('Kontakt')}${tabelle(kontakt)}${h2(projekt ? 'Projekt' : 'Nachricht')}${tabelle(ohneKontakt)}${bilder}
${projekt ? `${h2('Nächste Schritte')}<ol style="margin:0 0 16px;padding-left:20px;font-size:14px"><li>Kunde innerhalb von 24 Stunden kontaktieren</li><li>Besichtigungstermin vereinbaren</li><li>Kostenvoranschlag erstellen</li><li>Bei Auftrag: Ausführungstermin planen</li></ol>` : ''}
<p style="margin:0 0 6px;font-size:14px;color:${MUTED}">Antworten Sie einfach auf diese E-Mail, die Antwort geht direkt an ${esc(a.name)}.</p>`;
  const html = rahmen({
    logo,
    titel,
    unterzeile: `Eingegangen am ${esc(wann(a.datum))} über ${esc(marke(a))}, Seite ${esc(a.seite)}`,
    inhalt,
    fuss: `Vorgang ${esc(a.ref)}. Automatisch erzeugt durch das Formular der Website.`,
  });
  const text = `${titel} (${a.ref})\nEingegangen am ${wann(a.datum)}, Seite ${a.seite}\n\n${textZeilen(kontakt)}\n\n${textZeilen(ohneKontakt)}\n${a.bilder ? `\nBilder: ${a.bilder}${a.bilderAngehaengt ? ' (im Anhang)' : ' (in der Ablage)'}\n` : ''}`;
  return { subject, html, text };
}

/** Bestätigung an den Kunden (nur wenn eine E-Mail-Adresse angegeben ist). */
export function mailKunde(a: Anfrage, logo: string): Mail {
  const projekt = a.art === 'projekt';
  const subject = `Ihre Anfrage bei ${marke(a)}`;
  const anrede = `Guten Tag ${esc(a.name)},`;
  const kontaktZeilen = `<p style="margin:0 0 6px">Telefon: <a href="tel:${tel}" style="color:${INK}">${esc(site.phone)}</a><br>E-Mail: <a href="mailto:${esc(site.email)}" style="color:${INK}">${esc(site.email)}</a><br>Showroom: ${esc(site.street)}, ${esc(site.postalCode)} ${esc(site.city)}, <a href="${esc(site.mapsUrl)}" style="color:${GOLD}">Anfahrt</a></p>`;
  const uebersicht = a.zeilen.filter((z) => !/^(Adresse|Adresse Bauvorhaben)$/i.test(z.label));
  const inhalt = projekt
    ? `<p style="margin:0 0 12px">${anrede}</p>
<p style="margin:0 0 12px">vielen Dank für Ihre Anfrage. Wir haben sie erhalten und erstellen Ihnen gern ein individuelles Angebot.</p>
${h2('Ihre Anfrage im Überblick')}${tabelle(uebersicht)}
${h2('Wie geht es weiter?')}<ol style="margin:0 0 18px;padding-left:20px"><li>Wir melden uns innerhalb von höchstens 2 Werktagen bei Ihnen.</li><li>Wir vereinbaren einen kostenlosen Besichtigungstermin.</li><li>Sie erhalten einen detaillierten Kostenvoranschlag.</li><li>Bei Ihrer Zustimmung planen wir den Termin für die Ausführung.</li></ol>
<p style="margin:0 0 12px">Sie möchten nicht warten? Dann buchen Sie direkt einen Termin:</p>
<p style="margin:0 0 20px">${knopf(CAL, 'Termin wählen')}</p>
${h2('So erreichen Sie uns')}${kontaktZeilen}`
    : `<p style="margin:0 0 12px">${anrede}</p>
<p style="margin:0 0 12px">vielen Dank für Ihre Nachricht. Wir haben sie erhalten und melden uns zeitnah bei Ihnen.</p>
<p style="margin:0 0 8px">Damit wir Ihnen schnell ein genaues Angebot machen können, helfen uns vorab diese Angaben:</p>
<ul style="margin:0 0 14px;padding-left:20px"><li>Fotos vom aktuellen Zustand der Räume oder Flächen</li><li>Ist der Untergrund schon vorbereitet, oder wünschen Sie dazu eine Beratung?</li><li>Haben Sie schon ein Wunschmaterial oder eine Farbe im Kopf?</li><li>Bis wann muss das Projekt spätestens fertig sein?</li></ul>
<p style="margin:0 0 16px">Antworten Sie dazu einfach auf diese E-Mail.</p>
<p style="margin:0 0 16px">Eilt es? Dann rufen Sie uns an: <a href="tel:${tel}" style="color:${INK};font-weight:600">${esc(site.phone)}</a></p>
${h2('Ihre Nachricht')}${tabelle(uebersicht)}${h2('So erreichen Sie uns')}${kontaktZeilen}`;
  const html = rahmen({
    logo,
    titel: projekt ? 'Vielen Dank für Ihre Anfrage' : 'Vielen Dank für Ihre Nachricht',
    unterzeile: 'Wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen.',
    inhalt,
    fuss: `${firma()}<br><br>Dies ist eine automatische Bestätigung Ihrer Anfrage vom ${esc(wann(a.datum))}.`,
  });
  const text = `Guten Tag ${a.name},\n\nvielen Dank für Ihre ${projekt ? 'Anfrage' : 'Nachricht'}. Wir haben sie erhalten und melden uns ${projekt ? 'innerhalb von höchstens 2 Werktagen' : 'zeitnah'} bei Ihnen.\n\n${textZeilen(uebersicht)}\n\n${projekt ? `Termin direkt buchen: ${CAL}\n\n` : 'Fotos und weitere Angaben senden Sie uns einfach als Antwort auf diese E-Mail.\n\n'}${site.name}, Inh. ${site.owner}\n${site.street}, ${site.postalCode} ${site.city}\nTelefon ${site.phone}, ${site.email}`;
  return { subject, html, text };
}
