/**
 * UI 组件相关类型定义
 * 整合了 Element Plus、布局、主题、图标等 UI 相关的类型
 */

// ========== Element Plus ==========

export type ElementPlusSize = 'default' | 'small' | 'large'

export type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger'

// ========== 布局 ==========

export type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

// ========== 主题 ==========

export type ThemeTypes = {
  elColorPrimary?: string
  leftMenuBorderColor?: string
  leftMenuBgColor?: string
  leftMenuBgLightColor?: string
  leftMenuBgActiveColor?: string
  leftMenuCollapseBgActiveColor?: string
  leftMenuTextColor?: string
  leftMenuTextActiveColor?: string
  logoTitleTextColor?: string
  logoBorderColor?: string
  topHeaderBgColor?: string
  topHeaderTextColor?: string
  topHeaderHoverColor?: string
  topToolBorderColor?: string
}

// ========== 全局配置 ==========

export interface ConfigGlobalTypes {
  size?: ElementPlusSize
}

// ========== 图标 ==========

export interface IconTypes {
  size?: number
  color?: string
  icon: string
}

// ========== 上下文菜单 ==========

export type ContextMenuSchema = {
  disabled?: boolean
  divided?: boolean
  icon?: string
  label: string
  command?: (item: ContextMenuSchema) => void
}

// ========== 提示 ==========

export interface TipSchema {
  label: string
  keys?: string[]
}

// ========== 二维码 ==========

export interface QrcodeLogo {
  src?: string
  logoSize?: number
  bgColor?: string
  borderSize?: number
  crossOrigin?: string
  borderRadius?: number
  logoRadius?: number
}
