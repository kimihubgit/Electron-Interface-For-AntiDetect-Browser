import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 5188,
    strictPort: true
  },
  plugins: [react()],
})
