/**
 * Interne Verlinkung im Fließtext. Die Middleware (`src/middleware.ts`) schickt jede fertige Seite durch `autolink`,
 * dort werden die Hauptinhalte (`<main>`) nach Stichwörtern durchsucht und deren erste Nennung verlinkt.
 *
 * Regeln:
 * - Nur Fließtext in `p`, `li` und `blockquote` (oder längerer Text direkt in einem `div`) im `<main>`. Nie in Überschriften, Links, Schaltflächen, Formularen,
 *   Listen mit Eckdaten (`dl`), Beschriftungen in Großbuchstaben und Bereichen mit `data-no-autolink` oder `data-hero`.
 * - Jedes Ziel höchstens einmal je Seite, höchstens sechs Links je Seite, nie auf die Seite selbst. Ziele, die der Text
 *   schon verlinkt, zählen mit.
 * - Der Wortlaut bleibt unverändert, nur das Stichwort selbst wird zum Link (gleiche Darstellung wie die Textlinks der
 *   Startseite, Klasse `inline-link`).
 * - Die Teil-Website „Meisterwerke Exklusive“ verlinkt nur innerhalb von sich, die Hauptseite verlinkt auch dorthin.
 * - Keine Verlinkung auf Rechtstexten und Kontaktseiten.
 */
import { href } from '../data/links';

type Site = 'main' | 'exklusive';
interface Target {
  /** Adresse je Auftritt; fehlt ein Auftritt, wird dort nicht verlinkt */
  path: Partial<Record<Site, string>>;
  /** Stichwörter (Wortgrenzen und Groß-/Kleinschreibung wie hier angegeben) */
  re: RegExp;
}

const L = '(?<![\\p{L}])';
const R = '(?![\\p{L}])';
const word = (src: string) => new RegExp(`${L}(?:${src})${R}`, 'u');

const TARGETS: Target[] = [
  { path: { main: '/services/malerarbeiten/' }, re: word('Malerarbeiten|Malerarbeit') },
  { path: { main: '/services/tapezieren/' }, re: word('Tapezierarbeiten|Tapezierarbeit|Tapezieren') },
  { path: { main: '/services/lackierarbeiten/' }, re: word('Lackierarbeiten|Lackierarbeit|Lackieren') },
  { path: { main: '/services/verputzen/' }, re: word('Verputzarbeiten|Verputzarbeit|Verputzen') },
  { path: { main: '/services/glatte-waende/' }, re: word('[Gg]latte Wände|[Gg]latten Wänden|[Gg]latte Oberflächen|[Gg]latter Oberflächen') },
  { path: { main: '/meisterwerk-exklusive/fugenlose-baeder/', exklusive: '/meisterwerk-exklusive/fugenlose-baeder/' }, re: word('[Ff]ugenlos(?:e|en|es) Bäder|[Ff]ugenlos(?:e|en|es) Bad') },
  { path: { main: '/meisterwerk-exklusive/fugenloser-boden/', exklusive: '/meisterwerk-exklusive/fugenloser-boden/' }, re: word('[Ff]ugenlos(?:e|en) Böden|[Ff]ugenlos(?:er|en) Boden') },
  { path: { main: '/meisterwerk-exklusive/spachteltechniken/', exklusive: '/meisterwerk-exklusive/spachteltechniken/' }, re: word('Spachteltechniken|Spachteltechnik') },
  { path: { main: '/meisterwerk-exklusive/stuckleisten/', exklusive: '/meisterwerk-exklusive/stuckleisten/' }, re: word('Stuckleisten|Stuckarbeiten') },
  { path: { main: '/2025/05/03/unser-showroom/', exklusive: '/2025/05/03/unser-showroom/' }, re: word('Showroom') },
  { path: { main: '/urlaubsservice/', exklusive: '/meisterwerk-exklusive/urlaub/' }, re: word('Urlaubsservice') },
  { path: { main: '/qualifikationen/' }, re: word('Meisterbriefe?|Meisterbetrieb|Qualifikationen|Zertifikate') },
  { path: { main: '/meisterwerk-exklusive/' }, re: word('Meisterwerke? Exklusive') },
  { path: { main: '/projekte/', exklusive: '/meisterwerk-exklusive/projekte/' }, re: word('Referenzen|[Uu]nsere Projekte|Projektübersicht') },
  { path: { main: '/studio/', exklusive: '/meisterwerk-exklusive/studio/' }, re: word('[Uu]nser Team|[Uu]nserem Team') },
  { path: { main: '/baldassarre-fortino/', exklusive: '/meisterwerk-exklusive/baldassarre-fortino/' }, re: word('(?:Malermeister |Meister )?Baldassarre Fortino') },
  { path: { main: '/kontakt/', exklusive: '/meisterwerk-exklusive/kontakt/' }, re: word('persönliche[nr]? Beratung|kostenlose[nr]? Beratung|Beratungsgespräch|Beratung vor Ort') },
];

