/**
 * 用 Node 直连 MySQL 导入 init_rail_ticket.sql（不依赖 mysql.exe 在 PATH 里）
 * 用法：在 src 目录执行  npm run import:db
 */
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mysql from 'mysql2/promise'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const sqlPath = join(root, 'rail-backend', 'scripts', 'init_rail_ticket.sql')
const pwPath = join(root, 'mysql-password.txt')
const portPath = join(root, 'mysql-port.txt')

function readPort() {
  const env = process.env.MYSQL_PORT
  if (env && String(env).trim()) return parseInt(String(env).trim(), 10)
  if (existsSync(portPath)) {
    const line = readFileSync(portPath, 'utf8').trim().split(/\r?\n/)[0].trim()
    if (line) return parseInt(line, 10)
  }
  return 3306
}

function readPassword() {
  const env = process.env.MYSQL_ROOT_PASSWORD
  if (env) return env.trim()
  if (!existsSync(pwPath)) {
    console.error('Missing mysql-password.txt or MYSQL_ROOT_PASSWORD')
    process.exit(1)
  }
  return readFileSync(pwPath, 'utf8').trim().split(/\r?\n/)[0].trim()
}

const password = readPassword()
const port = readPort()
const sql = readFileSync(sqlPath, 'utf8')

let conn
try {
  conn = await mysql.createConnection({
    host: '127.0.0.1',
    port,
    user: 'root',
    password,
    multipleStatements: true
  })
  await conn.query(sql)
  console.log(`OK: database rail_ticket imported (127.0.0.1:${port}).`)
} catch (e) {
  if (e.code === 'ER_ACCESS_DENIED_ERROR' || e.errno === 1045) {
    console.error('Login failed (1045). Check: 1) MySQL is running 2) password in mysql-password.txt matches root 3) run on the PC where MySQL is installed.')
  } else {
    console.error('Import failed:', e.message)
  }
  process.exit(1)
} finally {
  if (conn) await conn.end().catch(() => {})
}
