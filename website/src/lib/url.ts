/** Pfad relativ zur Basis-URL der Website (z. B. /aa/ auf GitHub Pages, / auf der eigenen Domain). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
