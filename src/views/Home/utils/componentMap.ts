import { Component, markRaw } from 'vue'
import { HomeComponentType } from '../types/layout'
import BrowsedResourcesWidget from '../components/widgets/BrowsedResourcesWidget.vue'
import FavoriteResourcesWidget from '../components/widgets/FavoriteResourcesWidget.vue'
import HelpDocsWidget from '../components/widgets/HelpDocsWidget.vue'
import MessagesWidget from '../components/widgets/MessagesWidget.vue'
import ResourceUsageWidget from '../components/widgets/ResourceUsageWidget.vue'

/**
 * 组件类型与实际组件的映射
 * 使用 markRaw 避免响应式处理组件对象
 */
export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.BROWSED_RESOURCES]: markRaw(BrowsedResourcesWidget),
  [HomeComponentType.FAVORITE_RESOURCES]: markRaw(FavoriteResourcesWidget),
  [HomeComponentType.HELP_DOCS]: markRaw(HelpDocsWidget),
  [HomeComponentType.MESSAGES]: markRaw(MessagesWidget),
  [HomeComponentType.RESOURCE_USAGE]: markRaw(ResourceUsageWidget),
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
