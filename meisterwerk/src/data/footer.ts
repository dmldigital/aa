import { routes } from './links';
import { site as company } from './site';
import type { Site } from './nav';

/** Fußbereich je Auftritt (Original: Fuß der Hauptseite und eigener Fuß der Multisite „Meisterwerke Exklusive“). */
export interface FooterData {
  /** Überschrift „Sie haben Fragen?“: Größe je Breite (Exklusiv hat ab Desktop 60 px) */
  headingClass: string;
  /** Bewertungs-Badge (Trustindex) zeigen */
  badge: boolean;
  /** Obere Trennlinie: Abstände auf dem Handy (Exklusiv: 40 px oben und unten) */
  topClass: string;
  topInnerClass: string;
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

const heading = 'text-[26px]/[28.6px] md:text-[34px]/[37.4px]';

export const footers: Record<Site, FooterData> = {
  main: {
    headingClass: `${heading} lg:text-[40px]/[44px]`,
    badge: true,
    topClass: '',
    topInnerClass: '',
    contactHref: routes.contact,
    phone: company.phone,
    partnersHref: routes.partners,
    imprintHref: routes.imprint,
    privacyHref: routes.privacy,
    cookieHref: routes.privacy,
    logoHref: routes.home,
  },
  exklusive: {
    headingClass: `${heading} lg:text-[60px]/[66px]`,
    badge: false,
    topClass: 'mb-2.5 px-5',
    topInnerClass: 'py-10',
    contactHref: '/meisterwerk-exklusive/kontakt/',
    phone: '07 141 / 23982 90',
    partnersHref: '/meisterwerk-exklusive/partner-sponsoring/',
    imprintHref: '/meisterwerk-exklusive/impressum/',
    privacyHref: '/meisterwerk-exklusive/datenschutzerklaerung/',
    logoHref: '/meisterwerk-exklusive/',
  },
};
