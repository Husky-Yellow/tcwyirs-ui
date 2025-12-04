import type { MockConfig, ApiResponse } from '../../types'
import type { ResourceTagVO } from '@/api/resource/tag'
import { db, nextId } from './_data'

const mockConfigs: MockConfig[] = [
  { // 创建系统标签
    url: '/admin-api/resource/tag/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceTagVO
      const id = nextId('tag')
      db.tags.push({ ...data, id, type: 0, createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 更新系统标签
    url: '/admin-api/resource/tag/update',
    type: 'put',
    response: ({ body }): ApiResponse<void> => {
      const data = body as ResourceTagVO
      const idx = db.tags.findIndex((t) => t.id === data.id)
      if (idx >= 0) db.tags[idx] = { ...db.tags[idx], ...data }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 删除系统标签
    url: '/admin-api/resource/tag/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.tags = db.tags.filter((t) => t.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 系统标签列表
    url: '/admin-api/resource/tag/list',
    type: 'get',
    response: (): ApiResponse<ResourceTagVO[]> => ({ code: 0, data: db.tags, msg: '' })
  },
  { // 用户标签列表
    url: '/admin-api/resource/tag/user-list',
    type: 'get',
    response: (): ApiResponse<ResourceTagVO[]> => ({ code: 0, data: db.userTags, msg: '' })
  },
  { // 创建用户标签
    url: '/admin-api/resource/tag/user-create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceTagVO
      const id = nextId('userTag')
      db.userTags.push({ ...data, id, type: 1, createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 删除用户标签
    url: '/admin-api/resource/tag/user-delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.userTags = db.userTags.filter((t) => t.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
