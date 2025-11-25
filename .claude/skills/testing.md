# 测试策略技能

项目测试方案和最佳实践，涵盖单元测试、组件测试和E2E测试。

## 测试技术栈

- **Vitest** - 单元测试框架（Vite 原生支持）
- **@vue/test-utils** - Vue 组件测试工具
- **happy-dom** - 轻量级 DOM 模拟
- **c8** - 代码覆盖率

## 项目配置

### Vitest 配置 (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/mock/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### 测试脚本 (`package.json`)

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 组件测试

### 基本组件测试

```typescript
// src/components/Counter/Counter.test.ts
import { describe, it, expect } from 'vitest'
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

    expect(wrapper.find('.count').text()).toBe('5')
  })

  it('should increment count when button clicked', async () => {
    const wrapper = mount(Counter)

    const button = wrapper.find('[data-test="increment-btn"]')
    await button.trigger('click')

    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('should emit update event', async () => {
    const wrapper = mount(Counter)

    await wrapper.find('[data-test="increment-btn"]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('update')
    expect(wrapper.emitted('update')?.[0]).toEqual([1])
  })
})
```

### 组件示例

```vue
<!-- Counter.vue -->
<template>
  <div class="counter">
    <span class="count">{{ count }}</span>
    <button data-test="increment-btn" @click="increment">+</button>
    <button data-test="decrement-btn" @click="decrement">-</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  initialValue?: number
}

interface Emits {
  (e: 'update', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: 0
})

const emit = defineEmits<Emits>()

const count = ref(props.initialValue)

const increment = () => {
  count.value++
  emit('update', count.value)
}

const decrement = () => {
  count.value--
  emit('update', count.value)
}
</script>
```

### 测试 Element Plus 组件

```typescript
import { mount } from '@vue/test-utils'
import { ElButton, ElMessage } from 'element-plus'
import MyComponent from './MyComponent.vue'

describe('MyComponent with Element Plus', () => {
  it('should render el-button', () => {
    const wrapper = mount(MyComponent, {
      global: {
        components: {
          ElButton
        }
      }
    })

    expect(wrapper.findComponent(ElButton).exists()).toBe(true)
  })

  it('should call ElMessage on error', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')

    const wrapper = mount(MyComponent)
    await wrapper.vm.triggerError()

    expect(errorSpy).toHaveBeenCalledWith('Error message')
  })
})
```

## Props 和 Emits 测试

### Props 测试

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

    expect(wrapper.find('.title').text()).toBe('Default Title')
  })

  it('should validate prop type', () => {
    const wrapper = mount(Component, {
      props: {
        count: '10' // 应该是 number
      }
    })

    // 检查是否有警告
    expect(console.warn).toHaveBeenCalled()
  })
})
```

### Emits 测试

```typescript
describe('Emits', () => {
  it('should emit click event', async () => {
    const wrapper = mount(Component)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('should emit event with correct payload', async () => {
    const wrapper = mount(Component)

    await wrapper.vm.submitForm({ name: 'John' })

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { name: 'John' }
    ])
  })

  it('should emit multiple events', async () => {
    const wrapper = mount(Component)

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(2)
  })
})
```

## Composables 测试

### 测试 Composable

```typescript
// useCounter.test.ts
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

    increment()
    expect(count.value).toBe(2)
  })

  it('should respect min/max bounds', () => {
    const { count, increment, decrement } = useCounter({
      initialValue: 5,
      min: 0,
      max: 10
    })

    // Test max bound
    for (let i = 0; i < 10; i++) increment()
    expect(count.value).toBe(10)

    // Test min bound
    for (let i = 0; i < 20; i++) decrement()
    expect(count.value).toBe(0)
  })
})
```

### 测试异步 Composable

```typescript
// useAsync.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const mockFn = vi.fn().mockResolvedValue('success')
    const { data, loading, error, execute } = useAsync(mockFn)

    expect(loading.value).toBe(false)
    expect(data.value).toBeNull()

    const promise = execute()
    expect(loading.value).toBe(true)

    await promise

    expect(loading.value).toBe(false)
    expect(data.value).toBe('success')
    expect(error.value).toBeNull()
  })

  it('should handle errors', async () => {
    const mockError = new Error('Failed')
    const mockFn = vi.fn().mockRejectedValue(mockError)
    const { data, error, execute } = useAsync(mockFn)

    await expect(execute()).rejects.toThrow('Failed')

    expect(error.value).toBe(mockError)
    expect(data.value).toBeNull()
  })
})
```

## Mock 和 Spy

### Mock 函数

```typescript
import { vi } from 'vitest'

