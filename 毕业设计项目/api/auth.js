/**
 * 登录 / 注册接口（遵循 登录注册接口契约.md）
 */
import request from './request.js'
import { ENABLE_MOCK } from './config.js'
import { appendUserRegistry, getUserRegistry } from '../data/mockPersistence.js'

function mockRegister(form) {
  const username = form?.username?.trim() || 'user'
  if (username === 'admin') {
    return Promise.reject(new Error('该用户名不可注册'))
  }
  if (getUserRegistry().some((u) => u.username === username)) {
    return Promise.reject(new Error('用户名已存在'))
  }
  const userId = Date.now()
  appendUserRegistry({
    userId,
    username,
    phone: form?.phone || '',
    idCard: form?.idCard || '',
    registeredAt: new Date().toISOString(),
    role: 'user'
  })
  return Promise.resolve({
    code: 0,
    message: '注册成功',
    data: { userId, username }
  })
}
function mockLogin(data) {
  const username = data?.username?.trim() || 'user'
  const role = username === 'admin' ? 'admin' : 'user'
  const knownIds = { admin: 0, demo: 2 }
  const reg = getUserRegistry().find((u) => u.username === username)
  const userId =
    knownIds[username] !== undefined
      ? knownIds[username]
      : reg?.userId ?? 1
  return Promise.resolve({
    code: 0,
    message: '登录成功',
    data: {
      token: 'mock-token-' + Date.now(),
      userId,
      username,
      role
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
