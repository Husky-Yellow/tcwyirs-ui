import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceApplyVO, ResourceApplyPageReqVO } from '@/api/resource/apply'
import { db, nextId, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 申请
    url: '/admin-api/resource/apply/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceApplyVO
      const id = nextId('apply')
      db.applies.unshift({ ...data, id, status: 0, applicant: 'MockUser', createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 撤销
    url: '/admin-api/resource/apply/cancel',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.applies.find((a) => a.id === id)
      if (item) item.status = 3
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 重新申请
    url: '/admin-api/resource/apply/reapply',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceApplyVO
      const id = nextId('apply')
      db.applies.unshift({ ...data, id, status: 0, createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 我的申请
    url: '/admin-api/resource/apply/my-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceApplyVO>> => {
      const { pageNo = 1, pageSize = 10, resourceName, status } = query as any as ResourceApplyPageReqVO & any
      let list = db.applies.slice()
      if (resourceName) list = list.filter((a) => (a.resourceName || '').toLowerCase().includes(String(resourceName).toLowerCase()))
      if (status !== undefined && String(status) !== '') list = list.filter((a) => String(a.status) === String(status))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 详情
    url: '/admin-api/resource/apply/get',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceApplyVO | null> => {
      const id = Number(query.id)
      const item = db.applies.find((a) => a.id === id) || null
      return { code: 0, data: item, msg: '' }
    }
  }
]

export default mockConfigs
