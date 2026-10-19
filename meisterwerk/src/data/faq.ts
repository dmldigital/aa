// Fragen und Antworten wie im Original (Texte inklusive Gedankenstriche)
export type Part = string | { br: true } | { text: string; href: string };
export type Block = { type: 'p'; parts: Part[] } | { type: 'steps'; items: string[] };
export interface Faq {
  q: string;
  a: Block[];
}

export const faqs: Faq[] = [
  {
    q: 'Welche Leistungen bieten Sie an?',
    a: [
      {
        type: 'p',
        parts: [
          'Wir führen sämtliche Maler- und Lackierarbeiten im Innen- und Außenbereich aus. Dazu gehören: Streichen, Lackieren, Tapezieren, Verputzen, Dämmen, Schimmelsanierung, Trockenbau und Bodenverlegung. Zudem haben wir eine eigene Abteilung, die auf Spachteltechniken und fugenlose Oberflächen spezialisiert ist. Mehr Informationen finden Sie unter ',
          { text: 'www.meisterwerke-exklusive.de', href: 'http://www.meisterwerke-exklusive.de' },
          '.',
          { br: true },
          { br: true },
        ],
      },
      { type: 'p', parts: [' '] },
    ],
  },
  {
    q: 'Was kostet es, eine Wohnung oder ein Zimmer zu streichen?',
    a: [
      {
        type: 'p',
        parts: [
          'Eine pauschale Antwort ist nicht möglich – der Preis hängt immer vom jeweiligen Objekt ab. Wir berücksichtigen unter anderem: Lage, Parkmöglichkeiten, Zugang, Transportwege für Material und Werkzeug, Beschaffenheit des Untergrunds, Anzahl der erforderlichen Anstriche, ob der Raum leer oder möbliert ist, welche Farben verwendet werden dürfen oder müssen und ob Allergien zu beachten sind. Daher erstellen wir für jede Anfrage ein individuelles und faires Angebot.',
        ],
      },
    ],
  },
  {
    q: 'Warum sind Sie teurer als andere Malerbetriebe?',
    a: [
      {
        type: 'p',
        parts: [
          'Wir sind nicht teurer, sondern bieten ein faires Preis-Leistungs-Verhältnis. Als Meisterbetrieb kalkulieren wir transparent: Zeit, Materialkosten, Betriebsmittel und den Einsatz von Fachpersonal mit abgeschlossener Ausbildung. Unser Ziel ist stets ein optimales Ergebnis – deshalb arbeiten wir ausschließlich mit hochwertigen Produkten, z. B. von Brillux und Sto.',
        ],
      },
    ],
  },
  {
    q: 'Bis zu welcher Entfernung arbeiten Sie?',
    a: [
      {
        type: 'p',
        parts: [
          'Unser Haupteinsatzgebiet ist Ludwigsburg, Stuttgart und Umgebung. Auf Anfrage übernehmen wir auch Aufträge in angrenzenden Regionen.',
        ],
      },
    ],
  },
  {
    q: 'Mit welchen Farben und Herstellern arbeiten Sie?',
    a: [
      {
        type: 'p',
        parts: [
          'Unsere Hauptlieferanten sind ',
          { text: 'Brillux', href: 'https://www.brillux.de/' },
          ' und ',
          { text: 'Sto', href: 'https://www.sto.de/s/' },
          ' – zwei deutsche Premium-Hersteller aus der Region. Mit dieser Auswahl können wir für jedes Objekt und jede Anforderung das passende Produkt anbieten, inklusive Service und Produktgarantie.',
        ],
      },
    ],
  },
  {
    q: 'Bieten Sie auch Schimmel- oder Feuchtigkeitssanierungen an?',
    a: [
      {
        type: 'p',
        parts: [
          'Ja. Wir entfernen Schimmel fachgerecht, behandeln die Oberflächen nachhaltig und beraten Sie zur langfristigen Vorbeugung.',
        ],
      },
    ],
  },
  {
    q: 'Wie viele Jahre Garantie erhalte ich?',
    a: [
      {
        type: 'p',
        parts: [
          'Als Meisterbetrieb stehen wir für Qualität und Langlebigkeit. Auf unsere Arbeiten geben wir in der Regel 5 Jahre Gewährleistung nach BGB. Zusätzlich profitieren Sie von den Produktgarantien unserer Premium-Partner Brillux und Sto.',
        ],
      },
    ],
  },
  {
    q: 'Muss ich während der Arbeiten zuhause sein?',
    a: [
      {
        type: 'p',
        parts: [
          'Nein. Nach Absprache können wir die Arbeiten auch in Ihrer Abwesenheit durchführen und den Zugang organisieren.',
        ],
      },
    ],
  },
  {
    q: 'Wie läuft ein Auftrag ab?',
    a: [
      {
        type: 'steps',
        items: [
          'Besichtigung vor Ort',
          'Angebotserstellung',
          'Terminplanung',
          'Fachgerechte und saubere Ausführung',
          'Abnahme mit dem Kunden',
        ],
      },
    ],
  },
  {
    q: 'Wie kann ich einen Termin vereinbaren?',
    a: [
      {
        type: 'p',
        parts: [
          'Am einfachsten telefonisch, per E-Mail oder über unser Kontaktformular. Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.',
        ],
      },
    ],
  },
];
