<template>
  <div class="admin-layout">
    <aside class="aside">
      <div class="brand">
        <span class="brand-mark">◇</span>
        运营控制台
      </div>
      <el-menu
        :default-active="active"
        router
        class="menu"
        background-color="transparent"
        text-color="rgba(248,250,252,0.82)"
        active-text-color="#38bdf8"
      >
        <el-menu-item index="/admin">概览</el-menu-item>
        <el-menu-item index="/admin/users">用户</el-menu-item>
        <el-menu-item index="/admin/train-manage">车次信息</el-menu-item>
        <el-menu-item index="/admin/trains">票型与余票</el-menu-item>
        <el-menu-item index="/admin/orders">全部订单</el-menu-item>
      </el-menu>
      <div class="foot">
        <el-button link type="primary" @click="goClient">返回客户端</el-button>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = computed(() => route.path)

function goClient() {
  router.push('/home')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 40%, #e0f2fe 100%);
}
.aside {
  position: relative;
  width: 228px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 55%, #0f172a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(56, 189, 248, 0.15);
  box-shadow: 8px 0 40px rgba(0, 0, 0, 0.2);
}
.aside::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
      circle at 100% 0%,
      rgba(56, 189, 248, 0.12) 0%,
      transparent 45%
    ),
    linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 100% 100%, 100% 32px;
  pointer-events: none;
  z-index: 0;
}
.brand {
  position: relative;
  z-index: 1;
  padding: 22px 18px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  color: #f8fafc;
}
.brand-mark {
  color: #38bdf8;
  margin-right: 8px;
  font-size: 12px;
  opacity: 0.9;
}
.menu {
  flex: 1;
  border-right: none;
  background: transparent;
  position: relative;
  z-index: 1;
}
.menu :deep(.el-menu-item) {
  color: rgba(248, 250, 252, 0.85);
  margin: 4px 8px;
  border-radius: 10px;
}
.menu :deep(.el-menu-item:hover) {
  background: rgba(56, 189, 248, 0.1) !important;
}
.menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.25), rgba(56, 189, 248, 0.12)) !important;
  color: #e0f2fe !important;
  border-left: 3px solid #38bdf8;
}
.foot {
  position: relative;
  z-index: 1;
  padding: 14px 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}
.content {
  flex: 1;
  padding: 28px 32px;
  overflow: auto;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, transparent 120px);
}
</style>
