/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({ renderLegacyChunks: false })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  build: {

    chunkSizeWarningLimit: 505, // Set a higher limit for react ionic
    outDir: 'build', // Change 'custom-build-folder' to whatever you want
    rollupOptions: {
      output: {
        manualChunks: {
          // Framework core
          'react-vendor': ['react', 'react-dom'],

          // ionic-react
          'react-ionic': ['@ionic/react'],
          'ionic-router': ['@ionic/react-router'],


          // Router-related
          'router': ['react-router', 'react-router-dom'],


          // Firebase (authentication, push notifications, etc.)
          'firebase': ['@capacitor-firebase/authentication'],

          // Capacitor core & plugins
          'capacitor-core': ['@capacitor/core'],
          'capacitor-plugins': [
            '@capacitor/app',
            '@capacitor/geolocation',
            '@capacitor/haptics',
            '@capacitor/keyboard',
            '@capacitor/push-notifications',
            '@capacitor/splash-screen',
            '@capacitor/status-bar',
            '@capawesome/capacitor-android-edge-to-edge-support'
          ],

          // Utility libraries
          'utils': ['dayjs', 'motion'],

          // Mapping libraries
          'maps': ['leaflet', 'react-leaflet'],

          // Animation
          'animation': ['react-confetti']
        }
      }
    }
  },

})
