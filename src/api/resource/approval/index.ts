import request from '@/config/axios'
import type { ResourceApplyVO, ResourceApplyPageReqVO } from '../apply'

/** 审批操作参数 */
export interface ApprovalActionVO {
  /** 申请ID */
  id: number
  /** 审批类型：1-资源申请，2-上架申请 */
  type: number
  /** 审批意见 */
  rejectReason?: string
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

// 提交审批
export const submitApproval = (data: ApprovalActionVO) => {
  return request.post<void>({ url: '/resource/approval/submit', data })
}

// 审批通过
export const approveResourceApply = (data: ApprovalActionVO) => {
  return request.post<void>({ url: '/resource/approval/approve', data })
}

// 审批驳回
export const rejectResourceApply = (params: ApprovalActionVO) => {
  return request.put<void>({ url: '/resource/approval/reject', params })
}

// 取消申请（审批流程中）
export const cancelApproval = (data: ApprovalActionVO) => {
  return request.post<void>({ url: '/resource/approval/cancel', data })
}

// 转交审批
export const transferResourceApply = (data: ApprovalTransferVO) => {
  return request.post<void>({ url: '/resource/approval/transfer', data })
}
