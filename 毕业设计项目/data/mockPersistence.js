/**
 * Mock 持久化（localStorage），对齐开题：订单、注册用户、管理端余票调整
 */
const KEY_ORDERS = 'rail_mock_orders'
const KEY_USERS = 'rail_mock_user_registry'
const KEY_STOCK_ADJ = 'rail_mock_stock_adj'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getAllOrders() {
  return readJson(KEY_ORDERS, [])
}

export function saveAllOrders(list) {
  writeJson(KEY_ORDERS, list)
}

export function getUserRegistry() {
  return readJson(KEY_USERS, [])
}

export function appendUserRegistry(entry) {
  const list = getUserRegistry()
  if (list.some((u) => u.username === entry.username)) return
  list.push(entry)
  writeJson(KEY_USERS, list)
}

/** 管理端对某车次某席别增加可售张数（可负，用于压测；展示时与基准余票合并） */
export function getStockAdjustments() {
  return readJson(KEY_STOCK_ADJ, {})
}

export function setStockAdjustment(trainId, seatType, deltaOrAbsolute, mode = 'add') {
  const adj = getStockAdjustments()
  const k = `${trainId}|${seatType}`
  const prev = adj[k] || 0
  adj[k] = mode === 'set' ? Number(deltaOrAbsolute) : prev + Number(deltaOrAbsolute)
  writeJson(KEY_STOCK_ADJ, adj)
  return adj[k]
}

/** 占用余票的订单：待支付、已支付、已完成（已取消、已退票不计入，余票回退） */
export function countSoldTickets(trainId, seatType, travelDate) {
  const orders = getAllOrders()
  return orders
    .filter(
      (o) =>
        o.trainId === trainId &&
        o.seatType === seatType &&
        o.travelDate === travelDate &&
        o.status !== 'cancelled' &&
        o.status !== 'refunded'
    )
    .reduce((sum, o) => sum + (Number(o.quantity) || 1), 0)
}
