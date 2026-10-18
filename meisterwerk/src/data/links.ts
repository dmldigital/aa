/**
 * Zentrale Link-Verwaltung. Solange die Unterseiten noch auf der alten WordPress-Seite liegen,
 * zeigen alle internen Pfade dorthin. Sobald eine Seite in Astro existiert, wird sie hier
 * (und nur hier) auf einen internen Link umgestellt.
 */
export const ORIGIN = 'https://meisterwerk-lb.de';

/** Seiten, die bereits in Astro gebaut sind (Pfad relativ zur Site-Basis). */
const ASTRO_PAGES: string[] = [
  '/',
  '/2021/05/01/kernsanierung/',
  '/2025/05/03/unser-showroom/',
  '/2025/05/22/altbau-wdvs/',
  '/2025/09/18/frisch-gestrichen/',
  '/2025/09/18/traumhaus/',
  '/baldassarre-fortino/',
  '/datenschutzerklaerung/',
  '/fabio-fortino/',
  '/impressum/',
  '/kontakt/',
  '/leistungen/',
  '/lorenzo-fortino/',
  '/meisterwerk-exklusive/',
  '/meisterwerk-exklusive/fugenlose-baeder/',
  '/meisterwerk-exklusive/fugenloser-boden/',
  '/meisterwerk-exklusive/partner-sponsoring/',
  '/meisterwerk-exklusive/spachteltechniken/',
  '/meisterwerk-exklusive/stuckleisten/',
  '/projekte/',
  '/qualifikationen/',
  '/reviews/',
  '/samet-erenuglu/',
  '/schnellkontakt/',
  '/services/glatte-waende/',
  '/services/lackierarbeiten/',
  '/services/malerarbeiten/',
  '/services/tapezieren/',
  '/services/verputzen/',
  '/stefano-pulia/',
  '/studio/',
  '/urlaubsservice/',
  '/vincenzo-fortino/',
];

export function href(path: string): string {
  // Absolute Adressen, Anker und Mail/Telefon bleiben unverändert (macht href() auch mehrfach angewandt unschädlich)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path) || (base && path.startsWith(`${base}/`))) return path;
  if (ASTRO_PAGES.includes(path)) return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
  return `${ORIGIN}${path}`;
}

export const routes = {
  home: '/',
  contact: '/kontakt/',
  projects: '/projekte/',
  partners: '/meisterwerk-exklusive/partner-sponsoring/',
  imprint: '/impressum/',
  privacy: '/datenschutzerklaerung/',
} as const;
