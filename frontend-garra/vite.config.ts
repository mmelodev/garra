import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      '/aluno': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      '/professor': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
    },
  },
});
