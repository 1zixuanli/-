<template>
 <div class="city-picker-page">
  <header class="header">
   <span class="back"@click="goBack">返回</span>
   <span class="title">选择城市</span>
  </header>
  <main ref="mainRef" class="main">
    <template v-for="(cities,letter) in cityGroupByLetter" :key="letter">
     <div class="letter-block">
     <div class="letter-title">{{ letter }}</div>
     <div class="city-list">
      <div
       v-for="city in cities"
       :key="city"
       class="city-item"
       :class="{ 'city-item-active': city === currentCity }"
       :data-city="city"
       @click="selectCity(city)"
       >
         {{ city }}
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
<script setup>
import {computed, ref, onMounted, nextTick}from 'vue'
import {useRouter,useRoute}from 'vue-router'
const router = useRouter()
const route = useRoute()
const currentCity = computed(() => route.query.current || '')
const mainRef = ref(null)

function scrollToCurrentCity() {
  const current = route.query.current
  if (!current || !mainRef.value) return
  const el = mainRef.value.querySelector(`[data-city="${current}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

onMounted(() => {
  nextTick(() => {
    scrollToCurrentCity()
  })
})
const cityListByLetter = {
  B: ['北京'],
  C: ['成都', '重庆', '长沙', '长春'],
  D: ['大连'],
  F: ['福州'],
  G: ['广州', '贵阳'],
  H: ['杭州', '合肥', '哈尔滨', '海口', '呼和浩特'],
  J: ['济南'],
  K: ['昆明'],
  L: ['兰州', '拉萨'],
  N: ['南京', '南宁', '南昌'],
  Q: ['青岛'],
  S: ['上海', '深圳', '苏州', '沈阳', '石家庄'],
  T: ['天津', '太原'],
  W: ['武汉', '乌鲁木齐'],
  X: ['西安', '厦门', '西宁'],
  Y: ['银川'],
  Z: ['郑州']
}
const cityGroupByLetter =computed(()=>cityListByLetter)

function selectCity(city){
    const field=route.query.field
    router.push({
        path:'/home',
        query:{selectedCity:city,field:field || 'from'}
    })
}
function goBack(){
    router.push('/home')
}
</script>
<style scoped>
.city-picker-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.back {
  cursor: pointer;
  color: #409eff;
  margin-right: 16px;
  font-size: 16px;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}
.main {
  padding: 12px;
  max-width: 600px;
  margin: 0 auto;
}
.letter-block {
  margin-bottom: 16px;
}
.letter-title {
  padding: 8px 12px;
  background: #f0f0f0;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.city-list {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}
.city-item {
  padding: 14px 16px;
  font-size: 16px;
  color: #1a1a2e;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.city-item:last-child {
  border-bottom: none;
}
.city-item:hover {
  background: #f5f7fa;
}
.city-item-active {
  background: #ecf5ff !important;
  color: #409eff;
  font-weight: 600;
}
</style>