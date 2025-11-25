# 创建测试文件

为组件、Composable 或函数创建 Vitest 测试文件。

## 使用方法

```
/test <文件路径> [选项]
```

## 选项

- `--type=<类型>` - 测试类型（component, composable, function）
- `--coverage` - 生成覆盖率配置

## 示例

```
/test src/components/Counter/Counter.vue
/test src/hooks/web/useCounter.ts --type=composable
/test src/utils/format.ts --type=function
```

## 生成内容

### 1. 组件测试文件

```typescript
// src/components/Counter/Counter.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('should render correctly', () => {
    const wrapper = mount(Counter)
    expect(wrapper.exists()).toBe(true)
  })

  it('should display initial count', () => {
    const wrapper = mount(Counter, {
      props: {
        initialValue: 5
      }
    })

    expect(wrapper.find('[data-test="count"]').text()).toBe('5')
  })

  it('should increment count', async () => {
    const wrapper = mount(Counter)

    await wrapper.find('[data-test="increment-btn"]').trigger('click')

    expect(wrapper.find('[data-test="count"]').text()).toBe('1')
  })

  it('should emit update event', async () => {
    const wrapper = mount(Counter)

    await wrapper.find('[data-test="increment-btn"]').trigger('click')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')?.[0]).toEqual([1])
  })
})
```

### 2. Composable 测试文件

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

  it('should reset to initial value', () => {
    const { count, increment, reset } = useCounter({ initialValue: 5 })

    increment()
    increment()
    expect(count.value).toBe(7)

    reset()
    expect(count.value).toBe(5)
  })
})
```

### 3. 函数测试文件

```typescript
// src/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, formatNumber } from './format'

describe('format utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
    })

    it('should handle invalid date', () => {
      expect(formatDate(null)).toBe('')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('¥0.00')
    })
  })

  describe('formatNumber', () => {
    it('should format number with thousand separator', () => {
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should format decimal', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57')
    })
  })
})
```

## 测试模式

### 1. Props 测试

```typescript
describe('Props', () => {
  it('should accept title prop', () => {
    const wrapper = mount(Component, {
      props: {
        title: 'Test Title'
      }
    })

    expect(wrapper.find('.title').text()).toBe('Test Title')
  })

  it('should use default prop value', () => {
    const wrapper = mount(Component)
    expect(wrapper.props('title')).toBe('Default Title')
  })
})
```

### 2. Emits 测试

```typescript
describe('Emits', () => {
  it('should emit event with payload', async () => {
    const wrapper = mount(Component)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([{ id: 1 }])
  })
})
```

### 3. Slots 测试

```typescript
describe('Slots', () => {
  it('should render default slot', () => {
    const wrapper = mount(Component, {
      slots: {
        default: '<span>Slot content</span>'
      }
    })

    expect(wrapper.html()).toContain('Slot content')
  })

  it('should render named slot', () => {
    const wrapper = mount(Component, {
      slots: {
        header: '<h1>Header</h1>',
        footer: '<p>Footer</p>'
      }
    })

    expect(wrapper.find('h1').text()).toBe('Header')
    expect(wrapper.find('p').text()).toBe('Footer')
  })
})
```

### 4. 异步测试

```typescript
describe('Async', () => {
  it('should load data', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }]
    vi.spyOn(api, 'fetchData').mockResolvedValue(mockData)

    const wrapper = mount(Component)

    // 等待异步操作完成
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.findAll('[data-test="item"]')).toHaveLength(1)
  })
})
```

### 5. Mock 测试

```typescript
import { vi } from 'vitest'

describe('Mock', () => {
  it('should call API', async () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true })
    vi.spyOn(api, 'updateUser').mockImplementation(mockFn)

    const wrapper = mount(Component)
    await wrapper.vm.updateUser({ id: 1 })

    expect(mockFn).toHaveBeenCalledWith({ id: 1 })
  })
})
```

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定文件
pnpm test Counter.test.ts

# 监听模式
pnpm test --watch

# 生成覆盖率
pnpm test:coverage

# UI 模式
pnpm test:ui

# 仅运行匹配的测试
pnpm test -t "should increment"
```

## 断言方法

### 基本断言

```typescript
// 相等性
expect(value).toBe(expected) // 严格相等 ===
expect(value).toEqual(expected) // 深度相等
expect(value).not.toBe(expected) // 不等于

// 真假
expect(value).toBeTruthy() // 真值
expect(value).toBeFalsy() // 假值
expect(value).toBeNull() // null
expect(value).toBeUndefined() // undefined
expect(value).toBeDefined() // 已定义

// 数字
expect(value).toBeGreaterThan(3) // > 3
expect(value).toBeGreaterThanOrEqual(3) // >= 3
expect(value).toBeLessThan(5) // < 5
expect(value).toBeCloseTo(0.3, 5) // 浮点数比较

// 字符串
expect(str).toContain('substring') // 包含子串
expect(str).toMatch(/regex/) // 匹配正则

// 数组
expect(arr).toContain(item) // 包含元素
expect(arr).toHaveLength(3) // 长度为 3

// 对象
expect(obj).toHaveProperty('key') // 有属性
expect(obj).toMatchObject({ key: 'value' }) // 匹配部分属性

// 函数
expect(fn).toHaveBeenCalled() // 被调用
expect(fn).toHaveBeenCalledWith(arg1, arg2) // 以特定参数调用
expect(fn).toHaveBeenCalledTimes(2) // 调用次数
expect(() => fn()).toThrow() // 抛出异常
```

## 测试最佳实践

### 1. AAA 模式

```typescript
it('should do something', () => {
  // Arrange（准备）
  const wrapper = mount(Component)

  // Act（执行）
  wrapper.find('button').trigger('click')

  // Assert（断言）
  expect(wrapper.emitted('click')).toBeTruthy()
})
```

### 2. 使用 data-test 属性

```vue
<template>
  <button data-test="submit-btn">提交</button>
</template>
```

```typescript
const button = wrapper.find('[data-test="submit-btn"]')
```

### 3. 隔离测试

```typescript
describe('Component', () => {
  // ✅ 每个测试独立
  it('test 1', () => {
    const wrapper = mount(Component)
    // 测试逻辑
  })

  it('test 2', () => {
    const wrapper = mount(Component)
    // 测试逻辑
  })
})
```

### 4. 清理副作用

```typescript
import { beforeEach, afterEach } from 'vitest'

describe('Component', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('test', () => {
    wrapper = mount(Component)
    // 测试逻辑
  })
})
```

## 覆盖率配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/mock/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
})
```

## 常见问题

**Q: 找不到元素？**
```typescript
// 使用 await
await wrapper.vm.$nextTick()
await flushPromises()
```

**Q: Mock 不生效？**
```typescript
// 确保 mock 在导入之前
vi.mock('./module')
import { fn } from './module'
```

**Q: 异步测试超时？**
```typescript
it('long test', async () => {
  // ...
}, 10000) // 设置超时 10 秒
```

## 调试技巧

```typescript
// 打印组件 HTML
console.log(wrapper.html())

// 打印组件数据
console.log(wrapper.vm.$data)

// 查看 emitted 事件
console.log(wrapper.emitted())

// 调试模式
it.only('debug this test', () => {
  // 仅运行这个测试
})
```
