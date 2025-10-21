import request from '@/config/axios'

export interface MailTemplateVO {
  id: number
  name: string
  code: string
  accountId: number
  nickname: string
  title: string
  content: string
  params: string[]
  status: number
  remark: string
}

export interface MailSendReqVO {
  mail: string
  templateCode: string
  templateParams: Record<string, string>
}

export interface MailTemplatePageReqVO extends PageParam {
  code?: string
  name?: string
  accountId?: number
  status?: number
  createTime?: string[]
}

// 查询邮件模版列表
export const getMailTemplatePage = async (
  params: MailTemplatePageReqVO
): Promise<PageResult<MailTemplateVO[]>> => {
  return await request.get<PageResult<MailTemplateVO[]>>({ url: '/mq/mail-template/page', params })
}

// 查询邮件模版详情
export const getMailTemplate = async (id: number) => {
  return await request.get<MailTemplateVO>({ url: '/mq/mail-template/get?id=' + id })
}

// 新增邮件模版
export const createMailTemplate = async (data: MailTemplateVO) => {
  return await request.post<void>({ url: '/mq/mail-template/create', data })
}

// 修改邮件模版
export const updateMailTemplate = async (data: MailTemplateVO) => {
  return await request.put<void>({ url: '/mq/mail-template/update', data })
}

// 删除邮件模版
export const deleteMailTemplate = async (id: number) => {
  return await request.delete<void>({ url: '/mq/mail-template/delete?id=' + id })
}

// 发送邮件
export const sendMail = (data: MailSendReqVO) => {
  return request.post<number>({ url: '/mq/mail-template/send-mail', data })
}
