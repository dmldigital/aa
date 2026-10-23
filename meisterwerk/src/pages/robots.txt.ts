import type { APIRoute } from 'astro';
import { siteIndexable } from '../lib/seo';

/** Nur bei `PUBLIC_INDEXABLE=true` (Livegang) freigegeben, sonst alles gesperrt (Vorschau). */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const lines = siteIndexable(import.meta.env.PUBLIC_INDEXABLE)
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL(`${base}sitemap-index.xml`, site).href}`]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
