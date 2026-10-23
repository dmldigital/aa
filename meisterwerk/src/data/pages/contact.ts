/** Inhalte der Kontaktseiten (live von meisterwerk-lb.de gelesen). Zeilen eines Absatzes werden mit <br> getrennt. */
export interface ContactPage {
  title: string;
  description: string;
  heading: string;
  /** Absätze der linken Spalte, jeweils als Zeilen. */
  intro: string[][];
  /** Hintergrundbild der rechten Spalte (Dateiname in src/assets/img). */
  background:
    | '116-mw-20241125-scaled.jpg'
    | '220-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg'
    | '103-meisterwerk-20230508-scaled.jpg';
  /** Formular-Variante: Projektanfrage (mit Leistungsfeldern), Schnellkontakt oder Anfrage der Teil-Website Exklusive. */
  form: 'project' | 'quick' | 'exklusive';
  /** Überschrift und Text über dem Formular (nur Projektanfrage). */
  formIntro?: { heading: string; text: string };
}

// Titel ohne Markenzusatz (das Layout ergänzt ihn). Jede Seite hat eigenen Titel und eigene Beschreibung.

export const contactPages: Record<'kontakt' | 'schnellkontakt' | 'exklusive', ContactPage> = {
  kontakt: {
    title: 'Projektanfrage stellen',
    description:
      'Schildern Sie uns Ihr Projekt: Die Meisterwerk Malermanufaktur prüft Ihre Anfrage persönlich und meldet sich zeitnah. Ludwigsburg, Stuttgart und Umgebung.',
    heading: 'Projektanfrage stellen',
    intro: [
      [
        'Sie planen ein Renovierungs- oder Gestaltungsprojekt und möchten Wert auf saubere Ausführung, klare Kommunikation und hochwertige Ergebnisse legen?',
      ],
      [
        'Über dieses Formular können Sie uns alle relevanten Informationen zu Ihrem Vorhaben übermitteln. Je genauer Ihre Angaben, desto präziser können wir Ihr Projekt einschätzen und vorbereiten.',
      ],
      [
        'Ob private Wohnräume, Gewerbeflächen oder exklusive Oberflächenlösungen – wir begleiten Ihr Projekt von der ersten Idee bis zur fertigen Umsetzung.',
      ],
      [
        'Nach Eingang Ihrer Anfrage prüfen wir die Angaben persönlich und melden uns zeitnah bei Ihnen zur weiteren Abstimmung.',
      ],
    ],
    background: '116-mw-20241125-scaled.jpg',
    form: 'project',
    formIntro: {
      heading: 'Jetzt Projekt starten',
      text: 'Sie haben eine klare Vorstellung oder nur eine grobe Idee? Kein Problem – wir begleiten Sie vom ersten Entwurf bis zum fertigen Meisterwerk. Nutzen Sie das Formular, um uns Ihr Projekt zu schildern. Ob exklusive Möbel, Innenausbau oder individuelle Sonderanfertigung: Wir melden uns zeitnah bei Ihnen zurück – persönlich, transparent und professionell.',
    },
  },
  schnellkontakt: {
    title: 'Kontakt zum Maler in Freiberg',
    description:
      'Kontakt zur Meisterwerk Malermanufaktur in Freiberg am Neckar: Rufen Sie an oder schreiben Sie uns, wir beraten Sie gern zu Ihrem Vorhaben.',
    heading: 'Kontaktieren Sie uns',
    intro: [
      ['Sie interessieren sich für unsere Dienstleistungen oder für unsere Produkte? Sehr gerne!'],
      [
        '',
        'Bitte nennen Sie Ihr Anliegen im unten aufgeführten Kontaktformular oder rufen Sie uns an.',
        'Wir nehmen uns für Sie die nötige Zeit und beraten Sie gerne und kompetent.',
      ],
    ],
    background: '220-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg',
    form: 'quick',
  },
  // /meisterwerk-exklusive/kontakt/: Text wie Schnellkontakt, Formular mit Projektfeldern für Exklusiv-Leistungen
  exklusive: {
    title: 'Kontakt',
    description:
      'Kontakt zu Meisterwerke Exklusive: Schildern Sie uns Ihr Projekt für fugenlose Bäder, Böden oder Spachteltechniken in Ludwigsburg und Stuttgart.',
    heading: 'Kontaktieren Sie uns',
    intro: [
      ['Sie interessieren sich für unsere Dienstleistungen oder für unsere Produkte? Sehr gerne!'],
      [
        '',
        'Bitte nennen Sie Ihr Anliegen im unten aufgeführten Kontaktformular oder rufen Sie uns an.',
        'Wir nehmen uns für Sie die nötige Zeit und beraten Sie gerne und kompetent.',
      ],
    ],
    background: '103-meisterwerk-20230508-scaled.jpg',
    form: 'exklusive',
    formIntro: {
      heading: 'Jetzt Projekt starten',
      text: 'Sie haben eine klare Vorstellung oder nur eine grobe Idee? Kein Problem – wir begleiten Sie vom ersten Entwurf bis zum fertigen Meisterwerk. Nutzen Sie das Formular, um uns Ihr Projekt zu schildern. Ob exklusive Möbel, Innenausbau oder individuelle Sonderanfertigung: Wir melden uns zeitnah bei Ihnen zurück – persönlich, transparent und professionell.',
    },
  },
};
