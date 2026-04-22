<template>
 <div class="city-picker-page">
  <header class="header rail-topbar">
   <span class="back" @click="goBack">‹ 返回</span>
   <span class="title rail-title">选择城市</span>
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
  padding-bottom: 32px;
}
.header {
  display: flex;
  align-items: center;
  padding: 14px 20px;
}
.back {
  cursor: pointer;
  color: #7dd3fc;
  margin-right: 16px;
  font-size: 16px;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #f1f5f9;
}
.main {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}
.letter-block {
  margin-bottom: 16px;
}
.letter-title {
  padding: 8px 14px;
  background: rgba(15, 23, 42, 0.45);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  border-radius: 8px;
  letter-spacing: 0.08em;
}
.city-list {
  background: linear-gradient(
    165deg,
    rgba(30, 41, 59, 0.55) 0%,
    rgba(15, 23, 42, 0.88) 100%
  );
  backdrop-filter: blur(18px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
.city-item {
  padding: 14px 16px;
  font-size: 16px;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  cursor: pointer;
  transition: background 0.18s ease;
}
.city-item:last-child {
  border-bottom: none;
}
.city-item:hover {
  background: rgba(56, 189, 248, 0.08);
}
.city-item-active {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.1)) !important;
  color: #e0f2fe;
  font-weight: 600;
}
</style>