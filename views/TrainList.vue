<template>
  <div class="train-list-page">
    <header class="header">
      <span class="back" @click="goBack">‹ 返回</span>
      <span class="title">车票列表</span>
    </header>

    <div class="summary">
      <span>{{ from }}</span>
      <span class="arrow">→</span>
      <span>{{ to }}</span>
      <span class="date">{{ date }}</span>
    </div>

    <div class="query-hint" v-if="ticketType !== 'normal' || highSpeedFilter">
      <span v-if="highSpeedFilter">仅显示高铁/动车</span>
      <span v-if="ticketType === 'student'"> · 学生票（票价按 75% 展示，mock）</span>
    </div>

    <div v-loading="loading" class="main">
      <el-e
      mpty v-if="!loading && !errorMsg && list.length === 0" description="暂无车次" />
      <el-alert v-if="errorMsg" type="error" :title="errorMsg" show-icon class="mb" />

      <div v-for="row in list" :key="row.trainId" class="train-card">
        <div class="train-head">
          <span class="train-no">{{ row.trainNo }}</span>
          <span class="time">{{ row.departTime }} — {{ row.arriveTime }}</span>
          <span v-if="row.duration" class="duration">{{ row.duration }}</span>
        </div>
        <div class="card-actions">
  <el-button type="primary" size="small" @click="onReserve(row)">预订</el-button>
        </div>
        <div class="station-line">
          <span>{{ row.fromStation }}</span>
          <span class="to">→</span>
          <span>{{ row.toStation }}</span>
        </div>
        <div class="seats">
          <div
            v-for="s in row.seatTypes"
            :key="s.seatType"
            class="seat-row"
          >
            <span>{{ s.seatName }}</span>
            <span class="price">¥{{ displayPrice(s.price) }}</span>
            <span :class="{ 'no-ticket': s.remainCount === 0 }">
              {{ s.remainCount > 0 ? `余票 ${s.remainCount}` : '无票' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchTrainList } from '../api/train.js'

const route = useRoute()
const router = useRouter()

const from = computed(() => (route.query.from || '—').toString())
const to = computed(() => (route.query.to || '—').toString())
const date = computed(() => (route.query.date || '—').toString())

const ticketType = computed(() => (route.query.ticketType || 'normal').toString())
const highSpeedFilter = computed(() => route.query.highSpeedOnly === '1')

function displayPrice(price) {
  if (ticketType.value === 'student') {
    return Math.round(Number(price) * 0.75)
  }
  return price
}
function onReserve(row) {
  ElMessage.success(`预订 ${row.trainNo} (后续接下单页/接口)`)
const loading = ref(false)
const errorMsg = ref('')
const list = ref([])

async function loadList() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await fetchTrainList({
      from: route.query.from,
      to: route.query.to,
      date: route.query.date,
      highSpeedOnly: route.query.highSpeedOnly,
      ticketType: route.query.ticketType
    })
    list.value = res.data || []
  } catch (e) {
    errorMsg.value = e.message || '加载失败'
    list.value = []
    ElMessage.error(errorMsg.value)
  } finally {
    loading.value = false
  }
}

watch(
  () => [
    route.query.from,
    route.query.to,
    route.query.date,
    route.query.highSpeedOnly,
    route.query.ticketType
  ],
  () => loadList(),
  { immediate: true }
)

function goBack() {
  router.push('/home')
}
</script>

<style scoped>
.train-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #1a1a2e;
  color: #fff;
}
.back {
  cursor: pointer;
  margin-right: 16px;
  font-size: 18px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.summary {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}
.summary .arrow {
  color: #409eff;
}
.summary .date {
  margin-left: auto;
  color: #666;
  font-size: 14px;
}
.main {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}
.mb {
  margin-bottom: 12px;
}
.train-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.train-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.train-no {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}
.time {
  color: #666;
  font-size: 14px;
}
.station-line {
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
}
.station-line .to {
  margin: 0 8px;
  color: #409eff;
}
.seats {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}
.seat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}
.seat-row .price {
  color: #f56c6c;
  font-weight: 600;
}
.no-ticket {
  color: #909399;
}
.duration {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
.query-hint {
  padding: 8px 16px;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}
.card-actions {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed #eee;
  text-align: right;
}
</style>