// Inhalte der Seite /meisterwerk-exklusive/ (Texte, Alt-Texte und Links wie im Original)
import hBaeder from '../../assets/img/248-meisterwerk-20230120-Bearbeitet-scaled-1.jpg';
import hBoeden from '../../assets/img/22-bf-20241206-Bearbeitet-scaled.jpg';
import hOberflaechen from '../../assets/img/001-meisterwerk-20230508-HDR-scaled.jpg';
import hSpachtel from '../../assets/img/31-mw-20241125-HDR-scaled.jpg';
import hStuck from '../../assets/img/2014-meisterwerk-20230524-Bearbeitet-scaled.jpg';
import bad from '../../assets/img/079-meisterwerk-20230508-Bearbeitet-scaled.jpg';
import badUnten from '../../assets/img/237-meisterwerk-20230120-Bearbeitet-scaled-e1750844889342.jpg';
import badRechts from '../../assets/img/258-meisterwerk-20230120-Bearbeitet-scaled-e1751019528712.jpg';
import baeder from '../../assets/img/testets-e1751263512485.webp';
import boeden from '../../assets/img/testetsgd-e1751263534354.webp';
import spachtel from '../../assets/img/146-meisterwerk-20230120-scaled-e1751230173983.jpg';
import stuck from '../../assets/img/285-meisterwerk-20230120-scaled-e1751230260731.jpg';
import armatur from '../../assets/img/307-meisterwerk-20230120-scaled.jpg';
import wohnen from '../../assets/img/Image-21.jpg';
import lotter from '../../assets/img/069-meisterwerk-20230508-Bearbeitet.jpg';
import masterbad from '../../assets/img/fugenlos-1.jpg';
import concrete from '../../assets/img/117-meisterwerk-20230120-Bearbeitet-scaled.jpg';
import sketch from '../../assets/img/2985394.svg';
import type { Part, Faq } from '../faq';

export const meta = {
  title: 'Spachteltechnik & Fugenloses Design | Meisterwerke Exklusive',
  description:
    'Exklusive fugenlose Bäder & Böden vom Experten. Edle Spachteltechniken für Ihr Zuhause. Langlebig, modern & pflegeleicht. Jetzt Beratung vereinbaren!',
};

const KONTAKT = '/meisterwerk-exklusive/kontakt/';

export const hero = [
  {
    word: 'Exklusive Oberflächen',
    image: hOberflaechen,
    alt: 'Exklusive Oberflächen von Meisterwerk Exklusive',
    color: 'text-white',
    anim: 'fadeInLeft',
  },
  {
    word: 'Fugenlose Bäder',
    image: hBaeder,
    alt: 'Fugenloses Bad von Meisterwerk Exklusive',
    color: 'text-ink',
    anim: 'fadeInDown',
  },
  {
    word: 'Fugenlose Böden',
    image: hBoeden,
    alt: 'Fugenloser Boden von Meisterwerk Exklusive',
    color: 'text-soft',
    anim: 'fadeInUp',
  },
  {
    word: 'Spachteltechniken',
    image: hSpachtel,
    alt: 'Spachteltechnik von Meisterwerk Exklusive',
    color: 'text-soft',
    anim: 'fadeIn',
  },
  {
    word: 'Stuckleisten',
    image: hStuck,
    alt: 'Stuckleisten von Meisterwerk Exklusive',
    color: 'text-soft',
    anim: 'fadeInUp',
  },
];

export const welcome = {
  image: bad,
  imageAlt:
    'Exklusive Bad-Ausstellung mit mineralischer Wandspachteltechnik, Ornament-Prägung und Altholz-Waschtischen in Ludwigsburg.',
  heading: 'Willkommen bei Meisterwerke — <br /> Exklusive Oberflächen',
  paragraphs: [
    'Tauchen Sie ein in die Welt hochwertiger Oberflächen und moderner Badgestaltung: Bei Meisterwerk steht Ihr persönlicher Wohlfühlraum im Mittelpunkt. Wir sind spezialisiert auf exklusive, fugenlose Bäder und innovative Spachteltechniken, die Ihrem Bad einen unverwechselbaren Look verleihen. Unsere individuellen Lösungen werden mit größter Sorgfalt und handwerklichem Können umgesetzt – ganz nach Ihren Vorstellungen.',
    'Ob Sie Wert auf Nachhaltigkeit, zeitlose Eleganz oder eine moderne Ästhetik legen: Mit unseren maßgeschneiderten Oberflächen verwandeln wir Ihr Bad in ein echtes Highlight. Entdecken Sie unsere Vielfalt an Gestaltungsmöglichkeiten und lassen Sie sich inspirieren, wie aus Ihren Ideen ein echtes Meisterwerk entsteht. Wir begleiten Sie von der ersten Beratung bis zur professionellen Umsetzung – für ein Ergebnis, das überzeugt.',
  ],
  cta: { label: 'Preis berechnen', href: KONTAKT },
};

