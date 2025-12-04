import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { CollectRecordVO, CollectRecordPageReqVO } from '@/api/resource/collect'
import { db, nextId, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 分页
    url: '/admin-api/resource/collect/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<CollectRecordVO>> => {
      const { pageNo = 1, pageSize = 10, resourceName, resourceType } = query as any as CollectRecordPageReqVO & any
      let list = db.collects.slice()
      if (resourceName) list = list.filter((c) => (c.resourceName || '').toLowerCase().includes(String(resourceName).toLowerCase()))
      if (resourceType) list = list.filter((c) => String(c.resourceType) === String(resourceType))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 添加收藏
    url: '/admin-api/resource/collect/add',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const resourceId = Number(body.resourceId)
      const res = db.resourceInfos.find((r) => r.id === resourceId)
      const id = nextId('collect')
      db.collects.unshift({ id, resourceId, resourceName: res?.name, resourceType: res?.type as any, resourceIcon: '', createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 取消收藏
    url: '/admin-api/resource/collect/cancel',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.collects = db.collects.filter((c) => c.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
