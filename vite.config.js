import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js viaja en un chunk diferido que solo se descarga con la vista 3D.
    chunkSizeWarningLimit: 1100,
  },
})
