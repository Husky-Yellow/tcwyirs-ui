/**
 * 资源模块公共类型定义
 */

/** 资源类型枚举 */
export enum ResourceType {
  /** 数据资源 */
  DATA = 1,
  /** 应用资源 */
  APPLICATION = 2,
  /** 组件资源 */
  COMPONENT = 3
}

/** 资源状态枚举 */
export enum ResourceStatus {
  /** 草稿 */
  DRAFT = 0,
  /** 待审批 */
  PENDING = 1,
  /** 已发布 */
  PUBLISHED = 2,
  /** 已下架 */
  UNPUBLISHED = 3,
  /** 已驳回 */
  REJECTED = 4
}

/** 申请状态枚举 */
export enum ApplyStatus {
  /** 待审批 */
  PENDING = 0,
  /** 已通过 */
  APPROVED = 1,
  /** 已驳回 */
  REJECTED = 2,
  /** 已撤销 */
  CANCELLED = 3
}

/** 使用状态枚举 */
export enum UsageStatus {
  /** 使用中 */
  ACTIVE = 1,
  /** 已停用 */
  STOPPED = 0
}

/** 反馈状态枚举 */
export enum FeedbackStatus {
  /** 待处理 */
  PENDING = 0,
  /** 处理中 */
  PROCESSING = 1,
  /** 已解决 */
  RESOLVED = 2,
  /** 已关闭 */
  CLOSED = 3
}
