import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceUsageVO, ResourceUsagePageReqVO, StopResourceUsageReqVO } from '@/api/resource/usage'
import { db, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 使用记录分页
    url: '/admin-api/resource/usage/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceUsageVO>> => {
      const { pageNo = 1, pageSize = 10, resourceName, userName, status, projectName } = query as any as ResourceUsagePageReqVO & any
      let list = db.usages.slice()
      if (resourceName) list = list.filter((u) => (u.resourceName || '').toLowerCase().includes(String(resourceName).toLowerCase()))
      if (userName) list = list.filter((u) => (u.userName || '').toLowerCase().includes(String(userName).toLowerCase()))
      if (projectName) list = list.filter((u) => (u.projectName || '').toLowerCase().includes(String(projectName).toLowerCase()))
      if (status !== undefined && status !== null && String(status) !== '') list = list.filter((u) => String(u.status) === String(status))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 详情
    url: '/admin-api/resource/usage/get',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceUsageVO | null> => {
      const id = Number(query.id)
      const item = db.usages.find((u) => u.id === id) || null
      return { code: 0, data: item, msg: '' }
    }
  },
  { // 停用
    url: '/admin-api/resource/usage/stop',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id, reason, stopTime, description } = body as StopResourceUsageReqVO
      const item = db.usages.find((u) => u.id === id)
      if (item) {
        item.status = 0
        // 保存停用信息
        item.stopReason = reason
        item.stopTime = stopTime
        item.stopDescription = description
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 启用
    url: '/admin-api/resource/usage/enable',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.usages.find((u) => u.id === id)
      if (item) {
        item.status = 1
        // 清空停用信息
        item.stopReason = undefined
        item.stopTime = undefined
        item.stopDescription = undefined
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