describe('Mock Functions', () => {
  it('should mock function', () => {
    const mockFn = vi.fn()

    mockFn('arg1', 'arg2')

    expect(mockFn).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should mock return value', () => {
    const mockFn = vi.fn().mockReturnValue('mocked')

    const result = mockFn()

    expect(result).toBe('mocked')
  })

  it('should mock async function', async () => {
    const mockFn = vi.fn().mockResolvedValue('async mocked')

    const result = await mockFn()

    expect(result).toBe('async mocked')
  })
})
```

### Spy 方法

```typescript
describe('Spy', () => {
  it('should spy on object method', () => {
    const obj = {
      method: () => 'original'
    }

    const spy = vi.spyOn(obj, 'method')

    obj.method()

    expect(spy).toHaveBeenCalled()
  })

  it('should spy and mock implementation', () => {
    const obj = {
      method: (x: number) => x * 2
    }

    const spy = vi.spyOn(obj, 'method').mockReturnValue(100)

    const result = obj.method(5)

    expect(result).toBe(100)
    expect(spy).toHaveBeenCalledWith(5)
  })
})
```

### Mock 模块

```typescript
// __mocks__/axios.ts
export default {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

// test file
import axios from 'axios'

vi.mock('axios')

describe('API calls', () => {
  it('should fetch data', async () => {
    const mockData = { id: 1, name: 'Test' }
    axios.get.mockResolvedValue({ data: mockData })

    const result = await fetchData()

    expect(axios.get).toHaveBeenCalledWith('/api/data')
    expect(result).toEqual(mockData)
  })
})
```

## 测试 Store

### Pinia Store 测试

```typescript
// store/user.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useUserStore()

    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
    expect(store.roles).toEqual([])
  })

  it('should set token', () => {
    const store = useUserStore()

    store.setToken('test-token')

    expect(store.token).toBe('test-token')
  })

  it('should login successfully', async () => {
    const store = useUserStore()

    const mockApi = vi.fn().mockResolvedValue({
      token: 'test-token',
      user: { id: 1, username: 'admin' }
    })

    await store.login({ username: 'admin', password: '123456' })

    expect(store.token).toBe('test-token')
    expect(store.userInfo).toBeDefined()
  })

  it('should reset state on logout', () => {
    const store = useUserStore()

    store.setToken('test-token')
    store.logout()

    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
  })
})
```

## 测试路由

### Router 测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from './App.vue'

describe('Router', () => {
  it('should navigate to route', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/about', component: { template: '<div>About</div>' } }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/about')
    await router.isReady()

    expect(wrapper.html()).toContain('About')
  })

  it('should pass route params', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/user/:id',
          component: {
            template: '<div>User {{ $route.params.id }}</div>'
          }
        }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/user/123')
    await router.isReady()

    expect(wrapper.html()).toContain('User 123')
  })
})
```

## 快照测试

```typescript
describe('Snapshot', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Component, {
      props: {
        title: 'Test'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should update snapshot', () => {
    const wrapper = mount(Component)

    // 更新 props
    wrapper.setProps({ title: 'New Title' })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

## 覆盖率目标

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
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

## 测试最佳实践

### 1. AAA 模式

```typescript
it('should do something', () => {
  // Arrange（准备）
  const wrapper = mount(Component)
  const button = wrapper.find('button')

  // Act（执行）
  button.trigger('click')

  // Assert（断言）
  expect(wrapper.emitted('click')).toBeTruthy()
})
```

### 2. 使用 data-test 属性

```vue
<template>
  <button data-test="submit-btn">提交</button>
  <div data-test="result">{{ result }}</div>
</template>
```

```typescript
const wrapper = mount(Component)
const button = wrapper.find('[data-test="submit-btn"]')
const result = wrapper.find('[data-test="result"]')
```

### 3. 隔离测试

```typescript
// ✅ 推荐：每个测试独立
describe('Component', () => {
  it('test 1', () => {
    const wrapper = mount(Component)
    // 测试 1
  })

  it('test 2', () => {
    const wrapper = mount(Component)
    // 测试 2
  })
})

// ❌ 避免：测试间共享状态
describe('Component', () => {
  const wrapper = mount(Component) // 共享实例

  it('test 1', () => {
    // 可能影响 test 2
  })

  it('test 2', () => {
    // 依赖 test 1 的状态
  })
})
```

### 4. 清理副作用

```typescript
import { beforeEach, afterEach } from 'vitest'

describe('Component with side effects', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component)
  })

  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('test', () => {
    // 测试逻辑
  })
})
```

## 常见测试场景

### 测试表单

```typescript
describe('Form', () => {
  it('should validate form', async () => {
    const wrapper = mount(FormComponent)

    await wrapper.find('[data-test="username"]').setValue('admin')
    await wrapper.find('[data-test="password"]').setValue('123456')
    await wrapper.find('[data-test="submit"]').trigger('click')

    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('should show validation error', async () => {
    const wrapper = mount(FormComponent)

    await wrapper.find('[data-test="submit"]').trigger('click')

    expect(wrapper.find('.error-message').text()).toBe('用户名不能为空')
  })
})
```

### 测试异步操作

```typescript
describe('Async', () => {
  it('should load data', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }]
    vi.mock('./api', () => ({
      fetchData: vi.fn().mockResolvedValue(mockData)
    }))

    const wrapper = mount(Component)

    expect(wrapper.find('[data-test="loading"]').exists()).toBe(true)

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.find('[data-test="loading"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="item"]')).toHaveLength(1)
  })
})
```

### 测试错误处理

```typescript
describe('Error Handling', () => {
  it('should display error message', async () => {
    const mockError = new Error('Failed to load')
    vi.mock('./api', () => ({
      fetchData: vi.fn().mockRejectedValue(mockError)
    }))

    const wrapper = mount(Component)

    await flushPromises()

    expect(wrapper.find('[data-test="error"]').text()).toBe('Failed to load')
  })
})
```

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单个文件
pnpm test Counter.test.ts

# 监听模式
pnpm test --watch

# 生成覆盖率报告
pnpm test:coverage

# UI 模式
pnpm test:ui

# 运行特定 describe/it
pnpm test -t "should increment"
```

## 调试技巧

```typescript
// 打印组件HTML
console.log(wrapper.html())

// 打印组件数据
console.log(wrapper.vm.$data)

// 查看 emitted 事件
console.log(wrapper.emitted())

// 调试模式
vi.debug()
```

## 常见问题

**Q: 测试超时？**
```typescript
it('long test', async () => {
  // ...
}, 10000) // 设置超时 10 秒
```

**Q: Mock 不生效？**
- 确认 mock 在导入之前
- 使用 `vi.mock()` 而不是手动 mock
- 检查路径是否正确

**Q: 找不到元素？**
- 使用 `await wrapper.vm.$nextTick()`
- 使用 `await flushPromises()`
- 检查选择器是否正确
