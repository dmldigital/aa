// Gemeinsame Logik für Browser und Cloudflare-Funktion: Katalog-Typen, Auswahlregeln, Zusammenfassung.

export type Man = { id: string; name: string; tech: string; tagline: string; points: string[]; accent: string; logo: string };
export type Model = {
  id: string; man: string; name: string; desc: string; l: number; w: number; d: number[]; dims: string;
  stairs: string | null; led: 'none' | 'simple' | 'side-selectable' | string; excluded: string[];
  img: string; thumb: string; fx: number; fy: number; ledImg: string | null;
};
export type Color = { id: string; man: string; model: string | null; name: string; desc: string; img: string; thumb: string; fx: number; fy: number; zoom: number };
export type Equip = { id: string; cat: 'cover' | 'technology' | 'iwash' | 'heatpump' | 'lighting'; name: string; desc: string; badge: string; img: string | null; fx: number; fy: number; zoom: number };
export type Katalog = { manufacturers: Man[]; models: Model[]; colors: Color[]; equipment: Equip[]; slots: string[] };

export type Config = {
  man: string | null; model: string | null; color: string | null; led: string | null;
  cover: string | null; tech: string | null; iwash: string | null; heat: string | null; light: string | null;
};
export type Contact = {
  name: string; email: string; phone: string; street: string; zip: string; city: string;
  slot: string; wishes: string; consult: boolean; privacy: boolean; website?: string;
};

export const LED_LABELS: Record<string, string> = {
  none: 'Ohne LED-Streifen', yes: 'Mit LED-Streifen', 'one-side': 'LED-Streifen einseitig', 'both-sides': 'LED-Streifen beidseitig',
};
export const ledSelected = (c: Config) => ['yes', 'one-side', 'both-sides'].includes(c.led || '');

const byId = <T extends { id: string }>(list: T[], id: string | null) => list.find((x) => x.id === id) || null;

export function colorsFor(k: Katalog, c: Config) {
  return k.colors.filter((x) => x.man === c.man && (!x.model || x.model === c.model));
}
/** Ausstattung einer Kategorie ohne die für das Becken gesperrten Optionen (wie im alten Konfigurator). */
export function equipFor(k: Katalog, c: Config, cat: Equip['cat']) {
  const all = k.equipment.filter((e) => e.cat === cat);
  const ex = byId(k.models, c.model)?.excluded || [];
  const ok = all.filter((e) => !ex.includes(e.id));
  return ok.length ? ok : all;
}
export function blockedFor(k: Katalog, c: Config, cat: Equip['cat']) {
  const all = k.equipment.filter((e) => e.cat === cat);
  const ex = byId(k.models, c.model)?.excluded || [];
  const b = all.filter((e) => ex.includes(e.id));
  return b.length < all.length ? b : [];
}

/** Ist die Konfiguration vollständig (für den Versand)? */
export function missing(k: Katalog, c: Config): string[] {
  const m = byId(k.models, c.model);
  const out: string[] = [];
  if (!byId(k.manufacturers, c.man)) out.push('Hersteller');
  if (!m || m.man !== c.man) out.push('Becken');
  if (!byId(k.colors, c.color)) out.push('Farbe');
  if (m && m.led !== 'none' && !c.led) out.push('LED-Streifen');
  if (!byId(k.equipment, c.cover)) out.push('Abdeckung');
  if (!byId(k.equipment, c.tech)) out.push('Technik');
  if (!byId(k.equipment, c.iwash)) out.push('iWash');
  if (!byId(k.equipment, c.heat)) out.push('Wärmepumpe');
  if (!ledSelected(c) && !byId(k.equipment, c.light)) out.push('Beleuchtung');
  return out;
}

export type Row = { k: string; v: string; m?: string; step: number };
export function summarize(k: Katalog, c: Config): Row[] {
  const man = byId(k.manufacturers, c.man);
  const m = byId(k.models, c.model);
  const rows: Row[] = [];
  if (man) rows.push({ k: 'Hersteller', v: man.name, m: man.tech, step: 1 });
  if (m) rows.push({ k: 'Becken', v: m.name, m: m.dims + (m.stairs ? ` · ${m.stairs}` : ''), step: 2 });
  const col = byId(k.colors, c.color);
  if (col) rows.push({ k: 'Beckenfarbe', v: col.name, step: 3 });
  if (m && m.led !== 'none' && c.led) rows.push({ k: 'LED-Streifen', v: LED_LABELS[c.led] || c.led, step: 3 });
  const eq = (id: string | null, label: string, step: number) => {
    const e = byId(k.equipment, id);
    if (e) rows.push({ k: label, v: e.name, m: e.badge || undefined, step });
  };
  eq(c.cover, 'Abdeckung', 4);
  eq(c.tech, 'Technik', 5);
  eq(c.iwash, 'Rückspülung', 5);
  eq(c.heat, 'Wärmepumpe', 6);
  if (!ledSelected(c)) eq(c.light, 'Beleuchtung', 6);
  else rows.push({ k: 'Beleuchtung', v: 'über LED-Streifen', step: 6 });
  return rows;
}

export function validContact(ct: Contact): Record<string, string> {
  const e: Record<string, string> = {};
  if ((ct.name || '').trim().length < 2) e.name = 'Bitte geben Sie Ihren Namen ein.';
  if (!/^\S+@\S+\.\S+$/.test((ct.email || '').trim())) e.email = 'Bitte gültige E-Mail-Adresse.';
  if (ct.consult) {
    if ((ct.phone || '').trim().length < 6 || !/^[+()\d\s./-]+$/.test(ct.phone.trim())) e.phone = 'Bitte gültige Telefonnummer.';
    if (!/^\d{5}$/.test((ct.zip || '').trim())) e.zip = 'Bitte fünfstellige Postleitzahl.';
    if ((ct.city || '').trim().length < 2) e.city = 'Bitte geben Sie Ihren Ort ein.';
    if (!ct.slot) e.slot = 'Bitte wählen Sie ein Zeitfenster.';
  }
  if (!ct.privacy) e.privacy = 'Bitte bestätigen Sie die Datenschutzhinweise.';
  return e;
}
