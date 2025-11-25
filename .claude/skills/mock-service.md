# MSW Mock 服务技能

掌握项目的 Mock Service Worker (MSW) mock 数据配置和最佳实践。

## MSW 简介

Mock Service Worker 是一个API mocking库，通过拦截网络请求在浏览器层面提供 mock 数据，无需修改应用代码。

**优势**：
- 真实的网络行为模拟
- 开发和测试环境复用
- 无需后端即可前端开发
- 易于维护和扩展

## 项目配置

### 初始化 (`src/mock/index.ts`)

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export function setupMock(enabled = import.meta.env.DEV) {
  if (!enabled) {
    console.log('[MSW] Mock service disabled')
    return
  }

  worker.start({
    onUnhandledRequest: 'bypass', // 未匹配请求直接放行
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })

  console.log('[MSW] Mock service enabled')
}
```

### 主入口启动 (`src/main.ts`)

```typescript
import { setupMock } from './mock'

// 仅在开发环境启用 mock
if (import.meta.env.DEV) {
  setupMock()
}

createApp(App).mount('#app')
```

## Mock 配置结构

### Handler 定义

```typescript
// src/mock/modules/system/user.ts
import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { UserVO, UserPageReqVO } from '@/api/system/types'

const mockUsers: UserVO[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    mobile: '13800138000',
    sex: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00'
  }
]

const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/system/user/page',
    type: 'get',
    timeout: 100,
    response: ({ query }): ApiResponse<PageResponse<UserVO>> => {
      const { pageNo = 1, pageSize = 10, username } = query as UserPageReqVO

      // 过滤
      let filtered = [...mockUsers]
      if (username) {
        filtered = filtered.filter(u =>
          u.username.includes(username as string)
        )
      }

      // 分页
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const list = filtered.slice(start, start + Number(pageSize))

      return {
        code: 0,
        data: {
          list,
          total: filtered.length
        },
        msg: ''
      }
    }
  }
]

export default mockConfigs
```

### 类型定义 (`src/mock/types.ts`)

```typescript
export interface MockConfig {
  url: string | RegExp
  type: 'get' | 'post' | 'put' | 'delete' | 'patch'
  timeout?: number
  response: (options: MockRequestOptions) => any
}

export interface MockRequestOptions {
  query: Record<string, any>
  body: Record<string, any>
  params: Record<string, any>
  headers: Record<string, string>
}

export interface ApiResponse<T = any> {
  code: number
  data: T | null
  msg: string
}

export interface PageResponse<T = any> {
  list: T[]
  total: number
}
```

### 注册 Handlers (`src/mock/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw'
import type { MockConfig } from './types'

// 导入所有 mock 配置
import authMocks from './modules/auth/login'
import systemUserMocks from './modules/system/user'
import systemRoleMocks from './modules/system/role'

const allMockConfigs: MockConfig[] = [
  ...authMocks,
  ...systemUserMocks,
  ...systemRoleMocks
]

// 转换为 MSW handlers
export const handlers = createMockHandlers(allMockConfigs)

function createMockHandlers(configs: MockConfig[]) {
  return configs.map((config) => {
    const { url, type, timeout = 0, response } = config

    const handler = http[type](url, async ({ request, params }) => {
      // 解析请求
      const query = Object.fromEntries(new URL(request.url).searchParams)
      const body = ['post', 'put', 'patch'].includes(type)
        ? await request.json().catch(() => ({}))
        : {}
      const headers = Object.fromEntries(request.headers)

      // 延迟响应
      if (timeout > 0) {
        await new Promise(resolve => setTimeout(resolve, timeout))
      }

      // 调用响应函数
      const data = response({ query, body, params, headers })

      return HttpResponse.json(data)
    })

    return handler
  })
}
```

## CRUD Mock 模式

### 完整 CRUD 示例

```typescript
// src/mock/modules/resource/index.ts
import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceVO, ResourcePageReqVO } from '@/api/resource/types'

