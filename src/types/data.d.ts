/**
 * 表单相关类型定义
 * 包含表单、表格、描述列表等数据展示组件的类型
 */

import type { CSSProperties } from 'vue'
import type { AxiosPromise } from 'axios'
import { ColProps, ComponentProps, ComponentName } from './component'

// ========== 表单 ==========

export type FormValueType = string | number | string[] | number[] | boolean | undefined | null

export type FormSetPropsType = {
  field: string
  path: string
  value: any
}

export type FormItemProps = {
  labelWidth?: string | number
  required?: boolean
  rules?: Recordable
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  style?: CSSProperties
}

export type FormSchema = {
  // 唯一值
  field: string
  // 标题
  label?: string
  // 提示
  labelMessage?: string
  // col组件属性
  colProps?: ColProps
  // 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档
  componentProps?: { slots?: Recordable } & ComponentProps
  // formItem组件属性
  formItemProps?: FormItemProps
  // 渲染的组件
  component?: ComponentName
  // 初始值
  value?: FormValueType
  // 是否隐藏
  hidden?: boolean
  // 远程加载下拉项
  api?: <T = any>() => AxiosPromise<T>
}

// ========== 表格 ==========

export type TableColumn = {
  field: string
  label?: string
  width?: number | string
  fixed?: 'left' | 'right'
  children?: TableColumn[]
} & Recordable

export type VxeTableColumn = {
  field: string
  title?: string
  children?: TableColumn[]
} & Recordable

export type TableSlotDefault = {
  row: Recordable
  column: TableColumn
  $index: number
} & Recordable

export interface Pagination {
  small?: boolean
  background?: boolean
  pageSize?: number
  defaultPageSize?: number
  total?: number
  pageCount?: number
  pagerCount?: number
  currentPage?: number
  defaultCurrentPage?: number
  layout?: string
  pageSizes?: number[]
  popperClass?: string
  prevText?: string
  nextText?: string
  disabled?: boolean
  hideOnSinglePage?: boolean
}

export interface TableSetPropsType {
  field: string
  path: string
  value: any
}

// ========== 描述列表 ==========

export interface DescriptionsSchema {
  span?: number // 占多少分
  field: string // 字段名
  label?: string // label名
  mappedField?: string // 字段映射
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  dateFormat?: string // add by 星语：支持时间的格式化
  dictType?: string // add by 星语：支持 dict 字典数据
}
