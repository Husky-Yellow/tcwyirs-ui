import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceUsageVO } from '@/api/resource/usage'
import type { ExtendResourceVO } from '@/api/resource/my'
import { db, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 我的资源
    url: '/admin-api/resource/my/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceUsageVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      const list = db.usages.slice()
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 延期
    url: '/admin-api/resource/my/extend',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id, days } = body as ExtendResourceVO
      const item = db.usages.find((u) => u.id === id)
      if (item) {
        const now = item.expireTime ? new Date(item.expireTime) : new Date()
        now.setDate(now.getDate() + Number(days || 0))
        item.expireTime = now as any
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 停用
    url: '/admin-api/resource/my/stop',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.usages.find((u) => u.id === id)
      if (item) item.status = 0
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 重新申请
    url: '/admin-api/resource/my/reapply',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.usages.find((u) => u.id === id)
      if (item) item.status = 1
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
