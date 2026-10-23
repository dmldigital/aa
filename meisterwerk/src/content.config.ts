/**
 * Content Collections: alle Inhalte, die als Einträge mit eigener Adresse erscheinen (Beiträge, Profile,
 * Leistungen, Kollektionen). Ein Eintrag = eine JSON-Datei unter `src/content/<sammlung>/<slug>.json`,
 * Bilder als relativer Pfad nach `src/assets/img` (werden mit `image()` geprüft und optimiert).
 * Seitenweise Inhalte ohne Einträge (Startseite, Kontakt, Studio …) bleiben in `src/data/`.
 */
import { defineCollection, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const json = (name: string) => glob({ pattern: '*.json', base: `./src/content/${name}` });

/** Meta-Beschreibung: Pflicht, 110 bis 160 Zeichen (Build bricht sonst ab). */
const metaDescription = z.string().min(110).max(160);

const triple = z.tuple([z.number(), z.number(), z.number()]);

const beitragFelder = (image: ImageFunction) => ({
  year: z.string(),
  month: z.string(),
  day: z.string(),
  slug: z.string(),
  title: z.string(),
  /** Meta-Beschreibung (Pflicht, 110 bis 160 Zeichen) */
  description: metaDescription,
  /** Titelbild über dem Text */
  image: image(),
  /** Erbrachte Leistungen (Kacheln links in der Infoleiste) */
  services: z.array(z.string()),
  info: z.object({ year: z.string(), place: z.string(), duration: z.string(), area: z.string() }),
  sections: z.array(z.object({ heading: z.string(), text: z.string() })),
  gallery: z.array(image()),
  /** Fließtext in 17/25,5 statt 15/22,5 (so im Original, nur „Altbau WDVS“ ist kleiner) */
  largeText: z.boolean().optional(),
});

const beitraege = defineCollection({
  loader: json('beitraege'),
  schema: ({ image }) => z.object(beitragFelder(image)),
});

const exklusivBeitraege = defineCollection({
  loader: json('exklusiv-beitraege'),
  schema: ({ image }) =>
    z.object({
      ...beitragFelder(image),
      /** Seitentitel ohne Markenzusatz (das Layout hängt „ | Meisterwerke Exklusive“ an), höchstens 35 Zeichen */
      pageTitle: z.string().max(35),
      category: z.string(),
      categoryHref: z.string(),
      /** Datum unter der Überschrift, z. B. „Mai / 2025“ */
      date: z.string(),
      imageAlt: z.string(),
      /** Spalten der Galerie je Desktop, Tablet, Handy */
      galleryColumns: triple,
    }),
});

const timelineItems = z.array(z.object({ date: z.string(), text: z.string() }));

const profile = defineCollection({
  loader: json('profile'),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      /** Seitentitel (ohne Markenzusatz, höchstens 30 Zeichen) und Meta-Beschreibung */
      title: z.string().max(30),
      description: metaDescription,
      name: z.string(),
      /** Kurzzeile über dem Namen (Bereich unter dem Hero) */
      tagline: z.string(),
      /** Zweite Zeile unter dem Namen (nur Gedenkseite) */
      subtitle: z.string().optional(),
      photo: image(),
      /** Text links neben dem Foto (HTML) */
      intro: z.string(),
      /** Text rechts neben dem Foto (HTML) */
      motto: z.string(),
      /** Beruflicher Werdegang (nur Baldassarre Fortino) */
      timeline: z.object({ heading: z.string(), items: timelineItems }).optional(),
      /** Abweichungen auf der Teil-Website /meisterwerk-exklusive/ (anderes Foto, Werdegang als Liste) */
      exklusiv: z
        .object({
          photo: image().optional(),
          werdegangList: z.object({ heading: z.string(), items: timelineItems }).optional(),
        })
        .optional(),
    }),
});

const blockFelder = z.object({ no: z.string(), title: z.string(), html: z.string() });

const leistungen = defineCollection({
  loader: json('leistungen'),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      /** Seitentitel ohne Markenzusatz, höchstens 30 Zeichen */
      title: z.string().max(30),
      description: metaDescription,
      hero: z.object({ title: z.string(), text: z.string(), /** Ein Satz mit Ortsbezug (Ludwigsburg, Freiberg am Neckar) */ local: z.string().optional(), img: image(), alt: z.string() }),
      intro: z.object({
        img: image(),
        alt: z.string(),
        label: z.string(),
        title: z.string(),
        list: z.string(),
        blocks: z.array(blockFelder),
      }),
      /** Bildergruppe (Original e9ec5aa): Spaltenbreite in % (Desktop, Tablet), Bilder untereinander */
      showcase: z
        .array(
          z.object({
            width: z.tuple([z.number(), z.number()]),
            images: z.array(image()),
            /** Bilder senkrecht mittig in der Spalte (sonst oben) */
            center: z.boolean().optional(),
          }),
        )
        .optional(),
      /** … oder Galerie (Original aa57ee6, nur Glatte Wände) */
      gallery: z.array(image()).optional(),
      pillars: z.array(z.object({ title: z.string(), html: z.string() })),
    }),
});

/** Bausteine der rechten Spalte der Einleitung (Original aeb8cf0 der Exklusiv-Seiten) */
const introTeil = z.discriminatedUnion('t', [
  z.object({ t: z.literal('label'), text: z.string() }),
  z.object({ t: z.literal('title'), text: z.string() }),
  z.object({ t: z.literal('html'), html: z.string() }),
  z.object({ t: z.literal('spacer'), m: z.boolean().optional(), small: z.boolean().optional() }),
  z.object({ t: z.literal('block'), no: z.string(), title: z.string(), html: z.string() }),
  z.object({ t: z.literal('button'), label: z.string(), href: z.string() }),
]);

const exklusivLeistungen = defineCollection({
  loader: json('exklusiv-leistungen'),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      /** Seitentitel ohne Markenzusatz (auch Name der Leistung), höchstens 35 Zeichen */
      title: z.string().max(35),
      description: metaDescription,
      intro: z.object({ img: image(), parts: z.array(introTeil) }),
      pillars: z.array(
        z.object({ title: z.string(), html: z.string(), bullets: z.array(z.string()) }),
      ),
      feature: z.object({
        accordion: z.array(z.object({ title: z.string(), html: z.string(), open: z.boolean() })),
        button: z.object({ label: z.string(), href: z.string() }),
        img: image(),
      }),
      gallery: z.object({ id: z.string(), columns: triple, items: z.array(image()) }),
      /** Original-ID der Projekte-Sektion */
      projectsId: z.string(),
    }),
});

const kollektionen = defineCollection({
  loader: json('kollektionen'),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      /** Seitentitel ohne Markenzusatz, höchstens 35 Zeichen */
      title: z.string().max(35),
      description: metaDescription,
      headline: z.string(),
      headlineId: z.string(),
      /** Spalten je Zeile ab Tablet (Karten stehen links, auch bei weniger Karten) */
      columns: z.union([z.literal(3), z.literal(4)]),
      collections: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          rows: z.array(
            z.object({
              id: z.string(),
              cards: z.array(
                z.object({
                  title: z.string(),
                  /** Beschreibung (HTML) */
                  text: z.string(),
                  /** Eigenschaften, Einsatzbereich, Charakter (HTML) */
                  details: z.string(),
                  image: image(),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
});

export const collections = {
  beitraege,
  'exklusiv-beitraege': exklusivBeitraege,
  profile,
  leistungen,
  'exklusiv-leistungen': exklusivLeistungen,
  kollektionen,
};
