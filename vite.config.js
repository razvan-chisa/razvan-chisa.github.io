import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'projects/index': resolve(__dirname, 'projects/index.html'),
        'contact/index': resolve(__dirname, 'contact/index.html'),
        'dummy/index': resolve(__dirname, 'dummy/index.html'),
      },
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
});
