import request from '@/config/axios'

export interface SmsChannelVO {
  id: number
  code: string
  status: number
  signature: string
  remark: string
  apiKey: string
  apiSecret: string
  callbackUrl: string
  createTime: Date
}

export interface SmsChannelPageReqVO extends PageParam {
  signature?: string
  status?: number
  createTime?: string[]
}

// 查询短信渠道列表
export const getSmsChannelPage = (params: SmsChannelPageReqVO) => {
  return request.get<PageResult<SmsChannelVO[]>>({ url: '/mq/sms-channel/page', params })
}

// 获得短信渠道精简列表
export function getSimpleSmsChannelList() {
  return request.get<SmsChannelVO[]>({ url: '/mq/sms-channel/simple-list' })
}

// 查询短信渠道详情
export const getSmsChannel = (id: number) => {
  return request.get<SmsChannelVO>({ url: '/mq/sms-channel/get?id=' + id })
}

// 新增短信渠道
export const createSmsChannel = (data: SmsChannelVO) => {
  return request.post<void>({ url: '/mq/sms-channel/create', data })
}

// 修改短信渠道
export const updateSmsChannel = (data: SmsChannelVO) => {
  return request.put<void>({ url: '/mq/sms-channel/update', data })
}

// 删除短信渠道
export const deleteSmsChannel = (id: number) => {
  return request.delete<void>({ url: '/mq/sms-channel/delete?id=' + id })
}
