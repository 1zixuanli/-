<template>
  <div class="orders-page">
    <header class="header rail-topbar">
      <span class="back" @click="goHome">‹ 首页</span>
      <span class="title rail-title">我的订单</span>
    </header>

    <div class="toolbar rail-surface">
      <span class="filter-label">状态：</span>
      <el-select v-model="statusFilter" size="small" style="width: 160px">
        <el-option label="全部" value="all" />
        <el-option label="待支付" value="unpaid" />
        <el-option label="已支付" value="paid" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
        <el-option label="已退票" value="refunded" />
      </el-select>
    </div>

    <div v-loading="loading" class="main">
      <el-empty v-if="!loading && filtered.length === 0" description="暂无订单" />
      <div v-for="o in filtered" :key="o.orderId" class="order-card rail-panel">
        <div class="head">
          <span class="no">{{ o.orderId }}</span>
          <el-tag :type="statusTag(o.status)" size="small">{{ statusText(o.status) }}</el-tag>
        </div>
        <div class="body">
          <p>
            <strong>{{ o.trainNo }}</strong>
            {{ o.fromStation }} → {{ o.toStation }} · {{ o.travelDate }} {{ o.departTime }}
          </p>
          <p>
            {{ o.seatName }} × {{ o.quantity || 1 }} 张 · {{ o.passengerName }} · 合计 ¥{{
              o.price
            }}
            <span v-if="o.unitPrice" class="sub">（¥{{ o.unitPrice }}/张）</span>
          </p>
          <p v-if="o.status === 'unpaid' && o.payDeadline" class="deadline">
            支付截止：{{ formatTime(o.payDeadline) }}
          </p>
        </div>
        <div class="actions">
          <el-button
            v-if="o.status === 'unpaid'"
            type="primary"
            size="small"
            :loading="actingId === o.orderId"
            @click="pay(o)"
          >
            支付（模拟）
          </el-button>
          <el-button
            v-if="o.status === 'unpaid'"
            size="small"
            :loading="actingId === o.orderId"
            @click="cancel(o)"
          >
            取消订单
          </el-button>
          <el-button
            v-if="o.status === 'paid'"
            type="warning"
            size="small"
            :loading="actingId === o.orderId"
            @click="refund(o)"
          >
            退票
          </el-button>
          <el-button
            v-if="o.status === 'paid'"
            size="small"
            :loading="actingId === o.orderId"
            @click="complete(o)"
          >
            确认出行
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchOrderList, payOrder, cancelOrder, refundOrder, completeOrder } from '../api/order.js'
import { ENABLE_MOCK } from '../api/config.js'
import { getAllOrders, saveAllOrders } from '../data/mockPersistence.js'

const router = useRouter()
const loading = ref(false)
const list = ref([])
const statusFilter = ref('all')
const actingId = ref('')

const filtered = computed(() => {
  if (statusFilter.value === 'all') return list.value
  return list.value.filter((o) => o.status === statusFilter.value)
})

function statusText(s) {
  const m = {
    unpaid: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    completed: '已完成',
    refunded: '已退票'
  }
  return m[s] || s
}

function statusTag(s) {
  const m = {
    unpaid: 'warning',
    paid: 'success',
    cancelled: 'info',
    completed: '',
    refunded: 'danger'
  }
  return m[s] || 'info'
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function load() {
  loading.value = true
  try {
    const res = await fetchOrderList()
    list.value = res.data || []
  } catch (e) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function pay(o) {
  actingId.value = o.orderId
  try {
    await payOrder({ orderId: o.orderId })
    ElMessage.success('支付成功')
    await load()
  } catch (e) {
    ElMessage.error(e.message || '支付失败')
  } finally {
    actingId.value = ''
  }
}

async function cancel(o) {
  try {
    await ElMessageBox.confirm('确定取消该订单？', '提示', { type: 'warning' })
  } catch {
    return
  }
  actingId.value = o.orderId
  try {
    await cancelOrder({ orderId: o.orderId })
    ElMessage.success('已取消')
    await load()
  } catch (e) {
    ElMessage.error(e.message || '取消失败')
  } finally {
    actingId.value = ''
  }
}

async function refund(o) {
  try {
    await ElMessageBox.confirm('退票后余票将回退（Mock），是否继续？', '退票确认', {
      type: 'warning'
    })
  } catch {
    return
  }
  actingId.value = o.orderId
  try {
    await refundOrder({ orderId: o.orderId })
    ElMessage.success('退票成功')
    await load()
  } catch (e) {
    ElMessage.error(e.message || '退票失败')
  } finally {
    actingId.value = ''
  }
}

async function complete(o) {
  actingId.value = o.orderId
  try {
    if (ENABLE_MOCK) {
      const list = getAllOrders()
      const uid = Number(localStorage.getItem('userId'))
      const row = list.find(
        (x) => x.orderId === o.orderId && Number(x.userId) === uid
      )
      if (row && row.status === 'paid') {
        row.status = 'completed'
        row.completedAt = new Date().toISOString()
        saveAllOrders(list)
        ElMessage.success('已标记为已完成')
      } else {
        ElMessage.warning('仅已支付订单可确认出行')
      }
    } else {
      await completeOrder({ orderId: o.orderId })
      ElMessage.success('已标记为已完成')
    }
    await load()
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  } finally {
    actingId.value = ''
  }
}

function goHome() {
  router.push('/home')
}
</script>

<style scoped>
.orders-page {
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
.toolbar {
  margin: 14px 16px 0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
}
.filter-label {
  font-size: 14px;
  color: #cbd5e1;
  font-weight: 500;
}
.main {
  padding: 16px;
  max-width: 720px;
  margin: 0 auto;
}
.order-card {
  padding: 20px;
  margin-bottom: 16px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.no {
  font-size: 12px;
  color: #64748b;
}
.body p {
  margin: 4px 0;
  font-size: 14px;
  color: #e2e8f0;
}
.actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sub {
  color: #94a3b8;
  font-size: 13px;
}
.deadline {
  margin: 4px 0 0;
  font-size: 12px;
  color: #fcd34d;
}
</style>
