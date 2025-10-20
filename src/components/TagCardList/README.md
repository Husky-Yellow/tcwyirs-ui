# TagCardList 组件

## 📍 组件位置

`src/components/TagCardList/`

## 🎯 功能说明

TagCardList 是一个卡片式列表组件,用于展示标签数据,支持单选、编辑和删除操作。

## ✨ 核心特性

### 1. 卡片式布局
- ✅ 使用 CSS Grid 布局
- ✅ 每行最多显示 4 个卡片 (可配置)
- ✅ 自动换行,间距统一

### 2. 单选功能
- ✅ 支持 v-model 双向绑定
- ✅ 点击卡片即可选中
- ✅ 选中状态高亮显示 (蓝色边框 + 浅蓝背景)
- ✅ 右上角显示单选按钮

### 3. 交互效果
- ✅ 鼠标悬停时卡片边框变蓝色
- ✅ 悬停时显示阴影效果
- ✅ 选中时背景色变化
- ✅ 平滑过渡动画

### 4. 操作功能
- ✅ 编辑按钮 - 触发 edit 事件
- ✅ 删除按钮 - 触发 delete 事件
- ✅ 操作按钮支持事件冒泡阻止

### 5. 权重颜色标识
- 🔴 **高权重** - 红色背景 (#fef0f0) + 红色文字 (#f56c6c)
- 🔵 **中权重** - 蓝色背景 (#ecf5ff) + 蓝色文字 (#409eff)
- 🟢 **低权重** - 绿色背景 (#f0f9ff) + 绿色文字 (#67c23a)

## 📦 使用示例

### 基础用法

```vue
<template>
  <TagCardList
    v-model="selectedId"
    :data="tagList"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TagCardList } from '@/components/TagCardList'
import type { TagCardItem } from '@/components/TagCardList'

const selectedId = ref(1)

const tagList: TagCardItem[] = [
  {
    id: 1,
    title: '资源内容丰富',
    icon: 'ep:document',
    status: '启用中',
    scoreType: '上降',
    weight: '高权重'
  },
  {
    id: 2,
    title: '操作使用便捷',
    icon: 'ep:finished',
    status: '启用中',
    scoreType: '上降',
    weight: '中权重'
  }
]

const handleEdit = (item: TagCardItem) => {
  console.log('编辑:', item)
}

const handleDelete = (item: TagCardItem) => {
  console.log('删除:', item)
}
</script>
```

### 完整配置

```vue
<TagCardList
  v-model="selectedId"
  :data="tagList"
  :show-radio="true"
  :cols-per-row="4"
  :show-actions="true"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

### 配合搜索使用

```vue
<template>
  <div>
    <!-- 搜索表单 -->
    <SearchForm
      :schema="searchSchema"
      :model="searchModel"
      :cols-per-row="3"
      @search="handleSearch"
    />

    <!-- 卡片列表 -->
    <TagCardList
      v-model="selectedId"
      :data="filteredList"
    />
  </div>
</template>
```

## 🔧 Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 卡片数据数组 | `TagCardItem[]` | `[]` |
| modelValue | 当前选中的卡片ID | `string \| number` | - |
| showRadio | 是否显示单选按钮 | `boolean` | `true` |
| colsPerRow | 每行显示的卡片数量 | `number` | `4` |
| showActions | 是否显示操作按钮 | `boolean` | `true` |

## 📤 Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 选中值变化时触发 | `(value: string \| number)` |
| edit | 点击编辑按钮时触发 | `(item: TagCardItem)` |
| delete | 点击删除按钮时触发 | `(item: TagCardItem)` |

## 📝 TagCardItem 数据结构

```typescript
interface TagCardItem {
  // 唯一标识 (必填)
  id: string | number

  // 标题 (必填)
  title: string

  // 图标 (可选)
  icon?: string

  // 状态 (必填)
  status: '启用中' | '停用'

  // 分数类型 (必填)
  scoreType: '上降' | '下降'

  // 分数权重 (必填)
  weight: '高权重' | '中权重' | '低权重'

  // 其他自定义字段
  [key: string]: any
}
```

## 🎨 卡片布局

```
┌─────────────────────────────────────────┐
│  📄 资源内容丰富                    ○   │  ← 标题 + 单选按钮
├─────────────────────────────────────────┤
│  状态:    ✓ 启用中                      │
│  分数类型: 上降                         │
│  分数权重: 高权重 (红色背景)            │  ← 内容区
├─────────────────────────────────────────┤
│  🖊 编辑    🗑 删除                      │  ← 操作按钮
└─────────────────────────────────────────┘
```

## 🎯 使用场景

1. **标签管理** - 展示和管理各种标签
2. **选项选择** - 从多个选项中单选一个
3. **卡片列表** - 任何需要卡片式展示的列表数据
4. **评分标签** - 评分系统中的标签选择

## 💡 设计亮点

### 1. 响应式网格布局
- 使用 CSS Grid 自动布局
- 间距统一 (16px)
- 自适应宽度

### 2. 清晰的视觉层次
- 边框: 默认浅灰 → 悬停蓝色 → 选中蓝色
- 背景: 默认白色 → 选中浅蓝
- 阴影: 悬停时显示

### 3. 权重颜色系统
- 高权重用红色,表示重要性高
- 中权重用蓝色,表示中等重要
- 低权重用绿色,表示相对次要

### 4. 流畅的交互
- 所有状态变化都有过渡动画
- 按钮点击事件阻止冒泡
- 空状态友好提示

## 🔄 状态管理

### 选中状态
```vue
<script setup>
const selectedId = ref(1)

// 监听变化
watch(selectedId, (newVal) => {
  console.log('选中了:', newVal)
})
</script>
```

### 数据操作
```vue
<script setup>
const tagList = ref<TagCardItem[]>([...])

// 添加
const addTag = (tag: TagCardItem) => {
  tagList.value.push(tag)
}

// 删除
const deleteTag = (id: string | number) => {
  const index = tagList.value.findIndex(t => t.id === id)
  if (index > -1) {
    tagList.value.splice(index, 1)
  }
}

// 编辑
const updateTag = (id: string | number, updates: Partial<TagCardItem>) => {
  const item = tagList.value.find(t => t.id === id)
  if (item) {
    Object.assign(item, updates)
  }
}
</script>
```

## 🎨 样式自定义

### 修改每行列数
```vue
<!-- 每行3个 -->
<TagCardList :cols-per-row="3" :data="list" />

<!-- 每行6个 -->
<TagCardList :cols-per-row="6" :data="list" />
```

### 修改间距
```scss
.tag-card-list-grid {
  gap: 24px; // 默认 16px
}
```

### 自定义权重颜色
```scss
.tag-card-weight {
  &--high {
    background: #your-color;
    color: #your-text-color;
  }
}
```

## 📱 响应式建议

```scss
.tag-card-list-grid {
  // 移动端: 1列
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr) !important;
  }

  // 平板: 2列
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  // 桌面: 4列
  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}
```

## 📁 文件结构

```
src/components/TagCardList/
├── index.ts                # 入口文件
└── src/
    ├── TagCardList.vue     # 主组件
    └── types.ts            # TypeScript 类型定义
```

## 🚀 后续优化

- [ ] 支持多选模式
- [ ] 支持拖拽排序
- [ ] 支持虚拟滚动 (大数据量)
- [ ] 支持分页
- [ ] 支持自定义卡片模板
- [ ] 支持响应式列数

---

**创建时间**: 2025-10-19
**状态**: ✅ 已完成
**类型**: 正式组件
