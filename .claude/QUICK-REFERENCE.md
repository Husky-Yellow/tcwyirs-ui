# Claude Code 快速参考

## 📋 Commands 速查表

| Command | 基础用法 | 常用选项 |
|---------|---------|---------|
| `/store` | `/store notification` | `--persist`, `--no-persist`, `--keys=token,user` |
| `/mock` | `/mock system user` | `--simple`, `--delay=500` |
| `/route` | `/route resource` | `--icon=resource`, `--permission=resource:query`, `--parent=/system`, `--hidden`, `--no-cache` |
| `/composable` | `/composable useCounter` | `--global`, `--local=src/views/Home/composables`, `--test` |
| `/component` | `/component UserCard` | `--widget`, `--global`, `--no-test` |
| `/api` | `/api system user` | 无特殊选项 |
| `/test` | `/test src/components/Counter.vue` | `--type=component\|composable\|function`, `--coverage` |
| `/permission` | `/permission user` | `--module=system`, `--actions=query,create`, `--roles=admin` |
| `/enum` | `/enum Status` | `--type=enum\|const\|options`, `--values=pending,approved`, `--numeric` |
| `/role-layout` | `/role-layout 数据分析师 dataAnalyst` | 无特殊选项 |

## 🎯 快速开始

### 创建完整功能（5步）

```bash
# 1️⃣ 创建 API
/api marketplace resource

# 2️⃣ 创建路由
/route resource --icon=resource --permission=resource:query

# 3️⃣ 创建枚举
/enum ResourceType --values=dataset,algorithm,model

# 4️⃣ 配置权限
/permission resource --module=marketplace

# 5️⃣ 创建测试
/test src/views/Resource/List.vue
```

### 常见开发场景

#### 场景 1: 添加新模块

```bash
/api system user && /route user --icon=user && /permission user
```

#### 场景 2: 创建可复用组件

```bash
/component StatusBadge --global
/composable useStatusStyle --global
/enum Status --values=pending,approved,rejected
```

#### 场景 3: 添加 Store

```bash
/store theme --persist --keys=mode,color
```

#### 场景 4: 配置 Mock

```bash
/mock system user
/mock marketplace resource --delay=300
```

## 📚 Skills 触发词

| Skill | 触发词示例 |
|-------|----------|
| `state-management.md` | "如何创建 Pinia Store？", "Store 持久化", "WithOut 模式" |
| `routing-permissions.md` | "如何配置路由？", "权限控制", "v-auth 指令" |
| `mock-service.md` | "如何写 Mock 数据？", "MSW 配置", "模拟错误" |
| `vue-development.md` | "shallowRef 用法", "Composable 模式", "响应式优化" |
| `typescript-patterns.md` | "类型定义", "工具类型", "类型守卫" |
| `component-architecture.md` | "组件设计", "配置驱动", "Home 布局" |
| `styling.md` | "UnoCSS 用法", "SCSS 变量", "响应式设计" |
| `testing.md` | "如何测试组件？", "Mock 函数", "覆盖率" |
| `performance.md` | "性能优化", "虚拟滚动", "代码分割" |

## 💡 最佳实践

### DO ✅

```bash
# 使用权限常量
import { SYSTEM_PERMISSIONS } from '@/permissions/system'
v-auth="SYSTEM_PERMISSIONS.USER.CREATE"

# 使用枚举类型
const status = ref<Status>(Status.PENDING)

# 使用 shallowRef 优化大对象
const largeData = shallowRef<DataItem[]>([])

# 使用 UnoCSS utilities
<div class="flex items-center justify-between p-16px">

# 使用 data-test 属性
<button data-test="submit-btn">提交</button>

# 使用 useXStoreWithOut
const userStore = useUserStoreWithOut()
```

### DON'T ❌

```bash
# 硬编码权限字符串
v-auth="'system:user:create'"

# 硬编码状态值
const status = 'pending'

# 深度响应式大对象
const largeData = ref<DataItem[]>([])

# 过度使用 scoped styles
<style lang="scss" scoped>
  .simple-flex { display: flex; }
</style>

# 使用 index 作为 key
<div v-for="(item, index) in items" :key="index">

# 模块顶层使用 Store
const userStore = useUserStore() // 错误！
```

## 🔧 常用代码片段

### Pinia Store 模板

