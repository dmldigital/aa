/**
 * Mitarbeiterprofile (live von meisterwerk-lb.de gelesen). Eine Route `[slug]` rendert alle.
 * Bilder: Dateinamen in `src/assets/img`. Texte sind fertiges HTML (p, strong, em).
 */
export interface TimelineItem {
  date: string;
  text: string;
}
export interface Profile {
  slug: string;
  /** Seitentitel und Meta-Beschreibung (wie im Original). */
  title: string;
  description: string;
  name: string;
  /** Kurzzeile über dem Namen (Bereich unter dem Hero). */
  tagline: string;
  /** Zweite Zeile unter dem Namen (nur Gedenkseite). */
  subtitle?: string;
  photo: string;
  /** Text links neben dem Foto. */
  intro: string;
  /** Text rechts neben dem Foto. */
  motto: string;
  /** Beruflicher Werdegang (nur Baldassarre Fortino). */
  timeline?: { heading: string; items: TimelineItem[] };
  /** Ausführlicher Werdegang als Liste unter dem Motto (nur Exklusiv-Seite von Baldassarre Fortino, auf allen Breiten). */
  werdegangList?: { heading: string; items: TimelineItem[] };
}

export const profiles: Profile[] = [
  {
    slug: 'baldassarre-fortino',
    title: 'Baldassarre Fortino | Malermeister Ludwigsburg & Stuttgart',
    description:
      'Malermeister Baldassarre Fortino leitet Meisterwerk in Ludwigsburg. Ihr Experte für Fassadensanierung und exklusive Raumgestaltung im Raum Stuttgart.',
    name: 'Baldassarre Fortino',
    tagline: 'Meister der Farben',
    photo: 'baldassare_fortino.jpg',
    intro:
      '<p><strong>Position:</strong> Betriebsinhaber &amp; Maler- und Lackierermeister</p><p><strong>Baujahr:</strong> 1988 – mit der Zeit gereift wie guter Wein, bringt er heute mehr als 22 Jahre Erfahrung im Handwerk mit.</p><p><strong>Beruflicher Hintergrund:</strong> Hat sein Handwerk von der Pike auf gelernt – heute leitet er als Inhaber das Unternehmen mit Weitsicht und Wertebewusstsein.</p><p><strong>Erfahrung:</strong> Seit über 11 Jahren führt er MEISTERWERK EXKLUSIVE mit höchstem Anspruch an Qualität und Verlässlichkeit.</p><p><strong>Special Skills:</strong> „In der Inperfektion liegt die Schönheit.“ – Als Familienvater und Führungskraft weiß er, worauf es im Leben ankommt.</p><p>Seit über 11 Jahren führt er MEISTERWERK EXKLUSIVE mit einem klaren Ziel: Räume schaffen, die nicht nur gut aussehen, sondern wirken.<br>Zwischen Bauplan und Farbrolle fühlt er sich zuhause – solange niemand das Wort „Standard“ in den Mund nimmt.</p>',
    motto:
      '<p><strong>Lebensmotto:</strong> „In der Inperfektion liegt die Schönheit.“</p><p>Als Familienvater, Fußballfan, Musikliebhaber und ästhetischer Freigeist bringt er auch menschlich Tiefe in jedes Projekt ein.</p><p><strong>Fun Fact:</strong> Er hat mehr Baustellen vollendet, als Netflix Serien im Programm hat – und das will etwas heißen.</p>',
    timeline: {
      heading: 'Stationen von<br>Baldassarre Fortino',
      items: [
        {
          date: '2003 – 2006',
          text: 'Ausbildung zum Maler und Lackierer bei Maler Krehl Kalesse GmbH in Ludwigsburg. Solide handwerkliche Basis.',
        },
        {
          date: '2006 – 2009',
          text: 'Gesellenjahre bei Maler Loths GmbH. Vertiefung der praktischen Fertigkeiten im klassischen Malerhandwerk.',
        },
        {
          date: '2009 – 2012',
          text: 'Maler- und Stuckateurgeselle bei Loths und Bauer – erste Erfahrungen mit Stuckarbeiten.',
        },
        {
          date: '2012 – 2013',
          text: 'Vorarbeiterschulung und Position als Vorarbeiter bei Maler Kraft GmbH. Teamleitung und Projektverantwortung.',
        },
        {
          date: '2013 – 2014',
          text: 'Meisterschule in Stuttgart für Farbe und Gestaltung. Fachliche Weiterentwicklung auf höchstem Niveau.',
        },
        {
          date: 'JANUAR 2014',
          text: 'Meisterprüfung mit Belobigung bestanden. Gründung von Meisterwerk – Start in die Selbständigkeit.',
        },
      ],
    },
  },
  {
    slug: 'fabio-fortino',
    title: 'Fabio Fortino | Maler für Ludwigsburg & Stuttgart – Meisterwerk',
    description:
      'Lernen Sie Fabio Fortino kennen. Ihr Fachmann für präzise Malerarbeiten und moderne Wandgestaltung in Ludwigsburg, Stuttgart und Umgebung.',
    name: 'Fabio Fortino',
    tagline: 'Der Mann fürs Grobe',
    photo: 'Maler-u.-Lackierer-Gesele-Fabio-Fortino-scaled-e1753863865243.jpg',
    intro:
      '<p><strong>Position:</strong> Maler- und Lackierer-Geselle</p><p><strong>Baujahr:</strong> 1999</p><p><strong>Beruflicher Hintergrund:</strong> Seit 8 Jahren im Handwerk – spezialisiert auf große Flächen und grobe Arbeiten.</p><p><strong>Erfahrung:</strong> Souverän im Umgang mit Maschinen und Material – liefert auch unter hoher Belastung saubere Ergebnisse.</p><p><strong>Special Skills:</strong> Zuverlässig, ausdauernd und immer einsatzbereit.</p>',
    motto:
      '<p><strong>Motto:</strong> „Gib ihm!“</p><p><strong>Privat:</strong> Bodenständig, sportlich, familiär. Wenn er nicht streicht, schwimmt er, spielt Fußball oder zockt sich durchs Wochenende.</p><p><strong>Fun Fact:</strong> Braucht keine Lupe – erkennt selbst auf 300 m² die kleinste Unregelmäßigkeit. Und behebt sie direkt. Mit Stil.</p>',
  },
  {
    slug: 'lorenzo-fortino',
    title: 'Lorenzo Fortino | Malerprofi in der Region Stuttgart & LB',
    description:
      'Lorenzo Fortino bringt Farbe in Ihr Zuhause. Hochwertige Maler- und Lackierarbeiten von Meisterwerk für Kunden in Stuttgart und Ludwigsburg.',
    name: 'Lorenzo Fortino',
    tagline: 'Organisationstalent mit Überblick',
    photo: 'Fliesenleger-Vorarbeiter-Lorenzo-Fortino--scaled.jpg',
    intro:
      '<p><strong>Position:</strong> Vorarbeiter &amp; Organisationstalent</p><p><strong>Baujahr:</strong> 1994</p><p><strong>Beruflicher Hintergrund:</strong> Gelernter Fliesenleger mit über 15 Jahren Erfahrung im Handwerk.</p><p><strong>Erfahrung:</strong> Verbindet handwerkliche Präzision mit einem Auge fürs große Ganze – sorgt für reibungslose Abläufe auf der Baustelle.</p><p><strong>Special Skills:</strong> Planung, Struktur und Überblick – auch unter Zeitdruck.</p>',
    motto:
      '<p><strong>Motto:</strong> „Lebe und denke nicht an morgen.“</p><p><strong>Was ihn auszeichnet:</strong> Kein Projekt zu groß, keins zu klein – Lorenzo behält immer den Überblick. Und vor allem: die Nerven.</p><p><strong>Privat:</strong> Familienvater, Fußballbegeisterter, Paddelfan und bekannt für seine ansteckend gute Laune.</p><p><strong>Fun Fact:</strong> Hat einen eingebauten Fehlerscanner – erkennt jede schiefe Schiene, noch bevor jemand den Raum betreten hat.</p>',
  },
  {
    slug: 'samet-erenuglu',
    title: 'Samet Erenuglu | Azubi Maler & Lackierer – Meisterwerk LB',
    description:
      'Lernen Sie Samet Erenuglu kennen, unseren engagierten Auszubildenden bei Meisterwerk. Wir fördern das Handwerk in Ludwigsburg und Stuttgart mit Leidenschaft.',
    name: 'Samet Erenuglu',
    tagline: 'Azubi',
    photo: 'platzhalter.jpg',
    intro:
      '<p><strong>Position:</strong> Auszubildender im 1. Lehrjahr (Maler und Lackierer)</p><p><strong>Baujahr:</strong> 2003</p><p><strong>Beruflicher Hintergrund:</strong> Frisch ins Berufsleben gestartet, voller Motivation und Neugier auf alle Facetten desMalerhandwerks.</p><p><strong>Erfahrung:</strong> Sammelt praktische Erfahrung in allen Bereichen der Malerarbeit – vom klassischen Anstrich biszur hochwertigen Lackierung.</p><p><strong>Special Skills:</strong>Teamfähigkeit und zuverlässiges Mitwirken auf der Baustelle.</p>',
    motto:
      '<p><strong>Motto:</strong> „Glück ist es, zu lieben, was man macht.“</p><p><strong>Privat:</strong> Sportlich aktiv, verbringt gern Zeit mit Freunden und Familie – Ausgleich zum Handwerk ist ihm<br>wichtig.</p><p><strong>Fun Fact:</strong> Hat immer ein Lächeln im Gesicht, auch wenn er gerade Schleifpapier in der Hand hält.</p>',
  },
  {
    slug: 'stefano-pulia',
    title: 'Stefano Pulia | Ihr Maler-Experte in Ludwigsburg & Stuttgart',
    description:
      'Lernen Sie Stefano Pulia kennen, ein geschätztes Mitglied des Meisterwerk-Teams. Wir bieten erstklassige Malerarbeiten und Raumgestaltung für Ludwigsburg und Stuttgart.',
    name: 'Stefano Pulia',
    tagline: 'Präzision trifft Tempo',
    photo: 'Maler-u.-Lackierer-Azubi-Stefano-Pulia-scaled.jpg',
    intro:
      '<p><strong>Position:</strong> Auszubildender im 3. Lehrjahr (Maler und Lackierer)</p><p><strong>Baujahr:</strong> 2004</p><p><strong>Beruflicher Hintergrund:</strong> Jung, motiviert und mit einem Gespür für feine Arbeiten – auf dem Weg zum Fachmann.</p><p><strong>Erfahrung:</strong> Sammelt praktische Erfahrung in allen Bereichen der Malerarbeit – vom klassischen Anstrich bis zur hochwertigen Lackierung.</p><p><strong>Special Skills:</strong> Filigrane Arbeiten, exakte Lackierungen, klare Linien – Präzision liegt ihm im Blut.</p>',
    motto:
      '<p><strong>Motto:</strong> „Immer besser werden als am Tag davor.“</p><p><strong>Privat:</strong> Fußball mit den Jungs, relaxen mit Stil – Stefano kennt die Balance zwischen Leistung und Leben.</p><p><strong>Fun Fact:</strong> Lackiert schneller als sein Schatten – und trotzdem auf den Zehntelmillimeter genau.</p>',
  },
  {
    slug: 'vincenzo-fortino',
    title: 'In stillem Gedenken an Vincenzo Fortino | Meisterwerk Ludwigsburg',
    description:
      'In liebevoller Erinnerung an Vincenzo Fortino. Er wird als Teil unserer Familie und der Meisterwerk Malermanufaktur immer einen festen Platz in unseren Herzen haben.',
    name: 'Vincenzo Fortino',
    tagline: 'In Erinnerung an',
    subtitle: '*1963 †2020',
    photo: 'Papa-Vincenzo-Fortino-e1753863670297.png',
    intro:
      '<p><em>Familienvater. Handwerker. Herzensmensch.</em></p><p>Vincenzo Fortino war weit mehr als ein Teil unseres Betriebs – <strong>er war das Herzstück</strong>. Als gelernter Fliesenleger mit 41 Jahren Berufserfahrung prägte er unsere Arbeit nicht nur mit handwerklicher Präzision, sondern auch mit Menschlichkeit, Humor und bemerkenswerter Ruhe.</p><p>Er war Vater von fünf Kindern – drei davon, <strong>Baldassarre, Lorenzo und Fabio</strong>, hatten die große Ehre, mit ihm Seite an Seite auf der Baustelle zu stehen. Für sie, für uns alle, war er <strong>Vorbild, Ratgeber und Retter in jeder Lage</strong>.</p><p>Sein ganzes Können lag im Fliesenlegen. Es war nicht nur ein Beruf, sondern sein persönlicher Stolz. Doch Vincenzo war mehr als seine Rolle: Er war da, wenn man ihn brauchte. Oft, bevor jemand überhaupt merkte, dass Hilfe notwendig war.</p><p>Wo es brannte, löschte er – <strong>leise, lösungsorientiert, voller Hingabe</strong>. Immer mit einem Lächeln im Gesicht, einem lockeren Spruch auf den Lippen und einer Arbeit, die man mit gutem Gewissen als meisterhaft bezeichnen darf.</p>',
    motto:
      '<p><strong>Sein Motto:</strong> „Basta poco e che ce vo“ – <em>„Im Leben braucht es nicht viel, um etwas zu verändern.“</em></p><p>Wir vermissen unseren Vater, Kollegen und Freund – <strong>täglich</strong>. Doch was bleibt, ist sein Geist, seine Haltung und sein Vermächtnis – <strong>in uns Kindern, im gesamten Team und in jeder Fläche, die er hinterlassen hat</strong>.</p>',
  },
];

