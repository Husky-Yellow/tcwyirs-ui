# 创建 MSW Mock 数据

为 API 接口创建 Mock Service Worker (MSW) mock handlers，支持开发和测试。

## 使用方法

```
/mock <模块名> <资源名> [选项]
```

## 选项

- `--crud` - 生成完整的 CRUD mock handlers（默认）
- `--simple` - 仅生成基本 GET handler
- `--delay=<ms>` - 添加响应延迟（毫秒）

## 示例

```
/mock system user
/mock homepage banner --simple
/mock bpm process --delay=500
```

## 生成内容

### 1. Mock Handlers 文件 (`src/mock/modules/[module]/[resource].ts`)

```typescript
import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceVO, ResourcePageReqVO } from '@/api/[module]/types'

// Mock 数据
const mockData: ResourceVO[] = [
  {
    id: 1,
    name: '测试资源 1',
    type: 'dataset',
    status: 1,
    description: '这是一个测试资源',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '测试资源 2',
    type: 'algorithm',
    status: 0,
    description: '这是另一个测试资源',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  }
]

let currentId = 3

const mockConfigs: MockConfig[] = [
  // 分页查询
  {
    url: '/admin-api/[module]/[resource]/page',
    type: 'get',
    timeout: 100,
    response: ({ query }): ApiResponse<PageResponse<ResourceVO>> => {
      const { pageNo = 1, pageSize = 10, name, status } = query as ResourcePageReqVO

      // 过滤
      let filtered = [...mockData]
      if (name) {
        filtered = filtered.filter(item => item.name.includes(name as string))
      }
      if (status !== undefined) {
        filtered = filtered.filter(item => item.status === Number(status))
      }

      // 分页
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      const list = filtered.slice(start, end)

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
    url: '/admin-api/[module]/[resource]/get',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceVO> => {
      const { id } = query
      const item = mockData.find(d => d.id === Number(id))

      if (!item) {
        return {
          code: 500,
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
    url: '/admin-api/[module]/[resource]/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const newItem: ResourceVO = {
        ...body,
        id: currentId++,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }

      mockData.push(newItem)

      return {
        code: 0,
        data: newItem.id!,
        msg: '创建成功'
      }
    }
  },

  // 更新
  {
    url: '/admin-api/[module]/[resource]/update',
    type: 'put',
    response: ({ body }): ApiResponse<void> => {
      const { id } = body
      const index = mockData.findIndex(d => d.id === id)

      if (index === -1) {
        return {
          code: 500,
          data: null,
          msg: '资源不存在'
        }
      }

      mockData[index] = {
        ...mockData[index],
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
    url: '/admin-api/[module]/[resource]/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const { id } = query
      const index = mockData.findIndex(d => d.id === Number(id))

      if (index === -1) {
        return {
          code: 500,
          data: null,
          msg: '资源不存在'
        }
      }

      mockData.splice(index, 1)

      return {
        code: 0,
        data: null,
        msg: '删除成功'
      }
    }
  },

  // 导出
  {
    url: '/admin-api/[module]/[resource]/export',
    type: 'get',
    timeout: 1000,
    response: (): void => {
      // MSW 不处理下载，返回空或由前端处理
      console.log('Export request received')
    }
  }
]

export default mockConfigs
```

### 2. 注册到 handlers (`src/mock/handlers.ts`)

```typescript
import { createMockHandlers } from './utils'

// 导入 mock 配置
import authMocks from './modules/auth/login'
import systemUserMocks from './modules/system/user'
import resourceMocks from './modules/[module]/[resource]' // 新增

// 合并所有 mock 配置
const allMockConfigs = [
  ...authMocks,
  ...systemUserMocks,
  ...resourceMocks // 新增
]

// 创建 MSW handlers
export const handlers = createMockHandlers(allMockConfigs)
```

## Mock 数据模式

### 1. 静态数据

```typescript
const mockData: ResourceVO[] = [
  { id: 1, name: '资源 1', status: 1 },
  { id: 2, name: '资源 2', status: 0 }
]
```

### 2. 动态数据生成

```typescript
import { faker } from '@faker-js/faker'

const mockData: UserVO[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createTime: faker.date.past().toISOString()
}))
```

### 3. 状态管理 Mock

```typescript
// 模拟内存数据库
let mockDatabase = [...initialData]

const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/resource/create',
    type: 'post',
    response: ({ body }) => {
      const newItem = {
        ...body,
        id: mockDatabase.length + 1
      }
      mockDatabase.push(newItem)
      return { code: 0, data: newItem.id }
    }
  },
  {
    url: '/admin-api/resource/delete',
    type: 'delete',
    response: ({ query }) => {
      mockDatabase = mockDatabase.filter(item => item.id !== Number(query.id))
      return { code: 0, data: null }
    }
  }
]
```

