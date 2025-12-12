/**
 * 反馈数据类型定义
 */

// 反馈状态枚举
export enum FeedbackStatus {
  PENDING = 1, // 待处理
  PROCESSING = 2, // 处理中
  RESOLVED = 3 // 已处理
}

// 问题类型枚举
export enum FeedbackType {
  BUG = 1, // Bug反馈
  FEATURE = 2, // 功能建议
  IMPROVEMENT = 3, // 体验优化
  OTHER = 4 // 其他问题
}

// 查询类型枚举
export enum FeedbackQueryType {
  SUBMITTED = 1, // 我发起的反馈
  HANDLED = 2 // 我处理的反馈
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
  resourceId?: number // 资源ID
}

// 搜索查询参数
export interface FeedbackQueryParams {
  /**
   * 页码，从 1 开始
   */
  pageNo: number
  /**
   * 每页条数，最大值为 100
   */
  pageSize: number
  /**
   * 查询类型: 1-我发起的反馈 2-我处理的反馈
   */
  queryType: FeedbackQueryType
  /**
   * 资源ID
   */
  resourceId?: number
  /**
   * 反馈状态: 1-待处理 2-处理中 3-已处理，不传查询全部
   */
  status?: FeedbackStatus
  /**
   * 反馈类型
   */
  type?: FeedbackType
  /**
   * 反馈标题（搜索用）
   */
  title?: string
}

// 分页响应
export interface FeedbackPageResult {
  list: FeedbackVO[]
  total: number
}

