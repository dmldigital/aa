/**
 * Kategorien des Cookie-Banners (`components/legal/CookieBanner.astro`). Die Seite setzt heute keine optionalen Dienste ein,
 * deshalb sind Statistik und Marketing `active: false`: Der Banner zeigt nur „Notwendig“ und bietet nur „Verstanden“.
 * Kommt ein Dienst hinzu (z. B. Google Ads Conversion Tracking), hier `active: true` setzen, den Dienst in `services` nennen und
 * das Skript als `<script type="text/plain" data-consent="marketing" data-src="…">` einbinden. Der Banner fragt dann
 * „Alle akzeptieren / Nur notwendige“ und lädt das Skript erst nach Zustimmung. Datenschutzerklärung ergänzen (`data/legal/datenschutz.ts`).
 */
export type ConsentCategory = 'necessary' | 'statistics' | 'marketing';

export interface ConsentGroup {
  key: ConsentCategory;
  title: string;
  text: string;
  /** Wird auf der Seite tatsächlich etwas aus dieser Kategorie geladen? */
  active: boolean;
  /** Dienste, die zu dieser Kategorie gehören (Anzeige im Banner) */
  services: string[];
}

/** Version der Einwilligung: erhöhen, wenn neue Dienste dazukommen, damit der Banner erneut erscheint. */
export const CONSENT_VERSION = 1;
export const CONSENT_KEY = 'mw-consent';

export const consentGroups: ConsentGroup[] = [
  {
    key: 'necessary',
    title: 'Notwendig',
    text: 'Auslieferung der Seite über Cloudflare, Spam-Schutz der Formulare (wird erst beim Ausfüllen geladen) und das Speichern dieser Auswahl.',
    active: true,
    services: ['Cloudflare Pages', 'Cloudflare Turnstile'],
  },
  {
    key: 'statistics',
    title: 'Statistik',
    text: 'Auswertung, wie die Website genutzt wird.',
    active: false,
    services: [],
  },
  {
    key: 'marketing',
    title: 'Marketing',
    text: 'Messung des Erfolgs von Werbeanzeigen.',
    active: false,
    services: [],
  },
];
