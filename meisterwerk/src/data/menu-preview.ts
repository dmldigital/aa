import { img } from '../lib/img';

/**
 * Vorschau im Desktop-Menü (rechte Seite beim Überfahren eines Menüpunkts): ein Hauptbild der verlinkten Seite
 * und ein kurzer Einleitungstext. Schlüssel ist die Adresse des Menüpunkts. Ohne Eintrag (und bei der Startseite)
 * zeigt das Menü Kontaktmöglichkeiten und das kurze Formular.
 */
export interface MenuPreview {
  text: string;
  image: ImageMetadata;
  alt: string;
}

const team: MenuPreview = {
  text: 'Lernen Sie das Team hinter Meisterwerk kennen: Meister Baldassarre Fortino und seine Fachkräfte, mit klarer Haltung und Liebe zum Detail.',
  image: img('baldassare_fortino.jpg'),
  alt: 'Malermeister Baldassarre Fortino',
};
const request: MenuPreview = {
  text: 'Beschreiben Sie Ihr Vorhaben. Wir melden uns mit einer klaren Einschätzung und einem Termin zur Beratung.',
  image: img('116-mw-20241125-scaled.jpg'),
  alt: 'Hell gestalteter Wohnraum mit glatten Wänden',
};
const quick: MenuPreview = {
  text: 'Schnell erreichbar: Rufen Sie an oder schreiben Sie uns, wir antworten persönlich.',
  image: img('220-meisterwerk-20230120-Bearbeitet-1-1-scaled.jpg'),
  alt: 'Wohnraum mit hellen Oberflächen',
};
const vacation: MenuPreview = {
  text: 'Während Sie entspannen, renovieren wir. Sie kehren in ein frisch renoviertes Zuhause zurück.',
  image: img('urlaubsservice.jpeg'),
  alt: 'Urlaubsservice von Meisterwerk',
};

export const menuPreview: Record<string, MenuPreview> = {
  '/studio/': team,
  '/qualifikationen/': {
    text: 'Geprüfte Qualität auf Meisterniveau: Meisterbrief, Zertifikate und ständige Weiterbildung für Ergebnisse, die bleiben.',
    image: img('Zertifikat.jpeg'),
    alt: 'Zertifikat von Meisterwerk Malermanufaktur',
  },
  '/projekte/': {
    text: 'Ausgewählte Referenzen aus Ludwigsburg und Umgebung, von fugenlosen Bädern bis zu puristischen Fassaden.',
    image: img('117-meisterwerk-20230120-Bearbeitet-scaled.jpg'),
    alt: 'Referenzprojekt mit hochwertiger Oberfläche',
  },
  '/urlaubsservice/': vacation,
  '/kontakt/': request,
  '/schnellkontakt/': quick,
  // Teil-Website Meisterwerke Exklusive
  '/meisterwerk-exklusive/studio/': team,
  '/meisterwerk-exklusive/projekte/': {
    text: 'Ausgewählte Referenzen von Meisterwerke Exklusive: fugenlose Bäder, Böden und edle Spachteltechniken.',
    image: img('117-meisterwerk-20230120-Bearbeitet-scaled.jpg'),
    alt: 'Referenzprojekt mit hochwertiger Oberfläche',
  },
  '/meisterwerk-exklusive/urlaub/': {
    ...vacation,
    image: img('black-white-palm-landscape-scaled.jpg'),
  },
  '/meisterwerk-exklusive/kontakt/': {
    ...request,
    image: img('103-meisterwerk-20230508-scaled.jpg'),
  },
  '/meisterwerk-exklusive/kontakt-2/': {
    ...quick,
    image: img('103-meisterwerk-20230508-scaled.jpg'),
  },
};
