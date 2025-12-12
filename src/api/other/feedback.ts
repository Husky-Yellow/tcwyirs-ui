import request from '@/config/axios'
import type { FeedbackVO, FeedbackQueryParams, FeedbackPageResult } from '@/views/other/feedback/types'

/**
 * 获取我的反馈列表（统一接口）
 * 通过 queryType 参数区分：1-我发起的反馈 2-我处理的反馈
 */
export const getMyFeedbackPage = (params: FeedbackQueryParams) => {
  return request.get<FeedbackPageResult>({
    url: '/resource/feedback/my-feedback-page',
    params
  })
}

/**
 * 获取我提交的反馈列表（兼容旧接口）
 * @deprecated 建议使用 getMyFeedbackPage，传入 queryType: 1
 */
export const getSubmittedFeedbackPage = (params: FeedbackQueryParams) => {
  return getMyFeedbackPage({ ...params, queryType: 1 })
}

/**
 * 获取我处理的反馈列表（兼容旧接口）
 * @deprecated 建议使用 getMyFeedbackPage，传入 queryType: 2
 */
export const getHandledFeedbackPage = (params: FeedbackQueryParams) => {
  return getMyFeedbackPage({ ...params, queryType: 2 })
}

/**
 * 获取反馈详情
 */
export const getFeedbackDetail = (id: number | string) => {
  return request.get<FeedbackVO>({
    url: `/resource/feedback/detail/${id}`
  })
}

/**
 * 获取反馈对话详情（回复列表）
 */
export const getFeedbackConversation = (feedbackId: number | string) => {
  return request.get({
    url: '/resource/feedback/conversation',
    params: { feedbackId }
  })
}

/**
 * 处理人回复反馈
 */
export const replyFeedback = (data: { feedbackId: number | string; content: string }) => {
  return request.post({
    url: '/resource/feedback/reply',
    data
  })
}

/**
 * 继续反馈（标记为继续处理）
 */
export const continueFeedback = (data: { feedbackId: number | string; reply?: string }) => {
  return request.post({
    url: '/resource/feedback/continue',
    data
  })
}

/**
 * 标记反馈为已解决
 */
export const resolveFeedback = (data: { feedbackId: number | string; reply?: string }) => {
  return request.post({
    url: '/resource/feedback/resolve',
    data
  })
}

