import request from '@/config/axios'
import type { FeedbackStatus } from '../types'

/** 反馈 VO */
export interface FeedbackVO {
  id?: number
  /** 反馈标题 */
  title: string
  /** 反馈内容 */
  content: string
  /** 反馈类型：1-问题 2-建议 3-其他 */
  type?: number
  /** 关联资源ID */
  resourceId?: number
  /** 关联资源名称 */
  resourceName?: string
  /** 反馈状态：0-待处理 1-处理中 2-已解决 3-已关闭 */
  status?: FeedbackStatus
  /** 处理人 */
  handler?: string
  /** 处理人ID */
  handlerId?: number
  /** 提交人 */
  submitter?: string
  /** 提交人ID */
  submitterId?: number
  /** 回复列表 */
  replies?: FeedbackReplyVO[]
  /** 创建时间 */
  createTime?: Date
  /** 更新时间 */
  updateTime?: Date
}

/** 反馈回复 VO */
export interface FeedbackReplyVO {
  id?: number
  /** 反馈ID */
  feedbackId: number
  /** 回复内容 */
  content: string
  /** 回复人 */
  replier?: string
  /** 回复人ID */
  replierId?: number
  /** 创建时间 */
  createTime?: Date
}

/** 反馈分页查询参数 */
export interface FeedbackPageReqVO extends PageParam {
  /** 反馈标题 */
  title?: string
  /** 反馈类型 */
  type?: number
  /** 反馈状态 */
  status?: FeedbackStatus
  /** 创建时间 */
  createTime?: string[]
}

/** 转交反馈参数 */
export interface TransferFeedbackVO {
  /** 反馈ID */
  id: number
  /** 转交给的用户ID */
  userId: number
  /** 转交说明 */
  comment?: string
}

// 提交反馈
export const createFeedback = (data: FeedbackVO) => {
  return request.post<number>({ url: '/resource/feedback/create', data })
}

// 获取我的反馈列表
export const getMyFeedbackPage = (params: FeedbackPageReqVO) => {
  return request.get<PageResult<FeedbackVO[]>>({ url: '/resource/feedback/my-page', params })
}

// 获取待处理反馈列表
export const getPendingFeedbackPage = (params: FeedbackPageReqVO) => {
  return request.get<PageResult<FeedbackVO[]>>({ url: '/resource/feedback/pending-page', params })
}

// 获取已处理反馈列表
export const getDoneFeedbackPage = (params: FeedbackPageReqVO) => {
  return request.get<PageResult<FeedbackVO[]>>({ url: '/resource/feedback/done-page', params })
}

// 获取反馈详情
export const getFeedback = (id: number) => {
  return request.get<FeedbackVO>({ url: '/resource/feedback/get?id=' + id })
}

// 回复反馈
export const replyFeedback = (data: FeedbackReplyVO) => {
  return request.post<number>({ url: '/resource/feedback/reply', data })
}

// 转交反馈
export const transferFeedback = (data: TransferFeedbackVO) => {
  return request.post<void>({ url: '/resource/feedback/transfer', data })
}

// 标记已解决
export const resolveFeedback = (id: number) => {
  return request.post<void>({ url: '/resource/feedback/resolve', data: { id } })
}

// 继续反馈
export const continueFeedback = (id: number, content: string) => {
  return request.post<void>({ url: '/resource/feedback/continue', data: { id, content } })
}
