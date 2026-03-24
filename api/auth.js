/**
 * 登录 / 注册接口（遵循 登录注册接口契约.md）
 */
import request from './request.js'

// 无后端时设为 true，使用 Mock 数据，便于在 Cursor 中仅运行前端体验流程；接真实后端时改为 false
const ENABLE_MOCK = true

function mockRegister(form) {
  return Promise.resolve({
    code: 0,
    message: '注册成功',
    data: { userId: 1, username: form?.username || 'user' }
  })
}
function mockLogin(data) {
  return Promise.resolve({
    code: 0,
    message: '登录成功',
    data: {
      token: 'mock-token-' + Date.now(),
      userId: 1,
      username: data?.username || 'user'
    }
  })
}

/**
 * 用户注册
 * 契约：POST /api/user/register
 * Body: { username, password, phone, idCard? }
 * 成功: { code: 0, message, data: { userId, username } }
 */
export function register(form) {
  if (ENABLE_MOCK) {
    return mockRegister(form)
  }
  return request.post('/user/register', form)
}

/**
 * 用户登录
 * 契约：POST /api/user/login
 * Body: { username, password }
 * 成功: { code: 0, message, data: { token, userId, username } }
 */
export function login(data) {
  if (ENABLE_MOCK) {
    return mockLogin(data)
  }
  return request.post('/user/login', data)
}
