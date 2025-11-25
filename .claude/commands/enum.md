# 创建枚举/常量

创建 TypeScript 枚举或常量定义，用于类型安全的配置管理。

## 使用方法

```
/enum <名称> [选项]
```

## 选项

- `--type=<类型>` - 枚举类型（enum, const, options）
- `--values=<值>` - 枚举值（逗号分隔）
- `--numeric` - 使用数值枚举

## 示例

```
/enum Status --values=pending,approved,rejected
/enum UserType --type=const --values=admin,user,guest
/enum Priority --numeric --values=low,medium,high
```

## 生成内容

### 1. 字符串枚举

```typescript
// src/enums/status.ts

/**
 * 状态枚举
 */
export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * 状态标签映射
 */
export const STATUS_LABELS: Record<Status, string> = {
  [Status.PENDING]: '待审批',
  [Status.APPROVED]: '已通过',
  [Status.REJECTED]: '已驳回'
}

/**
 * 状态颜色映射
 */
export const STATUS_COLORS: Record<Status, string> = {
  [Status.PENDING]: '#409EFF',
  [Status.APPROVED]: '#67C23A',
  [Status.REJECTED]: '#F56C6C'
}

/**
 * 状态选项（用于下拉框）
 */
export const STATUS_OPTIONS = [
  { label: '待审批', value: Status.PENDING },
  { label: '已通过', value: Status.APPROVED },
  { label: '已驳回', value: Status.REJECTED }
] as const

/**
 * 获取状态标签
 */
export function getStatusLabel(status: Status): string {
  return STATUS_LABELS[status] || '未知状态'
}

/**
 * 获取状态颜色
 */
export function getStatusColor(status: Status): string {
  return STATUS_COLORS[status] || '#909399'
}
```

### 2. 数值枚举

```typescript
// src/enums/priority.ts

/**
 * 优先级枚举
 */
export enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

/**
 * 优先级标签映射
 */
export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.LOW]: '低',
  [Priority.MEDIUM]: '中',
  [Priority.HIGH]: '高',
  [Priority.URGENT]: '紧急'
}

/**
 * 优先级选项
 */
export const PRIORITY_OPTIONS = [
  { label: '低', value: Priority.LOW },
  { label: '中', value: Priority.MEDIUM },
  { label: '高', value: Priority.HIGH },
  { label: '紧急', value: Priority.URGENT }
] as const
```

### 3. Const 常量

```typescript
// src/constants/user-type.ts

/**
 * 用户类型常量
 */
export const USER_TYPES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const

/**
 * 用户类型
 */
export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES]

/**
 * 用户类型标签
 */
export const USER_TYPE_LABELS: Record<UserType, string> = {
  [USER_TYPES.ADMIN]: '管理员',
  [USER_TYPES.USER]: '用户',
  [USER_TYPES.GUEST]: '访客'
}

/**
 * 用户类型选项
 */
export const USER_TYPE_OPTIONS = [
  { label: '管理员', value: USER_TYPES.ADMIN },
  { label: '用户', value: USER_TYPES.USER },
  { label: '访客', value: USER_TYPES.GUEST }
] as const
```

### 4. 配置对象

```typescript
// src/config/table.ts

/**
 * 表格配置常量
 */
export const TABLE_CONFIG = {
  // 分页配置
  PAGE_SIZES: [10, 20, 50, 100],
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NO: 1,

  // 列配置
  DEFAULT_COLUMN_WIDTH: 120,
  MIN_COLUMN_WIDTH: 80,
  MAX_COLUMN_WIDTH: 500,

  // 高度配置
  ROW_HEIGHT: 48,
  HEADER_HEIGHT: 56,

  // 加载配置
  LOADING_TEXT: '加载中...',
  EMPTY_TEXT: '暂无数据',

  // 样式配置
  STRIPE: true,
  BORDER: true,
  HIGHLIGHT_CURRENT_ROW: true
} as const

/**
 * 表格大小枚举
 */
export enum TableSize {
  LARGE = 'large',
  DEFAULT = 'default',
  SMALL = 'small'
}
```

