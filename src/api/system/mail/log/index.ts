import request from '@/config/axios'

export interface MailLogVO {
  id: number
  userId: number
  userType: number
  toMail: string
  accountId: number
  fromMail: string
  templateId: number
  templateCode: string
  templateNickname: string
  templateTitle: string
  templateContent: string
  templateParams: string
  sendStatus: number
  sendTime: Date
  sendMessageId: string
  sendException: string
}

export interface MailLogPageReqVO extends PageParam {
  toMail?: string
  userId?: number
  userType?: number
  accountId?: number
  templateId?: number
  sendStatus?: number
  sendTime?: string[]
}

// 查询邮件日志列表
export const getMailLogPage = async (
  params: MailLogPageReqVO
): Promise<PageResult<MailLogVO[]>> => {
  return await request.get<PageResult<MailLogVO[]>>({ url: '/mq/mail-log/page', params })
}

// 查询邮件日志详情
export const getMailLog = async (id: number) => {
  return await request.get<MailLogVO>({ url: '/mq/mail-log/get?id=' + id })
}
