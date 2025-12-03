# FeedbackDetail 反馈详情组件

反馈详情抽屉组件，支持三种状态展示：待处理、已解决、未解决。

## 功能特性

- ✅ 三种状态展示（待处理、已解决、未解决）
- ✅ 抽屉形式展示，从右侧滑出
- ✅ 反馈信息展示（状态、资源、时间、内容等）
- ✅ 反馈回复列表
- ✅ 状态驱动的交互（可回复/已结束）
- ✅ 自定义反馈方式选项

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { FeedbackDetail, FeedbackStatus, type FeedbackDetail as FeedbackDetailType } from '@/components/FeedbackDetail'

const visible = ref(false)

// 待处理状态
const pendingFeedback: FeedbackDetailType = {
  id: 1,
  status: FeedbackStatus.PENDING,
  type: '其他问题',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  content: '这是一个问题描述的文本。这是一个问题描述的文本。',
  description: '待处理',
  replies: []
}

// 已解决状态
const resolvedFeedback: FeedbackDetailType = {
  id: 2,
  status: FeedbackStatus.RESOLVED,
  type: '其他问题',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  content: '这是一个问题描述的文本。这是一个问题描述的文本。',
  description: '已结束',
  replies: [
    {
      id: 1,
      content: '实时报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据 l...',
      time: '9月11日 12:36'
    }
  ]
}

// 未解决状态
const unresolvedFeedback: FeedbackDetailType = {
  id: 3,
  status: FeedbackStatus.UNRESOLVED,
  type: '其他问题',
  resource: '生物资源系统',
  time: '2025-03-04 12:36:12',
  content: '这是一个问题描述的文本。这是一个问题描述的文本。',
  description: '从速手',
  replies: [
    {
      id: 1,
      content: '实时报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据 l...',
      time: '10月11日 12:36'
    },
    {
      id: 2,
      content: '本计报聚 Pulsar 指标将多支持 Apache Pulsar 分布式消息系统，能实现数据 l...',
      time: '10月12日 12:36'
    }
  ]
}

const handleConfirm = (feedbackWay?: string, reply?: string) => {
  console.log('确认', feedbackWay, reply)
}

const handleCancel = () => {
  console.log('取消')
}
</script>

<template>
  <div>
    <el-button @click="visible = true">打开反馈详情</el-button>

    <FeedbackDetail
      v-model="visible"
      :data="pendingFeedback"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>
```

### 自定义反馈方式选项

```vue
<script setup lang="ts">
const customOptions = [
  { label: '已解决', value: 'resolved' },
  { label: '部分解决', value: 'partial' },
  { label: '未解决', value: 'unresolved' }
]
</script>

<template>
  <FeedbackDetail
    v-model="visible"
    :data="feedbackData"
    :feedback-options="customOptions"
    @confirm="handleConfirm"
  />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否显示对话框 | `boolean` | `false` |
| data | 反馈详情数据 | `FeedbackDetail` | - |
| feedbackOptions | 反馈方式选项 | `FeedbackOption[]` | `[{ label: '口述法', value: 'oral' }, ...]` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 更新 modelValue | `(value: boolean)` |
| confirm | 点击确定按钮 | `(feedbackWay?: string, reply?: string)` |
| cancel | 点击取消按钮 | `()` |

### Types

#### FeedbackStatus

```typescript
enum FeedbackStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已解决 */
  RESOLVED = 'resolved',
  /** 未解决 */
  UNRESOLVED = 'unresolved'
}
```

#### FeedbackDetail

```typescript
interface FeedbackDetail {
  /** 反馈ID */
  id: string | number
  /** 反馈状态 */
  status: FeedbackStatus
  /** 反馈类型 */
  type: string
  /** 反馈资源 */
  resource: string
  /** 反馈时间 */
  time: string
  /** 反馈内容 */
  content: string
  /** 问题描述 */
  description?: string
  /** 回复列表 */
  replies?: FeedbackReply[]
}
```

#### FeedbackReply

```typescript
interface FeedbackReply {
  /** 回复ID */
  id: string | number
  /** 回复内容 */
  content: string
  /** 回复时间 */
  time: string
  /** 回复人 */
  replier?: string
}
```

#### FeedbackOption

```typescript
interface FeedbackOption {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string
}
```

## 状态说明

### 待处理 (PENDING)

- 显示反馈信息和空的回复区域
- 底部显示反馈方式选择和回复输入框
- 点击确定按钮会触发 `confirm` 事件，传递反馈方式和回复内容

### 已解决 (RESOLVED)

- 显示反馈信息和回复列表
- 反馈类型显示为"已结束"（绿色状态）
- 底部显示"已结束"状态提示
- 不显示回复输入区域
- 点击确定按钮只触发 `confirm` 事件，不传递参数

### 未解决 (UNRESOLVED)

- 显示反馈信息和回复列表
- 底部显示反馈方式选择和回复输入框
- 点击确定按钮会触发 `confirm` 事件，传递反馈方式和回复内容

## 样式特性

- 使用 Element Plus 风格设计
- 响应式布局，自适应不同尺寸
- 状态点颜色自动适配状态
- 回复列表区域滚动支持
- 输入框字数限制提示
