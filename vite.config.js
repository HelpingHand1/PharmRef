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
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.png', 'pwa-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'PharmRef',
        short_name: 'PharmRef',
        description: 'Pharmacist ID Clinical Reference Tool',
        theme_color: '#0ea5e9',
        background_color: '#0a0f1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webmanifest}'],
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
