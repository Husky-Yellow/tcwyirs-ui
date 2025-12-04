<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import { UploadImg } from '@/components/UploadFile'
import { createFeedback } from '@/api/resource/feedback'
import type { FeedbackVO } from '@/api/resource/feedback'

defineOptions({ name: 'FeedbackForm' })

interface FeedbackFormProps {
  /** 是否显示 */
  modelValue: boolean
  /** 关联资源ID（可选） */
  resourceId?: number
  /** 关联资源名称（可选） */
  resourceName?: string
}

const props = withDefaults(defineProps<FeedbackFormProps>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// 反馈类型选项
const FEEDBACK_TYPES = [
  { label: '功能问题', value: 1 },
  { label: '资源使用问题', value: 2 },
  { label: '操作与体验', value: 3 },
  { label: '内容与数据问题', value: 4 },
  { label: '其他问题', value: 5 }
] as const

// 表单引用
const formRef = ref()

// 提交加载状态
const submitting = ref(false)

// 表单数据（添加 screenshot 字段）
const formData = ref<Partial<FeedbackVO & { screenshot?: string }>>({
  type: 1,
  content: '',
  screenshot: '',
  resourceId: props.resourceId,
  resourceName: props.resourceName
})

// 表单验证规则
const formRules = {
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  content: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, message: '问题描述至少10个字符', trigger: 'blur' }
  ]
}

// 抽屉显示状态
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    type: 1,
    content: '',
    screenshot: '',
    resourceId: props.resourceId,
    resourceName: props.resourceName
  }
}

// 提交反馈
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true

    await createFeedback(formData.value as FeedbackVO)

    ElMessage.success('反馈提交成功，我们会尽快处理')
    emit('success')
    drawerVisible.value = false
    resetForm()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('提交失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  drawerVisible.value = false
  resetForm()
}

// 监听抽屉打开，同步资源信息
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      formData.value.resourceId = props.resourceId
      formData.value.resourceName = props.resourceName
    }
  }
)
</script>

<template>
  <Drawer
    v-model="drawerVisible"
    title="问题反馈"
    size="500px"
    direction="rtl"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="top"
    >
      <!-- 反馈类型 -->
      <ElFormItem label="反馈类型" prop="type">
        <ElSelect
          v-model="formData.type"
          placeholder="请选择反馈类型"
          class="w-full"
        >
          <ElOption
            v-for="item in FEEDBACK_TYPES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- 问题描述 -->
      <ElFormItem label="问题描述" prop="content">
        <ElInput
          v-model="formData.content"
          type="textarea"
          :rows="8"
          placeholder="请详细描述您遇到的问题或建议（至少10个字符）&#10;&#10;示例：&#10;• 问题发生的具体场景&#10;• 您期望的结果&#10;• 实际发生的情况"
          maxlength="500"
          show-word-limit
        />
      </ElFormItem>

      <!-- 问题截图 -->
      <ElFormItem label="问题截图（可选）">
        <UploadImg
          v-model="formData.screenshot"
          :file-size="5"
          :file-type="['image/jpeg', 'image/png', 'image/gif']"
          width="120px"
          height="120px"
        >
          <template #tip>
            <div class="text-12px text-[#909399]">
              支持 JPG、PNG、GIF 格式，大小不超过 5MB
            </div>
          </template>
        </UploadImg>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="handleSubmit">
        提交反馈
      </ElButton>
    </template>
  </Drawer>
</template>

<style lang="scss" scoped>
</style>
