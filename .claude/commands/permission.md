# 配置权限

为路由、接口或功能配置权限标识和角色限制。

## 使用方法

```
/permission <资源名> [选项]
```

## 选项

- `--module=<模块>` - 所属模块（默认：system）
- `--actions=<操作>` - 操作列表（逗号分隔，默认：query,create,update,delete）
- `--roles=<角色>` - 限制角色（逗号分隔）

## 示例

```
/permission user
/permission resource --module=marketplace
/permission report --actions=query,export --roles=admin,dataAdmin
```

## 生成内容

### 1. 权限常量定义 (`src/permissions/[module].ts`)

```typescript
// src/permissions/system.ts

/**
 * 系统管理权限
 */
export const SYSTEM_PERMISSIONS = {
  // 用户管理
  USER: {
    QUERY: 'system:user:query',
    CREATE: 'system:user:create',
    UPDATE: 'system:user:update',
    DELETE: 'system:user:delete',
    EXPORT: 'system:user:export',
    IMPORT: 'system:user:import',
    RESET_PASSWORD: 'system:user:reset-password'
  },

  // 角色管理
  ROLE: {
    QUERY: 'system:role:query',
    CREATE: 'system:role:create',
    UPDATE: 'system:role:update',
    DELETE: 'system:role:delete',
    ASSIGN: 'system:role:assign'
  },

  // 菜单管理
  MENU: {
    QUERY: 'system:menu:query',
    CREATE: 'system:menu:create',
    UPDATE: 'system:menu:update',
    DELETE: 'system:menu:delete'
  }
} as const

// 类型定义
export type SystemPermission = typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS][keyof typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS]]
```

### 2. 路由权限配置

```typescript
// src/router/modules/system.ts
import { SYSTEM_PERMISSIONS } from '@/permissions/system'

const route: RouteRecordRaw = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: '系统管理',
    icon: 'system',
    roles: ['admin', 'super_admin'] // 角色限制
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/System/User/Index.vue'),
      meta: {
        title: '用户管理',
        permissions: [SYSTEM_PERMISSIONS.USER.QUERY] // 权限标识
      }
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/System/Role/Index.vue'),
      meta: {
        title: '角色管理',
        permissions: [SYSTEM_PERMISSIONS.ROLE.QUERY]
      }
    }
  ]
}
```

### 3. 页面权限控制

```vue
<template>
  <div class="user-management">
    <!-- 查询权限 -->
    <el-form v-auth="PERMISSIONS.USER.QUERY">
      <!-- 查询表单 -->
    </el-form>

    <!-- 新增按钮 -->
    <el-button
      v-auth="PERMISSIONS.USER.CREATE"
      type="primary"
      @click="handleCreate"
    >
      新增用户
    </el-button>

    <!-- 编辑按钮 -->
    <el-button
      v-auth="PERMISSIONS.USER.UPDATE"
      type="warning"
      @click="handleEdit"
    >
      编辑
    </el-button>

    <!-- 删除按钮 -->
    <el-button
      v-auth="PERMISSIONS.USER.DELETE"
      type="danger"
      @click="handleDelete"
    >
      删除
    </el-button>

    <!-- 多个权限（满足任一即可） -->
    <el-button
      v-auth="[PERMISSIONS.USER.CREATE, PERMISSIONS.USER.UPDATE]"
    >
      操作
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { SYSTEM_PERMISSIONS as PERMISSIONS } from '@/permissions/system'
import { usePermission } from '@/hooks/web/usePermission'

const { hasPermission, hasRole } = usePermission()

// 方法中使用权限检查
function handleEdit() {
  if (!hasPermission(PERMISSIONS.USER.UPDATE)) {
    ElMessage.warning('无权限编辑用户')
    return
  }

  // 编辑逻辑
}

// 角色检查
const isAdmin = hasRole('admin')
</script>
```

### 4. Mock 用户权限配置

