/** Gemeinsame Link-Ziele für Menü, Buttons und Footer. */
import { url } from './url';

export const MAIL = 'info@poolbau-kochgmbh.de';
/** „Beratung anfragen“: solange es keine Kontakt-Sektion gibt, öffnet sich eine vorbereitete E-Mail. */
export const BERATUNG = `mailto:${MAIL}?subject=${encodeURIComponent('Beratungsanfrage Pool')}&body=${encodeURIComponent('Guten Tag,\n\nich interessiere mich für einen Pool und bitte um eine kostenlose Beratung.\n\nName:\nTelefon:\nOrt:\n\nViele Grüße')}`;
/** Ziele innerhalb der Startseite: auf der Startseite als reiner Anker (weiches Scrollen), sonst mit Pfad. */
export const anchor = (hash: string, home: boolean) => (home ? hash : url(hash));
export const GALERIE = 'https://poolbau-kochgmbh.de/galerie';
