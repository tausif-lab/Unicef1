import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
allowedHosts: ["263f5293.ngrok-free.app"]
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
