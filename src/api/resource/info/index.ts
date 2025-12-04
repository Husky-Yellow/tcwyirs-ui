import request from '@/config/axios'
import type { ResourceType } from '../types'

/** 资源信息 VO */
export interface ResourceInfoVO {
  id?: number
  /** 资源名称 */
  name: string
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  type: ResourceType
  /** 资源描述 */
  description?: string
  /** 资源图标/封面 */
  icon?: string
  /** 资源状态：0-草稿 1-待审批 2-已发布 3-已下架 4-已驳回 */
  status?: number
  /** 标签 */
  tags?: number[]
  /** 扩展信息（JSON字符串） */
  extInfo?: string
  /** 创建人 */
  creator?: string
  /** 创建时间 */
  createTime?: Date
  /** 更新时间 */
  updateTime?: Date
}

/** 资源分页查询参数 */
export interface ResourceInfoPageReqVO extends PageParam {
  /** 资源名称 */
  name?: string
  /** 资源类型 */
  type?: ResourceType
  /** 资源状态 */
  status?: number
  /** 标签 */
  tagId?: number
  /** 创建时间 */
  createTime?: string[]
}

// 创建资源
export const createResourceInfo = (data: ResourceInfoVO) => {
  return request.post<number>({ url: '/resource/info/create', data })
}

// 更新资源
export const updateResourceInfo = (data: ResourceInfoVO) => {
  return request.put<void>({ url: '/resource/info/update', data })
}

// 删除资源
export const deleteResourceInfo = (id: number) => {
  return request.delete<void>({ url: '/resource/info/delete?id=' + id })
}

// 获取资源详情
export const getResourceInfo = (id: number) => {
  return request.get<ResourceInfoVO>({ url: '/resource/info/get?id=' + id })
}

// 获取资源分页列表
export const getResourceInfoPage = (params: ResourceInfoPageReqVO) => {
  return request.get<PageResult<ResourceInfoVO[]>>({ url: '/resource/info/page', params })
}

// 发起上架申请
export const publishResourceInfo = (id: number) => {
  return request.post<void>({ url: '/resource/info/publish', data: { id } })
}

// 下架资源
export const unpublishResourceInfo = (id: number) => {
  return request.post<void>({ url: '/resource/info/unpublish', data: { id } })
}
