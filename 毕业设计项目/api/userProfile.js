/**
 * 个人中心：对接后端 GET/PUT /api/user/profile
 */
import request from './request.js'
import { ENABLE_MOCK } from './config.js'
import { getUserRegistry } from '../data/mockPersistence.js'

function mockGetProfile() {
  const userId = Number(localStorage.getItem('userId') || 0)
  const username = localStorage.getItem('username') || ''
  const phone =
    localStorage.getItem('profile_phone') ||
    getUserRegistry().find((u) => u.userId === userId)?.phone ||
    ''
  const idCard =
    localStorage.getItem('profile_idCard') ||
    getUserRegistry().find((u) => u.userId === userId)?.idCard ||
    ''
  return Promise.resolve({
    code: 0,
    message: 'ok',
    data: { userId, username, phone, idCard }
  })
}

function mockUpdateProfile({ phone, idCard }) {
  if (phone !== undefined) {
    localStorage.setItem('profile_phone', (phone || '').trim())
  }
  if (idCard !== undefined) {
    localStorage.setItem('profile_idCard', (idCard || '').trim())
  }
  return Promise.resolve({
    code: 0,
    message: '保存成功',
    data: {
      phone: localStorage.getItem('profile_phone') || '',
      idCard: localStorage.getItem('profile_idCard') || ''
    }
  })
}

export function fetchProfile() {
  if (ENABLE_MOCK) return mockGetProfile()
  return request.get('/user/profile')
}

export function updateProfile(body) {
  if (ENABLE_MOCK) return mockUpdateProfile(body)
  return request.put('/user/profile', body)
}
