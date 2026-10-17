/**
 * =============================================================================
 * VITE CONFIGURATION
 * =============================================================================
 * Build tool and dev server for the portfolio.
 * Docs: https://vitejs.dev/config/
 * =============================================================================
 */

import { defineConfig } from 'vite';

export default defineConfig({

  // Where Vite looks for the HTML entry points.
  root: '.',

  // Served as-is, never processed. Anything referenced by a plain runtime
  // path (e.g. the roadmap card icons at /icons/*) belongs here.
  publicDir: 'public',

  server: {
    port: 3000,
    open: true,
    hmr: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',

    rollupOptions: {
      // Two pages, not one. interactive.html is loaded into an iframe by
      // index.html, so it has to be a real build entry — otherwise it is
      // missing from dist/ and the Interactive Mode overlay loads a 404.
      input: {
        main: 'index.html',
        interactive: 'interactive.html',
      },
    },
  },

  css: {
    devSourcemap: true,
  },

  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
    },
  },
});
