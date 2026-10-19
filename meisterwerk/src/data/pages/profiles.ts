/**
 * Mitarbeiterprofile liegen als Content Collection `profile` (`src/content/profile`).
 * Die Teil-Website /meisterwerk-exklusive/ zeigt dieselben Profile: gleiche Texte und Fotos, nur Seitentitel
 * (ohne Meta-Beschreibung, so im Original) und bei Baldassarre Foto und Werdegang-Liste anders (Feld `exklusiv`).
 */
import type { CollectionEntry } from 'astro:content';

type ProfileData = CollectionEntry<'profile'>['data'];
export type TimelineItem = NonNullable<ProfileData['timeline']>['items'][number];
/** Profil für die Darstellung: Hauptseite oder (mit `werdegangList`) Exklusiv-Seite */
export type Profile = Omit<ProfileData, 'exklusiv'> & {
  werdegangList?: NonNullable<ProfileData['exklusiv']>['werdegangList'];
};

export function exklusivProfile(profile: ProfileData): Profile {
  const { exklusiv, ...rest } = profile;
  return {
    ...rest,
    ...exklusiv,
    title: `${profile.name} - Meisterwerke Exklusive`,
    description: '',
  };
}
