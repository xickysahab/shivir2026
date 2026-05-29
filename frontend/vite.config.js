import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // --- OPTION A: LOCAL BACKEND (Default) ---
        target: 'http://127.0.0.1:5001',
        
        // --- OPTION B: LIVE PRODUCTION BACKEND (Uncomment to use Render backend locally) ---
        // target: 'https://shivir2026.onrender.com',
        
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