/**
 * Profile der Teil-Website /meisterwerk-exklusive/: gleiche Texte und Fotos wie die Hauptprofile,
 * nur Seitentitel (ohne Meta-Beschreibung, so im Original) und bei Baldassarre Foto und Werdegang-Liste anders.
 */
const exklusiveOverrides: Record<string, Partial<Profile>> = {
  'baldassarre-fortino': {
    photo: 'Maler-u.-Lackierer-Meister-Baldassarre-Fortino-scaled.jpg',
    werdegangList: {
      heading: 'Der Weg zum Meister – Stationen von Baldassarre Fortino',
      items: [
        { date: '2003 – 2006', text: 'Ausbildung zum Maler und Lackierer bei der Maler Krehl Kalesse GmbH in Ludwigsburg. Solide handwerkliche Basis und erste Einblicke in hochwertige Oberflächengestaltung.' },
        { date: '2006 – 2009', text: 'Gesellenjahre bei der Maler Loths GmbH in Ludwigsburg. Vertiefung der praktischen Fertigkeiten im klassischen Malerhandwerk.' },
        { date: '2009 – 2012', text: 'Tätigkeit als Maler- und Stuckateurgeselle bei Loths und Bauer in Ludwigsburg – erste Erfahrungen mit Stuckarbeiten und erweiterten Techniken.' },
        { date: '2012', text: 'Teilnahme an der Vorarbeiterschulung an der Schule für Farbe und Gestaltung in Stuttgart – gezielte Weiterentwicklung in Teamführung und Baustellenkoordination.' },
        { date: '2012 – 2013', text: 'Vorarbeiter bei Maler Kraft GmbH in Ludwigsburg. Verantwortung für Projekte, Qualitätssicherung und Teamleitung im Tagesgeschäft.' },
        { date: '2013 – 2014', text: 'Besuch der Meisterschule in Stuttgart für Farbe und Gestaltung. Fachliche und kreative Weiterentwicklung auf höchstem Niveau.' },
        { date: 'Januar 2014', text: 'Erfolgreicher Abschluss der Meisterprüfung mit Belobigung. Offizieller Titel: Maler- und Lackierermeister – Start in eine neue Phase handwerklicher Selbstverwirklichung durch die Gründung von Meisterwerk.' },
      ],
    },
  },
};

export const exklusiveProfiles: Profile[] = profiles.map((profile) => ({
  ...profile,
  ...exklusiveOverrides[profile.slug],
  title: `${profile.name} - Meisterwerke Exklusive`,
  description: '',
}));
