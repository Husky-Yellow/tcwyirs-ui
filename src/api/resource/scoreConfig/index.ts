import request from '@/config/axios'

/**
 * ResourceScoreConfigSaveReqVO
 */
export interface ScoreConfigVO {
  /**
   * 配置名称
   */
  configName: string;
  /**
   * 高权重分值
   */
  highWeightScore?: number;
  /**
   * 配置ID
   */
  id?: number;
  /**
   * 初始分数
   */
  initScore?: number;
  /**
   * 低权重分值
   */
  lowWeightScore?: number;
  /**
   * 中权重分值
   */
  mediumWeightScore?: number;
  /**
   * 分数类型
   */
  scoreType: number;
  [property: string]: any;
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
