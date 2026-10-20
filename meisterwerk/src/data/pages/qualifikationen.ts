// Inhalte der Seite /qualifikationen/ (Texte wie im Original, live ausgelesen)
export const meta = {
  title: 'Qualifikationen & Meisterbriefe | Meisterwerk Ludwigsburg',
  description:
    'Geprüfte Qualität für Ihr Zuhause. Entdecken Sie unsere Qualifikationen als Malermeister & Experten für fugenlose Systeme in Ludwigsburg & Stuttgart.',
};

export const heading = 'Unser Versprechen an höchste Qualität';

export const pillars = [
  {
    title: 'Handwerkskunst auf Meisterniveau',
    html: '<p>Bei der <strong>Meisterwerk Maler Manufaktur</strong> verstehen wir uns nicht nur als Handwerker, sondern als Künstler des Raums. Unsere Leidenschaft für exklusive Oberflächen, fugenlose Bäder und kreative Farbkonzepte spiegelt sich in jedem Projekt wider. Wir kombinieren traditionelles Handwerk mit modernster Technik.</p><h3 aria-hidden="true">&nbsp;</h3>',
  },
  {
    title: 'Ständige Weiterbildung für Spitzenleistung',
    html: '<p>Qualität ist für uns nicht nur ein Anspruch, sondern eine Verpflichtung. Durch kontinuierliche Weiterbildung und den Einsatz innovativer Techniken stellen wir sicher, dass unser Wissen stets auf dem neuesten Stand ist. So können wir Ihnen immer die besten Lösungen für Ihre Wünsche bieten.</p><h3 aria-hidden="true">&nbsp;</h3>',
  },
  {
    title: 'Unser Team –<br> Ihre Experten',
    html: '<p>Unser Team besteht aus erfahrenen Fachkräften, die ihr Handwerk verstehen und mit Leidenschaft ausüben. Unter der Leitung von <strong>Meister Baldassarre Fortino</strong> arbeiten wir Hand in Hand, um Ihre Vorstellungen Wirklichkeit werden zu lassen.</p>',
  },
  {
    title: 'Vertrauen Sie auf unsere Expertise',
    html: '<p>Ob es um die Gestaltung glatter Wände, die Umsetzung fugenloser Bäder oder kreative Lackierarbeiten geht – wir bieten Ihnen maßgeschneiderte Lösungen, die sowohl funktional als auch ästhetisch überzeugen. Lassen Sie uns gemeinsam Ihre Raumträume verwirklichen.</p>',
  },
];

/**
 * Zertifikate und Urkunden (Reihenfolge der Wand: erst Meisterbrief und Bestätigung der Handwerkskammer, dann die
 * Fortbildungen). `col` verteilt sie auf die zwei Spalten der Wand.
 */
export const certificates: { file: string; alt: string; col: 0 | 1 }[] = [
  { file: 'meisterbrief.jpeg', alt: 'Meisterbrief von Baldassarre Fortino im Maler- und Lackierer-Handwerk', col: 0 },
  { file: 'handwerkskammer.jpeg', alt: 'Bestätigung der Handwerkskammer Region Stuttgart für die Maler- und Lackiererwerkstätte', col: 1 },
  { file: 'fakolith.jpeg', alt: 'Teilnahmezertifikat Fakolith, Qualifizierungsseminar Schimmelsanierung in Innenräumen', col: 0 },
  { file: 'dinova.jpeg', alt: 'Zertifikat Dinova, Praxis-Seminar Wandgestaltung mit italienischen Dekorprodukten', col: 1 },
  { file: 'Brillux.jpeg', alt: 'Urkunde Brillux, Der Weg zu erfolgreichen Verkaufsgesprächen', col: 0 },
  { file: 'urkunde-brillux-wdvs-2019.jpeg', alt: 'Urkunde Brillux, Begeistern für WDVS mit Emotionen verkaufen', col: 1 },
  { file: 'sto.jpeg', alt: 'Zertifikat Sto, Teilnahme am Seminar', col: 0 },
  { file: 'oikos.jpeg', alt: 'Zertifikat Oikos, Grund-Workshop', col: 1 },
  { file: 'knauf.jpeg', alt: 'Teilnahmebestätigung der Knauf Akademie, Dachgeschossausbau', col: 0 },
  { file: 'infra.jpeg', alt: 'Zertifikat infra pro, Geprüfte Fachkraft für Rauchwarnmelder nach DIN 14676', col: 1 },
  { file: 'Zertifikat.jpeg', alt: 'Attestato di formazione, Elekta Materia, Corso del Reinatore', col: 0 },
  { file: 'ASB.jpeg', alt: 'Dank des Arbeiter-Samariter-Bundes für die Unterstützung des Sponsoring-Fahrzeugs', col: 1 },
];
