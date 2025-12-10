import request from '@/config/axios'

/** 资源标签 VO */
export interface ResourceTagVO {
  id?: number
  /** 标签名称 */
  name: string
  /** 标签编码 */
  code?: string
  /** 标签颜色 */
  color?: string
  /** 标签图标 */
  icon?: string
  /** 标签类型：0-系统标签 1-用户自定义标签 */
  type?: number
  /** 排序 */
  sort?: number
  /** 状态: 0-禁用 1-启用 */
  status?: number
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime?: Date
}

/** 标签列表查询参数 */
export interface ResourceTagListReqVO {
  /** 标签类型 */
  type?: number
  /** 状态: 0-禁用 1-启用 */
  status?: number
}

/** 资源标签 Response VO */
export interface ResourceTagRespVO {
  /** 标签ID */
  id?: number
  /** 标签名称 */
  name?: string
  /** 创建用户ID */
  userId?: number
  /** 创建时间 */
  createTime?: string
}

// 创建标签
export const createResourceTag = (data: ResourceTagVO) => {
  return request.post<number>({ url: '/resource/tag/create', data })
}

// 更新标签
export const updateResourceTag = (data: ResourceTagVO) => {
  return request.put<void>({ url: '/resource/tag/update', data })
}

// 删除标签
export const deleteResourceTag = (id: number) => {
  return request.delete<void>({ url: '/resource/tag/delete?id=' + id })
}

// 获取标签列表
export const getResourceTagList = (params?: ResourceTagListReqVO) => {
  return request.get<ResourceTagVO[]>({ url: '/resource/tag/list', params })
}

// 获取用户自定义标签列表
export const getUserTagList = () => {
  return request.get<ResourceTagVO[]>({ url: '/resource/tag/user-list' })
}

// 创建用户自定义标签
export const createUserTag = (data: ResourceTagVO) => {
  return request.post<number>({ url: '/resource/tag/user-create', data })
}

// 删除用户自定义标签
export const deleteUserTag = (id: number) => {
  return request.delete<void>({ url: '/resource/tag/user-delete?id=' + id })
}

// 获取标签简单列表
export const getResourceTagSimpleList = (params?: ResourceTagListReqVO) => {
  return request.get<ResourceTagRespVO[]>({ url: '/resource/tag/simple-list', params })
}
