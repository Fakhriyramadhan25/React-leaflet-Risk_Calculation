import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server:{
    proxy:
    {
      '/GEE':{
        target: "http://localhost:5000/",
        changeOrigin: true
      },
      '/Query':{
        target:'https://gcp-asia-northeast1.api.carto.com/v3/sql/carto-dw/query/',
        changeOrigin: true
      }
    },
  },
})