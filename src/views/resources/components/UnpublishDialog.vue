<template>
  <el-dialog
    v-model="dialogVisible"
    title="下架资源"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="下架原因" prop="reason">
        <el-select
          v-model="formData.reason"
          placeholder="请选择下架原因"
          class="w-full"
        >
          <el-option label="资源更新" value="资源更新" />
          <el-option label="资源维护" value="资源维护" />
          <el-option label="暂停使用" value="暂停使用" />
          <el-option label="其他原因" value="其他原因" />
        </el-select>
      </el-form-item>

      <el-form-item label="下架时间" prop="time">
        <el-select
          v-model="formData.time"
          placeholder="请选择下架时间"
          class="w-full"
        >
          <el-option label="立即下架" value="0" />
          <el-option label="1天后" value="1" />
          <el-option label="2天后" value="2" />
          <el-option label="3天后" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="原因描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入原因描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface UnpublishFormData {
  reason: string
  time: string
  description: string
}

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<UnpublishFormData>({
  reason: '',
  time: '0',
  description: ''
})

const formRules: FormRules = {
  reason: [{ required: true, message: '请选择下架原因', trigger: 'change' }],
  time: [{ required: true, message: '请选择下架时间', trigger: 'change' }]
}

const emit = defineEmits<{
  (e: 'confirm', data: UnpublishFormData): void
}>()

// 打开弹窗
const open = () => {
  dialogVisible.value = true
  // 重置表单
  formData.reason = ''
  formData.time = '0'
  formData.description = ''
  formRef.value?.clearValidate()
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  submitLoading.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate()
  submitLoading.value = true

  try {
    emit('confirm', { ...formData })
  } catch (error) {
    console.error('提交失败:', error)
    submitLoading.value = false
  }
}

defineExpose({
  open,
  close: handleClose,
  setLoading: (loading: boolean) => {
    submitLoading.value = loading
  }
})
</script>
