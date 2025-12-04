import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { FeedbackVO, FeedbackPageReqVO, FeedbackReplyVO, TransferFeedbackVO } from '@/api/resource/feedback'
import { db, nextId, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  { // 提交反馈
    url: '/admin-api/resource/feedback/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as FeedbackVO
      const id = nextId('feedback')
      db.feedbacks.unshift({ ...data, id, status: 0, replies: [], createTime: new Date() as any, updateTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 我的反馈
    url: '/admin-api/resource/feedback/my-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<FeedbackVO>> => {
      const { pageNo = 1, pageSize = 10, title, type, status } = query as any as FeedbackPageReqVO & any
      let list = db.feedbacks.slice()
      if (title) list = list.filter((f) => (f.title || '').toLowerCase().includes(String(title).toLowerCase()))
      if (type !== undefined && String(type) !== '') list = list.filter((f) => String(f.type) === String(type))
      if (status !== undefined && String(status) !== '') list = list.filter((f) => String(f.status) === String(status))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 待处理
    url: '/admin-api/resource/feedback/pending-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<FeedbackVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      let list = db.feedbacks.filter((f) => f.status === 0 || f.status === 1)
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 已处理
    url: '/admin-api/resource/feedback/done-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<FeedbackVO>> => {
      const { pageNo = 1, pageSize = 10 } = query as any
      let list = db.feedbacks.filter((f) => f.status === 2 || f.status === 3)
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  { // 详情
    url: '/admin-api/resource/feedback/get',
    type: 'get',
    response: ({ query }): ApiResponse<FeedbackVO | null> => {
      const id = Number(query.id)
      const item = db.feedbacks.find((f) => f.id === id) || null
      return { code: 0, data: item, msg: '' }
    }
  },
  { // 回复
    url: '/admin-api/resource/feedback/reply',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as FeedbackReplyVO
      const fb = db.feedbacks.find((f) => f.id === data.feedbackId)
      const id = nextId('feedbackReply')
      const reply: FeedbackReplyVO = { ...data, id, createTime: new Date() as any }
      if (fb) {
        fb.replies = fb.replies || []
        fb.replies.push(reply)
        fb.status = 1
        fb.updateTime = new Date() as any
      }
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 转交
    url: '/admin-api/resource/feedback/transfer',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const data = body as TransferFeedbackVO
      const fb = db.feedbacks.find((f) => f.id === data.id)
      if (fb) {
        fb.handlerId = data.userId
        fb.handler = 'User_' + data.userId
        fb.status = 1
        fb.updateTime = new Date() as any
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 解决
    url: '/admin-api/resource/feedback/resolve',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const fb = db.feedbacks.find((f) => f.id === id)
      if (fb) {
        fb.status = 2
        fb.updateTime = new Date() as any
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 继续反馈
    url: '/admin-api/resource/feedback/continue',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id, content } = body as { id: number; content: string }
      const fb = db.feedbacks.find((f) => f.id === id)
      if (fb) {
        fb.status = 1
        fb.updateTime = new Date() as any
        fb.replies = fb.replies || []
        fb.replies.push({ id: nextId('feedbackReply'), feedbackId: id, content, replier: 'User', replierId: 0, createTime: new Date() as any })
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
