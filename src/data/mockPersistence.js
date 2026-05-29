const KEY_ORDERS ='rail_mock_orders'
const KEY_USERS ='rail_mock_user_registry'
const KEY_STOCK_ADJ ='rail_mock_stock_adj'
function readJson(key,fallback){
    try{
        const raw = localStorage.getItem(key)
        if(!raw)return fallback
        return JSON.parse(raw)
    }catch{
        return fallback
    }
}
function weriteJson(key,val){
    localStorage.setItem(key,JSON.stringify(val))
}
export function getAllOrders(){
    return readJson(KEY_ORDERS,[])
}
export function saveAllOrders(list){
    weriteJson(KEY_ORDERS,list)
}
export function getUserRegistry(){
    return readJson(KEY_USERS,[])
}
export function appendUserRegistry(entry) {
  const list = getUserRegistry()
  if (list.some((u) => u.username === entry.username)) return list
  list.push(entry)
  weriteJson(KEY_USERS, list)
  return list
}

export function getStockAdjustments() {
  return readJson(KEY_STOCK_ADJ, {})
}

export function setStockAdjustment(trainId, seatType, deltaOrAbsolute, mode = 'add') {
  const adj = getStockAdjustments()
  const k = `${trainId}|${seatType}`
  const prev = adj[k] || 0
  adj[k] = mode === 'set' ? Number(deltaOrAbsolute) : prev + Number(deltaOrAbsolute)
  weriteJson(KEY_STOCK_ADJ, adj)
  return adj[k]
}
export function countSoldTickets(trainId,seatType,travelDate){
    const orders = getAllOrders()
    return orders.filter((o)=>o.trainId===trainId&&o.seatType===seatType&&o.travelDate===travelDate&&o.status!=='cancelled'&&o.status!=='refunded').reduce((sum,o)=>sum+(Number(o.quantity||1)),0)
}