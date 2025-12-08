/**
 * 反馈数据类型定义
 */

// 反馈状态枚举
export enum FeedbackStatus {
  PENDING = 0, // 待处理
  PROCESSING = 1, // 处理中
  RESOLVED = 2 // 已处理
}

// 问题类型枚举
export enum FeedbackType {
  BUG = 1, // Bug反馈
  FEATURE = 2, // 功能建议
  IMPROVEMENT = 3, // 体验优化
  OTHER = 4 // 其他问题
}

// 反馈基础信息
export interface FeedbackVO {
  id: number | string
  title: string // 反馈标题/问题名称
  description: string // 问题描述
  type: FeedbackType // 问题类型
  status: FeedbackStatus // 反馈状态
  submitter?: string // 反馈人
  category?: string // 反馈类别
  createTime: string // 反馈时间/创建时间
}

// 搜索查询参数
export interface FeedbackQueryParams {
  pageNo: number
  pageSize: number
  title?: string // 反馈名称
  type?: FeedbackType // 问题类型
  status?: FeedbackStatus // 反馈状态
}

// 分页响应
export interface FeedbackPageResult {
  list: FeedbackVO[]
  total: number
}
