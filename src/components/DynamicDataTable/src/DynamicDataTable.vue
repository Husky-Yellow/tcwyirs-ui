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
      <div>
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
            <el-input
              v-model="row[column.key]"
              :placeholder="column.placeholder || '请输入'"
              size="default"
              :class="{ 'is-error': validationErrors[`${rowIndex}-${column.key}`] }"
              @blur="validateField(rowIndex, column)"
              @input="() => clearError(rowIndex, column.key)"
            />
            <div
              v-if="validationErrors[`${rowIndex}-${column.key}`]"
              class="mt-4px text-12px text-red-500"
            >
              {{ validationErrors[`${rowIndex}-${column.key}`] }}
            </div>
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
      </div>

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
import { ref, watch, reactive } from 'vue'
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

// 本地数据
const localData = ref<TableRow[]>([])

// 验证错误
const validationErrors = reactive<Record<string, string>>({})

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

// 验证单个字段
const validateField = (rowIndex: number, column: TableColumn): boolean => {
  const key = `${rowIndex}-${column.key}`
  const value = localData.value[rowIndex][column.key]
  const row = localData.value[rowIndex]

  // 清除之前的错误
  delete validationErrors[key]

  // 必填验证
  if (column.required && (!value || value.toString().trim() === '')) {
    validationErrors[key] = `${column.label}不能为空`
    return false
  }

  // 自定义验证
  if (column.validator) {
    const result = column.validator(value, row)
    if (result !== true) {
      validationErrors[key] = result as string
      return false
    }
  }

  return true
}

// 验证所有字段
const validateAll = (): boolean => {
  let isValid = true
  localData.value.forEach((row, rowIndex) => {
    props.columns.forEach((column) => {
      if (!validateField(rowIndex, column)) {
        isValid = false
      }
    })
  })
  return isValid
}

// 清除错误
const clearError = (rowIndex: number, columnKey: string) => {
  const key = `${rowIndex}-${columnKey}`
  delete validationErrors[key]
}

// 清除所有错误
const clearAllErrors = () => {
  Object.keys(validationErrors).forEach((key) => {
    delete validationErrors[key]
  })
}

// 新增行
const addRow = () => {
  localData.value.push(createEmptyRow())
  emitChange()
}

// 删除行
const deleteRow = (index: number) => {
  // 清除该行的所有验证错误
  props.columns.forEach((column) => {
    const key = `${index}-${column.key}`
    delete validationErrors[key]
  })

  // 如果是最后一行，只清空数据，不删除行
  if (isLastRow(index)) {
    localData.value[index] = createEmptyRow()
  } else {
    // 不是最后一行，删除整行
    localData.value.splice(index, 1)

    // 更新后续行的验证错误键
    const newErrors: Record<string, string> = {}
    Object.keys(validationErrors).forEach((key) => {
      const [rowIdx, colKey] = key.split('-')
      const rowIndex = parseInt(rowIdx)
      if (rowIndex > index) {
        newErrors[`${rowIndex - 1}-${colKey}`] = validationErrors[key]
      } else if (rowIndex < index) {
        newErrors[key] = validationErrors[key]
      }
    })
    Object.keys(validationErrors).forEach((key) => delete validationErrors[key])
    Object.assign(validationErrors, newErrors)
  }
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
