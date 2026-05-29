<template>
  <div class="page">
    <h2 class="h2">全部订单</h2>
    <div class="bar">
      <el-select v-model="status" placeholder="状态" clearable style="width: 140px">
        <el-option label="待支付" value="unpaid" />
        <el-option label="已支付" value="paid" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
    </div>
    <el-table v-loading="loading" :data="filtered" stripe style="width: 100%" max-height="560">
      <el-table-column prop="orderId" label="订单号" min-width="160" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="trainNo" label="车次" width="90" />
      <el-table-column label="行程" min-width="140">
        <template #default="{ row }">{{ row.fromStation }} → {{ row.toStation }}</template>
      </el-table-column>
      <el-table-column prop="travelDate" label="日期" width="110" />
      <el-table-column prop="seatName" label="席别" width="90" />
      <el-table-column prop="price" label="金额" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="tagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="160" />
    </el-table>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAdminOrders } from '../../api/admin.js'

const loading = ref(false)
const list = ref([])
const err = ref('')
const status = ref('')

const filtered = computed(() => {
  if (!status.value) return list.value
  return list.value.filter((o) => o.status === status.value)
})

function tagType(s) {
  if (s === 'unpaid') return 'warning'
  if (s === 'paid') return 'success'
  if (s === 'cancelled') return 'info'
  return ''
}

async function load() {
  loading.value = true
  err.value = ''
  try {
    const res = await fetchAdminOrders()
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
.bar {
  margin-bottom: 12px;
}
.err {
  margin-top: 12px;
  color: #f56c6c;
}
</style>
