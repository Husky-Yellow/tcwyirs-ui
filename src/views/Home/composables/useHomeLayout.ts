import { computed } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { getRoleLayoutConfig } from '../config/roleLayout'
import type { HomeLayoutConfig } from '../types/layout'

/**
 * 首页布局配置 Composable
 */
export const useHomeLayout = () => {
  const userStore = useUserStoreWithOut()

  /**
   * 当前用户角色
   * TODO: 根据实际项目调整获取角色的方式
   */
  const currentRole = computed(() => {
    // 从用户 store 获取角色，这里假设返回 'admin', 'user', 'guest' 等
    // 根据你的项目实际情况调整
    const roles = userStore.getRoles
    return roles?.[0] || 'user'
  })

  /**
   * 当前角色的布局配置
   */
  const layoutConfig = computed<HomeLayoutConfig>(() => {
    return getRoleLayoutConfig(currentRole.value)
  })

  /**
   * 左侧列配置
   */
  const leftColumn = computed(() => layoutConfig.value.left)

  /**
   * 右侧列配置
   */
  const rightColumn = computed(() => layoutConfig.value.right)

  /**
   * 获取排序后的组件列表
   */
  const getSortedComponents = (components: any[]) => {
    return components.filter((comp) => !comp.hidden).sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  return {
    currentRole,
    layoutConfig,
    leftColumn,
    rightColumn,
    getSortedComponents
  }
}
