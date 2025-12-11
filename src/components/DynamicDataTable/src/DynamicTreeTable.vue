<template>
  <div class="w-full">
    <!-- 标题 -->
    <div v-if="title" class="text-16px font-600 text-#303133 mb-16px">{{ title }}</div>

    <!-- 表格 -->
    <div class="bg-#fafafa border border-#ebeef5 border-rd-4px overflow-x-auto overflow-y-hidden">
      <!-- 表头 -->
      <div class="table-header flex bg-#fafafa px-16px py-16px border-b border-#ebeef5 relative">
        <div
          v-for="column in columns"
          :key="column.key"
          :style="column.width ? { width: column.width, minWidth: column.width, flex: `0 0 ${column.width}` } : { flex: 1 }"
          class="header-cell text-14px text-#606266 font-500 px-8px"
        >
          {{ column.label }}
        </div>
        <div class="header-cell operation-cell text-center sticky right-0 bg-#fafafa z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] px-8px" style="width: 160px; min-width: 160px; flex: 0 0 160px;">操作</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <template v-for="(row, rowIndex) in flattenData" :key="row._key">
          <div class="table-row flex px-16px py-14px border-b border-#ebeef5 bg-white min-h-56px transition-background-color-200">
            <!-- 数据列 -->
            <div
              v-for="(column, colIndex) in columns"
              :key="column.key"
              :style="column.width ? { width: column.width, flex: '0 0 auto' } : { flex: 1 }"
              class="body-cell flex items-center px-8px bg-white transition-background-color-200"
              :class="{ 'pl-0': colIndex === 0 }"
            >
              <!-- 第一列显示展开/折叠图标和缩进 -->
              <div v-if="colIndex === 0" class="w-full flex items-center">
                <!-- 缩进 -->
                <span :style="{ width: `${row._level * 20}px` }" class="inline-block flex-shrink-0"></span>

                <!-- 展开/折叠按钮 -->
                <el-button
                  v-if="row.children && row.children.length > 0"
                  link
                  size="small"
                  class="expand-btn flex-shrink-0 w-20px h-20px p-0 mr-4px min-h-unset"
                  @click="toggleExpand(row)"
                >
                  <Icon
                    :icon="row._expanded ? 'ep:arrow-down' : 'ep:arrow-right'"
                    class="text-12px"
                  />
                </el-button>
                <span v-else class="inline-block w-20px mr-4px flex-shrink-0"></span>

                <!-- 输入框 -->
                <el-select
                  v-if="column.type === 'select'"
                  v-model="row[column.key]"
                  v-bind="getInputProps(column, row)"
                  class="flex-1"
                  @change="handleInput"
                >
                  <el-option
                    v-for="option in column.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <component
                  v-else
                  :is="getInputComponent(column)"
                  v-model="row[column.key]"
                  v-bind="getInputProps(column, row)"
                  class="flex-1"
                  @change="handleInput"
                />
              </div>
              <!-- 其他列 -->
              <el-select
                v-if="colIndex !== 0 && column.type === 'select'"
                v-model="row[column.key]"
                v-bind="getInputProps(column, row)"
                @change="handleInput"
              >
                <el-option
                  v-for="option in column.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <component
                v-else-if="colIndex !== 0"
                :is="getInputComponent(column)"
                v-model="row[column.key]"
                v-bind="getInputProps(column, row)"
                @change="handleInput"
              />
            </div>

            <!-- 操作列 -->
            <div class="body-cell operation-cell flex-0-0-160px flex items-center justify-center gap-12px sticky right-0 bg-white z-9 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] px-8px transition-background-color-200">
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
      <div class="px-16px py-12px border-t border-#ebeef5 bg-#fafafa">
        <el-button class="add-row-btn w-full border border-dashed border-#dcdfe6 bg-transparent text-#606266 text-14px h-36px" @click="addRootRow">
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

// 清理内部属性（深拷贝并移除内部属性）
const cleanInternalProps = (data: TreeTableRow[]): TreeTableRow[] => {
  return data.map((item) => {
    // 创建新对象，排除内部属性
    const cleaned: TreeTableRow = {}
    Object.keys(item).forEach((key) => {
      if (!key.startsWith('_') && key !== 'children') {
        cleaned[key] = item[key]
      }
    })

    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      cleaned.children = cleanInternalProps(item.children)
    }

    return cleaned
  })
}

// 触发更新
const emitChange = () => {
  // 先清理内部属性（避免循环引用），然后再序列化和反序列化进行深拷贝
  const cleanedData = cleanInternalProps(localData.value)
  emit('update:modelValue', cleanedData)
  emit('change', cleanedData)
}

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 先清理再比较，避免循环引用问题
    const currentClean = cleanInternalProps(localData.value)
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
  getData: () => cleanInternalProps(localData.value),
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
// Hover 状态
.table-row {
  &:hover {
    background-color: #f5f7fa !important;

    .body-cell {
      background-color: #f5f7fa !important;
    }

    .operation-cell {
      background-color: #f5f7fa !important;
    }
  }

  &:last-child {
    border-bottom: none;
  }
}

// 展开按钮内部样式
.expand-btn {
  :deep(.el-icon) {
    margin: 0;
  }
}

// 表单控件全宽
.body-cell {
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

// 新增按钮 hover 效果
.add-row-btn {
  &:hover {
    border-color: #409eff;
    color: #409eff;
    background: #ecf5ff;
  }
}
</style>
