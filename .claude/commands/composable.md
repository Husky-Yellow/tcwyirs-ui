# 创建 Composable

创建符合 Vue 3 Composition API 规范的可复用组合式函数（Composable）。

## 使用方法

```
/composable <名称> [选项]
```

## 选项

- `--global` - 创建全局 composable（`src/hooks/`）
- `--local=<路径>` - 创建局部 composable（组件内）
- `--test` - 同时生成测试文件

## 示例

```
/composable useCounter --global
/composable useStatusStyle --local=src/views/Home/composables
/composable usePagination --global --test
```

## 生成内容

### 1. Composable 文件

```typescript
// src/hooks/web/useCounter.ts
import { ref, computed } from 'vue'

export interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
}

export function useCounter(options: UseCounterOptions = {}) {
  const { initialValue = 0, min, max } = options

  const count = ref(initialValue)

  const increment = () => {
    if (max !== undefined && count.value >= max) return
    count.value++
  }

  const decrement = () => {
    if (min !== undefined && count.value <= min) return
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  const set = (value: number) => {
    if (min !== undefined && value < min) {
      count.value = min
    } else if (max !== undefined && value > max) {
      count.value = max
    } else {
      count.value = value
    }
  }

  const isMin = computed(() => min !== undefined && count.value <= min)
  const isMax = computed(() => max !== undefined && count.value >= max)

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    isMin,
    isMax
  }
}
```

### 2. 类型文件（可选）

```typescript
// src/hooks/web/types/counter.ts
export interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
}

export interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
  set: (value: number) => void
  isMin: ComputedRef<boolean>
  isMax: ComputedRef<boolean>
}
```

### 3. 测试文件

```typescript
// src/hooks/web/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('should decrement count', () => {
    const { count, decrement } = useCounter({ initialValue: 5 })
    decrement()
    expect(count.value).toBe(4)
  })

  it('should respect min/max bounds', () => {
    const { count, increment, decrement } = useCounter({
      initialValue: 5,
      min: 0,
      max: 10
    })

    // Test max
    for (let i = 0; i < 10; i++) increment()
    expect(count.value).toBe(10)

    // Test min
    for (let i = 0; i < 20; i++) decrement()
    expect(count.value).toBe(0)
  })
})
```

## Composable 模式

### 1. 状态管理型

```typescript
// useToggle.ts
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const state = ref(initialValue)

  const toggle = () => {
    state.value = !state.value
  }

  const setTrue = () => {
    state.value = true
  }

  const setFalse = () => {
    state.value = false
  }

  return {
    state,
    toggle,
    setTrue,
    setFalse
  }
}

// 使用
const { state: isOpen, toggle, setTrue, setFalse } = useToggle()
```

### 2. 异步操作型

```typescript
// useAsync.ts
import { ref, shallowRef } from 'vue'

export interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options

  const data = shallowRef<T | null>(null)
  const error = shallowRef<Error | null>(null)
  const loading = ref(false)

  const execute = async (...args: any[]) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFunction(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (err) {
      error.value = err as Error
      onError?.(err as Error)
      throw err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    error,
    loading,
    execute
  }
}

// 使用
const { data, loading, error, execute } = useAsync(fetchUserApi, {
  immediate: true,
  onSuccess: (data) => console.log('Success:', data)
})
```

### 3. 事件监听型

```typescript
// useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(
  target: Window | Document | HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) {
  onMounted(() => {
    target.addEventListener(event, handler, options)
  })

  onUnmounted(() => {
    target.removeEventListener(event, handler, options)
  })
}

// 使用
useEventListener(window, 'resize', () => {
  console.log('Window resized')
})
```

### 4. 数据转换型

```typescript
// useFormatter.ts
import { computed, type Ref } from 'vue'

export function useCurrency(amount: Ref<number>, currency = 'CNY') {
  const formatted = computed(() => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency
    }).format(amount.value)
  })

  return {
    formatted
  }
}

// 使用
const amount = ref(1234.56)
const { formatted } = useCurrency(amount)
console.log(formatted.value) // ¥1,234.56
```

### 5. 副作用型

```typescript
// useTitle.ts
import { watch, type Ref } from 'vue'

export function useTitle(title: Ref<string> | string) {
  const titleRef = typeof title === 'string' ? ref(title) : title

  watch(
    titleRef,
    (newTitle) => {
      document.title = newTitle
    },
    { immediate: true }
  )

  return titleRef
}

// 使用
const pageTitle = ref('首页')
useTitle(pageTitle)
```

## 项目现有 Composables

### Web Hooks (`src/hooks/web/`)

- `useTable` - 表格数据管理
- `useCrudSchemas` - CRUD 表单/表格 schema
- `useMessage` - 消息提示封装
- `useDesign` - 设计系统工具
- `useWatermark` - 水印功能
- `usePermission` - 权限检查
- `useStatusStyle` - 状态样式映射

### Event Hooks (`src/hooks/event/`)

- `useScrollTo` - 页面滚动

### 使用示例

