// Inhalte der Seite /studio/ (Texte wie im Original; Profilseiten baut Team C, hier nur Links)
import baldassarre from '../../assets/img/baldassare_fortino.jpg';
import lorenzo from '../../assets/img/Fliesenleger-Vorarbeiter-Lorenzo-Fortino--scaled.jpg';
import fabio from '../../assets/img/Maler-u.-Lackierer-Gesele-Fabio-Fortino-scaled-e1753863865243.jpg';
import stefano from '../../assets/img/Maler-u.-Lackierer-Azubi-Stefano-Pulia-scaled.jpg';
import samet from '../../assets/img/platzhalter.jpg';
import vincenzo from '../../assets/img/Papa-Vincenzo-Fortino-e1753863670297.png';

export const meta = {
  title: 'Studio – Malermanufaktur für exklusives Design | Ludwigsburg & Stuttgart',
  description:
    'Erfahren Sie mehr über das Studio der Meisterwerk Malermanufaktur. Ihr Partner für puristische Ästhetik, fugenlose Systeme und exklusives Handwerk in Ludwigsburg & Stuttgart.',
};

export interface Member {
  name: string;
  role: string;
  href: string;
  img: ImageMetadata;
  alt: string;
}

export const team: Member[] = [
  {
    name: 'Baldassarre Fortino',
    role: 'Betriebsinhaber & Meister',
    href: '/baldassarre-fortino/',
    img: baldassarre,
    alt: 'Malermeister Baldassarre Fortino vom Malerbetrieb Meisterwerk Ludwigsburg.',
  },
  {
    name: 'Lorenzo Fortino',
    role: 'Vorarbeiter',
    href: '/lorenzo-fortino/',
    img: lorenzo,
    alt: 'Maler Lorenzo Fortino vom Betrieb Meisterwerk Ludwigsburg & Stuttgart.',
  },
  {
    name: 'Fabio Fortino',
    role: 'Maler- & Lackierer-Geselle',
    href: '/fabio-fortino/',
    img: fabio,
    alt: 'Maler- und Lackierergeselle Fabio Fortino vom Malerbetrieb Meisterwerk Ludwigsburg',
  },
  {
    name: 'Stefano Pulia',
    role: 'Auzubi im 3. Lehrjahr',
    href: '/stefano-pulia/',
    img: stefano,
    alt: 'Maler Stefano Pulia vom Fachbetrieb Meisterwerk Ludwigsburg & Stuttgart.',
  },
  {
    name: 'Samet Erenuglu',
    role: 'Auszubildender im 1. Lehrjahr',
    href: '/samet-erenuglu/',
    img: samet,
    alt: 'Auszubildender Maler Samet Erenuglu vom Malerbetrieb Meisterwerk Ludwigsburg & Stuttgart.',
  },
];

export const founder: Member = {
  name: 'Vincenzo Fortino',
  role: 'Gründer',
  href: '/vincenzo-fortino/',
  img: vincenzo,
  alt: 'In Erinnerung an Vincenzo Fortino – Meisterwerk Ludwigsburg.',
};

export const memorial = 'In gedenken an:';

// Weiche Trennstriche (U+00AD) wie im Original
export const timeline = [
  {
    date: 'Mai 2014',
    text: 'Gründung des Malerei­betriebs durch Baldassarre Fortino – der erste Schritt in die Selbständig­keit.',
  },
  {
    date: '2014 – 2015',
    text: 'Start im Elternhaus in Ludwigs­burg – erste Projekte, erste Kunden und eine wachsende Vision.',
  },
  {
    date: '2015 – 2017',
    text: 'Umzug in eine eigene Werk­statt in Aldingen, während das Büro zu Hause blieb.',
  },
  {
    date: '2017 – 2024',
    text: 'Dritter Standort in Bitten­feld mit Show­room eröffnet und neue Werk­statt in Freiberg etabliert.',
  },
  {
    date: '2024',
    text: 'Zentral­isierung aller Bereiche in Freiberg unter einem Dach – Büro, Lager, Show­room und Werk­statt.',
  },
];

export const haltung = {
  eyebrow: 'MEISTERWERK: Handwerk mit Ausdruck.',
  heading: 'Unsere Haltung: Weniger ist Meisterwerk.',
  html: [
    'Reduktion ist für uns Luxus. Materialien, Oberflächen und Strukturen sprechen für sich, ehrlich, unverfälscht und mit klarer Aussage.',
    '<strong>Meisterwerk bedeutet:</strong>',
    {
      list: [
        'Handwerk ohne Kompromisse – präzise und von Fachkräften ausgeführt.',
        'Puristische Ästhetik – fugenlose Systeme, edle Spachtelmassen und ehrliche Materialien verleihen Räumen Charakter.',
        'Nachhaltigkeit – langlebige Lösungen mit bewusstem Materialeinsatz.',
        'Innovation & Technik – moderne Verfahren verbinden Design und Funktion auf hohem Niveau.',
      ],
    },
    'So schaffen wir Räume, die nicht nur schön aussehen, sondern auch wirken – minimalistisch, exklusiv, zeitlos.',
    '<strong>Unser Team – Leidenschaft trifft Präzision</strong><br />Ein eingespieltes Team aus Handwerkern, Oberflächenspezialisten und Designern. Gemeinsam setzen wir Kreativität, Erfahrung und Präzision ein, um einzigartige Lebens- und Arbeitswelten zu schaffen.',
    'Wir arbeiten leise, sauber und zuverlässig. Jedes Projekt ist ein Unikat mit Charakter.',
  ] as (string | { list: string[] })[],
  toggle: 'Unsere Geschichte',
};
