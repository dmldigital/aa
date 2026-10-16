// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://meisterwerk-lb.de',
  base: process.env.BASE_PATH || '/',
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
  ],
  build: {
    // Eine einzelne Seite: das kleine CSS direkt ins HTML, damit kein Stylesheet das Rendern blockiert
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
