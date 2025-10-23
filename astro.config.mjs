import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.guitarskillz.com', // Deine Zukünftige Domain
  integrations: [
    tailwind({
      // Deaktiviert Base-Styles, wenn globals.css verwendet wird
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: 'static', // Stellt sicher, dass es ein SSG ist
});