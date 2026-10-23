/** Wochentage in der Schreibweise von schema.org (für `openingHours`). */
export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OpeningHours {
  days: Weekday[];
  /** Uhrzeit im Format HH:MM, z. B. '07:30' */
  opens: string;
  closes: string;
}

export interface SiteData {
  name: string;
  owner: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  street: string;
  postalCode: string;
  /** Ortsname wie im Impressum und Footer */
  city: string;
  /** Ortsname für strukturierte Daten und Texte (wie im Google-Unternehmensprofil nach Abgleich mit dem Kunden) */
  cityFull: string;
  region: string;
  country: string;
  mapsUrl: string;
  /** Profile in sozialen Netzwerken (Instagram, Facebook), auch Quelle für `sameAs` in den strukturierten Daten */
  social: { instagram: string; facebook: string };
  /** Orte, in denen der Betrieb tätig ist (`areaServed`) */
  areaServed: string[];
  /**
   * OFFEN, vom Kunden nötig: Koordinaten des Betriebs (aus dem Google-Unternehmensprofil).
   * Erst wenn befüllt, erscheint `geo` in den strukturierten Daten. Nichts raten.
   */
  geo?: { latitude: number; longitude: number };
  /** OFFEN, vom Kunden nötig: Öffnungszeiten (erscheinen als `openingHoursSpecification`, sobald befüllt). */
  openingHours?: OpeningHours[];
  /** OFFEN, optional: Gründungsjahr (`foundingDate`), z. B. '2014' */
  foundingYear?: string;
  /** OFFEN, optional: Umsatzsteuer-Identifikationsnummer (`vatID`), nur wenn der Kunde sie öffentlich nennen möchte */
  vatId?: string;
}

/** Stammdaten des Betriebs (Impressum von meisterwerk-lb.de). Eine Quelle für Footer, Kontakt und strukturierte Daten (`lib/schema.ts`). */
export const site: SiteData = {
  name: 'Meisterwerk Malermanufaktur',
  owner: 'Baldassarre Fortino',
  email: 'info@meisterwerk-lb.de',
  phone: '07141 / 23982 90',
  phoneHref: '+4971412398290',
  /** WhatsApp-Link (wa.me, Nummer ohne +). Vorläufig die Festnetznummer: muss eine WhatsApp-Nummer sein, offen beim Kunden. */
  whatsappHref: 'https://wa.me/4971412398290',
  street: 'Einsteinstr. 10',
  postalCode: '71691',
  city: 'Freiberg',
  cityFull: 'Freiberg am Neckar',
  region: 'Baden-Württemberg',
  country: 'DE',
  mapsUrl: 'https://maps.app.goo.gl/xUpACLa2gyAQ1G8K7',
  social: {
    instagram: 'https://www.instagram.com/maler.meisterwerk/',
    facebook: 'https://www.facebook.com/Meisterwerk2014/',
  },
  areaServed: ['Freiberg am Neckar', 'Ludwigsburg', 'Marbach am Neckar', 'Bietigheim-Bissingen', 'Stuttgart'],
};
