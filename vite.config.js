import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Pour ajouter des polyfills spécifiques
      include: ['crypto']
    }),
  ],
  server: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
  },
  base: '/coolie/', // Cette configuration semble correcte
  resolve: {
    alias: {
      // Évite les problèmes avec crypto
      crypto: 'crypto-browserify',
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
