import request from '@/config/axios'
import type { ResourceUsageVO, ResourceUsagePageReqVO } from '../usage'

/** 延期申请参数 */
export interface ExtendResourceVO {
  /** 使用记录ID */
  id: number
  /** 延期天数 */
  days: number
  /** 延期原因 */
  reason?: string
}

// 获取我的资源列表
export const getMyResourcePage = (params: ResourceUsagePageReqVO) => {
  return request.get<PageResult<ResourceUsageVO[]>>({ url: '/resource/my/page', params })
}

// 延期申请
export const extendMyResource = (data: ExtendResourceVO) => {
  return request.post<void>({ url: '/resource/my/extend', data })
}

// 停用我的资源
export const stopMyResource = (id: number) => {
  return request.post<void>({ url: '/resource/my/stop', data: { id } })
}

// 重新申请已停用资源
export const reapplyMyResource = (id: number) => {
  return request.post<void>({ url: '/resource/my/reapply', data: { id } })
}
