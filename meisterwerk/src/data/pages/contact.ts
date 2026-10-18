/** Inhalte der Kontaktseiten (live von meisterwerk-lb.de gelesen). Zeilen eines Absatzes werden mit <br> getrennt. */
export interface ContactPage {
  title: string;
  description: string;
  heading: string;
  /** Absätze der linken Spalte, jeweils als Zeilen. */
  intro: string[][];
  /** Hintergrundbild der rechten Spalte (Dateiname in src/assets/img). */
  background: '116-mw-20241125-scaled.jpg' | '220-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg';
  /** Formular-Variante: Projektanfrage (mit Leistungsfeldern) oder Schnellkontakt. */
  form: 'project' | 'quick';
  /** Überschrift und Text über dem Formular (nur Projektanfrage). */
  formIntro?: { heading: string; text: string };
}

const TITLE = 'Kontakt & Beratung | Meisterwerk Malermanufaktur - Ludwigsburg';
const DESCRIPTION =
  'Planen Sie Ihr Projekt mit uns. Ihr Meisterbetrieb für exklusive Malerarbeiten in Ludwigsburg & Stuttgart. Rufen Sie an oder schreiben Sie uns!';

export const contactPages: Record<'kontakt' | 'schnellkontakt', ContactPage> = {
  kontakt: {
    title: TITLE,
    description: DESCRIPTION,
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
    title: TITLE,
    description: DESCRIPTION,
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
};
