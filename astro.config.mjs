import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Custom domain: https://yousefalghzawi.me
export default defineConfig({
site: 'https://yousefalghzawi.me',
trailingSlash: 'ignore',
integrations: [
tailwind(),
sitemap(),
],
});
