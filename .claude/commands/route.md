# 添加路由配置

快速创建符合项目规范的路由配置，包括路由定义、meta 配置和权限设置。

## 使用方法

```
/route <模块名> [选项]
```

## 选项

- `--path=<路径>` - 路由路径（默认：/模块名）
- `--permission=<权限>` - 权限标识（默认：模块名:query）
- `--icon=<图标>` - 菜单图标
- `--parent=<父路由>` - 父路由路径（嵌套路由）
- `--hidden` - 在菜单中隐藏
- `--no-cache` - 禁用页面缓存

## 示例

```
/route resource
/route resource --icon=resource --permission=resource:query
/route user-detail --parent=/system/user --hidden --no-cache
/route dashboard --path=/ --icon=dashboard
```

## 生成内容

### 1. 路由模块文件 (`src/router/modules/[module].ts`)

```typescript
import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/utils/routerHelper'

const route: RouteRecordRaw = {
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
    }
  ]
}

export default route
```

### 2. 页面组件 (`src/views/[Module]/[Page].vue`)

```vue
<template>
  <ContentWrap>
    <div class="resource-list">
      <!-- 页面内容 -->
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
defineOptions({ name: 'ResourceList' })

// 组件逻辑
</script>

<style lang="scss" scoped>
.resource-list {
  // 样式
}
</style>
```

## 路由配置模式

### 1. 基础单页路由

```typescript
{
  path: '/dashboard',
  component: Layout,
  name: 'Dashboard',
  children: [
    {
      path: '',
      name: 'DashboardIndex',
      component: () => import('@/views/Dashboard/Index.vue'),
      meta: {
        title: '工作台',
        icon: 'dashboard',
        affix: true // 固定在 tagsView
      }
    }
  ]
}
```

### 2. CRUD 模块路由

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
      path: 'create',
      name: 'ResourceCreate',
      component: () => import('@/views/Resource/Form.vue'),
      meta: {
        title: '创建资源',
        hidden: true, // 不在菜单显示
        activeMenu: '/resource/list',
        permissions: ['resource:create']
      }
    },
    {
      path: 'edit/:id',
      name: 'ResourceEdit',
      component: () => import('@/views/Resource/Form.vue'),
      meta: {
        title: '编辑资源',
        hidden: true,
        activeMenu: '/resource/list',
        noCache: true, // 动态参数，不缓存
        permissions: ['resource:update']
      }
    },
    {
      path: 'detail/:id',
      name: 'ResourceDetail',
      component: () => import('@/views/Resource/Detail.vue'),
      meta: {
        title: '资源详情',
        hidden: true,
        activeMenu: '/resource/list',
        noCache: true,
        permissions: ['resource:query']
      }
    }
  ]
}
```

### 3. 多级嵌套路由

```typescript
{
  path: '/system',
  component: Layout,
  name: 'System',
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    icon: 'system',
    alwaysShow: true // 始终显示父菜单
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/System/User/Index.vue'),
      meta: {
        title: '用户管理',
        permissions: ['system:user:query']
      }
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/System/Role/Index.vue'),
      meta: {
        title: '角色管理',
        permissions: ['system:role:query']
      }
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/System/Menu/Index.vue'),
      meta: {
        title: '菜单管理',
        permissions: ['system:menu:query']
      }
    }
  ]
}
```

### 4. 外部链接路由

```typescript
{
  path: '/external',
  component: Layout,
  children: [
    {
      path: 'https://docs.example.com',
      name: 'ExternalDoc',
      meta: {
        title: '外部文档',
        icon: 'link'
      }
    }
  ]
}
```

## Meta 字段说明

### 基础字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 页面标题 | '用户管理' |
| `icon` | string | 菜单图标 | 'user' |
| `permissions` | string[] | 权限标识 | ['system:user:query'] |
| `roles` | string[] | 角色限制 | ['admin', 'super_admin'] |

### 显示控制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hidden` | boolean | false | 是否在菜单中隐藏 |
| `alwaysShow` | boolean | false | 只有一个子路由时是否显示根菜单 |
| `noTagsView` | boolean | false | 是否不显示在 tagsView |
| `breadcrumb` | boolean | true | 是否显示在面包屑 |

### 功能控制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `noCache` | boolean | false | 是否不缓存（禁用 keepAlive） |
| `affix` | boolean | false | 是否固定在 tagsView |
| `canTo` | boolean | true | 是否可以通过路由跳转 |
| `activeMenu` | string | - | 激活的菜单路径 |

## 权限配置

### 权限标识格式

```
<模块>:<资源>:<操作>

示例：
- system:user:query    # 查询用户
- system:user:create   # 创建用户
- system:user:update   # 更新用户
- system:user:delete   # 删除用户
- resource:*           # 资源模块所有权限
- *:*:*                # 所有权限
```

### 路由权限配置示例

```typescript
// 1. 单个权限
{
  meta: {
    permissions: ['system:user:query']
  }
}

// 2. 多个权限（满足任一即可）
{
  meta: {
    permissions: ['system:user:query', 'system:user:create']
  }
}

// 3. 角色限制
{
  meta: {
    roles: ['admin', 'super_admin']
  }
}

// 4. 无权限限制（公开页面）
{
  meta: {
    title: '公开页面'
    // 无 permissions 或 roles 字段
  }
}
```

## 缓存策略

