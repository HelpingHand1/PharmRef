import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const DISEASE_MODULE_RE = /\/src\/data\/(uti|cap|hap-vap|ssti|iai|amr-gram-negative|bacteremia-endocarditis|c-difficile|bone-joint|cns-infections|fungal-infections|advanced-agents|febrile-neutropenia|diabetic-foot|sepsis)\.ts$/
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // A new version waits for the user to accept it (see src/utils/serviceWorker.ts),
      // so a deploy never swaps files out from under a session that is in use.
      registerType: 'prompt',
      includeAssets: ['pwa-192.png', 'pwa-512.png', 'apple-touch-icon.png', 'pharmref-icon.svg'],
      manifest: {
        id: './',
        name: 'PharmRef',
        short_name: 'PharmRef',
        description: 'Pharmacist clinical reference: care pathways, drug monographs, pathogen references, and bedside calculators.',
        lang: 'en',
        categories: ['medical', 'reference', 'productivity'],
        start_url: './',
        scope: './',
        theme_color: '#0f766e',
        background_color: '#f3f5f1',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Calculators', short_name: 'Calcs', url: './#/calculators', icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Breakpoint workspace', short_name: 'Breakpoints', url: './#/breakpoints', icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Compare drugs', short_name: 'Compare', url: './#/compare', icons: [{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webmanifest}'],
        cleanupOutdatedCaches: true,
        // Fonts come from Google; cache them so the app looks the same offline.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,        // listens on all interfaces — enables phone access on same Wi-Fi
    port: 5173,
  },
  preview: {
    host: true,        // also enables `npm run preview` on network
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) return 'vendor'
          if (DISEASE_MODULE_RE.test(id)) return 'disease-data'
        },
      },
    },
  },
})
