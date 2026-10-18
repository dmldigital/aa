// Inhalte der Exklusiv-Seiten /meisterwerk-exklusive/<slug>/ (Texte wie im Original, live ausgelesen)
import type { IntroPart } from './intro';
import { projekte } from './exklusive-start';

export interface ExklusivPage {
  slug: string;
  title: string;
  intro: { img: string; parts: IntroPart[] };
  pillars: { title: string; html: string; bullets: string[] }[];
  feature: {
    accordion: { title: string; html: string; open: boolean }[];
    button: { label: string; href: string };
    img: string;
  };
  gallery: { id: string; columns: [number, number, number]; items: string[] };
  /** Original-ID der Projekte-Sektion */
  projectsId: string;
}

export const EXCELLENCE = 'Exzellenz ist unser Maßstab';
export const projects = projekte;

export const pages: ExklusivPage[] = [
  {
    slug: 'fugenlose-baeder',
    title: 'Fugenlose Bäder - Meisterwerke Exklusive',
    intro: {
      img: 'Fugenlose-Dusche-Nero-Fine-scaled.jpg',
      parts: [
        { t: 'label', text: 'Die Vorteile auf einen Blick' },
        {
          t: 'html',
          html: '<h2>Was macht fugenlose Bäder besonders?</h2><p>Fugenlose Bäder zeichnen sich durch ihre nahtlose, glatte Oberfläche aus, die nicht nur modern und elegant wirkt, sondern auch besonders pflegeleicht und hygienisch ist. Ohne störende Fugen entsteht ein harmonisches Gesamtbild, das den Raum großzügiger erscheinen lässt und gleichzeitig verhindert, dass sich Schmutz oder Feuchtigkeit absetzen können. So vereinen fugenlose Bäder zeitgemäßes Design mit praktischem Alltagsnutzen und bieten eine langlebige, individuelle Lösung für höchste Ansprüche.</p>',
        },
        { t: 'spacer', m: true },
        {
          t: 'button',
          label: 'Schauen Sie sich bereits fertiggestellte Projekte an',
          href: '/meisterwerk-exklusive/projekte/',
        },
        { t: 'spacer', m: true },
        {
          t: 'block',
          no: '01',
          title: 'Vorteile fugenloser Bäder',
          html: '<ul><li><p><strong>Robust wie Fliesen:</strong>&nbsp;Fugenlose Oberflächen sind widerstandsfähig und langlebig.</p></li><li><p><strong>Wasserabweisend:</strong>&nbsp;Kein Eindringen von Feuchtigkeit, keine Schimmelbildung.</p></li><li><p><strong>Hygienisch und pflegeleicht:</strong>&nbsp;Die glatte Oberfläche lässt sich einfach reinigen, Schmutz und Bakterien haben keine Chance.</p></li><li><p><strong>Individuelle Gestaltung:</strong>&nbsp;Ob minimalistisch oder verspielt – die Optik kann flexibel an Ihre Wünsche angepasst werden.</p></li><li><p><strong>Alltagstauglich:</strong>&nbsp;Fugenlose Bäder sind strapazierfähig und behalten auch bei intensiver Nutzung ihre Schönheit.</p></li></ul>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '02',
          title: 'Materialien & Oberflächen',
          html: 'In unserem Showroom präsentieren wir Ihnen eine große Auswahl an Oberflächen, Strukturen, Spachteltechniken und Dekorelementen. Wir verwenden ausschließlich italienische Qualitätsprodukte, die seit über 30 Jahren am Markt etabliert sind. So entstehen besonders schöne und widerstandsfähige Oberflächen, die höchsten Ansprüchen genügen.',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '03',
          title: 'Technische Vorteile & Innovationen',
          html: '<ul><li><p><strong>Gleichmäßiges Erscheinungsbild:</strong>&nbsp;Ein fugenloses Bad wirkt großzügig und modern.</p></li><li><p><strong>Unkomplizierte Pflege:</strong>&nbsp;Die Reinigung ist schnell und einfach erledigt.</p></li><li><p><strong>Minimaler Aufbau:</strong>&nbsp;Mit nur 5 mm Aufbauhöhe können wir direkt über bestehende Fliesen arbeiten – ohne Lärm, Schmutz oder aufwendige Demontage.</p></li><li><p><strong>Nachhaltigkeit:</strong>&nbsp;Langlebige Materialien und einfache Pflege sorgen für dauerhafte Freude an Ihrem Bad.</p></li></ul>',
        },
        { t: 'spacer' },
        { t: 'spacer' },
        { t: 'spacer', small: true },
        {
          t: 'button',
          label: 'Lassen Sie sich inspirieren – und Ihren Preis berechnen',
          href: '/kontakt/',
        },
      ],
    },
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Wir setzen auf echte Handarbeit und arbeiten ausschließlich mit erfahrenen Fachkräften und ausgewählten Partnern aus der Region und ganz Europa zusammen. Jedes Projekt entsteht mit höchster Präzision, Liebe zum Detail und einem ausgeprägten Sinn für Qualität.</p>',
        bullets: [
          '10+ Jahre Erfahrung im Bad- und Oberflächendesign',
          'Nachhaltige Materialien, verantwortungsvoll',
          'Individuelle, handgefertigte Lösungen',
        ],
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Für unsere Oberflächen und Bäder verwenden wir ausschließlich ausgewählte Produkte führender Hersteller – langlebig, modern und ästhetisch. Unser Anspruch ist es, für Sie ein Umfeld zu schaffen, das Design und Funktionalität auf höchstem Niveau vereint.</p>',
        bullets: [
          'Exklusive Auswahl an Oberflächen, Farben und Strukturen',
          'Investition in Qualität und Wertbeständigkeit',
          'Sorgfältige Materialauswahl für Ihr individuelles Projekt',
        ],
      },
      {
        title: 'Investment Value',
        html: '<p>Unsere Lösungen sind darauf ausgelegt, den Wert Ihrer Immobilie langfristig zu erhalten und zu steigern. Wir verbinden zeitlose Eleganz mit durchdachtem Design – für Räume, die begeistern und bleiben. So schaffen wir Wohlfühlräume, die Sie über viele Jahre hinweg genießen können.</p>',
        bullets: [
          'Zeitloses Design und dauerhafte Wertschöpfung',
          'Fokus auf nachhaltige, pflegeleichte Lösungen',
          'Strategische Planung für maximale Wirkung in Ihrem Zuhause',
        ],
      },
    ],
    feature: {
      accordion: [
        {
          title: 'Gestaltungsmöglichkeiten',
          html: '<ul><li><p>Verschiedene Farben, Strukturen und Dekorelemente</p></li><li><p>Individuelle Anpassung an Ihre Raumkonzepte und Stilwünsche</p></li><li><p>Präsentation und Beratung direkt im Showroom</p></li></ul>',
          open: true,
        },
        {
          title: 'Ihr Weg zum Traumbad',
          html: '<p>Wir begleiten Sie von der ersten Idee bis zur finalen Umsetzung:</p><ul><li><p>Persönliche Beratung und individuelle Planung</p></li><li><p>Auswahl der passenden Materialien und Oberflächen</p></li><li><p>Fachgerechte Ausführung durch erfahrene Spezialisten</p></li><li><p>Betreuung und Service auch nach Projektabschluss</p></li></ul><p>Entdecken Sie die Möglichkeiten eines fugenlosen Badezimmers – exklusiv, modern und ganz nach Ihren Vorstellungen. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch. Wir freuen uns auf Ihre Anfrage!</p>',
          open: false,
        },
      ],
      button: { label: 'Jetzt beraten lassen!', href: '/kontakt/' },
      img: 'Fugenloses-Bad-Liscio-scaled.jpg',
    },
    gallery: {
      id: '7d0a19c',
      columns: [4, 2, 1],
      items: [
        '275-mw-20241125-Bearbeitet-scaled.jpg',
        '215-mw-20241125-Bearbeitet-1-scaled.jpg',
        '223-mw-20241125-Bearbeitet-1-scaled.jpg',
        '248-meisterwerk-20230120-Bearbeitet-2-scaled.jpg',
        '258-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
        '237-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
        '117-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
        '14-bf-20241206-Bearbeitet-scaled.jpg',
        '32-bf-20241206-Bearbeitet-scaled.jpg',
        '26-mw-20241125-HDR-1-scaled.jpg',
        '60-mw-20241125-scaled.jpg',
        '61-mw-20241125-scaled.jpg',
        '85-mw-20241125-Bearbeitet-scaled.jpg',
        '89-mw-20241125-HDR-scaled.jpg',
        '138-mw-20241125-HDR-scaled.jpg',
        '188-mw-20241125-scaled.jpg',
        '186-mw-20241125-scaled.jpg',
        '2179-meisterwerk-20230524-scaled.jpg',
        '2164-meisterwerk-20230524-Bearbeitet-scaled.jpg',
        '2170-meisterwerk-20230524-Bearbeitet-scaled.jpg',
      ],
    },
    projectsId: '23a986f',
  },
  {
    slug: 'fugenloser-boden',
    title: 'Fugenlose Böden - Meisterwerke Exklusive',
    intro: {
      img: '324-mw-20241125-Bearbeitet-scaled.jpg',
      parts: [
        { t: 'label', text: 'Die Vorteile auf einen Blick' },
        {
          t: 'html',
          html: '<h2>Was macht fugenlose Böden besonders?</h2><p>Im Gegensatz zu traditionellen Bodenbelägen zeichnen sich fugenlose Böden durch ihre durchgehende, glatte Oberfläche aus. Es entstehen keine Fugen, in denen sich Schmutz oder Feuchtigkeit absetzen könnten. Das Ergebnis ist ein harmonisches Gesamtbild, das Räume optisch vergrößert und für ein modernes, minimalistisches Raumgefühl sorgt.</p>',
        },
        { t: 'spacer', m: true },
        {
          t: 'button',
          label: 'Schauen Sie sich bereits fertiggestellte Projekte an',
          href: '/meisterwerk-exklusive/projekte/',
        },
        { t: 'spacer', m: true },
        {
          t: 'block',
          no: '01',
          title: 'Vorteile fugenloser Böden',
          html: '<p>Fugenlose Böden sind in verschiedenen Ausführungen erhältlich, die sich in Optik, Haptik und technischen Eigenschaften unterscheiden:</p><ul><li><p><strong>Epoxidharz:</strong>&nbsp;Besonders widerstandsfähig, ideal für stark frequentierte Bereiche.</p></li><li><p><strong>Polyurethan:</strong>&nbsp;Elastisch, angenehm begehbar und vielseitig einsetzbar.</p></li><li><p><strong>Beton:</strong>&nbsp;Puristisch, modern und äußerst robust.</p></li><li><p><strong>Mikrozement:</strong>&nbsp;Feine, mineralische Oberfläche mit natürlichem Look.</p></li></ul><p>Jede Variante bietet eigene Vorteile und kann gezielt auf Ihre Anforderungen abgestimmt werden.</p>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '02',
          title: 'Anwendungsbereiche',
          html: '<p>Die Einsatzmöglichkeiten fugenloser Böden sind nahezu unbegrenzt:</p><ul><li><p><strong>Wohnräume:</strong>&nbsp;Wohnzimmer, Küche, Bad, Flur – für ein einheitliches, stilvolles Wohngefühl.</p></li><li><p><strong>Gewerbliche Flächen:</strong>&nbsp;Büros, Praxen, Showrooms oder Verkaufsräume profitieren von der modernen Optik und der einfachen Pflege.</p></li><li><p><strong>Industrie:</strong>&nbsp;Produktionshallen, Lager oder Werkstätten – fugenlose Böden halten höchsten Belastungen stand und sind besonders hygienisch.</p></li></ul>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '03',
          title: 'Gestaltungsmöglichkeiten',
          html: '<p>Fugenlose Böden eröffnen vielfältige kreative Optionen:</p><ul><li><p>Große Auswahl an Farben, von dezenten Naturtönen bis zu kräftigen Akzentfarben.</p></li><li><p>Unterschiedliche Oberflächenstrukturen, von matt bis glänzend.</p></li><li><p>Individuelle Anpassung an Raumgröße, Lichtverhältnisse und Nutzungskonzept.</p></li><li><p>Kombination mit Fußbodenheizung problemlos möglich.</p></li></ul>',
        },
        { t: 'spacer' },
        { t: 'spacer' },
        { t: 'spacer', small: true },
        {
          t: 'button',
          label: 'Lassen Sie sich inspirieren – und Ihren Preis berechnen',
          href: '/kontakt/',
        },
      ],
    },
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Wir setzen auf echte Handarbeit und arbeiten ausschließlich mit erfahrenen Fachkräften und ausgewählten Partnern aus der Region und ganz Europa zusammen. Jedes Projekt entsteht mit höchster Präzision, Liebe zum Detail und einem ausgeprägten Sinn für Qualität.</p>',
        bullets: [
          '10+ Jahre Erfahrung im Bad- und Oberflächendesign',
          'Nachhaltige Materialien, verantwortungsvoll',
          'Individuelle, handgefertigte Lösungen',
        ],
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Für unsere Oberflächen und Bäder verwenden wir ausschließlich ausgewählte Produkte führender Hersteller – langlebig, modern und ästhetisch. Unser Anspruch ist es, für Sie ein Umfeld zu schaffen, das Design und Funktionalität auf höchstem Niveau vereint.</p>',
        bullets: [
          'Exklusive Auswahl an Oberflächen, Farben und Strukturen',
          'Investition in Qualität und Wertbeständigkeit',
          'Sorgfältige Materialauswahl für Ihr individuelles Projekt',
        ],
      },
      {
        title: 'Investment Value',
        html: '<p>Unsere Lösungen sind darauf ausgelegt, den Wert Ihrer Immobilie langfristig zu erhalten und zu steigern. Wir verbinden zeitlose Eleganz mit durchdachtem Design – für Räume, die begeistern und bleiben. So schaffen wir Wohlfühlräume, die Sie über viele Jahre hinweg genießen können.</p>',
        bullets: [
          'Zeitloses Design und dauerhafte Wertschöpfung',
          'Fokus auf nachhaltige, pflegeleichte Lösungen',
          'Strategische Planung für maximale Wirkung in Ihrem Zuhause',
        ],
      },
    ],
    feature: {
      accordion: [
        {
          title: 'Innovationen & Trends',
          html: 'Die Welt der fugenlosen Böden entwickelt sich stetig weiter. Neue Materialkombinationen, innovative Verlegetechniken und kreative Designs sorgen dafür, dass Sie Ihren Boden ganz nach Ihren Vorstellungen gestalten können. Nachhaltige und umweltfreundliche Lösungen gewinnen dabei zunehmend an Bedeutung.',
          open: true,
        },
        {
          title: 'Ihr Weg zum fugenlosen Traumboden',
          html: '<p>Wir begleiten Sie von der ersten Idee bis zur finalen Umsetzung:</p><ul><li><p>Individuelle Beratung und Planung</p></li><li><p>Auswahl der passenden Materialien und Farben</p></li><li><p>Fachgerechte Ausführung durch erfahrene Spezialisten</p></li><li><p>Persönliche Betreuung und Service auch nach Abschluss des Projekts</p></li></ul>',
          open: false,
        },
      ],
      button: { label: 'Jetzt beraten lassen!', href: '/kontakt/' },
      img: 'Fugenloser-Boden-Schlafzimmer-scaled.jpg',
    },
    gallery: {
      id: '1aefe16',
      columns: [3, 2, 1],
      items: [
        '302-mw-20241125-scaled.jpg',
        '14-bf-20241206-Bearbeitet-2-scaled.jpg',
        '41-bf-20241206-Bearbeitet-1-scaled.jpg',
        '285-mw-20241125-HDR-1-scaled.jpg',
        '345-mw-20241125-scaled.jpg',
        '36-bf-20241206-Bearbeitet-1-scaled.jpg',
      ],
    },
    projectsId: '0a31b86',
  },
  {
    slug: 'spachteltechniken',
    title: 'Spachteltechniken - Meisterwerke Exklusive',
    intro: {
      img: 'Exklusive-Spachteltechnik-Kalkpresstechnik-Badedzimmer-Bianco-scaled.jpg',
      parts: [
        { t: 'label', text: 'Die Vorteile auf einen Blick' },
        {
          t: 'html',
          html: '<h2>Das Besondere an Spachteltechniken</h2><div><div><div><div><div id="markdown-content-7" dir="auto"><div><div><div><p>Spachteltechniken verleihen Wänden und Decken eine einzigartige, individuelle Optik, die mit klassischen Anstrichmethoden nicht erreichbar ist. Durch die spezielle Verarbeitung entstehen faszinierende Strukturen, Licht- und Schattenspiele sowie besondere Oberflächen, die jedem Raum Charakter und Exklusivität verleihen. Jede Fläche wird zum Unikat – von elegant-glatt bis lebendig-strukturiert. Zudem sind Spachteltechniken langlebig, pflegeleicht und bieten vielfältige Gestaltungsmöglichkeiten, die sich flexibel an persönliche Stilwünsche anpassen lassen.</p></div></div></div></div></div></div><div><div><div><div>&nbsp;</div></div><div>&nbsp;</div></div><div><div>&nbsp;</div><div>&nbsp;</div></div></div></div></div><div><div><div><div><div><div><div><div><div>&nbsp;</div></div></div></div></div></div></div></div></div>',
        },
        { t: 'spacer', m: true },
        {
          t: 'button',
          label: 'Schauen Sie sich bereits fertiggestellte Projekte an',
          href: '/meisterwerk-exklusive/projekte/',
        },
        { t: 'spacer', m: true },
        {
          t: 'block',
          no: '01',
          title: 'Materialien & Techniken',
          html: '<ul><li>Kalk-Marmorputz</li><li>Stucco Veneziano</li><li>Betonoptik</li><li>Metallische Effekte</li><li>Strukturierte Spachtelungen</li><li>Glänzende und matte Oberflächen</li></ul><p> Die Auswahl des richtigen Materials und der passenden Technik erfolgt individuell nach Ihren Vorstellungen und den Gegebenheiten des Raumes. </p>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '02',
          title: 'Anwendungsbereiche',
          html: '<ul><li>Wohnräume: Wohnzimmer, Schlafzimmer, Flure</li><li>Bäder und Küchen: Feuchtraumgeeignete Oberflächen</li><li>Gewerbliche Räume: Praxen, Büros, Showrooms</li><li>Decken und Akzentwände: Für besondere Highlights im Raum</li></ul>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '03',
          title: 'Ihr Weg zur individuellen Wandgestaltung',
          html: '<ul><li>Persönliche Beratung und gemeinsame Planung</li><li>Auswahl der passenden Materialien und Techniken</li><li>Fachgerechte Ausführung durch erfahrene Spezialisten</li><li>Betreuung und Service auch nach Projektabschluss</li></ul>',
        },
        { t: 'spacer' },
        { t: 'spacer' },
        { t: 'spacer', small: true },
        {
          t: 'button',
          label: 'Lassen Sie sich inspirieren – und Ihren Preis berechnen',
          href: '/kontakt/',
        },
      ],
    },
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Wir setzen auf echte Handarbeit und arbeiten ausschließlich mit erfahrenen Fachkräften und ausgewählten Partnern aus der Region und ganz Europa zusammen. Jedes Projekt entsteht mit höchster Präzision, Liebe zum Detail und einem ausgeprägten Sinn für Qualität.</p>',
        bullets: [
          '10+ Jahre Erfahrung im Bad- und Oberflächendesign',
          'Nachhaltige Materialien, verantwortungsvoll',
          'Individuelle, handgefertigte Lösungen',
        ],
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Für unsere Oberflächen und Bäder verwenden wir ausschließlich ausgewählte Produkte führender Hersteller – langlebig, modern und ästhetisch. Unser Anspruch ist es, für Sie ein Umfeld zu schaffen, das Design und Funktionalität auf höchstem Niveau vereint.</p>',
        bullets: [
          'Exklusive Auswahl an Oberflächen, Farben und Strukturen',
          'Investition in Qualität und Wertbeständigkeit',
          'Sorgfältige Materialauswahl für Ihr individuelles Projekt',
        ],
      },
      {
        title: 'Investment Value',
        html: '<p>Unsere Lösungen sind darauf ausgelegt, den Wert Ihrer Immobilie langfristig zu erhalten und zu steigern. Wir verbinden zeitlose Eleganz mit durchdachtem Design – für Räume, die begeistern und bleiben. So schaffen wir Wohlfühlräume, die Sie über viele Jahre hinweg genießen können.</p>',
        bullets: [
          'Zeitloses Design und dauerhafte Wertschöpfung',
          'Fokus auf nachhaltige, pflegeleichte Lösungen',
          'Strategische Planung für maximale Wirkung in Ihrem Zuhause',
        ],
      },
    ],
    feature: {
      accordion: [
        {
          title: 'Innovationen & Trends',
          html: '<p>Die Welt der Spachteltechniken entwickelt sich stetig weiter. Neue Materialkombinationen, innovative Techniken und kreative Designs sorgen dafür, dass Sie Ihre Wände ganz nach Ihren Vorstellungen gestalten können. Nachhaltige und umweltfreundliche Lösungen gewinnen dabei zunehmend an Bedeutung.</p>',
          open: true,
        },
        {
          title: 'Lassen Sie sich inspirieren!',
          html: '<p> Entdecken Sie die Möglichkeiten exklusiver Spachteltechniken für Ihr Zuhause oder Ihr Unternehmen. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch – wir freuen uns darauf, gemeinsam mit Ihnen einzigartige Räume zu gestalten! </p>',
          open: false,
        },
      ],
      button: { label: 'Jetzt beraten lassen!', href: '/kontakt/' },
      img: 'Exklusive-Spachteltechnik-Kalkpresstechnik-Badetimmer-Nero-scaled.jpg',
    },
    gallery: {
      id: 'c113608',
      columns: [4, 2, 1],
      items: [
        '001-meisterwerk-20230508-HDR-1-scaled.jpg',
        '19-bf-20241206-Bearbeitet-1-scaled.jpg',
        '117-meisterwerk-20230120-Bearbeitet-1-2-scaled.jpg',
        '14-bf-20241206-Bearbeitet-3-scaled.jpg',
        '069-meisterwerk-20230508-Bearbeitet-1-scaled.jpg',
        '188-mw-20241125-2-scaled.jpg',
        '104-meisterwerk-20230508-1-scaled.jpg',
        '2022-meisterwerk-20230524-Bearbeitet-scaled.jpg',
        '148-mw-20241125-HDR-scaled.jpg',
        '178-mw-20241125-scaled.jpg',
        '173-mw-20241125-HDR-scaled.jpg',
        '197-mw-20241125-HDR-scaled.jpg',
        '097-meisterwerk-20230508-1-scaled.jpg',
        '103-bf-20241206-scaled.jpg',
        '2064-meisterwerk-20230524-1-scaled.jpg',
        '158-mw-20241125-HDR-scaled.jpg',
        '031-meisterwerk-20230508-HDR-scaled.jpg',
        '114-mw-20241125-scaled.jpg',
        '061-meisterwerk-20230508-scaled.jpg',
        '128-mw-20241125-scaled.jpg',
        '138-mw-20241125-HDR-2-scaled.jpg',
        '186-mw-20241125-2-scaled.jpg',
      ],
    },
    projectsId: '92b5da8',
  },
  {
    slug: 'stuckleisten',
    title: 'Stuckleisten - Meisterwerke Exklusive',
    intro: {
      img: '285-mw-20241125-HDR-1-scaled.jpg',
      parts: [
        { t: 'label', text: 'Die Vorteile auf einen Blick' },
        {
          t: 'html',
          html: '<h2>Das Besondere an Stuckleisten</h2><div><div><div><div><div id="markdown-content-7" dir="auto"><div><div><div><p>Stuckleisten sind weit mehr als nur dekorative Zierleisten. Sie setzen architektonische Akzente, kaschieren Vorhangschienen, verbessern die Raumakustik und bieten raffinierte Lösungen für indirekte oder direkte Beleuchtung. Durch die große Auswahl an Designs und Materialien lassen sich Stuckleisten perfekt an jeden Einrichtungsstil anpassen – von klassisch bis modern.</p></div></div></div></div></div></div></div></div>',
        },
        { t: 'spacer', m: true },
        {
          t: 'button',
          label: 'Schauen Sie sich bereits fertiggestellte Projekte an',
          href: '/meisterwerk-exklusive/projekte/',
        },
        { t: 'spacer', m: true },
        {
          t: 'block',
          no: '01',
          title: 'Vorteile von Stuckleisten',
          html: '<ul><li><strong>Vielfältige Designs:</strong> Von dezent bis opulent, passend für jeden Geschmack und Raumstil.</li><li><strong>Funktionalität:</strong> Verbergen von Vorhangschienen, Integration von Lichtsystemen, Verbesserung der Akustik.</li><li><strong>Exklusive Raumwirkung:</strong> Verleihen jedem Raum ein hochwertiges, individuelles Ambiente.</li><li><strong>Einsatzbereiche:</strong> Geeignet für Wohnräume, Büros, Hotels, Theater, Museen und viele weitere Objekte.</li><li><strong>Langlebigkeit:</strong> Hochwertige Materialien sorgen für ein dauerhaft schönes Ergebnis.</li></ul>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '02',
          title: 'Materialien & Varianten',
          html: '<ul><li><strong>Kunststoff (z. B. PU, PS):</strong> Leicht, formstabil, einfach zu montieren.</li><li><strong>Gips:</strong> Klassisch, detailreich, ideal für historische Gebäude.</li><li><strong>Holz:</strong> Natürlich, warm, vielseitig gestaltbar.</li><li><strong>Speziallösungen:</strong> Für Feuchträume oder besondere Anforderungen.</li></ul><p> Jede Variante bietet eigene Vorteile hinsichtlich Optik, Montage und Einsatzgebiet. </p>',
        },
        { t: 'spacer' },
        {
          t: 'block',
          no: '03',
          title: 'Anwendungsbereiche',
          html: '<ul><li>Wohnräume: Wohnzimmer, Schlafzimmer, Flure, Essbereiche</li><li>Öffentliche Gebäude: Theater, Museen, Hotels, Restaurants</li><li>Büros und Geschäftsräume: Für ein repräsentatives Erscheinungsbild</li><li>Sonderlösungen: Integration von Licht, Akustik-Elementen oder verdeckten Schienen</li></ul>',
        },
        {
          t: 'block',
          no: '04',
          title: 'Gestaltungsmöglichkeiten',
          html: '<ul><li>Große Auswahl an Profilen, Größen und Stilen</li><li>Individuelle Anpassung an Raumhöhe und Architektur</li><li>Kombination mit direkter oder indirekter Beleuchtung</li><li>Farblich anpassbar, z. B. passend zur Wand- oder Deckenfarbe</li></ul>',
        },
        { t: 'spacer' },
        { t: 'spacer' },
        { t: 'spacer', small: true },
        {
          t: 'button',
          label: 'Lassen Sie sich inspirieren – und Ihren Preis berechnen',
          href: '/kontakt/',
        },
      ],
    },
    pillars: [
      {
        title: 'Überlegene Handwerkskunst',
        html: '<p>Wir setzen auf echte Handarbeit und arbeiten ausschließlich mit erfahrenen Fachkräften und ausgewählten Partnern aus der Region und ganz Europa zusammen. Jedes Projekt entsteht mit höchster Präzision, Liebe zum Detail und einem ausgeprägten Sinn für Qualität.</p>',
        bullets: [
          '10+ Jahre Erfahrung im Bad- und Oberflächendesign',
          'Nachhaltige Materialien, verantwortungsvoll',
          'Individuelle, handgefertigte Lösungen',
        ],
      },
      {
        title: 'Hochwertige Materialien & Ausstattung',
        html: '<p>Für unsere Oberflächen und Bäder verwenden wir ausschließlich ausgewählte Produkte führender Hersteller – langlebig, modern und ästhetisch. Unser Anspruch ist es, für Sie ein Umfeld zu schaffen, das Design und Funktionalität auf höchstem Niveau vereint.</p>',
        bullets: [
          'Exklusive Auswahl an Oberflächen, Farben und Strukturen',
          'Investition in Qualität und Wertbeständigkeit',
          'Sorgfältige Materialauswahl für Ihr individuelles Projekt',
        ],
      },
      {
        title: 'Investment Value',
        html: '<p>Unsere Lösungen sind darauf ausgelegt, den Wert Ihrer Immobilie langfristig zu erhalten und zu steigern. Wir verbinden zeitlose Eleganz mit durchdachtem Design – für Räume, die begeistern und bleiben. So schaffen wir Wohlfühlräume, die Sie über viele Jahre hinweg genießen können.</p>',
        bullets: [
          'Zeitloses Design und dauerhafte Wertschöpfung',
          'Fokus auf nachhaltige, pflegeleichte Lösungen',
          'Strategische Planung für maximale Wirkung in Ihrem Zuhause',
        ],
      },
    ],
    feature: {
      accordion: [
        {
          title: 'Unser Service – Ihr Vorteil',
          html: '<p> Unser erfahrenes Team berät Sie umfassend zu aktuellen Trends und technischen Möglichkeiten. Wir arbeiten eng mit Ihnen zusammen, um Ihre Wünsche und Vorstellungen optimal umzusetzen – von der Auswahl des passenden Designs bis zur fachgerechten Montage. So entsteht ein Ergebnis, das nicht nur optisch überzeugt, sondern auch funktional und langlebig ist. </p>',
          open: true,
        },
        {
          title: 'Ihr Weg zu exklusiven Stuckleisten',
          html: '<ul><li>Persönliche Beratung und individuelle Planung</li><li>Auswahl der passenden Materialien und Designs</li><li>Fachgerechte Ausführung durch erfahrene Spezialisten</li><li>Betreuung und Service auch nach Projektabschluss</li></ul>',
          open: false,
        },
        {
          title: 'Lassen Sie sich inspirieren!',
          html: '<p> Entdecken Sie die vielfältigen Möglichkeiten moderner Stuckleisten für Ihr Zuhause oder Ihr Objekt. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch – wir freuen uns darauf, gemeinsam mit Ihnen Ihr Meisterwerk zu realisieren! </p>',
          open: false,
        },
      ],
      button: { label: 'Jetzt beraten lassen!', href: '/kontakt/' },
      img: '315-mw-20241125-scaled.jpg',
    },
    gallery: {
      id: '737e3c5',
      columns: [3, 2, 1],
      items: [
        '336-mw-20241125-scaled.jpg',
        '113-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
        '243-meisterwerk-20230120-1-scaled.jpg',
        '212-meisterwerk-20230120-Bearbeitet-2-scaled.jpg',
        '283-meisterwerk-20230120-scaled.jpg',
        '158-meisterwerk-20230120-scaled.jpg',
        '209-meisterwerk-20230120-3-scaled.jpg',
        '285-meisterwerk-20230120-1-scaled.jpg',
        '107-meisterwerk-20230120-Bearbeitet-1-scaled.jpg',
        '194-meisterwerk-20230120-2-scaled.jpg',
        '284-meisterwerk-20230120-1-scaled.jpg',
        '104-meisterwerk-20230120-Bearbeitet-scaled.jpg',
        '292-meisterwerk-20230120-1-scaled.jpg',
        '315-mw-20241125-scaled.jpg',
      ],
    },
    projectsId: 'a528138',
  },
];
