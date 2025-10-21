import request from '@/config/axios'

export interface TenantVO {
  id: number
  name: string
  contactName: string
  contactMobile: string
  status: number
  domain?: string
  website?: string
  packageId: number
  username: string
  password: string
  expireTime: Date | number | string
  accountCount: number
  createTime: Date
}

export interface TenantPageReqVO extends PageParam {
  name?: string
  contactName?: string
  contactMobile?: string
  status?: number
  createTime?: string[]
}

export interface TenantExportReqVO {
  name?: string
  contactName?: string
  contactMobile?: string
  status?: number
  createTime?: string[]
}

// 查询租户列表
export const getTenantPage = (params: TenantPageReqVO) => {
  return request.get<PageResult<TenantVO[]>>({ url: '/system/tenant/page', params })
}

// 查询租户详情
export const getTenant = (id: number) => {
  return request.get<TenantVO>({ url: '/system/tenant/get?id=' + id })
}

// 获取租户精简信息列表
export const getTenantList = () => {
  return request.get<TenantVO[]>({ url: '/system/tenant/simple-list' })
}

// 新增租户
export const createTenant = (data: TenantVO) => {
  return request.post<void>({ url: '/system/tenant/create', data })
}

// 修改租户
export const updateTenant = (data: TenantVO) => {
  return request.put<void>({ url: '/system/tenant/update', data })
}

// 删除租户
export const deleteTenant = (id: number) => {
  return request.delete<void>({ url: '/system/tenant/delete?id=' + id })
}

// 导出租户
export const exportTenant = (params: TenantExportReqVO) => {
  return request.download<Blob>({ url: '/system/tenant/export-excel', params })
}
