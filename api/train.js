import request from './request.js'
import { filterMockTrains } from '../data/mockTrainSchedule.js'

const ENABLE_MOCK = true

function mockGetTrainList(params) {
  const { from, to, date, highSpeedOnly, ticketType } = params || {}
  const data = filterMockTrains({ from, to, highSpeedOnly })
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
