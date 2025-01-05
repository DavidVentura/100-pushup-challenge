// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro'


// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({applyBaseStyles: false,}),
    AstroPWA({
      manifest: {
        name: '100 Pushup challenge',
        short_name: '100 PC',
        theme_color: '#ffffff',
        screenshots: [
            {
              "src": "screenshot-mobile.jpg",
              "sizes": "647x1280",
              "type": "image/jpg"
            }
        ],
        icons: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,mp3}'],
      },
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      /* other options */
      /* enable sw on development */
      devOptions: {
        enabled: true
        /* other options */
      }})
  ]
});
