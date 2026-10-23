/**
 * Strukturierte Daten (JSON-LD, schema.org). Nur Angaben, die im Projekt belegt sind:
 * `geo`, `openingHours`, `foundingYear`, `vatId` erscheinen erst, wenn sie in `data/site.ts` befüllt sind.
 * `aggregateRating` nur, wenn Note UND Anzahl der Google-Rezensionen in `data/site.ts` stehen (Anzahl ist beim Kunden offen).
 * Hinweis: Google zeigt Sterne in der Suche für LocalBusiness-Eigenbewertungen auf der eigenen Seite nicht als Rich Result;
 * die Sterne in Suche und Maps kommen aus dem Google-Unternehmensprofil. Kein `priceRange`.
 */
import { site } from '../data/site';
import { items as mainNav, exklusiveItems, type Item } from '../data/nav';
import { faqs, type Block, type Faq } from '../data/faq';
import { BRAND } from './seo';

type Site = 'main' | 'exklusive';
type Json = Record<string, unknown>;

export interface SchemaContext {
  /** Pfad (relativ zur Basis, mit Schrägstrich am Ende) in vollständige Adresse umwandeln */
  abs: (path: string) => string;
  /** Vollständige Adresse des Logos */
  logo: string;
  /** Vollständige Adresse eines Vorschaubilds (1200x630) */
  image: string;
}

const EXKLUSIVE = '/meisterwerk-exklusive/';

/** Eindeutige Kennungen, damit sich Seiten und Dienstleistungen auf denselben Betrieb beziehen. */
export const businessId = (ctx: SchemaContext) => `${ctx.abs('/')}#betrieb`;
const websiteId = (ctx: SchemaContext) => `${ctx.abs('/')}#website`;

const city = (name: string): Json => ({ '@type': 'City', name });

/** HousePainter (LocalBusiness) mit Name, Anschrift, Kontakt, Einzugsgebiet und Profilen. */
export function localBusiness(ctx: SchemaContext): Json {
  const node: Json = {
    '@type': 'HousePainter',
    '@id': businessId(ctx),
    name: site.name,
    alternateName: site.googleName,
    url: ctx.abs('/'),
    telephone: `+${site.phoneHref.replace(/^\+/, '')}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.cityFull,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map(city),
    sameAs: [site.social.instagram, site.social.facebook, site.googleProfile],
    hasMap: site.googleProfile,
    logo: { '@type': 'ImageObject', url: ctx.logo },
    image: ctx.image,
    founder: {
      '@type': 'Person',
      name: site.owner,
      jobTitle: 'Malermeister',
      url: ctx.abs('/baldassarre-fortino/'),
    },
  };
  if (site.geo) {
    node.geo = { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude };
  }
  if (site.openingHours?.length) {
    node.openingHoursSpecification = site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }
  if (site.rating?.count) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      bestRating: 5,
      worstRating: 1,
      ratingCount: site.rating.count,
    };
  }
  if (site.foundingYear) node.foundingDate = site.foundingYear;
  if (site.vatId) node.vatID = site.vatId;
  return node;
}

export function webSite(ctx: SchemaContext): Json {
  return {
    '@type': 'WebSite',
    '@id': websiteId(ctx),
    url: ctx.abs('/'),
    name: site.name,
    inLanguage: 'de-DE',
    publisher: { '@id': businessId(ctx) },
  };
}

export interface Crumb {
  name: string;
  /** Pfad; fehlt er, ist es die aktuelle Seite */
  path?: string;
}

export function breadcrumbList(crumbs: Crumb[], ctx: SchemaContext, currentPath: string): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: ctx.abs(c.path ?? currentPath),
    })),
  };
}

export function service(
  { name, description, path }: { name: string; description?: string; path: string },
  ctx: SchemaContext,
): Json {
  const node: Json = {
    '@type': 'Service',
    '@id': `${ctx.abs(path)}#leistung`,
    name,
    serviceType: name,
    url: ctx.abs(path),
    provider: { '@id': businessId(ctx) },
    areaServed: site.areaServed.map(city),
  };
  if (description) node.description = description;
  return node;
}

