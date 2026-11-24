/**
 * Google Ads Conversion-Messung (Konto Meisterwerk Malerbetrieb, 532-671-5395). Eingebunden über
 * `components/legal/GoogleAds.astro`, geladen erst nach Zustimmung zur Kategorie „Marketing“ im Cookie-Banner
 * (Consent Mode v2 im Basic-Modus: ohne Zustimmung geht keine Anfrage an Google).
 * Solange `id` leer ist, wird nichts eingebunden.
 */
export const googleAds = {
  /** Tag-ID des Kontos, z. B. 'AW-123456789' */
  id: 'AW-17951684022',
  /** Label der Conversion-Aktion „Anfrage gesendet“ (Teil nach dem Schrägstrich in send_to) */
  leadLabel: 'e8uXCJfX174dELbrg_BC',
};
