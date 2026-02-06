/**
 * =============================================================================
 * VITE CONFIGURATION
 * =============================================================================
 * 
 * Vite is our build tool and development server.
 * This file configures how Vite handles our project.
 * 
 * Documentation: https://vitejs.dev/config/
 * =============================================================================
 */

import { defineConfig } from 'vite';

export default defineConfig({
  
  // ---------------------------------------------------------------------------
  // ROOT DIRECTORY
  // ---------------------------------------------------------------------------
  // Where Vite looks for index.html (default is project root)
  root: '.',

  // ---------------------------------------------------------------------------
  // PUBLIC DIRECTORY
  // ---------------------------------------------------------------------------
  // Static assets that should be served as-is (not processed by Vite)
  // Example: favicon.ico, robots.txt, static images
  publicDir: 'public',

  // ---------------------------------------------------------------------------
  // DEVELOPMENT SERVER SETTINGS
  // ---------------------------------------------------------------------------
  server: {
    // Port to run the dev server on
    port: 3000,
    
    // Automatically open browser when server starts
    open: true,
    
    // Enable hot module replacement (updates without full reload)
    hmr: true,
  },

  // ---------------------------------------------------------------------------
  // BUILD SETTINGS
  // ---------------------------------------------------------------------------
  build: {
    // Output directory for production build
    outDir: 'dist',
    
    // Generate sourcemaps for debugging production issues
    sourcemap: true,
    
    // Minify the output for smaller file sizes
    minify: 'terser',
  },

  // ---------------------------------------------------------------------------
  // CSS SETTINGS
  // ---------------------------------------------------------------------------
  css: {
    // Enable CSS source maps for easier debugging
    devSourcemap: true,
    
    // SCSS/Sass specific options
    preprocessorOptions: {
      scss: {
        // You can add global SCSS imports here if needed
        // additionalData: `@import "./src/styles/_variables.scss";`
      }
    }
  },

  // ---------------------------------------------------------------------------
  // RESOLVE ALIASES
  // ---------------------------------------------------------------------------
  // Shortcuts for import paths (optional but helpful)
  resolve: {
    alias: {
      '@': '/src',
      '@styles': '/src/styles',
      '@modules': '/src/modules',
      '@assets': '/src/assets',
    }
  }
});
