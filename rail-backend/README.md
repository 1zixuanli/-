# 铁路车票售卖系统 · 后端（Spring MVC + MyBatis + MySQL）

与开题报告一致的分层：**Controller（Spring MVC）→ Service → Mapper（MyBatis）→ MySQL**。JWT 鉴权、事务下单与余票校验、管理端接口与前端 `api/*` 契约对齐。

## 环境

- JDK 8+
- Maven 3.6+
- MySQL 8.x（本地或 Docker）

## 数据说明

车次与票价种子数据来自项目内 **`trains-seed.json`**（由前端 `mockTrainSchedule.js` 导出），为**教学演示用虚构/参考数据**，**未**从携程等第三方网站抓取，以避免违反服务条款与法律风险。

## 建库

```sql
CREATE DATABASE IF NOT EXISTS rail_ticket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

修改 `src/main/resources/application.yml` 中的 `spring.datasource.username` / `password`（默认 `root` / `root`）。

## 运行

```bash
cd rail-backend
mvn spring-boot:run
```

服务默认：**http://localhost:8080**，API 前缀：**/api**。

首次启动会执行 `schema.sql` 建表，并自动：

- 插入管理员：`admin` / **`admin123`**
- 插入演示用户：`demo` / **`demo123`**
- 导入约 50 条车次及席别余票

## 与前端联调

前端 `api/config.js` 中设置 `export const ENABLE_MOCK = false`，并执行 `npm run dev`。`vite.config.js` 已将 `/api` 代理到 `localhost:8080`。

## Redis（开题中的缓存设计）

当前工程为**单机可跑通**未引入 Redis 依赖；论文中可描述为「热门车次余票缓存设计」，生产环境可再接入 Spring Data Redis 做查询缓存与失效策略。

## 常见问题

1. **连接数据库失败**：检查 MySQL 是否启动、库名是否为 `rail_ticket`、账号密码是否与 `application.yml` 一致。
2. **端口占用**：修改 `server.port`。
3. **401 无权限**：除登录/注册/车次查询外，接口需在请求头携带 `Authorization: Bearer <token>`。
