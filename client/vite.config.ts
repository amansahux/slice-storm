import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Rewrites the Host header to match the target
        secure: false,      // Allow self-signed certificates if needed
        // Optional: Rewrite path if your backend doesn't expect the /api prefix
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
