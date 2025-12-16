/**
 * Created by 芋道源码
 *
 * 枚举类
 */

// ========== COMMON 模块 ==========
// 全局通用状态枚举
export const CommonStatusEnum = {
  ENABLE: 0, // 开启
  DISABLE: 1 // 禁用
}

// 全局用户类型枚举
/**
 * @deprecated 项目内未引用
 */
export const UserTypeEnum = {
  MEMBER: 1, // 会员
  ADMIN: 2 // 管理员
}

// ========== SYSTEM 模块 ==========
/**
 * 菜单的类型枚举
 */
export const SystemMenuTypeEnum = {
  DIR: 1, // 目录
  MENU: 2, // 菜单
  BUTTON: 3 // 按钮
}

/**
 * 角色的类型枚举
 * @deprecated 项目内未引用
 */
export const SystemRoleTypeEnum = {
  SYSTEM: 1, // 内置角色
  CUSTOM: 2 // 自定义角色
}

/**
 * 数据权限的范围枚举
 */
export const SystemDataScopeEnum = {
  ALL: 1, // 全部数据权限
  DEPT_CUSTOM: 2, // 指定部门数据权限
  DEPT_ONLY: 3, // 部门数据权限
  DEPT_AND_CHILD: 4, // 部门及以下数据权限
  DEPT_SELF: 5 // 仅本人数据权限
}

/**
 * 用户的社交平台的类型枚举
 */
export const SystemUserSocialTypeEnum = {
  DINGTALK: {
    title: '钉钉',
    type: 20,
    source: 'dingtalk',
    img: 'https://s1.ax1x.com/2022/05/22/OzMDRs.png'
  },
  WECHAT_ENTERPRISE: {
    title: '企业微信',
    type: 30,
    source: 'wechat_enterprise',
    img: 'https://s1.ax1x.com/2022/05/22/OzMrzn.png'
  }
}

// ========== INFRA 模块 ==========
/**
 * 代码生成模板类型
 * @deprecated 项目内未引用
 */
export const InfraCodegenTemplateTypeEnum = {
  CRUD: 1, // 基础 CRUD
  TREE: 2, // 树形 CRUD
  SUB: 15 // 主子表 CRUD
}

/**
 * 任务状态的枚举
 */
export const InfraJobStatusEnum = {
  INIT: 0, // 初始化中
  NORMAL: 1, // 运行中
  STOP: 2 // 暂停运行
}

/**
 * API 异常数据的处理状态
 */
export const InfraApiErrorLogProcessStatusEnum = {
  INIT: 0, // 未处理
  DONE: 1, // 已处理
  IGNORE: 2 // 已忽略
}

/**
 * 支付类型枚举
 * @deprecated 项目内未引用
 */
export const PayType = {
  WECHAT: 'WECHAT',
  ALIPAY: 'ALIPAY',
  MOCK: 'MOCK'
}

/**
 * 支付订单状态枚举
 * @deprecated 项目内未引用
 */
export const PayOrderStatusEnum = {
  WAITING: {
    status: 0,
    name: '未支付'
  },
  SUCCESS: {
    status: 10,
    name: '已支付'
  },
  CLOSED: {
    status: 20,
    name: '未支付'
  }
}

// ========== MALL - 营销模块 ==========
/**
 * 优惠劵模板的有限期类型的枚举
 */
export const CouponTemplateValidityTypeEnum = {
  DATE: {
    type: 1,
    name: '固定日期可用'
  },
  TERM: {
    type: 2,
    name: '领取之后可用'
  }
}

/**
 * 优惠劵模板的领取方式的枚举
 */
export const CouponTemplateTakeTypeEnum = {
  USER: {
    type: 1,
    name: '直接领取'
  },
  ADMIN: {
    type: 2,
    name: '指定发放'
  },
  REGISTER: {
    type: 3,
    name: '新人券'
  }
}

/**
 * 优惠类型枚举
 */
export const PromotionDiscountTypeEnum = {
  PRICE: {
    type: 1,
    name: '满减'
  },
  PERCENT: {
    type: 2,
    name: '折扣'
  }
}
/**
 * 配送方式枚举
 * @deprecated 项目内未引用
 */
export const DeliveryTypeEnum = {
  EXPRESS: {
    type: 1,
    name: '快递发货'
  },
  PICK_UP: {
    type: 2,
    name: '到店自提'
  }
}
/**
 * 交易订单 - 状态
 * @deprecated 项目内未引用
 */
export const TradeOrderStatusEnum = {
  UNPAID: {
    status: 0,
    name: '待支付'
  },
  UNDELIVERED: {
    status: 10,
    name: '待发货'
  },
  DELIVERED: {
    status: 20,
    name: '已发货'
  },
  COMPLETED: {
    status: 30,
    name: '已完成'
  },
  CANCELED: {
    status: 40,
    name: '已取消'
  }
}

// ========== ERP - 企业资源计划 ==========

/**
 * @deprecated 项目内未引用
 */
export const ErpBizType = {
  PURCHASE_ORDER: 10,
  PURCHASE_IN: 11,
  PURCHASE_RETURN: 12,
  SALE_ORDER: 20,
  SALE_OUT: 21,
  SALE_RETURN: 22
}

// ========== BPM 模块 ==========

export const BpmModelType = {
  BPMN: 10, // BPMN 设计器
  SIMPLE: 20 // 简易设计器
}

export const BpmModelFormType = {
  NORMAL: 10, // 流程表单
  CUSTOM: 20 // 业务表单
}

export const BpmProcessInstanceStatus = {
  NOT_START: -1, // 未开始
  RUNNING: 1, // 审批中
  APPROVE: 2, // 审批通过
  REJECT: 3, // 审批不通过
  CANCEL: 4 // 已取消
}

export const BpmAutoApproveType = {
  NONE: 0, // 不自动通过
  APPROVE_ALL: 1, // 仅审批一次，后续重复的审批节点均自动通过
  APPROVE_SEQUENT: 2 // 仅针对连续审批的节点自动通过
}

/**
 * 审批节点类型映射
 */
export const BpmNodeTypeMap: Record<number, string> = {
  10: '发起人节点',
  1: '结束节点',
  11: '审批节点'
}

/**
 * 审批任务状态映射
 */
export const BpmTaskStatusMap: Record<number, string> = {
  0: '草稿',
  1: '审批中',
  2: '审批通过',
  3: '审批驳回',
  4: '已取消'
}

/**
 * 审批节点状态颜色映射
 */
export const BpmNodeStatusColors: Record<number, string> = {
  0: '#909399', // 未开始/草稿
  1: '#409EFF', // 进行中/审批中
  2: '#67C23A', // 已完成/审批通过
  3: '#F56C6C', // 已驳回
  4: '#E6A23C', // 已取消
  5: '#909399' // 已终止
}

/**
 * 申请状态配置
 */
export const BpmApplyStatusConfig: Record<number, { label: string; color: string }> = {
  0: { label: '待审批', color: '#409EFF' },
  1: { label: '已通过', color: '#67C23A' },
  2: { label: '已驳回', color: '#F56C6C' },
  3: { label: '已撤销', color: '#909399' }
}

// ========== 通用操作标题 ==========
/**
 * 表单操作类型标题映射
 * 用于表单弹窗标题显示
 */
export const ActionTitleMap = {
  create: '新增',
  add: '新增',
  edit: '编辑',
  update: '编辑',
  detail: '详情',
  preview: '预览',
  view: '查看'
}
