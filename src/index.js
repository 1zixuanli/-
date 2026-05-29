// src/index.js
export default [ // 导出整个项目的路由表
  { path: '/', controller: () => import('./login/Controller') }, // 根路径进入登录页
  { path: '/login', controller: () => import('./login/Controller') }, // 登录注册页
  { path: '/home', controller: () => import('./home/Controller') }, // 首页
  { path: '/city-picker', controller: () => import('./city-picker/Controller') }, // 选城市页
  { path: '/trainList', controller: () => import('./train-list/Controller') }, // 车票列表页
  { path: '/order/confirm', controller: () => import('./order-confirm/Controller') }, // 确认订单页
  { path: '/orders', controller: () => import('./my-orders/Controller') }, // 我的订单页
  { path: '/profile', controller: () => import('./profile/Controller') }, // 个人中心页
  //{ path: '/admin', controller: () => import('./admin-dashboard/Controller') }, // 管理端概览页
  //{ path: '/admin/users', controller: () => import('./admin-users/Controller') }, // 用户管理页
  //{ path: '/admin/train-manage', controller: () => import('./admin-train-manage/Controller') }, // 车次信息管理页
  //{ path: '/admin/trains', controller: () => import('./admin-trains/Controller') }, // 票型与余票页
  //{ path: '/admin/orders', controller: () => import('./admin-orders/Controller') }, // 订单管理页
] // 路由表结束
