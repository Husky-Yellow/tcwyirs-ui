import request from '@/config/axios'

/** 评分标签 VO */
export interface ScoreTagVO {
  id?: number
  /** 标签名称 */
  name: string
  /** 标签描述 */
  description?: string
  /** 分数 */
  score: number
  /** 标签图标 */
  icon?: string
  /** 标签颜色 */
  color?: string
  /** 排序 */
  sort?: number
  /** 状态：0-停用 1-启用（展示） */
  status?: number
  /** 创建时间 */
  createTime?: Date
}

// 创建评分标签
export const createScoreTag = (data: ScoreTagVO) => {
  return request.post<number>({ url: '/resource/score-tag/create', data })
}

// 更新评分标签
export const updateScoreTag = (data: ScoreTagVO) => {
  return request.put<void>({ url: '/resource/score-tag/update', data })
}

// 删除评分标签
export const deleteScoreTag = (id: number) => {
  return request.delete<void>({ url: '/resource/score-tag/delete?id=' + id })
}

// 获取评分标签列表
export const getScoreTagList = () => {
  return request.get<ScoreTagVO[]>({ url: '/resource/score-tag/list' })
}

// 启用/停用标签
export const toggleScoreTag = (id: number, status: number) => {
  return request.post<void>({ url: '/resource/score-tag/toggle', data: { id, status } })
}
