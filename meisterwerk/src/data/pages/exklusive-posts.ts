/**
 * Projektbeiträge der Teil-Website /meisterwerk-exklusive/ (live von meisterwerk-lb.de gelesen).
 * Eine Route `meisterwerk-exklusive/[year]/[month]/[day]/[slug]` rendert alle. Bilder: Dateinamen in `src/assets/img`.
 */
import type { Post } from './posts';

export interface ExklusivPost extends Post {
  /** Seitentitel (Original: „<Titel> - Meisterwerke Exklusive“). */
  pageTitle: string;
  category: string;
  categoryHref: string;
  /** Datum unter der Überschrift, z. B. „Mai / 2025“. */
  date: string;
  imageAlt: string;
  /** Spalten der Galerie je Desktop, Tablet, Handy. */
  galleryColumns: [number, number, number];
}

/** Karten im Bereich „Related“ (im Original auf allen drei Beiträgen dieselben zwei). */
export const related: {
  href: string;
  image: string;
  alt: string;
  category: string;
  categoryHref: string;
  title: string;
}[] = [
  {
    href: '/meisterwerk-exklusive/2025/05/03/spachteltechnik-fuer-lotter-baederausstellung/',
    image: '069-meisterwerk-20230508-Bearbeitet.jpg',
    alt: 'Exklusive mineralische Wandspachteltechnik in Grau in einem modernen offenen Wohn- und Geschäftsbereich in Ludwigsburg.',
    category: 'Spachteltechnik',
    categoryHref: '/meisterwerk-exklusive/category/portfolio/spachteltechnik/',
    title: 'Spachteltechnik für Lotter Bäderausstellung',
  },
  {
    href: '/meisterwerk-exklusive/2021/05/01/masterbad-fugenlos/',
    image: 'fugenlos-1.jpg',
    alt: 'Luxuriöses fugenloses Badezimmer mit mineralischer Wand- und Bodenbeschichtung sowie beleuchteten Wandnischen in Ludwigsburg.',
    category: 'Fugenloses Bad',
    categoryHref: '/meisterwerk-exklusive/category/portfolio/fugenloses-bad/',
    title: 'Masterbad Fugenlos',
  },
];

