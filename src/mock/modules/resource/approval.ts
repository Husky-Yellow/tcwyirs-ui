import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceApplyVO } from '@/api/resource/apply'
import { db, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 待审批
    url: '/admin-api/resource/approval/pending-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceApplyVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      const list = db.applies.filter((a) => a.status === 0)
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 已审批
    url: '/admin-api/resource/approval/done-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceApplyVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      const list = db.applies.filter((a) => a.status !== 0)
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 通过
    url: '/admin-api/resource/approval/approve',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id } = body as { id: number; comment?: string }
      const item = db.applies.find((a) => a.id === Number(id))
      if (item) item.status = 1
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 驳回
    url: '/admin-api/resource/approval/reject',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id } = body as { id: number; comment?: string }
      const item = db.applies.find((a) => a.id === Number(id))
      if (item) item.status = 2
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 转交
    url: '/admin-api/resource/approval/transfer',
    type: 'post',
    response: (): ApiResponse<void> => {
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
