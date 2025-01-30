import { defineConfig } from 'vite';
import path from 'path';
// import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  // plugins: [mkcert()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@server': path.resolve(__dirname, './src/server'),
      '@client': path.resolve(__dirname, './src/client'),
    },
  },
});
