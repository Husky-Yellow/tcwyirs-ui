# 路由与权限管理技能

掌握项目的动态路由、权限控制和菜单渲染系统。

## 路由系统架构

### 核心文件

```
src/
├── router/
│   ├── index.ts              # 路由实例和基础配置
│   └── modules/              # 路由模块
│       ├── remaining.ts      # 静态路由（无需权限）
│       └── [feature].ts      # 功能模块路由
├── permission.ts             # 全局导航守卫
└── store/modules/
    ├── user.ts               # 用户、角色、权限
    └── permission.ts         # 动态路由管理
```

### 路由类型

1. **静态路由（White List）** - 无需权限即可访问
2. **动态路由** - 根据用户角色/权限动态生成

## 路由配置

### 基本路由定义

```typescript
import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'system',
    alwaysShow: true, // 始终显示根菜单
    hidden: false, // 是否在菜单中隐藏
    noCache: false, // 是否不缓存（keepAlive）
    affix: false, // 是否固定在 tagsView
    breadcrumb: true, // 是否显示面包屑
    activeMenu: '', // 激活的菜单路径
    noTagsView: false, // 是否不显示在 tagsView
    canTo: true // 是否可以跳转
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/System/User/Index.vue'),
      meta: {
        title: '用户管理',
        icon: 'user',
        permissions: ['system:user:query'] // 权限标识
      }
    }
  ]
}
```

### Meta 字段详解

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | string | - | 路由标题（菜单、面包屑、tagsView） |
| `icon` | string | - | 菜单图标 |
| `hidden` | boolean | false | 是否在菜单中隐藏 |
| `alwaysShow` | boolean | false | 只有一个子路由时是否显示根菜单 |
| `noCache` | boolean | false | 是否不缓存（true 则不使用 keepAlive） |
| `affix` | boolean | false | 是否固定在 tagsView（如首页） |
| `breadcrumb` | boolean | true | 是否显示在面包屑 |
| `activeMenu` | string | - | 高亮的菜单路径 |
| `noTagsView` | boolean | false | 是否不显示在 tagsView |
| `canTo` | boolean | true | 是否可以通过路由跳转 |
| `permissions` | string[] | - | 权限标识数组 |
| `roles` | string[] | - | 角色标识数组 |

### 常见路由模式

#### 1. 基础 CRUD 页面

```typescript
{
  path: '/resource',
  component: Layout,
  name: 'Resource',
  meta: {
    title: '资源管理',
    icon: 'resource'
  },
  children: [
    {
      path: 'list',
      name: 'ResourceList',
      component: () => import('@/views/Resource/List.vue'),
      meta: {
        title: '资源列表',
        permissions: ['resource:query']
      }
    },
    {
      path: 'detail/:id',
      name: 'ResourceDetail',
      component: () => import('@/views/Resource/Detail.vue'),
      meta: {
        title: '资源详情',
        hidden: true, // 不在菜单显示
        activeMenu: '/resource/list', // 激活"资源列表"菜单
        noCache: true, // 不缓存（因为有动态参数）
        permissions: ['resource:query']
      }
    }
  ]
}
```

#### 2. 单页路由

```typescript
{
  path: '/dashboard',
  component: Layout,
  name: 'Dashboard',
  children: [
    {
      path: '', // 空路径，访问 /dashboard 直接显示
      name: 'DashboardIndex',
      component: () => import('@/views/Dashboard/Index.vue'),
      meta: {
        title: '工作台',
        icon: 'dashboard',
        affix: true, // 固定在 tagsView
        noCache: false // 缓存页面
      }
    }
  ]
}
```

#### 3. 外部链接

```typescript
{
  path: '/external-link',
  component: Layout,
  children: [
    {
      path: 'https://docs.example.com',
      name: 'ExternalLink',
      meta: {
        title: '外部文档',
        icon: 'link'
      }
    }
  ]
}
```

#### 4. 嵌套路由

```typescript
{
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'system',
    alwaysShow: true // 始终显示父菜单
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/System/User/Index.vue'),
      meta: { title: '用户管理' }
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/System/Role/Index.vue'),
      meta: { title: '角色管理' }
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/System/Menu/Index.vue'),
      meta: { title: '菜单管理' }
    }
  ]
}
```

