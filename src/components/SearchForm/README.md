# SearchForm 组件

## 📍 组件位置

`src/components/SearchForm/`

## 🎯 功能说明

SearchForm 是一个自适应的搜索表单组件,支持多种表单控件,自动布局,并且可以展开/收起。

## ✨ 核心特性

### 1. 自适应网格布局
- ✅ 使用 CSS Grid 布局
- ✅ 一行最多显示 3 个搜索项 (可配置)
- ✅ 自动换行

### 2. 展开/收起功能
- ✅ 超过 3 个搜索项时自动显示展开按钮
- ✅ 收起时只显示前 2 个搜索项 (为按钮预留位置)
- ✅ 展开时显示所有搜索项
- ✅ 可配置默认展开状态

### 3. 按钮布局
- ✅ **重置**、**搜索**、**展开/收起** 按钮固定在右下角
- ✅ 按钮区域占据最后一列
- ✅ 使用 `grid-column: -1` 实现固定右侧

### 4. 支持多种表单组件
- ✅ **Input** - 文本输入框
- ✅ **Select** - 下拉选择器
- ✅ **DatePicker** - 日期选择器
- ✅ **DateRangePicker** - 日期范围选择器
- ✅ **TimePicker** - 时间选择器
- ✅ **InputNumber** - 数字输入框
- ✅ **slot** - 自定义插槽

## 📦 使用示例

### 基础用法

```vue
<template>
  <SearchForm
    :schema="searchSchema"
    :model="searchModel"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'

const searchModel = ref({
  keyword: '',
  category: '',
  status: ''
})

const searchSchema: SearchFormSchema[] = [
  {
    field: 'keyword',
    label: '关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词'
    }
  },
  {
    field: 'category',
    label: '分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择分类',
      options: [
        { label: '文档', value: 'doc' },
        { label: '项目', value: 'project' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' }
      ]
    }
  }
]

const handleSearch = (values) => {
  console.log('搜索参数:', values)
}

const handleReset = () => {
  console.log('重置搜索')
}
</script>
```

### 完整配置示例

```vue
<SearchForm
  :schema="searchSchema"
  :model="searchModel"
  :cols-per-row="3"
  :show-expand="true"
  :default-expanded="false"
  :label-width="'100px'"
  :show-search="true"
  :show-reset="true"
  @search="handleSearch"
  @reset="handleReset"
/>
```

## 🔧 Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| schema | 搜索表单配置数组 | `SearchFormSchema[]` | `[]` (必填) |
| model | 表单数据对象 | `Recordable` | `{}` |
| colsPerRow | 每行显示的搜索项数量 | `number` | `3` |
| showExpand | 是否显示展开/收起按钮 | `boolean` | `true` |
| defaultExpanded | 默认是否展开 | `boolean` | `false` |
| labelWidth | label 宽度 | `string` | `'100px'` |
| showSearch | 是否显示搜索按钮 | `boolean` | `true` |
| showReset | 是否显示重置按钮 | `boolean` | `true` |

## 📤 Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| search | 点击搜索按钮时触发 | `(values: Recordable)` |
| reset | 点击重置按钮时触发 | `()` |

## 📝 SearchFormSchema 配置

```typescript
interface SearchFormSchema {
  // 字段名
  field: string
  // 标签
  label: string
  // 组件类型
  component: 'Input' | 'Select' | 'DatePicker' | 'DateRangePicker' | 'TimePicker' | 'InputNumber' | 'slot'
  // 组件属性
  componentProps?: {
    placeholder?: string
    options?: Array<{ label: string; value: any }>
    [key: string]: any
  }
  // 表单验证规则
  rules?: Array<any>
  // 默认值
  defaultValue?: any
}
```

## 🎨 布局说明

### 收起状态 (默认)
```
┌──────────────┬──────────────┬──────────────────────────┐
│  搜索项 1    │  搜索项 2    │  [重置] [搜索] [展开↓]   │
└──────────────┴──────────────┴──────────────────────────┘
```

### 展开状态 (超过3个时)
```
┌──────────────┬──────────────┬──────────────┐
│  搜索项 1    │  搜索项 2    │  搜索项 3    │
├──────────────┼──────────────┼──────────────┤
│  搜索项 4    │  搜索项 5    │  按钮区域    │
└──────────────┴──────────────┴──────────────┘
                                ↑
                        [重置] [搜索] [收起↑]
```

## 🔑 暴露方法

通过 `ref` 可以调用以下方法:

```vue
<template>
  <SearchForm ref="searchFormRef" :schema="searchSchema" />
</template>

<script setup>
const searchFormRef = ref()

// 调用方法
searchFormRef.value.validate()      // 验证表单
searchFormRef.value.resetFields()   // 重置表单
searchFormRef.value.getFormData()   // 获取表单数据
searchFormRef.value.setFormData({   // 设置表单数据
  keyword: 'test'
})
</script>
```

## 💡 使用场景

1. **列表页搜索** - 常见的数据列表页面搜索条件
2. **高级筛选** - 多条件组合筛选
3. **数据查询** - 复杂的查询表单
4. **报表筛选** - 报表页面的日期范围、状态等筛选

## 🎯 设计亮点

### 1. 智能收起
当搜索项超过 `colsPerRow` 时:
- 自动显示展开按钮
- 收起时保留前 `colsPerRow - 1` 个搜索项 (为按钮预留位置)

### 2. 按钮固定右下角
使用 CSS Grid 的 `grid-column: -1` 特性:
- 按钮区域始终在最后一列
- 无论有多少搜索项,按钮位置固定

### 3. 响应式布局
- Grid 自动换行
- 每个搜索项占据相同宽度
- 间距统一 (16px)

## 🔄 与项目中 Search 组件的区别

| 特性 | SearchForm (新) | Search (旧) |
|------|-----------------|-------------|
| 布局方式 | CSS Grid | Form inline |
| 按钮位置 | 固定右下角 | inline 或 bottom |
| 收起逻辑 | 基于数量自动收起前N-1个 | 基于 expandField 字段 |
| 组件定义 | 直接在 schema 中定义 | 基于 FormSchema |
| 复杂度 | 简单直观 | 依赖 Form 组件 |

## 📁 文件结构

```
src/components/SearchForm/
├── index.ts                # 入口文件
└── src/
    ├── SearchForm.vue      # 主组件
    └── types.ts            # TypeScript 类型定义
```

## 🚀 下一步优化

- [ ] 支持自定义插槽组件
- [ ] 支持响应式列数 (移动端 1 列,平板 2 列,PC 3 列)
- [ ] 支持保存搜索条件到 localStorage
- [ ] 支持快捷搜索标签
- [ ] 支持搜索历史记录

---

**创建时间**: 2025-10-19
**状态**: ✅ 已完成
**类型**: 正式组件
