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
