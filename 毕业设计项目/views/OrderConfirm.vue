<template>
  <div class="order-confirm-page">
    <header class="header rail-topbar">
      <span class="back" @click="goBack">‹ 返回</span>
      <span class="title rail-title">确认订单</span>
    </header>

    <div v-loading="loading" class="main">
      <el-alert v-if="errorMsg" type="error" :title="errorMsg" show-icon class="mb" />
      <template v-if="train">
        <section class="card rail-panel">
          <div class="row">
            <span class="label">车次</span>
            <span>{{ train.trainNo }}</span>
          </div>
          <div class="row">
            <span class="label">区间</span>
            <span>{{ train.fromStation }} → {{ train.toStation }}</span>
          </div>
          <div class="row">
            <span class="label">日期</span>
            <span>{{ date }}</span>
          </div>
          <div class="row">
            <span class="label">发到</span>
            <span>{{ train.departTime }} — {{ train.arriveTime }}</span>
          </div>
        </section>

        <section class="card rail-panel">
          <h3 class="sub-title">席别</h3>
          <el-radio-group v-model="seatType" class="seat-group">
            <el-radio
              v-for="s in train.seatTypes"
              :key="s.seatType"
              :value="s.seatType"
              :disabled="s.remainCount <= 0"
            >
              {{ s.seatName }} · 余 {{ s.remainCount }} · ¥{{ displayPrice(s.price) }}/张
            </el-radio>
          </el-radio-group>
        </section>

        <section class="card rail-panel">
          <h3 class="sub-title">购票数量</h3>
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="maxQuantity"
            :disabled="maxQuantity <= 0"
          />
          <span class="qty-hint">最多可购 {{ maxQuantity }} 张（与余票联动）</span>
        </section>

        <section class="card rail-panel">
          <h3 class="sub-title">乘车人</h3>
          <el-form label-width="88px" class="form">
            <el-form-item label="姓名" required>
              <el-input v-model="passengerName" placeholder="与证件一致" clearable />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="idCard" placeholder="选填（Mock）" clearable />
            </el-form-item>
          </el-form>
        </section>

        <div class="footer-bar">
          <span class="total">应付 ¥{{ totalPay }}</span>
          <el-button type="primary" :loading="submitting" :disabled="!canSubmit" @click="submit">
            提交订单
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchTrainList } from '../api/train.js'
import { createOrder } from '../api/order.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMsg = ref('')
const train = ref(null)
const seatType = ref('')
const passengerName = ref('')
const idCard = ref('')
const quantity = ref(1)
const submitting = ref(false)

const date = computed(() => (route.query.date || '').toString())
const ticketType = computed(() => (route.query.ticketType || 'normal').toString())

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

const currentSeat = computed(() =>
  train.value?.seatTypes?.find((s) => s.seatType === seatType.value)
)

const maxQuantity = computed(() => currentSeat.value?.remainCount || 0)

const unitPay = computed(() => {
  if (!currentSeat.value) return 0
  return displayPrice(currentSeat.value.price)
})

const totalPay = computed(() => unitPay.value * (quantity.value || 1))

const canSubmit = computed(
  () =>
    !!train.value &&
    !!seatType.value &&
    currentSeat.value &&
    currentSeat.value.remainCount > 0 &&
    quantity.value >= 1 &&
    quantity.value <= currentSeat.value.remainCount &&
    passengerName.value.trim().length >= 2
)

async function loadTrain() {
  loading.value = true
  errorMsg.value = ''
  train.value = null
  const trainId = route.query.trainId
  try {
    const res = await fetchTrainList({
      from: route.query.from,
      to: route.query.to,
      date: route.query.date,
      highSpeedOnly: route.query.highSpeedOnly || '0',
      ticketType: route.query.ticketType
    })
    const row = (res.data || []).find((r) => r.trainId === trainId)
    if (!row) {
      errorMsg.value = '未找到该车次或余票已变化'
      return
    }
    train.value = row
    const firstAvail = row.seatTypes.find((s) => s.remainCount > 0)
    seatType.value = firstAvail?.seatType || ''
    quantity.value = 1
  } catch (e) {
    errorMsg.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

watch(
  () => ({
    trainId: route.query.trainId,
    from: route.query.from,
    to: route.query.to,
    date: route.query.date,
    highSpeedOnly: route.query.highSpeedOnly,
    ticketType: route.query.ticketType
  }),
  () => loadTrain(),
  { immediate: true, deep: true }
)

watch(seatType, () => {
  quantity.value = 1
})

async function submit() {
  if (!canSubmit.value || !train.value) return
  submitting.value = true
  try {
    await createOrder({
      trainId: train.value.trainId,
      trainNo: train.value.trainNo,
      fromStation: train.value.fromStation,
      toStation: train.value.toStation,
      travelDate: date.value,
      departTime: train.value.departTime,
      arriveTime: train.value.arriveTime,
      seatType: seatType.value,
      quantity: quantity.value,
      passengerName: passengerName.value.trim(),
      idCard: idCard.value.trim(),
      ticketType: ticketType.value
    })
    ElMessage.success('下单成功，请前往我的订单支付')
    router.push('/orders')
  } catch (e) {
    const msg = e.message || '提交失败'
    if (msg === '当前车票已售完，无法预定') {
      await ElMessageBox.alert(msg, '提示', { type: 'warning', confirmButtonText: '知道了' })
    } else {
      ElMessage.error(msg)
    }
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.order-confirm-page {
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
  max-width: 560px;
  margin: 0 auto;
}
.mb {
  margin-bottom: 12px;
}
.card {
  padding: 20px;
  margin-bottom: 16px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 15px;
}
.label {
  color: #94a3b8;
}
.sub-title {
  margin: 0 0 12px;
  font-size: 15px;
  color: #e2e8f0;
  font-weight: 600;
}
.seat-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.form :deep(.el-form-item) {
  margin-bottom: 12px;
}
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 32px;
}
.total {
  font-size: 18px;
  font-weight: 700;
  color: #fda4af;
  font-variant-numeric: tabular-nums;
}
.qty-hint {
  margin-left: 12px;
  font-size: 13px;
  color: #64748b;
}
</style>
