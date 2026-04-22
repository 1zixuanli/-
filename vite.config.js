import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const spring = {
  target: 'http://localhost:8080',
  changeOrigin: true,
  ws: false,
  /** 前端源码目录名为 api，模块地址为 /api/*.js；前缀代理不能把这些 .js 转到后端（否则会返回 JSON 导致白屏） */
  bypass(req) {
    const pathOnly = (req.url || '').split('?')[0]
    if (/^\/api\/[^/]+\.js$/.test(pathOnly)) return req.url
  }
}

// 前端源码目录名为 api，开发时模块 URL 为 /api/*.js，不能与整段 /api 代理混用。
// 仅按后端真实前缀转发，避免 bypass 返回值触发 Vite 代理层 404 类型错误。
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  server: {
    proxy: {
      '/api/user': spring,
      '/api/train': spring,
      '/api/order': spring,
      '/api/admin': spring
    }
  }
})