## 枚举类型选择

### 1. const enum

```typescript
// ✅ 推荐：编译时内联，零运行时开销
export const enum HomeComponentType {
  BANNER = 'Banner',
  STATS = 'Stats',
  MESSAGES = 'Messages'
}

// 编译后直接替换为字面量
const type = HomeComponentType.BANNER // 编译为 const type = 'Banner'
```

### 2. enum

```typescript
// ✅ 需要运行时访问枚举对象时使用
export enum UserStatus {
  DISABLED = 0,
  ENABLED = 1,
  LOCKED = 2
}

// 可以遍历
Object.keys(UserStatus).forEach(key => {
  console.log(key, UserStatus[key])
})
```

### 3. as const

```typescript
// ✅ 字面量类型
export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved'
} as const

export type Status = typeof STATUS[keyof typeof STATUS]
// type Status = 'pending' | 'approved'
```

## 常用枚举场景

### 1. 状态枚举

```typescript
// 审批状态
export enum ApprovalStatus {
  DRAFT = 'draft', // 草稿
  PENDING = 'pending', // 待审批
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已驳回
  CANCELLED = 'cancelled' // 已取消
}

// 订单状态
export enum OrderStatus {
  UNPAID = 'unpaid', // 未支付
  PAID = 'paid', // 已支付
  SHIPPED = 'shipped', // 已发货
  DELIVERED = 'delivered', // 已送达
  CANCELLED = 'cancelled', // 已取消
  REFUNDED = 'refunded' // 已退款
}
```

### 2. 类型枚举

```typescript
// 资源类型
export enum ResourceType {
  DATASET = 'dataset',
  ALGORITHM = 'algorithm',
  MODEL = 'model',
  API = 'api'
}

// 文件类型
export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive'
}

// 消息类型
export enum MessageType {
  SYSTEM = 'system',
  NOTICE = 'notice',
  WARNING = 'warning',
  ERROR = 'error'
}
```

### 3. 操作枚举

```typescript
// CRUD 操作
export enum Operation {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

// 审批操作
export enum ApprovalAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  REVOKE = 'revoke',
  REASSIGN = 'reassign'
}
```

### 4. 配置枚举

```typescript
// 布局类型
export enum LayoutType {
  CLASSIC = 'classic',
  TOP_LEFT = 'topLeft',
  TOP = 'top',
  LEFT = 'left'
}

// 主题模式
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// 语言
export enum Locale {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP'
}
```

## 使用示例

### 在组件中使用

```vue
<script setup lang="ts">
import { Status, STATUS_LABELS, STATUS_OPTIONS } from '@/enums/status'

const currentStatus = ref<Status>(Status.PENDING)

// 获取标签
const statusLabel = computed(() => STATUS_LABELS[currentStatus.value])

// 表单选项
const formOptions = STATUS_OPTIONS
</script>

<template>
  <div>
    <el-tag :type="getStatusType(currentStatus)">
      {{ statusLabel }}
    </el-tag>

    <el-select v-model="currentStatus">
      <el-option
        v-for="option in formOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </div>
</template>
```

### 在 API 中使用

```typescript
// src/api/resource/types.ts
import { ResourceType } from '@/enums/resource-type'
import { Status } from '@/enums/status'

export interface ResourceVO {
  id: number
  name: string
  type: ResourceType // 使用枚举类型
  status: Status // 使用枚举类型
  createTime: string
}

export interface ResourceCreateDTO {
  name: string
  type: ResourceType
  description?: string
}
```

### 在表格中使用

