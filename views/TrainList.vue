<template>
  <div class="train-list-page">
    <header class="header rail-topbar">
      <span class="back" @click="goBack">‹ 返回</span>
      <span class="title rail-title">车票列表</span>
    </header>

    <div class="summary rail-surface">
      <span>{{ from }}</span>
      <span class="arrow">→</span>
      <span>{{ to }}</span>
      <span class="date">{{ date }}</span>
    </div>

    <div class="query-hint" v-if="ticketType !== 'normal' || highSpeedFilter">
      <span v-if="highSpeedFilter">仅显示高铁/动车</span>
      <span v-if="ticketType === 'student'"> · 学生票（票价按 75% 展示）</span>
      <span v-if="ticketType === 'group'"> · 团体票（票价按 95% 展示）</span>
    </div>

    <div v-loading="loading" class="main">
      <el-empty v-if="!loading && !errorMsg && list.length === 0" description="暂无车次" />
      <el-alert v-if="errorMsg" type="error" :title="errorMsg" show-icon class="mb" />

      <div v-for="row in list" :key="row.trainId" class="train-card rail-panel">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchTrainList } from '../api/train.js'

const route = useRoute()
const router = useRouter()

const from = computed(() => (route.query.from || '—').toString())
const to = computed(() => (route.query.to || '—').toString())
const date = computed(() => (route.query.date || '—').toString())

const ticketType = computed(() => (route.query.ticketType || 'normal').toString())
const highSpeedFilter = computed(() => route.query.highSpeedOnly === '1')

function displayPrice(price) {
  let p = Number(price)
  if (ticketType.value === 'student') {
    return Math.round(p * 0.75)
  }
  if (ticketType.value === 'group') {
    return Math.round(p * 0.95)
  }
  return p
}

function totalRemain(row) {
  return (row.seatTypes || []).reduce((s, x) => s + (x.remainCount || 0), 0)
}

const loading = ref(false)
const errorMsg = ref('')
const list = ref([])

function onReserve(row) {
  if (totalRemain(row) <= 0) {
    ElMessageBox.alert('当前车票已售完，无法预定', '提示', {
      type: 'warning',
      confirmButtonText: '知道了'
    })
    return
  }
  router.push({
    path: '/order/confirm',
    query: {
      trainId: row.trainId,
      trainNo: row.trainNo,
      from: row.fromStation,
      to: row.toStation,
      date: route.query.date,
      ticketType: route.query.ticketType || 'normal',
      highSpeedOnly: route.query.highSpeedOnly || '0',
      departTime: row.departTime,
      arriveTime: row.arriveTime
    }
  })
}

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
  padding-bottom: 32px;
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
.summary {
  margin: 16px 16px 0;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 600;
  border-radius: 14px;
}
.summary .arrow {
  color: #38bdf8;
  font-weight: 400;
}
.summary .date {
  margin-left: auto;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
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
  padding: 20px;
  margin-bottom: 16px;
}
.train-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.train-no {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #f8fafc;
}
.time {
  color: #94a3b8;
  font-size: 14px;
}
.station-line {
  font-size: 15px;
  color: #cbd5e1;
  margin-bottom: 12px;
}
.station-line .to {
  margin: 0 8px;
  color: #38bdf8;
}
.seats {
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  padding-top: 10px;
}
.seat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}
.seat-row .price {
  color: #fda4af;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.no-ticket {
  color: #64748b;
}
.duration {
  font-size: 12px;
  color: #64748b;
  margin-left: 8px;
}
.query-hint {
  margin: 12px 16px 0;
  padding: 10px 16px;
  font-size: 12px;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
}
.card-actions {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed rgba(148, 163, 184, 0.2);
  text-align: right;
}
</style>