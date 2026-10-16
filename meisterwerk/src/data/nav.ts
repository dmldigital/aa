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
