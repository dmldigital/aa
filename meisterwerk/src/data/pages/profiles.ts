/**
 * Mitarbeiterprofile liegen als Content Collection `profile` (`src/content/profile`).
 * Die Teil-Website /meisterwerk-exklusive/ hat kein eigenes Über uns und keine eigenen Profile (Nutzerentscheidung), die
 * Hauptseite zeigt sie.
 */
import type { CollectionEntry } from 'astro:content';

type ProfileData = CollectionEntry<'profile'>['data'];
export type TimelineItem = NonNullable<ProfileData['timeline']>['items'][number];
/** Profil für die Darstellung: Hauptseite oder (mit `werdegangList`) Exklusiv-Seite */
export type Profile = Omit<ProfileData, 'exklusiv'> & {
  werdegangList?: NonNullable<ProfileData['exklusiv']>['werdegangList'];
};