```typescript
import { Status, STATUS_LABELS, STATUS_COLORS } from '@/enums/status'

const columns = [
  {
    field: 'status',
    label: '状态',
    formatter: (row: any) => {
      return h(
        'el-tag',
        {
          type: getStatusType(row.status),
          style: { color: STATUS_COLORS[row.status] }
        },
        STATUS_LABELS[row.status]
      )
    }
  }
]
```

## 工具函数

### 枚举转选项

```typescript
/**
 * 将枚举转换为选项数组
 */
export function enumToOptions<T extends Record<string, string>>(
  enumObj: T,
  labels: Record<T[keyof T], string>
) {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: labels[value as T[keyof T]],
    value: value
  }))
}

// 使用
const statusOptions = enumToOptions(Status, STATUS_LABELS)
```

### 枚举验证

```typescript
/**
 * 验证值是否为有效的枚举值
 */
export function isValidEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: any
): value is T[keyof T] {
  return Object.values(enumObj).includes(value)
}

// 使用
if (isValidEnumValue(Status, inputValue)) {
  // inputValue 是有效的 Status
}
```

## 命名规范

### 枚举命名

```typescript
// ✅ 推荐：名词单数，PascalCase
export enum Status { }
export enum ResourceType { }
export enum UserRole { }

// ❌ 避免：复数或动词
export enum Statuses { } // 应该是 Status
export enum CreateUser { } // 应该是 UserAction
```

### 枚举值命名

```typescript
// ✅ 推荐：SCREAMING_SNAKE_CASE
export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress'
}

// ⚠️ 可选：camelCase（字符串枚举）
export enum Status {
  pending = 'pending',
  approved = 'approved'
}
```

### 常量命名

```typescript
// ✅ 推荐：SCREAMING_SNAKE_CASE
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const DEFAULT_PAGE_SIZE = 10
export const API_BASE_URL = '/api'
```

## 最佳实践

### 1. 类型安全

```typescript
// ✅ 使用枚举类型
function updateStatus(status: Status) {
  // status 只能是 Status 枚举值
}

// ❌ 使用字符串
function updateStatus(status: string) {
  // status 可以是任意字符串
}
```

### 2. 映射对象

```typescript
// ✅ 提供标签映射
export const STATUS_LABELS: Record<Status, string> = {
  [Status.PENDING]: '待审批',
  [Status.APPROVED]: '已通过',
  [Status.REJECTED]: '已驳回'
}

// ✅ 提供颜色映射
export const STATUS_COLORS: Record<Status, string> = {
  [Status.PENDING]: '#409EFF',
  [Status.APPROVED]: '#67C23A',
  [Status.REJECTED]: '#F56C6C'
}
```

### 3. 工具函数

```typescript
// ✅ 提供 getter 函数
export function getStatusLabel(status: Status): string {
  return STATUS_LABELS[status] || '未知'
}
```

### 4. 选项数组

```typescript
// ✅ 提供选项数组（用于表单）
export const STATUS_OPTIONS = [
  { label: '待审批', value: Status.PENDING },
  { label: '已通过', value: Status.APPROVED },
  { label: '已驳回', value: Status.REJECTED }
] as const
```

## 常见问题

**Q: enum vs const enum?**
- `const enum` 编译时内联，性能更好，但无法运行时遍历
- `enum` 保留运行时对象，可以遍历，但有额外开销

**Q: enum vs as const?**
- `enum` 更传统，工具支持更好
- `as const` 更灵活，可以生成联合类型

**Q: 如何遍历枚举？**
```typescript
// 字符串枚举
Object.values(Status).forEach(value => {
  console.log(value)
})

// 数值枚举（需要过滤）
Object.keys(Priority)
  .filter(key => !isNaN(Number(key)))
  .forEach(key => {
    console.log(Priority[key])
  })
```

**Q: 如何反向查找？**
```typescript
// 数值枚举支持反向映射
enum Priority {
  LOW = 0,
  HIGH = 1
}

console.log(Priority[0]) // 'LOW'
console.log(Priority['LOW']) // 0

// 字符串枚举不支持反向映射
```
