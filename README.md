# 📦 出入库管理系统

一个简易的库存出入库管理应用。技术栈：**Cloudflare Pages**（前端 + Functions API）+ **D1**（SQLite 数据库）。

## 功能
- 录入入库 / 出库记录
- 按商品自动汇总当前库存（结存 = 入库 − 出库）
- 查看最近 100 条流水

## 本地开发（无需登录 Cloudflare）

```bash
npm install
npm run db:local     # 初始化本地数据库表
npm run dev          # 启动本地服务，默认 http://localhost:8788
```

## 部署到 Cloudflare（需登录）

```bash
npx wrangler login                    # 浏览器登录
npx wrangler d1 create inventory-db   # 创建数据库，把返回的 database_id 填进 wrangler.toml
npm run db:remote                     # 在线上数据库建表
npm run deploy                        # 部署
```

## 目录结构
```
public/            前端静态页面
  index.html
  styles.css
  app.js
functions/api/     Pages Functions（后端 API）
  movements.js     GET/POST 出入库流水
  stock.js         GET 库存汇总
schema.sql         数据库表结构
wrangler.toml      Cloudflare 配置
```
