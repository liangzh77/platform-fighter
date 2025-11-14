import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    port: 5173,
    open: false,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
