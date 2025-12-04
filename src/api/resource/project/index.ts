import request from '@/config/axios'

/** 项目 VO */
export interface ProjectVO {
  id?: number
  /** 项目名称 */
  name: string
  /** 项目描述 */
  description?: string
  /** 项目负责人 */
  leaderId?: number
  /** 负责人名称 */
  leaderName?: string
  /** 开始时间 */
  startTime?: Date
  /** 结束时间 */
  endTime?: Date
  /** 项目状态 */
  status?: number
  /** 创建时间 */
  createTime?: Date
}

/** 项目成员 VO */
export interface ProjectMemberVO {
  id?: number
  /** 项目ID */
  projectId: number
  /** 用户ID */
  userId: number
  /** 用户名称 */
  userName?: string
  /** 角色 */
  role?: string
  /** 加入时间 */
  createTime?: Date
}

/** 项目分页查询参数 */
export interface ProjectPageReqVO extends PageParam {
  /** 项目名称 */
  name?: string
  /** 项目状态 */
  status?: number
  /** 创建时间 */
  createTime?: string[]
}

/** 项目延期参数 */
export interface ProjectExtendVO {
  /** 项目ID */
  id: number
  /** 延期天数 */
  days: number
  /** 延期原因 */
  reason?: string
}

/** 添加成员参数 */
export interface AddProjectMemberVO {
  /** 项目ID */
  projectId: number
  /** 用户ID */
  userId: number
  /** 角色 */
  role?: string
}

// 创建项目
export const createProject = (data: ProjectVO) => {
  return request.post<number>({ url: '/resource/project/create', data })
}

// 更新项目
export const updateProject = (data: ProjectVO) => {
  return request.put<void>({ url: '/resource/project/update', data })
}

// 删除项目
export const deleteProject = (id: number) => {
  return request.delete<void>({ url: '/resource/project/delete?id=' + id })
}

// 获取项目详情
export const getProject = (id: number) => {
  return request.get<ProjectVO>({ url: '/resource/project/get?id=' + id })
}

// 获取项目列表
export const getProjectPage = (params: ProjectPageReqVO) => {
  return request.get<PageResult<ProjectVO[]>>({ url: '/resource/project/page', params })
}

// 项目延期
export const extendProject = (data: ProjectExtendVO) => {
  return request.post<void>({ url: '/resource/project/extend', data })
}

// 添加项目成员
export const addProjectMember = (data: AddProjectMemberVO) => {
  return request.post<void>({ url: '/resource/project/member/add', data })
}

// 移除项目成员
export const removeProjectMember = (id: number) => {
  return request.delete<void>({ url: '/resource/project/member/remove?id=' + id })
}

// 获取项目成员列表
export const getProjectMemberList = (projectId: number) => {
  return request.get<ProjectMemberVO[]>({ url: '/resource/project/member/list?projectId=' + projectId })
}