// 模拟数据库
let mockDatabase: ResourceVO[] = [
  {
    id: 1,
    name: '数据集 A',
    type: 'dataset',
    status: 1,
    description: '测试数据集',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '算法 B',
    type: 'algorithm',
    status: 0,
    description: '测试算法',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-02 11:00:00'
  }
]

let nextId = 3

const mockConfigs: MockConfig[] = [
  // 分页查询
  {
    url: '/admin-api/resource/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceVO>> => {
      const {
        pageNo = 1,
        pageSize = 10,
        name,
        type,
        status
      } = query as ResourcePageReqVO

      // 过滤
      let filtered = [...mockDatabase]

      if (name) {
        filtered = filtered.filter(item =>
          item.name.includes(name as string)
        )
      }

      if (type) {
        filtered = filtered.filter(item => item.type === type)
      }

      if (status !== undefined) {
        filtered = filtered.filter(item => item.status === Number(status))
      }

      // 排序（默认按创建时间倒序）
      filtered.sort((a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )

      // 分页
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const list = filtered.slice(start, start + Number(pageSize))

      return {
        code: 0,
        data: {
          list,
          total: filtered.length
        },
        msg: ''
      }
    }
  },

  // 获取详情
  {
    url: '/admin-api/resource/get',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceVO> => {
      const { id } = query
      const item = mockDatabase.find(d => d.id === Number(id))

      if (!item) {
        return {
          code: 404,
          data: null,
          msg: '资源不存在'
        }
      }

      return {
        code: 0,
        data: item,
        msg: ''
      }
    }
  },

  // 创建
  {
    url: '/admin-api/resource/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const now = new Date().toISOString()
      const newItem: ResourceVO = {
        ...body,
        id: nextId++,
        status: body.status ?? 0,
        createTime: now,
        updateTime: now
      }

      mockDatabase.push(newItem)

      return {
        code: 0,
        data: newItem.id!,
        msg: '创建成功'
      }
    }
  },

  // 更新
  {
    url: '/admin-api/resource/update',
    type: 'put',
    response: ({ body }): ApiResponse<void> => {
      const { id } = body
      const index = mockDatabase.findIndex(d => d.id === id)

      if (index === -1) {
        return {
          code: 404,
          data: null,
          msg: '资源不存在'
        }
      }

      mockDatabase[index] = {
        ...mockDatabase[index],
        ...body,
        updateTime: new Date().toISOString()
      }

      return {
        code: 0,
        data: null,
        msg: '更新成功'
      }
    }
  },

  // 删除
  {
    url: '/admin-api/resource/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const { id } = query
      const index = mockDatabase.findIndex(d => d.id === Number(id))

      if (index === -1) {
        return {
          code: 404,
          data: null,
          msg: '资源不存在'
        }
      }

      mockDatabase.splice(index, 1)

      return {
        code: 0,
        data: null,
        msg: '删除成功'
      }
    }
  }
]

export default mockConfigs
```

## 高级功能

### 1. 响应延迟

```typescript
{
  url: '/admin-api/slow-api',
  type: 'get',
  timeout: 2000, // 2秒延迟
  response: () => ({ code: 0, data: 'Slow response', msg: '' })
}
```

### 2. 错误模拟

```typescript
{
  url: '/admin-api/error-test',
  type: 'get',
  response: ({ query }): ApiResponse => {
    const { errorType } = query

    switch (errorType) {
      case '401':
        return { code: 401, data: null, msg: '未授权' }
      case '403':
        return { code: 403, data: null, msg: '无权限' }
      case '404':
        return { code: 404, data: null, msg: '资源不存在' }
      case '500':
        return { code: 500, data: null, msg: '服务器错误' }
      default:
        return { code: 0, data: 'Success', msg: '' }
    }
  }
}
```

### 3. 条件响应

```typescript
{
  url: '/admin-api/conditional',
  type: 'get',
  response: ({ headers, query }): ApiResponse => {
    // 检查认证
    const token = headers.Authorization

    if (!token) {
      return { code: 401, data: null, msg: '未登录' }
    }

    // 检查权限
    const { resourceId } = query
    const hasPermission = checkPermission(token, resourceId)

    if (!hasPermission) {
      return { code: 403, data: null, msg: '无权限' }
    }

    // 正常响应
    return { code: 0, data: { id: resourceId }, msg: '' }
  }
}
```

### 4. 动态数据生成

```typescript
import { faker } from '@faker-js/faker'