### 启用缓存

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
```

**适用场景**：
- 列表页面
- 数据展示页面
- 不包含动态参数的页面

### 禁用缓存

```typescript
{
  path: 'detail/:id',
  name: 'ResourceDetail',
  component: () => import('@/views/Resource/Detail.vue'),
  meta: {
    title: '资源详情',
    noCache: true // 禁用缓存
  }
}
```

**适用场景**：
- 带动态参数的页面（`:id`）
- 表单页面
- 实时数据页面

## 菜单显示控制

### 隐藏路由

```typescript
{
  path: 'detail/:id',
  name: 'ResourceDetail',
  component: () => import('@/views/Resource/Detail.vue'),
  meta: {
    title: '资源详情',
    hidden: true, // 不在菜单显示
    activeMenu: '/resource/list' // 激活"资源列表"菜单
  }
}
```

### 固定在 tagsView

```typescript
{
  path: '',
  name: 'Dashboard',
  component: () => import('@/views/Dashboard/Index.vue'),
  meta: {
    title: '工作台',
    affix: true // 固定，无法关闭
  }
}
```

### 始终显示父菜单

```typescript
{
  path: '/system',
  component: Layout,
  meta: {
    title: '系统管理',
    alwaysShow: true // 即使只有一个子路由，也显示父菜单
  },
  children: [
    {
      path: 'user',
      // ...
    }
  ]
}
```

## 路由注册

### 1. 创建路由模块

在 `src/router/modules/` 下创建路由文件：

```typescript
// src/router/modules/resource.ts
import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/utils/routerHelper'

const route: RouteRecordRaw = {
  // 路由配置
}

export default route
```

### 2. 自动导入

路由模块会通过 `import.meta.glob` 自动导入，无需手动注册：

```typescript
// src/store/modules/permission.ts
const modules = import.meta.glob('../router/modules/**/*.ts', { eager: true })

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})
```

## 常见路由场景

### 1. 首页/工作台

```typescript
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/Index.vue'),
      meta: {
        title: '工作台',
        icon: 'dashboard',
        affix: true
      }
    }
  ]
}
```

### 2. 列表 + 详情

```typescript
{
  path: '/article',
  component: Layout,
  children: [
    {
      path: 'list',
      name: 'ArticleList',
      component: () => import('@/views/Article/List.vue'),
      meta: {
        title: '文章列表'
      }
    },
    {
      path: 'detail/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/Article/Detail.vue'),
      meta: {
        title: '文章详情',
        hidden: true,
        activeMenu: '/article/list',
        noCache: true
      }
    }
  ]
}
```

### 3. 表单页面

```typescript
{
  path: '/resource',
  component: Layout,
  children: [
    {
      path: 'create',
      name: 'ResourceCreate',
      component: () => import('@/views/Resource/Form.vue'),
      meta: {
        title: '创建资源',
        hidden: true,
        activeMenu: '/resource/list',
        permissions: ['resource:create']
      }
    },
    {
      path: 'edit/:id',
      name: 'ResourceEdit',
      component: () => import('@/views/Resource/Form.vue'),
      meta: {
        title: '编辑资源',
        hidden: true,
        activeMenu: '/resource/list',
        noCache: true,
        permissions: ['resource:update']
      }
    }
  ]
}
```

### 4. 多标签页

```typescript
{
  path: '/profile',
  component: Layout,
  children: [
    {
      path: '',
      name: 'Profile',
      component: () => import('@/views/Profile/Index.vue'),
      meta: {
        title: '个人中心',
        noCache: true // Tab 切换不缓存
      }
    }
  ]
}
```

## 命名规范

### 路由命名

```typescript
// ✅ 推荐：模块 + 页面，驼峰命名
name: 'SystemUser'
name: 'ResourceList'
name: 'ArticleDetail'

// ❌ 避免：太简单，易冲突
name: 'User'
name: 'List'
name: 'Detail'
```

### 路径命名

```typescript
// ✅ 推荐：kebab-case
path: '/system-management/user-list'

// ❌ 避免：驼峰或下划线
path: '/systemManagement/userList'
path: '/system_management/user_list'
```

## 最佳实践

1. **权限粒度** - 路由配置细粒度权限，页面内可复用
2. **缓存策略** - 带动态参数的页面禁用缓存
3. **菜单激活** - 详情页使用 `activeMenu` 激活列表菜单
4. **命名规范** - 使用清晰的模块 + 页面命名
5. **懒加载** - 所有页面组件使用动态导入
6. **面包屑** - 合理配置 `title` 和 `breadcrumb`
7. **重定向** - 为包含多个子路由的父路由配置 `redirect`

## 调试技巧

```typescript
// 查看所有路由
import { useRouter } from 'vue-router'
const router = useRouter()
console.log('All routes:', router.getRoutes())

// 查看当前路由
console.log('Current route:', router.currentRoute.value)

// 查看路由 meta
console.log('Route meta:', router.currentRoute.value.meta)
```

## 常见问题

**Q: 新路由不显示？**
- 检查权限配置是否正确
- 确认 `hidden` 不是 `true`
- 查看导航守卫是否正常执行

**Q: 刷新页面 404？**
- 动态路由未重新添加
- 检查 `permission.ts` 导航守卫

**Q: keepAlive 不生效？**
- 组件必须有 `name` 选项
- 检查 `noCache` 配置
- 确认组件名在 `cachedViews` 中

**Q: 菜单高亮不正确？**
- 使用 `activeMenu` 指定激活路径
- 检查路由 `path` 配置是否正确
