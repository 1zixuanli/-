<template>
  <div class="page">
    <h2 class="h2">车次与余票（今日 Mock 口径）</h2>
    <p class="tip">
      展示基准余票、今日已售、库存调整量；可对某席别增加「放票」数量（写入本地 Mock，与客户端列表/下单一致）。
    </p>
    <el-table v-loading="loading" :data="flatRows" stripe style="width: 100%" max-height="620">
      <el-table-column prop="trainNo" label="车次" width="90" />
      <el-table-column label="区间" min-width="140">
        <template #default="{ row }">{{ row.fromStation }} → {{ row.toStation }}</template>
      </el-table-column>
      <el-table-column prop="seatName" label="席别" width="100" />
      <el-table-column prop="baseRemain" label="基准余票" width="100" />
      <el-table-column prop="soldToday" label="今日已售" width="100" />
      <el-table-column prop="stockAdjust" label="调整量" width="90" />
      <el-table-column prop="displayRemain" label="当前可售" width="100" />
      <el-table-column label="放票" width="200" fixed="right">
        <template #default="{ row }">
          <el-input-number v-model="row.delta" :min="-999" :max="9999" size="small" />
          <el-button type="primary" size="small" class="ml" @click="apply(row)">应用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="err" class="err">{{ err }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAdminTrains, adminAdjustStock } from '../../api/admin.js'

const loading = ref(false)
const err = ref('')
const flatRows = ref([])

function buildFlat(data) {
  const rows = []
  for (const t of data || []) {
    for (const s of t.seatTypes || []) {
      rows.push({
        trainId: t.trainId,
        trainNo: t.trainNo,
        fromStation: t.fromStation,
        toStation: t.toStation,
        seatType: s.seatType,
        seatName: s.seatName,
        baseRemain: s.baseRemain,
        soldToday: s.soldToday,
        stockAdjust: s.stockAdjust,
        displayRemain: s.displayRemain,
        delta: 0
      })
    }
  }
  return rows
}

async function load() {
  loading.value = true
  err.value = ''
  try {
    const res = await fetchAdminTrains()
    flatRows.value = buildFlat(res.data)
  } catch (e) {
    err.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

async function apply(row) {
  if (!row.delta) {
    ElMessage.info('调整量为 0')
    return
  }
  try {
    await adminAdjustStock({
      trainId: row.trainId,
      seatType: row.seatType,
      delta: row.delta
    })
    ElMessage.success('已更新')
    row.delta = 0
    await load()
  } catch (e) {
    ElMessage.error(e.message || '失败')
  }
}

onMounted(load)
</script>

<style scoped>
.h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1a1a2e;
}
.tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: #909399;
}
.ml {
  margin-left: 8px;
}
.err {
  margin-top: 12px;
  color: #f56c6c;
}
</style>
