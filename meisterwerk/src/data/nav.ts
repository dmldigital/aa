export interface Item {
  label: string;
  href: string;
  children?: Item[];
}

export const items: Item[] = [
  { label: 'Startseite', href: '/' },
  { label: 'Über uns', href: '/studio/' },
  {
    label: 'Leistungen',
    href: '/leistungen/',
    children: [
      { label: 'Malerarbeiten', href: '/services/malerarbeiten/' },
      { label: 'Tapezierarbeiten', href: '/services/tapezieren/' },
      { label: 'Lackierarbeiten', href: '/services/lackierarbeiten/' },
      { label: 'Verputzarbeiten', href: '/services/verputzen/' },
      { label: 'Glatte Oberflächen', href: '/services/glatte-waende/' },
      {
        label: 'Meisterwerk Exklusive',
        href: '/meisterwerk-exklusive/',
        children: [
          { label: 'Fugenlose Bäder', href: '/meisterwerk-exklusive/fugenlose-baeder/' },
          { label: 'Fugenlose Böden', href: '/meisterwerk-exklusive/fugenloser-boden/' },
          { label: 'Spachteltechniken', href: '/meisterwerk-exklusive/spachteltechniken/' },
          { label: 'Stuckleisten', href: '/meisterwerk-exklusive/stuckleisten/' },
        ],
      },
    ],
  },
  { label: 'Qualifikationen', href: '/qualifikationen/' },
  { label: 'Projekte', href: '/projekte/' },
  { label: 'Urlaubsservice', href: '/urlaubsservice/' },
  { label: 'Projektanfrage', href: '/kontakt/' },
  { label: 'Kontakt', href: '/schnellkontakt/' },
];

/** Auftritt: Hauptseite oder Teil-Website „Meisterwerke Exklusive“ (/meisterwerk-exklusive/, eigener Kopf und Fuß). */
export type Site = 'main' | 'exklusive';

/** Menü der Teil-Website Exklusive (Original: Menü „Exklusive“ im Kopf der Multisite). */
export const exklusiveItems: Item[] = [
  { label: 'Startseite', href: '/meisterwerk-exklusive/' },
  { label: 'Über uns', href: '/meisterwerk-exklusive/studio/' },
  {
    label: 'Unsere Leistungen',
    href: '/meisterwerk-exklusive/unsere-leistungen/',
    children: [
      { label: 'Fugenlose Bäder', href: '/meisterwerk-exklusive/fugenlose-baeder/' },
      { label: 'Fugenlose Böden', href: '/meisterwerk-exklusive/fugenloser-boden/' },
      { label: 'Spachteltechniken', href: '/meisterwerk-exklusive/spachteltechniken/' },
      { label: 'Stuckleisten', href: '/meisterwerk-exklusive/stuckleisten/' },
      {
        label: 'Meisterwerk Malermanufaktur',
        href: '/',
        children: [
          { label: 'Malerarbeiten', href: '/services/malerarbeiten/' },
          { label: 'Tapezierarbeiten', href: '/services/tapezieren/' },
          { label: 'Lackierarbeiten', href: '/services/lackierarbeiten/' },
          { label: 'Verputzarbeiten', href: '/services/verputzen/' },
          { label: 'Glatte Oberflächen', href: '/services/glatte-waende/' },
        ],
      },
    ],
  },
  {
    label: 'Oberflächen',
    href: '#',
    children: [
      {
        label: 'Spachteltechnik Oberflächen',
        href: '/meisterwerk-exklusive/spachteltechnik-oberflaechen/',
      },
      { label: 'Fugenlose Oberflächen', href: '/meisterwerk-exklusive/fugenlos/' },
    ],
  },
  { label: 'Projekte', href: '/meisterwerk-exklusive/projekte/' },
  { label: 'Urlaubsservice', href: '/meisterwerk-exklusive/urlaub/' },
  { label: 'Projektanfrage', href: '/meisterwerk-exklusive/kontakt/' },
  { label: 'Kontakt', href: '/meisterwerk-exklusive/kontakt-2/' },
];
