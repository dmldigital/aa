/**
 * Impressum (Haupt- und Teil-Website Exklusive), Angaben aus dem Impressum von meisterwerk-lb.de und `data/site.ts`.
 * Berufsbezeichnung laut Meisterbrief (Qualifikationen-Seite). Darstellung als Karten in `components/legal/LegalPage.astro`.
 */
import { site } from '../site';
import type { LegalSection } from './datenschutz';

const mail = `<a href="mailto:${site.email}">${site.email}</a>`;
const tel = `<a href="tel:${site.phoneHref}">${site.phone}</a>`;

export const imprintSections: LegalSection[] = [
  {
    id: 'anbieter',
    title: 'Angaben gemäß § 5 DDG',
    html: `<p><strong>${site.name}</strong><br>Inhaber: ${site.owner}<br>${site.street}<br>${site.postalCode} ${site.city}<br>Deutschland</p>`,
  },
  {
    id: 'kontakt',
    title: 'Kontakt',
    html: `<p>Telefon: ${tel}<br>E-Mail: ${mail}</p>`,
  },
  {
    id: 'umsatzsteuer',
    title: 'Umsatzsteuer',
    html: `<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br><strong>DE295434217</strong></p>`,
  },
  {
    id: 'beruf',
    title: 'Berufsbezeichnung und Kammer',
    html: `
      <p>Berufsbezeichnung: Maler- und Lackierermeister, verliehen in der Bundesrepublik Deutschland</p>
      <p>Eingetragen in die Handwerksrolle der:<br>Handwerkskammer Region Stuttgart<br>Heilbronner Straße 43<br>70191 Stuttgart</p>
      <p>Es gilt die Handwerksordnung (HwO), einsehbar unter <a href="https://www.gesetze-im-internet.de/hwo/" target="_blank" rel="noopener noreferrer">gesetze-im-internet.de</a>.</p>`,
  },
  {
    id: 'verantwortlich',
    title: 'Verantwortlich für den Inhalt',
    html: `<p>Verantwortlich nach § 18 Abs. 2 MStV:<br>${site.owner}<br>${site.street}<br>${site.postalCode} ${site.city}</p>`,
  },
  {
    id: 'streitbeilegung',
    title: 'Verbraucherstreitbeilegung',
    html: `<p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>`,
  },
];
