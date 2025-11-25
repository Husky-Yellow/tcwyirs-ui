# Pinia 状态管理技能

深入掌握项目中的 Pinia 状态管理模式和最佳实践。

## 核心概念

### Pinia Store 结构

```typescript
import { defineStore } from 'pinia'
import { store } from '../index'

interface MyStoreState {
  count: number
  user: UserVO | null
  list: ItemVO[]
  loading: boolean
}

export const useMyStore = defineStore('myStore', {
  // 1. State - 状态定义
  state: (): MyStoreState => ({
    count: 0,
    user: null,
    list: [],
    loading: false
  }),

  // 2. Getters - 计算属性
  getters: {
    // 自动推断返回类型为 number
    doubleCount: (state) => state.count * 2,

    // 需要显式声明返回类型
    userDisplayName(): string {
      return this.user?.nickname || '游客'
    },

    // 带参数的 getter（返回函数）
    getItemById: (state) => (id: number) => {
      return state.list.find(item => item.id === id)
    },

    // 访问其他 getter
    tripleCount(): number {
      return this.doubleCount * 1.5
    }
  },

  // 3. Actions - 方法
  actions: {
    // 同步 action
    increment() {
      this.count++
    },

    // 异步 action
    async fetchUser(id: number) {
      this.loading = true
      try {
        const user = await getUserApi(id)
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },

    // 调用其他 action
    async loadData() {
      await this.fetchUser(1)
      this.increment()
    },

    // 重置状态
    reset() {
      this.$reset()
    }
  },

  // 4. 持久化配置
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'my-store',
        storage: localStorage,
        paths: ['count', 'user']
      }
    ]
  }
})

// 在 setup 外使用
export const useMyStoreWithOut = () => {
  return useMyStore(store)
}
```

## 状态持久化

### 基本配置

项目使用 `pinia-plugin-persistedstate` 插件。

```typescript
// src/store/index.ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(createPersistedState())

export { store }
```

### 持久化策略

```typescript
persist: {
  enabled: true,
  strategies: [
    {
      // 存储 key
      key: 'user-store',

      // 存储位置
      storage: localStorage, // 或 sessionStorage

      // 选择性持久化（推荐）
      paths: ['token', 'userInfo', 'roles'],

      // 不持久化某些字段
      // paths: undefined 表示持久化所有
    },

    // 多策略：部分用 localStorage，部分用 sessionStorage
    {
      key: 'user-session',
      storage: sessionStorage,
      paths: ['tempData']
    }
  ]
}
```

### 持久化最佳实践

```typescript
// ✅ 推荐：仅持久化必要字段
persist: {
  enabled: true,
  strategies: [
    {
      key: 'app-store',
      storage: localStorage,
      paths: ['theme', 'locale', 'sidebarCollapse']
      // 不持久化 pageLoading, breadcrumb 等临时状态
    }
  ]
}

// ❌ 避免：持久化所有状态
persist: {
  enabled: true,
  strategies: [
    {
      key: 'app-store',
      storage: localStorage
      // paths 未指定，会持久化所有 state
    }
  ]
}
```

### 手动清除持久化数据

```typescript
actions: {
  logout() {
    // 清除状态
    this.token = null
    this.userInfo = null
    this.roles = []

    // 清除持久化存储
    localStorage.removeItem('user-store')
    // 或使用 $reset()
    this.$reset()
  }
}
```

## Store 间通信

### 1. 在 Action 中调用其他 Store

```typescript
// src/store/modules/user.ts
export const useUserStore = defineStore('user', {
  actions: {
    async login(credentials) {
      const appStore = useAppStore()
      const permissionStore = usePermissionStore()

      try {
        appStore.setPageLoading(true)

        const { token, user } = await loginApi(credentials)
        this.token = token
        this.userInfo = user

        // 登录后加载权限
        await permissionStore.generateRoutes()

        return user
      } finally {
        appStore.setPageLoading(false)
      }
    }
  }
})
```

### 2. 在 Getter 中访问其他 Store

```typescript
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    // 结合用户信息计算折扣
    totalPrice(): number {
      const userStore = useUserStore()
      const discount = userStore.vipLevel === 'premium' ? 0.9 : 1

      return this.items.reduce((sum, item) => sum + item.price, 0) * discount
    }
  }
})
```

### 3. 订阅其他 Store 变化

```typescript
export const useNotificationStore = defineStore('notification', {
  actions: {
    setupWatchers() {
      const userStore = useUserStore()

      // 监听用户 store 变化
      userStore.$subscribe((mutation, state) => {
        if (mutation.type === 'direct' && mutation.events.key === 'userInfo') {
          this.fetchUnreadCount()
        }
      })
    }
  }
})
```

## 在 Setup 外使用 Store

### 问题场景

```typescript
// ❌ 错误：在模块顶层使用（Pinia 未初始化）
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore() // 报错！

export function myFunction() {
  // ...
}
```

### 解决方案：WithOut 模式

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { store } from '../index'

