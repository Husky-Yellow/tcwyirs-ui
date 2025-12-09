import request from '@/config/axios'
import type { ResourceType, ResourceStatus } from '../types'

/** 组件扩展信息 */
export interface ComponentExtVO {
  /** 对接方式: 1-GET 2-POST */
  requestMethod?: number
  /** 请求地址 */
  requestUrl?: string
  /** 示例代码 */
  sampleCode?: string
  /** 输入参数JSON */
  inputParamsJson?: Array<{
    name: string
    type: string
    description: string
    required: boolean
    position: string
    standard: string
  }>
  /** 输出参数JSON */
  outputParamsJson?: Array<{
    name: string
    type: string
    description: string
    required: boolean
    position: string
    standard: string
  }>
}

/** 资源信息 VO */
export interface ResourceInfoVO {
  id?: number
  /** 资源名称 */
  name: string
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  type: ResourceType
  /** 资源描述 */
  description?: string
  /** 资源图标/封面 */
  icon?: string
  /** 资源状态：0-草稿 1-待审批 2-已发布 3-已下架 4-已驳回 */
  status?: ResourceStatus
  /** 标签 */
  tags?: number[]
  /** 扩展信息（JSON字符串） */
  extInfo?: string
  /** 组件扩展信息（仅用于组件资源类型） */
  componentExt?: ComponentExtVO
  /** 创建人 */
  creator?: string
  /** 创建时间 */
  createTime?: Date
  /** 更新时间 */
  updateTime?: Date
}

/** 资源分页查询参数 */
export interface ResourceInfoPageReqVO extends PageParam {
  /** 资源名称 */
  name?: string
  /** 资源类型 */
  type?: ResourceType
  /** 资源状态 */
  status?: number
  /** 标签 */
  tagId?: number
  /** 创建时间 */
  createTime?: string[]
}

/** 资源分页查询参数 */
export interface PublishApplicationPageParamVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: ResourceType
  /** 上架人 id */
  publishUserId: string
  /** 审批状态 */
  status?: number
  /** 申请时间 */
  applyTime?: string[]
}

/** 资源分页查询参数 */
export interface PageResultResourceApplyTodoRespVO extends PageParam {
   /**
     * 资源名称
     */
   resourceName?: string;
   /**
    * 资源类型
    */
   resourceType?: number;
}


/**
 * 管理后台 - 资源上架申请 Response VO
 *
 * ResourcePublishApplyRespVO
 */
export interface ResourcePublishApplyRespVO {
  /**
   * 申请时间
   */
  applyTime?: string;
  /**
   * 审批流详情
   */
  approvalDetail?: BpmApprovalDetailRespDTO;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 申请ID
   */
  id?: number;
  /**
   * 审批流程实例ID
   */
  processInstanceId?: string;
  /**
   * 上架人ID
   */
  publishUserId?: number;
  /**
   * 上架人姓名
   */
  publishUserName?: string;
  /**
   * 驳回原因
   */
  rejectReason?: string;
  /**
   * 资源ID
   */
  resourceId?: number;
  /**
   * 资源名称
   */
  resourceName?: string;
  /**
   * 资源标签
   */
  resourceTag?: string;
  /**
   * 资源类型
   */
  resourceType?: number;
  /**
   * 审批状态
   */
  status?: number;
  [property: string]: any;
}

/**
* 审批流详情
*
* BpmApprovalDetailRespDTO
*/
export interface BpmApprovalDetailRespDTO {
  /**
   * 活动节点列表
   */
  activityNodes?: ActivityNode[];
  /**
   * 所属流程定义信息
   */
  processDefinition?: ProcessDefinition;
  /**
   * 所属流程实例信息
   */
  processInstance?: ProcessInstance;
  /**
   * 流程实例的状态
   */
  status?: number;
  [property: string]: any;
}

/**
* com.tcwy.tcwyirs.module.bpm.api.task.dto.BpmApprovalDetailRespDTO.ActivityNode
*
* ActivityNode
*/
export interface ActivityNode {
  /**
   * 只包含未生成 ApprovalTaskInfo 的用户列表
   * 候选人用户列表
   */
  candidateUsers?: CandidateUser[];
  /**
   * 节点的结束时间
   */
  endTime?: string;
  /**
   * 节点编号
   */
  id?: string;
  /**
   * 节点名称
   */
  name?: string;
  /**
   * 参见 BpmSimpleModelNodeType 枚举
   * 节点类型
   */
  nodeType?: number;
  /**
   * 节点的开始时间
   */
  startTime?: string;
  /**
   * 参见 BpmTaskStatusEnum 枚举
   * 节点状态
   */
  status?: number;
  /**
   * 审批节点的任务信息
   */
  tasks?: ActivityNodeTask[];
  [property: string]: any;
}

/**
* com.tcwy.tcwyirs.module.bpm.controller.admin.base.user.UserSimpleBaseVO
*
* CandidateUser
*/
export interface CandidateUser {
  /**
   * 用户编号
   */
  id?: number;
  /**
   * 用户昵称
   */
  nickname?: string;
  [property: string]: any;
}

