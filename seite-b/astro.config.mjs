import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Unterpfad für die Vorschau auf GitHub Pages (z. B. /aa/seite-a/); lokal und auf der eigenen Domain leer
  base: process.env.BASE_PATH || '/',
  integrations: [tailwind({
    applyBaseStyles: false
  })]
});
