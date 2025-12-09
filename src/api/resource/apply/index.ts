import request from '@/config/axios'
import type { ApplyStatus } from '../types'

/** 资源申请 VO */
export interface ResourceApplyVO {
  id?: number
  /** 资源ID */
  resourceId: number
  /** 资源名称 */
  resourceName?: string
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  resourceType?: number
  /** 申请原因 */
  reason: string
  /** 项目ID */
  projectId?: number
  /** 项目名称 */
  projectName?: string
  /** 使用期限（天） */
  duration?: number
  /** 申请状态：0-待审批 1-已通过 2-已驳回 3-已撤销 */
  status?: ApplyStatus
  /** 审批人 */
  approver?: string
  /** 审批意见 */
  approvalComment?: string
  /** 审批时间 */
  approvalTime?: Date
  /** 申请人 */
  applicant?: string
  /** 申请时间 */
  createTime?: Date
}

/** 资源申请分页查询参数 */
export interface ResourceApplyPageReqVO extends PageParam {
  /** 资源名称 */
  resourceName?: string
  /** 资源类型 */
  resourceType?: number
  /** 申请人 */
  applicant?: string
  /** 项目名称 */
  projectName?: string
  /** 申请状态 */
  status?: ApplyStatus
  /** 申请时间 */
  createTime?: string[]
}

// 申请资源
export const createResourceApply = (data: ResourceApplyVO) => {
  return request.post<number>({ url: '/resource/apply/create', data })
}

// 撤销申请
export const cancelResourceApply = (id: number) => {
  return request.post<void>({ url: '/resource/apply/cancel', data: { id } })
}

// 重新申请
export const reapplyResource = (data: ResourceApplyVO) => {
  return request.post<number>({ url: '/resource/apply/reapply', data })
}

// 获取我申请的列表
export const getMyResourceApplyPage = (params: ResourceApplyPageReqVO) => {
  return request.get<PageResult<ResourceApplyVO[]>>({ url: '/resource/apply/my-page', params })
}

// 获取申请详情
export const getResourceApply = (id: number) => {
  return request.get<ResourceApplyVO>({ url: '/resource/apply/get?id=' + id })
}

/** 资源类型统计 VO */
export interface ResourceStatisticsByTypeVO {
  /** 资源类型：1-数据资源 2-应用资源 3-组件资源 */
  resourceType: number
  /** 该类型资源数量 */
  count: number
}

// 获取按类型统计的资源信息
export const getResourceStatisticsByType = (params) => {
  return request.get<ResourceStatisticsByTypeVO[]>({ url: '/resource/info/statistics-by-type', params })
}

/** 参数信息 */
export interface ParamInfo {
  /** 参数名称 */
  paramName?: string
  /** 参数类型 */
  paramType?: string
  /** 参数描述 */
  paramDesc?: string
  /** 参数位置 */
  paramPosition?: string
  /** 关联表信息 */
  relTableInfo?: string
  /** 是否必填 */
  required?: boolean
}

/** 介绍场景 */
export interface IntroScene {
  /** 场景ID */
  id?: number
  /** 介绍图URL */
  imgUrl?: string
  /** 介绍文本 */
  introText?: string
  /** 排序号 */
  sort?: number
}

// /** 数据资源扩展信息 */
// export interface ResourceDataExtVO {
//   /** 数据格式 */
//   dataFormat?: string
//   /** 数据量 */
//   dataSize?: string
//   /** 更新频率 */
//   updateFrequency?: string
//   /** 数据来源 */
//   dataSource?: string
//   [property: string]: any
// }

/** 应用资源扩展信息 */
// export interface ResourceAppExtVO {
//   /** 是否接入物联网设备 */
//   connDeviceFlag?: boolean
//   /** 设备地址 */
//   deviceAddr?: string
//   /** 设备数量 */
//   deviceNum?: number
//   /** 设备类型 */
//   deviceType?: number
//   /** 应用文档文件IDs */
//   docFileIds?: string
//   /** 介绍场景列表 */
//   introScenes?: IntroScene[]
//   [property: string]: any
// }

/** 组件资源扩展信息 */
// export interface ResourceComponentExtVO {
//   /** 资源地址 */
//   componentUrl?: string
//   /** 对接方式: 1-GET 2-POST */
//   dockingType?: number
//   /** 输入参数 */
//   inputParamsJson?: ParamInfo[]
//   /** 输出参数 */
//   outputParamsJson?: ParamInfo[]
//   /** 请求地址 */
//   requestUrl?: string
//   /** 示例代码 */
//   sampleCode?: string
//   [property: string]: any
// }

// /** 资源信息保存请求 VO */
// export interface ResourceInfoSaveReqVO {
//   /** 资源ID */
//   id?: number
//   /** 资源名称 */
//   name: string
//   /** 资源类型(1-数据资源 2-应用资源 3-组件资源) */
//   type: number
//   /** 资源描述 */
//   description?: string
//   /** 资源介绍 */
//   introduction?: string
//   /** 内容封面URL */
//   coverUrl?: string
//   /** 归属方 */
//   belong?: string
//   /** 联系人 */
//   linkPerson?: string
//   /** 联系方式 */
//   linkPhone?: string
//   /** 资源标签ID */
//   resourceTagId?: number
//   /** 是否直接上架 */
//   publishDirectly?: boolean
//   /** 数据资源扩展信息 */
//   dataExt?: ResourceDataExtVO
//   /** 应用资源扩展信息 */
//   appExt?: ResourceAppExtVO
//   /** 组件资源扩展信息 */
//   componentExt?: ResourceComponentExtVO
//   [property: string]: any
// }

// // 创建资源信息
// export const createResourceInfo = (data: ResourceInfoSaveReqVO) => {
//   return request.post<number>({ url: '/resource/info/create', data })
// }
