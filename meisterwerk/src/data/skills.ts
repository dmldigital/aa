export type Icon = 'angle-right' | 'smile' | 'meh';
export type Group = { heading: string; items: { icon: Icon; html: string }[] };
export type Accordion = { title: string; intro: string; groups: Group[]; closing: string };

const list = (items: string[], icon: Icon = 'angle-right') => items.map((html) => ({ icon, html }));
const compare = (good: string, bad: string) => [
  { icon: 'smile' as Icon, html: `<strong>Meisterwerk:</strong> ${good}` },
  { icon: 'meh' as Icon, html: `<strong>Standard-Malerbetrieb:</strong> ${bad}` },
];

export const accordions: Accordion[] = [
  {
    title: 'Unsere Firmenskills',
    intro:
      'Hinter Meisterwerk steht ein starkes Team – bestens ausgebildet, modern ausgestattet und motiviert.',
    groups: [
      {
        heading: 'Räumlichkeiten &amp; Ausstattung',
        items: list([
          '<strong>250 m² große Werkstatt</strong> – mit modernster Ausstattung für jede Art von Projekt',
          '<strong>100 m² Showroom</strong> – mit echten Mustern, Farben und Oberflächen',
          '<strong>Spezialräume</strong> – Maschinenraum, Lackierraum, Materiallager, Außenlager – alles geordnet und effizient',
        ]),
      },
      {
        heading: 'Organisation &amp; Struktur',
        items: list([
          '<strong>Eigene Büros</strong> – für eine klare Organisation, Planung und professionelle Kundenberatung',
          '<strong>Struktur &amp; Effizienz</strong> – garantieren einen reibungslosen Ablauf ohne Verzögerungen',
          '<strong>Gerätewaschplatz mit Filteranlage</strong> – für sauberes und umweltfreundliches Arbeiten',
        ]),
      },
      {
        heading: 'Fahrzeuge &amp; Maschinen',
        items: list([
          '<strong>4 neue Firmenfahrzeuge</strong> – voll ausgestattet mit Regalen, Werkzeugen und Maschinen für Flexibilität',
          '<strong>Über 60 moderne Maschinen &amp; Geräte</strong> – vom Airless-Spritzgerät bis zur PFT-Putzmaschine',
        ]),
      },
    ],
    closing:
      '<strong>Ihr Vorteil:</strong> Mit dieser Ausstattung setzen wir jedes Projekt professionell, schnell und zuverlässig um.',
  },
  {
    title: 'Unsere Mitarbeiter &amp; Team-Skills',
    intro:
      'Wir sind mehr als ein gewöhnlicher Malerbetrieb – wir sind perfekt organisiert, top ausgestattet und professionell aufgestellt.',
    groups: [
      {
        heading: 'Unser Team im Überblick:',
        items: list([
          '<strong>1 Meister</strong> – garantiert höchste Qualitätsstandards und Arbeiten nach dem aktuellen Stand der Technik',
          '<strong>1 Projektleiter</strong> – begleitet die Baustellen, optimiert Abläufe und ist Ansprechpartner für Mitarbeiter &amp; Kunden',
          '<strong>1 Vorarbeiter</strong> – verantwortlich für die Organisation und Qualität direkt auf der Baustelle',
          '<strong>1 Geselle &amp; 2 Auszubildende</strong> – bringen Fachwissen, Leidenschaft und Motivation in jedes Projekt',
        ]),
      },
      {
        heading: 'Investition in unsere Mitarbeiter = Ihr Vorteil:',
        items: list([
          '<strong>Top-Arbeitskleidung</strong> von Schöffel Pro',
          '<strong>Kostenlose Getränke</strong> (Wasser, Kaffee, Cola, etc.)',
          '<strong>Neue Maschinen &amp; Fahrzeuge</strong> – modernste Ausstattung für effizientes Arbeiten',
          'Eigene <strong>Firmen-App</strong> – digitale Organisation über Handy &amp; Tablets für maximale Transparenz',
        ]),
      },
      {
        heading: 'Qualität durch Weiterbildung &amp; Teamgeist:',
        items: list([
          'Mindestens <strong>3 Schulungen pro Jahr</strong> für alle Mitarbeiter',
          '<strong>2 Firmenausflüge jährlich</strong> – für Motivation &amp; Zusammenhalt',
          '<strong>2 Grillfeste im Jahr</strong> mit Kollegen &amp; Partnerbetrieben – wir sind ein Team, das zusammenhält',
          'Eigene <strong>Firmen-App</strong> – digitale Organisation über Handy &amp; Tablets für maximale Transparenz',
        ]),
      },
    ],
    closing:
      '<strong>Ein eingespieltes, motiviertes Team</strong> sorgt dafür, dass Ihr Projekt professionell, effizient und mit Leidenschaft umgesetzt wird.',
  },
  {
    title: 'Ihr Mehrwert als Kunde',
    intro: 'Vergleich:<br />Meisterwerk vs. Standard-Malerbetrieb',
    groups: [
      {
        heading: 'Werkstatt &amp; Showroom',
        items: compare(
          '250 m² Werkstatt, 100 m² Showroom mit Mustern &amp; Oberflächen, plus eigene Büros für Organisation &amp; Beratung',
          'Meist keine eigene Ausstellung, selten eigene Büroräume',
        ),
      },
      {
        heading: 'Ausstattung',
        items: compare(
          'Mehr als 60 moderne Maschinen &amp; Geräte. Dank neuester Technik verkürzen wir die Baustellendauer um bis zu 70 % – das bedeutet: schnellere Fertigstellung, weniger Belastung für Sie und ein rascherer Rückkehr in den Alltag.',
          'Oft veraltete oder wenige Geräte – dadurch längere Baustellenzeiten',
        ),
      },
      {
        heading: 'Fahrzeuge',
        items: compare('4 neue, voll ausgestattete Fahrzeuge', 'Teilweise ältere Fahrzeuge'),
      },
      {
        heading: 'Organisation',
        items: compare(
          'Maschinenraum, Materiallager, Lackierraum, Außenlager, Gerätewaschplatz mit Filteranlage',
          'Meist nur kleine Lagerflächen',
        ),
      },
      {
        heading: 'Mitarbeiter-Bereich',
        items: compare(
          'Umkleide, Teeküche, Vesperraum, eigene Mitarbeiter-WCs',
          'Selten vorhanden',
        ),
      },
      {
        heading: 'Kundenerlebnis',
        items: compare(
          'Separates Kunden-WC, Showroom mit Beratung &amp; Mustern',
          'Beratung vor Ort, weniger anschaulich',
        ),
      },
      {
        heading: 'Sicherheit &amp; Nachhaltigkeit',
        items: compare(
          'Eigene Parkplätze für Kunden &amp; Mitarbeiter (alles ebenerdig), 3 Feuerlöscher, komplette LED-Beleuchtung, Wasseraufbereitungsanlage. Zusätzlich setzen wir auf ökologische Produkte und nachhaltige Lösungen, die nicht nur die Umwelt schonen, sondern auch helfen, Kosten langfristig zu senken.',
          'Eher einfach gehaltenWiederholen',
        ),
      },
    ],
    closing:
      '<strong>Ihr Vorteil:</strong> Beste Ergebnisse in kürzester Zeit – zuverlässig, sauber und nachhaltig.',
  },
];