## 高级功能

### 1. 响应延迟

```typescript
{
  url: '/admin-api/slow-endpoint',
  type: 'get',
  timeout: 2000, // 2秒延迟
  response: () => ({ code: 0, data: 'Slow response' })
}
```

### 2. 条件响应

```typescript
{
  url: '/admin-api/conditional',
  type: 'get',
  response: ({ query }) => {
    const { id } = query

    // 模拟错误
    if (id === '999') {
      return {
        code: 500,
        data: null,
        msg: '服务器错误'
      }
    }

    // 模拟未授权
    if (id === '403') {
      return {
        code: 403,
        data: null,
        msg: '无权访问'
      }
    }

    // 正常响应
    return {
      code: 0,
      data: { id },
      msg: ''
    }
  }
}
```

### 3. 分页、排序、过滤

```typescript
response: ({ query }) => {
  const {
    pageNo = 1,
    pageSize = 10,
    sortBy = 'id',
    sortOrder = 'asc',
    keyword
  } = query

  // 过滤
  let result = [...mockData]
  if (keyword) {
    result = result.filter(item =>
      item.name.toLowerCase().includes((keyword as string).toLowerCase())
    )
  }

  // 排序
  result.sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1
    return a[sortBy] > b[sortBy] ? order : -order
  })

  // 分页
  const start = (Number(pageNo) - 1) * Number(pageSize)
  const list = result.slice(start, start + Number(pageSize))

  return {
    code: 0,
    data: {
      list,
      total: result.length
    },
    msg: ''
  }
}
```

### 4. 文件上传模拟

```typescript
{
  url: '/admin-api/upload',
  type: 'post',
  response: ({ body }) => {
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

## Mock 用户账号

在 `src/mock/modules/auth/login.ts` 中添加测试账号：

```typescript
const userConfigs: Record<string, UserConfig> = {
  admin: {
    user: {
      id: 1,
      nickname: '超级管理员',
      username: 'admin',
      // ...
    },
    roles: ['admin', 'super_admin'],
    permissions: ['*:*:*']
  },
  testUser: {
    user: {
      id: 10,
      nickname: '测试用户',
      username: 'testUser',
      email: 'test@example.com',
      mobile: '13800138010',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['user'],
    permissions: [
      'system:resource:query',
      'system:resource:create'
    ]
  }
}
```

## 调试技巧

### 1. 控制台日志

```typescript
response: ({ query, body }) => {
  console.log('[Mock] Request:', { query, body })

  const response = { code: 0, data: mockData }
  console.log('[Mock] Response:', response)

  return response
}
```

### 2. 环境控制

```typescript
// 在 .env.local 中
VITE_USE_MOCK=true

// 在代码中检查
if (import.meta.env.VITE_USE_MOCK === 'true') {
  setupMock()
}
```

### 3. Mock 开关

```typescript
// src/mock/index.ts
export function setupMock(enabled = import.meta.env.DEV) {
  if (!enabled) {
    console.log('[Mock] Disabled')
    return
  }

  worker.start({
    onUnhandledRequest: 'bypass' // 未匹配的请求直接放行
  })

  console.log('[Mock] Enabled')
}
```

## 最佳实践

1. **真实数据模拟** - Mock 数据结构与后端 API 保持一致
2. **状态同步** - CRUD 操作真实修改 mock 数据
3. **错误场景** - 模拟各种错误状态（404、500、权限错误等）
4. **响应延迟** - 添加合理延迟模拟真实网络
5. **分离配置** - 按模块组织 mock 文件
6. **类型安全** - 使用 TypeScript 类型确保数据正确
7. **易于切换** - 提供开关方便切换 mock/真实 API

## 项目现有 Mock 模块

- `auth/login.ts` - 登录、用户信息、权限
- `system/role.ts` - 角色管理
- `system/user.ts` - 用户管理
- `system/menu.ts` - 菜单管理
- `homepage/banner.ts` - 首页横幅
- `marketplace/resource.ts` - 资源市场

## 常见问题

**Q: Mock 不生效？**
- 检查 `import.meta.env.DEV` 是否为 true
- 确认 `main.ts` 中调用了 `setupMock()`
- 检查 URL 路径是否匹配

**Q: 如何模拟长时间请求？**
```typescript
timeout: 5000 // 5秒延迟
```

**Q: 如何模拟分页数据很多的情况？**
```typescript
const mockData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  // ...
}))
```

**Q: 如何模拟认证失败？**
```typescript
response: ({ headers }) => {
  const token = headers.Authorization

  if (!token || token !== 'Bearer valid-token') {
    return {
      code: 401,
      data: null,
      msg: '未授权'
    }
  }

  // 正常响应
}
```
