import request from '@/config/axios'
import type { FeedbackVO, FeedbackQueryParams, FeedbackPageResult } from '@/views/other/feedback/types'

/**
 * 获取我提交的反馈列表
 */
export const getSubmittedFeedbackPage = (params: FeedbackQueryParams) => {
  return request.get<FeedbackPageResult>({
    url: '/other/feedback/submitted/page',
    params
  })
}

/**
 * 获取我处理的反馈列表
 */
export const getHandledFeedbackPage = (params: FeedbackQueryParams) => {
  return request.get<FeedbackPageResult>({
    url: '/other/feedback/handled/page',
    params
  })
}

/**
 * 获取反馈详情
 */
export const getFeedbackDetail = (id: number | string) => {
  return request.get<FeedbackVO>({
    url: `/other/feedback/detail/${id}`
  })
}
