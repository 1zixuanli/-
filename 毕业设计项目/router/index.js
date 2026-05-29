import { createRouter, createWebHistory } from 'vue-router'
// 全部改为静态 import，由 Vite 在打包时解析路径；避免运行时动态 import 被解析成 /views/... 导致白屏
import LoginRegister from '../views/LoginRegister.vue'
import Home from '../views/Home.vue'
import CityPicker from '../views/CityPicker.vue'
import TrainList from '../views/TrainList.vue'
import OrderConfirm from '../views/OrderConfirm.vue'
import MyOrders from '../views/MyOrders.vue'
import Profile from '../views/Profile.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminTrainManage from '../views/admin/AdminTrainManage.vue'
import AdminTrains from '../views/admin/AdminTrains.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: LoginRegister,
    meta: { title: '登录 / 注册' }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '首页', requiresAuth: false }
  },
  {
    path: '/city-picker',
    name: 'CityPicker',
    component: CityPicker,
    meta: { title: '选择城市', requiresAuth: false }
  },
  {
    path: '/trainList',
    name: 'TrainList',
    component: TrainList,
    meta: { title: '车票列表', requiresAuth: false }
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: OrderConfirm,
    meta: { title: '确认订单', requiresAuth: false }
  },
  {
    path: '/orders',
    name: 'MyOrders',
    component: MyOrders,
    meta: { title: '我的订单', requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '个人中心', requiresAuth: false }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresRole: 'admin' },
    redirect: { name: 'AdminDashboard' },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '管理概览' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { title: '用户管理' }
      },
      {
        path: 'train-manage',
        name: 'AdminTrainManage',
        component: AdminTrainManage,
        meta: { title: '车次信息管理' }
      },
      {
        path: 'trains',
        name: 'AdminTrains',
        component: AdminTrains,
        meta: { title: '票型与余票调整' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
        meta: { title: '订单管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const title = to.matched.find((r) => r.meta?.title)?.meta?.title
  document.title = title ? `${title} - 铁路车票系统` : '铁路车票系统'

  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
    return
  }
  if (to.meta.requiresRole === 'admin' && localStorage.getItem('role') !== 'admin') {
    next('/home')
    return
  }
  next()
})

router.onError((err) => {
  console.error('[路由] 错误:', err)
})

export default router
