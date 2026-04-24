<template>
  <div class="profile-page">
    <header class="header rail-topbar">
      <span class="back" @click="goHome">‹ 首页</span>
      <span class="title rail-title">个人中心</span>
    </header>
    <div v-loading="loading" class="main">
      <el-card class="card">
        <template #header>基本信息（开题：查询与修改）</template>
        <el-form label-width="100px" class="form">
          <el-form-item label="用户名">
            <el-input :model-value="username" disabled />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="11 位手机号" maxlength="11" clearable />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.idCard" placeholder="选填" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="save">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { fetchProfile, updateProfile } from '../api/userProfile.js'

const router = useRouter()
const store = useStore()
const loading = ref(false)
const saving = ref(false)
const form = reactive({ phone: '', idCard: '' })

const username = computed(() => store.state.username || localStorage.getItem('username') || '')

async function load() {
  loading.value = true
  try {
    const res = await fetchProfile()
    form.phone = res.data.phone || ''
    form.idCard = res.data.idCard || ''
    store.commit('SET_PROFILE', { phone: form.phone, idCard: form.idCard })
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function save() {
  if (form.phone && !/^1\d{10}$/.test(form.phone.trim())) {
    ElMessage.warning('手机号格式不正确')
    return
  }
  saving.value = true
  try {
    await updateProfile({ phone: form.phone.trim(), idCard: form.idCard.trim() })
    store.commit('SET_PROFILE', { phone: form.phone.trim(), idCard: form.idCard.trim() })
    ElMessage.success('已保存')
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

function goHome() {
  router.push('/home')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 40px;
}
.header {
  display: flex;
  align-items: center;
  padding: 14px 20px;
}
.back {
  cursor: pointer;
  margin-right: 16px;
  font-size: 18px;
  color: #7dd3fc;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
}
.main {
  padding: 16px;
  max-width: 520px;
  margin: 0 auto;
}
.form :deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
