-- rail_ticket demo (fictional data for graduation project, not from 12306/OTA)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS rail_ticket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rail_ticket;

DROP TABLE IF EXISTS rail_order;
DROP TABLE IF EXISTS rail_stock_adjust;
DROP TABLE IF EXISTS rail_train_seat;
DROP TABLE IF EXISTS rail_train;
DROP TABLE IF EXISTS sys_user;

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

-- 管理员 + 演示用户（密码与 README 一致）
INSERT INTO sys_user (username, password, phone, id_card, role) VALUES
('admin', '$2b$10$vVKmMI4Px6hvrGi.ThoOTOIDgXeax8oXpu8vf2MchIkuERNelJuta', '13800138000', '', 'admin'),
('demo', '$2b$10$/l8eij2r9fcfidheB9D0WOS2HK.hba0.AitjnLCY2ZfNm7IcI6AcK', '13912345678', '320102199001******', 'user');

-- 车次 + 席别（约 50 条线路）
INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HF-BJ-01', 'G30', '合肥', '北京', '07:15', '11:28', '4小时13分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-01', 'second', '二等座', 553, 86);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-01', 'first', '一等座', 884, 12);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-01', 'business', '商务座', 1650, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-01', 'none', '无座', 288, 127);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HF-BJ-02', 'G262', '合肥', '北京', '09:40', '14:05', '4小时25分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-02', 'second', '二等座', 553, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-02', 'first', '一等座', 884, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-02', 'business', '商务座', 1650, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-02', 'none', '无座', 288, 30);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HF-BJ-03', 'G324', '合肥', '北京', '13:22', '17:50', '4小时28分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-03', 'second', '二等座', 553, 45);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-03', 'first', '一等座', 884, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-03', 'business', '商务座', 1650, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-03', 'none', '无座', 288, 78);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HF-BJ-04', 'G302', '合肥', '北京', '16:05', '20:18', '4小时13分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-04', 'second', '二等座', 553, 120);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-04', 'first', '一等座', 884, 20);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-04', 'business', '商务座', 1650, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HF-BJ-04', 'none', '无座', 288, 171);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-SH-01', 'G1', '北京', '上海', '06:00', '11:28', '5小时28分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-01', 'second', '二等座', 553, 156);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-01', 'first', '一等座', 933, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-01', 'business', '商务座', 1748, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-01', 'none', '无座', 288, 191);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-SH-02', 'G3', '北京', '上海', '07:00', '12:37', '5小时37分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-02', 'second', '二等座', 553, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-02', 'first', '一等座', 933, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-02', 'business', '商务座', 1748, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-02', 'none', '无座', 288, 29);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-SH-03', 'G5', '北京', '上海', '09:00', '14:37', '5小时37分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-03', 'second', '二等座', 553, 88);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-03', 'first', '一等座', 933, 15);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-03', 'business', '商务座', 1748, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-03', 'none', '无座', 288, 131);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-SH-04', 'G7', '北京', '上海', '11:00', '16:37', '5小时37分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-04', 'second', '二等座', 553, 200);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-04', 'first', '一等座', 933, 40);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-04', 'business', '商务座', 1748, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-SH-04', 'none', '无座', 288, 273);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SH-BJ-01', 'G2', '上海', '北京', '06:27', '11:36', '5小时9分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-01', 'second', '二等座', 553, 72);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-01', 'first', '一等座', 933, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-01', 'business', '商务座', 1748, 1);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-01', 'none', '无座', 288, 108);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SH-BJ-02', 'G4', '上海', '北京', '08:05', '13:32', '5小时27分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-02', 'second', '二等座', 553, 55);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-02', 'first', '一等座', 933, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-02', 'business', '商务座', 1748, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-02', 'none', '无座', 288, 86);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SH-BJ-03', 'G6', '上海', '北京', '10:00', '15:37', '5小时37分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-03', 'second', '二等座', 553, 130);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-03', 'first', '一等座', 933, 22);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-03', 'business', '商务座', 1748, 5);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-BJ-03', 'none', '无座', 288, 182);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HZ-NJ-01', 'G7626', '杭州', '南京', '07:22', '09:01', '1小时39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-01', 'second', '二等座', 117, 99);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-01', 'first', '一等座', 187, 24);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-01', 'business', '商务座', 352, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-01', 'none', '无座', 61, 156);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HZ-NJ-02', 'G1506', '杭州', '南京', '10:15', '11:48', '1小时33分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-02', 'second', '二等座', 117, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-02', 'first', '一等座', 187, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-02', 'business', '商务座', 352, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-02', 'none', '无座', 61, 37);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-HZ-NJ-03', 'D2282', '杭州', '南京', '14:40', '16:28', '1小时48分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-03', 'second', '二等座', 95, 160);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-03', 'first', '一等座', 152, 30);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-03', 'business', '商务座', 285, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-HZ-NJ-03', 'none', '无座', 49, 221);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-NJ-HZ-01', 'G7625', '南京', '杭州', '08:05', '09:44', '1小时39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-01', 'second', '二等座', 117, 210);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-01', 'first', '一等座', 187, 35);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-01', 'business', '商务座', 352, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-01', 'none', '无座', 61, 276);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-NJ-HZ-02', 'G1505', '南京', '杭州', '11:20', '12:53', '1小时33分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-02', 'second', '二等座', 117, 45);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-02', 'first', '一等座', 187, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-02', 'business', '商务座', 352, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-HZ-02', 'none', '无座', 61, 78);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-GZ-SZ-01', 'G6201', '广州', '深圳', '06:15', '06:54', '39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-01', 'second', '二等座', 74, 300);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-01', 'first', '一等座', 99, 60);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-01', 'business', '商务座', 199, 12);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-01', 'none', '无座', 38, 350);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-GZ-SZ-02', 'G6203', '广州', '深圳', '07:30', '08:09', '39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-02', 'second', '二等座', 74, 180);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-02', 'first', '一等座', 99, 40);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-02', 'business', '商务座', 199, 5);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-02', 'none', '无座', 38, 250);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-GZ-SZ-03', 'D7591', '广州', '深圳', '09:10', '09:58', '48分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-03', 'second', '二等座', 65, 120);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-03', 'first', '一等座', 104, 15);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-03', 'business', '商务座', 195, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-GZ-SZ-03', 'none', '无座', 34, 164);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SZ-GZ-01', 'G6202', '深圳', '广州', '07:00', '07:39', '39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-01', 'second', '二等座', 74, 160);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-01', 'first', '一等座', 99, 28);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-01', 'business', '商务座', 199, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-01', 'none', '无座', 38, 217);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SZ-GZ-02', 'G6204', '深圳', '广州', '08:20', '08:59', '39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-02', 'second', '二等座', 74, 220);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-02', 'first', '一等座', 99, 50);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-02', 'business', '商务座', 199, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SZ-GZ-02', 'none', '无座', 38, 305);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CD-CQ-01', 'G8501', '成都', '重庆', '07:00', '08:50', '1小时50分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-01', 'second', '二等座', 146, 88);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-01', 'first', '一等座', 234, 18);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-01', 'business', '商务座', 438, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-01', 'none', '无座', 76, 134);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CD-CQ-02', 'D5102', '成都', '重庆', '09:12', '11:05', '1小时53分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-02', 'second', '二等座', 96, 120);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-02', 'first', '一等座', 154, 40);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-02', 'business', '商务座', 288, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-02', 'none', '无座', 50, 193);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CD-CQ-03', 'G8503', '成都', '重庆', '12:30', '14:20', '1小时50分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-03', 'second', '二等座', 146, 55);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-03', 'first', '一等座', 234, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-03', 'business', '商务座', 438, 1);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CD-CQ-03', 'none', '无座', 76, 81);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CQ-CD-01', 'G8502', '重庆', '成都', '08:10', '10:00', '1小时50分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-01', 'second', '二等座', 146, 100);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-01', 'first', '一等座', 234, 25);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-01', 'business', '商务座', 438, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-01', 'none', '无座', 76, 154);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CQ-CD-02', 'D5101', '重庆', '成都', '15:00', '16:53', '1小时53分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-02', 'second', '二等座', 96, 200);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-02', 'first', '一等座', 154, 55);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-02', 'business', '商务座', 288, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CQ-CD-02', 'none', '无座', 50, 290);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-XA-ZZ-01', 'G2000', '西安', '郑州', '08:30', '10:45', '2小时15分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-01', 'second', '二等座', 229, 45);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-01', 'first', '一等座', 367, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-01', 'business', '商务座', 689, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-01', 'none', '无座', 119, 82);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-XA-ZZ-02', 'G1910', '西安', '郑州', '11:05', '13:20', '2小时15分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-02', 'second', '二等座', 229, 130);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-02', 'first', '一等座', 367, 20);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-02', 'business', '商务座', 689, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XA-ZZ-02', 'none', '无座', 119, 175);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-ZZ-XA-01', 'G2001', '郑州', '西安', '09:00', '11:15', '2小时15分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-ZZ-XA-01', 'second', '二等座', 229, 88);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-ZZ-XA-01', 'first', '一等座', 367, 15);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-ZZ-XA-01', 'business', '商务座', 689, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-ZZ-XA-01', 'none', '无座', 119, 131);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-WH-CS-01', 'G1001', '武汉', '长沙', '07:45', '09:12', '1小时27分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-01', 'second', '二等座', 164, 77);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-01', 'first', '一等座', 262, 14);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-01', 'business', '商务座', 490, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-01', 'none', '无座', 85, 118);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-WH-CS-02', 'G541', '武汉', '长沙', '12:20', '13:47', '1小时27分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-02', 'second', '二等座', 164, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-02', 'first', '一等座', 262, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-02', 'business', '商务座', 490, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-WH-CS-02', 'none', '无座', 85, 31);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-CS-WH-01', 'G1002', '长沙', '武汉', '08:30', '09:57', '1小时27分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CS-WH-01', 'second', '二等座', 164, 95);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CS-WH-01', 'first', '一等座', 262, 18);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CS-WH-01', 'business', '商务座', 490, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-CS-WH-01', 'none', '无座', 85, 142);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-JN-BJ-01', 'G34', '济南', '北京', '07:50', '09:32', '1小时42分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-01', 'second', '二等座', 214, 55);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-01', 'first', '一等座', 343, 12);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-01', 'business', '商务座', 640, 1);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-01', 'none', '无座', 111, 93);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-JN-BJ-02', 'G36', '济南', '北京', '10:10', '11:52', '1小时42分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-02', 'second', '二等座', 214, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-02', 'first', '一等座', 343, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-02', 'business', '商务座', 640, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-BJ-02', 'none', '无座', 111, 31);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-JN-01', 'G33', '北京', '济南', '08:20', '10:02', '1小时42分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-JN-01', 'second', '二等座', 214, 90);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-JN-01', 'first', '一等座', 343, 20);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-JN-01', 'business', '商务座', 640, 5);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-JN-01', 'none', '无座', 111, 140);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-QD-JN-01', 'G6902', '青岛', '济南', '06:30', '08:45', '2小时15分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-01', 'second', '二等座', 116, 200);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-01', 'first', '一等座', 186, 45);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-01', 'business', '商务座', 348, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-01', 'none', '无座', 60, 278);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-QD-JN-02', 'D6004', '青岛', '济南', '14:20', '16:50', '2小时30分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-02', 'second', '二等座', 96, 88);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-02', 'first', '一等座', 154, 22);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-02', 'business', '商务座', 288, 5);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-QD-JN-02', 'none', '无座', 50, 140);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-JN-QD-01', 'G6901', '济南', '青岛', '07:10', '09:25', '2小时15分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-QD-01', 'second', '二等座', 116, 150);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-QD-01', 'first', '一等座', 186, 30);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-QD-01', 'business', '商务座', 348, 4);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-JN-QD-01', 'none', '无座', 60, 209);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SY-DL-01', 'G8042', '沈阳', '大连', '08:00', '09:58', '1小时58分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-01', 'second', '二等座', 173, 42);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-01', 'first', '一等座', 277, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-01', 'business', '商务座', 518, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-01', 'none', '无座', 90, 75);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SY-DL-02', 'G8066', '沈阳', '大连', '14:30', '16:28', '1小时58分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-02', 'second', '二等座', 173, 110);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-02', 'first', '一等座', 277, 25);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-02', 'business', '商务座', 518, 6);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SY-DL-02', 'none', '无座', 90, 166);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-DL-SY-01', 'G8041', '大连', '沈阳', '09:10', '11:08', '1小时58分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-DL-SY-01', 'second', '二等座', 173, 75);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-DL-SY-01', 'first', '一等座', 277, 12);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-DL-SY-01', 'business', '商务座', 518, 2);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-DL-SY-01', 'none', '无座', 90, 114);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-XM-FZ-01', 'G5302', '厦门', '福州', '07:20', '09:05', '1小时45分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-01', 'second', '二等座', 84, 95);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-01', 'first', '一等座', 134, 20);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-01', 'business', '商务座', 251, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-01', 'none', '无座', 44, 143);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-XM-FZ-02', 'D6208', '厦门', '福州', '12:00', '13:52', '1小时52分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-02', 'second', '二等座', 72, 60);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-02', 'first', '一等座', 115, 18);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-02', 'business', '商务座', 216, 3);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-XM-FZ-02', 'none', '无座', 37, 106);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-FZ-XM-01', 'G5301', '福州', '厦门', '08:10', '09:55', '1小时45分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-FZ-XM-01', 'second', '二等座', 84, 60);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-FZ-XM-01', 'first', '一等座', 134, 10);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-FZ-XM-01', 'business', '商务座', 251, 1);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-FZ-XM-01', 'none', '无座', 44, 96);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-TJ-BJ-01', 'C2002', '天津', '北京', '06:05', '06:38', '33分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-01', 'second', '二等座', 54, 500);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-01', 'first', '一等座', 86, 80);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-01', 'business', '商务座', 162, 20);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-01', 'none', '无座', 28, 350);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-TJ-BJ-02', 'C2004', '天津', '北京', '07:15', '07:48', '33分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-02', 'second', '二等座', 54, 420);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-02', 'first', '一等座', 86, 65);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-02', 'business', '商务座', 162, 15);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-TJ-BJ-02', 'none', '无座', 28, 350);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-BJ-TJ-01', 'C2001', '北京', '天津', '06:20', '06:53', '33分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-TJ-01', 'second', '二等座', 54, 400);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-TJ-01', 'first', '一等座', 86, 70);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-TJ-01', 'business', '商务座', 162, 18);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-BJ-TJ-01', 'none', '无座', 28, 350);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-NJ-SH-01', 'G7001', '南京', '上海', '06:00', '07:39', '1小时39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-01', 'second', '二等座', 139, 180);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-01', 'first', '一等座', 223, 35);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-01', 'business', '商务座', 417, 7);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-01', 'none', '无座', 72, 247);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-NJ-SH-02', 'G7011', '南京', '上海', '10:30', '12:09', '1小时39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-02', 'second', '二等座', 139, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-02', 'first', '一等座', 223, 8);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-02', 'business', '商务座', 417, 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-NJ-SH-02', 'none', '无座', 72, 33);

