import request from '@/config/axios'
import type { ResourceInfoVO, ResourceInfoPageReqVO } from '../info'

/** 上架审批操作参数 */
export interface PublishApprovalActionVO {
  /** 资源ID */
  id: number
  /** 审批意见 */
  comment?: string
}

/** 上架审批转交参数 */
export interface PublishApprovalTransferVO extends PublishApprovalActionVO {
  /** 转交给的用户ID */
  userId: number
}

// 获取待审批的上架申请列表
export const getPendingPublishApprovalPage = (params: ResourceInfoPageReqVO) => {
  return request.get<PageResult<ResourceInfoVO[]>>({ url: '/resource/publish-approval/pending-page', params })
}

// 获取已审批的上架申请列表
export const getDonePublishApprovalPage = (params: ResourceInfoPageReqVO) => {
  return request.get<PageResult<ResourceInfoVO[]>>({ url: '/resource/publish-approval/done-page', params })
}

// 通过上架申请
export const approvePublish = (data: PublishApprovalActionVO) => {
  return request.post<void>({ url: '/resource/publish-approval/approve', data })
}

// 驳回上架申请
export const rejectPublish = (data: PublishApprovalActionVO) => {
  return request.post<void>({ url: '/resource/publish-approval/reject', data })
}

// 转交上架审批
export const transferPublishApproval = (data: PublishApprovalTransferVO) => {
  return request.post<void>({ url: '/resource/publish-approval/transfer', data })
}
