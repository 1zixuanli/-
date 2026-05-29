import request from './request.js'
import { ENABLE_MOCK } from './config.js'
import { filterMockTrains } from '../data/mockTrainSchedule.js'
import { countSoldTickets, getStockAdjustments } from '../data/mockPersistence.js'

function applyDynamicRemain(rows, travelDate) {
  const date = (travelDate || '').toString()
  return rows.map((row) => ({
    ...row,
    seatTypes: row.seatTypes.map((s) => {
      const sold = countSoldTickets(row.trainId, s.seatType, date)
      const adj = getStockAdjustments()[`${row.trainId}|${s.seatType}`] || 0
      const remain = Math.max(0, Number(s.remainCount) - sold + adj)
      return { ...s, remainCount: remain }
    })
  }))
}

function mockGetTrainList(params) {
  const { from, to, date, highSpeedOnly, ticketType } = params || {}
  let data = filterMockTrains({ from, to, highSpeedOnly })
  data = applyDynamicRemain(data, date)
  return Promise.resolve({
    code: 0,
    message: '获取车票列表成功',
    data,
    meta: { ticketType: ticketType || 'normal' }
  })
}

export function fetchTrainList(params) {
  if (ENABLE_MOCK) {
    return mockGetTrainList(params)
  }
  return request.get('/train/list', { params })
}
