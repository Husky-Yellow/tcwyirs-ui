import request from '@/config/axios'

export type OperateLogVO = {
  id: number
  traceId: string
  userType: number
  userId: number
  userName: string
  type: string
  subType: string
  bizId: number
  action: string
  extra: string
  requestMethod: string
  requestUrl: string
  userIp: string
  userAgent: string
  creator: string
  creatorName: string
  createTime: Date
}

export interface OperateLogPageReqVO extends PageParam {
  userId?: number
  type?: string
  subType?: string
  action?: string
  createTime?: string[]
  bizId?: number
}

// 查询操作日志列表
export const getOperateLogPage = (params: OperateLogPageReqVO) => {
  return request.get<PageResult<OperateLogVO[]>>({ url: '/system/operate-log/page', params })
}
// 导出操作日志
export const exportOperateLog = (params: OperateLogPageReqVO) => {
  return request.download<Blob>({ url: '/system/operate-log/export', params })
}
