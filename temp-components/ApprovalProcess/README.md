# ApprovalProcess 审批流程组件

基于 Element Plus `el-timeline` 封装的审批流程时间轴组件。

## 功能特性

- ✅ 基于 Element Plus Timeline 组件
- ✅ 支持多种审批状态(待处理、审批中、已完成、已拒绝)
- ✅ 自定义图标和颜色
- ✅ 显示时间戳
- ✅ 支持描述信息
- ✅ **使用 UnoCSS** 工具类
- ✅ TypeScript 类型支持
- ✅ 响应式设计

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

const steps: ApprovalStep[] = [
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed'
  },
  {
    title: '审批中',
    time: '2025-10-24 10:32',
    status: 'processing'
  },
  {
    title: '申请结果',
    status: 'waiting'
  }
]
</script>

<template>
  <ApprovalProcess :steps="steps" />
</template>
```

### 带描述信息

```vue
<script setup lang="ts">
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

const steps: ApprovalStep[] = [
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed',
    description: '申请人: 张三'
  },
  {
    title: '部门经理审批',
    time: '2025-10-24 11:20',
    status: 'completed',
    description: '审批人: 李四 - 已通过'
  },
  {
    title: '总经理审批',
    time: '2025-10-24 14:30',
    status: 'processing',
    description: '审批人: 王五 - 审批中'
  },
  {
    title: '财务审核',
    status: 'waiting',
    description: '等待前序审批完成'
  },
  {
    title: '完成',
    status: 'waiting'
  }
]
</script>

<template>
  <ApprovalProcess :steps="steps" title="请假审批流程" />
</template>
```

### 拒绝状态示例

```vue
<script setup lang="ts">
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

const steps: ApprovalStep[] = [
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed'
  },
  {
    title: '部门经理审批',
    time: '2025-10-24 11:20',
    status: 'rejected',
    description: '审批人: 李四 - 拒绝原因: 请假理由不充分'
  },
  {
    title: '总经理审批',
    status: 'waiting'
  }
]
</script>

<template>
  <ApprovalProcess :steps="steps" />
</template>
```

### 自定义标题

```vue
<script setup lang="ts">
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'

const steps = [...]
</script>

<template>
  <ApprovalProcess :steps="steps">
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <Icon icon="ep:document" :size="18" />
          <span class="text-16px font-600">采购申请流程</span>
        </div>
        <el-tag type="success">进行中</el-tag>
      </div>
    </template>
  </ApprovalProcess>
</template>
```

### 完整示例(报销审批)

```vue
<script setup lang="ts">
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

const approvalSteps = ref<ApprovalStep[]>([
  {
    title: '提交申请',
    time: '2025-10-24 09:15',
    status: 'completed',
    description: '申请人: 张三 | 报销金额: ¥2,580'
  },
  {
    title: '直属领导审批',
    time: '2025-10-24 10:30',
    status: 'completed',
    description: '审批人: 李四(研发部经理) | 审批意见: 同意'
  },
  {
    title: '财务审核',
    time: '2025-10-24 14:20',
    status: 'processing',
    description: '审核人: 王五(财务主管) | 审核中...'
  },
  {
    title: '总经理审批',
    status: 'waiting',
    description: '等待财务审核完成'
  },
  {
    title: '出纳付款',
    status: 'waiting',
    description: '等待总经理审批'
  },
  {
    title: '完成',
    status: 'waiting'
  }
])
</script>

<template>
  <el-card shadow="never">
    <ApprovalProcess :steps="approvalSteps" title="报销审批流程" />
  </el-card>
</template>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| steps | 审批步骤数组 | `ApprovalStep[]` | **必填** |
| title | 流程标题 | `string` | `'审批流程'` |

## Types

### ApprovalStatus

```typescript
type ApprovalStatus = 'waiting' | 'processing' | 'completed' | 'rejected'
```

- `waiting` - 等待中(灰色圆点)
- `processing` - 审批中(蓝色圆点 + 外圈光晕)
- `completed` - 已完成(蓝色背景 + 白色对勾)
- `rejected` - 已拒绝(红色背景 + 白色叉号)

### ApprovalStep

```typescript
interface ApprovalStep {
  title: string           // 步骤标题
  time?: string          // 时间戳(可选)
  status: ApprovalStatus // 状态
  description?: string   // 描述信息(可选)
}
```

## Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| title | 自定义标题区域 | - |

## 状态说明

### 1. Completed (已完成)
- **图标**: ✓ (对勾)
- **颜色**: 蓝色 (#409EFF)
- **连接线**: 蓝色实线
- **标题**: 加粗显示

### 2. Processing (审批中)
- **图标**: ⋯ (三点)
- **颜色**: 蓝色 (#409EFF)
- **特效**: 外圈光晕效果
- **连接线**: 蓝色实线
- **标题**: 蓝色加粗

### 3. Waiting (等待中)
- **图标**: 🕐 (时钟)
- **颜色**: 灰色 (#E4E7ED)
- **连接线**: 灰色虚线
- **标题**: 常规样式

### 4. Rejected (已拒绝)
- **图标**: ✕ (叉号)
- **颜色**: 红色 (#F56C6C)
- **标题**: 红色加粗

## 样式定制

组件使用 UnoCSS 工具类和最小化 SCSS,自动适配项目主题。

### UnoCSS 类列表:
- 布局: `flex`, `items-center`, `justify-center`, `gap-4px`
- 间距: `px-20px`, `py-16px`, `py-24px`, `mt-4px`
- 文字: `text-14px`, `text-12px`, `font-500`, `font-600`
- 颜色: `text-[var(--el-text-color-primary)]`, `bg-white`
- 边框: `border-2`, `border-[#409EFF]`, `rounded-full`, `rounded-4px`
- 效果: `shadow-[0_0_0_4px_rgba(64,158,255,0.1)]`, `transition-all`

### 自定义样式示例:

```vue
<style>
/* 修改完成状态颜色 */
.approval-process :deep(.bg-\[\#409EFF\]) {
  background-color: #67C23A !important;
  border-color: #67C23A !important;
}
</style>
```

## 使用场景

1. **请假审批** - 员工请假流程跟踪
2. **报销审批** - 费用报销流程可视化
3. **采购审批** - 采购申请审批进度
4. **合同审批** - 合同签署流程展示
5. **项目审批** - 项目立项审批流程
6. **离职审批** - 员工离职流程管理

## 最佳实践

### 1. 动态更新状态

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

const steps = ref<ApprovalStep[]>([...])

// 模拟审批完成
const approveStep = (index: number) => {
  if (steps.value[index]) {
    steps.value[index].status = 'completed'
    steps.value[index].time = new Date().toLocaleString('zh-CN')

    // 更新下一步为审批中
    if (steps.value[index + 1]) {
      steps.value[index + 1].status = 'processing'
    }
  }
}
</script>
```

### 2. 结合其他组件

```vue
<template>
  <el-card shadow="never">
    <ApprovalProcess :steps="steps" />

    <el-divider />

    <div class="flex justify-end gap-12px">
      <el-button @click="reject">拒绝</el-button>
      <el-button type="primary" @click="approve">通过</el-button>
    </div>
  </el-card>
</template>
```

### 3. 响应式布局

```vue
<el-row :gutter="20">
  <el-col :xs="24" :sm="24" :md="12" :lg="8">
    <ApprovalProcess :steps="steps" />
  </el-col>
</el-row>
```

## 注意事项

1. **步骤顺序**: 步骤按照数组顺序从上到下显示
2. **状态一致性**: 确保状态逻辑合理(已完成后不应该是等待中)
3. **时间格式**: 建议使用统一的时间格式(如: YYYY-MM-DD HH:mm)
4. **描述长度**: 描述信息不宜过长,影响阅读体验
5. **临时组件**: 此组件位于 `temp-components` 文件夹,周一需要迁移到正式位置

## 文件结构

```
temp-components/ApprovalProcess/
├── src/
│   ├── ApprovalProcess.vue  # 主组件
│   └── types.ts             # TypeScript 类型定义
├── index.ts                 # 导出文件
└── README.md                # 使用文档
```

## 技术亮点

1. ✅ 基于 Element Plus 原生组件,稳定可靠
2. ✅ 使用 UnoCSS 工具类,样式简洁高效
3. ✅ TypeScript 完整类型支持
4. ✅ 支持自定义插槽,扩展性强
5. ✅ 响应式设计,适配各种屏幕

---

**创建时间**: 2025-10-19
**组件位置**: `temp-components/ApprovalProcess/`
**状态**: ✅ 已完成
**备注**: 周一迁移到正式组件目录
