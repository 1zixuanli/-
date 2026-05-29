/**
 * Axios 实例：baseURL、超时、请求/响应拦截（按契约处理 code）
 * 后端未启动时，可用 mock 或修改 baseURL
 */
import axios from 'axios'

const request = axios.create({
  baseURL: '/api', // 通过 vite proxy 转发到 localhost:8080，见 vite.config.js
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截：若本地有 token，可统一带上
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => Promise.reject(err))

// 响应拦截：按契约 code 统一处理，业务只拿 data（与后端 ApiResponse 对齐）
request.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body == null || typeof body !== 'object') {
      return Promise.reject(new Error('响应格式异常'))
    }
    const code = Number(body.code)
    const message = body.message
    const data = body.data
    if (code === 0) {
      return body
    }
    return Promise.reject(new Error(message || '请求失败'))
  },
  (err) => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请检查后端是否已启动'))
    }
    if (!err.response) {
      return Promise.reject(new Error('无法连接后端（请启动 Spring Boot 并确认端口 8080）'))
    }
    const b = err.response.data
    const msg =
      (b && typeof b === 'object' && b.message) ||
      err.message ||
      '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default request
