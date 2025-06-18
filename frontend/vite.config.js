import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = 'https://automated-deployment-frontend-uc5h.vercel.app';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(API_URL)
  }
}) 