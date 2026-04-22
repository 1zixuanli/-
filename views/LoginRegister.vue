<template>
  <div class="login-register-page">
    <aside class="hero-panel">
      <div class="hero-bg-deco" aria-hidden="true" />
      <img :src="railHero" class="hero-svg" alt="" />
      <div class="hero-copy">
        <p class="hero-tag">RAIL · SMART BOOKING</p>
        <h2 class="hero-title">铁路车票售卖系统</h2>
        <p class="hero-desc">智慧出行 · 余票透明 · 订单可追溯</p>
        <ul class="hero-bullets">
          <li>前后端分离 · SSM + Vue</li>
          <li>多席别 · 学生 / 团体票</li>
        </ul>
      </div>
    </aside>
    <div class="form-panel">
    <div class="card-wrap rail-panel">
      <h1 class="title">账号登录 / 注册</h1>
      <el-tabs v-model="activeTab" class="tabs">
        <!-- 登录 -->
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
            class="form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                size="large"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                size="large"
                show-password
                clearable
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="submit-btn"
                :loading="loginLoading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 注册 -->
        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-width="0"
            class="form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名（3～20 位）"
                :prefix-icon="User"
                size="large"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码（6～20 位）"
                :prefix-icon="Lock"
                size="large"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="再次输入密码"
                :prefix-icon="Lock"
                size="large"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="手机号"
                :prefix-icon="Iphone"
                size="large"
                clearable
              />
            </el-form-item>
            <el-form-item prop="idCard">
              <el-input
                v-model="registerForm.idCard"
                placeholder="身份证号（选填）"
                :prefix-icon="Postcard"
                size="large"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="submit-btn"
                :loading="registerLoading"
                @click="handleRegister"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import railHero from '../assets/rail-hero.svg'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Iphone, Postcard } from '@element-plus/icons-vue'
import { login as loginApi, register as registerApi } from '../api/auth.js'
import store from '../store'

const router = useRouter()
const activeTab = ref('login')

// ---------- 登录 ----------
const loginFormRef = ref(null)
const loginLoading = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})

const validateLoginUsername = (_rule, value, callback) => {
  if (!value?.trim()) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validateLoginPassword = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const loginRules = {
  username: [{ required: true, validator: validateLoginUsername, trigger: 'blur' }],
  password: [{ required: true, validator: validateLoginPassword, trigger: 'blur' }]
}

async function handleLogin() {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loginLoading.value = true
    try {
      // 接口调用：契约 POST /api/user/login，Body { username, password }
      const res = await loginApi({
        username: loginForm.username.trim(),
        password: loginForm.password
      })
      // 契约成功：res = { code: 0, message, data: { token, userId, username } }
      const { data } = res
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', String(data.userId))
      localStorage.setItem('username', data.username)
      localStorage.setItem('role', data.role || 'user')
      store.commit('SET_AUTH', {
        token: data.token,
        userId: data.userId,
        username: data.username,
        role: data.role || 'user'
      })
      store.dispatch('syncAuthFromStorage')
      ElMessage.success('登录成功')
      router.push('/home')
    } catch (err) {
      ElMessage.error(err.message || '登录失败')
    } finally {
      loginLoading.value = false
    }
  })
}

// ---------- 注册 ----------
const registerFormRef = ref(null)
const registerLoading = ref(false)
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  idCard: ''
})

const validateRegisterUsername = (_rule, value, callback) => {
  const v = value?.trim()
  if (!v) {
    callback(new Error('请输入用户名'))
  } else if (v.length < 3 || v.length > 20) {
    callback(new Error('用户名 3～20 位'))
  } else {
    callback()
  }
}
const validateRegisterPassword = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码 6～20 位'))
  } else {
    callback()
  }
}
const validateConfirmPassword = (_rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const validatePhone = (_rule, value, callback) => {
  if (!value?.trim()) {
    callback(new Error('请输入手机号'))
  } else if (!/^1\d{10}$/.test(value.trim())) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [{ required: true, validator: validateRegisterUsername, trigger: 'blur' }],
  password: [{ required: true, validator: validateRegisterPassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  idCard: []
}

async function handleRegister() {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return
    registerLoading.value = true
    try {
      // 接口调用：契约 POST /api/user/register，Body { username, password, phone, idCard? }
      const res = await registerApi({
        username: registerForm.username.trim(),
        password: registerForm.password,
        phone: registerForm.phone.trim(),
        idCard: registerForm.idCard?.trim() || undefined
      })
      // 契约成功：res = { code: 0, message, data: { userId, username } }
      localStorage.setItem('profile_phone', registerForm.phone.trim())
      if (registerForm.idCard?.trim()) {
        localStorage.setItem('profile_idCard', registerForm.idCard.trim())
      }
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
      loginForm.username = registerForm.username
      loginForm.password = ''
    } catch (err) {
      ElMessage.error(err.message || '注册失败')
    } finally {
      registerLoading.value = false
    }
  })
}
</script>

<style scoped>
.login-register-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr minmax(360px, 420px);
}
@media (max-width: 920px) {
  .login-register-page {
    grid-template-columns: 1fr;
  }
  .hero-panel {
    min-height: 220px;
    padding: 28px 24px 12px !important;
  }
  .hero-svg {
    width: min(70%, 280px) !important;
    right: -20px !important;
    bottom: 0 !important;
    opacity: 0.75;
  }
  .hero-bullets {
    display: none;
  }
}
.hero-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 48px 48px 56px;
  overflow: hidden;
}
.hero-bg-deco {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 75% 15%, rgba(56, 189, 248, 0.22), transparent 45%),
    radial-gradient(circle at 10% 80%, rgba(99, 102, 241, 0.18), transparent 40%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.5) 0%, transparent 55%);
  z-index: 0;
}
.hero-svg {
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: min(95%, 440px);
  height: auto;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.35));
}
.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 420px;
}
.hero-tag {
  font-size: 11px;
  letter-spacing: 0.35em;
  color: #7dd3fc;
  margin: 0 0 12px;
  opacity: 0.95;
}
.hero-title {
  margin: 0 0 14px;
  font-size: clamp(26px, 3.5vw, 34px);
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.25;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
}
.hero-desc {
  margin: 0 0 20px;
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.6;
}
.hero-bullets {
  margin: 0;
  padding-left: 18px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.9;
}
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.75) 100%);
  backdrop-filter: blur(10px);
}
.card-wrap {
  width: 100%;
  max-width: 400px;
  padding: 38px 34px;
}
.title {
  margin: 0 0 18px;
  font-size: 21px;
  text-align: center;
  color: #f8fafc;
  font-weight: 800;
  letter-spacing: 0.04em;
}
.tabs {
  margin-top: 0;
}
.tabs :deep(.el-tabs__item) {
  color: #94a3b8 !important;
  font-weight: 600;
}
.tabs :deep(.el-tabs__item.is-active) {
  color: #e0f2fe !important;
}
.tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #38bdf8, #818cf8) !important;
  height: 3px;
  border-radius: 3px;
}
.tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
}
.form :deep(.el-form-item) {
  margin-bottom: 20px;
}
.submit-btn {
  width: 100%;
  font-weight: 600;
  letter-spacing: 0.06em;
}
</style>