## 权限控制

### 权限标识格式

```
<模块>:<资源>:<操作>

示例：
- system:user:query    # 查询用户
- system:user:create   # 创建用户
- system:user:update   # 更新用户
- system:user:delete   # 删除用户
- *:*:*                # 所有权限（超级管理员）
```

### 角色与权限

```typescript
// 用户角色
roles: ['admin', 'resourceAdmin', 'user']

// 用户权限
permissions: [
  'system:user:query',
  'system:user:create',
  'resource:query',
  'resource:create'
]
```

### 路由权限配置

#### 1. 基于权限

```typescript
{
  path: 'user',
  name: 'User',
  component: () => import('@/views/System/User/Index.vue'),
  meta: {
    title: '用户管理',
    permissions: ['system:user:query'] // 需要该权限
  }
}
```

#### 2. 基于角色

```typescript
{
  path: 'admin-panel',
  name: 'AdminPanel',
  component: () => import('@/views/Admin/Index.vue'),
  meta: {
    title: '管理员面板',
    roles: ['admin', 'super_admin'] // 仅这些角色可访问
  }
}
```

#### 3. 公开路由（无权限）

```typescript
{
  path: '/public',
  component: Layout,
  meta: {
    title: '公开页面'
    // 无 permissions 或 roles 字段
  }
}
```

## 导航守卫流程

### 全局前置守卫 (`src/permission.ts`)

```typescript
import router from './router'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import NProgress from 'nprogress'

// 白名单路由（无需登录）
const whiteList = ['/login', '/404', '/401']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()

  const hasToken = userStore.getToken

  if (hasToken) {
    // 已登录
    if (to.path === '/login') {
      // 访问登录页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查是否已获取用户信息
      const hasRoles = userStore.getRoles && userStore.getRoles.length > 0

      if (hasRoles) {
        // 已有用户信息，直接放行
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfo()

          // 根据角色生成动态路由
          const roles = userStore.getRoles
          const accessRoutes = await permissionStore.generateRoutes(roles)

          // 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 重新触发路由（确保 addRoutes 已完成）
          next({ ...to, replace: true })
        } catch (error) {
          // 获取失败，清除 token 并跳转登录
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 白名单路由，直接放行
      next()
    } else {
      // 跳转登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}` : import.meta.env.VITE_APP_TITLE

  NProgress.done()
})
```

### 导航流程图

```
用户访问页面
    ↓
检查是否有 token
    ↓
有 token → 检查是否有用户信息
    ↓
无用户信息 → 获取用户信息 → 生成动态路由 → 添加路由 → 放行
    ↓
有用户信息 → 直接放行
    ↓
无 token → 检查是否在白名单
    ↓
在白名单 → 放行
    ↓
不在白名单 → 跳转登录页
```

## 动态路由生成

### Permission Store (`src/store/modules/permission.ts`)

```typescript
import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { store } from '../index'
import { flatMultiLevelRoutes } from '@/utils/routerHelper'
import { cloneDeep } from 'lodash-es'

interface PermissionState {
  routes: RouteRecordRaw[] // 所有路由
  addRoutes: RouteRecordRaw[] // 动态添加的路由
  menuRoutes: RouteRecordRaw[] // 菜单路由
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
    menuRoutes: []
  }),

  getters: {
    getRoutes(): RouteRecordRaw[] {
      return this.routes
    },
    getAddRoutes(): RouteRecordRaw[] {
      return this.addRoutes
    },
    getMenuRoutes(): RouteRecordRaw[] {
      return this.menuRoutes
    }
  },

  actions: {
    // 生成路由
    async generateRoutes(roles: string[]): Promise<RouteRecordRaw[]> {
      // 导入所有路由模块
      const modules = import.meta.glob('../router/modules/**/*.ts', { eager: true })

      const routeModuleList: RouteRecordRaw[] = []

      Object.keys(modules).forEach((key) => {
        const mod = modules[key].default || {}
        const modList = Array.isArray(mod) ? [...mod] : [mod]
        routeModuleList.push(...modList)
      })

      // 过滤路由（基于权限）
      const accessedRoutes = filterAsyncRoutes(routeModuleList, roles)

      // 扁平化多级路由
      const flatRoutes = flatMultiLevelRoutes(cloneDeep(accessedRoutes))

      this.addRoutes = accessedRoutes
      this.routes = [...constantRoutes, ...accessedRoutes]
      this.menuRoutes = accessedRoutes

      return flatRoutes
    },

    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = [...constantRoutes, ...routes]
    }
  }
})

