import request from '@/config/axios'

/** 通知消息 VO */
export interface NotifyMessageVO {
  /** 消息ID */
  id: number
  /** 用户ID */
  userId?: number
  /** 用户类型 */
  userType?: number
  /** 模板ID */
  templateId?: number
  /** 模板编码 */
  templateCode?: string
  /** 模板昵称 */
  templateNickname?: string
  /** 模板内容 */
  templateContent?: string
  /** 模板类型 */
  templateType?: number
  /** 模板参数 */
  templateParams?: Record<string, any>
  /** 是否已读 */
  readStatus?: boolean
  /** 阅读时间 */
  readTime?: Date | string
  /** 创建时间 */
  createTime?: Date | string
}

/** 通知消息分页查询参数 */
export interface NotifyMessagePageReqVO extends PageParam {
  /** 用户ID */
  userId?: number
  /** 用户类型 */
  userType?: number
  /** 模板编码 */
  templateCode?: string
  /** 是否已读 */
  readStatus?: boolean
}

/**
 * 获取我的消息分页列表
 * @param params 查询参数
 */
export const getMyNotifyMessagePage = (params: NotifyMessagePageReqVO) => {
  return request.get<PageResult<NotifyMessageVO>>({
    url: '/mq/notify-message/my-page',
    params
  })
}

/**
 * 标记单条消息已读
 * @param id 消息ID
 */
export const updateNotifyMessageRead = (id: number) => {
  return request.put<void>({
    url: '/mq/notify-message/update-read',
    data: { id }
  })
}

/**
 * 标记全部消息已读
 */
export const updateAllNotifyMessageRead = () => {
  return request.put<void>({
    url: '/mq/notify-message/update-all-read'
  })
}

/**
 * 删除消息
 * @param id 消息ID
 */
export const deleteNotifyMessage = (id: number) => {
  return request.delete<void>({
    url: `/mq/notify-message/delete?id=${id}`
  })
}
