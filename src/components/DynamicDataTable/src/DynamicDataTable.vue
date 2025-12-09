<template>
  <div class="w-full rd-4px">
    <!-- 标题 -->
    <div class="mb-12px text-14px text-[#303133] font-500">{{ title }}</div>

    <!-- 表格 -->
    <div class="overflow-hidden rd-4px bg-white">
      <!-- 表头 -->
      <div class="flex border-b border-[#ebeef5] border-solid bg-[#f5f7fa] p-x-16px p-y-12px">
        <div
          v-for="column in columns"
          :key="column.key"
          class="flex-1 text-14px text-[#909399] font-500"
        >
          {{ column.label }}
          <span v-if="column.required" class="text-red-500">*</span>
        </div>
        <div class="w-80px flex-shrink-0 text-center text-14px text-[#909399] font-500">
          操作
        </div>
      </div>

      <!-- 表格内容 -->
      <el-form ref="formRef" :model="{ localData }">
        <div
          v-for="(row, rowIndex) in localData"
          :key="rowIndex"
          class="flex border-b border-[#ebeef5] border-solid p-x-16px p-y-12px last:border-b-0"
        >
          <!-- 数据列 -->
          <div
            v-for="column in columns"
            :key="column.key"
            class="flex-1 pr-12px"
          >
            <el-form-item
              :prop="`localData.${rowIndex}.${column.key}`"
              :rules="getFieldRules(column, rowIndex)"
              class="!mb-0"
            >
              <el-input
                v-model="row[column.key]"
                :placeholder="column.placeholder || '请输入'"
                size="default"
              />
            </el-form-item>
          </div>

          <!-- 操作列 -->
          <div class="w-80px flex flex-shrink-0 items-center">
            <el-button
              link
              type="danger"
              size="small"
              @click="deleteRow(rowIndex)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-form>

      <!-- 新增行按钮 -->
      <div class="border-t border-[#ebeef5] border-solid p-x-16px p-y-12px text-center">
        <el-button link type="primary" @click="addRow">
          <Icon icon="ep:plus" class="mr-5px" />
          新增一行
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { Icon } from '@/components/Icon'

export interface TableColumn {
  key: string
  label: string
  width?: string
  placeholder?: string
  required?: boolean
  validator?: (value: any, row: TableRow) => string | true
}

export interface TableRow {
  [key: string]: any
}

interface Props {
  modelValue?: TableRow[]
  columns?: TableColumn[]
  title?: string
  minRows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  columns: () => [
    { key: 'col1', label: '标题名称', required: true },
    { key: 'col2', label: '标题名称', required: false },
    { key: 'col3', label: '标题名称', required: false }
  ],
  title: '数据库表格式',
  minRows: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TableRow[]): void
  (e: 'change', value: TableRow[]): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 本地数据
const localData = ref<TableRow[]>([])

// 初始化数据
const initData = () => {
  if (props.modelValue && props.modelValue.length > 0) {
    localData.value = JSON.parse(JSON.stringify(props.modelValue))
  } else {
    // 默认至少有一行空数据
    localData.value = [createEmptyRow()]
  }
}

// 创建空行
const createEmptyRow = (): TableRow => {
  const row: TableRow = {}
  props.columns.forEach((col) => {
    row[col.key] = ''
  })
  return row
}

// 判断是否是最后一行
const isLastRow = (index: number): boolean => {
  return localData.value.length <= props.minRows || index === localData.value.length - 1
}

// 获取字段验证规则
const getFieldRules = (column: TableColumn, rowIndex: number): FormItemRule[] => {
  const rules: FormItemRule[] = []

  // 必填验证
  if (column.required) {
    rules.push({
      required: true,
      message: `${column.label}不能为空`,
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (!value || value.toString().trim() === '') {
          callback(new Error(`${column.label}不能为空`))
        } else {
          callback()
        }
      }
    })
  }

  // 自定义验证
  if (column.validator) {
    rules.push({
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        const row = localData.value[rowIndex]
        const result = column.validator!(value, row)
        if (result === true) {
          callback()
        } else {
          callback(new Error(result as string))
        }
      }
    })
  }

  return rules
}

// 验证所有字段
const validateAll = async (): Promise<boolean> => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 清除所有验证错误
const clearAllErrors = () => {
  formRef.value?.clearValidate()
}

// 新增行
const addRow = () => {
  localData.value.push(createEmptyRow())
  emitChange()
}

// 删除行
const deleteRow = (index: number) => {
  // 如果是最后一行，只清空数据，不删除行
  if (isLastRow(index)) {
    localData.value[index] = createEmptyRow()
  } else {
    // 不是最后一行，删除整行
    localData.value.splice(index, 1)
  }

  // 清除表单验证状态
  formRef.value?.clearValidate()
  emitChange()
}

// 触发更新
const emitChange = () => {
  emit('update:modelValue', localData.value)
  emit('change', localData.value)
}

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
      initData()
      clearAllErrors()
    }
  },
  { deep: true }
)

// 初始化
initData()

// 暴露方法给父组件
defineExpose({
  getData: () => localData.value,
  setData: (data: TableRow[]) => {
    localData.value = data
    clearAllErrors()
    emitChange()
  },
  addRow,
  deleteRow,
  validate: validateAll,
  clearErrors: clearAllErrors
})
</script>
