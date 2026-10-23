/**
 * SEO-Regeln an einer Stelle (Layout, Sitemap, robots.txt, Prüfskript).
 * Bewusst ohne Astro-Importe, damit `astro.config.mjs` sie ebenfalls laden kann.
 */
import { readdirSync } from 'node:fs';

/** Markenzusatz im Seitentitel je Auftritt. */
export const BRAND = {
  main: 'Meisterwerk Malermanufaktur',
  exklusive: 'Meisterwerke Exklusive',
} as const;

/** Einheitliches Trennzeichen im Seitentitel: „Thema | Marke“. */
export const TITLE_SEPARATOR = ' | ';
export const TITLE_MAX = 60;

/** Frühere Schreibweisen der Marke am Titelende (werden entfernt und durch die einheitliche ersetzt). */
const OLD_BRANDS =
  /\s+[-–|]\s+(?:Meisterwerk Malermanufaktur|Meisterwerke? Exklusive|Meisterwerk Ludwigsburg|Meisterwerk LB|Meisterwerk)\s*$/;

/** Baut den fertigen Seitentitel: Thema, Trennzeichen, Marke (genau einmal, immer gleich geschrieben). */
export function composeTitle(topic: string, site: 'main' | 'exklusive' = 'main'): string {
  const clean = topic.replace(OLD_BRANDS, '').trim();
  return `${clean}${TITLE_SEPARATOR}${BRAND[site]}`;
}

/** Seiten, die nie in Suchmaschinen erscheinen sollen (auch in Produktion): Pfad relativ zur Site-Basis. */
export const NOINDEX_PATHS = ['/stil/', '/404/', '/reviews/'];

const EXKLUSIVE = '/meisterwerk-exklusive/';
/** Rechtstexte der Teil-Website, wortgleich zur Hauptseite: Canonical zeigt auf die Hauptseite. */
const LEGAL_SLUGS = ['impressum', 'datenschutzerklaerung'];

/** Slugs der Mitarbeiterprofile (Ordner `src/content/profile`), auf beiden Auftritten dieselben Personen. */
function profileSlugs(): string[] {
  try {
    return readdirSync(new URL(`file://${process.cwd()}/src/content/profile/`))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

/**
 * Canonical-Pfad einer Seite. Meist die Seite selbst. Ausnahmen (Entscheidung offen beim Nutzer, siehe HANDOVER):
 * Impressum, Datenschutz und Profilseiten der Teil-Website zeigen auf die Fassung der Hauptseite.
 */
export function canonicalPath(path: string): string {
  if (path.startsWith(EXKLUSIVE)) {
    const rest = path.slice(EXKLUSIVE.length).replace(/\/$/, '');
    if (LEGAL_SLUGS.includes(rest) || profileSlugs().includes(rest)) return `/${rest}/`;
  }
  return path;
}

/** Ob die Seite im Index erscheinen darf (unabhängig von der Umgebung). */
export function isIndexablePage(path: string): boolean {
  return !NOINDEX_PATHS.includes(path);
}

/** Ob die Seite in die Sitemap gehört: indexierbar und nicht Duplikat einer anderen Seite. */
export function inSitemap(path: string): boolean {
  return isIndexablePage(path) && canonicalPath(path) === path;
}

/** Pfad einer vollständigen Adresse relativ zur Site-Basis (`/aa/x/foo/` mit Basis `/aa/x/` wird `/foo/`). */
export function pathFromUrl(url: string, base = '/'): string {
  const p = new URL(url).pathname;
  const b = base.endsWith('/') ? base : `${base}/`;
  return p.startsWith(b) ? `/${p.slice(b.length)}` : p;
}

/** Ob dieser Build für Suchmaschinen freigegeben ist (nur bei `PUBLIC_INDEXABLE=true`). */
export function siteIndexable(value: string | undefined): boolean {
  return value === 'true';
}

/** Orte, die in Überschriften von Projekten genannt werden dürfen (Zielregion). */
const TARGET_PLACES = ['Ludwigsburg', 'Freiberg am Neckar', 'Marbach am Neckar', 'Bietigheim-Bissingen', 'Stuttgart'];

/**
 * Überschrift (H1) einer Projektseite mit Ortsbezug, nur aus vorhandenen Daten: „Titel: Leistung in Ort“. Steht die Leistung
 * schon im Titel, entfällt sie („Spachteltechnik für Lotter Bäderausstellung in Ludwigsburg“). Liegt der Ort außerhalb der
 * Zielregion, bleibt der Titel unverändert.
 */
export function projectHeading(title: string, services: string[], place: string): string {
  const ort = place.replace(/^Freiberg a\. Neckar$/, 'Freiberg am Neckar');
  if (!TARGET_PLACES.includes(ort)) return title;
  const service = services[0] ?? '';
  const first = service.split(' ')[0].toLowerCase();
  if (!service || title.toLowerCase().includes(first)) return `${title} in ${ort}`;
  return `${title}: ${service} in ${ort}`;
}
