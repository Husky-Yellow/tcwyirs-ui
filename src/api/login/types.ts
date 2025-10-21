export type UserLoginVO = {
  username: string
  password: string
  captchaVerification: string
  socialType?: string
  socialCode?: string
  socialState?: string
}

export type TokenType = {
  id: number // 编号
  accessToken: string // 访问令牌
  refreshToken: string // 刷新令牌
  userId: number // 用户编号
  userType: number //用户类型
  clientId: string //客户端编号
  expiresTime: number //过期时间
}

export type UserVO = {
  id: number
  username: string
  nickname: string
  deptId: number
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  loginDate: string
}

export type RegisterVO = {
  tenantName: string
  username: string
  password: string
  captchaVerification: string
}

export type SmsCodeVO = {
  mobile: string
  scene: number
}

export type SmsLoginVO = {
  mobile: string
  code: string
}

// 菜单信息
export type MenuVO = {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  componentName: string
  icon: string
  visible: boolean
  keepAlive: boolean
  alwaysShow: boolean
  children: MenuVO[] | null
}

// 权限信息
export type PermissionInfoVO = {
  user: {
    id: number
    nickname: string
    avatar: string
    deptId: number
    username: string
    email: string
  }
  roles: string[]
  permissions: string[]
  menus: MenuVO[]
}

export interface TenantWebsiteVO {
  id: number
  name: string
  [key: string]: unknown
}

export interface CaptchaRequestVO {
  captchaType: string
  [key: string]: unknown
}

export interface CaptchaCheckRequestVO {
  captchaType: string
  pointJson: string
  token: string
}

export interface CaptchaDataVO {
  originalImageBase64: string
  token: string
  secretKey?: string
  jigsawImageBase64?: string
  wordList?: string[]
}

export interface CaptchaBaseResponse<T = Record<string, unknown>> {
  repCode: string
  repMsg: string
  repData: T
}

export type CaptchaResponseVO = CaptchaBaseResponse<CaptchaDataVO>

export interface SmsResetPasswordVO {
  mobile: string
  code: string
  password: string
}
