<template>
  <Drawer
    v-model="visible"
    :title="isEdit ? '编辑评分标签' : '新增评分标签'"
    size="524px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="!p-0">
      <!-- 标签名称 -->
      <el-form-item label="标签名称" prop="name" required>
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>

      <!-- 分数类型 -->
      <el-form-item label="分数类型" prop="type" required>
        <el-radio-group v-model="formData.type" class="w-full">
          <el-radio label="上升"  value="1">上升</el-radio>
          <el-radio label="下降"  value="2">下降</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 分数权重 -->
      <el-form-item label="分数权重" prop="weight" required>
        <el-select v-model="formData.weight" placeholder="请选择" class="w-full">
          <el-option label="高权重" value="1" />
          <el-option label="中权重" value="2" />
          <el-option label="低权重" value="3" />
        </el-select>
      </el-form-item>

      <!-- 是否启用评分标签 -->
      <el-form-item label="是否启用评分标签">
        <el-switch v-model="formData.showFlag" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Drawer } from '@/components/Drawer'

defineOptions({ name: 'TagFormDrawer' })

export interface TagFormData {
  id?: number
  name: string
  confId?: string
  type: '1' | '2' // 1-上升 2-下降
  weight: '1' | '2' | '3' // 1-高权重 2-中权重 3-低权重
  showFlag: boolean
  remark?: string
  score?: number
}

interface Emits {
  (e: 'confirm', data: TagFormData): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const visible = ref(false)
const isEdit = ref(false)

const defaultFormData: TagFormData = {
  name: '',
  confId: '1',
  type: '1',
  weight: '1',
  showFlag: true
}

const formData = ref<TagFormData>({ ...defaultFormData })

const rules: FormRules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分数类型', trigger: 'change' }],
  weight: [{ required: true, message: '请选择分数权重', trigger: 'change' }]
}

// 暴露给父组件的 open 方法
const open = (data?: TagFormData) => {
  if (data && data.id) {
    // 编辑模式
    isEdit.value = true
    formData.value = { ...data }
  } else {
    // 新增模式
    isEdit.value = false
    formData.value = { ...defaultFormData }
  }
  visible.value = true
  // 清除表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 暴露给父组件的 close 方法
const close = () => {
  visible.value = false
  formRef.value?.resetFields()
}

defineExpose({
  open,
  close
})

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
  formRef.value?.resetFields()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', { ...formData.value })
      visible.value = false
      formRef.value?.resetFields()
    }
  })
}
</script>
