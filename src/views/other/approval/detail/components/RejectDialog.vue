<template>
  <el-dialog v-model="visible" title="驳回申请" width="500px" @close="handleClose">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="驳回原因:" required>
        <el-input
          v-model="formData.rejectReason"
          type="textarea"
          :rows="4"
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { ApprovalActionVO } from '@/api/resource/approval'

const props = defineProps<{
  modelValue: boolean
  applyId?: number | string
  applyType?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [data: ApprovalActionVO]
}>()

const visible = ref(false)
const loading = ref(false)
const formData = ref<ApprovalActionVO>({
  id: props.applyId,
  rejectReason: ''
})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    // 重置表单
    formData.value = {
      id: props.applyId,
      rejectReason: ''
    }
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (!formData.value.rejectReason?.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  formData.value.type = props.applyType
  emit('confirm', formData.value)
}

defineExpose({
  setLoading: (value: boolean) => {
    loading.value = value
  }
})
</script>
