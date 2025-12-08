import request from '@/config/axios'

/** 评分标签 VO */
export interface ScoreTagVO {
    /** 标签id */
  id?: number
  /** 标签名称 */
  name: string
  /** 评分配置ID */
  confId: string
  /** 分数类型：1-上升(好评) 2-下降(差评) */
  type: '1' | '2'
  /** 分数权重：1-高权重 2-中权重 3-低权重 */
  weight?: '1' | '2' | '3'
  /** 是否展示 */
  showFlag: boolen
  /** 标签描述 */
  remark?: string




  /** 分数 */
  score: number
  /** 排序 */
  sort?: number
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
export const getScoreTagList = (params) => {
  return request.get<ScoreTagVO[]>({ url: '/resource/score-tag/list', params })
}

// 启用/停用标签
export const toggleScoreTag = (id: number, status: number) => {
  return request.post<void>({ url: '/resource/score-tag/toggle', data: { id, status } })
}
