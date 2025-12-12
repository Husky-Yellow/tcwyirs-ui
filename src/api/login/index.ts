import request from '@/config/axios'
import type {
  RegisterVO,
  UserLoginVO,
  PermissionInfoVO,
  TokenType,
  SmsCodeVO,
  SmsLoginVO,
  CaptchaRequestVO,
  CaptchaCheckRequestVO,
  CaptchaResponseVO,
  SmsResetPasswordVO,
  TenantWebsiteVO
} from './types'

// 登录
export const login = (data: UserLoginVO): Promise<TokenType> => {
  return request.post<TokenType>({ url: '/system/auth/login', data })
}

// 注册
export const register = (data: RegisterVO): Promise<unknown> => {
  return request.post<unknown>({ url: '/system/auth/register', data })
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string): Promise<number> => {
  return request.get<number>({ url: '/system/tenant/get-id-by-name?name=' + name })
}

// 使用租户域名，获得租户信息
export const getTenantByWebsite = (website: string): Promise<TenantWebsiteVO | undefined> => {
  return request.get<TenantWebsiteVO | undefined>({
    url: '/system/tenant/get-by-website?website=' + website
  })
}

// 登出
export const loginOut = (): Promise<void> => {
  return request.post<void>({ url: '/system/auth/logout' })
}

// 获取用户权限信息
export const getInfo = (): Promise<PermissionInfoVO> => {
  return request.get({ url: '/system/auth/get-permission-info' })
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO): Promise<void> => {
  return request.post<void>({ url: '/system/auth/send-sms-code', data })
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO): Promise<TokenType> => {
  return request.post<TokenType>({ url: '/system/auth/sms-login', data })
}

// 社交快捷登录，使用 code 授权码
export function socialLogin(type: string, code: string, state: string): Promise<TokenType> {
  return request.post<TokenType>({
    url: '/system/auth/social-login',
    data: {
      type,
      code,
      state
    }
  })
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string): Promise<string> => {
  return request.get<string>({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}

export const getCode = (data: CaptchaRequestVO): Promise<CaptchaResponseVO> => {
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheck = (data: CaptchaCheckRequestVO): Promise<CaptchaResponseVO> => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}

// 通过短信重置密码
export const smsResetPassword = (data: SmsResetPasswordVO): Promise<void> => {
  return request.post<void>({ url: '/system/auth/reset-password', data })
}

// 获取用户可切换的角色列表
export const listRoles = (): Promise<string[]> => {
  return request.get<string[]>({ url: '/system/auth/list-roles' })
}

// 切换角色
export const switchRole = (roleId: number): Promise<void> => {
  return request.post<void>({ url: '/system/auth/switch-role', data: { roleId } })
}

export type {
  UserLoginVO,
  RegisterVO,
  SmsCodeVO,
  SmsLoginVO,
  TokenType,
  PermissionInfoVO,
  CaptchaRequestVO,
  CaptchaCheckRequestVO,
  CaptchaResponseVO,
  SmsResetPasswordVO,
  TenantWebsiteVO
} from './types'