```typescript
import { defineStore } from 'pinia'
import { store } from '../index'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    data: null as DataType | null
  }),

  getters: {
    getData(): DataType | null {
      return this.data
    }
  },

  actions: {
    async fetchData() {
      this.data = await api.getData()
    }
  },

  persist: {
    enabled: true,
    strategies: [{ key: 'my-store', storage: localStorage }]
  }
})

export const useMyStoreWithOut = () => useMyStore(store)
```

### 路由配置模板

```typescript
{
  path: '/module',
  component: Layout,
  name: 'Module',
  meta: {
    title: '模块',
    icon: 'module',
    permissions: ['module:query']
  },
  children: [
    {
      path: 'list',
      name: 'ModuleList',
      component: () => import('@/views/Module/List.vue'),
      meta: {
        title: '列表',
        permissions: ['module:query']
      }
    }
  ]
}
```

### API 模板

```typescript
import request from '@/config/axios'

export const getResourcePage = (params: ResourcePageReqVO) => {
  return request.get({ url: '/resource/page', params })
}

export const getResource = (id: number) => {
  return request.get({ url: `/resource/get?id=${id}` })
}

export const createResource = (data: ResourceVO) => {
  return request.post({ url: '/resource/create', data })
}

export const updateResource = (data: ResourceVO) => {
  return request.put({ url: '/resource/update', data })
}

export const deleteResource = (id: number) => {
  return request.delete({ url: `/resource/delete?id=${id}` })
}
```

### Composable 模板

```typescript
import { ref, computed } from 'vue'

export interface UseFeatureOptions {
  initialValue?: any
}

export function useFeature(options: UseFeatureOptions = {}) {
  const state = ref(options.initialValue)

  const computedValue = computed(() => {
    return state.value // 计算逻辑
  })

  const method = () => {
    // 方法逻辑
  }

  return {
    state,
    computedValue,
    method
  }
}
```

### 组件测试模板

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

describe('Component', () => {
  it('should render correctly', () => {
    const wrapper = mount(Component)
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit event', async () => {
    const wrapper = mount(Component)
    await wrapper.find('[data-test="btn"]').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## 🚨 常见错误

### 错误 1: Permission 不生效

```typescript
// ❌ 错误
v-auth="'system:user:create'"

// ✅ 正确
import { SYSTEM_PERMISSIONS } from '@/permissions/system'
v-auth="SYSTEM_PERMISSIONS.USER.CREATE"
```

### 错误 2: Store 在模块顶层使用

```typescript
// ❌ 错误
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore() // 未初始化！

// ✅ 正确
import { useUserStoreWithOut } from '@/store/modules/user'
const userStore = useUserStoreWithOut()
```

### 错误 3: 深度响应式大对象

```typescript
// ❌ 错误
const largeData = ref<DataItem[]>(new Array(10000))

// ✅ 正确
const largeData = shallowRef<DataItem[]>(new Array(10000))
```

### 错误 4: 动态路由未缓存

```typescript
// ❌ 错误
{
  path: 'detail/:id',
  meta: {
    noCache: false // 动态参数页面不应缓存
  }
}

// ✅ 正确
{
  path: 'detail/:id',
  meta: {
    noCache: true,
    hidden: true,
    activeMenu: '/resource/list'
  }
}
```

## 🎯 性能优化检查清单

- [ ] 大对象使用 `shallowRef` 或 `markRaw`
- [ ] 重型组件使用 `defineAsyncComponent`
- [ ] 大列表使用虚拟滚动
- [ ] 正确使用 `v-memo` 缓存
- [ ] 限制 `keepAlive` 缓存数量
- [ ] 图片使用 `loading="lazy"`
- [ ] 代码分割合理配置
- [ ] 请求使用防抖/节流
- [ ] CSS 使用 `transform` 代替 `left/top`
- [ ] 清理事件监听器和定时器

## 📞 获取帮助

```bash
# 在 Claude Code 中
/help                    # 查看所有 Commands

# 提问触发 Skills
"如何创建 Pinia Store？"
"v-auth 指令如何使用？"
"如何优化列表性能？"

# 查看文档
cat .claude/USAGE.md     # 使用指南
cat .claude/commands/store.md  # Command 文档
cat .claude/skills/state-management.md  # Skill 文档
```

## 🔗 相关文档

- [完整使用指南](./.claude/USAGE.md)
- [项目技术文档](./CLAUDE.md)
- [Claude Code 官方文档](https://docs.claude.com/claude-code)

---

**提示**: 将此文件保存或打印，放在手边随时查阅！ 📌