/** Antwort der FAQ als reiner Text (ohne Zeilenumbrüche und Verweise). */
function faqText(blocks: Block[]): string {
  return blocks
    .map((b) =>
      b.type === 'steps'
        ? b.items.join(' ')
        : b.parts.map((p) => (typeof p === 'string' ? p : 'br' in p ? ' ' : p.text)).join(''),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function faqPage(list: Faq[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: list
      .map((f) => ({ q: f.q, a: faqText(f.a) }))
      .filter((f) => f.q && f.a)
      .map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
  };
}

/** Seiten mit einer Leistung (Service). */
const SERVICE_PATHS = [
  /^\/services\/[^/]+\/$/,
  /^\/meisterwerk-exklusive\/(?:fugenlose-baeder|fugenloser-boden|spachteltechniken|stuckleisten)\/$/,
];

/** Menüeintrag samt übergeordneten Einträgen zu einem Pfad suchen. */
function findInNav(list: Item[], path: string, trail: Item[] = []): Item[] | undefined {
  for (const it of list) {
    if (it.href === path) return [...trail, it];
    if (it.children) {
      const hit = findInNav(it.children, path, [...trail, it]);
      if (hit) return hit;
    }
  }
  return undefined;
}

const POST = /^(?:\/meisterwerk-exklusive)?\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/;

/**
 * Brotkrumen aus Pfad und Menü. `topic` ist der Seitenname (Titel ohne Markenzusatz) für Seiten ohne Menüeintrag.
 * Hauptseite: Startseite > …; Teil-Website: Startseite > Meisterwerke Exklusive > …
 */
export function breadcrumbs(path: string, topic: string, siteKind: Site): Crumb[] {
  const exk = path.startsWith(EXKLUSIVE);
  const root: Crumb[] = exk
    ? [{ name: 'Startseite', path: '/' }, { name: BRAND.exklusive, path: EXKLUSIVE }]
    : [{ name: 'Startseite', path: '/' }];
  void siteKind;
  const tree = exk ? exklusiveItems : mainNav;
  const hit = findInNav(tree, path);
  if (hit) {
    // Eintrag „Startseite“ des Menüs ist schon die Wurzel; Platzhalter ohne Adresse („#“) fallen weg
    const trail = hit.filter((n) => n.href !== '/' && n.href !== EXKLUSIVE && n.href !== '#');
    const crumbs = trail.map((n, i) =>
      i === trail.length - 1 ? { name: n.label } : { name: n.label, path: n.href },
    );
    // Eintrag der Hauptseite im Exklusive-Menü („Meisterwerk Malermanufaktur“ mit Pfad „/“) bleibt außen vor
    return [...root, ...crumbs.filter((c) => c.path !== '/')];
  }
  const parentOf = (name: string, p: string): Crumb[] => [...root, { name, path: p }, { name: topic }];
  if (POST.test(path)) {
    return exk ? parentOf('Projekte', `${EXKLUSIVE}projekte/`) : parentOf('Projekte', '/projekte/');
  }
  if (/^\/[a-z-]+\/$/.test(path) && !['/impressum/', '/datenschutzerklaerung/'].includes(path)) {
    return parentOf('Über uns', '/studio/'); // Profilseiten der Hauptseite
  }
  if (exk && /^\/meisterwerk-exklusive\/[a-z-]+\/$/.test(path)) {
    const slug = path.slice(EXKLUSIVE.length, -1);
    if (['impressum', 'datenschutzerklaerung', 'partner-sponsoring', 'fugenlos', 'spachteltechnik-oberflaechen'].includes(slug)) {
      return [...root, { name: topic }];
    }
    return parentOf('Über uns', `${EXKLUSIVE}studio/`); // Profilseiten der Teil-Website
  }
  return [...root, { name: topic }];
}

export interface PageSchemaInput {
  /** Pfad relativ zur Basis, mit Schrägstrich am Ende */
  path: string;
  /** Seitenname ohne Markenzusatz */
  topic: string;
  description?: string;
  site: Site;
}

/** Alle strukturierten Daten einer Seite als Liste von Knoten (für `@graph`). */
export function pageSchema({ path, topic, description, site: siteKind }: PageSchemaInput, ctx: SchemaContext): Json[] {
  const nodes: Json[] = [];
  if (path === '/') {
    nodes.push(localBusiness(ctx), webSite(ctx), faqPage(faqs));
    return nodes;
  }
  // Betrieb mit @id steht nur auf der Startseite, alle anderen Seiten verweisen darauf
  const crumbs = breadcrumbs(path, topic, siteKind);
  nodes.push(breadcrumbList(crumbs, ctx, path));
  if (SERVICE_PATHS.some((re) => re.test(path))) {
    const last = crumbs[crumbs.length - 1];
    nodes.push(service({ name: last.name, description, path }, ctx));
  }
  return nodes;
}

/** JSON für `<script type="application/ld+json">`: `<` wird maskiert, damit nichts den Skript-Block beendet. */
export function toJsonLd(nodes: Json[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