export const intro = {
  heading: 'Meisterwerke — <br /> Individuelle Oberflächen &amp; Spachteltechniken',
  images: [
    {
      src: badUnten,
      alt: 'Minimalistisches weißes Badezimmer mit fugenlosen Wänden, Kieselstein-Duschboden und modernen Chrom-Armaturen in Ludwigsburg.',
    },
    {
      src: badRechts,
      alt: 'Modernes fugenloses Badezimmer in hellen Naturtönen mit mineralischer Spachteltechnik und schwarzen Kontrast-Armaturen in Ludwigsburg.',
    },
  ],
};

export const leistungen = {
  eyebrow: 'Unsere Leistungen',
  heading:
    'Planen, gestalten, verwirklichen — <br /> Bäder und Oberflächen, die zu Ihrem Lebensstil passen',
  cards: [
    {
      href: '/meisterwerk-exklusive/fugenlose-baeder/',
      title: 'Fugenlose Bäder',
      img: baeder,
      alt: 'Fugenloses Badezimmer mit mineralischer Wand- und Bodenbeschichtung in hellem Greige und wandhängendem WC in Ludwigsburg.',
    },
    {
      href: '/meisterwerk-exklusive/fugenloser-boden/',
      title: 'Fugenlose Böden',
      img: boeden,
      alt: 'Großflächiger fugenloser mineralischer Boden in Sichtestrich-Optik in einem modernen offenen Wohnbereich in Stuttgart.',
    },
    {
      href: '/meisterwerk-exklusive/spachteltechniken/',
      title: 'Spachteltechniken',
      img: spachtel,
      alt: 'Exklusive mineralische Wandspachteltechnik in Anthrazit für eine moderne Wohnraumgestaltung in Ludwigsburg.',
    },
    {
      href: '/meisterwerk-exklusive/stuckleisten/',
      title: 'Stuckleisten',
      img: stuck,
      alt: 'Moderne Stuckleisten mit indirekter LED-Beleuchtung über einer dunkel gespachtelten Wand in Ludwigsburg.',
    },
  ],
};

export const philosophie = {
  eyebrow: 'Unsere Philosophie',
  heading: 'Individuelle Räume schaffen, die begeistern',
  image: armatur,
  alt: 'Detailaufnahme von verchromten Unterputz-Armaturen auf einer fugenlosen weißen Wandbeschichtung in einem modernen Badezimmer in Ludwigsburg.',
};

export const prinzipien = [
  {
    title: 'Individuelle Gestaltung als Grundprinzip – Räume, die Persönlichkeit widerspiegeln',
    text: 'Bei Meisterwerk verstehen wir uns als Gestalter von Lebensräumen, die mehr bieten als nur Funktionalität – sie sollen inspirieren, entspannen und begeistern. Unsere Philosophie basiert auf dem Anspruch, für jeden Kunden maßgeschneiderte Lösungen zu entwickeln, die genau zu seinem persönlichen Stil und seinen Bedürfnissen passen. Wir sind überzeugt, dass ein Bad oder ein Wohnraum nicht nur schön, sondern auch ein Spiegel der Persönlichkeit sein sollte.',
  },
  {
    title: 'Von der Idee bis zur Umsetzung – Handwerk mit Leidenschaft',
    text: 'Jedes Projekt beginnt für uns mit einem intensiven Austausch: Wir hören genau zu, welche Wünsche und Vorstellungen unsere Kunden haben, und entwickeln gemeinsam Ideen, die über Standardlösungen hinausgehen. Unsere langjährige Erfahrung und unser handwerkliches Können ermöglichen es uns, auch ungewöhnliche oder besonders anspruchsvolle Vorhaben zu realisieren. Dabei legen wir größten Wert auf höchste Qualität, nachhaltige Materialien und eine sorgfältige Ausführung.',
  },
  {
    title: 'Partnerschaftliche Begleitung für nachhaltige Ergebnisse',
    text: 'Wir verstehen unsere Arbeit als Partnerschaft – vom ersten Gespräch bis zur Fertigstellung begleiten wir unsere Kunden eng und transparent. Unser Ziel ist es, Räume zu schaffen, in denen sich Menschen rundum wohlfühlen und die sie mit Stolz zeigen. Für uns ist jedes Bad, jede Oberfläche ein Meisterwerk, das wir mit Leidenschaft und Präzision gestalten. So entstehen Wohlfühlräume, die überzeugen und lange Freude bereiten.',
  },
];