export const exklusivPosts: ExklusivPost[] = [
  {
    year: '2025',
    month: '05',
    day: '22',
    slug: 'fugenloses-wohnen',
    title: 'Fugenlos Wohnen',
    pageTitle: 'Fugenlos Wohnen - Meisterwerke Exklusive',
    category: 'Fugenloser Boden',
    categoryHref: '/meisterwerk-exklusive/category/portfolio/fugenloser-boden/',
    date: 'Mai / 2025',
    image: 'Image-21.jpg',
    imageAlt:
      'Modernes Wohnkonzept mit fugenlosem mineralischem Boden, Sichtbeton-Säule und glatten weißen Wänden in Stuttgart.',
    services: ['Fugenlose Böden', 'Malerarbeiten'],
    info: {
      year: '2018',
      place: 'Karlsruhe',
      duration: '3 Wochen',
      area: '95',
    },
    sections: [
      {
        heading: 'Wunsch nach moderner Ästhetik: Fugenlos und klar',
        text: 'Die Intention unserer Kundinnen und Kunden beim Planen und Errichten ihres modernen Neubaus war klar definiert: Sie wünschten sich glatte, fugenlose Oberflächen für ein ruhiges, harmonisches Gesamtbild. Diese klare architektonische Linie sollte sowohl im Innen- als auch im Außenbereich konsequent umgesetzt werden – reduziert, elegant und zeitlos.',
      },
      {
        heading: 'Planung mit Blick fürs Detail',
        text: 'Um diesem Anspruch gerecht zu werden, mussten zahlreiche bauliche Feinheiten von Anfang an berücksichtigt werden. Dazu zählten unter anderem Setzungsspuren durch das Bauwerk, die Integration einer Fußbodenheizung sowie die großflächigen Fensterfronten, die besondere Anforderungen an den Wand- und Bodenanschluss stellten. Nur durch die ganzheitliche Betrachtung aller technischen und gestalterischen Aspekte konnte das gewünschte, nahezu makellose Ergebnis erzielt werden.',
      },
      {
        heading: 'Funktion trifft auf individuelle Gestaltung',
        text: 'Neben der ästhetischen Wirkung stand auch die Alltagstauglichkeit im Fokus: Die fugenlosen Oberflächen sollten nicht nur visuell überzeugen, sondern auch pflegeleicht, widerstandsfähig und langlebig sein. Farbton, Textur und Glanzgrad wurden daher in enger Abstimmung mit der Bauherrschaft individuell ausgewählt – für ein Ergebnis, das sowohl funktional als auch persönlich ist.',
      },
    ],
    gallery: [
      'Image-9-e1672933086352.jpg',
      'Image-20.jpg',
      'Image-14-e1672912602625.jpg',
      'Image-21.jpg',
    ],
    largeText: true,
    galleryColumns: [3, 3, 1],
  },
  {
    year: '2025',
    month: '05',
    day: '03',
    slug: 'spachteltechnik-fuer-lotter-baederausstellung',
    title: 'Spachteltechnik für Lotter Bäderausstellung',
    pageTitle: 'Spachteltechnik für Lotter Bäderausstellung - Meisterwerke Exklusive',
    category: 'Spachteltechnik',
    categoryHref: '/meisterwerk-exklusive/category/portfolio/spachteltechnik/',
    date: 'Mai / 2025',
    image: '069-meisterwerk-20230508-Bearbeitet.jpg',
    imageAlt:
      'Exklusive mineralische Wandspachteltechnik in Grau in einem modernen offenen Wohn- und Geschäftsbereich in Ludwigsburg.',
    services: ['Spachteltechnik'],
    info: {
      year: '2022',
      place: 'Ludwigsburg',
      duration: '1 Woche',
      area: '12',
    },
    sections: [
      {
        heading: 'Kooperation mit Stil und Anspruch',
        text: 'In unserem jüngsten Projekt hatten wir das Vergnügen, mit der renommierten Bäderausstellung Lotter in Ludwigsburg zusammenzuarbeiten – einem Unternehmen, das für Qualität, Designkompetenz und inspirierende Badwelten steht. Unser Auftrag bestand darin, eine Kojenwand gestalterisch aufzuwerten, sodass sie harmonisch mit den ausgestellten Badmöbeln und Fliesen korrespondiert. Nach intensiver Prüfung verschiedener Optionen fiel die Wahl auf eine hochwertige Kalkpress-Spachteltechnik.',
      },
      {
        heading: 'Kalkpress-Technik: Ästhetik und Funktion vereint',
        text: 'Diese Technik überzeugte nicht nur durch ihre edle Optik und die feine, individuelle Textur, sondern auch durch ihre technische Eignung: Kalkpress-Oberflächen sind besonders langlebig, feuchtigkeitsbeständig und perfekt für den Einsatz in Badezimmern geeignet. Das Ergebnis ist eine Wandgestaltung, die durch ihre elegante Zurückhaltung ebenso besticht wie durch handwerkliche Präzision – ein echter Blickfang in der Ausstellung.',
      },
      {
        heading: 'Ornamentik mit venezianischem Flair',
        text: 'Ein besonderes Highlight entstand in einem der Bäder: Hier haben wir sogenannte Stencils eingesetzt, um feine Ornamente direkt in die Spachteltechnik einzuarbeiten. Diese Dekore wurden thematisch auf „Venedig“ abgestimmt – verspielt, klassisch und dennoch modern interpretiert. So entstand eine individuelle Wandlösung, die das Gesamtbild des Raumes veredelt und dem Bad eine einzigartige, fast künstlerische Note verleiht.',
      },
    ],
    gallery: [
      '069-meisterwerk-20230508-Bearbeitet.jpg',
      '079-meisterwerk-20230508-Bearbeitet-scaled.jpg',
      '090-meisterwerk-20230508-Bearbeitet-scaled.jpg',
      '073-meisterwerk-20230508-Bearbeitet-1-scaled.jpg',
      '095-meisterwerk-20230508-scaled.jpg',
      '098-meisterwerk-20230508-scaled.jpg',
      '097-meisterwerk-20230508-scaled.jpg',
      '096-meisterwerk-20230508-scaled.jpg',
      '104-meisterwerk-20230508-scaled.jpg',
      '103-meisterwerk-20230508-scaled.jpg',
    ],
    largeText: true,
    galleryColumns: [2, 2, 1],
  },
  {
    year: '2021',
    month: '05',
    day: '01',
    slug: 'masterbad-fugenlos',
    title: 'Masterbad Fugenlos',
    pageTitle: 'Masterbad Fugenlos - Meisterwerke Exklusive',
    category: 'Fugenloses Bad',
    categoryHref: '/meisterwerk-exklusive/category/portfolio/fugenloses-bad/',
    date: 'Mai / 2021',
    image: 'fugenlos-1.jpg',
    imageAlt:
      'Luxuriöses fugenloses Badezimmer mit mineralischer Wand- und Bodenbeschichtung sowie beleuchteten Wandnischen in Ludwigsburg.',
    services: ['Fugenloses Bad'],
    info: {
      year: '2021',
      place: 'Ludwigsburg',
      duration: '2 Wochen',
      area: '15',
    },
    sections: [
      {
        heading: 'Reduziert, stilvoll und absolut dicht',
        text: 'Der Wunsch unseres Kunden war ein fugenloses Badezimmer, das durch schlichte Eleganz überzeugt – ohne sichtbare Unterbrechungen oder unnötige Strukturen. Ziel war eine einheitliche Oberfläche mit möglichst wenigen Fugen. Dank einer durchdachten Lösung und präziser Umsetzung entstand ein Bad, das nicht nur ästhetisch auf ganzer Linie überzeugt, sondern auch ohne zusätzliche Versiegelung vollständig wasserdicht ist. Dies wurde durch den Einsatz spezieller Materialien und Techniken realisiert, die höchste Beständigkeit und dauerhafte Dichtigkeit gewährleisten.',
      },
      {
        heading: 'Technische Expertise für höchste Ansprüche',
        text: 'Die Umsetzung eines fugenlosen Badezimmers erfordert tiefgehendes Fachwissen, präzise Planung und langjährige Erfahrung. In diesem Projekt konnten wir unsere Expertise voll einbringen – insbesondere bei den vorbereitenden Arbeiten wie dem Einbringen eines exakten Gefälleestrichs und der fachgerechten Abdichtung sämtlicher relevanter Bereiche. Durch die perfekte Abstimmung aller Gewerke und Schritte wurde ein Ergebnis erzielt, das sowohl funktional als auch optisch höchsten Ansprüchen genügt.',
      },
      {
        heading: 'Alles aus einer Hand – für reibungslose Abläufe',
        text: 'Ein zentraler Vorteil für unsere Kunden: Wir bieten alle Leistungen rund um das fugenlose Badezimmer aus einer Hand an. Das bedeutet: nur ein Ansprechpartner, klare Kommunikation, volle Kontrolle über den Projektfortschritt. Diese ganzheitliche Betreuung sorgt nicht nur für einen effizienteren Ablauf, sondern auch für Transparenz und Vertrauen – von der ersten Idee bis zur finalen Übergabe. Auch in diesem Projekt führte die enge Zusammenarbeit zu einem Ergebnis, mit dem unser Kunde voll und ganz zufrieden ist.',
      },
    ],
    gallery: [
      'fugenlos-1.jpg',
      'fugenlos-2.jpg',
      '260-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      '258-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      'Image-23.jpg',
      'Image-22.jpg',
      'Image-26.jpg',
      'Image-27.jpg',
      '255-meisterwerk-20230120-scaled-1.jpg',
      'Image-25.jpg',
      '44.jpg',
      '322-meisterwerk-20230120-scaled-1.jpg',
    ],
    largeText: true,
    galleryColumns: [2, 2, 1],
  },
];
