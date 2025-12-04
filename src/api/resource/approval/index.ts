import request from '@/config/axios'
import type { ResourceApplyVO, ResourceApplyPageReqVO } from '../apply'

/** 审批操作参数 */
export interface ApprovalActionVO {
  /** 申请ID */
  id: number
  /** 审批意见 */
  comment?: string
}

/** 转交审批参数 */
export interface ApprovalTransferVO extends ApprovalActionVO {
  /** 转交给的用户ID */
  userId: number
}

// 获取待审批列表
export const getPendingApprovalPage = (params: ResourceApplyPageReqVO) => {
  return request.get<PageResult<ResourceApplyVO[]>>({ url: '/resource/approval/pending-page', params })
}

// 获取已审批列表
export const getDoneApprovalPage = (params: ResourceApplyPageReqVO) => {
  return request.get<PageResult<ResourceApplyVO[]>>({ url: '/resource/approval/done-page', params })
}

// 通过申请
export const approveResourceApply = (data: ApprovalActionVO) => {
  return request.post<void>({ url: '/resource/approval/approve', data })
}

// 驳回申请
export const rejectResourceApply = (data: ApprovalActionVO) => {
  return request.post<void>({ url: '/resource/approval/reject', data })
}

// 转交申请
export const transferResourceApply = (data: ApprovalTransferVO) => {
  return request.post<void>({ url: '/resource/approval/transfer', data })
}