/** Tags ohne Endtag */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'use']);
/** Bereiche, deren Text nie verlinkt wird */
const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'form', 'nav', 'header', 'footer', 'dl', 'figcaption', 'summary', 'option', 'time']);
/** Text darf nur in diesen Tags verlinkt werden */
const TEXT_TAGS = new Set(['p', 'li', 'blockquote']);
/** Undurchsichtige Blöcke (Inhalt wird nicht angefasst) */
const OPAQUE = 'script|style|svg|textarea|select|button|dialog|noscript|picture|iframe';
const TOKEN = new RegExp(`<!--[\\s\\S]*?-->|<(${OPAQUE})\\b[\\s\\S]*?</\\1>|</?[a-zA-Z][^>]*>`, 'g');

const MAX_LINKS = 6;

const stripBase = (p: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = p.replace(/^https?:\/\/[^/]+/, '');
  return base && path.startsWith(`${base}/`) ? path.slice(base.length) : path;
};

export function autolink(html: string, pathname: string): string {
  const here = stripBase(pathname);
  if (/\/(impressum|datenschutzerklaerung|kontakt|schnellkontakt)\/$/.test(here)) return html;
  const site: Site = here.startsWith('/meisterwerk-exklusive/') ? 'exklusive' : 'main';

  const targets = TARGETS.flatMap((t) => {
    const path = t.path[site];
    return path && path !== here ? [{ path, re: t.re }] : [];
  });
  if (!targets.length) return html;

  // Ziele, die der Hauptinhalt schon verlinkt (Kopfzeile, Menü und Fuß zählen nicht)
  const done = new Set<string>();
  const main = html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  for (const m of main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) done.add(stripBase(m[1]).split('#')[0]);
  let count = 0;

  const out: string[] = [];
  const stack: { name: string; skip: boolean }[] = [];
  let inMain = false;
  const tokens = [...html.matchAll(TOKEN)];
  let cursor = 0;

  const processText = (text: string) => {
    if (!inMain || !text.trim() || count >= MAX_LINKS) return text;
    if (stack.some((e) => e.skip)) return text;
    // Fließtext steht in p, li, blockquote, oder als längerer Text direkt in einem div
    const body = stack.some((e) => TEXT_TAGS.has(e.name)) || (stack[stack.length - 1]?.name === 'div' && text.trim().length >= 80);
    if (!body) return text;
    let rest = text;
    let result = '';
    while (rest && count < MAX_LINKS) {
      let best: { index: number; len: number; path: string } | null = null;
      for (const t of targets) {
        if (done.has(t.path)) continue;
        const m = t.re.exec(rest);
        if (m && (!best || m.index < best.index)) best = { index: m.index, len: m[0].length, path: t.path };
      }
      if (!best) break;
      done.add(best.path);
      count++;
      result += `${rest.slice(0, best.index)}<a href="${href(best.path)}" class="inline-link">${rest.slice(best.index, best.index + best.len)}</a>`;
      rest = rest.slice(best.index + best.len);
    }
    return result + rest;
  };

  for (const m of tokens) {
    out.push(processText(html.slice(cursor, m.index)));
    const tok = m[0];
    out.push(tok);
    cursor = (m.index ?? 0) + tok.length;
    if (tok.startsWith('<!--') || m[1]) continue; // Kommentar oder undurchsichtiger Block
    const closing = tok.startsWith('</');
    const name = (tok.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/)?.[1] ?? '').toLowerCase();
    if (closing) {
      while (stack.length) {
        const top = stack.pop()!;
        if (top.name === name) break;
      }
      if (name === 'main') inMain = false;
      continue;
    }
    if (name === 'main') inMain = true;
    if (VOID.has(name) || tok.endsWith('/>')) continue;
    const skip =
      SKIP_TAGS.has(name) ||
      /\bdata-(no-autolink|hero)\b/.test(tok) ||
      /\bclass="[^"]*\b(uppercase|tracking-label|inline-link)\b[^"]*"/.test(tok);
    stack.push({ name, skip });
  }
  out.push(processText(html.slice(cursor)));
  return out.join('');
}
