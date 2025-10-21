import request from '@/config/axios'

export interface NoticeVO {
  id: number | undefined
  title: string
  type: number
  content: string
  status: number
  remark: string
  creator: string
  createTime: Date
}

export interface NoticePageReqVO extends PageParam {
  title?: string
  type?: number
  status?: number
  createTime?: string[]
}

// 查询公告列表
export const getNoticePage = (params: NoticePageReqVO) => {
  return request.get<PageResult<NoticeVO[]>>({ url: '/mq/notice/page', params })
}

// 查询公告详情
export const getNotice = (id: number) => {
  return request.get<NoticeVO>({ url: '/mq/notice/get?id=' + id })
}

// 新增公告
export const createNotice = (data: NoticeVO) => {
  return request.post<void>({ url: '/mq/notice/create', data })
}

// 修改公告
export const updateNotice = (data: NoticeVO) => {
  return request.put<void>({ url: '/mq/notice/update', data })
}

// 删除公告
export const deleteNotice = (id: number) => {
  return request.delete<void>({ url: '/mq/notice/delete?id=' + id })
}

// 推送公告
export const pushNotice = (id: number) => {
  return request.post<void>({ url: '/mq/notice/push?id=' + id })
}
