// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { inSitemap, pathFromUrl, siteIndexable } from './src/lib/seo.ts';

const base = process.env.BASE_PATH || '/';
// Sitemap nur für den Livegang (PUBLIC_INDEXABLE=true, aus Umgebung oder .env), Vorschau-Builds bleiben gesperrt
const indexable = siteIndexable(process.env.PUBLIC_INDEXABLE ?? loadEnv('production', process.cwd(), 'PUBLIC_').PUBLIC_INDEXABLE);

export default defineConfig({
  site: process.env.SITE_URL || 'https://meisterwerk-lb.de',
  // Gleiche Adressen wie die alte WordPress-Seite (Slash am Ende), damit alle bestehenden Links und Google-Platzierungen gelten
  trailingSlash: 'always',
  base,
  fonts: [
    {
      name: 'Urbanist',
      cssVariable: '--font-urbanist',
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      provider: fontProviders.google(),
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  // Sitemap ohne Testseiten (/stil/), 404, noindex-Seiten und Duplikate mit fremdem Canonical (Regeln: src/lib/seo.ts)
  integrations: indexable ? [sitemap({ filter: (page) => inSitemap(pathFromUrl(page, base)) })] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
