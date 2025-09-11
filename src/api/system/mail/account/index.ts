import request from '@/config/axios'

export interface MailAccountVO {
  id: number
  mail: string
  username: string
  password: string
  host: string
  port: number
  sslEnable: boolean
  starttlsEnable: boolean
}

// 查询邮箱账号列表
export const getMailAccountPage = async (params: PageParam) => {
  return await request.get({ url: '/mq/mail-account/page', params })
}

// 查询邮箱账号详情
export const getMailAccount = async (id: number) => {
  return await request.get({ url: '/mq/mail-account/get?id=' + id })
}

// 新增邮箱账号
export const createMailAccount = async (data: MailAccountVO) => {
  return await request.post({ url: '/mq/mail-account/create', data })
}

// 修改邮箱账号
export const updateMailAccount = async (data: MailAccountVO) => {
  return await request.put({ url: '/mq/mail-account/update', data })
}

// 删除邮箱账号
export const deleteMailAccount = async (id: number) => {
  return await request.delete({ url: '/mq/mail-account/delete?id=' + id })
}

// 获得邮箱账号精简列表
export const getSimpleMailAccountList = async () => {
  return request.get({ url: '/mq/mail-account/simple-list' })
}
