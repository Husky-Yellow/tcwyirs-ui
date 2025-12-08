import { useStatusStyle } from '@/views/Home/composables/useStatusStyle'
import { FeedbackStatus } from '../types'

/**
 * 反馈状态颜色映射
 */
const FEEDBACK_STATUS_COLORS = {
  [FeedbackStatus.PENDING]: { dot: 'bg-[#409EFF]', text: 'text-[#409EFF]' }, // 蓝色 - 待处理
  [FeedbackStatus.PROCESSING]: { dot: 'bg-[#E6A23C]', text: 'text-[#E6A23C]' }, // 橙色 - 处理中
  [FeedbackStatus.RESOLVED]: { dot: 'bg-[#67C23A]', text: 'text-[#67C23A]' } // 绿色 - 已处理
}

/**
 * 反馈状态文本映射
 */
const FEEDBACK_STATUS_TEXT = {
  [FeedbackStatus.PENDING]: '待处理',
  [FeedbackStatus.PROCESSING]: '处理中',
  [FeedbackStatus.RESOLVED]: '已处理'
}

/**
 * 使用反馈状态样式
 */
export const useFeedbackStatus = () => {
  const { getStatusDotClass, getStatusTextClass } = useStatusStyle(FEEDBACK_STATUS_COLORS)

  const getStatusText = (status: FeedbackStatus): string => {
    return FEEDBACK_STATUS_TEXT[status] || '未知'
  }

  return {
    getStatusDotClass,
    getStatusTextClass,
    getStatusText
  }
}
