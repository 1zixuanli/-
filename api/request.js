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

// 响应拦截：按契约 code 统一处理，业务只拿 data
request.interceptors.response.use(
  (res) => {
    const { code, message, data } = res.data
    if (code === 0) {
      return res.data
    }
    return Promise.reject(new Error(message || '请求失败'))
  },
  (err) => {
    const msg = err.response?.data?.message || err.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default request
