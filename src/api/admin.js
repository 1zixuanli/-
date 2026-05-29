/**
 * 管理端：Mock 或真实后端 /api/admin/*
 */
import request from './request.js'
import { ENABLE_MOCK } from './config.js'
import {
  getAllOrders,
  getUserRegistry,
  setStockAdjustment,
  countSoldTickets,
  getStockAdjustments
} from '../data/mockPersistence.js'
import { getMergedSchedule } from '../data/mockTrainSchedule.js'

const DEFAULT_MOCK_USERS = [
  { userId: 0, username: 'admin', phone: '13800000000', idCard: '', registeredAt: '2025-01-01T00:00:00.000Z', role: 'admin' },
  { userId: 2, username: 'demo', phone: '13900000000', idCard: '', registeredAt: '2025-01-02T00:00:00.000Z', role: 'user' }
]

function ensureAdmin() {
  if (localStorage.getItem('role') !== 'admin') {
    return Promise.reject(new Error('无权限'))
  }
}

function mockStats() {
  const orders = getAllOrders()
  const paid = orders.filter((o) => o.status === 'paid' || o.status === 'completed')
  const revenue = paid.reduce((s, o) => s + Number(o.price || 0), 0)
  const userMap = new Map()
  for (const u of DEFAULT_MOCK_USERS) userMap.set(u.username, u)
  for (const u of getUserRegistry()) userMap.set(u.username, u)
  return Promise.resolve({
    code: 0,
    message: 'ok',
    data: {
      orderTotal: orders.length,
      unpaid: orders.filter((o) => o.status === 'unpaid').length,
      paid: orders.filter((o) => o.status === 'paid').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      refunded: orders.filter((o) => o.status === 'refunded').length,
      revenue,
      userCount: userMap.size
    }
  })
}

function mockUsers() {
  const reg = getUserRegistry()
  const map = new Map()
  for (const u of DEFAULT_MOCK_USERS) {
    map.set(u.username, { ...u })
  }
  for (const u of reg) {
    map.set(u.username, { ...u })
  }
  return Promise.resolve({ code: 0, message: 'ok', data: [...map.values()] })
}

function mockOrders() {
  const list = [...getAllOrders()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
  return Promise.resolve({ code: 0, message: 'ok', data: list })
}

function mockTrainsAdmin() {
  const adj = getStockAdjustments()
  const today = new Date().toISOString().slice(0, 10)
  const data = getMergedSchedule().map((row) => ({
    ...row,
    seatTypes: row.seatTypes.map((s) => {
      const sold = countSoldTickets(row.trainId, s.seatType, today)
      const a = adj[`${row.trainId}|${s.seatType}`] || 0
      const displayRemain = Math.max(0, s.remainCount - sold + a)
      return {
        ...s,
        baseRemain: s.remainCount,
        soldToday: sold,
        stockAdjust: a,
        displayRemain
      }
    })
  }))
  return Promise.resolve({ code: 0, message: 'ok', data })
}

function mockAdjustStock({ trainId, seatType, delta }) {
  setStockAdjustment(trainId, seatType, Number(delta), 'add')
  return Promise.resolve({ code: 0, message: '已调整', data: { trainId, seatType } })
}

function mockSalesByTrain() {
  const orders = getAllOrders().filter((o) =>
    ['unpaid', 'paid', 'completed'].includes(o.status)
  )
  const map = new Map()
  for (const o of orders) {
    const k = `${o.trainNo}|${o.fromStation}|${o.toStation}`
    map.set(k, (map.get(k) || 0) + (Number(o.quantity) || 1))
  }
  const data = [...map.entries()].map(([key, count]) => {
    const [trainNo, fromStation, toStation] = key.split('|')
    return { trainNo, fromStation, toStation, count }
  })
  data.sort((a, b) => b.count - a.count)
  return Promise.resolve({ code: 0, message: 'ok', data })
}

function mockTrainManifest() {
  return Promise.resolve({ code: 0, message: 'ok', data: getMergedSchedule() })
}

export function fetchAdminStats() {
  if (ENABLE_MOCK) return ensureAdmin() || mockStats()
  return ensureAdmin() || request.get('/admin/stats')
}

export function fetchAdminUsers() {
  if (ENABLE_MOCK) return ensureAdmin() || mockUsers()
  return ensureAdmin() || request.get('/admin/users')
}

export function fetchAdminOrders() {
  if (ENABLE_MOCK) return ensureAdmin() || mockOrders()
  return ensureAdmin() || request.get('/admin/orders')
}

export function fetchAdminTrains() {
  if (ENABLE_MOCK) return ensureAdmin() || mockTrainsAdmin()
  return ensureAdmin() || request.get('/admin/trains')
}

export function adminAdjustStock(payload) {
  if (ENABLE_MOCK) return ensureAdmin() || mockAdjustStock(payload)
  return ensureAdmin() || request.post('/admin/stock/adjust', payload)
}

export function fetchAdminSalesByTrain() {
  if (ENABLE_MOCK) return ensureAdmin() || mockSalesByTrain()
  return ensureAdmin() || request.get('/admin/sales/by-train')
}

export function fetchAdminTrainManifest() {
  if (ENABLE_MOCK) return ensureAdmin() || mockTrainManifest()
  return ensureAdmin() || request.get('/admin/train/manifest')
}

/** 新增车次（仅后端模式） */
export function adminCreateTrain(body) {
  if (ENABLE_MOCK) {
    return Promise.reject(new Error('Mock 模式下请使用页面内本地新增'))
  }
  return ensureAdmin() || request.post('/admin/train', body)
}

/** 删除车次（仅后端模式） */
export function adminDeleteTrain(trainId) {
  if (ENABLE_MOCK) {
    return Promise.reject(new Error('Mock 模式下请使用页面内本地删除'))
  }
  return ensureAdmin() || request.delete(`/admin/train/${encodeURIComponent(trainId)}`)
}
