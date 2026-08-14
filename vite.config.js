import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    allowedHosts: ['uptimeforge.chandancr.xyz'], 
    port: 5173                              
  },
  server: {
    host: true 
  }
})