export const banner = {
  image: concrete,
  lead: 'Lassen Sie uns etwas Einzigartiges schaffen — gemeinsam.',
  button: { label: 'Preis berechnen', href: KONTAKT },
  heading: 'Jede Oberfläche ist einzigartig. <br /> Genauso wie unser Ansatz.',
};

export const projekte = {
  heading: 'Unsere Exklusive Projekte',
  link: '/meisterwerk-exklusive/projekte/',
  items: [
    {
      title: 'Fugenlos Wohnen',
      href: '/meisterwerk-exklusive/2025/05/22/fugenloses-wohnen/',
      img: wohnen,
      alt: 'Modernes Wohnkonzept mit fugenlosem mineralischem Boden, Sichtbeton-Säule und glatten weißen Wänden in Stuttgart.',
    },
    {
      title: 'Spachteltechnik für Lotter Bäderausstellung',
      href: '/meisterwerk-exklusive/2025/05/03/spachteltechnik-fuer-lotter-baederausstellung/',
      img: lotter,
      alt: 'Exklusive mineralische Wandspachteltechnik in Grau in einem modernen offenen Wohn- und Geschäftsbereich in Ludwigsburg.',
    },
    {
      title: 'Masterbad Fugenlos',
      href: '/meisterwerk-exklusive/2021/05/01/masterbad-fugenlos/',
      img: masterbad,
      alt: 'Luxuriöses fugenloses Badezimmer mit mineralischer Wand- und Bodenbeschichtung sowie beleuchteten Wandnischen in Ludwigsburg.',
    },
  ],
};

export const vorgehen = {
  heading:
    'Unser Vorgehen: Klarheit, Individualität und Partnerschaft für außergewöhnliche Oberflächen',
  intro:
    'Damit aus Ihren Ideen ein echtes Meisterwerk wird, begleiten wir Sie Schritt für Schritt – klar, individuell und im engen Austausch mit Ihnen.',
  image: sketch,
  alt: '',
  faqs: [
    {
      q: 'Klar strukturierte Schritte',
      a: 'Wir legen großen Wert auf einen transparenten Ablauf, damit Sie jederzeit wissen, wo Sie stehen. Von der ersten Beratung über die Auswahl der Materialien bis hin zur finalen Umsetzung begleiten wir Sie Schritt für Schritt durch den gesamten Prozess. So stellen wir sicher, dass keine Fragen offen bleiben und Sie sich jederzeit gut aufgehoben fühlen.',
    },
    {
      q: 'Individueller Rhythmus',
      a: 'Jedes Projekt hat seinen eigenen Charakter – daher passen wir unser Vorgehen flexibel an Ihre Wünsche und zeitlichen Vorgaben an. Wir nehmen uns die Zeit, Ihre Vorstellungen genau zu verstehen und setzen diese mit viel Sorgfalt und Liebe zum Detail um. Dabei achten wir stets darauf, dass Qualität und Nachhaltigkeit im Mittelpunkt stehen.',
    },
    {
      q: 'Gemeinsamer Arbeitsfluss',
      a: 'Wir verstehen uns als zuverlässiger Partner an Ihrer Seite. Im engen Austausch mit Ihnen entwickeln wir gemeinsam kreative Lösungen, die genau zu Ihrem Stil und Ihren Bedürfnissen passen. Durch regelmäßige Rückmeldungen und transparente Kommunikation entsteht so ein harmonischer Arbeitsprozess, in dem Ihre Ideen optimal verwirklicht werden.',
    },
  ].map((f): Faq => ({ q: f.q, a: [{ type: 'p', parts: [f.a] satisfies Part[] }] })),
};
