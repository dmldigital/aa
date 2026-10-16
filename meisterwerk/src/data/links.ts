/**
 * Zentrale Link-Verwaltung. Solange die Unterseiten noch auf der alten WordPress-Seite liegen,
 * zeigen alle internen Pfade dorthin. Sobald eine Seite in Astro existiert, wird sie hier
 * (und nur hier) auf einen internen Link umgestellt.
 */
export const ORIGIN = 'https://meisterwerk-lb.de';

/** Seiten, die bereits in Astro gebaut sind (Pfad relativ zur Site-Basis). */
const ASTRO_PAGES: string[] = [];

export function href(path: string): string {
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
