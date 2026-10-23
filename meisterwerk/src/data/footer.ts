import { routes } from './links';
import { site as company } from './site';
import type { Site } from './nav';

/** Fußbereich je Auftritt (Original: Fuß der Hauptseite und eigener Fuß der Multisite „Meisterwerke Exklusive“). */
export interface FooterData {
  /** Überschrift „Sie haben Fragen?“: Größe je Breite (Exklusiv hat ab Desktop 60 px) */
  headingClass: string;
  /** Bewertungs-Badge (Trustindex) zeigen */
  badge: boolean;
  contactHref: string;
  phone: string;
  partnersHref: string;
  imprintHref: string;
  privacyHref: string;
  /** Link „Cookie-Einstellungen“ (nur Hauptseite) */
  cookieHref?: string;
  /** Oberes Logo: Ziel */
  logoHref: string;
}

const heading = 'text-h2';

export const footers: Record<Site, FooterData> = {
  main: {
    headingClass: heading,
    badge: true,
    contactHref: routes.contact,
    phone: company.phone,
    partnersHref: routes.partners,
    imprintHref: routes.imprint,
    privacyHref: routes.privacy,
    cookieHref: routes.privacy,
    logoHref: routes.home,
  },
  exklusive: {
    headingClass: heading,
    badge: false,
    contactHref: '/meisterwerk-exklusive/kontakt/',
    phone: '07 141 / 23982 90',
    partnersHref: '/meisterwerk-exklusive/partner-sponsoring/',
    imprintHref: '/meisterwerk-exklusive/impressum/',
    privacyHref: '/meisterwerk-exklusive/datenschutzerklaerung/',
    logoHref: '/meisterwerk-exklusive/',
  },
};
