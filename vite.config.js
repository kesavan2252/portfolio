import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Portfolio-K',
      short_name: 'Portfolio-K',
      description: 'My personal portfolio PWA',
      theme_color: '#181c20',
      background_color: '#181c20',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'favicon.ico',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'favicon.ico',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
