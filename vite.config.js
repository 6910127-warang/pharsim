import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this project from /pharsim/, but keep `vite dev` at root.
  base: command === 'build' ? '/pharsim/' : '/',
}))
