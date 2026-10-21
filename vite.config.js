import { defineConfig } from 'vite'
// import path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: "client",
  envDir: "..",
  build: { outDir: "../dist", emptyOutDir: true },
  plugins: [react(),],
})
