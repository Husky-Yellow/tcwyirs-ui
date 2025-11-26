<template>
  <div class="dynamic-data-table">
    <!-- 标题 -->
    <div class="table-title">{{ title }}</div>

    <!-- 表格 -->
    <div class="table-container">
      <!-- 表头 -->
      <div class="table-header">
        <div v-for="column in columns" :key="column.key" :style="{ width: column.width || 'auto' }" class="header-cell">
          {{ column.label }}
        </div>
        <div class="header-cell operation-cell">操作</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div v-for="(row, rowIndex) in localData" :key="rowIndex" class="table-row">
          <!-- 数据列 -->
          <div
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width || 'auto' }"
            class="body-cell"
          >
            <el-input
              v-model="row[column.key]"
              :placeholder="column.placeholder || '请输入'"
              size="default"
              @input="handleInput"
            />
          </div>

          <!-- 操作列 -->
          <div class="body-cell operation-cell">
            <el-button
              link
              type="primary"
              @click="deleteRow(rowIndex)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 新增行按钮 -->
      <div class="table-footer">
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
import { Icon } from '@/components/Icon'

export interface TableColumn {
  key: string
  label: string
  width?: string
  placeholder?: string
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
    { key: 'col1', label: '标题名称', width: '30%' },
    { key: 'col2', label: '标题名称', width: '30%' },
    { key: 'col3', label: '标题名称', width: '30%' }
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
  emitChange()
}

// 输入变化
const handleInput = () => {
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
    emitChange()
  },
  addRow,
  deleteRow
})
</script>

<style scoped lang="scss">
.dynamic-data-table {
  width: 100%;
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;

  .table-title {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 12px;
  }

  .table-container {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    background: #f5f7fa;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;

    .header-cell {
      flex: 1;
      font-size: 14px;
      color: #909399;
      font-weight: 500;

      &.operation-cell {
        flex: 0 0 300px;
        text-align: left;
      }
    }
  }

  .table-body {
    .table-row {
      display: flex;
      padding: 12px 16px;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .body-cell {
        flex: 1;
        display: flex;
        align-items: center;

        &.operation-cell {
          flex: 0 0 300px;
          gap: 8px;

          .operation-tip {
            font-size: 12px;
            color: #409eff;
          }
        }

        :deep(.el-input) {
          width: 95%;
        }
      }
    }
  }

  .table-footer {
    padding: 12px 16px;
    text-align: center;
    border-top: 1px solid #ebeef5;

    .el-button {
      font-size: 14px;
    }
  }
}
</style>
