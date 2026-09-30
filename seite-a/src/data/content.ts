// All copy is taken over word for word from the previous Manfred Weber homepage.
export const phone = { href: 'tel:+4963538060', label: '0 63 53 / 80 60', fax: '0 63 53 / 50 80 402' };
export const mail = 'info@mw-bauen.de';
export const nav = [
  ['Leistungen', '#leistungen'], ['Impressionen', '#impressionen'], ['Unternehmen', '#unternehmen'], ['Team', '#team'], ['Kontakt', '#kontakt'],
] as const;

export const hero = {
  lines: ['Träume', 'verwirklichen,', 'Werte schaffen.'],
  text: 'Für Ihr Bauvorhaben sperren wir Brücken und bringen Ihre gewünschte Leistung auf den Punkt genau dorthin wo Sie möchten. Uns ist kein Weg zu weit und kein Platz zu klein.',
};

export const ticker = ['Hochbau & Tiefbau', 'Sanierungsbau & Renovierung', 'Handwerkliche Perfektion', 'Termintreue & Preisstabilität', 'Wir bauen für Sie!', 'Kein Weg zu weit, kein Platz zu klein'];

export const about = {
  intro: { title: 'Ein Wort zum Thema „Bauen“', text: 'Der Wunsch nach Verwirklichung von Träumen und Visionen in Bauwerken ist so alt wie die Menschheit selbst. Viele Überlegungen, Planungen und Berechnungen sind im Vorfeld notwendig, ob im privaten oder gewerblichen Wohnungsbau oder für öffentliche Bauten.' },
  aim: { title: 'Unser Bestreben', text: 'Unser Bestreben ist es, als kompetenter Partner am Bau Ihre individuellen Vorstellungen in handwerklicher Perfektion umzusetzen. Termintreue und Preisstabilität sind für uns genauso wichtig wie ein hoher Qualitätsstandard und zufriedene Kunden.' },
  quote: '„Für Ihr Bauvorhaben sperren wir Brücken und bringen Ihre gewünschte Leistung auf den Punkt genau dorthin wo Sie möchten.“',
  person: { name: 'Manfred Weber', role: 'Geschäftsführer & Gründer, Manfred Weber GmbH & CoKG', image: '/media/team/marco-intro.webp' },
};

export const services = [
  { badge: 'Neubau & Tiefbau', title: 'Hoch- & Tiefbau', text: 'Erstellung von Ein- und Mehrfamilienhäusern, Wohnanlagen und Tiefgaragen sowie Erdarbeiten, Kanalbau und Entwässerung.', image: '/media/img/portfolio_0.webp' },
  { badge: 'Werterhalt', title: 'Sanierungsbau', text: 'Professionelle Feuchtigkeits- und Betonsanierung sowie strukturelle Reparaturen von Fundamenten, Trägern und Stützwänden.', image: '/media/img/portfolio_3.webp' },
  { badge: 'Bestand & Modernisierung', title: 'Umbau & Renovierung', text: 'Maßgeschneiderte Gebäudeerweiterungen, Grundrissänderungen und umfassende Renovierungsmaßnahmen im privaten und gewerblichen Bestand.', image: '/media/img/portfolio_1.webp' },
  { badge: 'Schlüsselfertig', title: 'Gewerbe & Hallenbau', text: 'Termingerechte Realisierung gewerblicher Objekte, Industriehallen und schlüsselfertiger Wohnbauten aus meisterhafter Hand.', image: '/media/img/portfolio_2.webp' },
];

// Frames from their own drone footage (scripts: prepare-mw-media.mjs), video in the centre.
export const impressions = [
  { src: '/media/still/DJI_0099-12s', alt: 'Großbaustelle mit Kranen und Tiefladern aus der Luft' },
  { src: '/media/still/DJI_0165-22s', alt: 'Rohbau einer Wohnanlage mit Turmdrehkranen im Morgendunst' },
  { src: '/media/still/DJI_0100-8s', alt: 'Erdarbeiten und Baugrube mit Baggern' },
  { src: '/media/still/DJI_0204-15s', alt: 'Bodenplatte mit Folie und Schalung aus der Vogelperspektive' },
  { src: '/media/still/DJI_0144-5s', alt: 'Fertigteilwände eines Untergeschosses auf der Baustelle' },
  { src: '/media/still/DJI_0099-4s', alt: 'Baustelleneinrichtung mit Kranen und Fuhrpark' },
];