// 过滤异步路由
function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }

    if (hasPermission(tmp, roles)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 检查权限
function hasPermission(route: RouteRecordRaw, roles: string[]): boolean {
  if (route.meta && route.meta.roles) {
    // 基于角色
    return roles.some(role => (route.meta!.roles as string[]).includes(role))
  }

  // 无权限限制或基于 permissions（在组件内检查）
  return true
}

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
```

## 按钮级权限控制

### v-auth 指令

```vue
<template>
  <div>
    <!-- 按钮权限控制 -->
    <el-button v-auth="'system:user:create'" type="primary">
      新增用户
    </el-button>

    <el-button v-auth="'system:user:update'" type="warning">
      编辑用户
    </el-button>

    <el-button v-auth="'system:user:delete'" type="danger">
      删除用户
    </el-button>

    <!-- 多个权限（满足任一即可） -->
    <el-button v-auth="['system:user:create', 'system:user:update']">
      操作
    </el-button>
  </div>
</template>
```

### 指令实现 (`src/directives/permission/auth.ts`)

```typescript
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'

// 检查权限
function checkPermission(el: Element, binding: DirectiveBinding) {
  const { value } = binding
  const userStore = useUserStoreWithOut()
  const permissions = userStore.getPermissions

  if (value) {
    const requiredPermissions = Array.isArray(value) ? value : [value]
    const hasPermission = permissions.some((permission) => {
      return requiredPermissions.includes(permission) || permission === '*:*:*'
    })

    if (!hasPermission) {
      // 无权限，移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

export const auth: Directive = {
  mounted(el: Element, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  updated(el: Element, binding: DirectiveBinding) {
    checkPermission(el, binding)
  }
}
```

### 组合式 API 权限检查

```typescript
// src/hooks/web/usePermission.ts
import { useUserStoreWithOut } from '@/store/modules/user'

export function usePermission() {
  const userStore = useUserStoreWithOut()

  // 检查权限
  const hasPermission = (permissions: string | string[]): boolean => {
    const userPermissions = userStore.getPermissions
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions]

    return userPermissions.some((permission) => {
      return requiredPermissions.includes(permission) || permission === '*:*:*'
    })
  }

  // 检查角色
  const hasRole = (roles: string | string[]): boolean => {
    const userRoles = userStore.getRoles
    const requiredRoles = Array.isArray(roles) ? roles : [roles]

    return userRoles.some((role) => requiredRoles.includes(role))
  }

  return {
    hasPermission,
    hasRole
  }
}
```

**使用示例**：

```vue
<script setup lang="ts">
import { usePermission } from '@/hooks/web/usePermission'

const { hasPermission, hasRole } = usePermission()

// 条件渲染
const canCreate = hasPermission('system:user:create')
const isAdmin = hasRole('admin')

// 方法中使用
function handleEdit() {
  if (!hasPermission('system:user:update')) {
    ElMessage.warning('无权限编辑')
    return
  }

  // 编辑逻辑
}
</script>

<template>
  <div>
    <el-button v-if="canCreate" @click="handleCreate">新增</el-button>
    <div v-if="isAdmin">管理员专属内容</div>
  </div>
</template>
```

## KeepAlive 缓存

### 配置缓存

```typescript
{
  path: 'list',
  name: 'ResourceList',
  component: () => import('@/views/Resource/List.vue'),
  meta: {
    title: '资源列表',
    noCache: false // 启用缓存（默认）
  }
}

{
  path: 'detail/:id',
  name: 'ResourceDetail',
  component: () => import('@/views/Resource/Detail.vue'),
  meta: {
    title: '资源详情',
    noCache: true // 禁用缓存（动态参数页面）
  }
}
```

### Layout 中的 KeepAlive

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()

// 缓存的视图名称列表
const cachedViews = computed(() => {
  return Array.from(tagsViewStore.cachedViews)
})
</script>
```

## 菜单渲染

### 递归菜单组件

```vue
<!-- src/components/Menu/src/Menu.vue -->
<template>
  <el-menu>
    <menu-item
      v-for="route in menuRoutes"
      :key="route.path"
      :route="route"
    />
  </el-menu>
</template>

<!-- src/components/Menu/src/MenuItem.vue -->
<template>
  <template v-if="!route.meta?.hidden">
    <!-- 有子菜单 -->
    <el-sub-menu v-if="hasChildren" :index="route.path">
      <template #title>
        <Icon v-if="route.meta?.icon" :icon="route.meta.icon" />
        <span>{{ route.meta?.title }}</span>
      </template>

      <menu-item
        v-for="child in route.children"
        :key="child.path"
        :route="child"
      />
    </el-sub-menu>

    <!-- 无子菜单 -->
    <el-menu-item v-else :index="route.path">
      <Icon v-if="route.meta?.icon" :icon="route.meta.icon" />
      <span>{{ route.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'

interface Props {
  route: RouteRecordRaw
}

const props = defineProps<Props>()

const hasChildren = computed(() => {
  return props.route.children && props.route.children.length > 0
})
</script>
```

## 最佳实践

### 1. 路由命名规范

```typescript
// ✅ 推荐
{
  path: '/system/user',
  name: 'SystemUser', // 驼峰命名，见名知意
  component: () => import('@/views/System/User/Index.vue')
}

// ❌ 避免
{
  path: '/system/user',
  name: 'user', // 太简单，易冲突
  component: () => import('@/views/System/User/Index.vue')
}
```

### 2. Meta 配置原则

```typescript
// ✅ 最小化配置
{
  meta: {
    title: '用户管理',
    permissions: ['system:user:query']
  }
}

// ❌ 过度配置
{
  meta: {
    title: '用户管理',
    icon: 'user',
    hidden: false, // 默认值，无需配置
    noCache: false, // 默认值，无需配置
    breadcrumb: true, // 默认值，无需配置
    permissions: ['system:user:query']
  }
}
```

### 3. 权限粒度

- **路由级** - 控制页面访问
- **按钮级** - 控制操作权限
- **数据级** - 后端控制数据范围

### 4. 动态参数页面

```typescript
// 动态参数页面应禁用缓存
{
  path: 'detail/:id',
  name: 'ResourceDetail',
  component: () => import('@/views/Resource/Detail.vue'),
  meta: {
    noCache: true, // 必须禁用缓存
    hidden: true, // 不在菜单显示
    activeMenu: '/resource/list' // 激活父菜单
  }
}
```

### 5. 外部链接处理

```typescript
// 判断是否外部链接
function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 菜单组件中处理
if (isExternal(route.path)) {
  window.open(route.path, '_blank')
} else {
  router.push(route.path)
}
```

## 常见问题

**Q: 添加新路由后不显示？**
- 检查权限配置是否正确
- 检查 `hidden` 是否为 `true`
- 确认路由模块已被导入

**Q: 刷新页面后 404？**
- 动态路由未重新添加，检查导航守卫逻辑
- 确保在 `getUserInfo` 后调用 `generateRoutes`

**Q: KeepAlive 不生效？**
- 确保组件有 `name` 选项
- 检查 `noCache` 配置
- 确认 `cachedViews` 包含组件名

**Q: 权限不生效？**
- 检查后端返回的 permissions 数组
- 确认权限标识格式正确
- 验证 `v-auth` 指令是否正确注册

## 调试技巧

```typescript
// 查看当前路由
console.log('Current route:', router.currentRoute.value)

// 查看所有路由
console.log('All routes:', router.getRoutes())

// 查看用户权限
const userStore = useUserStoreWithOut()
console.log('User permissions:', userStore.getPermissions)
console.log('User roles:', userStore.getRoles)

// 查看缓存视图
const tagsViewStore = useTagsViewStore()
console.log('Cached views:', tagsViewStore.cachedViews)
```
