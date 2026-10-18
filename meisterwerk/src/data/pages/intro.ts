// Bausteine der rechten Spalte der Einleitung (Original 04f30bf der Leistungsseiten, aeb8cf0 der Exklusiv-Seiten)
import { BUTTON } from './services';

export type IntroPart =
  | { t: 'label'; text: string }
  | { t: 'title'; text: string }
  | { t: 'html'; html: string }
  /** Abstand; `m` = auch auf dem Handy als (0 px hoher) Flex-Eintrag vorhanden, `small` = kleiner Abstand vor dem Button */
  | { t: 'spacer'; m?: boolean; small?: boolean }
  | { t: 'block'; no: string; title: string; html: string }
  | { t: 'button'; label: string; href: string };

interface IntroData {
  label: string;
  title: string;
  list: string;
  blocks: { no: string; title: string; html: string }[];
}

/** Reihenfolge wie im Original der Leistungsseiten */
export function serviceParts(intro: IntroData): IntroPart[] {
  const [a, b] = intro.blocks;
  return [
    { t: 'label', text: intro.label },
    { t: 'title', text: intro.title },
    { t: 'html', html: intro.list },
    { t: 'spacer', m: true },
    { t: 'block', ...a },
    { t: 'spacer' },
    { t: 'block', ...b },
    { t: 'spacer' },
    { t: 'spacer' },
    { t: 'spacer' },
    { t: 'spacer', small: true },
    { t: 'button', label: BUTTON.label, href: BUTTON.href },
  ];
}
