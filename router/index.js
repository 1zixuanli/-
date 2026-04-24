import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: () => import('../views/LoginRegister.vue'),
    meta: { title: '登录 / 注册' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', requiresAuth: false }
  },
  {
    path: '/city-picker',
    name: 'CityPicker',
    component: () => import('../views/CityPicker.vue'),
    meta: { title: '选择城市', requiresAuth: false }
  },
  {
    path: '/trainList',
    name: 'TrainList',
    component: () => import('../views/TrainList.vue'),
    meta: { title: '车票列表', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 简单路由守卫：未登录访问 /home 时跳回登录
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 铁路车票系统` : '铁路车票系统'
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

export default router
