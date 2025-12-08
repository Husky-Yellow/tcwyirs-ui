<template>
  <Drawer v-model="visible" title="配置权重分数" size="524px" @close="handleClose">
    <el-form label-position="top" class="!p-0">
      <!-- 标签分类 -->
      <el-form-item label="起始分数">
        <el-input v-model="formData.initScore" placeholder="请输入" disabled />
      </el-form-item>

      <!-- 标签分数 -->
      <el-form-item label="权重分数设定">
        <el-radio-group v-model="formData.scoreType" class="w-full">
          <el-radio label="上升"  value="1">上升</el-radio>
          <el-radio label="下降"  value="2">下降</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 高权重分数 -->
      <el-form-item label="高权重分数">
        <el-input-number
          v-model="formData.highWeightScore"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>

      <!-- 中权重分数 -->
      <el-form-item label="中权重分数">
        <el-input-number
          v-model="formData.mediumWeightScore"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>

      <!-- 低权重分数 -->
      <el-form-item label="低权重分数">
        <el-input-number
          v-model="formData.lowWeightScore"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import { createScoreConfig, type ScoreConfigVO } from '@/api/resource/scoreConfig'

defineOptions({ name: 'ScoreConfigDrawer' })

export interface ScoreConfig {
  initScore: string
  scoreType: string
  highWeightScore: number
  mediumWeightScore: number
  lowWeightScore: number
}

interface Emits {
  (e: 'confirm', data: ScoreConfig): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const loading = ref(false)

const defaultFormData: ScoreConfig = {
  initScore: '60',
  scoreType: '1',
  highWeightScore: 10,
  mediumWeightScore: 5,
  lowWeightScore: 2
}

const formData = ref<ScoreConfig>({ ...defaultFormData })

// 暴露给父组件的 open 方法
const open = (config?: Partial<ScoreConfig>) => {
  formData.value = { ...config }
  visible.value = true
}

// 暴露给父组件的 close 方法
const close = () => {
  visible.value = false
}

defineExpose({
  open,
  close
})

const handleClose = () => {
  visible.value = false
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleConfirm = async () => {
  try {
    loading.value = true

    await createScoreConfig(formData.value)

    ElMessage.success('配置保存成功!')
    emit('confirm', formData.value)
    visible.value = false
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    loading.value = false
  }
}
</script>