// 生成大量测试数据
const mockUsers: UserVO[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  username: faker.internet.userName(),
  nickname: faker.person.fullName(),
  email: faker.internet.email(),
  mobile: faker.phone.number(),
  avatar: faker.image.avatar(),
  sex: faker.number.int({ min: 0, max: 2 }),
  status: faker.number.int({ min: 0, max: 1 }),
  createTime: faker.date.past().toISOString()
}))
```

### 5. 文件上传模拟

```typescript
{
  url: '/admin-api/upload',
  type: 'post',
  response: ({ body }): ApiResponse => {
    // body 包含 FormData
    return {
      code: 0,
      data: {
        url: `https://example.com/files/${Date.now()}.jpg`,
        filename: 'uploaded-file.jpg',
        size: 1024000
      },
      msg: '上传成功'
    }
  }
}
```

### 6. 下载模拟

```typescript
{
  url: '/admin-api/export',
  type: 'get',
  response: (): void => {
    // MSW 不直接处理下载，前端需配合处理
    console.log('[Mock] Export request received')
    // 返回空或由前端生成下载
  }
}
```

## 测试账号配置

### 用户配置 (`src/mock/modules/auth/login.ts`)

```typescript
interface UserConfig {
  user: UserVO
  roles: string[]
  permissions: string[]
}

