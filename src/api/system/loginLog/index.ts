import request from '@/config/axios'

export interface LoginLogVO {
  id: number
  logType: number
  traceId: number
  userId: number
  userType: number
  username: string
  result: number
  status: number
  userIp: string
  userAgent: string
  createTime: Date
}

export interface LoginLogPageReqVO extends PageParam {
  username?: string
  userIp?: string
  createTime?: string[]
}

// 查询登录日志列表
export const getLoginLogPage = (params: LoginLogPageReqVO) => {
  return request.get<PageResult<LoginLogVO[]>>({ url: '/system/login-log/page', params })
}

// 导出登录日志
export const exportLoginLog = (params: LoginLogPageReqVO) => {
  return request.download<Blob>({ url: '/system/login-log/export', params })
}
