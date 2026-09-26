import { defineConfig } from 'astro/config';

// Vorschau auf GitHub Pages: SITE_URL/BASE_PATH kommen aus dem Deploy-Workflow.
export default defineConfig({
  site: process.env.SITE_URL || 'https://poolbau-kochgmbh.de',
  base: process.env.BASE_PATH || '/',
});
