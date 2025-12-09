/**
 * 表格列配置
 */
export interface TableColumn {
  /** 列的唯一标识 */
  key: string
  /** 列标题 */
  label: string
  /** 列宽度 */
  width?: string
  /** 输入框占位符 */
  placeholder?: string
}

/**
 * 表格行数据
 */
export interface TableRow {
  [key: string]: any
}

/**
 * 树形表格列配置
 */
export interface TreeTableColumn {
  /** 列的唯一标识 */
  key: string
  /** 列标题 */
  label: string
  /** 列宽度 */
  width?: string
  /** 输入框占位符 */
  placeholder?: string
  /** 输入类型：input, select, number */
  type?: 'input' | 'select' | 'number'
  /** select 选项 */
  options?: Array<{ label: string; value: any }>
  /** 其他组件属性 */
  componentProps?: Record<string, any>
}

/**
 * 树形表格行数据
 */
export interface TreeTableRow {
  [key: string]: any
  /** 子节点 */
  children?: TreeTableRow[]
}
