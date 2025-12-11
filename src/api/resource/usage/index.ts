import request from '@/config/axios'
import type { UsageStatus } from '../types'

/** 资源使用记录 VO */
export interface ResourceUsageVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  resourceType?: number
  /** 资源描述 */
  resourceDescription?: string
  /** 使用人 */
  userId: number
  /** 使用人名称 */
  userName?: string
  /** 项目ID */
  projectId?: number
  /** 项目名称 */
  projectName?: string
  /** 项目经理 */
  projectManager?: string
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
  /** 上架时间 */
  publishTime?: Date
  /** 审批人 */
  approver?: string
}

/** 资源使用分页查询参数 */
export interface ResourceUsagePageReqVO extends PageParam {
  /** 资源ID（查询特定资源的使用记录） */
  resourceId?: number
  /** 资源名称 */
  resourceName?: string
  /** 项目名称 */
  projectName?: string
  /** 使用状态 */
  useStatus?: number
}

// 获取资源使用列表
export const getResourceUsagePage = (params: ResourceUsagePageReqVO) => {
  return request.get<PageResult<ResourceUsageVO[]>>({ url: '/resource/info/usage-page', params })
}

// 获取资源使用详情
export const getResourceUsage = (id: number) => {
  return request.get<ResourceUsageVO>({ url: '/resource/apply/get?id=' + id })
}

// 更新资源使用状态
export const updateResourceUsageStatus = (id: number, useStatus: number) => {
  return request.post<void>({ url: '/resource/info/usage-status', data: { id, useStatus } })
}

// 停用资源（useStatus=3）
export const stopResourceUsage = (id: number) => {
  return updateResourceUsageStatus(id, 3)
}

// 启用资源（useStatus=2）
export const enableResourceUsage = (id: number) => {
  return updateResourceUsageStatus(id, 2)
}