export const company = {
  label: 'Warum Weber',
  title: 'Wo strukturelle Präzision auf meisterhafte Ausführung trifft',
  text: 'Seit über 100 Jahren im Hoch-, Tief- und Sanierungsbau, heute in fünfter Generation geführt. Mit eigenem Fuhrpark schaffen wir Werte, die bleiben.',
  motto: { label: 'Unser Leitmotiv', quote: '„Kein Weg zu weit, kein Platz zu klein.“', note: 'Fundierte Baukompetenz & Verlässlichkeit.' },
  promise: { label: 'Unser Versprechen', text: 'Persönliche Betreuung durch die Geschäftsführung und höchste Ausführungsqualität auf jeder Baustelle.', note: '100% Inhabergeführt' },
  // Sources: mw-bauen.de ("seit mehr als 100 Jahren", Hochbau • Tiefbau • Sanierungsbau) and DIE RHEINPFALZ, 12.04.2023
  // (fifth generation, run by Michelle and Marco Weber since 2021, about 100 employees).
  stats: [
    { label: 'Jahre am Bau', value: '100', unit: '+' },
    { label: 'Generation im Familienbetrieb', value: '5', unit: '.' },
    { label: 'Mitarbeiter (ca.)', value: '100', unit: '' },
    { label: 'Sparten: Hoch-, Tief- und Sanierungsbau', value: '3', unit: '' },
  ],
  cta: ['Sprechen wir', 'über Ihr Vorhaben'],
};

