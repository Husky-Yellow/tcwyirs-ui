import type { MockConfig, ApiResponse } from '../../types'
import type { ScoreConfigVO } from '@/api/resource/scoreConfig'
import { db, nextId } from './_data'

const mockConfigs: MockConfig[] = [
  { // 创建
    url: '/admin-api/resource/score-config/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ScoreConfigVO
      const id = nextId('scoreConfig')
      db.scoreConfigs.push({ ...data, id, createTime: new Date() as any })
      return { code: 0, data: id, msg: '' }
    }
  },
  { // 更新
    url: '/admin-api/resource/score-config/update',
    type: 'put',
    response: ({ body }): ApiResponse<void> => {
      const data = body as ScoreConfigVO
      const idx = db.scoreConfigs.findIndex((s) => s.id === data.id)
      if (idx >= 0) db.scoreConfigs[idx] = { ...db.scoreConfigs[idx], ...data }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 删除
    url: '/admin-api/resource/score-config/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.scoreConfigs = db.scoreConfigs.filter((s) => s.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  { // 列表
    url: '/admin-api/resource/score-config/list',
    type: 'get',
    response: (): ApiResponse<ScoreConfigVO[]> => ({ code: 0, data: db.scoreConfigs, msg: '' })
  }
]

export default mockConfigs
