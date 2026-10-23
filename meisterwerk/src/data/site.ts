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
  /** Google-Unternehmensprofil (Maps-Adresse mit Orts-Kennung), Ziel für Bewertungs-Badge, `sameAs` und `hasMap` */
  googleProfile: string;
  /** Name, wie er im Google-Unternehmensprofil steht (`alternateName` in den strukturierten Daten) */
  googleName: string;
  /**
   * Google-Bewertung des Profils. `value` ist die angezeigte Note (5.0 im Badge), `count` die Anzahl der Rezensionen:
   * OFFEN, vom Kunden nötig. `aggregateRating` erscheint in den strukturierten Daten erst, wenn beides befüllt ist.
   */
  rating?: { value: number; count?: number };
  /** Profile in sozialen Netzwerken (Instagram, Facebook), auch Quelle für `sameAs` in den strukturierten Daten */
  social: { instagram: string; facebook: string };
  /** Orte, in denen der Betrieb tätig ist (`areaServed`) */
  areaServed: string[];
  /**
   * Koordinaten des Betriebs: Pin des Google-Unternehmensprofils (aus der Adresse des Maps-Kurzlinks).
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
  city: 'Freiberg am Neckar',
  cityFull: 'Freiberg am Neckar',
  region: 'Baden-Württemberg',
  country: 'DE',
  mapsUrl: 'https://maps.app.goo.gl/xUpACLa2gyAQ1G8K7',
  googleProfile:
    'https://www.google.de/maps/place/Meisterwerk+Malerbetrieb/data=!4m6!3m5!1s0x4799cf0e22fe1bbd:0x79746b334c3355d0!8m2!3d48.9311111!4d9.2043551!16s%2Fg%2F11h5w8fky5',
  googleName: 'Meisterwerk Malerbetrieb',
  rating: { value: 5 },
  geo: { latitude: 48.9311111, longitude: 9.2043551 },
  social: {
    instagram: 'https://www.instagram.com/maler.meisterwerk/',
    facebook: 'https://www.facebook.com/Meisterwerk2014/',
  },
  areaServed: ['Freiberg am Neckar', 'Ludwigsburg', 'Marbach am Neckar', 'Bietigheim-Bissingen', 'Stuttgart'],
};
