import request from '@/config/axios'

/** 发布申请 VO */
export interface PublishApplyVO {
  /** 申请ID */
  id?: number
  /** 资源ID */
  resourceId?: number
  /** 申请原因 */
  reason?: string
  /** 审批状态: 0-待审批 1-通过 2-驳回 */
  status?: number
  /** 审批意见 */
  approvalComment?: string
  /** 创建时间 */
  createTime?: string
}

/** 创建发布申请 VO */
export interface PublishApplyCreateReqVO {
  /** 资源ID */
  resourceId: number
}

/** 资源下架请求 VO */
export interface ResourceOfflineReqVO {
  /** 资源ID */
  resourceId: number
  /** 下架原因 */
  reason?: string
  /** 下架原因 */
  offlineType: string  //  0-立即下架 1-1天后 2-2天后 3-3天后
}


/**
 * 创建发布申请
 * @param data 申请参数
 */
export const createPublishApply = (data: PublishApplyCreateReqVO) => {
  return request.post({ url: `/resource/publish-apply/publish?resourceId=${data.resourceId}`, data })
}

/**
 * 资源下架
 * @param data 下架请求参数
 */
export const offlineResource = (data: ResourceOfflineReqVO) => {
  return request.put({ url: `/resource/publish-apply/offline`, data })
}

// ========== 查询发布申请列表 ==========

/**
 * 获取发布申请分页列表
 * @param params 查询参数
 */
export const getPublishApplyPage = (params: any) => {
  return request.get({ url: '/resource/publish-apply/page', params })
}

// ========== 审批发布申请 ==========

/**
 * 审批发布申请
 * @param data 审批参数
 */
export const approvePublishApply = (data: { id: number; status: number; comment?: string }) => {
  return request.post({ url: '/resource/publish-apply/approve', data })
}
