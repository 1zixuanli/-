/**
 * 生成 rail_ticket 全量建表 + 用户 + 车次 + 演示订单 SQL
 * 运行: node scripts/gen-mysql-init.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const jsonPath = join(root, 'rail-backend', 'src', 'main', 'resources', 'trains-seed.json')
const outPath = join(root, 'rail-backend', 'scripts', 'init_rail_ticket.sql')

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "''")
}

const trains = JSON.parse(readFileSync(jsonPath, 'utf8'))
const adminHash = bcrypt.hashSync('admin123', 10)
const demoHash = bcrypt.hashSync('demo123', 10)

const lines = []
lines.push('-- rail_ticket demo (fictional data for graduation project, not from 12306/OTA)')
lines.push('SET NAMES utf8mb4;')
lines.push('SET FOREIGN_KEY_CHECKS = 0;')
lines.push('CREATE DATABASE IF NOT EXISTS rail_ticket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;')
lines.push('USE rail_ticket;')
lines.push('')
lines.push('DROP TABLE IF EXISTS rail_order;')
lines.push('DROP TABLE IF EXISTS rail_stock_adjust;')
lines.push('DROP TABLE IF EXISTS rail_train_seat;')
lines.push('DROP TABLE IF EXISTS rail_train;')
lines.push('DROP TABLE IF EXISTS sys_user;')
lines.push('')

const schema = readFileSync(join(root, 'rail-backend', 'src', 'main', 'resources', 'schema.sql'), 'utf8')
// 去掉以 -- 开头的行，避免与 CREATE 同一段时被整块跳过
const schemaBody = schema
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n')
for (const block of schemaBody.split(';')) {
  const t = block.trim()
  if (!t) continue
  lines.push(t + ';')
  lines.push('')
}

lines.push('-- 管理员 + 演示用户（密码与 README 一致）')
lines.push(`INSERT INTO sys_user (username, password, phone, id_card, role) VALUES`)
lines.push(`('admin', '${esc(adminHash)}', '13800138000', '', 'admin'),`)
lines.push(`('demo', '${esc(demoHash)}', '13912345678', '320102199001******', 'user');`)
lines.push('')

lines.push('-- 车次 + 席别（约 50 条线路）')
for (const tr of trains) {
  lines.push(
    `INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ` +
      `('${esc(tr.trainId)}', '${esc(tr.trainNo)}', '${esc(tr.fromStation)}', '${esc(tr.toStation)}', '${esc(tr.departTime)}', '${esc(tr.arriveTime)}', '${esc(tr.duration)}', 0);`
  )
  for (const s of tr.seatTypes) {
    lines.push(
      `INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ` +
        `('${esc(tr.trainId)}', '${esc(s.seatType)}', '${esc(s.seatName)}', ${Number(s.price)}, ${Number(s.remainCount)});`
    )
  }
  lines.push('')
}

lines.push('-- 演示订单（姓名/证件为虚构模糊样式）')
const td = '2026-04-20'
lines.push(`INSERT INTO rail_order (order_id, user_id, username, train_id, train_no, from_station, to_station, travel_date, depart_time, arrive_time, duration, seat_type, seat_name, quantity, unit_price, price, passenger_name, id_card, ticket_type, status, pay_deadline, created_at, paid_at, refunded_at) VALUES`)
lines.push(
  `('ORD-DEMO-PAID-001', 2, 'demo', 'G-BJ-SH-01', 'G1', '北京', '上海', '${td}', '06:00', '11:28', '5小时28分', 'second', '二等座', 2, 553, 1106, '张*国', '1101011992******12', 'normal', 'paid', DATE_ADD(NOW(), INTERVAL 25 MINUTE), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), NULL),`
)
lines.push(
  `('ORD-DEMO-UNPAID-02', 2, 'demo', 'G-HZ-NJ-01', 'G7626', '杭州', '南京', '${td}', '07:22', '09:01', '1小时39分', 'first', '一等座', 1, 187, 187, '李*娜', '', 'student', 'unpaid', DATE_ADD(NOW(), INTERVAL 28 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL),`
)
lines.push(
  `('ORD-DEMO-CANCEL-03', 2, 'demo', 'G-CD-CQ-01', 'G8501', '成都', '重庆', '${td}', '07:00', '08:50', '1小时50分', 'second', '二等座', 1, 146, 146, '王*', '510***********0034', 'normal', 'cancelled', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 3 HOUR), NULL, NULL),`
)
lines.push(
  `('ORD-ADMIN-PAID-04', 1, 'admin', 'G-GZ-SZ-01', 'G6201', '广州', '深圳', '${td}', '06:15', '06:54', '39分', 'second', '二等座', 3, 74, 222, '陈*海', '440***********6611', 'group', 'paid', DATE_ADD(NOW(), INTERVAL 20 MINUTE), DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL);`
)
lines.push('')
lines.push('-- 一条库存调整演示（北京-上海二等 +5）')
lines.push(`INSERT INTO rail_stock_adjust (train_id, seat_type, delta_sum) VALUES ('G-BJ-SH-01', 'second', 5) ON DUPLICATE KEY UPDATE delta_sum = delta_sum + 5;`)
lines.push('')
lines.push('SET FOREIGN_KEY_CHECKS = 1;')

writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log('Wrote', outPath)
