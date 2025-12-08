export interface TagCardItem {
  // 唯一标识
  id: string | number
  // 标题
  title: string
  // 图标
  icon?: string
  // 状态
  status: '启用中' | '停用'
  // 分数类型
  scoreType: '上升' | '下降'
  // 分数权重
  weight: '高权重' | '中权重' | '低权重'
  // 其他自定义字段
  [key: string]: any
}
