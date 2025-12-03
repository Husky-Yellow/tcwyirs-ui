/**
 * 反馈状态枚举
 */
export enum FeedbackStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已解决 */
  RESOLVED = 'resolved',
  /** 未解决 */
  UNRESOLVED = 'unresolved'
}

/**
 * 反馈回复项
 */
export interface FeedbackReply {
  /** 回复ID */
  id: string | number
  /** 回复内容 */
  content: string
  /** 回复时间 */
  time: string
  /** 回复人 */
  replier?: string
  /** 是否为自己发送的消息 */
  isSelf?: boolean
}

/**
 * 反馈详情数据
 */
export interface FeedbackDetail {
  /** 反馈ID */
  id: string | number
  /** 反馈状态 */
  status: FeedbackStatus
  /** 反馈类型 */
  type: string
  /** 反馈资源 */
  resource: string
  /** 反馈时间 */
  time: string
  /** 问题描述 */
  description: string
  /** 问题截图 */
  screenshot?: string
  /** 反馈内容（已废弃，使用 description） */
  content?: string
  /** 回复列表 */
  replies?: FeedbackReply[]
}

/**
 * 反馈方式选项
 */
export interface FeedbackOption {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string
}
