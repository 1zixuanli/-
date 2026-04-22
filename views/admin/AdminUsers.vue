<template>
  <div class="page">
    <h2 class="h2">用户列表（Mock）</h2>
    <el-table v-loading="loading" :data="list" stripe style="width: 100%" max-height="520">
      <el-table-column prop="userId" label="ID" width="100" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column prop="idCard" label="身份证" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="registeredAt" label="注册时间" min-width="160" />
    </el-table>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAdminUsers } from '../../api/admin.js'

const loading = ref(false)
const list = ref([])
const err = ref('')

async function load() {
  loading.value = true
  err.value = ''
  try {
    const res = await fetchAdminUsers()
    list.value = res.data || []
  } catch (e) {
    err.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.h2 {
  margin: 0 0 16px;
  font-size: 20px;
  color: #1a1a2e;
}
.err {
  margin-top: 12px;
  color: #f56c6c;
}
</style>
