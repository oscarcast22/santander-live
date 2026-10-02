import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://santanderlive.uad.mx/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/404') })],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  fonts: [{
    provider: fontProviders.local(),
    name: 'Montserrat Variable',
    cssVariable: '--font-montserrat',
    display: 'swap',
    fallbacks: ['Arial', 'system-ui'],
    optimizedFallbacks: true,
    options: {
      variants: ['normal', 'italic'].map((style) => ({
        src: [`@fontsource-variable/montserrat/files/montserrat-latin-wght-${style}.woff2`],
        weight: '100 900',
        style,
      })),
    },
  }],
});
