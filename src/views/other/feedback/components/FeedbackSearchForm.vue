<template>
  <el-form
    class="-mb-15px"
    :model="modelValue"
    ref="formRef"
    :inline="true"
    label-width="68px"
    @submit.prevent
  >
    <el-form-item label="反馈名称" prop="title">
      <el-input
        v-model="modelValue.title"
        placeholder="请输入"
        clearable
        @keyup.enter="handleQuery"
        class="!w-240px"
      />
    </el-form-item>
    <el-form-item label="问题类型" prop="type">
      <el-select
        v-model="modelValue.type"
        placeholder="全部"
        clearable
        class="!w-240px"
      >
        <el-option label="Bug反馈" :value="FeedbackType.BUG" />
        <el-option label="功能建议" :value="FeedbackType.FEATURE" />
        <el-option label="体验优化" :value="FeedbackType.IMPROVEMENT" />
        <el-option label="其他问题" :value="FeedbackType.OTHER" />
      </el-select>
    </el-form-item>
    <el-form-item label="反馈状态" prop="status">
      <el-select
        v-model="modelValue.status"
        placeholder="全部"
        clearable
        class="!w-240px"
      >
        <el-option label="待处理" :value="FeedbackStatus.PENDING" />
        <el-option label="处理中" :value="FeedbackStatus.PROCESSING" />
        <el-option label="已处理" :value="FeedbackStatus.RESOLVED" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleReset">
        <Icon icon="ep:refresh" class="mr-5px" />
        重置
      </el-button>
      <el-button type="primary" @click="handleQuery">
        <Icon icon="ep:search" class="mr-5px" />
        查询
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { FeedbackStatus, FeedbackType, type FeedbackQueryParams } from '../types'

interface Props {
  modelValue: FeedbackQueryParams
}

interface Emits {
  (e: 'update:modelValue', value: FeedbackQueryParams): void
  (e: 'query'): void
  (e: 'reset'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const handleQuery = () => {
  emit('query')
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}
</script>
