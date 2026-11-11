// Inhalte der Seite /studio/ (Texte wie im Original; Profilseiten baut Team C, hier nur Links)
import baldassarre from '../../assets/img/baldassare_fortino.jpg';
import lorenzo from '../../assets/img/Fliesenleger-Vorarbeiter-Lorenzo-Fortino--scaled.jpg';
import fabio from '../../assets/img/Maler-u.-Lackierer-Gesele-Fabio-Fortino-scaled-e1753863865243.jpg';
import samet from '../../assets/img/Maler-u.-Lackierer-Azubi-Samet-Erenuglu.jpg';
import vincenzo from '../../assets/img/Papa-Vincenzo-Fortino.jpg';

export const meta = {
  title: 'Studio und Team in Freiberg',
  description:
    'Das Studio der Meisterwerk Malermanufaktur: Ihr Partner für puristische Ästhetik, fugenlose Systeme und exklusives Handwerk in Ludwigsburg und Stuttgart.',
};

export interface Member {
  name: string;
  role: string;
  href: string;
  img: ImageMetadata;
  alt: string;
  /** Noch kein Foto vorhanden: Das Team-Akkordeon zeigt dann ein Monogramm statt des Platzhalterbilds. */
  noPhoto?: boolean;
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
  alt: 'In Erinnerung an Vincenzo Fortino. Meisterwerk Ludwigsburg.',
};

export const memorial = 'In Gedenken an:';

/** Gedenk-Block auf „Über uns“ (Handy und Tablet): Lebensdaten und Leitsatz wie auf der Gedenkseite */
export const founderMemorial = {
  dates: '*1963 †2020',
  line: 'Familienvater. Handwerker. Herzensmensch.',
  cta: 'Zur Gedenkseite',
};

// Weiche Trennstriche (U+00AD) wie im Original
export const timeline = [
  {
    date: 'Mai 2014',
    text: 'Gründung des Malerei­betriebs durch Baldassarre Fortino, der erste Schritt in die Selbständig­keit.',
  },
  {
    date: '2014–2015',
    text: 'Start im Elternhaus in Ludwigs­burg, erste Projekte, erste Kunden und eine wachsende Vision.',
  },
  {
    date: '2015–2017',
    text: 'Umzug in eine eigene Werk­statt in Aldingen, während das Büro zu Hause blieb.',
  },
  {
    date: '2017–2024',
    text: 'Dritter Standort in Bitten­feld mit Show­room eröffnet und neue Werk­statt in Freiberg etabliert.',
  },
  {
    date: '2024',
    text: 'Zentral­isierung aller Bereiche in Freiberg unter einem Dach: Büro, Lager, Show­room und Werk­statt.',
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
        'Handwerk mit Anspruch: präzise, von Fachkräften ausgeführt und mit dem Ziel, aus jedem Objekt das Beste herauszuholen.',
        'Puristische Ästhetik: fugenlose Systeme, edle Spachtelmassen und ehrliche Materialien verleihen Räumen Charakter.',
        'Nachhaltigkeit: langlebige Lösungen mit bewusstem Materialeinsatz.',
        'Innovation & Technik: moderne Verfahren verbinden Design und Funktion auf hohem Niveau.',
      ],
    },
    'So schaffen wir minimalistische, zeitlose Räume, die gut aussehen und wirken.',
    '<strong>Unser Team: Leidenschaft trifft Präzision</strong><br />Ein eingespieltes Team aus Handwerkern, Oberflächenspezialisten und Designern. Gemeinsam setzen wir Kreativität, Erfahrung und Präzision ein, um einzigartige Lebens- und Arbeitswelten zu schaffen.',
    'Wir arbeiten leise, sauber und zuverlässig. Jedes Projekt ist ein Unikat mit Charakter.',
  ] as (string | { list: string[] })[],
  toggle: 'Unsere Geschichte',
};