```typescript
// src/mock/modules/auth/login.ts
import { SYSTEM_PERMISSIONS } from '@/permissions/system'
import { RESOURCE_PERMISSIONS } from '@/permissions/resource'

const userConfigs: Record<string, UserConfig> = {
  // 超级管理员（所有权限）
  admin: {
    user: {
      id: 1,
      username: 'admin',
      nickname: '超级管理员'
    },
    roles: ['admin', 'super_admin'],
    permissions: ['*:*:*'] // 所有权限
  },

  // 资源管理员
  resourceAdmin: {
    user: {
      id: 2,
      username: 'resourceAdmin',
      nickname: '资源管理员'
    },
    roles: ['resourceAdmin'],
    permissions: [
      // 资源模块所有权限
      ...Object.values(RESOURCE_PERMISSIONS.RESOURCE),

      // 系统模块部分权限
      SYSTEM_PERMISSIONS.USER.QUERY,
      SYSTEM_PERMISSIONS.ROLE.QUERY
    ]
  },

  // 普通用户
  user: {
    user: {
      id: 3,
      username: 'user',
      nickname: '普通用户'
    },
    roles: ['user'],
    permissions: [
      RESOURCE_PERMISSIONS.RESOURCE.QUERY,
      RESOURCE_PERMISSIONS.RESOURCE.CREATE,
      SYSTEM_PERMISSIONS.USER.QUERY // 仅查询自己的信息
    ]
  }
}
```

## 权限标识规范

### 格式

```
<模块>:<资源>:<操作>

示例：
- system:user:query    # 查询用户
- system:user:create   # 创建用户
- system:user:update   # 更新用户
- system:user:delete   # 删除用户
- resource:*           # 资源模块所有权限
- *:*:*                # 所有权限（超级管理员）
```

### 常用操作

- `query` - 查询（列表、详情）
- `create` - 创建
- `update` - 更新
- `delete` - 删除
- `export` - 导出
- `import` - 导入
- `assign` - 分配（如分配角色）
- `approve` - 审批
- `reject` - 驳回

## 权限检查方法

### 1. v-auth 指令

```vue
<template>
  <!-- 单个权限 -->
  <el-button v-auth="'system:user:create'">新增</el-button>

  <!-- 多个权限（或关系） -->
  <el-button v-auth="['system:user:create', 'system:user:update']">
    操作
  </el-button>

  <!-- 使用权限常量 -->
  <el-button v-auth="PERMISSIONS.USER.DELETE">删除</el-button>
</template>
```

### 2. usePermission Hook

```typescript
import { usePermission } from '@/hooks/web/usePermission'

const { hasPermission, hasRole } = usePermission()

// 检查单个权限
if (hasPermission('system:user:create')) {
  // 有权限
}

// 检查多个权限（或关系）
if (hasPermission(['system:user:create', 'system:user:update'])) {
  // 有任一权限
}

// 检查角色
if (hasRole('admin')) {
  // 是管理员
}

// 检查多个角色
if (hasRole(['admin', 'super_admin'])) {
  // 有任一角色
}
```

### 3. 计算属性

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { usePermission } from '@/hooks/web/usePermission'
import { SYSTEM_PERMISSIONS as PERMISSIONS } from '@/permissions/system'

const { hasPermission, hasRole } = usePermission()

// 权限计算属性
const canCreate = computed(() => hasPermission(PERMISSIONS.USER.CREATE))
const canUpdate = computed(() => hasPermission(PERMISSIONS.USER.UPDATE))
const canDelete = computed(() => hasPermission(PERMISSIONS.USER.DELETE))
const isAdmin = computed(() => hasRole('admin'))
</script>

<template>
  <el-button v-if="canCreate" @click="handleCreate">新增</el-button>
  <el-button v-if="canUpdate" @click="handleEdit">编辑</el-button>
  <el-button v-if="canDelete" @click="handleDelete">删除</el-button>
  <div v-if="isAdmin">管理员专属内容</div>
</template>
```

## 角色定义

### 项目角色

```typescript
// src/types/role.ts

/**
 * 系统角色
 */
export enum SystemRole {
  // 超级管理员
  SUPER_ADMIN = 'super_admin',

  // 普通管理员
  ADMIN = 'admin',

  // 资源管理员
  RESOURCE_ADMIN = 'resourceAdmin',

  // 运营管理员
  OPERATION_ADMIN = 'operationAdmin',

  // 数据管理员
  DATA_ADMIN = 'dataAdmin',

  // 普通用户
  USER = 'user',

  // 访客
  GUEST = 'guest'
}

/**
 * 角色描述
 */
