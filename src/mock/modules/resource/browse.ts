import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { BrowseRecordVO, BrowseRecordPageReqVO } from '@/api/resource/browse'
import { db, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 分页
    url: '/admin-api/resource/browse/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<BrowseRecordVO>> => {
      const { pageNo = 1, pageSize = 10, resourceName, resourceType } = query as any as BrowseRecordPageReqVO & any
      let list = db.browses.slice()
      if (resourceName) list = list.filter((b) => (b.resourceName || '').toLowerCase().includes(String(resourceName).toLowerCase()))
      if (resourceType) list = list.filter((b) => String(b.resourceType) === String(resourceType))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  }
]

export default mockConfigs
