import type { MockConfig, ApiResponse } from '../../types'
import type { ResourceEvaluateVO, ResourceEvaluateReplyVO } from '@/api/resource/evaluate'
import { db, nextId } from './_data'

const mockConfigs: MockConfig[] = [
  { // 发布评价
    url: '/admin-api/resource/evaluate/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceEvaluateVO
      const id = nextId('evaluate')
      db.evaluates.unshift({ ...data, id, createTime: new Date() as any, replies: [] })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 回复评价
    url: '/admin-api/resource/evaluate/reply',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceEvaluateReplyVO
      const item = db.evaluates.find((e) => e.id === data.evaluateId)
      const id = nextId('evalReply')
      const reply: ResourceEvaluateReplyVO = { ...data, id, createTime: new Date() as any }
      if (item) {
        item.replies = item.replies || []
        item.replies.push(reply)
      }
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 列表
    url: '/admin-api/resource/evaluate/list',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceEvaluateVO[]> => {
      const resourceId = Number(query.resourceId)
      const list = db.evaluates.filter((e) => e.resourceId === resourceId)
      return { code: 0, data: list, msg: '' }
    }
  },
  { // 快速评分
    url: '/admin-api/resource/evaluate/quick',
    type: 'post',
    response: (): ApiResponse<number> => {
      return { code: 0, data: nextId('evaluate'), msg: '' }
    }
  }
]

export default mockConfigs
