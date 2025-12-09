<template>
  <div class="dynamic-tree-table">
    <!-- 标题 -->
    <div v-if="title" class="table-title">{{ title }}</div>

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
        <template v-for="(row, rowIndex) in flattenData" :key="row._key">
          <div class="table-row">
            <!-- 数据列 -->
            <div
              v-for="(column, colIndex) in columns"
              :key="column.key"
              :style="{ width: column.width || 'auto' }"
              class="body-cell"
              :class="{ 'first-cell': colIndex === 0 }"
            >
              <!-- 第一列显示展开/折叠图标和缩进 -->
              <div v-if="colIndex === 0" class="flex items-center w-full">
                <!-- 缩进 -->
                <span :style="{ width: `${row._level * 20}px` }" class="indent-space"></span>

                <!-- 展开/折叠按钮 -->
                <el-button
                  v-if="row.children && row.children.length > 0"
                  link
                  size="small"
                  class="expand-btn"
                  @click="toggleExpand(row)"
                >
                  <Icon
                    :icon="row._expanded ? 'ep:arrow-down' : 'ep:arrow-right'"
                    class="text-12px"
                  />
                </el-button>
                <span v-else class="expand-placeholder"></span>

                <!-- 输入框 -->
                <component
                  :is="getInputComponent(column)"
                  v-model="row[column.key]"
                  v-bind="getInputProps(column, row)"
                  class="flex-1"
                  @change="handleInput"
                />
              </div>
              <!-- 其他列 -->
              <component
                v-else
                :is="getInputComponent(column)"
                v-model="row[column.key]"
                v-bind="getInputProps(column, row)"
                @change="handleInput"
              />
            </div>

            <!-- 操作列 -->
            <div class="body-cell operation-cell">
              <el-button
                link
                type="primary"
                size="small"
                @click="addChildRow(row)"
              >
                添加下级
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="deleteRow(row)"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </div>

      <!-- 新增行按钮 -->
      <div class="table-footer">
        <el-button class="add-row-btn" @click="addRootRow">
          <Icon icon="ep:plus" class="mr-5px text-14px" />
          新增一行
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@/components/Icon'

export interface TableColumn {
  key: string
  label: string
  width?: string
  placeholder?: string
  /** 输入类型：input, select, number */
  type?: 'input' | 'select' | 'number'
  /** select 选项 */
  options?: Array<{ label: string; value: any }>
  /** 其他组件属性 */
  componentProps?: Record<string, any>
}

export interface TreeTableRow {
  [key: string]: any
  children?: TreeTableRow[]
  _key?: string
  _level?: number
  _expanded?: boolean
  _parent?: TreeTableRow | null
}

interface Props {
  modelValue?: TreeTableRow[]
  columns?: TableColumn[]
  title?: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  columns: () => [],
  title: '',
  defaultExpanded: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TreeTableRow[]): void
  (e: 'change', value: TreeTableRow[]): void
}>()

// 本地数据
const localData = ref<TreeTableRow[]>([])
let keyCounter = 0

// 生成唯一 key
const generateKey = () => {
  return `row_${Date.now()}_${keyCounter++}`
}

// 获取输入组件
const getInputComponent = (column: TableColumn) => {
  switch (column.type) {
    case 'select':
      return 'el-select'
    case 'number':
      return 'el-input-number'
    default:
      return 'el-input'
  }
}

// 获取输入组件属性
const getInputProps = (column: TableColumn, row: TreeTableRow) => {
  const baseProps: any = {
    placeholder: column.placeholder || '请输入',
    clearable: true,
    size: 'default'
  }

  if (column.type === 'number') {
    baseProps.controlsPosition = 'right'
    baseProps.class = 'w-full'
  }

  // 合并自定义属性
  return { ...baseProps, ...column.componentProps }
}

// 初始化数据
const initData = () => {
  if (props.modelValue && props.modelValue.length > 0) {
    localData.value = JSON.parse(JSON.stringify(props.modelValue))
    processTreeData(localData.value, null, 0)
  } else {
    // 默认至少有一行空数据
    localData.value = [createEmptyRow(null, 0)]
  }
}

// 处理树形数据（添加内部属性）
const processTreeData = (data: TreeTableRow[], parent: TreeTableRow | null, level: number) => {
  data.forEach((item) => {
    item._key = item._key || generateKey()
    item._level = level
    item._expanded = item._expanded !== undefined ? item._expanded : props.defaultExpanded
    item._parent = parent
    if (item.children && item.children.length > 0) {
      processTreeData(item.children, item, level + 1)
    }
  })
}

// 创建空行
const createEmptyRow = (parent: TreeTableRow | null, level: number): TreeTableRow => {
  const row: TreeTableRow = {
    _key: generateKey(),
    _level: level,
    _expanded: true,
    _parent: parent,
    children: []
  }
  props.columns.forEach((col) => {
    row[col.key] = ''
  })
  return row
}

