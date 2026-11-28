/** Partner, Sponsoring und Spenden (live von /meisterwerk-exklusive/partner-sponsoring/ gelesen). */
export interface PartnerLink {
  name: string;
  /** Kurzbeschreibung unter dem Namen (optional). */
  sub?: string;
  href: string;
}
export interface PartnerGroup {
  title: string;
  links: PartnerLink[];
}

export const partnerPage = {
  title: 'Partner & Sponsoring',
  description:
    'Partner, Sponsoring und Spenden der Meisterwerk Malermanufaktur: Vereine, Meisterbetriebe sowie Hersteller und Lieferanten.',
};

export const partnerGroups: PartnerGroup[] = [
  {
    title: 'Sponsor',
    links: [
      {
        name: 'FSV Oßweil 1924 e.V.',
        sub: 'Unterstützung des regionalen Sports & Vereinsarbeit',
        href: 'https://www.fsv-ossweil.de/partner/',
      },
    ],
  },
  {
    title: 'Spenden',
    links: [
      {
        name: 'Baby-Notarztwagen „Felix“',
        sub: 'Sicherer Transport für Früh- und Neugeborene (Björn Steiger Stiftung)',
        href: 'https://www.steiger-stiftung.de/was-wir-tun/baby-notarztwagen/',
      },
    ],
  },
  {
    title: 'Partner-Meisterbetriebe',
    links: [
      {
        name: 'Madera Bedachungen',
        sub: 'Dachdecker in Remseck am Neckar',
        href: 'https://www.madera-bedachungen.de/',
      },
      {
        name: 'Elektro Kiefler GmbH',
        sub: 'Elektroinstallation, Smart Home & Photovoltaik in Korntal-Münchingen',
        href: 'https://www.elektro-kiefler.de/',
      },
      {
        name: 'Münster Haustechnik',
        sub: 'Bäder, Heiztechnik & Photovoltaik seit 1966',
        href: 'https://www.muenstergmbh.de/',
      },
      {
        name: 'Johannes Haustechnik',
        sub: 'Sanitär, Heizung & Klima vom Meisterbetrieb',
        href: 'https://johannes-haustechnik.de/ueber-johannes-haustechnik/',
      },
      {
        name: 'Raummanufactur',
        sub: 'Bodenleger in Ludwigsburg: Parkett, Vinyl & Kork',
        href: 'https://raummanufactur.de/bodenverlegung.html',
      },
      {
        name: 'ColdArts',
        sub: 'Kälte- & Klimatechnik aus Pleidelsheim',
        href: 'https://coldarts.eu/',
      },
      {
        name: 'NRE Bau GmbH',
        sub: 'Stuckateur & Maler: Wärmedämmung, Putz und Trockenbau',
        href: 'https://nrebau.de/',
      },
      {
        name: 'ENGESA',
        sub: 'Ingenieurbüro für energetische Gebäudesanierung & Baubetreuung',
        href: 'https://engesa.de/engesa',
      },
      {
        name: 'FENDOOR GmbH',
        sub: 'Fenster, Türen & Sonnenschutz',
        href: 'https://www.fendoor-fenster.de/home',
      },
      {
        name: 'E.G.I. Laferla Isolierungen',
        sub: 'Wärme-, Kälte-, Schall- & Brandschutzisolierung in Ingersheim',
        href: 'https://www.laferla.de/',
      },
      {
        name: 'GH-Gerüstbau',
        sub: 'Gerüstbau für Neubau, Sanierung und Fassaden',
        href: 'https://gh-geruest.de/',
      },
    ],
  },
  {
    title: 'Hersteller & Lieferanten',
    links: [
      { name: 'Sto', href: 'https://www.sto.de/s/' },
      { name: 'Brillux', href: 'https://www.brillux.de/home/' },
      { name: 'Mapei', href: 'https://www.mapei.com/de/de-de/startseite' },
      { name: 'Mega', href: 'https://www.mega.de/' },
      { name: 'Farben Heim', href: 'https://farben-heim.de/' },
      { name: 'Oikos', href: 'https://www.oikos-paint.de/' },
      { name: 'Resine Nativus', href: 'https://resinenativus.it/de/' },
      { name: 'Ardex', href: 'https://www.ardex.de/' },
      { name: 'Otto Chemie', href: 'https://www.otto-chemie.de/bau' },
      { name: 'Schomburg', href: 'https://www.schomburg.com/de/de' },
      { name: 'Würth', href: 'https://www.wuerth.de/' },
      { name: 'Schlüter Systems', href: 'https://eu.schluter.com/de-DE/' },
      { name: 'Kemmler', href: 'https://www.kemmler.de/kemmler-baustoffe' },
      { name: 'Raab Karcher', href: 'https://www.raabkarcher.de/' },
      { name: 'Taxis', href: 'https://www.taxis.de/willkommen/' },
      { name: 'Wagner', href: 'https://www.wagner-group.com/de/handwerker/' },
      {
        name: 'Festool',
        href: 'https://www.festool.de/',
      },
      { name: 'Mirka', href: 'https://www.mirka.com/de-de/' },
      { name: 'Metabo', href: 'https://www.metabo.com/de/de' },
      { name: 'Pavan Spa', href: 'https://www.pavanspa.it/en/' },
      { name: 'Nela Tools', href: 'https://nela-tools.com/stainless-steel-putty-knife' },
      {
        name: 'Storch',
        href: 'https://shop.storch.de/de/',
      },
      { name: 'Pajarito', href: 'https://de.pajarito-tools.com/' },
    ],
  },
];
