import type { RoleLayoutConfigMap, HomeLayoutConfig } from '../types/layout'
import { HomeComponentType } from '../types/layout'

/**
 * 管理员角色配置
 */
const adminLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.BROWSED_RESOURCES,
        title: '我浏览过的资源',
        showViewAll: true,
        order: 1
      },
      {
        type: HomeComponentType.FAVORITE_RESOURCES,
        title: '我收藏的资源',
        showViewAll: true,
        order: 2
      },
      {
        type: HomeComponentType.HELP_DOCS,
        title: '帮助文档',
        showViewAll: true,
        order: 3
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE,
        order: 1
      },
      {
        type: HomeComponentType.MESSAGES,
        title: '消息',
        showViewAll: true,
        order: 2
      }
    ]
  }
}

/**
 * 普通用户角色配置
 */
const userLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.BROWSED_RESOURCES,
        title: '我浏览过的资源',
        showViewAll: true,
        order: 1
      },
      {
        type: HomeComponentType.HELP_DOCS,
        title: '帮助文档',
        showViewAll: true,
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MESSAGES,
        title: '消息',
        showViewAll: true,
        order: 1
      }
    ]
  }
}

/**
 * 访客角色配置
 */
const guestLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.HELP_DOCS,
        title: '帮助文档',
        showViewAll: true,
        order: 1
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MESSAGES,
        title: '公告',
        showViewAll: false,
        order: 1
      }
    ]
  }
}

/**
 * 数据管理员角色配置
 */
const dataAdminLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 18, lg: 18, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE,
        order: 1
      },
      {
        type: HomeComponentType.BROWSED_RESOURCES,
        title: '我浏览过的资源',
        showViewAll: true,
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 6, lg: 6, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MESSAGES,
        title: '系统通知',
        showViewAll: true,
        order: 1
      }
    ]
  }
}

/**
 * 角色布局配置映射
 */
export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  admin: adminLayout,
  user: userLayout,
  guest: guestLayout,
  dataAdmin: dataAdminLayout
}

/**
 * 获取指定角色的布局配置
 * @param role 角色标识
 * @returns 布局配置
 */
export const getRoleLayoutConfig = (role: string): HomeLayoutConfig => {
  return ROLE_LAYOUT_CONFIG[role] || ROLE_LAYOUT_CONFIG.user
}
