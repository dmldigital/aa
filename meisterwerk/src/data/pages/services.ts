// Inhalte der Leistungsseiten /services/<slug>/ (Texte, Alt-Texte und Meta wie im Original, live ausgelesen)
import { img } from '../../lib/img';

/** Spalte der Bildergruppe: Breite in % (Desktop, Tablet), Bilder untereinander */
export interface ShowcaseColumn {
  width: [number, number];
  images: string[];
  /** Bilder senkrecht mittig in der Spalte (sonst oben) */
  center?: boolean;
}

export interface ServicePage {
  slug: string;
  title: string;
  description: string;
  hero: { title: string; text: string; img: ImageMetadata; alt: string };
  intro: {
    img: ImageMetadata;
    alt: string;
    label: string;
    title: string;
    list: string;
    blocks: { no: string; title: string; html: string }[];
  };
  /** Bildergruppe (Original e9ec5aa) ... */
  showcase?: ShowcaseColumn[];
  /** ... oder Galerie (Original aa57ee6, nur Glatte Wände) */
  gallery?: string[];
  pillars: { title: string; html: string }[];
}

export const BUTTON = {
  label: 'Lassen Sie sich inspirieren – und Ihren Preis berechnen',
  href: '/kontakt/',
};
export const EXCELLENCE = 'Exzellenz ist unser Maßstab';

