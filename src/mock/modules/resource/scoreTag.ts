import type { MockConfig, ApiResponse } from '../../types'
import type { ScoreTagVO } from '@/api/resource/scoreTag'
import { db, nextId } from './_data'

const mockConfigs: MockConfig[] = [
  { // 创建
    url: '/admin-api/resource/score-tag/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ScoreTagVO
      const id = nextId('scoreTag')
      db.scoreTags.push({ ...data, id, createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 更新
    url: '/admin-api/resource/score-tag/update',
    type: 'put',
    response: ({ body }): ApiResponse<void> => {
      const data = body as ScoreTagVO
      const idx = db.scoreTags.findIndex((s) => s.id === data.id)
      if (idx >= 0) db.scoreTags[idx] = { ...db.scoreTags[idx], ...data }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 删除
    url: '/admin-api/resource/score-tag/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.scoreTags = db.scoreTags.filter((s) => s.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 列表
    url: '/admin-api/resource/score-tag/list',
    type: 'get',
    response: (): ApiResponse<ScoreTagVO[]> => ({ code: 0, data: db.scoreTags, msg: '' })
  },
  { // 启用/停用
    url: '/admin-api/resource/score-tag/toggle',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id, status } = body as { id: number; status: number }
      const item = db.scoreTags.find((s) => s.id === id)
      if (item) item.status = status
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