const userConfigs: Record<string, UserConfig> = {
  // 超级管理员
  admin: {
    user: {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      email: 'admin@example.com',
      mobile: '13800138000',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['admin', 'super_admin'],
    permissions: ['*:*:*']
  },

  // 资源管理员
  resourceAdmin: {
    user: {
      id: 2,
      username: 'resourceAdmin',
      nickname: '资源管理员',
      email: 'resource@example.com',
      mobile: '13800138001',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['resourceAdmin'],
    permissions: [
      'resource:*',
      'resource:query',
      'resource:create',
      'resource:update',
      'resource:delete'
    ]
  },

  // 普通用户
  user: {
    user: {
      id: 3,
      username: 'user',
      nickname: '普通用户',
      email: 'user@example.com',
      mobile: '13800138002',
      sex: 2,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['user'],
    permissions: [
      'resource:query'
    ]
  }
}

// 登录 handler
const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/system/auth/login',
    type: 'post',
    response: ({ body }): ApiResponse<{ token: string }> => {
      const { username, password } = body

      // 所有测试账号密码统一为 admin123
      if (password !== 'admin123') {
        return {
          code: 401,
          data: null,
          msg: '密码错误'
        }
      }

      const userConfig = userConfigs[username]

      if (!userConfig) {
        return {
          code: 401,
          data: null,
          msg: '用户不存在'
        }
      }

      // 生成 token（实际项目中应使用加密）
      const token = `mock-token-${username}-${Date.now()}`

      return {
        code: 0,
        data: { token },
        msg: '登录成功'
      }
    }
  },

  // 获取用户信息
  {
    url: '/admin-api/system/auth/get-permission-info',
    type: 'get',
    response: ({ headers }): ApiResponse<UserConfig> => {
      const token = headers.Authorization?.replace('Bearer ', '')

      if (!token) {
        return {
          code: 401,
          data: null,
          msg: '未登录'
        }
      }

      // 从 token 解析用户名
      const username = token.split('-')[2]
      const userConfig = userConfigs[username]

      if (!userConfig) {
        return {
          code: 401,
          data: null,
          msg: 'Token 无效'
        }
      }

      return {
        code: 0,
        data: userConfig,
        msg: ''
      }
    }
  }
]
```

## 开发调试

### 控制台日志

```typescript
response: ({ query, body }) => {
  console.log('[Mock] Request:', { url: '/api/resource', query, body })

  const response = { code: 0, data: mockData, msg: '' }
  console.log('[Mock] Response:', response)

  return response
}
```

### 环境控制

```typescript
// .env.local
VITE_USE_MOCK=true

// src/mock/index.ts
export function setupMock() {
  const enabled = import.meta.env.VITE_USE_MOCK === 'true'

  if (!enabled) {
    console.log('[MSW] Disabled by env config')
    return
  }

  // 启动 mock service
}
```

### 动态开关

```vue
<!-- 开发工具面板 -->
<template>
  <div class="dev-tools">
    <el-switch v-model="mockEnabled" @change="toggleMock">
      Mock Service
    </el-switch>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { worker } from '@/mock'

const mockEnabled = ref(true)

const toggleMock = (enabled: boolean) => {
  if (enabled) {
    worker.start()
    console.log('[MSW] Enabled')
  } else {
    worker.stop()
    console.log('[MSW] Disabled')
  }
}
</script>
```

## 最佳实践

### 1. 数据一致性

```typescript
// ✅ 推荐：Mock 数据结构与后端 API 一致
const mockUser: UserVO = {
  id: 1,
  username: 'admin',
  // 所有字段与 API 返回一致
}

// ❌ 避免：Mock 数据与 API 不一致
const mockUser = {
  id: 1,
  name: 'admin', // 字段名不一致！
}
```

### 2. 状态同步

```typescript
// ✅ 推荐：CRUD 操作真实修改 mock 数据
let mockDatabase = [...]

// 创建
mockDatabase.push(newItem)

// 更新
mockDatabase[index] = updatedItem

// 删除
mockDatabase.splice(index, 1)
```

### 3. 错误场景

```typescript
// ✅ 模拟各种错误状态
if (!item) {
  return { code: 404, data: null, msg: '资源不存在' }
}

if (!hasPermission) {
  return { code: 403, data: null, msg: '无权限' }
}
```

### 4. 合理延迟

```typescript
// ✅ 添加合理延迟模拟真实网络
{
  url: '/api/resource',
  type: 'get',
  timeout: 100, // 100ms 延迟
  response: () => ({ code: 0, data: mockData, msg: '' })
}
```

### 5. 分离配置

```typescript
// ✅ 按模块组织 mock 文件
src/mock/
├── modules/
│   ├── auth/
│   │   └── login.ts
│   ├── system/
│   │   ├── user.ts
│   │   └── role.ts
│   └── resource/
│       └── index.ts
```

## 常见问题

**Q: Mock 不生效？**
- 检查 `import.meta.env.DEV` 是否为 true
- 确认 `main.ts` 中调用了 `setupMock()`
- 检查 URL 路径是否完全匹配
- 查看浏览器控制台是否有 MSW 启动日志

**Q: 请求直接发送到后端？**
- MSW 匹配 URL 失败，检查 `url` 配置
- 使用 `onUnhandledRequest: 'warn'` 查看未匹配请求

**Q: 如何模拟网络错误？**
```typescript
response: () => {
  throw new Error('Network error')
}
```

**Q: 如何查看当前 mock handlers？**
```typescript
import { worker } from '@/mock'
console.log(worker.listHandlers())
```

**Q: 生产环境会包含 mock 代码吗？**
不会，MSW 仅在开发环境启用，生产构建会 tree-shake 掉。

## 性能优化

### 1. 使用 shallowRef

```typescript
import { shallowRef } from 'vue'

// 大量数据使用 shallowRef
let mockDatabase = shallowRef<ResourceVO[]>([...])
```

### 2. 延迟加载

```typescript
// 仅在需要时加载 mock 数据
const loadMockData = async () => {
  const data = await import('./mockData.json')
  mockDatabase = data.default
}
```

### 3. 缓存响应

```typescript
const cache = new Map()

response: ({ query }) => {
  const cacheKey = JSON.stringify(query)

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const result = generateResponse(query)
  cache.set(cacheKey, result)

  return result
}
```

## 项目现有 Mock 模块

- `auth/login.ts` - 登录、用户信息、权限
- `system/user.ts` - 用户管理
- `system/role.ts` - 角色管理
- `system/menu.ts` - 菜单管理
- `homepage/banner.ts` - 首页横幅
- `marketplace/resource.ts` - 资源市场
