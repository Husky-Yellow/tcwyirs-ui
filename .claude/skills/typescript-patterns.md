# TypeScript 模式与最佳实践

项目 TypeScript 使用规范和常用模式。

## 类型定义规范

### 接口命名约定

```typescript
// VO (View Object) - API 响应对象
export interface UserVO {
  id: number
  username: string
  email: string
  createTime?: string
}

// DTO (Data Transfer Object) - API 请求对象
export interface UserCreateDTO {
  username: string
  email: string
  password: string
}

// ReqVO - 请求参数
export interface UserPageReqVO extends PageParam {
  username?: string
  status?: number
  createTime?: [string, string]
}

// Props - 组件属性
export interface ComponentNameProps {
  title: string
  visible: boolean
}

// Emits - 组件事件
export interface ComponentNameEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', data: any): void
}
```

### 类型 vs 接口

```typescript
// ✅ 使用 interface 定义对象结构
export interface User {
  id: number
  name: string
}

// ✅ 使用 type 定义联合类型、工具类型
export type Status = 'pending' | 'approved' | 'rejected'
export type PartialUser = Partial<User>

// ✅ 使用 type 定义函数类型
export type Formatter = (value: any) => string

// ✅ 使用 interface 支持声明合并
export interface Window {
  myCustomProperty: string
}
```

## API 类型定义

### 标准 CRUD API

```typescript
// src/api/system/types.ts
import type { PageParam } from '@/types/global'

// 实体 VO
export interface ResourceVO {
  id?: number
  name: string
  type: string
  status: number
  description?: string
  createTime?: string
  updateTime?: string
}

// 分页查询参数
export interface ResourcePageReqVO extends PageParam {
  name?: string
  type?: string
  status?: number
  createTime?: [string, string]
}

// 创建/更新参数
export interface ResourceFormVO {
  id?: number
  name: string
  type: string
  description?: string
}
```

### API 函数类型

```typescript
// src/api/system/resource.ts
import request from '@/config/axios'
import type { ResourceVO, ResourcePageReqVO } from './types'

// 类型推断返回值
export const getResourcePage = (params: ResourcePageReqVO) => {
  return request.get<PageResult<ResourceVO>>({
    url: '/system/resource/page',
    params
  })
}

// 明确返回类型
export const getResource = (id: number): Promise<ResourceVO> => {
  return request.get({ url: `/system/resource/get?id=${id}` })
}

// 无返回值
export const deleteResource = (id: number): Promise<void> => {
  return request.delete({ url: `/system/resource/delete?id=${id}` })
}
```

## 组件类型定义

### Props 和 Emits

```typescript
// 方式 1: 内联定义
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  data: Array<{ id: number; name: string }>
}

interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<Emits>()
</script>

// 方式 2: 外部类型文件
// types.ts
export interface WidgetProps {
  title: string
  count?: number
}

export interface WidgetEmits {
  (e: 'update', value: number): void
}

// Widget.vue
<script setup lang="ts">
import type { WidgetProps, WidgetEmits } from './types'

const props = withDefaults(defineProps<WidgetProps>(), {
  count: 0
})

const emit = defineEmits<WidgetEmits>()
</script>
```

### Ref 类型

```typescript
import { ref, type Ref } from 'vue'

// ✅ 自动推断
const count = ref(0) // Ref<number>
const user = ref({ id: 1, name: 'John' }) // Ref<{ id: number; name: string }>

// ✅ 显式类型（复杂类型或初始 null）
const user = ref<User | null>(null)
const list = ref<ResourceVO[]>([])

// ✅ 组件实例引用
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()

// 使用
formRef.value?.validate((valid) => {
  if (valid) {
    // 提交表单
  }
})
```

### Computed 类型

```typescript
import { computed, type ComputedRef } from 'vue'

// ✅ 自动推断
const doubleCount = computed(() => count.value * 2) // ComputedRef<number>

// ✅ 显式类型（复杂计算）
const filteredList = computed<ResourceVO[]>(() => {
  return list.value.filter(item => item.status === 1)
})

// ✅ getter + setter
const fullName = computed<string>({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value) => {
    const parts = value.split(' ')
    firstName.value = parts[0]
    lastName.value = parts[1]
  }
})
```

## 枚举与常量

### 枚举定义

