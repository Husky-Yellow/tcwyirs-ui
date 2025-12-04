import request from '@/config/axios'

/** 资源评价 VO */
export interface ResourceEvaluateVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 评分（1-5星） */
  rating?: number
  /** 评论内容 */
  comment?: string
  /** 评分标签ID列表 */
  tagIds?: number[]
  /** 评价人 */
  evaluator?: string
  /** 评价人ID */
  evaluatorId?: number
  /** 回复列表 */
  replies?: ResourceEvaluateReplyVO[]
  /** 创建时间 */
  createTime?: Date
}

/** 评价回复 VO */
export interface ResourceEvaluateReplyVO {
  id?: number
  /** 评价ID */
  evaluateId: number
  /** 回复内容 */
  content: string
  /** 回复人 */
  replier?: string
  /** 回复人ID */
  replierId?: number
  /** 创建时间 */
  createTime?: Date
}

/** 快捷评分参数 */
export interface QuickEvaluateVO {
  /** 资源ID */
  resourceId: number
  /** 评分标签ID列表 */
  tagIds: number[]
}

// 发布评分和评论
export const createResourceEvaluate = (data: ResourceEvaluateVO) => {
  return request.post<number>({ url: '/resource/evaluate/create', data })
}

// 回复评论
export const replyResourceEvaluate = (data: ResourceEvaluateReplyVO) => {
  return request.post<number>({ url: '/resource/evaluate/reply', data })
}

// 获取资源评论列表
export const getResourceEvaluateList = (resourceId: number) => {
  return request.get<ResourceEvaluateVO[]>({ url: '/resource/evaluate/list?resourceId=' + resourceId })
}

// 快捷评分（仅标签）
export const quickEvaluate = (data: QuickEvaluateVO) => {
  return request.post<number>({ url: '/resource/evaluate/quick', data })
}
