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
    // Seitentitel ohne Marke (das Layout ergänzt sie). Eigene Beschreibung, weil die Seite per Canonical auf das Profil der Hauptseite zeigt
    title: profile.name,
    description: profile.subtitle
      ? `In Erinnerung an ${profile.name}, Teil der Familie und der Meisterwerk Malermanufaktur in Freiberg am Neckar. Gedenkseite bei Meisterwerke Exklusive.`
      : `${profile.name} gehört zum Team der Meisterwerk Malermanufaktur in Freiberg am Neckar. Das Profil auf der Teil-Website Meisterwerke Exklusive.`,
  };
}
