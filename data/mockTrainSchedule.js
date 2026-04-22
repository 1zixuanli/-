/**
 * 虚拟车次（高铁/动车 G、D 字头）
 * 席别：二等座、一等座、商务座、无座（对齐开题票型表）
 * fromStation / toStation 与城市选择器中的名称一致
 */
const KEY_DELETED = 'rail_mock_deleted_train_ids'
const KEY_CUSTOM = 'rail_mock_custom_trains'

function readLs(key, fb) {
  try {
    const r = localStorage.getItem(key)
    return r ? JSON.parse(r) : fb
  } catch {
    return fb
  }
}

export function seats(secondPrice, firstPrice, businessPrice, s, f, b, noneRemain) {
  const n =
    noneRemain !== undefined
      ? noneRemain
      : Math.min(350, Math.max(15, s + f + b + 25))
  return [
    { seatType: 'second', seatName: '二等座', price: secondPrice, remainCount: s },
    { seatType: 'first', seatName: '一等座', price: firstPrice, remainCount: f },
    { seatType: 'business', seatName: '商务座', price: businessPrice, remainCount: b },
    {
      seatType: 'none',
      seatName: '无座',
      price: Math.round(secondPrice * 0.52),
      remainCount: n
    }
  ]
}

export const MOCK_TRAIN_SCHEDULE = [
  // 合肥 — 北京
  { trainId: 'G-HF-BJ-01', trainNo: 'G30', fromStation: '合肥', toStation: '北京', departTime: '07:15', arriveTime: '11:28', duration: '4小时13分', seatTypes: seats(553, 884, 1650, 86, 12, 4) },
  { trainId: 'G-HF-BJ-02', trainNo: 'G262', fromStation: '合肥', toStation: '北京', departTime: '09:40', arriveTime: '14:05', duration: '4小时25分', seatTypes: seats(553, 884, 1650, 3, 0, 2) },
  { trainId: 'G-HF-BJ-03', trainNo: 'G324', fromStation: '合肥', toStation: '北京', departTime: '13:22', arriveTime: '17:50', duration: '4小时28分', seatTypes: seats(553, 884, 1650, 45, 8, 0) },
  { trainId: 'G-HF-BJ-04', trainNo: 'G302', fromStation: '合肥', toStation: '北京', departTime: '16:05', arriveTime: '20:18', duration: '4小时13分', seatTypes: seats(553, 884, 1650, 120, 20, 6) },

  // 北京 — 上海
  { trainId: 'G-BJ-SH-01', trainNo: 'G1', fromStation: '北京', toStation: '上海', departTime: '06:00', arriveTime: '11:28', duration: '5小时28分', seatTypes: seats(553, 933, 1748, 156, 8, 2) },
  { trainId: 'G-BJ-SH-02', trainNo: 'G3', fromStation: '北京', toStation: '上海', departTime: '07:00', arriveTime: '12:37', duration: '5小时37分', seatTypes: seats(553, 933, 1748, 0, 4, 0) },
  { trainId: 'G-BJ-SH-03', trainNo: 'G5', fromStation: '北京', toStation: '上海', departTime: '09:00', arriveTime: '14:37', duration: '5小时37分', seatTypes: seats(553, 933, 1748, 88, 15, 3) },
  { trainId: 'G-BJ-SH-04', trainNo: 'G7', fromStation: '北京', toStation: '上海', departTime: '11:00', arriveTime: '16:37', duration: '5小时37分', seatTypes: seats(553, 933, 1748, 200, 40, 8) },

  // 上海 — 北京
  { trainId: 'G-SH-BJ-01', trainNo: 'G2', fromStation: '上海', toStation: '北京', departTime: '06:27', arriveTime: '11:36', duration: '5小时9分', seatTypes: seats(553, 933, 1748, 72, 10, 1) },
  { trainId: 'G-SH-BJ-02', trainNo: 'G4', fromStation: '上海', toStation: '北京', departTime: '08:05', arriveTime: '13:32', duration: '5小时27分', seatTypes: seats(553, 933, 1748, 55, 6, 0) },
  { trainId: 'G-SH-BJ-03', trainNo: 'G6', fromStation: '上海', toStation: '北京', departTime: '10:00', arriveTime: '15:37', duration: '5小时37分', seatTypes: seats(553, 933, 1748, 130, 22, 5) },

  // 杭州 — 南京
  { trainId: 'G-HZ-NJ-01', trainNo: 'G7626', fromStation: '杭州', toStation: '南京', departTime: '07:22', arriveTime: '09:01', duration: '1小时39分', seatTypes: seats(117, 187, 352, 99, 24, 8) },
  { trainId: 'G-HZ-NJ-02', trainNo: 'G1506', fromStation: '杭州', toStation: '南京', departTime: '10:15', arriveTime: '11:48', duration: '1小时33分', seatTypes: seats(117, 187, 352, 0, 10, 2) },
  { trainId: 'G-HZ-NJ-03', trainNo: 'D2282', fromStation: '杭州', toStation: '南京', departTime: '14:40', arriveTime: '16:28', duration: '1小时48分', seatTypes: seats(95, 152, 285, 160, 30, 6) },

  // 南京 — 杭州
  { trainId: 'G-NJ-HZ-01', trainNo: 'G7625', fromStation: '南京', toStation: '杭州', departTime: '08:05', arriveTime: '09:44', duration: '1小时39分', seatTypes: seats(117, 187, 352, 210, 35, 6) },
  { trainId: 'G-NJ-HZ-02', trainNo: 'G1505', fromStation: '南京', toStation: '杭州', departTime: '11:20', arriveTime: '12:53', duration: '1小时33分', seatTypes: seats(117, 187, 352, 45, 8, 0) },

  // 广州 — 深圳
  { trainId: 'G-GZ-SZ-01', trainNo: 'G6201', fromStation: '广州', toStation: '深圳', departTime: '06:15', arriveTime: '06:54', duration: '39分', seatTypes: seats(74, 99, 199, 300, 60, 12) },
  { trainId: 'G-GZ-SZ-02', trainNo: 'G6203', fromStation: '广州', toStation: '深圳', departTime: '07:30', arriveTime: '08:09', duration: '39分', seatTypes: seats(74, 99, 199, 180, 40, 5) },
  { trainId: 'G-GZ-SZ-03', trainNo: 'D7591', fromStation: '广州', toStation: '深圳', departTime: '09:10', arriveTime: '09:58', duration: '48分', seatTypes: seats(65, 104, 195, 120, 15, 4) },

  // 深圳 — 广州
  { trainId: 'G-SZ-GZ-01', trainNo: 'G6202', fromStation: '深圳', toStation: '广州', departTime: '07:00', arriveTime: '07:39', duration: '39分', seatTypes: seats(74, 99, 199, 160, 28, 4) },
  { trainId: 'G-SZ-GZ-02', trainNo: 'G6204', fromStation: '深圳', toStation: '广州', departTime: '08:20', arriveTime: '08:59', duration: '39分', seatTypes: seats(74, 99, 199, 220, 50, 10) },

  // 成都 — 重庆
  { trainId: 'G-CD-CQ-01', trainNo: 'G8501', fromStation: '成都', toStation: '重庆', departTime: '07:00', arriveTime: '08:50', duration: '1小时50分', seatTypes: seats(146, 234, 438, 88, 18, 3) },
  { trainId: 'G-CD-CQ-02', trainNo: 'D5102', fromStation: '成都', toStation: '重庆', departTime: '09:12', arriveTime: '11:05', duration: '1小时53分', seatTypes: seats(96, 154, 288, 120, 40, 8) },
  { trainId: 'G-CD-CQ-03', trainNo: 'G8503', fromStation: '成都', toStation: '重庆', departTime: '12:30', arriveTime: '14:20', duration: '1小时50分', seatTypes: seats(146, 234, 438, 55, 0, 1) },

  // 重庆 — 成都
  { trainId: 'G-CQ-CD-01', trainNo: 'G8502', fromStation: '重庆', toStation: '成都', departTime: '08:10', arriveTime: '10:00', duration: '1小时50分', seatTypes: seats(146, 234, 438, 100, 25, 4) },
  { trainId: 'G-CQ-CD-02', trainNo: 'D5101', fromStation: '重庆', toStation: '成都', departTime: '15:00', arriveTime: '16:53', duration: '1小时53分', seatTypes: seats(96, 154, 288, 200, 55, 10) },

  // 西安 — 郑州
  { trainId: 'G-XA-ZZ-01', trainNo: 'G2000', fromStation: '西安', toStation: '郑州', departTime: '08:30', arriveTime: '10:45', duration: '2小时15分', seatTypes: seats(229, 367, 689, 45, 10, 2) },
  { trainId: 'G-XA-ZZ-02', trainNo: 'G1910', fromStation: '西安', toStation: '郑州', departTime: '11:05', arriveTime: '13:20', duration: '2小时15分', seatTypes: seats(229, 367, 689, 130, 20, 0) },

  // 郑州 — 西安
  { trainId: 'G-ZZ-XA-01', trainNo: 'G2001', fromStation: '郑州', toStation: '西安', departTime: '09:00', arriveTime: '11:15', duration: '2小时15分', seatTypes: seats(229, 367, 689, 88, 15, 3) },

  // 武汉 — 长沙
  { trainId: 'G-WH-CS-01', trainNo: 'G1001', fromStation: '武汉', toStation: '长沙', departTime: '07:45', arriveTime: '09:12', duration: '1小时27分', seatTypes: seats(164, 262, 490, 77, 14, 2) },
  { trainId: 'G-WH-CS-02', trainNo: 'G541', fromStation: '武汉', toStation: '长沙', departTime: '12:20', arriveTime: '13:47', duration: '1小时27分', seatTypes: seats(164, 262, 490, 0, 6, 0) },

  // 长沙 — 武汉
  { trainId: 'G-CS-WH-01', trainNo: 'G1002', fromStation: '长沙', toStation: '武汉', departTime: '08:30', arriveTime: '09:57', duration: '1小时27分', seatTypes: seats(164, 262, 490, 95, 18, 4) },

  // 济南 — 北京
  { trainId: 'G-JN-BJ-01', trainNo: 'G34', fromStation: '济南', toStation: '北京', departTime: '07:50', arriveTime: '09:32', duration: '1小时42分', seatTypes: seats(214, 343, 640, 55, 12, 1) },
  { trainId: 'G-JN-BJ-02', trainNo: 'G36', fromStation: '济南', toStation: '北京', departTime: '10:10', arriveTime: '11:52', duration: '1小时42分', seatTypes: seats(214, 343, 640, 6, 0, 0) },

  // 北京 — 济南
  { trainId: 'G-BJ-JN-01', trainNo: 'G33', fromStation: '北京', toStation: '济南', departTime: '08:20', arriveTime: '10:02', duration: '1小时42分', seatTypes: seats(214, 343, 640, 90, 20, 5) },

  // 青岛 — 济南
  { trainId: 'G-QD-JN-01', trainNo: 'G6902', fromStation: '青岛', toStation: '济南', departTime: '06:30', arriveTime: '08:45', duration: '2小时15分', seatTypes: seats(116, 186, 348, 200, 45, 8) },
  { trainId: 'G-QD-JN-02', trainNo: 'D6004', fromStation: '青岛', toStation: '济南', departTime: '14:20', arriveTime: '16:50', duration: '2小时30分', seatTypes: seats(96, 154, 288, 88, 22, 5) },

  // 济南 — 青岛
  { trainId: 'G-JN-QD-01', trainNo: 'G6901', fromStation: '济南', toStation: '青岛', departTime: '07:10', arriveTime: '09:25', duration: '2小时15分', seatTypes: seats(116, 186, 348, 150, 30, 4) },

  // 沈阳 — 大连
  { trainId: 'G-SY-DL-01', trainNo: 'G8042', fromStation: '沈阳', toStation: '大连', departTime: '08:00', arriveTime: '09:58', duration: '1小时58分', seatTypes: seats(173, 277, 518, 42, 8, 0) },
  { trainId: 'G-SY-DL-02', trainNo: 'G8066', fromStation: '沈阳', toStation: '大连', departTime: '14:30', arriveTime: '16:28', duration: '1小时58分', seatTypes: seats(173, 277, 518, 110, 25, 6) },

  // 大连 — 沈阳
  { trainId: 'G-DL-SY-01', trainNo: 'G8041', fromStation: '大连', toStation: '沈阳', departTime: '09:10', arriveTime: '11:08', duration: '1小时58分', seatTypes: seats(173, 277, 518, 75, 12, 2) },

  // 厦门 — 福州
  { trainId: 'G-XM-FZ-01', trainNo: 'G5302', fromStation: '厦门', toStation: '福州', departTime: '07:20', arriveTime: '09:05', duration: '1小时45分', seatTypes: seats(84, 134, 251, 95, 20, 3) },
  { trainId: 'G-XM-FZ-02', trainNo: 'D6208', fromStation: '厦门', toStation: '福州', departTime: '12:00', arriveTime: '13:52', duration: '1小时52分', seatTypes: seats(72, 115, 216, 60, 18, 3) },

  // 福州 — 厦门
  { trainId: 'G-FZ-XM-01', trainNo: 'G5301', fromStation: '福州', toStation: '厦门', departTime: '08:10', arriveTime: '09:55', duration: '1小时45分', seatTypes: seats(84, 134, 251, 60, 10, 1) },

  // 天津 — 北京
  { trainId: 'G-TJ-BJ-01', trainNo: 'C2002', fromStation: '天津', toStation: '北京', departTime: '06:05', arriveTime: '06:38', duration: '33分', seatTypes: seats(54, 86, 162, 500, 80, 20) },
  { trainId: 'G-TJ-BJ-02', trainNo: 'C2004', fromStation: '天津', toStation: '北京', departTime: '07:15', arriveTime: '07:48', duration: '33分', seatTypes: seats(54, 86, 162, 420, 65, 15) },

  // 北京 — 天津
  { trainId: 'G-BJ-TJ-01', trainNo: 'C2001', fromStation: '北京', toStation: '天津', departTime: '06:20', arriveTime: '06:53', duration: '33分', seatTypes: seats(54, 86, 162, 400, 70, 18) },

  // 南京 — 上海
  { trainId: 'G-NJ-SH-01', trainNo: 'G7001', fromStation: '南京', toStation: '上海', departTime: '06:00', arriveTime: '07:39', duration: '1小时39分', seatTypes: seats(139, 223, 417, 180, 35, 7) },
  { trainId: 'G-NJ-SH-02', trainNo: 'G7011', fromStation: '南京', toStation: '上海', departTime: '10:30', arriveTime: '12:09', duration: '1小时39分', seatTypes: seats(139, 223, 417, 0, 8, 0) },

  // 上海 — 南京
  { trainId: 'G-SH-NJ-01', trainNo: 'G7002', fromStation: '上海', toStation: '南京', departTime: '07:00', arriveTime: '08:39', duration: '1小时39分', seatTypes: seats(139, 223, 417, 220, 42, 9) }
]

