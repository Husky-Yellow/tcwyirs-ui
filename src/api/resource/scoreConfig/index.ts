import request from '@/config/axios'

/** 评分配置 VO */
export interface ScoreConfigVO {
  id?: number
  /** 配置名称 */
  name: string
  /** 配置项（如：及时性、准确性等） */
  item: string
  /** 权重（百分比） */
  weight: number
  /** 最高分 */
  maxScore?: number
  /** 排序 */
  sort?: number
  /** 状态：0-停用 1-启用 */
  status?: number
  /** 创建时间 */
  createTime?: Date
}

// 创建评分配置
export const createScoreConfig = (data: ScoreConfigVO) => {
  return request.post<number>({ url: '/resource/score-config/create', data })
}

// 更新评分配置
export const updateScoreConfig = (data: ScoreConfigVO) => {
  return request.put<void>({ url: '/resource/score-config/update', data })
}

// 删除评分配置
export const deleteScoreConfig = (id: number) => {
  return request.delete<void>({ url: '/resource/score-config/delete?id=' + id })
}

// 获取评分配置列表
export const getScoreConfigList = () => {
  return request.get<ScoreConfigVO[]>({ url: '/resource/score-config/list' })
}
