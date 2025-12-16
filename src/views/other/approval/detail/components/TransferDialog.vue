<template>
  <el-dialog v-model="visible" title="转交申请" width="500px" @close="handleClose">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="转交给:" required>
        <el-select v-model="formData.assigneeUserId" placeholder="请选择审批人" class="w-full">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转交原因:">
        <el-input
          v-model="formData.reason"
          type="textarea"
          :rows="3"
          placeholder="请输入转交原因（可选）"
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
import type { ApprovalTransferVO } from '@/api/resource/approval'
import type { UserVO } from '@/api/system/user'

const props = defineProps<{
  modelValue: boolean
  taskId?: string
  userList?: UserVO[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [data: ApprovalTransferVO]
}>()

// 表单数据类型
interface TransferFormData {
  assigneeUserId?: number
  reason?: string
}

const visible = ref(false)
const loading = ref(false)
const formData = ref<TransferFormData>({
  assigneeUserId: undefined,
  reason: ''
})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    // 重置表单
    formData.value = {
      assigneeUserId: undefined,
      reason: ''
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
  if (!formData.value.assigneeUserId) {
    ElMessage.warning('请选择转交对象')
    return
  }

  if (!props.taskId) {
    ElMessage.warning('缺少任务ID')
    return
  }

  // 提交转交参数：taskId, assigneeUserId, reason
  emit('confirm', {
    taskId: props.taskId,
    assigneeUserId: formData.value.assigneeUserId,
    reason: formData.value.reason
  } as ApprovalTransferVO)
}

defineExpose({
  setLoading: (value: boolean) => {
    loading.value = value
  }
})
</script>