/** 合并内置车次、管理端新增车次，并排除已删除 */
export function getMergedSchedule() {
  const deleted = new Set(readLs(KEY_DELETED, []))
  const custom = readLs(KEY_CUSTOM, [])
  const base = MOCK_TRAIN_SCHEDULE.filter((row) => !deleted.has(row.trainId))
  return [...base, ...custom]
}

export function filterMockTrains({ from, to, highSpeedOnly }) {
  const f = (from || '').trim()
  const t = (to || '').trim()
  let list = getMergedSchedule().filter((row) => row.fromStation === f && row.toStation === t)
  const onlyHighSpeed = highSpeedOnly === true || highSpeedOnly === 'true' || highSpeedOnly === '1'
  if (onlyHighSpeed) {
    list = list.filter((row) => /^[GDC]\d*/.test(row.trainNo))
  }
  return list.sort((a, b) => a.departTime.localeCompare(b.departTime))
}

export function getDeletedTrainIds() {
  return readLs(KEY_DELETED, [])
}

export function deleteTrainById(trainId) {
  const d = [...getDeletedTrainIds()]
  if (!d.includes(trainId)) d.push(trainId)
  localStorage.setItem(KEY_DELETED, JSON.stringify(d))
}

export function getCustomTrains() {
  return readLs(KEY_CUSTOM, [])
}

export function addCustomTrain(row) {
  const c = getCustomTrains()
  c.push(row)
  localStorage.setItem(KEY_CUSTOM, JSON.stringify(c))
}

export function removeCustomTrain(trainId) {
  const c = getCustomTrains().filter((t) => t.trainId !== trainId)
  localStorage.setItem(KEY_CUSTOM, JSON.stringify(c))
}
