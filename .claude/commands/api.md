# 创建 API 接口

创建符合项目规范的 API 接口定义，包括类型定义和请求函数。

## 使用方法

```
/api <模块名> <资源名>
```

## 示例

```
/api system user
/api bpm process
/api homepage banner
```

## 生成内容

### 1. API 文件 (`src/api/[module]/[resource].ts`)
```typescript
import request from '@/config/axios'
import type { ResourceVO, ResourcePageReqVO } from './types'

// 查询资源分页列表
export const getResourcePage = (params: ResourcePageReqVO) => {
  return request.get({ url: '/[module]/[resource]/page', params })
}

// 查询资源详情
export const getResource = (id: number) => {
  return request.get({ url: `/[module]/[resource]/get?id=${id}` })
}

// 创建资源
export const createResource = (data: ResourceVO) => {
  return request.post({ url: '/[module]/[resource]/create', data })
}

// 更新资源
export const updateResource = (data: ResourceVO) => {
  return request.put({ url: '/[module]/[resource]/update', data })
}

// 删除资源
export const deleteResource = (id: number) => {
  return request.delete({ url: `/[module]/[resource]/delete?id=${id}` })
}

// 导出资源
export const exportResource = (params: ResourcePageReqVO) => {
  return request.download({ url: '/[module]/[resource]/export', params })
}
```

### 2. 类型文件 (`src/api/[module]/types.ts`)
```typescript
// 资源 VO
export interface ResourceVO {
  id?: number
  name: string
  status: number
  createTime?: string
  updateTime?: string
}

// 资源分页查询 VO
export interface ResourcePageReqVO extends PageParam {
  name?: string
  status?: number
  createTime?: [string, string]
}

// 分页参数
export interface PageParam {
  pageNo: number
  pageSize: number
}
```

### 3. Mock 数据 (`src/mock/modules/[module]/[resource].ts`)
```typescript
import type { MockConfig, ApiResponse, PageResponse } from '../../types'

const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/[module]/[resource]/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      return {
        code: 0,
        data: {
          list: [],
          total: 0
        },
        msg: ''
      }
    }
  }
]

export default mockConfigs
```

## 命名规范

- 模块名: `camelCase` (system, bpm, homepage)
- 资源名: `camelCase` (user, role, process)
- 接口函数: `get/create/update/delete + 资源名(PascalCase)`

## 项目约定

- 所有请求通过 `request` 实例发送（自动注入 token、tenant ID）
- 使用 TypeScript 类型定义确保类型安全
- 分页参数使用 `PageParam` 接口
- 导出功能使用 `request.download` 方法
- Mock 数据结构与真实 API 保持一致