```typescript
// 表格 hook
import { useTable } from '@/hooks/web/useTable'

const { tableObject, tableMethods } = useTable({
  getListApi: getResourcePageApi
})

const { loading, dataList, total, pageSize, currentPage } = toRefs(tableObject)
const { getList, setSearchParams } = tableMethods

// 消息提示
import { useMessage } from '@/hooks/web/useMessage'

const { createMessage, createConfirm } = useMessage()

createMessage.success('操作成功')
await createConfirm('确定删除吗？')

// 权限检查
import { usePermission } from '@/hooks/web/usePermission'

const { hasPermission, hasRole } = usePermission()

if (hasPermission('system:user:create')) {
  // 有权限
}
```

## 命名规范

### Composable 命名

```typescript
// ✅ 推荐：use + 功能名（驼峰）
useCounter
useToggle
usePagination
useStatusStyle

// ❌ 避免：不以 use 开头
counter // 应该是 useCounter
toggleState // 应该是 useToggle
```

### 返回值命名

```typescript
// ✅ 推荐：清晰的返回值
return {
  count,
  increment,
  decrement,
  reset
}

// ❌ 避免：单个返回值
return count // 应返回对象
```

## 类型安全

### 完整类型定义

```typescript
import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UsePaginationOptions {
  page?: number
  pageSize?: number
  total?: number
}

export interface UsePaginationReturn {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  totalPages: ComputedRef<number>
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  // 实现
}
```

## 最佳实践

### 1. 单一职责

```typescript
// ✅ 推荐：职责单一
useCounter() // 只管理计数器
useToggle() // 只管理布尔状态

// ❌ 避免：职责混乱
useCounterAndToggle() // 做太多事
```

### 2. 可配置

```typescript
// ✅ 推荐：提供配置选项
export function useCounter(options: UseCounterOptions = {}) {
  const { initialValue = 0, min, max } = options
  // ...
}

// ❌ 避免：硬编码
export function useCounter() {
  const count = ref(0) // 无法自定义初始值
}
```

### 3. 响应式参数

```typescript
// ✅ 推荐：接受 Ref 或普通值
export function useFormatter(value: Ref<number> | number) {
  const valueRef = isRef(value) ? value : ref(value)
  // ...
}

// ❌ 避免：仅接受普通值
export function useFormatter(value: number) {
  // 无法响应式更新
}
```

### 4. 清理副作用

```typescript
// ✅ 推荐：使用生命周期清理
export function useInterval(callback: () => void, delay: number) {
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(callback, delay)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
}

// ❌ 避免：不清理副作用
export function useInterval(callback: () => void, delay: number) {
  setInterval(callback, delay) // 内存泄漏！
}
```

### 5. 返回对象而非数组

```typescript
// ✅ 推荐：返回对象（明确语义）
return {
  count,
  increment,
  decrement
}

// 使用
const { count, increment } = useCounter()

// ⚠️ 不推荐：返回数组（需要记住顺序）
return [count, increment, decrement]

// 使用
const [count, inc, dec] = useCounter()
```

## 常见模式

### 1. 表单验证

```typescript
// useFormValidation.ts
import { ref, computed } from 'vue'

export function useFormValidation<T>(initialValues: T) {
  const values = ref<T>(initialValues)
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  const validate = (rules: Record<keyof T, (value: any) => string | undefined>) => {
    const newErrors: any = {}

    Object.keys(rules).forEach((key) => {
      const error = rules[key as keyof T](values.value[key as keyof T])
      if (error) {
        newErrors[key] = error
      }
    })

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  return {
    values,
    errors,
    touched,
    validate,
    isValid
  }
}
```

### 2. 防抖/节流

```typescript
// useDebounce.ts
import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debouncedValue = ref(value.value) as Ref<T>

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

// 使用
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 500)

watch(debouncedQuery, (query) => {
  // 执行搜索
})
```

### 3. 本地存储

```typescript
// useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}

// 使用
const userPreferences = useLocalStorage('preferences', {
  theme: 'light',
  language: 'zh-CN'
})
```

## 调试技巧

```typescript
// 开发环境调试
export function useCounter(options: UseCounterOptions = {}) {
  const count = ref(options.initialValue ?? 0)

  if (import.meta.env.DEV) {
    watch(count, (newValue) => {
      console.log('[useCounter] count changed:', newValue)
    })
  }

  // ...
}
```

## 测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('should toggle state', () => {
    const { state, toggle } = useToggle(false)

    expect(state.value).toBe(false)

    toggle()
    expect(state.value).toBe(true)

    toggle()
    expect(state.value).toBe(false)
  })

  it('should set to true', () => {
    const { state, setTrue } = useToggle(false)

    setTrue()
    expect(state.value).toBe(true)
  })
})
```

## 文档模板

```typescript
/**
 * useCounter - 计数器 Composable
 *
 * @description
 * 提供计数器功能，支持增减、重置和边界限制
 *
 * @param options - 配置选项
 * @param options.initialValue - 初始值（默认：0）
 * @param options.min - 最小值
 * @param options.max - 最大值
 *
 * @returns
 * - count: 当前计数
 * - increment: 增加计数
 * - decrement: 减少计数
 * - reset: 重置计数
 * - isMin: 是否达到最小值
 * - isMax: 是否达到最大值
 *
 * @example
 * ```ts
 * const { count, increment, decrement } = useCounter({
 *   initialValue: 5,
 *   min: 0,
 *   max: 10
 * })
 * ```
 */
export function useCounter(options: UseCounterOptions = {}) {
  // 实现
}
```
