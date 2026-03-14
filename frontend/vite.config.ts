import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          if (id.includes('recharts')) {
            return 'charts';
          }
          if (id.includes('leaflet')) {
            return 'maps';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
