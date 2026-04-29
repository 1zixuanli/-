<template>
  <div class="home-page">
    <header class="header rail-topbar">
      <span class="logo rail-brand">铁路车票系统</span>
      <span class="user">
        {{ username }}
        <el-button type="danger" link @click="logout">退出</el-button>
      </span>
    </header>
    <main class="main">
      <!-- 车票查询区 -->
      <section class="query-section rail-panel">
        <div class="trip-type">
          <div
            class="trip-tab"
            :class="{ active: tripType === 'oneWay' }"
            @click="tripType = 'oneWay'"
          >
            单程
          </div>
          <div
            class="trip-tab"
            :class="{ active: tripType === 'roundTrip' }"
            @click="tripType = 'roundTrip'"
          >
            往返
          </div>
        </div>

        <div class="station-row">
        <div class="station-box" @click="openCityPicker('from')">
           <span class="station-value">{{ fromCity || '请选择出发站' }}</span>
           <span class="station-arrow">›</span>
        </div>
          <div class="swap-btn" @click="swapStations" title="交换出发/到达">
            <span class="swap-icon">⇄</span>
          </div>
         <div class="station-box" @click="openCityPicker('to')">
           <span class="station-value">{{ toCity || '请选择到达站' }}</span>
           <span class="station-arrow">›</span>
         </div>
        </div>

        <div class="date-row">
          <el-date-picker
            v-model="travelDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            format="YYYY年MM月DD日"
            class="date-picker"
          />
          <span class="commute-label" title="开启后可查询多天或通勤类车票">多日通勤</span>
          <el-switch v-model="multiDayCommute" />
        </div>

        <div class="filter-row">
          <span class="filter-label">票种：</span>
          <el-radio-group v-model="ticketType" class="ticket-type radios">
            <el-radio value="normal">普通</el-radio>
            <el-radio value="student">学生票</el-radio>
            <el-radio value="group">团体票</el-radio>
          </el-radio-group>
          <el-checkbox v-model="highSpeedOnly" class="high-speed">高铁动车</el-checkbox>
        </div>

        <el-button type="primary" class="query-btn" @click="handleQuery">
          查询
        </el-button>
      </section>

      <section class="quick-nav">
        <el-button type="primary" plain @click="goProfile">个人中心</el-button>
        <el-button type="primary" plain @click="goOrders">我的订单</el-button>
        <el-button v-if="isAdmin" type="warning" plain @click="goAdmin">管理后台</el-button>
      </section>
      <p class="welcome-tip">登录成功，可查询车次、预订车票并管理订单。</p>
    </main>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch, inject } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import store from '../store'

const router = useRouter()
const route = useRoute()
const username = computed(() => localStorage.getItem('username') || '用户')
const isAdmin = computed(() => localStorage.getItem('role') === 'admin')
const tripType = ref('oneWay')           
const fromCity = inject('fromCity') ?? ref('合肥')
const toCity = inject('toCity') ?? ref('北京')               
const travelDate = ref(new Date().toISOString().slice(0, 10))
const multiDayCommute = ref(false)       
const ticketType = ref('normal')         
const highSpeedOnly = ref(false)
function swapStations(){
  const t=fromCity.value
  fromCity.value=toCity.value
  toCity.value=t
}
function openCityPicker(field){
  const current=field==='from'?fromCity.value:toCity.value
  router.push({
    path:'/city-picker',
    query:{field,current:current||undefined}
  })
}
function applyCityFromQuery() {
  const { selectedCity, field } = route.query
  if (selectedCity && field) {
    if (field === 'from') fromCity.value = selectedCity
    if (field === 'to') toCity.value = selectedCity
    router.replace({ path: '/home' })
  }
}
onMounted(applyCityFromQuery)
watch(()=>route.query,applyCityFromQuery,{deep:true})
function handleQuery(){
  const from=(fromCity.value||'').trim()
  const to=(toCity.value||'').trim()
  const date=travelDate.value||'2025-03-17'
  if(!from||!to){
    ElMessage.warning('请选择出发站和到达站')
    return
  }
  if(from===to){
    ElMessage.warning('出发站和到达站不能相同')
    return
  }
  router.push({
    path: '/trainList',
    query: {
      from,
      to,
      date,
      highSpeedOnly: highSpeedOnly.value ? '1' : '0',
      ticketType: ticketType.value
    }
  })
}
function goProfile() {
  router.push('/profile')
}
function goOrders() {
  router.push('/orders')
}
function goAdmin() {
  router.push('/admin')
}
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  store.commit('CLEAR_USER')
  ElMessage.success('已退出')
  router.push('/login')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding-bottom: 48px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  font-size: 14px;
}
.main {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.quick-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.quick-nav :deep(.el-button) {
  border-radius: 10px;
  font-weight: 500;
}
.welcome-tip {
  margin: 8px 0;
  color: #cbd5e1;
  font-size: 14px;
}

.query-section {
  padding: 30px 28px;
  margin-bottom: 28px;
}
.trip-type {
  display: flex;
  gap: 8px;
  margin-bottom: 22px;
}
.trip-tab {
  padding: 10px 22px;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.45);
  color: #94a3b8;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(148, 163, 184, 0.15);
  transition: all 0.22s ease;
}
.trip-tab:hover {
  color: #cbd5e1;
  border-color: rgba(56, 189, 248, 0.25);
}
.trip-tab.active {
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.12));
  color: #f0f9ff;
  font-weight: 700;
  border-color: rgba(56, 189, 248, 0.45);
  box-shadow: 0 0 24px rgba(56, 189, 248, 0.12);
}
.station-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.station-row .station-input {
  flex: 1;
}
.station-row .station-input :deep(.el-input__wrapper) {
  font-size: 16px;
}
.swap-btn {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #7dd3fc;
  background: linear-gradient(160deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.6));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.swap-btn:hover {
  border-color: rgba(56, 189, 248, 0.6);
  color: #e0f2fe;
  transform: scale(1.06) rotate(180deg);
  box-shadow: 0 6px 28px rgba(56, 189, 248, 0.2);
}
.swap-icon {
  font-size: 18px;
}
.date-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.date-row .date-picker {
  width: 200px;
}
.commute-label {
  margin-left: 8px;
  font-size: 14px;
  color: #94a3b8;
}
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}
.filter-label {
  font-size: 14px;
  color: #cbd5e1;
  font-weight: 500;
}
.filter-row .ticket-type.radios {
  margin-right: 8px;
}
.query-btn {
  width: 100%;
  font-size: 16px;
  padding: 14px 12px;
  border-radius: 14px !important;
  letter-spacing: 0.2em;
}
.station-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid rgba(100, 116, 139, 0.35);
  border-radius: 14px;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.5);
  min-height: 48px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.station-box:hover {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.15);
}
.station-value {
  font-size: 16px;
  color: #f1f5f9;
  font-weight: 500;
}
.station-box .station-value:empty,
.station-value:only-child {
  color: #64748b;
  font-weight: 400;
}
.station-arrow {
  color: #64748b;
  font-size: 18px;
}
</style>
