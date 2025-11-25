# 创建 Pinia Store 模块

创建符合项目规范的 Pinia store 模块，包括状态定义、actions、getters 和持久化配置。

## 使用方法

```
/store <模块名> [选项]
```

## 选项

- `--persist` - 启用持久化存储（默认启用）
- `--no-persist` - 禁用持久化
- `--keys` - 指定需要持久化的 key（逗号分隔）

## 示例

```
/store notification
/store theme --keys=mode,color
/store cache --no-persist
```

## 生成内容

### 1. Store 文件 (`src/store/modules/[name].ts`)

```typescript
import { defineStore } from 'pinia'
import { store } from '../index'

interface ModuleNameState {
  // 状态定义
}

export const useModuleNameStore = defineStore('moduleName', {
  state: (): ModuleNameState => ({
    // 初始状态
  }),

  getters: {
    // Getter 函数
  },

  actions: {
    // Action 函数
    async fetchData() {
      // 异步操作
    },

    updateState(payload: any) {
      // 状态更新
    },

    resetState() {
      // 重置状态
      this.$reset()
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'moduleName',
        storage: localStorage,
        // 指定需要持久化的字段
        paths: ['field1', 'field2']
      }
    ]
  }
})

// 在 setup 外使用
export const useModuleNameStoreWithOut = () => {
  return useModuleNameStore(store)
}
```

### 2. 类型文件 (`src/store/modules/types/[name].ts`)

```typescript
// Store 状态类型
export interface ModuleNameState {
  loading: boolean
  data: any[]
  currentItem: ItemVO | null
}

// Action 参数类型
export interface UpdateParams {
  id: number
  data: any
}
```

## Pinia 状态管理模式

### 基本结构

```typescript
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  // 状态
  state: () => ({
    count: 0,
    user: null as UserVO | null
  }),

  // Getters (类似 computed)
  getters: {
    doubleCount: (state) => state.count * 2,
    isLoggedIn: (state) => !!state.user
  },

  // Actions (支持同步和异步)
  actions: {
    increment() {
      this.count++
    },
    async fetchUser(id: number) {
      this.user = await getUserApi(id)
    }
  }
})
```

### 持久化配置

项目使用 `pinia-plugin-persistedstate` 插件实现状态持久化。

```typescript
persist: {
  enabled: true,
  strategies: [
    {
      // 存储的 key
      key: 'user-store',

      // 存储位置：localStorage 或 sessionStorage
      storage: localStorage,

      // 指定需要持久化的字段（可选）
      // 不指定则持久化所有 state
      paths: ['token', 'userInfo', 'roles']
    }
  ]
}
```

### 在 setup 外使用

```typescript
// 定义 WithOut 版本
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}

// 在 router、axios 拦截器等地方使用
import { useUserStoreWithOut } from '@/store/modules/user'

const userStore = useUserStoreWithOut()
const token = userStore.getToken
```

### Store 间通信

```typescript
// Store A
export const useUserStore = defineStore('user', {
  actions: {
    async login(credentials) {
      // ...
      // 调用其他 store
      const appStore = useAppStore()
      appStore.setLoading(false)
    }
  }
})

// Store B
export const useAppStore = defineStore('app', {
  actions: {
    setLoading(value: boolean) {
      this.loading = value
    }
  }
})
```

## 命名规范

- Store ID: `camelCase` (user, permission, app)
- Store 名称: `use[Name]Store` (useUserStore, usePermissionStore)
- State 字段: `camelCase` (userInfo, pageLoading)
- Actions: `camelCase` (fetchData, updateUser)
- Getters: `camelCase` 或 `get[Name]` (getUserInfo, isLoggedIn)

## 常见模式

### 1. 异步数据加载

```typescript
actions: {
  async fetchData() {
    this.loading = true
    try {
      const data = await api.getData()
      this.data = data
    } catch (error) {
      console.error('Failed to fetch data:', error)
      this.data = []
    } finally {
      this.loading = false
    }
  }
}
```

### 2. 乐观更新

```typescript
actions: {
  async updateItem(id: number, updates: any) {
    // 保存旧值
    const oldItem = this.items.find(i => i.id === id)

    // 乐观更新 UI
    const index = this.items.findIndex(i => i.id === id)
    this.items[index] = { ...this.items[index], ...updates }

    try {
      await api.updateItem(id, updates)
    } catch (error) {
      // 回滚
      if (oldItem) {
        this.items[index] = oldItem
      }
      throw error
    }
  }
}
```

### 3. 分页数据管理

```typescript
interface ListState {
  items: ResourceVO[]
  total: number
  pageNo: number
  pageSize: number
  loading: boolean
}

actions: {
  async fetchPage(params?: Partial<PageParam>) {
    this.loading = true
    try {
      const { pageNo = 1, pageSize = 10 } = params || {}
      const { list, total } = await api.getPage({ pageNo, pageSize })

      this.items = list
      this.total = total
      this.pageNo = pageNo
      this.pageSize = pageSize
    } finally {
      this.loading = false
    }
  }
}
```

### 4. 重置状态

```typescript
actions: {
  // 使用内置 $reset
  resetToDefault() {
    this.$reset()
  },

  // 自定义重置
  logout() {
    this.token = null
    this.userInfo = null
    this.roles = []
    // 清除持久化数据
    localStorage.removeItem('user-store')
  }
}
```

## 项目现有 Store 模块

- `user` - 用户信息、token、角色权限
- `permission` - 动态路由、菜单权限
- `app` - 应用配置、布局状态、页面加载
- `dict` - 数据字典缓存
- `tagsView` - 标签页导航
- `locale` - 国际化语言

## 最佳实践

1. **类型安全** - 为 state、actions 参数定义完整类型
2. **职责单一** - 每个 store 管理一个明确的领域
3. **避免嵌套** - state 尽量扁平化，复杂对象使用引用
4. **合理持久化** - 只持久化必要的数据，避免存储敏感信息
5. **错误处理** - actions 中捕获异常并提供降级方案
6. **性能优化** - 大量数据使用 `shallowRef`，避免深度响应
7. **重置机制** - 提供 logout 或 reset 方法清理状态

## 调试技巧

```typescript
// 开发环境启用 devtools
if (import.meta.env.DEV) {
  // Pinia devtools 自动集成 Vue DevTools
  console.log('Current state:', store.$state)
}

// 订阅 state 变化
store.$subscribe((mutation, state) => {
  console.log('State changed:', mutation.type, state)
})

// 订阅 actions
store.$onAction(({ name, args, after, onError }) => {
  console.log(`Action ${name} called with:`, args)

  after((result) => {
    console.log(`Action ${name} completed with:`, result)
  })

  onError((error) => {
    console.error(`Action ${name} failed:`, error)
  })
})
```
