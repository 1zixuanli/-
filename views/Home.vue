<template>
  <div class="home-page">
    <header class="header">
      <span class="logo">铁路车票系统</span>
      <span class="user">
        {{ username }}
        <el-button type="danger" link @click="logout">退出</el-button>
      </span>
    </header>
    <main class="main">
      <!-- 车票查询区 -->
      <section class="query-section">
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
        <div class="station-box"@click="openCityPicker('from')">
           <span class="station-value">{{fromCity || '请选择出发站'}}</span>
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

      <p>登录成功，欢迎使用铁路车票售卖系统。</p>
      <p>后续可在此增加：车票列表、订单等入口。</p>
    </main>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch, inject } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()
const username =computed(()=>localStorage.getItem('username')||'用户')
const tripType = ref('oneWay')           
const fromCity = inject('fromCity') ?? ref('合肥')
const toCity = inject('toCity') ?? ref('北京')               
const travelDate = ref('2025-03-17')        
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
  router.push({path:'/trainList',query:{
    from,to,date
    highSpeedOnly:highSpeedOnly.value?'1':'0',
    ticketType:ticketType.value,
    }})
}
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  ElMessage.success('已退出')
  router.push('/login')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #1a1a2e;
  color: #fff;
}
.logo {
  font-size: 18px;
  font-weight: 600;
}
.user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.main {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.main p {
  margin: 8px 0;
  color: #333;
}

.query-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.trip-type {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
}
.trip-tab {
  padding: 8px 20px;
  cursor: pointer;
  background: #f0f0f0;
  color: #666;
  border-radius: 4px 4px 0 0;
  font-size: 14px;
}
.trip-tab.active {
  background: #fff;
  color: #1a1a2e;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  border-bottom: none;
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
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #409eff;
}
.swap-btn:hover {
  background: #ecf5ff;
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
  color: #333;
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
  color: #333;
}
.filter-row .ticket-type.radios {
  margin-right: 8px;
}
.query-btn {
  width: 100%;
  font-size: 16px;
  padding: 12px;
}
.station-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  min-height: 40px;
}
.station-box:hover {
  border-color: #409eff;
}
.station-value {
  font-size: 16px;
  color: #1a1a2e;
}
.station-box .station-value:empty,
.station-value:only-child {
  color: #c0c4cc;
}
.station-arrow {
  color: #c0c4cc;
  font-size: 18px;
}
</style>
