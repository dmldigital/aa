/**
 * Bildfolge des Hero-Flugs (`public/hero-flug/d` Desktop, `m` Handy). Gemeinsam genutzt vom Hero (`sections/HeroFull.astro`)
 * und der Willkommen-Szene der Startseite, deren erstes Bild am Desktop das letzte Bild des Flugs ist.
 */
export const FLUG_FRAMES = 177;
/** Version der Bildfolge: bei jedem neuen Flug erhöhen (Browser-Cache) */
export const FLUG_V = '2026-11-25-stab';
export const flugBase = () => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}hero-flug/`;
/** Letztes Desktop-Bild des Flugs (Wohn- und Essbereich) */
export const flugEndDesktop = () => `${flugBase()}d/${String(FLUG_FRAMES - 1).padStart(3, '0')}.webp?v=${FLUG_V}`;
