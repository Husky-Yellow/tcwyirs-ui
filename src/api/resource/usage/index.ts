import request from '@/config/axios'
import type { UsageStatus } from '../types'

/** 资源使用记录 VO */
export interface ResourceUsageVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 使用人 */
  userId: number
  /** 使用人名称 */
  userName?: string
  /** 项目ID */
  projectId?: number
  /** 项目名称 */
  projectName?: string
  /** 使用状态：1-使用中 0-已停用 */
  status?: UsageStatus
  /** 开始时间 */
  startTime?: Date
  /** 结束时间 */
  endTime?: Date
  /** 到期时间 */
  expireTime?: Date
  /** 创建时间 */
  createTime?: Date
}

/** 资源使用分页查询参数 */
export interface ResourceUsagePageReqVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 项目名称 */
  projectName?: string
  /** 使用状态 */
  useStatus?: number
}

// 获取资源使用列表
export const getResourceUsagePage = (params: ResourceUsagePageReqVO) => {
  return request.get<PageResult<ResourceUsageVO[]>>({ url: '/resource/usage/page', params })
}

// 获取资源使用详情
export const getResourceUsage = (id: number) => {
  return request.get<ResourceUsageVO>({ url: '/resource/usage/get?id=' + id })
}

// 停用资源
export const stopResourceUsage = (id: number) => {
  return request.post<void>({ url: '/resource/usage/stop', data: { id } })
}

// 启用资源
export const enableResourceUsage = (id: number) => {
  return request.post<void>({ url: '/resource/usage/enable', data: { id } })
}
