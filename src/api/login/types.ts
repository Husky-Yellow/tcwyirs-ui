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