INSERT INTO rail_train (train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) VALUES ('G-SH-NJ-01', 'G7002', '上海', '南京', '07:00', '08:39', '1小时39分', 0);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-NJ-01', 'second', '二等座', 139, 220);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-NJ-01', 'first', '一等座', 223, 42);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-NJ-01', 'business', '商务座', 417, 9);
INSERT INTO rail_train_seat (train_id, seat_type, seat_name, price, base_remain) VALUES ('G-SH-NJ-01', 'none', '无座', 72, 296);

-- 演示订单（姓名/证件为虚构模糊样式）
INSERT INTO rail_order (order_id, user_id, username, train_id, train_no, from_station, to_station, travel_date, depart_time, arrive_time, duration, seat_type, seat_name, quantity, unit_price, price, passenger_name, id_card, ticket_type, status, pay_deadline, created_at, paid_at, refunded_at) VALUES
('ORD-DEMO-PAID-001', 2, 'demo', 'G-BJ-SH-01', 'G1', '北京', '上海', '2026-04-20', '06:00', '11:28', '5小时28分', 'second', '二等座', 2, 553, 1106, '张*国', '1101011992******12', 'normal', 'paid', DATE_ADD(NOW(), INTERVAL 25 MINUTE), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), NULL),
('ORD-DEMO-UNPAID-02', 2, 'demo', 'G-HZ-NJ-01', 'G7626', '杭州', '南京', '2026-04-20', '07:22', '09:01', '1小时39分', 'first', '一等座', 1, 187, 187, '李*娜', '', 'student', 'unpaid', DATE_ADD(NOW(), INTERVAL 28 MINUTE), DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL),
('ORD-DEMO-CANCEL-03', 2, 'demo', 'G-CD-CQ-01', 'G8501', '成都', '重庆', '2026-04-20', '07:00', '08:50', '1小时50分', 'second', '二等座', 1, 146, 146, '王*', '510***********0034', 'normal', 'cancelled', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 3 HOUR), NULL, NULL),
('ORD-ADMIN-PAID-04', 1, 'admin', 'G-GZ-SZ-01', 'G6201', '广州', '深圳', '2026-04-20', '06:15', '06:54', '39分', 'second', '二等座', 3, 74, 222, '陈*海', '440***********6611', 'group', 'paid', DATE_ADD(NOW(), INTERVAL 20 MINUTE), DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL);

-- 一条库存调整演示（北京-上海二等 +5）
INSERT INTO rail_stock_adjust (train_id, seat_type, delta_sum) VALUES ('G-BJ-SH-01', 'second', 5) ON DUPLICATE KEY UPDATE delta_sum = delta_sum + 5;

SET FOREIGN_KEY_CHECKS = 1;