import { Component, markRaw } from 'vue'
import { HomeComponentType } from '../types/layout'
import BrowsedResourcesWidget from '../components/widgets/BrowsedResourcesWidget.vue'
import MyUploadedResourcesWidget from '../components/widgets/MyUploadedResourcesWidget.vue'
import HelpDocsWidget from '../components/widgets/HelpDocsWidget.vue'
import MessagesWidget from '../components/widgets/MessagesWidget.vue'
import ResourceUsageCard from '../components/ResourceUsageCard.vue'
import Feedback from '../components/widgets/Feedback.vue'
import MyApprovalsWidget from '../components/widgets/MyApprovalsWidget.vue'
import ApprovalPendingWidget from '../components/widgets/ApprovalPendingWidget.vue'

/**
 * 组件类型与实际组件的映射
 * 使用 markRaw 避免响应式处理组件对象
 */
export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.BROWSED_RESOURCES]: markRaw(BrowsedResourcesWidget), // 项目成员：我申请的资源+我收藏的资源
  [HomeComponentType.Feedback]: markRaw(Feedback), // 反馈意见
  [HomeComponentType.HELP_DOCS]: markRaw(HelpDocsWidget), // 帮助文档
  [HomeComponentType.MESSAGES]: markRaw(MessagesWidget), // 消息
  [HomeComponentType.RESOURCE_USAGE]: markRaw(ResourceUsageCard), // 资源使用看板
  [HomeComponentType.MY_APPROVALS]: markRaw(MyApprovalsWidget), // 我发起的审批
  [HomeComponentType.MY_UPLOADED_RESOURCES]: markRaw(MyUploadedResourcesWidget), // 资源管理员：我上架的资源+待我审批的资源
  [HomeComponentType.APPROVAL_PENDING]: markRaw(ApprovalPendingWidget), // 资源上架审批
  [HomeComponentType.CUSTOM]: markRaw({} as Component) // 自定义组件预留
}

/**
 * 获取组件实例
 * @param type 组件类型
 * @returns 组件实例
 */
export const getComponentByType = (type: HomeComponentType): Component | null => {
  return COMPONENT_MAP[type] || null
}
