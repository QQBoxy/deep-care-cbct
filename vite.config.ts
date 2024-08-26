import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-auth': {
        target: 'https://api_dev-renew.deepcare.com',
        changeOrigin: true,
      },
      '/api-service': {
        target: 'https://api_dev-renew.deepcare.com',
        changeOrigin: true,
      },
    },
  },
});
