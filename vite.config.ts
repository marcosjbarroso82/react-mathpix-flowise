import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
      base: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/' : '/',
      scope: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/' : '/',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/index.html' : '/index.html',
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              }
            },
          }
        ]
      },
      manifest: {
        name: 'MathPix Flowise OCR',
        short_name: 'MathPix OCR',
        description: 'Aplicación de OCR matemático con MathPix y Flowise para reconocimiento de texto e imágenes',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        scope: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/' : '/',
        start_url: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/' : '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise/' : '/',
  define: {
    __REACT_ROUTER_BASENAME__: JSON.stringify(process.env.NODE_ENV === 'production' ? '/react-mathpix-flowise' : '/'),
  },
});
