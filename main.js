import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/theme.css'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.config.errorHandler = (err, _instance, info) => {
  console.error('[Vue 运行时错误]', err, info)
}
app.use(ElementPlus)
app.use(store)
app.use(router)
store.dispatch('syncAuthFromStorage')
app.mount('#app')
