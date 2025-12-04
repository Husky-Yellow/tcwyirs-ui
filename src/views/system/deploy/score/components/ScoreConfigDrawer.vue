<template>
  <Drawer v-model="visible" title="配置仪表盘" size="524px" @close="handleClose">
    <el-form label-position="top" class="!p-0">
      <!-- 标签分类 -->
      <el-form-item label="标签分类">
        <el-input v-model="formData.category" placeholder="请输入" disabled />
      </el-form-item>

      <!-- 标签分数 -->
      <el-form-item label="标签分数">
        <el-radio-group v-model="formData.scoreDirection" class="w-full">
          <el-radio label="up" class="!mb-8px">上升</el-radio>
          <el-radio label="down">下降</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 高权重分数 -->
      <el-form-item label="高权重分数">
        <el-input-number
          v-model="formData.highWeight"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>

      <!-- 中权重分数 -->
      <el-form-item label="中权重分数">
        <el-input-number
          v-model="formData.mediumWeight"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>

      <!-- 低权重分数 -->
      <el-form-item label="低权重分数">
        <el-input-number
          v-model="formData.lowWeight"
          :min="0"
          :max="100"
          class="w-full"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Drawer } from '@/components/Drawer'

defineOptions({ name: 'ScoreConfigDrawer' })

export interface ScoreConfig {
  category: string
  scoreDirection: 'up' | 'down'
  highWeight: number
  mediumWeight: number
  lowWeight: number
}

interface Emits {
  (e: 'confirm', data: ScoreConfig): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)

const defaultFormData: ScoreConfig = {
  category: '标签分类',
  scoreDirection: 'up',
  highWeight: 10,
  mediumWeight: 5,
  lowWeight: 2
}

const formData = ref<ScoreConfig>({ ...defaultFormData })

// 暴露给父组件的 open 方法
const open = (config?: Partial<ScoreConfig>) => {
  if (config) {
    formData.value = { ...defaultFormData, ...config }
  } else {
    formData.value = { ...defaultFormData }
  }
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

const handleConfirm = () => {
  emit('confirm', formData.value)
  visible.value = false
}
</script>
