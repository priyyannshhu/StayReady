import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000/api'),
    'import.meta.env.VITE_ML_SERVICE_URL': JSON.stringify(process.env.VITE_ML_SERVICE_URL || 'http://localhost:8000'),
    'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT || 'development')
  },
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
