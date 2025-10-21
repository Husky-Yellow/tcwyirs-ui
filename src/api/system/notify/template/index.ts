import request from '@/config/axios'

export interface NotifyTemplateVO {
  id?: number
  name: string
  nickname: string
  code: string
  content: string
  type?: number
  params: string[]
  status: number
  remark: string
}

export interface NotifySendReqVO {
  userId: number | null
  userType: number
  templateCode: string
  templateParams: Record<string, string>
}

export interface NotifyTemplatePageReqVO extends PageParam {
  name?: string
  code?: string
  status?: number
  type?: number
  createTime?: string[]
}

// 查询站内信模板列表
export const getNotifyTemplatePage = async (
  params: NotifyTemplatePageReqVO
): Promise<PageResult<NotifyTemplateVO[]>> => {
  return await request.get<PageResult<NotifyTemplateVO[]>>({ url: '/mq/notify-template/page', params })
}

// 查询站内信模板详情
export const getNotifyTemplate = async (id: number) => {
  return await request.get<NotifyTemplateVO>({ url: '/mq/notify-template/get?id=' + id })
}

// 新增站内信模板
export const createNotifyTemplate = async (data: NotifyTemplateVO) => {
  return await request.post<void>({ url: '/mq/notify-template/create', data })
}

// 修改站内信模板
export const updateNotifyTemplate = async (data: NotifyTemplateVO) => {
  return await request.put<void>({ url: '/mq/notify-template/update', data })
}

// 删除站内信模板
export const deleteNotifyTemplate = async (id: number) => {
  return await request.delete<void>({ url: '/mq/notify-template/delete?id=' + id })
}

// 发送站内信
export const sendNotify = (data: NotifySendReqVO) => {
  return request.post<number>({ url: '/mq/notify-template/send-notify', data })
}
