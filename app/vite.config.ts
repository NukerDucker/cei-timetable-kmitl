import path from 'node:path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: { alias: { $lib: path.resolve('./src/lib') } },
  server: {
    port: 5174,
    proxy: {
      '/kmitl/api': {
        target: 'https://regis.reg.kmitl.ac.th',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/kmitl\/api/, '/api/'),
      },
    },
  },
  build: { target: 'es2022' },
})
