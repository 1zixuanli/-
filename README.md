# 铁路购票系统

这是一个前后端分离的演示项目，包含：

- 前端：Vue 3 + Vite
- 后端：Spring Boot + MyBatis
- 数据库：MySQL 8

## 项目结构

- `api`、`views`、`router`：前端页面与接口调用
- `rail-backend`：后端服务
- `rail-backend/scripts/init_rail_ticket.sql`：数据库初始化脚本
- `docker-compose.yml`：本地启动 MySQL 的示例配置

## 前端启动

```bash
npm install
npm run dev
```

## 后端启动

```bash
cd rail-backend
mvn spring-boot:run
```

## 数据库说明

推荐使用项目里的初始化脚本，而不是上传本机数据库运行目录。

初始化脚本：

```text
rail-backend/scripts/init_rail_ticket.sql
```

后端支持用环境变量覆盖数据库配置：

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

`JWT` 是登录后服务端生成的身份令牌，`JWT_SECRET` 就是它的签名密钥。

## 说明

仓库已忽略本地运行生成文件，例如 `node_modules`、`dist`、`.mysql-local` 和本机密码文件。