export const useUserStore = defineStore('user', {
  // ...
})

// ✅ 导出 WithOut 版本
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
```

### 使用场景

#### 1. Axios 拦截器

```typescript
// src/config/axios/service.ts
import { useUserStoreWithOut } from '@/store/modules/user'

service.interceptors.request.use((config) => {
  const userStore = useUserStoreWithOut()
  const token = userStore.getToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

#### 2. Router 守卫

```typescript
// src/permission.ts
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()

  const hasToken = userStore.getToken

  if (hasToken) {
    // 已登录逻辑
  } else {
    // 未登录逻辑
  }

  next()
})
```

#### 3. 工具函数

```typescript
// src/utils/auth.ts
import { useUserStoreWithOut } from '@/store/modules/user'

export function hasPermission(permission: string): boolean {
  const userStore = useUserStoreWithOut()
  return userStore.permissions.includes(permission)
}
```

## 项目核心 Store 模块

### 1. User Store (`src/store/modules/user.ts`)

**职责**：用户信息、认证、角色权限

```typescript
interface UserState {
  token: string
  userInfo: UserVO | null
  roles: string[]
  permissions: string[]
}

actions: {
  async login(data: LoginData)
  async getUserInfo()
  async logout()
  setToken(token: string)
  resetToken()
}
```

**使用示例**：
```typescript
const userStore = useUserStore()

// 登录
await userStore.login({ username: 'admin', password: '123456' })

// 获取用户信息
const user = userStore.getUserInfo

// 检查权限
const hasPermission = userStore.permissions.includes('system:user:create')
```

### 2. Permission Store (`src/store/modules/permission.ts`)

**职责**：动态路由、菜单权限

```typescript
interface PermissionState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
  menuRoutes: RouteRecordRaw[]
}

actions: {
  async generateRoutes(roles: string[])
  setRoutes(routes: RouteRecordRaw[])
}
```

**使用示例**：
```typescript
const permissionStore = usePermissionStore()

// 生成动态路由
await permissionStore.generateRoutes(userStore.roles)

// 获取菜单
const menuRoutes = permissionStore.getMenuRoutes
```

### 3. App Store (`src/store/modules/app.ts`)

**职责**：应用全局状态（布局、加载、主题等）

```typescript
interface AppState {
  collapse: boolean // 侧边栏折叠
  mobile: boolean // 移动端
  pageLoading: boolean // 页面加载
  breadcrumb: boolean // 面包屑显示
  hamburger: boolean // 汉堡菜单显示
  screenfull: boolean // 全屏按钮显示
  size: boolean // 尺寸选择显示
  locale: boolean // 语言切换显示
  tagsView: boolean // 标签页显示
  logo: boolean // Logo 显示
  fixedHeader: boolean // 固定头部
  greyMode: boolean // 灰色模式
  dynamicRouter: boolean // 动态路由
  serverDynamicRouter: boolean // 服务端动态路由
  footer: boolean // 页脚显示
  title: string // 标题
  layout: LayoutType // 布局类型
  isDark: boolean // 暗黑模式
  currentSize: ElementPlusSize // 组件尺寸
  sizeMap: ElementPlusSize[] // 可选尺寸
  theme: ThemeTypes // 主题配置
}

actions: {
  setCollapse(collapse: boolean)
  setPageLoading(loading: boolean)
  setTheme(theme: ThemeTypes)
  // ...
}
```

**使用示例**：
```typescript
const appStore = useAppStore()

// 控制页面加载
appStore.setPageLoading(true)

// 切换侧边栏
appStore.setCollapse(!appStore.collapse)

// 获取当前布局
const layout = appStore.getLayout
```

### 4. Dict Store (`src/store/modules/dict.ts`)

**职责**：数据字典缓存

```typescript
interface DictState {
  dictMap: Map<string, DictDataVO[]>
  isSetDict: boolean
}

actions: {
  async setDictMap()
  getDictByType(type: string): DictDataVO[]
  getDictLabel(type: string, value: any): string
}
```

**使用示例**：
```typescript
const dictStore = useDictStore()

// 初始化字典
await dictStore.setDictMap()

// 获取字典选项
const statusOptions = dictStore.getDictByType('sys_common_status')

// 获取字典标签
const label = dictStore.getDictLabel('sys_common_status', 1) // "正常"
```

### 5. TagsView Store (`src/store/modules/tagsView.ts`)

**职责**：标签页导航

```typescript
interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[]
  cachedViews: Set<string>
}

actions: {
  addView(view: RouteLocationNormalizedLoaded)
  delView(view: RouteLocationNormalizedLoaded)
  delOthersViews(view: RouteLocationNormalizedLoaded)
  delAllViews()
  updateVisitedView(view: RouteLocationNormalizedLoaded)
}
```

## 高级模式

### 1. 异步状态管理

```typescript
interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useResourceStore = defineStore('resource', {
  state: (): AsyncState<ResourceVO[]> => ({
    data: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchResources() {
      this.loading = true
      this.error = null

      try {
        this.data = await getResourcesApi()
      } catch (error) {
        this.error = error as Error
        this.data = null
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 2. 分页状态管理

```typescript
interface PaginationState<T> {
  items: T[]
  total: number
  pageNo: number
  pageSize: number
  loading: boolean
}

export const useListStore = defineStore('list', {
  state: (): PaginationState<ResourceVO> => ({
    items: [],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    loading: false
  }),

  getters: {
    hasMore: (state) => state.items.length < state.total,
    totalPages: (state) => Math.ceil(state.total / state.pageSize)
  },

  actions: {
    async fetchPage(pageNo?: number) {
      this.loading = true
      try {
        const { list, total } = await getPageApi({
          pageNo: pageNo || this.pageNo,
          pageSize: this.pageSize
        })

        this.items = list
        this.total = total
        this.pageNo = pageNo || this.pageNo
      } finally {
        this.loading = false
      }
    },

    async loadMore() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      try {
        const { list, total } = await getPageApi({
          pageNo: this.pageNo + 1,
          pageSize: this.pageSize
        })

        this.items.push(...list)
        this.total = total
        this.pageNo++
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 3. 乐观更新

```typescript
actions: {
  async updateItem(id: number, updates: Partial<ItemVO>) {
    // 1. 保存旧数据
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) return

    const oldItem = { ...this.items[index] }

    // 2. 乐观更新 UI
    this.items[index] = { ...this.items[index], ...updates }

    try {
      // 3. 发送请求
      await updateItemApi(id, updates)
    } catch (error) {
      // 4. 请求失败，回滚
      this.items[index] = oldItem
      throw error
    }
  }
}
```

### 4. 缓存策略

```typescript
interface CacheState {
  cache: Map<string, { data: any; timestamp: number }>
  cacheDuration: number // 缓存时长（毫秒）
}

export const useCacheStore = defineStore('cache', {
  state: (): CacheState => ({
    cache: new Map(),
    cacheDuration: 5 * 60 * 1000 // 5分钟
  }),

  actions: {
    async fetchWithCache(key: string, fetcher: () => Promise<any>) {
      const cached = this.cache.get(key)
      const now = Date.now()

      // 缓存有效
      if (cached && now - cached.timestamp < this.cacheDuration) {
        return cached.data
      }

      // 缓存过期或不存在，重新获取
      const data = await fetcher()
      this.cache.set(key, { data, timestamp: now })

      return data
    },

    clearCache(key?: string) {
      if (key) {
        this.cache.delete(key)
      } else {
        this.cache.clear()
      }
    }
  }
})
```

## 性能优化

### 1. 使用 shallowRef

```typescript
import { shallowRef } from 'vue'

state: () => ({
  // ✅ 大数组使用 shallowRef
  largeList: shallowRef<Item[]>([])
})
```

### 2. 选择性订阅

```typescript
// ❌ 订阅所有变化
store.$subscribe((mutation, state) => {
  console.log('Any change:', state)
})

// ✅ 仅订阅特定字段
watch(
  () => store.specificField,
  (newValue) => {
    console.log('Specific field changed:', newValue)
  }
)
```

### 3. 按需加载 Store

```typescript
// ✅ 仅在需要时导入
async function loadUserData() {
  const { useUserStore } = await import('@/store/modules/user')
  const userStore = useUserStore()
  await userStore.fetchUser()
}
```

## 调试技巧

### 1. Vue DevTools

Pinia 自动集成 Vue DevTools，可以：
- 查看所有 store 状态
- 追踪 state 变化
- 时间旅行调试

### 2. 订阅变化

```typescript
// 监听 state 变化
store.$subscribe((mutation, state) => {
  console.log('[Store] State changed:', mutation.type, state)
})

// 监听 actions
store.$onAction(({ name, args, after, onError }) => {
  console.log(`[Store] Action ${name} started with:`, args)

  after((result) => {
    console.log(`[Store] Action ${name} completed:`, result)
  })

  onError((error) => {
    console.error(`[Store] Action ${name} failed:`, error)
  })
})
```

### 3. 状态快照

```typescript
// 保存当前状态
const snapshot = JSON.parse(JSON.stringify(store.$state))

// 恢复状态
store.$patch(snapshot)
```

## 最佳实践总结

1. **类型安全** - 为 state、actions、getters 定义完整类型
2. **职责单一** - 每个 store 管理一个明确的领域
3. **合理持久化** - 只持久化必要数据，使用 `paths` 选择性持久化
4. **WithOut 模式** - 为每个 store 导出 `WithOut` 版本
5. **错误处理** - actions 中捕获异常并提供降级方案
6. **异步状态** - 使用 loading/error 字段管理异步状态
7. **避免冗余** - 不在 store 中存储可计算的数据，使用 getters
8. **重置机制** - 提供清理状态的方法（logout、reset）
9. **性能优化** - 大量数据使用 shallowRef，避免深度响应
10. **清晰命名** - 使用清晰的命名约定（get/set/fetch/update）
