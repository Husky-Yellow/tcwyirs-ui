import request from '@/config/axios'

// 社交绑定，使用 code 授权码
export const socialBind = (
  type: number | string,
  code: string | string[] | null | undefined,
  state: string | string[] | null | undefined
) => {
  return request.post<void>({
    url: '/system/social-user/bind',
    data: {
      type,
      code,
      state
    }
  })
}

// 取消社交绑定
export const socialUnbind = (type: number | string, openid: string) => {
  return request.delete<boolean>({
    url: '/system/social-user/unbind',
    data: {
      type,
      openid
    }
  })
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number | string, redirectUri: string) => {
  return request.get<string>({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
