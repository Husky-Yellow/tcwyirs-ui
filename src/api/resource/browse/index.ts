import request from '@/config/axios'

/** 浏览记录 VO */
export interface BrowseRecordVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 资源封面 */
  resourceIcon?: string
  /** 浏览时长（秒） */
  duration?: number
  /** 浏览时间 */
  createTime?: Date
}

/** 浏览记录分页查询参数 */
export interface BrowseRecordPageReqVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 浏览时间 */
  createTime?: string[]
}

// 获取我的浏览历史
export const getBrowseRecordPage = (params: BrowseRecordPageReqVO) => {
  return request.get<PageResult<BrowseRecordVO[]>>({ url: '/resource/browse/page', params })
}
