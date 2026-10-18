/**
 * Projektbeiträge (live von meisterwerk-lb.de gelesen). Eine Route `[year]/[month]/[day]/[slug]` rendert alle.
 * Bilder: Dateinamen in `src/assets/img`.
 */
export interface Post {
  year: string;
  month: string;
  day: string;
  slug: string;
  title: string;
  /** Titelbild (großes Bild über dem Text). */
  image: string;
  /** Erbrachte Leistungen (Kacheln links in der Infoleiste). */
  services: string[];
  info: { year: string; place: string; duration: string; area: string };
  sections: { heading: string; text: string }[];
  gallery: string[];
  /** Fließtext in 17/25,5 statt 15/22,5 (so im Original, nur der Beitrag „Altbau WDVS“ ist kleiner). */
  largeText?: boolean;
}

export const posts: Post[] = [
  {
    year: '2025',
    month: '05',
    day: '22',
    slug: 'altbau-wdvs',
    title: 'Altbau WDVS',
    image: '2079-meisterwerk-20230524-Bearbeitet-scaled.jpg',
    services: ['Malerarbeiten', 'Verputz', 'WDVS'],
    info: { year: '2022', place: 'Ludwigsburg', duration: '2 Monate', area: '250' },
    sections: [
      {
        heading: 'Auftrag und Planung',
        text: 'Nach der erfolgreichen Durchführung der Kernsanierung im Inneren des Hauses erhielten wir von unseren Kunden einen weiteren Auftrag: die Neudämmung der Fassade des Altbaus. Für dieses Projekt entschieden wir uns für die Verwendung von Mineralwolle. Bevor die Dämmung angebracht werden konnte, waren jedoch verschiedene Detailarbeiten an der Fassade erforderlich, die wir in enger Abstimmung mit anderen Gewerken sorgfältig umsetzten. Diese präzise Planung und Koordination war unerlässlich, um ein optimales Endergebnis sicherzustellen.',
      },
      {
        heading: 'Durchführung der Dämmarbeiten',
        text: 'Nachdem die vorbereitenden Arbeiten abgeschlossen waren, begannen wir mit der Anbringung der Mineralwolle. Anschließend wurde die gesamte Fassade mit einem Gewebe armiert und mit einem 3 mm Kratzputz verputzt. Diese Schritte gewährleisteten nicht nur eine effektive Wärmedämmung, sondern auch eine langlebige und stabile Ausführung des Fassadensystems.',
      },
      {
        heading: 'Abschluss und Schutz der Fassade',
        text: 'Zum Schluss erhielt die Fassade eine hochwertige Beschichtung mit Silikatfarbe. Diese besondere Farbe bietet eine 20-jährige Farbtongarantie und schützt die Oberfläche zuverlässig vor Witterungseinflüssen. Damit wird nicht nur die Optik des Gebäudes langfristig erhalten, sondern auch die Beständigkeit der Fassade gesteigert. Für Fragen oder weitere Informationen zur Dämmung von Altbauten stehen wir Ihnen selbstverständlich gerne zur Verfügung.',
      },
    ],
    gallery: [
      '2084-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      '2104-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
      '2089-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
    ],
    largeText: true,
  },
  {
    year: '2025',
    month: '05',
    day: '03',
    slug: 'unser-showroom',
    title: 'Unser Schowroom',
    image: '107-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
    services: ['Malerarbeiten', 'Spachteltechniken', 'Fugenlose Böden', 'Stuckarbeiten'],
    info: { year: '2018', place: 'Freiberg a. Neckar', duration: '3 Monate', area: '60' },
    sections: [
      {
        heading: 'Vielfalt im Showroom',
        text: 'In unserem Showroom präsentieren wir Ihnen eine breit gefächerte Auswahl an Farben, Strukturen und Oberflächen. Von glatten Wänden über dekorative Stuckleisten bis hin zu fugenlosen, spachteltechnisch bearbeiteten Oberflächen und hochwertigen Tapeten – hier finden Sie alles, was zur Gestaltung einzigartiger Räume beiträgt. Unser erfahrenes Team unterstützt Sie kompetent bei der Planung und Umsetzung Ihrer individuellen Ideen. Gemeinsam entwickeln wir ein maßgeschneidertes Farb- und Materialkonzept, das perfekt auf Ihre Wünsche und Bedürfnisse abgestimmt ist. Auch die Bauplanung gehört zu unserem Service, um ein Ergebnis zu sichern, das Ihre Erwartungen vollständig erfüllt.',
      },
      {
        heading: 'Inspiration und Qualität erleben',
        text: 'Unser Ziel ist es, Ihre Vorstellungen in die Realität umzusetzen und Ihnen das bestmögliche Ergebnis zu liefern. Der Showroom bietet Ihnen die ideale Gelegenheit, sich von der Vielfalt unserer Produkte und Dienstleistungen zu überzeugen. Sie können sich in Ruhe umsehen, Inspirationen sammeln und die Materialien sowie Verarbeitungstechniken direkt erleben. So erhalten Sie ein klares Bild von der hohen Qualität unserer Arbeit und den Möglichkeiten, die wir Ihnen bieten.',
      },
      {
        heading: 'Persönliche Beratung und Service',
        text: 'Für Fragen oder individuelle Wünsche stehen wir Ihnen jederzeit gerne zur Verfügung. Vereinbaren Sie einfach einen Termin, damit wir uns ausreichend Zeit für Ihr Projekt nehmen können. Wir freuen uns darauf, Sie in unserem Showroom persönlich zu begrüßen und Ihnen bei der Verwirklichung Ihrer Wohnträume zur Seite zu stehen.',
      },
    ],
    gallery: [
      '152-meisterwerk-20230120-scaled-1.jpg',
      '131-meisterwerk-20230120-scaled-1.jpg',
      '124-meisterwerk-20230120-scaled-1.jpg',
      '113-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      '109-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      '107-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      '104-meisterwerk-20230120-Bearbeitet-scaled-1.jpg',
      '116-mw-20241125-1-scaled.jpg',
      '107-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
    ],
    largeText: true,
  },
  {
    year: '2025',
    month: '09',
    day: '18',
    slug: 'frisch-gestrichen',
    title: 'Frisch Gestrichen',
    image: '2124-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
    services: ['Malerarbeiten', 'Fugenloses Bad'],
    info: { year: '2021', place: 'Ludwigsburg', duration: '7 Wochen', area: '320' },
    sections: [
      {
        heading: 'Farbberatung und Auswahl',
        text: 'Der Auftrag bestand darin, die Fassade eines Hauses neu zu streichen – modern im Erscheinungsbild, aber harmonisch zur Architektur passend. Nach einer eingehenden Beratung und dem Vergleich verschiedener Farbmuster haben wir gemeinsam mit den Kunden den idealen Farbton ausgewählt. Um die endgültige Entscheidung abzusichern, wurden mehrere Echtmuster direkt an die Fassade gestrichen. So konnten die Kunden den Farbton im realen Umfeld betrachten und sich einige Tage Zeit nehmen, bevor die gesamte Fassade in der gewählten Farbe ausgeführt wurde.',
      },
      {
        heading: 'Vorbereitung und Ausführung',
        text: 'Im nächsten Schritt errichteten wir das Gerüst und reinigten die gesamte Fassade gründlich mit einem Dampfstrahlgerät. Fenster, Türen, Böden und Laufwege wurden sorgfältig abgeklebt und geschützt, um saubere Arbeitsbedingungen zu schaffen. Nach der Grundierung erhielt die Fassade zwei gleichmäßige Anstriche mit einer hochwertigen Silikatfarbe, die sich durch besondere Langlebigkeit und Farbstabilität auszeichnet.',
      },
      {
        heading: 'Langlebigkeit und Vorteile',
        text: 'Das Besondere an dieser Silikatfarbe ist die Farbtongarantie von 20 Jahren – ein intensives Schwarz bleibt auch nach zwei Jahrzehnten tiefschwarz. Bei den meisten vergleichbaren Produkten liegt die Garantiezeit lediglich bei fünf Jahren. Zusätzlich verlängert die Farbe die Renovierungsintervalle: Anstatt die Fassade alle zehn Jahre neu zu streichen, kann ein Anstrichzyklus übersprungen werden. Das spart nicht nur Kosten und Zeit, sondern sorgt auch für ein dauerhaft ansprechendes Ergebnis.',
      },
    ],
    gallery: [
      '2153-meisterwerk-20230524-scaled.jpg',
      '2144-meisterwerk-20230524-scaled.jpg',
      '2159-meisterwerk-20230524-scaled.jpg',
      '2129-meisterwerk-20230524-scaled.jpg',
      '2124-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
      '2137-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      '2109-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
    ],
    largeText: true,
  },
  {
    year: '2025',
    month: '09',
    day: '18',
    slug: 'traumhaus',
    title: 'Traumhaus',
    image: '199-meisterwerk-20230120-Bearbeitet-2-scaled.jpg',
    services: ['Malerarbeiten', 'Spachteltechnik', 'Stuckarbeiten'],
    info: { year: '2019', place: 'Ludwigsburg', duration: '6 Monate', area: '150' },
    sections: [
      {
        heading: 'Sorgfältige Sanierungsarbeiten',
        text: 'Die Kernsanierung eines Zweifamilienhauses aus dem Jahr 1923 stellte uns vor vielfältige Aufgaben, die wir mit höchster Präzision und Fachkenntnis ausführten. Den Beginn bildeten umfangreiche Trockenbauarbeiten, bei denen wir die Flächen verputzten und Gewebe einarbeiteten, um Rissbildungen vorzubeugen. Anschließend wurden Decken und Wände dreimal gespachtelt und zusätzlich mit Malervlies versehen. Für die Wandflächen setzten wir eine spezielle Spachteltechnik ein: einen edlen Marmorkalkputz in matter Ausführung.',
      },
      {
        heading: 'Einheitliche Oberflächengestaltung',
        text: 'Das Ergebnis war eine sehr glatte, feinporige Oberfläche, die optisch an Muschelkalk erinnert. Zum Schutz vor Verschmutzung und zur Erhöhung der Strapazierfähigkeit versiegelten wir sie mit einer leicht seidenglänzenden Schutzbeschichtung. Auch die Decken erhielten einen Anstrich mit Silikatfarbe, um das natürliche Raumkonzept konsequent zu unterstreichen. Alle Oberflächen – Decken, Wände, Türen, Spachteltechniken und Lackflächen – wurden in RAL 9010 ausgeführt. Diese durchgehende Farbgebung sorgt für ein harmonisches Gesamtbild und eine ruhige, elegante Raumwirkung.',
      },
      {
        heading: 'Details und besondere Akzente',
        text: 'Besonders ins Auge fallen die sorgfältigen Detailarbeiten rund um die Treppe sowie die zahlreichen indirekten Beleuchtungselemente. Um das Raumgefühl zu vergrößern und zugleich elegante Lösungen für Beleuchtung und Vorhangschienen zu schaffen, haben wir eine Stuckleiste an der Decke integriert. Dieses Gestaltungselement verleiht den Räumen zusätzliche Tiefe und unterstreicht die handwerkliche Qualität. Insgesamt entstand durch die Sanierung ein Raumkonzept, das Funktionalität und Ästhetik perfekt miteinander verbindet.',
      },
    ],
    gallery: [
      '266-meisterwerk-20230120-1-scaled.jpg',
      '239-meisterwerk-20230120-1-scaled.jpg',
      '274-meisterwerk-20230120-scaled.jpg',
      '271-meisterwerk-20230120-scaled.jpg',
      '329-meisterwerk-20230120-scaled.jpg',
      '312-meisterwerk-20230120-scaled.jpg',
      '337-meisterwerk-20230120-3-scaled.jpg',
      '291-meisterwerk-20230120-scaled.jpg',
      '297-meisterwerk-20230120-scaled.jpg',
      '220-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg',
      '227-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
      '292-meisterwerk-20230120-scaled.jpg',
      '205-meisterwerk-20230120-Bearbeitet-2-scaled.jpg',
      '284-meisterwerk-20230120-scaled.jpg',
      '276-meisterwerk-20230120-scaled.jpg',
      '277-meisterwerk-20230120-scaled.jpg',
      '212-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
      '209-meisterwerk-20230120-2-scaled.jpg',
      '216-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg',
      '199-meisterwerk-20230120-Bearbeitet-2-scaled.jpg',
    ],
    largeText: true,
  },
  {
    year: '2021',
    month: '05',
    day: '01',
    slug: 'kernsanierung',
    title: 'Kernsanierung',
    image: '2000-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
    services: ['Malerarbeiten', 'Spachteltechnik'],
    info: { year: '2021', place: 'Ludwigsburg', duration: '4 Monate', area: '180' },
    sections: [
      {
        heading: 'Umfassende Kernsanierung',
        text: 'Unser jüngster Auftrag umfasste die vollständige Kernsanierung eines Altbaus – von der Renovierung der Trockenbau-Decken bis hin zur Errichtung neuer Wände. Um glatte Oberflächen zu erzielen und Haarrisse zuverlässig zu überbrücken, wurden Decken und Wände zweifach gespachtelt und anschließend mit Malervlies tapeziert. Diese Arbeiten führte unser Team vollständig in Eigenleistung aus, sodass höchste Qualität und Kontinuität gewährleistet waren. Zum Abschluss erhielten die Oberflächen einen Anstrich mit langlebiger Silikatfarbe, die für ein attraktives und beständiges Ergebnis sorgt.',
      },
      {
        heading: 'Restaurierung und Detailarbeit',
        text: 'Parallel zur Sanierung widmeten wir uns der Restaurierung der alten Holztreppe. Während Wangen und Geländer deckend lackiert wurden, haben wir den Handlauf auf das ursprüngliche Holzdesign zurückgeführt. Diese sorgfältige Aufarbeitung stellte sicher, dass die historische Ästhetik der Treppe bewahrt bleibt und zugleich Stabilität sowie Langlebigkeit gewährleistet werden.',
      },
      {
        heading: 'Individuelle Akzente und Highlights',
        text: 'In enger Zusammenarbeit mit den Kunden und dem Architekten setzten wir zusätzlich markante gestalterische Akzente. Besonders hervorzuheben ist der sichtbare Stahlträger, der dem Gebäude einen modernen, industriellen Charakter verleiht, ohne an Eleganz zu verlieren. Ein weiteres Highlight ist die außergewöhnlich gestaltete Gästetoilette, die mit ihrem einzigartigen Design beeindruckt. Weitere Informationen und Bilder zu diesem sowie anderen exklusiven Projekten finden Sie in der Rubrik „Exklusiv“ auf unserer Webseite.',
      },
    ],
    gallery: [
      '2068-meisterwerk-20230524-scaled.jpg',
      '2064-meisterwerk-20230524-scaled.jpg',
      '2037-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      '2033-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      '2030-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
      '2045-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      '2048-meisterwerk-20230524-scaled.jpg',
      '2049-meisterwerk-20230524-scaled.jpg',
      '2050-meisterwerk-20230524-scaled.jpg',
      '2025-meisterwerk-20230524-HDR-2-scaled.jpg',
      '2058-meisterwerk-20230524-1-scaled.jpg',
      '2018-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
      '2004-meisterwerk-20230524-Bearbeitet-1-scaled.jpg',
      '2000-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
      '2072-meisterwerk-20230524-scaled.jpg',
      '2014-meisterwerk-20230524-Bearbeitet-3-scaled.jpg',
      '2009-meisterwerk-20230524-Bearbeitet-2-scaled.jpg',
    ],
    largeText: true,
  },
];
