import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://automated-deployment-frontend-uc5h.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://automated-deployment-frontend-uc5h.vercel.app')
  }
}) 