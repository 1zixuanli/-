<template>
  <div class="page">
    <h2 class="h2">数据统计（开题：订单监控与售票量）</h2>
    <el-row :gutter="12" v-loading="loading" class="cards">
      <el-col v-for="c in cards" :key="c.label" :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="label">{{ c.label }}</div>
          <div class="value">{{ c.value }}</div>
        </el-card>
      </el-col>
    </el-row>
    <h3 class="h3">各车次售票张数（待支付+已支付+已完成）</h3>
    <el-table :data="sales" stripe max-height="360" empty-text="暂无数据">
      <el-table-column prop="trainNo" label="车次" width="90" />
      <el-table-column prop="fromStation" label="出发" width="100" />
      <el-table-column prop="toStation" label="到达" width="100" />
      <el-table-column prop="count" label="售票张数" width="110" />
    </el-table>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAdminStats, fetchAdminSalesByTrain } from '../../api/admin.js'

const loading = ref(false)
const stats = ref(null)
const sales = ref([])
const err = ref('')

const cards = computed(() => {
  const s = stats.value
  if (!s) {
    return [
      { label: '订单总数', value: '—' },
      { label: '待支付', value: '—' },
      { label: '已支付', value: '—' },
      { label: '已取消', value: '—' },
      { label: '已退票', value: '—' },
      { label: '累计营收(元)', value: '—' }
    ]
  }
  return [
    { label: '订单总数', value: s.orderTotal },
    { label: '待支付', value: s.unpaid },
    { label: '已支付', value: s.paid },
    { label: '已取消', value: s.cancelled },
    { label: '已退票', value: s.refunded ?? 0 },
    { label: '累计营收(元)', value: s.revenue }
  ]
})

async function load() {
  loading.value = true
  err.value = ''
  try {
    const [r1, r2] = await Promise.all([fetchAdminStats(), fetchAdminSalesByTrain()])
    stats.value = r1.data
    sales.value = r2.data || []
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
.h3 {
  margin: 24px 0 12px;
  font-size: 16px;
  color: #303133;
}
.cards {
  margin-bottom: 8px;
}
.stat-card .label {
  font-size: 12px;
  color: #909399;
}
.stat-card .value {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
.err {
  margin-top: 16px;
  color: #f56c6c;
}
</style>
