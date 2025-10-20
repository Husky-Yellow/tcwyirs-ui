# BusinessModal 业务弹窗组件

业务弹窗组件集合，包含各种常用的业务场景弹窗。

## 组件列表

### 1. RatingReviewModal - 评分/评论组件

一个用于评分和评论的弹窗组件,支持标签选择和文本输入。

#### 功能特性

- ✅ 双向绑定对话框显示状态 (v-model)
- ✅ 可配置的正面和负面标签
- ✅ 支持多标签选择
- ✅ **实时显示已选择标签** (在文本域下方)
- ✅ **可删除已选择的标签** (点击标签上的 × 图标)
- ✅ 文本评论输入,带字符数限制
- ✅ 表单验证(至少选择一个标签或输入评论)
- ✅ 自动重置表单
- ✅ 响应式设计
- ✅ TypeScript 类型支持
- ✅ 符合项目代码规范

#### 使用示例

##### 基础用法

```vue
<script setup lang="ts">
import { RatingReviewModal } from '@/components/BusinessModal'
import type { RatingReviewResult } from '@/components/BusinessModal'

const showModal = ref(false)

const handleSubmit = (data: RatingReviewResult) => {
  console.log('提交的数据:', data)
  // data.tags: 选中的标签值数组
  // data.review: 评论文本
}

const handleCancel = () => {
  console.log('用户取消了操作')
}
</script>

<template>
  <div>
    <el-button @click="showModal = true">打开评分弹窗</el-button>

    <RatingReviewModal
      v-model="showModal"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
```

##### 自定义标签

```vue
<script setup lang="ts">
import { RatingReviewModal } from '@/components/BusinessModal'
import type { RatingTag, RatingReviewResult } from '@/components/BusinessModal'

const showModal = ref(false)

// 自定义正面标签
const customPositiveTags: RatingTag[] = [
  { label: '界面美观', value: 'nice_ui', type: 'positive' },
  { label: '功能强大', value: 'powerful', type: 'positive' },
  { label: '性能优秀', value: 'fast', type: 'positive' }
]

// 自定义负面标签
const customNegativeTags: RatingTag[] = [
  { label: '界面丑陋', value: 'ugly_ui', type: 'negative' },
  { label: '功能缺失', value: 'missing_features', type: 'negative' },
  { label: '运行缓慢', value: 'slow', type: 'negative' }
]

const handleSubmit = (data: RatingReviewResult) => {
  console.log('选中的标签:', data.tags)
  console.log('评论内容:', data.review)
}
</script>

<template>
  <RatingReviewModal
    v-model="showModal"
    title="产品评价"
    :positive-tags="customPositiveTags"
    :negative-tags="customNegativeTags"
    :max-length="500"
    :min-selection="2"
    @submit="handleSubmit"
  />
</template>
```

#### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 对话框是否显示(支持 v-model) | `boolean` | `false` |
| title | 对话框标题 | `string` | `'评分/评论'` |
| maxLength | 评论最大字符数 | `number` | `200` |
| minSelection | 最小选择标签数或评论字符数(至少满足一个) | `number` | `1` |
| positiveTags | 正面标签列表 | `RatingTag[]` | 默认5个正面标签 |
| negativeTags | 负面标签列表 | `RatingTag[]` | 默认4个负面标签 |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 对话框显示状态变化时触发 | `(value: boolean) => void` |
| submit | 点击"发布"按钮时触发 | `(data: RatingReviewResult) => void` |
| cancel | 点击"取消"按钮时触发 | `() => void` |

#### 类型定义

```typescript
// 标签类型
export interface RatingTag {
  label: string          // 标签显示文本
  value: string          // 标签值(唯一标识)
  type: 'positive' | 'negative'  // 标签类型
}

// 表单数据类型
export interface RatingReviewFormData {
  tags: string[]         // 已选标签值数组
  review: string         // 评论文本
}

// 提交结果类型
export interface RatingReviewResult {
  tags: string[]         // 已选标签值数组
  review: string         // 评论文本
}
```

## 文件结构

```
src/components/BusinessModal/
├── src/
│   ├── RatingReviewModal.vue  # 评分/评论组件
│   └── types.ts               # TypeScript 类型定义
├── index.ts                   # 导出文件
└── README.md                  # 使用文档
```

## 注意事项

1. 组件已配置自动导入,无需手动 import 即可使用
2. 确保项目已安装并配置 Element Plus
3. 组件使用了项目的 `Dialog` 基础组件
4. 所有文本使用中文,可根据需要集成 i18n
