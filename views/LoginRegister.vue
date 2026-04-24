<template>
  <div class="login-register-page">
    <div class="card-wrap">
      <h1 class="title">铁路车票售卖系统</h1>
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Iphone, Postcard } from '@element-plus/icons-vue'
import { login as loginApi, register as registerApi } from '../api/auth.js'

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
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.card-wrap {
  width: 400px;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.title {
  margin: 0 0 24px;
  font-size: 22px;
  text-align: center;
  color: #1a1a2e;
}
.tabs {
  margin-top: 8px;
}
.form :deep(.el-form-item) {
  margin-bottom: 20px;
}
.submit-btn {
  width: 100%;
}
</style>
