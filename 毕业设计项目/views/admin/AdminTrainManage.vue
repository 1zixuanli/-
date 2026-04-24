<template>
  <div class="page">
    <h2 class="h2">车次信息管理</h2>
    <p class="tip">对接后端时新增/删除写入 MySQL；Mock 模式写入浏览器本地。</p>
    <el-button type="primary" class="mb" @click="openAdd">新增车次</el-button>
    <el-table v-loading="loading" :data="list" stripe max-height="480">
      <el-table-column prop="trainNo" label="车次" width="90" />
      <el-table-column label="区间" min-width="140">
        <template #default="{ row }">{{ row.fromStation }} → {{ row.toStation }}</template>
      </el-table-column>
      <el-table-column prop="departTime" label="出发" width="80" />
      <el-table-column prop="arriveTime" label="到达" width="80" />
      <el-table-column prop="trainId" label="车次ID" min-width="120" show-overflow-tooltip />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" link @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="err" class="err">{{ err }}</p>

    <el-dialog v-model="dialogVisible" title="新增车次" width="480px" @closed="resetForm">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="车次号" required>
          <el-input v-model="addForm.trainNo" placeholder="如 G9999" />
        </el-form-item>
        <el-form-item label="车次ID" required>
          <el-input v-model="addForm.trainId" placeholder="唯一英文ID，如 G-TEST-01" />
        </el-form-item>
        <el-form-item label="出发站" required>
          <el-input v-model="addForm.fromStation" />
        </el-form-item>
        <el-form-item label="到达站" required>
          <el-input v-model="addForm.toStation" />
        </el-form-item>
        <el-form-item label="出发时间">
          <el-input v-model="addForm.departTime" placeholder="如 08:00" />
        </el-form-item>
        <el-form-item label="到达时间">
          <el-input v-model="addForm.arriveTime" placeholder="如 10:30" />
        </el-form-item>
        <el-form-item label="运行时长">
          <el-input v-model="addForm.duration" placeholder="如 2小时30分" />
        </el-form-item>
        <el-divider>票型初始余票（二等/一等/商务/无座）</el-divider>
        <el-form-item label="二等座价/余">
          <el-input-number v-model="addForm.p2" :min="1" /> /
          <el-input-number v-model="addForm.s2" :min="0" />
        </el-form-item>
        <el-form-item label="一等座价/余">
          <el-input-number v-model="addForm.p1" :min="1" /> /
          <el-input-number v-model="addForm.s1" :min="0" />
        </el-form-item>
        <el-form-item label="商务座价/余">
          <el-input-number v-model="addForm.pb" :min="1" /> /
          <el-input-number v-model="addForm.sb" :min="0" />
        </el-form-item>
        <el-form-item label="无座余票">
          <el-input-number v-model="addForm.sn" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchAdminTrainManifest, adminCreateTrain, adminDeleteTrain } from '../../api/admin.js'
import { ENABLE_MOCK } from '../../api/config.js'
import {
  addCustomTrain,
  deleteTrainById,
  removeCustomTrain,
  getCustomTrains,
  seats
} from '../../data/mockTrainSchedule.js'

const loading = ref(false)
const err = ref('')
const list = ref([])
const dialogVisible = ref(false)
const addForm = reactive({
  trainNo: '',
  trainId: '',
  fromStation: '',
  toStation: '',
  departTime: '08:00',
  arriveTime: '10:00',
  duration: '2小时',
  p2: 200,
  p1: 320,
  pb: 600,
  s2: 50,
  s1: 10,
  sb: 2,
  sn: 80
})

async function load() {
  loading.value = true
  err.value = ''
  try {
    const res = await fetchAdminTrainManifest()
    list.value = res.data || []
  } catch (e) {
    err.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openAdd() {
  dialogVisible.value = true
}

function resetForm() {
  addForm.trainNo = ''
  addForm.trainId = ''
  addForm.fromStation = ''
  addForm.toStation = ''
  addForm.departTime = '08:00'
  addForm.arriveTime = '10:00'
  addForm.duration = '2小时'
  addForm.p2 = 200
  addForm.p1 = 320
  addForm.pb = 600
  addForm.s2 = 50
  addForm.s1 = 10
  addForm.sb = 2
  addForm.sn = 80
}

async function submitAdd() {
  const id = addForm.trainId.trim()
  const no = addForm.trainNo.trim()
  if (!id || !no || !addForm.fromStation.trim() || !addForm.toStation.trim()) {
    ElMessage.warning('请填写车次号、ID、出发到达站')
    return
  }
  const all = [...list.value]
  if (all.some((t) => t.trainId === id)) {
    ElMessage.warning('车次ID已存在')
    return
  }
  if (!ENABLE_MOCK) {
    try {
      await adminCreateTrain({
        trainId: id,
        trainNo: no,
        fromStation: addForm.fromStation.trim(),
        toStation: addForm.toStation.trim(),
        departTime: addForm.departTime.trim(),
        arriveTime: addForm.arriveTime.trim(),
        duration: addForm.duration.trim() || '—',
        p2: addForm.p2,
        p1: addForm.p1,
        pb: addForm.pb,
        s2: addForm.s2,
        s1: addForm.s1,
        sb: addForm.sb,
        sn: addForm.sn
      })
      ElMessage.success('已添加')
      dialogVisible.value = false
      load()
    } catch (e) {
      ElMessage.error(e.message || '添加失败')
    }
    return
  }
  const row = {
    trainId: id,
    trainNo: no,
    fromStation: addForm.fromStation.trim(),
    toStation: addForm.toStation.trim(),
    departTime: addForm.departTime.trim(),
    arriveTime: addForm.arriveTime.trim(),
    duration: addForm.duration.trim() || '—',
    seatTypes: seats(
      addForm.p2,
      addForm.p1,
      addForm.pb,
      addForm.s2,
      addForm.s1,
      addForm.sb,
      addForm.sn
    )
  }
  addCustomTrain(row)
  ElMessage.success('已添加')
  dialogVisible.value = false
  load()
}

async function remove(row) {
  try {
    await ElMessageBox.confirm(`确定删除车次 ${row.trainNo}？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  if (!ENABLE_MOCK) {
    try {
      await adminDeleteTrain(row.trainId)
      ElMessage.success('已删除')
      load()
    } catch (e) {
      ElMessage.error(e.message || '删除失败')
    }
    return
  }
  const custom = getCustomTrains().some((t) => t.trainId === row.trainId)
  if (custom) {
    removeCustomTrain(row.trainId)
  } else {
    deleteTrainById(row.trainId)
  }
  ElMessage.success('已删除')
  load()
}
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
.mb {
  margin-bottom: 12px;
}
.err {
  margin-top: 12px;
  color: #f56c6c;
}
</style>
