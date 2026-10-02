import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: 'resources/js/app.ts',
    },
  },
  server: {
    cors: true,
    port: 5174,
    strictPort: true,
  },
});
