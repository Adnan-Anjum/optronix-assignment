import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server:{
    proxy:{
      '/req':{
        target:'http://localhost:8000',
        changeOrigin:true,
        secure:false
      }
    }
  }
})
