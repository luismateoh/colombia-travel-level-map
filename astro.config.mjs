import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: "server",
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  adapter: vercel(),
  build: {
    // Enable code splitting
    splitting: true,
    // Inline smaller assets
    inlineStylesheets: 'auto',
    // Optimize assets
    assets: '_astro'
  },
  vite: {
    build: {
      // Enable code splitting for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks
            'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'svelte': ['svelte', 'svelte/store'],
            // Map components chunk
            'map': ['./src/components/map/ColombianMap.svelte', './src/components/map/Map.svelte']
          }
        }
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000
    },
    ssr: {
      // Optimize SSR external dependencies
      noExternal: ['firebase']
    }
  },
  experimental: {
    // Enable view transitions for better UX
    viewTransitions: true
  }
});