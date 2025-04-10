import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/randycolor/', // GitHub Pages URL의 기본 경로: username.github.io/randycolor
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})
