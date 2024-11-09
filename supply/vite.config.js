import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    global: {}
  }
})