/**
*
* com.tcwy.tcwyirs.module.bpm.controller.admin.task.vo.instance.BpmApprovalDetailRespVO.ActivityNodeTask
*
* ActivityNodeTask
*/
export interface ActivityNodeTask {
  /**
   * 任务分配人编号
   */
  assigneeUserId?: number;
  /**
   * 任务分配人昵称
   */
  assigneeUserName?: string;
  /**
   * 任务编号
   */
  id?: string;
  /**
   * 任务所属人编号（转交场景：原审批人）
   */
  ownerUserId?: number;
  /**
   * 任务所属人昵称（转交场景：原审批人）
   */
  ownerUserName?: string;
  /**
   * 审批意见
   */
  reason?: string;
  /**
   * 参见 BpmTaskStatusEnum 枚举
   * 任务状态
   */
  status?: number;
  /**
   * 转交历史列表（记录完整的转交链路）
   */
  transferRecords?: TransferRecord[];
  [property: string]: any;
}

/**
* com.tcwy.tcwyirs.module.bpm.api.task.dto.BpmApprovalDetailRespDTO.TransferRecord
*
* TransferRecord
*/
export interface TransferRecord {
  /**
   * 转交人编号
   */
  fromUserId?: null;
  /**
   * 转交人昵称
   */
  fromUserName?: null;
  /**
   * 转交理由
   */
  reason?: null;
  /**
   * 接收人编号
   */
  toUserId?: null;
  /**
   * 接收人昵称
   */
  toUserName?: null;
  /**
   * 转交时间
   */
  transferTime?: null;
  [property: string]: any;
}

/**
* 所属流程定义信息
*
* ProcessDefinition
*/
export interface ProcessDefinition {
  /**
   * 流程定义编号
   */
  id?: string;
  /**
   * 流程名称
   */
  name?: string;
  [property: string]: any;
}

/**
* 所属流程实例信息
*
* ProcessInstance
*/
export interface ProcessInstance {
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 流程实例编号
   */
  id?: string;
  /**
   * 流程实例名称
   */
  name?: string;
  /**
   * 发起时间
   */
  startTime?: string;
  /**
   * 发起人编号
   */
  startUserId?: number;
  /**
   * 发起人昵称
   */
  startUserName?: string;
  [property: string]: any;
}


/**
 * 获取我上架的资源统计
 */
export interface ResourceStatsRespVO {
  /**
    * 应用资源数
    */
  appResourceCount?: number;
  /**
   * 组件资源数
   */
  componentResourceCount?: number;
  /**
   * 数据资源数
   */
  dataResourceCount?: number;
 [property: string]: any
}


/**
 * 管理后台 - 待审批资源申请 Response VO
 *
 * ResourceApplyTodoRespVO
 */
export interface ResourceApplyTodoRespVO {
  /**
   * 申请ID
   */
  applyId?: number;
  /**
   * 申请说明
   */
  applyReason?: string;
  /**
   * 申请时间
   */
  applyTime?: string;
  /**
   * 申请人ID
   */
  applyUserId?: number;
  /**
   * 申请人姓名
   */
  applyUserName?: string;
  /**
   * 使用结束时间
   */
  endTime?: string;
  /**
   * 流程实例编号
   */
  processInstanceId?: string;
  /**
   * 项目ID
   */
  projectId?: number;
  /**
   * 项目名称
   */
  projectName?: string;
  /**
   * 资源描述
   */
  resourceDescription?: string;
  /**
   * 资源ID
   */
  resourceId?: number;
  /**
   * 资源名称
   */
  resourceName?: string;
  /**
   * 资源类型
   */
  resourceType?: number;
  /**
   * 使用开始时间
   */
  startTime?: string;
  /**
   * 审批状态
   */
  status?: number;
  /**
   * 任务创建时间
   */
  taskCreateTime?: string;
  /**
   * 任务编号
   */
  taskId?: string;
  /**
   * 任务名字
   */
  taskName?: string;
  [property: string]: any;
}

// 创建资源
export const createResourceInfo = (data: ResourceInfoVO) => request.post<number>({ url: '/resource/info/create', data })

// 更新资源
export const updateResourceInfo = (data: ResourceInfoVO) => request.put<void>({ url: '/resource/info/update', data })

// 删除资源
export const deleteResourceInfo = (id: number) => request.delete<void>({ url: '/resource/info/delete?id=' + id })

// 获取资源详情
export const getResourceInfo = (id: number) => request.get<ResourceInfoVO>({ url: '/resource/info/get?id=' + id })

// 获取资源分页列表
export const getResourceInfoPage = (params: ResourceInfoPageReqVO) => request.get<PageResult<ResourceInfoVO[]>>({ url: '/resource/info/page', params })

// 发起上架申请
export const publishResourceInfo = (id: number) => request.post<void>({ url: '/resource/info/publish', data: { id } })

// 下架资源
export const unpublishResourceInfo = (id: number) => request.post<void>({ url: '/resource/info/unpublish', data: { id } })

// 获取我上架的资源统计
export const fetchResourceStats = () => request.get<ResourceStatsRespVO>({ url: '/resource/info/statistics' })

//  获得资源上架申请分页
export const getPublishApplicationPage  = (params: PublishApplicationPageParamVO) => request.get<PageResult<ResourcePublishApplyRespVO[]>>({ url: '/resource/publish-apply/page', params })

// 待我审批的资源
export const getApplyTodoPage  = (params: PageResultResourceApplyTodoRespVO) => request.get<PageResult<ResourceApplyTodoRespVO[]>>({ url: '/resource/apply/todo-page', params })