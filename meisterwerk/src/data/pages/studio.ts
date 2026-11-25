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
  href: '/studio/#gedenken',
  img: vincenzo,
  alt: 'In Erinnerung an Vincenzo Fortino. Meisterwerk Ludwigsburg.',
};

export const memorial = 'In Gedenken an:';

/**
 * Gedenk-Block auf „Über uns“: Lebensdaten, Einleitung und Motto. Der Text stammt unverändert von der früheren Gedenkseite
 * /vincenzo-fortino/ (jetzt Weiterleitung auf /studio/), nicht umschreiben.
 */
export const founderMemorial = {
  dates: '*1963 †2020',
  intro: "<p><em>Familienvater. Handwerker. Herzensmensch.</em></p><p>Vincenzo Fortino war weit mehr als ein Teil unseres Betriebs, <strong>er war das Herzstück</strong>. Als gelernter Fliesenleger mit 41 Jahren Berufserfahrung prägte er unsere Arbeit nicht nur mit handwerklicher Präzision, sondern auch mit Menschlichkeit, Humor und bemerkenswerter Ruhe.</p><p>Er war Vater von fünf Kindern, drei davon, <strong>Baldassarre, Lorenzo und Fabio</strong>, hatten die große Ehre, mit ihm Seite an Seite auf der Baustelle zu stehen. Für sie, für uns alle, war er <strong>Vorbild, Ratgeber und Retter in jeder Lage</strong>.</p><p>Sein ganzes Können lag im Fliesenlegen. Es war nicht nur ein Beruf, sondern sein persönlicher Stolz. Doch Vincenzo war mehr als seine Rolle: Er war da, wenn man ihn brauchte. Oft, bevor jemand überhaupt merkte, dass Hilfe notwendig war.</p><p>Wo es brannte, löschte er, <strong>leise, lösungsorientiert, voller Hingabe</strong>. Immer mit einem Lächeln im Gesicht, einem lockeren Spruch auf den Lippen und einer Arbeit, die man mit gutem Gewissen als meisterhaft bezeichnen darf.</p>",
  motto: "<p><strong>Sein Motto:</strong> „Basta poco e che ce vo“: <em>„Im Leben braucht es nicht viel, um etwas zu verändern.“</em></p><p>Wir vermissen unseren Vater, Kollegen und Freund, <strong>täglich</strong>. Doch was bleibt, ist sein Geist, seine Haltung und sein Vermächtnis, <strong>in uns Kindern, im gesamten Team und in jeder Fläche, die er hinterlassen hat</strong>.</p>",
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