// 扁平化树形数据（用于渲染）
const flattenData = computed(() => {
  const result: TreeTableRow[] = []

  const flatten = (data: TreeTableRow[]) => {
    data.forEach((item) => {
      result.push(item)
      if (item._expanded && item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }

  flatten(localData.value)
  return result
})

// 展开/折叠
const toggleExpand = (row: TreeTableRow) => {
  row._expanded = !row._expanded
}

// 新增根级行
const addRootRow = () => {
  localData.value.push(createEmptyRow(null, 0))
  emitChange()
}

// 添加子行
const addChildRow = (parentRow: TreeTableRow) => {
  if (!parentRow.children) {
    parentRow.children = []
  }
  const childRow = createEmptyRow(parentRow, (parentRow._level || 0) + 1)
  parentRow.children.push(childRow)
  parentRow._expanded = true // 自动展开父节点
  emitChange()
}

// 删除行
const deleteRow = (row: TreeTableRow) => {
  const parent = row._parent
  const targetArray = parent ? parent.children! : localData.value

  const index = targetArray.findIndex((item) => item._key === row._key)
  if (index !== -1) {
    targetArray.splice(index, 1)
  }

  // 如果是最后一行根节点，保留一个空行
  if (!parent && localData.value.length === 0) {
    localData.value = [createEmptyRow(null, 0)]
  }

  emitChange()
}

// 输入变化
const handleInput = () => {
  emitChange()
}

// 清理内部属性
const cleanInternalProps = (data: TreeTableRow[]): TreeTableRow[] => {
  return data.map((item) => {
    const cleaned: TreeTableRow = { ...item }
    delete cleaned._key
    delete cleaned._level
    delete cleaned._expanded
    delete cleaned._parent

    if (cleaned.children && cleaned.children.length > 0) {
      cleaned.children = cleanInternalProps(cleaned.children)
    } else {
      delete cleaned.children
    }

    return cleaned
  })
}

// 触发更新
const emitChange = () => {
  const cleanedData = cleanInternalProps(JSON.parse(JSON.stringify(localData.value)))
  emit('update:modelValue', cleanedData)
  emit('change', cleanedData)
}

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    const currentClean = cleanInternalProps(JSON.parse(JSON.stringify(localData.value)))
    if (JSON.stringify(newVal) !== JSON.stringify(currentClean)) {
      initData()
    }
  },
  { deep: true }
)

// 初始化
initData()

// 暴露方法给父组件
defineExpose({
  getData: () => cleanInternalProps(JSON.parse(JSON.stringify(localData.value))),
  setData: (data: TreeTableRow[]) => {
    localData.value = JSON.parse(JSON.stringify(data))
    processTreeData(localData.value, null, 0)
    emitChange()
  },
  addRootRow,
  addChildRow,
  deleteRow
})
</script>

<style scoped lang="scss">
.dynamic-tree-table {
  width: 100%;

  .table-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }

  .table-container {
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
  }

  .table-header {
    display: flex;
    background: #fafafa;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;

    .header-cell {
      flex: 1;
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      padding: 0 8px;

      &.operation-cell {
        flex: 0 0 160px;
        text-align: center;
      }
    }
  }

  .table-body {
    .table-row {
      display: flex;
      padding: 8px 16px;
      border-bottom: 1px solid #ebeef5;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      &:last-child {
        border-bottom: none;
      }

      .body-cell {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 8px;

        &.first-cell {
          padding-left: 0;
        }

        &.operation-cell {
          flex: 0 0 160px;
          justify-content: center;
          gap: 12px;
        }

        .indent-space {
          display: inline-block;
          flex-shrink: 0;
        }

        .expand-btn {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          padding: 0;
          margin-right: 4px;
          min-height: unset;

          :deep(.el-icon) {
            margin: 0;
          }
        }

        .expand-placeholder {
          display: inline-block;
          width: 20px;
          margin-right: 4px;
          flex-shrink: 0;
        }

        :deep(.el-input),
        :deep(.el-select),
        :deep(.el-input-number) {
          width: 100%;
        }

        :deep(.el-select) {
          .el-input__wrapper {
            box-shadow: 0 0 0 1px #dcdfe6 inset;
          }
        }
      }
    }
  }

  .table-footer {
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    background: #fafafa;

    .add-row-btn {
      width: 100%;
      border: 1px dashed #dcdfe6;
      background: transparent;
      color: #606266;
      font-size: 14px;
      height: 36px;

      &:hover {
        border-color: #409eff;
        color: #409eff;
        background: #ecf5ff;
      }
    }
  }
}
</style>