export const services: ServicePage[] = [
  {
    slug: 'malerarbeiten',
    title: 'Professionelle Malerarbeiten | Ludwigsburg & Stuttgart – Meisterwerk',
    description:
      'Exklusive Malerarbeiten für Ihr Zuhause. Wir bieten präzise Anstriche, Farbberatung & höchste Sauberkeit in Ludwigsburg & Stuttgart. Jetzt loslegen!',
    hero: {
      title: 'Malerarbeiten – Farben, die Ihrem Zuhause Persönlichkeit verleihen!',
      text: 'Ihre Vision, unser Handwerk - Professionelle Malerarbeiten sind mehr als ein neuer Anstrich – sie verwandeln Räume in lebendige und stilvolle Lebenswelten. Bei der Meisterwerk Maler Manufaktur setzen wir auf höchste Präzision, Qualität und Liebe zum Detail. Unser Ziel ist es, Ihre Räume durch frische Farben und perfekte Oberflächen zu einem echten Meisterwerk zu machen.',
      ...{
        img: img('216-meisterwerk-20230120-Bearbeitet-1-scaled-e1758184263171.jpg'),
        alt: 'Professionelle Malerarbeiten in einem Wohnzimmer in Ludwigsburg – Meisterwerk.',
      },
    },
    intro: {
      ...{ img: img('2025-meisterwerk-20230524-HDR-3-scaled.jpg'), alt: '' },
      label: 'Die Vorteile auf einen Blick',
      title: 'Vorteile professioneller Malerarbeiten',
      list: '<ul><li><p><strong>Perfekte Oberflächen</strong>: Glatte Wände, exakte Kanten, hochwertige Farben.</p></li><li><p><strong>Individuelle Gestaltung</strong>: Von klassisch bis modern – wir passen Farben und Techniken Ihren Wünschen an.</p></li><li><p><strong>Langlebigkeit</strong>: Unsere hochwertigen Materialien sorgen für dauerhafte Ergebnisse.</p></li><li><p><strong>Sauberes Arbeiten</strong>: Wir arbeiten professionell, termingerecht und achten auf Sauberkeit in Ihrem Zuhause.</p></li><li><p><strong>Farbberatung inklusive</strong>: Wir helfen Ihnen, die passenden Farben und Stimmungen für Ihre Räume zu finden.</p></li></ul>',
      blocks: [
        {
          no: '01',
          title: 'Materialien & Techniken',
          html: '<p>Wir verwenden ausschließlich <strong>hochwertige Farben, Lacke und Materialien</strong> renommierter Hersteller. Egal ob Innen- oder Außenanstrich, Spezialtechniken wie Lasuren, Wischtechniken oder Tapezierarbeiten – wir kombinieren <strong>Tradition und moderne Techniken</strong> für perfekte Ergebnisse.</p><h3 aria-hidden="true">&nbsp;</h3>',
        },
        {
          no: '02',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Präzises Arbeiten</strong>: Exakte Kanten, saubere Übergänge, professionelle Vorbereitung der Untergründe.</p></li><li><p><strong>Modernste Techniken</strong>: Spritz- und Rollverfahren, kreative Oberflächengestaltungen, langlebige Farben.</p></li><li><p><strong>Umweltfreundlich</strong>: Einsatz von schadstoffarmen und nachhaltigen Materialien.</p></li></ul>',
        },
      ],
    },
    showcase: [
      {
        width: [14.762, 13.31],
        images: [
          '142-bf-20241206-Bearbeitet-1-scaled.jpg',
          '296-meisterwerk-20230120-scaled.jpg',
          '209-meisterwerk-20230120-1-scaled.jpg',
        ],
      },
      { width: [40.446, 41.36], images: ['2000-meisterwerk-20230524-Bearbeitet-3-scaled.jpg'] },
      { width: [40.446, 41.36], images: ['2109-meisterwerk-20230524-Bearbeitet-2-scaled.jpg'] },
    ],
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Unser Team besteht ausschließlich aus <strong>erfahrenen Fachkräften</strong>, die ihr Handwerk verstehen und mit Leidenschaft arbeiten. Jeder Anstrich, jede Wand wird präzise und sorgfältig ausgeführt.</p><ul><li><p>Langjährige Erfahrung im Malerhandwerk</p></li><li><p>Hochwertige Materialien für beste Ergebnisse</p></li><li><p>Individuelle Beratung und Umsetzung nach Ihren Wünschen</p></li></ul>',
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Wir setzen auf Farben und Materialien, die sowohl ästhetisch überzeugen als auch funktional langlebig sind. Ob Renovierung, Neuanstrich oder Gestaltung von Akzentwänden – wir liefern <strong>Meisterwerke für Ihr Zuhause</strong>.</p>',
      },
      {
        title: 'Ihr Weg zu neuen Räumen',
        html: '<p>Von der <strong>Beratung über die Farbauswahl bis zur Umsetzung</strong> begleiten wir Sie Schritt für Schritt. Mit der <strong>Meisterwerk Maler Manufaktur</strong> erhalten Ihre Räume einen neuen Glanz – präzise, sauber und professionell ausgeführt.</p>',
      },
    ],
  },
  {
    slug: 'tapezieren',
    title: 'Exklusive Tapezierarbeiten | Ludwigsburg & Stuttgart – Meisterwerk',
    description:
      'Verwandeln Sie Ihre Wände in echte Blickfänge. Professionelle Tapezierarbeiten mit Fachberatung in Ludwigsburg , Stuttgart & Region',
    hero: {
      title: 'Tapezierarbeiten – Verwandeln Sie Ihre Wände in echte Blickfänge!',
      text: 'Tapezieren ist eine elementare Tätigkeit in unserem Malerbetrieb und dient der Neugestaltung oder Umgestaltung einer Wohnung oder eines Hauses. Zu diesem Zweck befestigen wir Tapeten an Decken und Wänden, sodass schöne und ansprechende Stimmungen entstehen. Für ein langfristig stabiles und hochwertiges Ergebnis sorgen wir mittels präziser Arbeit und dem Einsatz erstklassiger Materialien. Darüber hinaus steht Ihnen unser Malermeister Baldassarre Fortino persönlich für die Beratung über die richtige Tapete und deren optimale Umsetzung zur Seite. Unser Ziel ist es, Ihre Wände in echte Meisterwerke zu verwandeln – ästhetisch, präzise und langlebig.',
      ...{
        img: img('194-meisterwerk-20230120-1-scaled-e1758184305428.jpg'),
        alt: 'Präzise Tapezierarbeiten mit Mustertapete in Ludwigsburg – Meisterwerk Malermanufaktur.',
      },
    },
    intro: {
      ...{ img: img('165-bf-20241206-Bearbeitet-scaled.jpg'), alt: '' },
      label: 'Die Vorteile auf einen Blick',
      title: 'Vorteile professioneller Tapezierarbeiten',
      list: '<ul><li><p><strong>Perfekte Oberflächen</strong>: Saubere Kanten, glatte Flächen, exakte Musteranpassung.</p></li><li><p><strong>Individuelle Gestaltung</strong>: Von klassischen Tapeten über moderne Vliestapeten bis hin zu besonderen Designs – wir setzen Ihre Wünsche um.</p></li><li><p><strong>Langlebigkeit</strong>: Hochwertige Tapeten und fachgerechte Verarbeitung sorgen für dauerhafte Schönheit.</p></li><li><p><strong>Sauberes Arbeiten</strong>: Wir arbeiten präzise, termingerecht und hinterlassen ein gepflegtes Zuhause.</p></li><li><p><strong>Fachberatung inklusive</strong>: Wir helfen Ihnen bei der Auswahl von Tapeten, Farben und Mustern, die perfekt zu Ihren Räumen passen.</p></li></ul>',
      blocks: [
        {
          no: '01',
          title: 'Materialien & Techniken',
          html: '<p>Unser Team bietet zudem weitere <strong>Serviceleistungen im Bereich Interior Design</strong> an, um Räume völlig neu zu gestalten. Sei es die Auswahl und Installation der Tapeten oder die <strong>Vorbereitung des Untergrundes</strong> – unsere erfahrenen Maler kennen sich mit allen Aspekten des Tapezierens bestens aus. Wir arbeiten ausschließlich mit <strong>hochwertigen Tapeten und Klebstoffen</strong> führender Hersteller, um perfekte Ergebnisse zu erzielen.</p><h3 aria-hidden="true">&nbsp;</h3><h3 aria-hidden="true">&nbsp;</h3>',
        },
        {
          no: '02',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Exakte Verarbeitung</strong>: Keine Blasen, keine Falten – Ihre Tapeten sitzen perfekt.</p></li><li><p><strong>Muster- und Motivanpassung</strong>: Präzise Ausrichtung von Mustern für ein harmonisches Gesamtbild.</p></li><li><p><strong>Nachhaltigkeit &amp; Umweltfreundlichkeit</strong>: Einsatz umweltverträglicher Materialien und Klebstoffe.</p></li></ul>',
        },
      ],
    },
    showcase: [
      {
        width: [24.333, 23.88],
        images: [
          '188-meisterwerk-20230120-1-scaled.jpg',
          '4-bf-20241206-Bearbeitet-1-scaled.jpg',
          '159-bf-20241206-Bearbeitet-1-scaled.jpg',
        ],
      },
      { width: [66.667, 74.09], images: ['168-bf-20241206-scaled.jpg'], center: true },
    ],
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Unser Team besteht aus <strong>erfahrenen Tapezierprofis</strong>, die ihr Handwerk lieben und jedes Projekt mit höchster Sorgfalt ausführen. Präzision, Geduld und Liebe zum Detail sind die Basis jeder Tapezierarbeit.</p><ul><li><p>Langjährige Erfahrung im Tapezierhandwerk</p></li><li><p>Hochwertige Materialien für perfekte Ergebnisse</p></li><li><p>Individuelle Beratung und Umsetzung nach Ihren Vorstellungen</p></li></ul>',
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Wir verwenden nur Tapeten von führenden Herstellern, die ästhetisch überzeugen und langlebig sind. Jedes Projekt wird sorgfältig geplant und professionell umgesetzt – für Wände, die wirken und bleiben.</p><h4 aria-hidden="true">&nbsp;</h4>',
      },
      {
        title: 'Ihr Weg zu neuen Wänden',
        html: '<p>Von der <strong>Beratung über die Materialauswahl bis zur fachgerechten Umsetzung</strong> begleiten wir Sie Schritt für Schritt. Mit der <strong>Meisterwerk Maler Manufaktur</strong> erhalten Ihre Wände ein neues Gesicht – präzise, sauber und professionell.</p>',
      },
    ],
  },
  {
    slug: 'lackierarbeiten',
    title: 'Profi-Lackierarbeiten | Ludwigsburg & Stuttgart – Meisterwerk',
    description:
      'Türen, Fenster & Treppen in neuem Glanz. Hochwertige Lackierarbeiten für Innen & Außen in Ludwigsburg & Stuttgart. Schutz & Design vom Meisterbetrieb.',
    hero: {
      title: 'Lackierarbeiten – Erwecke Altes zu neuem Leben',
      text: 'Lackarbeiten bilden einen grundlegenden Aspekt unserer Tätigkeit als Meisterbetrieb. Sie verleihen Oberflächen nicht nur ein schönes Aussehen, sondern schützen sie gleichzeitig vor Witterung, UV-Strahlen oder Korrosion. Diese Arbeiten können sowohl drinnen als auch draußen angewendet werden – sei es beim Verschönern von Wohnungen, Büros oder Geschäften oder bei der Umsetzung kreativer Farbkonzepte. Zu unseren Leistungen gehört das Lackieren von Türen, Toren, Fenstern, Treppen, Geländern und weiteren Elementen aus Holz, Metall oder Kunststoff. Des Weiteren übernehmen wir selbstverständlich auch die Reparatur bereits beschädigter Oberflächen und die individuelle Gestaltung neuer Räume. Es gibt viele Arten des Verputzens, zum Beispiel aus Kalk oder Gips. Wir kennen uns bestens mit den unterschiedlichen Techniken aus und beraten Sie gerne, welche Materialien und Verfahren sich für Ihre Räume besonders eignen. So gestalten wir Ihre Räume stilvoll, modern und langlebig. Darüber hinaus steht Ihnen unser Malermeister Baldassarre Fortino persönlich für die Beratung über die richtige Tapete und deren optimale Umsetzung zur Seite. Unser Ziel ist es, Ihre Wände in echte Meisterwerke zu verwandeln – ästhetisch, präzise und langlebig.',
      ...{
        img: img('337-meisterwerk-20230120-4-scaled.jpg'),
        alt: 'Professionelle Lackierarbeiten an Holzfenstern in Ludwigsburg – Meisterwerk Malermanufaktur.',
      },
    },
    intro: {
      ...{ img: img('331-meisterwerk-20230120-scaled.jpg'), alt: '' },
      label: 'Die Vorteile auf einen Blick',
      title: 'Vorteile professioneller Lackierarbeiten',
      list: '<ul><li><p><strong>Schutz &amp; Langlebigkeit</strong>: Lackierte Oberflächen bleiben geschützt und behalten ihre Schönheit.</p></li><li><p><strong>Individuelle Gestaltung</strong>: Farben und Oberflächen können exakt an Ihre Vorstellungen angepasst werden.</p></li><li><p><strong>Innen &amp; Außen</strong>: Flexible Anwendung für alle Oberflächen im Haus, Büro oder Gewerbe.</p></li><li><p><strong>Präzision &amp; Qualität</strong>: Sorgfältige Ausführung garantiert hochwertige Ergebnisse.</p></li><li><p><strong>Beratung inklusive</strong>: Malermeister <strong>Baldassarre Fortino</strong> steht Ihnen für alle Fragen zur Auswahl von Farben und Techniken zur Verfügung.</p></li></ul>',
      blocks: [
        {
          no: '01',
          title: 'Materialien & Techniken',
          html: '<p>Unsere Lackierarbeiten werden ausschließlich von <strong>qualifiziertem Personal</strong> durchgeführt, das über technisches Know-how und ästhetisches Gespür verfügt. Wir verwenden <strong>hochwertige Lacke und Materialien</strong> führender Hersteller, um perfekte Oberflächen zu erzielen. Präzises Vorbereiten, Schleifen, Grundieren und Lackieren gehören selbstverständlich zu unserem Service.</p><h3 aria-hidden="true">&nbsp;</h3><h3 aria-hidden="true">&nbsp;</h3>',
        },
        {
          no: '02',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Exakte Verarbeitung</strong>: Glatte Oberflächen, gleichmäßige Farbschichten und saubere Kanten.</p></li><li><p><strong>Vielfältige Techniken</strong>: Lackieren, Lasieren oder kreatives Farbdesign nach Wunsch.</p></li><li><p><strong>Nachhaltigkeit &amp; Schutz</strong>: Langlebige Materialien sorgen für dauerhafte Freude an Ihren Oberflächen.</p></li></ul>',
        },
      ],
    },
    showcase: [
      {
        width: [24.333, 23.88],
        images: [
          '2014-meisterwerk-20230524-Bearbeitet-4-scaled.jpg',
          '2009-meisterwerk-20230524-Bearbeitet-3-scaled.jpg',
        ],
      },
      { width: [66.667, 74.09], images: ['2018-meisterwerk-20230524-Bearbeitet-3-scaled.jpg'] },
    ],
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Unser Team aus <strong>erfahrenen Lackierprofis</strong> arbeitet präzise und sorgfältig. Jede Fläche wird professionell behandelt, um <strong>ästhetisch perfekte und langlebige Ergebnisse</strong> zu erzielen.</p><ul><li><p>Langjährige Erfahrung im Lackierhandwerk</p></li><li><p>Hochwertige Materialien für perfekte Oberflächen</p></li><li><p>Individuelle Beratung und Umsetzung nach Ihren Wünschen</p></li></ul>',
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Wir setzen ausschließlich auf <strong>erstklassige Lacke und Werkzeuge</strong> führender Hersteller. So gewährleisten wir ein Ergebnis, das <strong>optisch überzeugt und dauerhaft schützt</strong>.</p><h4 aria-hidden="true">&nbsp;</h4><h4 aria-hidden="true">&nbsp;</h4><h4 aria-hidden="true">&nbsp;</h4>',
      },
      {
        title: 'Ihr Weg zu neuen Wänden',
        html: '<p>Von der <strong>Beratung über die Materialauswahl bis zur Umsetzung</strong> begleiten wir Sie Schritt für Schritt. Mit der <strong>Meisterwerk Maler Manufaktur</strong> erwecken Ihre Türen, Fenster, Treppen und Geländer zu neuem Leben – präzise, sauber und professionell.</p><p>&nbsp;</p><p>&nbsp;</p>',
      },
    ],
  },
  {
    slug: 'verputzen',
    title: 'Professionelle Verputzarbeiten | Ludwigsburg & Stuttgart – Meisterwerk',
    description:
      'Perfekte Wände von Grund auf. Wir bieten hochwertige Innen- & Außenputze sowie dekorative Oberflächen in Ludwigsburg & Stuttgart. Fachgerecht & langlebig.',
    hero: {
      title: 'Verputzarbeiten – Edle Strukturen für Ihre Wände und Decken!',
      text: 'Maler und Stuckateure führen anspruchsvolle Arbeiten am und im Haus durch – dazu gehört vor allem das Verputzen. Dabei entstehen glatte und hochwertige Oberflächen an Wänden und Decken. Diese Arbeit erfordert viel Geschick, Erfahrung und ein tiefes Verständnis der Materialien. Bei der Meisterwerk Maler Manufaktur arbeiten wir immer sorgfältig, um ein perfektes Ergebnis zu erzielen. Es gibt viele Arten des Verputzens, zum Beispiel aus Kalk oder Gips. Wir kennen uns bestens mit den unterschiedlichen Techniken aus und beraten Sie gerne, welche Materialien und Verfahren sich für Ihre Räume besonders eignen. So gestalten wir Ihre Räume stilvoll, modern und langlebig. Darüber hinaus steht Ihnen unser Malermeister Baldassarre Fortino persönlich für die Beratung über die richtige Tapete und deren optimale Umsetzung zur Seite. Unser Ziel ist es, Ihre Wände in echte Meisterwerke zu verwandeln – ästhetisch, präzise und langlebig.',
      ...{
        img: img('2097-meisterwerk-20230524-scaled.jpg'),
        alt: 'Glattputz-Arbeiten für moderne Innenräume in Ludwigsburg – Meisterwerk Malermanufaktur.',
      },
    },
    intro: {
      ...{ img: img('2084-meisterwerk-20230524-Bearbeitet-1-scaled.jpg'), alt: '' },
      label: 'Die Vorteile auf einen Blick',
      title: 'Vorteile professioneller Verputzarbeiten',
      list: '<ul><li><p><strong>Glatte und hochwertige Oberflächen</strong>: Perfekt vorbereitet für Malerarbeiten oder dekorative Gestaltung.</p></li><li><p><strong>Individuelle Gestaltung</strong>: Unterschiedliche Strukturen und Techniken möglich, angepasst an Ihren Stil.</p></li><li><p><strong>Langlebigkeit</strong>: Hochwertige Materialien sorgen für ein stabiles, dauerhaft schönes Ergebnis.</p></li><li><p><strong>Präzise Ausführung</strong>: Unser Team arbeitet sorgfältig, schnell und zuverlässig.</p></li><li><p><strong>Fachberatung inklusive</strong>: Unser Malermeister <strong>Baldassarre Fortino</strong> unterstützt Sie bei der Wahl der richtigen Technik und Materialien.</p></li></ul>',
      blocks: [
        {
          no: '01',
          title: 'Materialien & Techniken',
          html: '<p>Wir setzen ausschließlich <strong>hochwertige Materialien</strong> führender Hersteller ein. Ob Gips, Kalk oder spezielle Putze für besondere Anforderungen – unser Team kennt sich mit allen Varianten aus und setzt Ihr Projekt fachgerecht um. Wir bereiten die Untergründe optimal vor und sorgen dafür, dass jede Oberfläche <strong>glatt, eben und perfekt verputzt</strong> ist.</p><h3 aria-hidden="true">&nbsp;</h3>',
        },
        {
          no: '02',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Präzise Handwerkskunst</strong>: Saubere Flächen, exakte Kanten und gleichmäßige Strukturen.</p></li><li><p><strong>Vielfältige Techniken</strong>: Glattputz, Strukturputz oder dekorative Oberflächen – individuell nach Wunsch.</p></li><li><p><strong>Schnell und effizient</strong>: Wir arbeiten zügig, ohne die Qualität zu beeinträchtigen.</p></li><li><p><strong>Nachhaltigkeit &amp; Langlebigkeit</strong>: Hochwertige Materialien sorgen für dauerhafte Freude an Ihren Wänden.</p></li></ul>',
        },
      ],
    },
    showcase: [
      {
        width: [24.333, 23.88],
        images: [
          '41-bf-20241206-Bearbeitet-scaled.jpg',
          '902-bf-20241206-Bearbeitet-scaled.jpg',
          '2161-meisterwerk-20230524-scaled.jpg',
        ],
      },
      { width: [66.667, 74.09], images: ['2104-meisterwerk-20230524-Bearbeitet-2-scaled.jpg'] },
    ],
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Unser Team besteht aus <strong>erfahrenen Experten</strong>, die alle Verputztechniken beherrschen. Jede Wand und Decke wird präzise und sorgfältig bearbeitet – für ein Ergebnis, das höchste Ansprüche erfüllt.</p><ul><li><p>Langjährige Erfahrung im Verputz- und Stuckhandwerk</p></li><li><p>Hochwertige Materialien für perfekte Ergebnisse</p></li><li><p>Individuelle Beratung und Umsetzung nach Ihren Vorstellungen</p></li></ul>',
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Wir verwenden ausschließlich Materialien, die <strong>ästhetisch überzeugen und langlebig</strong> sind. Ob klassische Kalk- und Gipsputze oder moderne Spezialputze – wir garantieren höchste Qualität und perfekte Verarbeitung.</p><h4 aria-hidden="true">&nbsp;</h4><h4 aria-hidden="true">&nbsp;</h4>',
      },
      {
        title: 'Ihr Weg zu neuen Wänden',
        html: '<p>Von der <strong>Beratung über die Materialauswahl bis zur fachgerechten Umsetzung</strong> begleiten wir Sie Schritt für Schritt. Mit der <strong>Meisterwerk Maler Manufaktur</strong> erhalten Ihre Räume glatte, elegante Oberflächen – präzise, sauber und professionell umgesetzt.</p><p>&nbsp;</p>',
      },
    ],
  },
  {
    slug: 'glatte-waende',
    title: 'Glatte Wände & Q4 Oberflächen | Ludwigsburg & Stuttgart',
    description:
      'Perfekt glatte Wände für Ihr Zuhause. Wir bieten Q3 & Q4 Spachteltechnik für eine puristische Optik in Ludwigsburg & Stuttgart. Höchste Präzision vom Profi.',
    hero: {
      title: 'Glatte Wände – Verabschieden Sie sich von rauen Oberflächen!',
      text: 'Glatte Wände sind entscheidend für ein schönes Zuhause. Sie wirken modern, sauber und stilvoll und bringen eine harmonische Atmosphäre in jeden Raum. Bei der Meisterwerk Maler Manufaktur sind wir spezialisiert auf glatte Wände und helfen Ihnen, Ihre Traumwände zu verwirklichen. Es gibt viele Materialien und Techniken, um glatte Wände zu erzielen. Sie reflektieren das Licht optimal, machen den Raum heller und lebendiger und lassen sich leichter reinigen und pflegen. Die richtige Farbwahl ist entscheidend für dauerhaft schöne und saubere Wände. Glatte Wände sind zeitlos im Trend und passen zu jedem Einrichtungsstil. Es gibt viele Arten des Verputzens, zum Beispiel aus Kalk oder Gips. Wir kennen uns bestens mit den unterschiedlichen Techniken aus und beraten Sie gerne, welche Materialien und Verfahren sich für Ihre Räume besonders eignen. So gestalten wir Ihre Räume stilvoll, modern und langlebig. Darüber hinaus steht Ihnen unser Malermeister Baldassarre Fortino persönlich für die Beratung über die richtige Tapete und deren optimale Umsetzung zur Seite. Unser Ziel ist es, Ihre Wände in echte Meisterwerke zu verwandeln – ästhetisch, präzise und langlebig.',
      ...{
        img: img('337-meisterwerk-20230120-2-scaled-e1758183920188.jpg'),
        alt: 'Perfekt glatte Wände und Decken mit indirekter LED-Beleuchtung in einem modernen Flur in Ludwigsburg.',
      },
    },
    intro: {
      ...{
        img: img('2037-meisterwerk-20230524-Bearbeitet-1-scaled.jpg'),
        alt: 'Moderne Badezimmer-Dusche mit großformatigen beigen Fliesen, schwarzen Armaturen und Glaswand in Ludwigsburg.',
      },
      label: 'Die Vorteile auf einen Blick',
      title: 'Vorteile professioneller glatter Oberflächen',
      list: '<ul><li><p><strong>Modernes Erscheinungsbild</strong>: Klare, glatte Wände schaffen ein edles Raumgefühl.</p></li><li><p><strong>Pflegeleicht</strong>: Glatte Oberflächen lassen sich einfach reinigen und behalten ihr Aussehen lange.</p></li><li><p><strong>Helle Räume</strong>: Lichtreflexion sorgt für freundlichere und lebendigere Räume.</p></li><li><p><strong>Individuelle Gestaltung</strong>: Farben, Strukturen und Oberflächen können an Ihre Wünsche angepasst werden.</p></li><li><p><strong>Fachberatung inklusive</strong>: Malermeister <strong>Baldassarre Fortino</strong> unterstützt Sie bei der Wahl der passenden Materialien und Farben.</p></li></ul>',
      blocks: [
        {
          no: '01',
          title: 'Materialien & Techniken',
          html: '<p>Wir setzen <strong>hochwertige Putze, Spachtelmassen und Materialien</strong> führender Hersteller ein, um glatte Oberflächen fachgerecht zu erstellen. Präzises Vorbereiten, Schleifen und Auftragen sind die Basis für <strong>perfekte, ebene Wände</strong>, die Sie jahrelang begeistern werden.</p><h3 aria-hidden="true">&nbsp;</h3><h3 aria-hidden="true">&nbsp;</h3>',
        },
        {
          no: '02',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Perfekte Ebenheit</strong>: Keine Unebenheiten, keine Strukturfehler – für ein makelloses Ergebnis.</p></li><li><p><strong>Lichtreflexion &amp; Raumwirkung</strong>: Glatte Wände lassen Räume größer und heller wirken.</p></li><li><p><strong>Langlebigkeit</strong>: Hochwertige Materialien und sorgfältige Verarbeitung für dauerhafte Schönheit.</p></li></ul>',
        },
      ],
    },
    gallery: [
      '117-bf-20241206-Bearbeitet-scaled.jpg',
      '199-meisterwerk-20230120-Bearbeitet-3-scaled.jpg',
      '2037-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
      '2004-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
      '2030-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
      '285-mw-20241125-HDR-scaled.jpg',
      '107-bf-20241206-Bearbeitet-scaled.jpg',
    ],
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Unser Team besteht aus <strong>erfahrenen Spezialisten für glatte Wände</strong>, die präzise und sorgfältig arbeiten. Jedes Projekt wird individuell geplant und perfekt umgesetzt.</p><ul><li><p>Langjährige Erfahrung im Spachtel- und Malerhandwerk</p></li><li><p>Hochwertige Materialien für perfekte Oberflächen</p></li><li><p>Individuelle Beratung und Umsetzung nach Ihren Wünschen</p></li></ul>',
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Für glatte Wände verwenden wir ausschließlich <strong>erstklassige Putze, Spachtelmassen und Werkzeuge</strong> führender Hersteller. So stellen wir sicher, dass jede Fläche <strong>ästhetisch perfekt, langlebig und pflegeleicht</strong> ist. Qualität und Materialwahl sind entscheidend, damit Ihre Wände dauerhaft schön bleiben.</p><h3 aria-hidden="true">&nbsp;</h3><h4 aria-hidden="true">&nbsp;</h4><h4 aria-hidden="true">&nbsp;</h4>',
      },
      {
        title: 'Ihr Weg zu makellosen Wänden',
        html: '<p>Wir bieten <strong>kostenlose Beratung vor Ort</strong>, um Ihre Wände optimal zu gestalten. Von der Planung bis zur Umsetzung begleitet Sie die <strong>Meisterwerk Maler Manufaktur</strong>, sodass Ihre Räume moderne, glatte und gepflegte Wände erhalten.</p><p>&nbsp;</p><p>&nbsp;</p>',
      },
    ],
  },
];