export const ROLE_DESCRIPTIONS: Record<SystemRole, string> = {
  [SystemRole.SUPER_ADMIN]: '超级管理员 - 拥有所有权限',
  [SystemRole.ADMIN]: '管理员 - 系统管理权限',
  [SystemRole.RESOURCE_ADMIN]: '资源管理员 - 资源审核和管理',
  [SystemRole.OPERATION_ADMIN]: '运营管理员 - 运营数据管理',
  [SystemRole.DATA_ADMIN]: '数据管理员 - 数据分析和统计',
  [SystemRole.USER]: '普通用户 - 基础功能使用',
  [SystemRole.GUEST]: '访客 - 仅查看公开内容'
}
```

### 角色权限映射

```typescript
// src/config/role-permissions.ts
import { SystemRole } from '@/types/role'
import { SYSTEM_PERMISSIONS } from '@/permissions/system'
import { RESOURCE_PERMISSIONS } from '@/permissions/resource'

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS_MAP: Record<SystemRole, string[]> = {
  // 超级管理员 - 所有权限
  [SystemRole.SUPER_ADMIN]: ['*:*:*'],

  // 管理员 - 系统管理权限
  [SystemRole.ADMIN]: [
    ...Object.values(SYSTEM_PERMISSIONS.USER),
    ...Object.values(SYSTEM_PERMISSIONS.ROLE),
    ...Object.values(SYSTEM_PERMISSIONS.MENU)
  ],

  // 资源管理员 - 资源管理权限
  [SystemRole.RESOURCE_ADMIN]: [
    ...Object.values(RESOURCE_PERMISSIONS.RESOURCE),
    SYSTEM_PERMISSIONS.USER.QUERY
  ],

  // 运营管理员 - 运营权限
  [SystemRole.OPERATION_ADMIN]: [
    'operation:*:*'
  ],

  // 数据管理员 - 数据权限
  [SystemRole.DATA_ADMIN]: [
    'data:*:query',
    'data:*:export'
  ],

  // 普通用户 - 基础权限
  [SystemRole.USER]: [
    RESOURCE_PERMISSIONS.RESOURCE.QUERY,
    RESOURCE_PERMISSIONS.RESOURCE.CREATE,
    SYSTEM_PERMISSIONS.USER.QUERY // 仅查询自己
  ],

  // 访客 - 仅查看
  [SystemRole.GUEST]: [
    'public:*:query'
  ]
}
```

## 数据级权限

### 数据过滤

```typescript
// 用户只能查看自己创建的数据
export function filterByCreator<T extends { creatorId: number }>(
  data: T[],
  userId: number
): T[] {
  return data.filter(item => item.creatorId === userId)
}

// 管理员可以查看所有数据
export function filterByRole<T>(
  data: T[],
  role: string
): T[] {
  if (role === 'admin' || role === 'super_admin') {
    return data // 返回所有数据
  }

  return filterByCreator(data, currentUserId)
}
```

### API 权限验证

```typescript
// src/api/interceptors.ts
service.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data

    // 权限错误
    if (code === 403) {
      ElMessage.error(msg || '无权限访问')
      return Promise.reject(new Error(msg || '无权限'))
    }

    return response
  },
  (error) => {
    if (error.response?.status === 403) {
      ElMessage.error('无权限访问')
    }

    return Promise.reject(error)
  }
)
```

## 权限最佳实践

### 1. 使用常量

```typescript
// ✅ 推荐：使用权限常量
import { SYSTEM_PERMISSIONS } from '@/permissions/system'

v-auth="SYSTEM_PERMISSIONS.USER.CREATE"

// ❌ 避免：硬编码权限字符串
v-auth="'system:user:create'"
```

### 2. 权限检查位置

```typescript
// ✅ 路由级权限 - 控制页面访问
{
  meta: {
    permissions: ['system:user:query']
  }
}

// ✅ 按钮级权限 - 控制操作
<el-button v-auth="PERMISSIONS.USER.CREATE">

// ✅ 数据级权限 - 后端控制
// 在 API 返回前过滤数据
```

### 3. 权限粒度

```typescript
// ✅ 细粒度权限
PERMISSIONS.USER.CREATE
PERMISSIONS.USER.UPDATE
PERMISSIONS.USER.DELETE

// ⚠️ 粗粒度权限（特殊场景）
PERMISSIONS.USER.ALL // 'system:user:*'
```

## 常见问题

**Q: 权限不生效？**
- 检查后端返回的 permissions 数组
- 确认权限标识格式正确
- 验证 `v-auth` 指令是否正确注册

**Q: 如何调试权限？**
```typescript
const userStore = useUserStore()
console.log('User permissions:', userStore.getPermissions)
console.log('User roles:', userStore.getRoles)
```

**Q: 超级管理员如何配置？**
```typescript
permissions: ['*:*:*'] // 匹配所有权限
```

**Q: 如何实现数据级权限？**
在后端 API 根据用户角色过滤数据，前端仅做 UI 展示控制。
