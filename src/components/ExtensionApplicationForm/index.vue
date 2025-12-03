<template>
  <Drawer
    v-model="drawerVisible"
    title="延期申请"
    size="500px"
    direction="rtl"
    :before-close="handleClose"
    class="extension-drawer"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="auto"
      label-position="top"
    >
      <!-- 关联项目 -->
      <el-form-item label="关联项目" prop="projectId" required>
        <el-select
          v-model="formData.projectId"
          placeholder="项目名称"
          class="w-full"
          clearable
        >
          <el-option
            v-for="project in projectList"
            :key="project.value"
            :label="project.label"
            :value="project.value"
          />
        </el-select>
      </el-form-item>

      <!-- 时间范围 -->
      <el-form-item label="时间范围" prop="dateRange" required>
        <el-date-picker
          v-model="formData.dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="2025-06-20"
          end-placeholder="2025-09-20"
          class="w-full"
        />
      </el-form-item>

      <!-- 申请说明 -->
      <el-form-item label="申请说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="项目需求增加使用这资源"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- 可展开/收起的记录区域 -->
      <div class="mt-16px rd-6px bg-[var(--el-fill-color-lighter)] p-16px">
        <div class="mb-12px text-14px text-[var(--el-text-color-primary)] font-600">
          近一年年额通行额算记录
        </div>
        <div
          class="overflow-hidden transition-all duration-300"
          :class="isExpanded ? 'max-h-200px' : 'max-h-60px'"
        >
          <p class="m-0 text-13px text-[var(--el-text-color-regular)]">
            实时数据 Pulsar 消息堆送基于 Apache Pulsar
            分布式消息系统，能实现高吞吐、低延迟的实时数据推送。其支持多租户隔离与灵活的 Topic
            分隔机制，可场景动态扩缩容，轻松应对海量数据流动中。通过分区
          </p>
        </div>
        <div
          class="mt-12px flex cursor-pointer select-none items-center justify-center border-t border-t-[var(--el-border-color-lighter)] pt-12px hover:children:text-[var(--el-color-primary)]"
          @click="toggleExpand"
        >
          <span class="mr-4px text-14px text-[var(--el-text-color-regular)] transition-colors">
            {{ isExpanded ? '收起' : '展开' }}
          </span>
          <Icon
            :icon="isExpanded ? 'ep:arrow-up' : 'ep:arrow-down'"
            class="text-14px text-[var(--el-text-color-secondary)] transition-colors"
          />
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Drawer } from '@/components/Drawer'

interface ExtensionFormData {
  projectId: string | number
  dateRange: [string, string] | []
  description: string
}

interface ProjectOption {
  label: string
  value: string | number
}

interface Props {
  projectList?: ProjectOption[]
}

const props = withDefaults(defineProps<Props>(), {
  projectList: () => [
    { label: '项目A', value: 1 },
    { label: '项目B', value: 2 },
    { label: '项目C', value: 3 }
  ]
})

const emit = defineEmits<{
  submit: [data: ExtensionFormData]
  close: []
}>()

// 抽屉显示状态
const drawerVisible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<ExtensionFormData>({
  projectId: '',
  dateRange: [],
  description: ''
})

// 表单验证规则
const formRules: FormRules = {
  projectId: [{ required: true, message: '请选择关联项目', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择时间范围', trigger: 'change' }]
}

// 展开/收起状态
const isExpanded = ref(false)

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 打开抽屉
const open = () => {
  drawerVisible.value = true
}

// 关闭抽屉
const close = () => {
  drawerVisible.value = false
  emit('close')
  // 重置表单
  formRef.value?.resetFields()
  isExpanded.value = false
}

const handleClose = () => {
  close()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData })
      close()
    }
  })
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<script lang="ts">
export default {
  name: 'ExtensionApplicationForm'
}
</script>