export const team = [
  { code: 'MW-GL-01', name: 'Marco Weber', role: 'Geschäftsleitung der technischen Abteilung', shortRole: 'Geschäftsleitung Technik', image: 'marco', qualification: 'Staatlich geprüfter Hochbautechniker (Fachrichtung Hochbau) • Maurergeselle', department: 'TECHNIK & LEITUNG', experience: '15+ Jahre', quote: 'Präzision im Rohbau ist das Fundament für jedes generationenüberdauernde Bauwerk.' },
  { code: 'MW-GL-02', name: 'Michelle Weber', role: 'Geschäftsleitung der kaufmännischen Abteilung', shortRole: 'Geschäftsleitung Kaufmännisch', image: 'michelle', qualification: 'Finanzen & Buchhaltung • Strategische Unternehmensplanung', department: 'FINANZEN & LEITUNG', experience: '12+ Jahre', quote: 'Zuverlässige kaufmännische Abwicklung schafft Vertrauen und Planungssicherheit.' },
  { code: 'MW-AS-03', name: 'Melissa Weber', role: 'Assistentin der Geschäftsleitung', shortRole: 'Assistenz Geschäftsleitung', image: 'melissa', qualification: 'Kaufmännische Kundenbetreuung & Projektassistenz', department: 'ORGANISATION', experience: '8+ Jahre', quote: 'Eine transparente Kommunikation ist das Bindeglied zwischen Bauherr und Baustelle.' },
  { code: 'MW-SV-04', name: 'Martin Weber', role: 'Beratung & Sachverständiger', shortRole: 'Maurermeister & Sachverständiger', image: 'martin', qualification: 'Meister im Maurerhandwerk • Sachverständiger BDSHev', department: 'MEISTER & GUTACHTEN', experience: '35+ Jahre', quote: 'Jahrzehntelange Meistererfahrung garantiert bautechnische Perfektion bis ins kleinste Detail.' },
  { code: 'MW-VW-05', name: 'Claudia Weber', role: 'Buchhaltung & Verwaltung', shortRole: 'Buchhaltung & Verwaltung', image: 'claudia', qualification: 'Rechnungswesen • Kaufmännische Auftragsabwicklung', department: 'VERWALTUNG', experience: '25+ Jahre', quote: 'Sorgfalt in den Zahlen sorgt für reibungslose Abläufe bei allen Bauprojekten.' },
  { code: 'MW-BT-06', name: 'Andreas Finkenstein', role: 'Bautechnik & Fachplanung', shortRole: 'Bautechnik & Fachplanung', image: 'andreas', qualification: 'Staatlich geprüfter Hochbautechniker • Schwerpunkt Hochbau', department: 'HOCHBAUTECHNIK', experience: '18+ Jahre', quote: 'Fundierte Ausführungsplanung schützt vor Überraschungen am Bau.' },
  { code: 'MW-BL-07', name: 'Fabian May', role: 'Bauleiter', shortRole: 'Bauleitung Hochbau', image: 'fabian', qualification: 'Staatlich geprüfter Hochbautechniker • Maurergeselle', department: 'BAULEITUNG', experience: '10+ Jahre', quote: 'Auf der Baustelle zählt jede Minute und jeder Millimeter. Wir behalten den Überblick.' },
  { code: 'MW-MB-08', name: 'Manuel Knabe', role: 'Maurer- & Betonbauermeister', shortRole: 'Maurer- & Betonbauermeister', image: 'manuel', qualification: 'Maurer- & Betonbauermeister • Bautechniker', department: 'MEISTERBETRIEB', experience: '14+ Jahre', quote: 'Beton und Mauerwerk erfordern meisterhaftes Gespür für Material und Statik.' },
  { code: 'MW-MB-09', name: 'Christian Schmidt', role: 'Maurer- & Betonbauermeister', shortRole: 'Maurer- & Betonbauermeister', image: 'christian', qualification: 'Maurer- & Betonbauermeister • Qualitätssicherung', department: 'MEISTERBETRIEB', experience: '16+ Jahre', quote: 'Qualitätssicherung vor Ort garantiert, dass kein Mangel unentdeckt bleibt.' },
  { code: 'MW-SEC-10', name: 'Calea', role: 'Wachhund', shortRole: 'Wachhund', image: 'calea', qualification: 'Sicherheit & Wachdienst auf dem Betriebsgelände', department: 'WACHDIENST', experience: '', quote: 'Aufmerksamkeit und Wachsamkeit rund um die Uhr.' },
  { code: 'MW-FGM-11', name: 'Atilla', role: 'Feel Good Manager', shortRole: 'Feel Good Manager', image: 'atilla', qualification: 'Betriebsklima, Motivation & Büro-Wohlbefinden', department: 'FEEL GOOD', experience: '', quote: 'Verantwortlich für gute Laune und beste Stimmung im Team.' },
];

export const footer = {
  title: 'Bereit für Ihr nächstes Bauvorhaben?',
  text: 'Ob anspruchsvoller Hochbau, fundierter Tiefbau oder nachhaltige Sanierung: Wir stehen für meisterhafte Handwerksqualität, absolute Termintreue und persönliche Betreuung.',
  slogan: '„Kein Weg zu weit, kein Platz zu klein.“',
  links: [['Startseite', '#start'], ['Unsere Leistungen', '#leistungen'], ['Über uns & Werte', '#ueber-uns'], ['Fuhrpark & Einblicke', '#unternehmen'], ['Unser Team', '#team']],
  address: ['Manfred Weber GmbH & Co. KG', 'Jahnstraße 9', '67273 Weisenheim am Berg', 'Deutschland'],
  region: 'Region Rhein-Neckar & Pfalz',
  hours: [['Mo bis Do:', '07:00–17:00 Uhr'], ['Freitag:', '07:00–15:30 Uhr'], ['Sa & So:', 'Geschlossen']],
  media: [
    { type: 'video', src: '/media/video/DJI_0204', label: 'Drohnen-Überblick' },
    { type: 'img', src: '/media/img/portfolio_4.webp', label: 'Großbaustelle & Krane', alt: 'Manfred Weber Großbaustelle & Krane' },
    { type: 'img', src: '/media/img/portfolio_5.webp', label: 'Fundament & Betonbau', alt: 'Manfred Weber Fundament- & Betonbau' },
  ],
  claim: 'Handwerkliche Perfektion seit über 25 Jahren',
};
