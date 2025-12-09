import request from '@/config/axios'
import type { ApplyStatus } from '../types'

/** 资源申请 VO */
export interface ResourceApplyVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  resourceType?: number
  /** 申请原因 */
  reason: string
  /** 项目ID */
  projectId?: number
  /** 项目名称 */
  projectName?: string
  /** 使用期限（天） */
  duration?: number
  /** 申请状态：0-待审批 1-已通过 2-已驳回 3-已撤销 */
  status?: ApplyStatus
  /** 审批人 */
  approver?: string
  /** 审批意见 */
  approvalComment?: string
  /** 审批时间 */
  approvalTime?: Date
  /** 申请人 */
  applicant?: string
  /** 申请时间 */
  createTime?: Date
}

/** 资源申请分页查询参数 */
export interface ResourceApplyPageReqVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 申请人 */
  applicant?: string
  /** 项目名称 */
  projectName?: string
  /** 申请状态 */
  status?: ApplyStatus
  /** 申请时间 */
  createTime?: string[]
}

// 申请资源
export const createResourceApply = (data: ResourceApplyVO) => {
  return request.post<number>({ url: '/resource/apply/create', data })
}

// 撤销申请
export const cancelResourceApply = (id: number) => {
  return request.post<void>({ url: '/resource/apply/cancel', data: { id } })
}

// 重新申请
export const reapplyResource = (data: ResourceApplyVO) => {
  return request.post<number>({ url: '/resource/apply/reapply', data })
}

// 获取我申请的列表
export const getMyResourceApplyPage = (params: ResourceApplyPageReqVO) => {
  return request.get<PageResult<ResourceApplyVO[]>>({ url: '/resource/apply/my-page', params })
}

// 获取申请详情
export const getResourceApply = (id: number) => {
  return request.get<ResourceApplyVO>({ url: '/resource/apply/get?id=' + id })
}
