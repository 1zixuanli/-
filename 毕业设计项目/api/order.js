/**
 * 订单接口（对齐开题：数量、支付截止、退票回退余票）
 * POST /api/order/create
 * GET  /api/order/list
 * POST /api/order/cancel
 * POST /api/order/pay
 * POST /api/order/refund
 */
import request from './request.js'
import { ENABLE_MOCK } from './config.js'
import {
  getAllOrders,
  saveAllOrders,
  countSoldTickets,
  getStockAdjustments
} from '../data/mockPersistence.js'
import { getMergedSchedule } from '../data/mockTrainSchedule.js'

const SOLD_OUT_MSG = '当前车票已售完，无法预定'

function findTrain(trainId) {
  return getMergedSchedule().find((t) => t.trainId === trainId)
}

function seatRemainBase(train, seatType) {
  const s = train?.seatTypes?.find((x) => x.seatType === seatType)
  return s ? s.remainCount : 0
}

function effectiveRemain(trainId, seatType, travelDate) {
  const train = findTrain(trainId)
  if (!train) return 0
  const base = seatRemainBase(train, seatType)
  const sold = countSoldTickets(trainId, seatType, travelDate)
  const adj = getStockAdjustments()[`${trainId}|${seatType}`] || 0
  return Math.max(0, base - sold + adj)
}

function unitPriceForTicket(seatPrice, ticketType) {
  let p = Number(seatPrice)
  if (ticketType === 'student') p = Math.round(p * 0.75)
  if (ticketType === 'group') p = Math.round(p * 0.95)
  return p
}

function mockCreateOrder(body) {
  const userId = Number(localStorage.getItem('userId') || 0)
  const username = localStorage.getItem('username') || 'user'
  if (!userId) {
    return Promise.reject(new Error('请先登录'))
  }
  const train = findTrain(body.trainId)
  if (!train) {
    return Promise.reject(new Error('车次不存在'))
  }
  const qty = Math.max(1, Math.floor(Number(body.quantity) || 1))
  const remain = effectiveRemain(body.trainId, body.seatType, body.travelDate)
  if (remain <= 0 || qty > remain) {
    return Promise.reject(new Error(SOLD_OUT_MSG))
  }
  const pname = (body.passengerName || '').trim()
  if (pname.length < 2) {
    return Promise.reject(new Error('请填写乘车人姓名（至少 2 字）'))
  }
  const seat = train.seatTypes.find((s) => s.seatType === body.seatType)
  const ticketType = body.ticketType || 'normal'
  const unitPrice = unitPriceForTicket(seat ? seat.price : 0, ticketType)
  const total = unitPrice * qty
  const orderId = `ORD${Date.now()}${Math.random().toString(36).slice(2, 7)}`
  const payDeadline = new Date(Date.now() + 30 * 60 * 1000).toISOString()
  const order = {
    orderId,
    userId,
    username,
    trainId: body.trainId,
    trainNo: body.trainNo || train.trainNo,
    fromStation: body.fromStation || train.fromStation,
    toStation: body.toStation || train.toStation,
    travelDate: body.travelDate,
    departTime: body.departTime || train.departTime,
    arriveTime: body.arriveTime || train.arriveTime,
    duration: train.duration,
    seatType: body.seatType,
    seatName: seat?.seatName || body.seatType,
    quantity: qty,
    unitPrice,
    price: total,
    passengerName: pname,
    idCard: (body.idCard || '').trim(),
    ticketType,
    status: 'unpaid',
    payDeadline,
    createdAt: new Date().toISOString()
  }
  const list = getAllOrders()
  list.unshift(order)
  saveAllOrders(list)
  return Promise.resolve({
    code: 0,
    message: '下单成功',
    data: { orderId, order }
  })
}

function mockListOrders() {
  const userId = Number(localStorage.getItem('userId') || 0)
  const list = getAllOrders().filter((o) => o.userId === userId)
  return Promise.resolve({ code: 0, message: 'ok', data: list })
}

function mockCancelOrder({ orderId }) {
  const userId = Number(localStorage.getItem('userId') || 0)
  const list = getAllOrders()
  const o = list.find((x) => x.orderId === orderId && x.userId === userId)
  if (!o) {
    return Promise.reject(new Error('订单不存在'))
  }
  if (o.status === 'cancelled' || o.status === 'refunded') {
    return Promise.reject(new Error('订单已关闭'))
  }
  if (o.status === 'paid' || o.status === 'completed') {
    return Promise.reject(new Error('请使用退票功能'))
  }
  o.status = 'cancelled'
  saveAllOrders(list)
  return Promise.resolve({ code: 0, message: '已取消', data: { orderId } })
}

function mockPayOrder({ orderId }) {
  const userId = Number(localStorage.getItem('userId') || 0)
  const list = getAllOrders()
  const o = list.find((x) => x.orderId === orderId && x.userId === userId)
  if (!o) {
    return Promise.reject(new Error('订单不存在'))
  }
  if (o.status !== 'unpaid') {
    return Promise.reject(new Error('仅待支付订单可支付'))
  }
  o.status = 'paid'
  o.paidAt = new Date().toISOString()
  saveAllOrders(list)
  return Promise.resolve({ code: 0, message: '支付成功（模拟）', data: { orderId, status: o.status } })
}

function mockRefundOrder({ orderId }) {
  const userId = Number(localStorage.getItem('userId') || 0)
  const list = getAllOrders()
  const o = list.find((x) => x.orderId === orderId && x.userId === userId)
  if (!o) {
    return Promise.reject(new Error('订单不存在'))
  }
  if (o.status !== 'paid' && o.status !== 'completed') {
    return Promise.reject(new Error('仅已支付或已完成订单可退票'))
  }
  o.status = 'refunded'
  o.refundedAt = new Date().toISOString()
  saveAllOrders(list)
  return Promise.resolve({
    code: 0,
    message: '退票成功，余票已回退（Mock）',
    data: { orderId }
  })
}

export function createOrder(body) {
  if (ENABLE_MOCK) return mockCreateOrder(body)
  return request.post('/order/create', body)
}

export function fetchOrderList() {
  if (ENABLE_MOCK) return mockListOrders()
  return request.get('/order/list')
}

export function cancelOrder(payload) {
  if (ENABLE_MOCK) return mockCancelOrder(payload)
  return request.post('/order/cancel', payload)
}

export function payOrder(payload) {
  if (ENABLE_MOCK) return mockPayOrder(payload)
  return request.post('/order/pay', payload)
}

export function refundOrder(payload) {
  if (ENABLE_MOCK) return mockRefundOrder(payload)
  return request.post('/order/refund', payload)
}

function mockCompleteOrder({ orderId }) {
  const userId = Number(localStorage.getItem('userId') || 0)
  const list = getAllOrders()
  const o = list.find((x) => x.orderId === orderId && x.userId === userId)
  if (!o) {
    return Promise.reject(new Error('订单不存在'))
  }
  if (o.status !== 'paid') {
    return Promise.reject(new Error('仅已支付订单可确认出行'))
  }
  o.status = 'completed'
  o.completedAt = new Date().toISOString()
  saveAllOrders(list)
  return Promise.resolve({
    code: 0,
    message: 'ok',
    data: { orderId, status: 'completed' }
  })
}

/** 确认出行：已支付 → 已完成 */
export function completeOrder(payload) {
  if (ENABLE_MOCK) return mockCompleteOrder(payload)
  return request.post('/order/complete', payload)
}
