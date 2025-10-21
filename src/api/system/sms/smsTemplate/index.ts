import request from '@/config/axios'

export interface SmsTemplateVO {
  id?: number
  type?: number
  status: number
  code: string
  name: string
  content: string
  remark: string
  apiTemplateId: string
  channelId?: number
  channelCode?: string
  params?: string[]
  createTime?: Date
}

export interface SendSmsReqVO {
  mobile: string
  templateCode: string
  templateParams: Record<string, string>
}

export interface SmsTemplatePageReqVO extends PageParam {
  type?: number
  status?: number
  code?: string
  apiTemplateId?: string
  channelId?: number
  content?: string
  createTime?: string[]
}

// 查询短信模板列表
export const getSmsTemplatePage = (params: SmsTemplatePageReqVO) => {
  return request.get<PageResult<SmsTemplateVO[]>>({ url: '/mq/sms-template/page', params })
}

// 查询短信模板详情
export const getSmsTemplate = (id: number) => {
  return request.get<SmsTemplateVO>({ url: '/mq/sms-template/get?id=' + id })
}

// 新增短信模板
export const createSmsTemplate = (data: SmsTemplateVO) => {
  return request.post<void>({ url: '/mq/sms-template/create', data })
}

// 修改短信模板
export const updateSmsTemplate = (data: SmsTemplateVO) => {
  return request.put<void>({ url: '/mq/sms-template/update', data })
}

// 删除短信模板
export const deleteSmsTemplate = (id: number) => {
  return request.delete<void>({ url: '/mq/sms-template/delete?id=' + id })
}

// 导出短信模板
export const exportSmsTemplate = (params: SmsTemplatePageReqVO) => {
  return request.download<Blob>({
    url: '/mq/sms-template/export-excel',
    params
  })
}

// 发送短信
export const sendSms = (data: SendSmsReqVO) => {
  return request.post<number>({ url: '/mq/sms-template/send-sms', data })
}
