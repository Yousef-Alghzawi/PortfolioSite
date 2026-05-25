import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://yousef-alghzawi.github.io/PortfolioSite
export default defineConfig({
  site: 'https://yousef-alghzawi.github.io',
  base: '/PortfolioSite',
  trailingSlash: 'ignore',
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
