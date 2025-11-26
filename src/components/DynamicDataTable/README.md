# DynamicDataTable 动态数据表格组件

可动态增删行的数据表格组件,支持自定义列配置和数据双向绑定。

## 功能特性

- ✅ 支持 v-model 双向绑定
- ✅ 动态增删行
- ✅ 自定义列配置
- ✅ 保护最后一行数据
- ✅ TypeScript 类型支持
- ✅ 暴露方法供父组件调用

## 基础用法

```vue
<template>
  <DynamicDataTable v-model="tableData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicDataTable } from '@/components/DynamicDataTable'
import type { TableRow } from '@/components/DynamicDataTable'

const tableData = ref<TableRow[]>([
  { col1: '标题1', col2: '标题2', col3: '标题3' },
  { col1: '标题4', col2: '标题5', col3: '标题6' }
])
</script>
```

## 自定义列配置

```vue
<template>
  <DynamicDataTable
    v-model="tableData"
    :columns="columns"
    title="自定义表格"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicDataTable } from '@/components/DynamicDataTable'
import type { TableColumn, TableRow } from '@/components/DynamicDataTable'

const columns: TableColumn[] = [
  { key: 'name', label: '名称', width: '25%', placeholder: '请输入名称' },
  { key: 'type', label: '类型', width: '25%', placeholder: '请输入类型' },
  { key: 'value', label: '值', width: '25%', placeholder: '请输入值' },
  { key: 'desc', label: '描述', width: '25%', placeholder: '请输入描述' }
]

const tableData = ref<TableRow[]>([])
</script>
```

## 监听数据变化

```vue
<template>
  <DynamicDataTable
    v-model="tableData"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicDataTable } from '@/components/DynamicDataTable'
import type { TableRow } from '@/components/DynamicDataTable'

const tableData = ref<TableRow[]>([])

const handleChange = (data: TableRow[]) => {
  console.log('表格数据变化:', data)
}
</script>
```

## 使用组件引用

```vue
<template>
  <div>
    <DynamicDataTable ref="tableRef" v-model="tableData" />

    <el-button @click="getData">获取数据</el-button>
    <el-button @click="setData">设置数据</el-button>
    <el-button @click="addRow">新增行</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicDataTable } from '@/components/DynamicDataTable'
import type { TableRow } from '@/components/DynamicDataTable'

const tableRef = ref()
const tableData = ref<TableRow[]>([])

// 获取表格数据
const getData = () => {
  const data = tableRef.value?.getData()
  console.log('当前数据:', data)
}

// 设置表格数据
const setData = () => {
  tableRef.value?.setData([
    { col1: '新数据1', col2: '新数据2', col3: '新数据3' }
  ])
}

// 新增一行
const addRow = () => {
  tableRef.value?.addRow()
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 表格数据(v-model) | `TableRow[]` | `[]` |
| columns | 列配置 | `TableColumn[]` | 默认3列 |
| title | 表格标题 | `string` | `'数据库表格式'` |
| minRows | 最小保留行数 | `number` | `1` |
| deleteTip | 删除提示文字 | `string` | `'保留最近一行数据,只能删除其他数据'` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 数据更新时触发 | `(data: TableRow[]) => void` |
| change | 数据变化时触发 | `(data: TableRow[]) => void` |

### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| getData | 获取当前表格数据 | - | `TableRow[]` |
| setData | 设置表格数据 | `data: TableRow[]` | - |
| addRow | 新增一行 | - | - |
| deleteRow | 删除指定行 | `index: number` | - |

### Types

#### TableColumn

```typescript
interface TableColumn {
  /** 列的唯一标识 */
  key: string
  /** 列标题 */
  label: string
  /** 列宽度 */
  width?: string
  /** 输入框占位符 */
  placeholder?: string
}
```

#### TableRow

```typescript
interface TableRow {
  [key: string]: any
}
```

## 实际应用场景

### 数据库字段配置

```vue
<template>
  <DynamicDataTable
    v-model="fields"
    :columns="fieldColumns"
    title="数据库字段配置"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRow } from '@/components/DynamicDataTable'

const fieldColumns: TableColumn[] = [
  { key: 'fieldName', label: '字段名', width: '30%', placeholder: '请输入字段名' },
  { key: 'fieldType', label: '字段类型', width: '30%', placeholder: '请输入类型' },
  { key: 'comment', label: '注释', width: '40%', placeholder: '请输入注释' }
]

const fields = ref<TableRow[]>([
  { fieldName: 'id', fieldType: 'bigint', comment: '主键ID' },
  { fieldName: 'name', fieldType: 'varchar(100)', comment: '名称' }
])
</script>
```

### 表单动态配置项

```vue
<template>
  <DynamicDataTable
    v-model="formConfig"
    :columns="configColumns"
    title="表单配置项"
    :min-rows="0"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRow } from '@/components/DynamicDataTable'

const configColumns: TableColumn[] = [
  { key: 'label', label: '标签', width: '25%' },
  { key: 'prop', label: '字段名', width: '25%' },
  { key: 'type', label: '类型', width: '25%' },
  { key: 'default', label: '默认值', width: '25%' }
]

const formConfig = ref<TableRow[]>([])
</script>
```
