import request from '@/config/axios'

/** 工作台数据 VO */
export interface DashboardDataVO {
  /** 我申请的资源数量 */
  myApplyCount?: number
  /** 待我审批数量 */
  pendingApprovalCount?: number
  /** 我上架的资源数量 */
  myPublishedCount?: number
  /** 待审批上架数量 */
  pendingPublishCount?: number
  /** 反馈意见数量 */
  feedbackCount?: number
  /** 待处理反馈数量 */
  pendingFeedbackCount?: number
  /** 资源使用统计 */
  usageStatistics?: ResourceUsageStatistics
  /** 浏览记录数量 */
  browseCount?: number
  /** 收藏数量 */
  collectCount?: number
  /** 消息通知数量 */
  messageCount?: number
}

/** 资源使用统计 */
export interface ResourceUsageStatistics {
  /** 总资源数 */
  totalCount?: number
  /** 数据资源数 */
  dataCount?: number
  /** 应用资源数 */
  applicationCount?: number
  /** 组件资源数 */
  componentCount?: number
  /** 使用中资源数 */
  activeCount?: number
  /** 已停用资源数 */
  stoppedCount?: number
}

// 获取工作台数据（根据角色返回不同数据）
export const getDashboardData = () => {
  return request.get<DashboardDataVO>({ url: '/resource/statistics/dashboard' })
}
