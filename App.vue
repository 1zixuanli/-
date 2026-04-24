<template>
  <router-view/>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const fromCity = ref('合肥')
const toCity = ref('北京')
provide('fromCity', fromCity)
provide('toCity', toCity)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  height: 100%;
}
</style>
