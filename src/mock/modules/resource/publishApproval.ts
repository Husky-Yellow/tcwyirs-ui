import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceInfoVO, ResourceInfoPageReqVO } from '@/api/resource/info'
import { db, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 待审批上架
    url: '/admin-api/resource/publish-approval/pending-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceInfoVO>> => {
      const { pageNo = 1, pageSize = 10, name } = query as any as ResourceInfoPageReqVO & any
      let list = db.resourceInfos.filter((r) => r.status === 1)
      if (name) list = list.filter((r) => (r.name || '').toLowerCase().includes(String(name).toLowerCase()))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 已审批上架
    url: '/admin-api/resource/publish-approval/done-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceInfoVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      let list = db.resourceInfos.filter((r) => r.status !== 1)
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 通过
    url: '/admin-api/resource/publish-approval/approve',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number((body as any).id)
      const item = db.resourceInfos.find((r) => r.id === id)
      if (item) item.status = 2
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 驳回
    url: '/admin-api/resource/publish-approval/reject',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number((body as any).id)
      const item = db.resourceInfos.find((r) => r.id === id)
      if (item) item.status = 4
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 转交（空处理）
    url: '/admin-api/resource/publish-approval/transfer',
    type: 'post',
    response: (): ApiResponse<void> => ({ code: 0, data: undefined as any, msg: '' })
  }
]

export default mockConfigs
