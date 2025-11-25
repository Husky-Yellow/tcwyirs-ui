/**
 * 状态样式配置
 */
export type StatusColorMap = Record<string, { dot: string; text: string }>

/**
 * 预定义的状态颜色映射
 */
export const STATUS_COLORS = {
  // 审批状态
  pending: { dot: 'bg-[#409EFF]', text: 'text-[#409EFF]' }, // 蓝色 - 待处理/审批中
  approved: { dot: 'bg-[#67C23A]', text: 'text-[#67C23A]' }, // 绿色 - 已通过
  rejected: { dot: 'bg-[#F56C6C]', text: 'text-[#F56C6C]' }, // 红色 - 已驳回

  // 申请状态
  applying: { dot: 'bg-[#409EFF]', text: 'text-[#409EFF]' }, // 蓝色 - 申请中
  success: { dot: 'bg-[#67C23A]', text: 'text-[#67C23A]' }, // 绿色 - 申请成功
  failed: { dot: 'bg-[#F56C6C]', text: 'text-[#F56C6C]' }, // 红色 - 申请失败

  // 上架状态
  online: { dot: 'bg-[#67C23A]', text: 'text-[#67C23A]' }, // 绿色 - 已上架
  reviewing: { dot: 'bg-[#409EFF]', text: 'text-[#409EFF]' }, // 蓝色 - 审核中
  offline: { dot: 'bg-[#909399]', text: 'text-[#909399]' }, // 灰色 - 已下架

  // 默认
  default: { dot: 'bg-[#909399]', text: 'text-[#909399]' } // 灰色
} as const

/**
 * 使用状态样式的 composable
 * @param colorMap 自定义状态颜色映射，如果不提供则使用默认映射
 */
export const useStatusStyle = (colorMap?: StatusColorMap) => {
  const colors = colorMap || STATUS_COLORS

  /**
   * 获取状态圆点的样式类
   */
  const getStatusDotClass = (status: string): string => {
    return colors[status]?.dot || colors.default.dot
  }

  /**
   * 获取状态文字的样式类
   */
  const getStatusTextClass = (status: string): string => {
    return colors[status]?.text || colors.default.text
  }

  return {
    getStatusDotClass,
    getStatusTextClass
  }
}