```typescript
// ✅ 推荐：使用 const enum（编译时内联，零运行时开销）
export const enum HomeComponentType {
  BANNER = 'Banner',
  STATS = 'Stats',
  MESSAGES = 'Messages',
  HELP_DOCS = 'HelpDocs'
}

// ✅ 数值枚举（后端对齐）
export enum UserStatus {
  Disabled = 0,
  Enabled = 1,
  Locked = 2
}

// ❌ 避免：普通对象（无类型安全）
export const Status = {
  PENDING: 'pending',
  APPROVED: 'approved'
} // 使用 enum 或 as const
```

### 常量类型

```typescript
// ✅ 使用 as const 保持字面量类型
export const STATUS_OPTIONS = [
  { label: '待审批', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' }
] as const

export type StatusValue = typeof STATUS_OPTIONS[number]['value']
// type StatusValue = 'pending' | 'approved' | 'rejected'

// ✅ 映射常量
export const STATUS_COLORS = {
  pending: { dot: 'bg-blue', text: 'text-blue' },
  approved: { dot: 'bg-green', text: 'text-green' },
  rejected: { dot: 'bg-red', text: 'text-red' }
} as const

export type StatusColorMap = typeof STATUS_COLORS
```

## 工具类型

### 内置工具类型

```typescript
// Partial - 所有属性可选
type PartialUser = Partial<UserVO>

// Required - 所有属性必填
type RequiredUser = Required<UserVO>

// Pick - 选择部分属性
type UserBasic = Pick<UserVO, 'id' | 'username' | 'email'>

// Omit - 排除部分属性
type UserWithoutTime = Omit<UserVO, 'createTime' | 'updateTime'>

// Record - 键值映射
type ComponentMap = Record<HomeComponentType, Component>

// Extract - 提取联合类型
type ApprovedStatus = Extract<Status, 'approved' | 'rejected'>

// Exclude - 排除联合类型
type NonPendingStatus = Exclude<Status, 'pending'>
```

### 自定义工具类型

```typescript
// 递归 Partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 提取数组元素类型
export type ArrayElement<T> = T extends (infer E)[] ? E : never

// 函数参数类型
export type Parameters<T> = T extends (...args: infer P) => any ? P : never

// 函数返回类型
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

## 类型守卫

### 基本类型守卫

```typescript
// 类型谓词
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

// 对象类型守卫
export function isUser(obj: any): obj is UserVO {
  return obj && typeof obj.id === 'number' && typeof obj.username === 'string'
}

// 使用
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript 知道这里 value 是 string
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    // TypeScript 知道这里 value 是 number
    console.log(value.toFixed(2))
  }
}
```

### 联合类型收窄

```typescript
type Response =
  | { status: 'success'; data: any }
  | { status: 'error'; message: string }

function handleResponse(response: Response) {
  if (response.status === 'success') {
    // TypeScript 知道这里有 data 属性
    console.log(response.data)
  } else {
    // TypeScript 知道这里有 message 属性
    console.log(response.message)
  }
}
```

## Mock 数据类型

```typescript
// src/mock/modules/system/types.ts
import type { MockConfig, ApiResponse, PageResponse } from '../../types'

export const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/system/resource/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceVO>> => {
      return {
        code: 0,
        data: {
          list: [
            {
              id: 1,
              name: '测试资源',
              type: 'dataset',
              status: 1,
              createTime: new Date().toISOString()
            }
          ],
          total: 1
        },
        msg: ''
      }
    }
  }
]
```

## 常见错误与解决

### ❌ 错误

```typescript
// any 滥用
const data: any = await fetchData() // ❌

// 类型断言过度
const user = data as User // ❌ 可能运行时错误

// 忽略可选属性
function getName(user: UserVO) {
  return user.email.split('@')[0] // ❌ email 是可选的
}

// 不必要的类型标注
const count: number = 0 // ❌ 可以推断
```

### ✅ 正确

```typescript
// 明确类型
const data: ResourceVO = await fetchData() // ✅

// 类型守卫 + 断言
if (isUser(data)) {
  const user = data // ✅ 类型安全
}

// 处理可选属性
function getName(user: UserVO) {
  return user.email?.split('@')[0] ?? 'unknown' // ✅
}

// 依赖类型推断
const count = 0 // ✅ 自动推断为 number
```

## tsconfig.json 关键配置

```json
{
  "compilerOptions": {
    "strict": true,              // 启用所有严格检查
    "noImplicitAny": true,       // 禁止隐式 any
    "strictNullChecks": true,    // 严格空值检查
    "noUnusedLocals": true,      // 未使用的局部变量报错
    "noUnusedParameters": true,  // 未使用的参数报错
    "skipLibCheck": true,        // 跳过 .d.ts 检查（提升性能）
    "paths": {
      "@/*": ["src/*"]           // 路径别名
    }
  }
}
```
