import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PharmRef',
        short_name: 'PharmRef',
        description: 'Pharmacist ID Clinical Reference Tool',
        theme_color: '#0ea5e9',
        background_color: '#0a0f1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) return 'vendor'
          if (id.includes('/src/data/')) return 'disease-data'
        },
      },
    },
  },
})
