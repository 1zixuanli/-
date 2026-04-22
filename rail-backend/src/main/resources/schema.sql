-- 首次启动自动建表（与开题：用户 / 车次 / 票型余票 / 订单 对齐）
CREATE TABLE IF NOT EXISTS sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  id_card VARCHAR(32) NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rail_train (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  train_id VARCHAR(64) NOT NULL UNIQUE,
  train_no VARCHAR(32) NOT NULL,
  from_station VARCHAR(64) NOT NULL,
  to_station VARCHAR(64) NOT NULL,
  depart_time VARCHAR(16) NOT NULL,
  arrive_time VARCHAR(16) NOT NULL,
  duration VARCHAR(64) NOT NULL,
  is_deleted TINYINT NOT NULL DEFAULT 0,
  INDEX idx_from_to (from_station, to_station)
);

CREATE TABLE IF NOT EXISTS rail_train_seat (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  train_id VARCHAR(64) NOT NULL,
  seat_type VARCHAR(32) NOT NULL,
  seat_name VARCHAR(32) NOT NULL,
  price INT NOT NULL,
  base_remain INT NOT NULL,
  UNIQUE KEY uk_train_seat (train_id, seat_type),
  INDEX idx_train (train_id)
);

CREATE TABLE IF NOT EXISTS rail_stock_adjust (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  train_id VARCHAR(64) NOT NULL,
  seat_type VARCHAR(32) NOT NULL,
  delta_sum INT NOT NULL DEFAULT 0,
  UNIQUE KEY uk_adj (train_id, seat_type)
);

CREATE TABLE IF NOT EXISTS rail_order (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL,
  username VARCHAR(64) NOT NULL,
  train_id VARCHAR(64) NOT NULL,
  train_no VARCHAR(32) NOT NULL,
  from_station VARCHAR(64) NOT NULL,
  to_station VARCHAR(64) NOT NULL,
  travel_date DATE NOT NULL,
  depart_time VARCHAR(16) NOT NULL,
  arrive_time VARCHAR(16) NOT NULL,
  duration VARCHAR(64) NOT NULL,
  seat_type VARCHAR(32) NOT NULL,
  seat_name VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  price INT NOT NULL,
  passenger_name VARCHAR(64) NOT NULL,
  id_card VARCHAR(32) NOT NULL DEFAULT '',
  ticket_type VARCHAR(32) NOT NULL DEFAULT 'normal',
  status VARCHAR(32) NOT NULL,
  pay_deadline DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  paid_at DATETIME NULL,
  refunded_at DATETIME NULL,
  INDEX idx_user (user_id),
  INDEX idx_train_date (train_id, seat_type, travel_date, status)
);
