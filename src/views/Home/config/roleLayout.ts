import type { RoleLayoutConfigMap, HomeLayoutConfig } from '../types/layout'
import { HomeComponentType } from '../types/layout'

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
 * 资源管理员角色配置
 */
const resourceAdminLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MY_UPLOADED_RESOURCES, // 我上架的资源+待我审批的资源
        order: 1
      },
      {
        type: HomeComponentType.Feedback, // 反馈意见
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE, // 资源使用看板
        order: 1
      },
      {
        type: HomeComponentType.MESSAGES, // 消息
        order: 2
      },
      {
        type: HomeComponentType.HELP_DOCS, // 帮助文档
        order: 3
      }
    ]
  }
}

/**
 * 运营管理员角色配置
 */
const operationAdminLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.APPROVAL_PENDING, // 资源上架审批
        order: 1
      },
      {
        type: HomeComponentType.Feedback, // 反馈意见
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.MESSAGES, // 消息
        order: 1
      },
      {
        type: HomeComponentType.HELP_DOCS, // 帮助文档
        order: 2
      }
    ]
  }
}
/**
 * 项目经理角色配置
 */
const projectManagerLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.BROWSED_RESOURCES, // 我申请的 + 我收藏的
        order: 1
      },
      {
        type: HomeComponentType.APPROVAL_WIDGET, // 反馈意见 + 我发起的审批
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE, // 资源使用看板
        order: 1
      },
      {
        type: HomeComponentType.MESSAGES, // 消息
        order: 2
      },
      {
        type: HomeComponentType.HELP_DOCS, // 帮助文档
        order: 3
      }
    ]
  }
}
/**
 * 项目成员角色配置
 */
const projectMemberLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.BROWSED_RESOURCES, // 我申请的 + 我收藏的
        order: 1
      },
      {
        type: HomeComponentType.APPROVAL_WIDGET, // 反馈意见 + 我发起的审批
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE, // 资源使用看板
        order: 1
      },
      {
        type: HomeComponentType.MESSAGES, // 消息
        order: 2
      },
      {
        type: HomeComponentType.HELP_DOCS, // 帮助文档
        order: 3
      }
    ]
  }
}

/**
 * 角色布局配置映射
 */
export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  user: userLayout, // 普通用户
  resource_admin: resourceAdminLayout, // 资源管理员
  operationAdmin: operationAdminLayout, // 运营管理员
  project_manager: projectManagerLayout, // 项目经理
  project_member: projectMemberLayout, // 项目成员
}

/**
 * 获取指定角色的布局配置
 * @param role 角色标识
 * @returns 布局配置
 */
export const getRoleLayoutConfig = (role: string): HomeLayoutConfig => {
  return ROLE_LAYOUT_CONFIG[role] || ROLE_LAYOUT_CONFIG.user
}
