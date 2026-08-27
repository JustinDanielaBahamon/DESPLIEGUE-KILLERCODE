import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario para exponer el servidor dentro de un contenedor Docker
    port: 5173,
  },
})
