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
  title: 'Partner & Sponsoring - Meisterwerke Exklusive',
  description:
    'Partner, Sponsoring und Spenden der Meisterwerk Malermanufaktur: Vereine, Meisterbetriebe sowie Hersteller und Lieferanten.',
};

export const partnerGroups: PartnerGroup[] = [
  {
    title: 'Sponsor',
    links: [
      {
        name: 'FSV Ossweil 1924 e.V.',
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
        sub: 'Sicherer Transport für Neugeborene (Björn Steiger Stiftung)',
        href: 'https://www.steiger-stiftung.de/was-wir-tun/baby-notarztwagen/',
      },
    ],
  },
  {
    title: 'Partner Meister Betriebe',
    links: [
      {
        name: 'Madera Bedachungen',
        sub: 'Meisterbetrieb für Bedachungen & Sanierungen',
        href: 'https://www.madera-bedachungen.de/',
      },
      {
        name: 'Elektro Kiefler',
        sub: 'Elektrotechnik & Gebäudeinstallation',
        href: 'https://www.elektro-kiefler.de/',
      },
      {
        name: 'Münster Haustechnik',
        sub: 'Sanitär, Heizung & Klimatechnik',
        href: 'https://www.muenstergmbh.de/',
      },
      {
        name: 'Johannes Haustechnik',
        sub: 'Innovative Haustechnik-Lösungen',
        href: 'https://johannes-haustechnik.de/ueber-johannes-haustechnik/',
      },
      {
        name: 'Raummanufactur',
        sub: 'Professionelle Bodenverlegung & Parkett',
        href: 'https://raummanufactur.de/bodenverlegung.html',
      },
      {
        name: 'Kälte-Technik Pleidelsheim',
        sub: 'Klima- & Kältesysteme',
        href: 'https://coldarts.eu/',
      },
      { name: 'Nrebau', sub: 'Bauunternehmen für Neubau & Sanierung', href: 'https://nrebau.de/' },
      {
        name: 'Engesa',
        sub: 'Fliesenleger-Fachbetrieb & Sanierung',
        href: 'https://engesa.de/engesa',
      },
      {
        name: 'Fendoor Fenster',
        sub: 'Hochwertige Fenster- & Türsysteme',
        href: 'https://www.fendoor-fenster.de/home',
      },
      {
        name: 'Laferla',
        sub: 'Meisterbetrieb für Haustechnik & Fliesen',
        href: 'https://www.laferla.de/',
      },
      {
        name: 'GH-Gerüstbau',
        sub: 'FÜR JEDES PROJEKT DIE PERFEKTE STÜTZE',
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
        href: 'https://www.festool.de/?srsltid=AfmBOorRhr4vRHHV9dLjnBA5MYG7smGqcy4ZtonpYQzCrV3Mve8CJyPo',
      },
      { name: 'Mirka', href: 'https://www.mirka.com/de-de/' },
      { name: 'Metabo', href: 'https://www.metabo.com/de/de' },
      { name: 'Pavan Spa', href: 'https://www.pavanspa.it/en/' },
      { name: 'Nela Tools', href: 'https://nela-tools.com/stainless-steel-putty-knife' },
      {
        name: 'Storch',
        href: 'https://shop.storch.de/de/?gad_source=1&gad_campaignid=21934043432&gbraid=0AAAAAD_VBfiBPBlNsromxpauTmssh_64m&gclid=Cj0KCQiA7rDMBhCjARIsAGDBuEB_62SyOYIRErc_376ldcNhpvU7lFmk_WCIv42Ufh8Mh9wkBq3yz1YaAt03EALw_wcB',
      },
      { name: 'Pajarito', href: 'https://de.pajarito-tools.com/' },
    ],
  },
];
