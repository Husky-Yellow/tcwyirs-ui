/**
 * Mock 相关类型定义
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

/**
 * 分页响应结构
 */
export interface PageResponse<T> {
  list: T[]
  total: number
}

/**
 * Mock 配置项
 */
export interface MockConfig {
  url: string
  type?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  response: any | ((req: MockRequest) => any)
}

/**
 * Mock 请求参数
 */
export interface MockRequestOptions {
  body?: string
  type: string
  url: string
}

/**
 * Mock 请求对象
 */
export interface MockRequest {
  method: string
  body: Record<string, any>
  query: Record<string, string>
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  nickname: string
  avatar: string
  deptId: number | null
  deptName?: string | null
  username: string
  email: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  userId: number
  accessToken: string
  refreshToken: string
  expiresTime: number
}

/**
 * 菜单项
 */
export interface MenuItem {
  id: string | number
  parentId: string | number
  name: string
  path: string
  component: string | null
  componentName: string | null
  icon: string
  visible: boolean
  manageId: string | null
  keepAlive: boolean
  alwaysShow: boolean
  children: MenuItem[] | null
}

/**
 * 权限信息
 */
export interface PermissionInfo {
  user: UserInfo
  roles: string[]
  permissions: string[]
  menus: MenuItem[]
}

/**
 * 部门信息
 */
export interface DeptInfo {
  id: number
  parentId: number
  name: string
  children?: DeptInfo[]
}

/**
 * 字典数据
 */
export interface DictData {
  id: string
  sort: number
  label: string
  value: string
  dictType: string
  status: number
  colorType: string
  cssClass: string
  remark: string
  createTime: number
}
