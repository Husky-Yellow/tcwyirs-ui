/**
 * 审批详情页工具函数
 */
import type { ResourcePublishApplyRespVO } from '@/api/resource/info'
import { ApplyStatus } from '@/api/resource/types'
import { BpmNodeStatusColors, BpmApplyStatusConfig } from '@/utils/constants'

/**
 * 获取状态颜色
 * @param status 状态值
 * @returns 颜色值
 */
export const getStatusColor = (status?: number): string => {
  if (status === undefined) return '#909399'
  return BpmNodeStatusColors[status] || BpmApplyStatusConfig[status]?.color || '#909399'
}

/**
 * 计算当前步骤
 * @param applyData 申请数据
 * @returns 步骤索引
 */
export const calculateCurrentStep = (applyData: ResourcePublishApplyRespVO | null): number => {
  if (!applyData) return 0

  const activityNodes = applyData.approvalDetail?.activityNodes

  if (activityNodes && activityNodes.length > 0) {
    const completedCount = activityNodes.filter((node) =>
      node.status === 2 || (node.endTime && node.endTime !== '')
    ).length
    return Math.min(completedCount, 2)
  }

  // 兼容旧数据格式
  const status = applyData.status
  if (status === ApplyStatus.PENDING) return 1
  if (status === ApplyStatus.APPROVED || status === ApplyStatus.REJECTED) return 2
  return 0
}

/**
 * 计算流程状态
 * @param applyData 申请数据
 * @returns 流程状态
 */
export const calculateProcessStatus = (applyData: ResourcePublishApplyRespVO | null): 'process' | 'success' | 'error' => {
  if (!applyData) return 'process'

  const activityNodes = applyData.approvalDetail?.activityNodes

  if (activityNodes && activityNodes.length > 0) {
    const hasRejected = activityNodes.some((node) =>
      node.tasks?.some((task) => task.status === 3)
    )
    if (hasRejected) return 'error'

    const allCompleted = activityNodes.every((node) =>
      node.status === 2 || (node.endTime && node.endTime !== '')
    )
    if (allCompleted) return 'success'

    return 'process'
  }

  // 兼容旧数据格式
  const status = applyData.status
  if (status === ApplyStatus.APPROVED) return 'success'
  if (status === ApplyStatus.REJECTED) return 'error'
  return 'process'
}

/**
 * 计算步骤描述
 * @param applyData 申请数据
 * @returns 步骤描述对象
 */
export const calculateStepDescriptions = (applyData: ResourcePublishApplyRespVO | null) => {
  if (!applyData) {
    return {
      submit: '',
      review: '',
      result: { title: '申请结果', time: '' }
    }
  }

  const processInstance = applyData.approvalDetail?.processInstance
  const activityNodes = applyData.approvalDetail?.activityNodes

  const startTime = processInstance?.startTime || applyData.createTime || ''

  let reviewTime = startTime
  if (activityNodes && activityNodes.length > 0) {
    const firstApprovalNode = activityNodes.find((node) => node.startTime)
    reviewTime = firstApprovalNode?.startTime || startTime
  }

  let endTime = processInstance?.endTime || ''
  let resultTitle = '申请结果'

  if (activityNodes && activityNodes.length > 0) {
    const lastNode = activityNodes[activityNodes.length - 1]
    endTime = lastNode.endTime || endTime

    const hasRejected = activityNodes.some((node) =>
      node.tasks?.some((task) => task.status === 3)
    )
    const allCompleted = activityNodes.every((node) => node.status === 2)

    if (hasRejected) {
      resultTitle = '审批驳回'
    } else if (allCompleted) {
      resultTitle = '审批通过'
    }
  } else {
    // 兼容旧数据格式
    const status = applyData.status
    endTime = applyData.approvalTime || ''
    resultTitle =
      status === ApplyStatus.APPROVED
        ? '审批通过'
        : status === ApplyStatus.REJECTED
          ? '审批失败'
          : '申请结果'
  }

  return {
    submit: startTime,
    review: reviewTime,
    result: {
      title: resultTitle,
      time: endTime
    }
  }
}
