import request from '@/config/axios'

/** 收藏记录 VO */
export interface CollectRecordVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 资源封面 */
  resourceIcon?: string
  /** 收藏时间 */
  createTime?: Date
}

/** 收藏记录分页查询参数 */
export interface CollectRecordPageReqVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 收藏时间 */
  createTime?: string[]
}

// 获取我的收藏列表
export const getCollectRecordPage = (params: CollectRecordPageReqVO) => {
  return request.get<PageResult<CollectRecordVO[]>>({ url: '/resource/collect/page', params })
}

// 添加收藏
export const addCollect = (resourceId: number) => {
  return request.post<number>({ url: '/resource/collect/add', data: { resourceId } })
}

// 取消收藏
export const cancelCollect = (id: number) => {
  return request.delete<void>({ url: '/resource/collect/cancel?id=' + id })
}
