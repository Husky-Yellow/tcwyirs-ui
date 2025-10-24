/**
 * 首页布局配置类型定义
 */

// 组件类型枚举
export enum HomeComponentType {
  // 浏览资源统计
  BROWSED_RESOURCES = 'BrowsedResources',
  // 收藏资源
  FAVORITE_RESOURCES = 'FavoriteResources',
  // 帮助文档
  HELP_DOCS = 'HelpDocs',
  // 资源使用看板
  RESOURCE_USAGE = 'ResourceUsage',
  // 消息列表
  MESSAGES = 'Messages',
  // 自定义组件（预留）
  CUSTOM = 'Custom'
}

// 单个组件配置
export interface HomeComponentConfig {
  // 组件类型
  type: HomeComponentType
  // 组件标题
  title?: string
  // 是否显示"全部"链接
  showViewAll?: boolean
  // 自定义配置参数
  props?: Record<string, any>
  // 是否隐藏
  hidden?: boolean
  // 排序权重（数字越小越靠前）
  order?: number
}

// 列配置
export interface HomeColumnConfig {
  // 列宽配置（Element Plus 的 col 配置）
  span: {
    xl: number
    lg: number
    md: number
    sm: number
    xs: number
  }
  // 组件列表
  components: HomeComponentConfig[]
}

// 完整的首页布局配置
export interface HomeLayoutConfig {
  // 左侧列配置
  left: HomeColumnConfig
  // 右侧列配置
  right: HomeColumnConfig
}

// 角色配置映射
export type RoleLayoutConfigMap = Record<string, HomeLayoutConfig>
