import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: [
        'electron/main.ts',
        'electron/preload.ts'
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // 빌드 시 별칭이 제대로 해석되도록 설정
      external: [],
      output: {
        format: 'es', // ESM 포맷 사용
      }
    },
  },
  server: {
    port: 3000,
  },
})
