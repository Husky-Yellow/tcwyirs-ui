/**
 * 资源模块通用类型定义
 */

/**
 * 搜索表单数据
 */
export interface SearchFormData {
  name: string
  type: string
}

/**
 * 资源类型选项
 */
export interface TypeOption {
  label: string
  value: string
}

/**
 * 资源列表项
 */
export interface ResourceItem {
  id: string | number
  name: string
  [key: string]: any
}

/**
 * 表格数据项
 */
export interface TableDataItem {
  id: string | number
  name: string
  address: string
  description: string
  createTime: string
  [key: string]: any
}

/**
 * 分页数据
 */
export interface PaginationData {
  page: number
  pageSize: number
  total: number
}

/**
 * 列表查询参数
 */
export interface ListQueryParams extends SearchFormData {
  resourceId?: string | number
  page: number
  pageSize: number
}

/**
 * 列表响应数据
 */
export interface ListResponse<T = TableDataItem> {
  list: T[]
  total: number
}
