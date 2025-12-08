import request from '@/config/axios'

/**
 * 工作台统计数据 VO
 */
export interface WorkbenchStatisticsRespVO {
  /**
   * 上架资源次数
   */
  publishCount?: number
  /**
   * 资源被申请次数
   */
  applyCount?: number
  /**
   * 待审批资源数
   */
  pendingApprovalCount?: number
  /**
   * 待处理反馈数
   */
  pendingFeedbackCount?: number
  [property: string]: any
}

// 获取工作台统计数据
export const getWorkbenchStatistics = () => {
  return request.get<WorkbenchStatisticsRespVO>({ url: '/resource/workbench/statistics' })
}


/**
 * 类型占比
 *
 * TypePercentage
 */
export interface TypePercentage {
  /**
   * 数量
   */
  count?: number;
  /**
   * 占比（百分比）
   */
  percentage?: number;
  /**
   * 资源类型
   */
  type?: number;
  /**
   * 资源类型名称
   */
  typeName?: string;
  [property: string]: any;
}
/**
 * 返回数据
 *
 * ResourceUsageBoardRespVO
 */
export interface ResourceUsageBoardRespVO {
  /**
   * 应用资源使用数量
   */
  appResourceCount?: number;
  /**
   * 组件资源使用数量
   */
  componentResourceCount?: number;
  /**
   * 数据资源使用数量
   */
  dataResourceCount?: number;
  /**
   * 总数量
   */
  totalCount?: number;
  /**
   * 各类型占比列表（用于饼图展示）
   */
  typePercentages?: TypePercentage[];
  [property: string]: any;
}
// 统计已上架资源按type分组的数量和占比，用于饼图展示
export const getWorkbenchUsageBoard = () => {
  return request.get<ResourceUsageBoardRespVO>({ url: '/resource/workbench/usage-board' })
}
