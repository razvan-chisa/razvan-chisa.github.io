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
        'dummy/index': resolve(__dirname, 'dummy/index.html'),
      },
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
});
