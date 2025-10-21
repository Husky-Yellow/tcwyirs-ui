import request from '@/config/axios'

export interface SocialUserVO {
  id: number
  type: number
  openid: string
  token: string
  rawTokenInfo: string
  nickname: string
  avatar: string
  rawUserInfo: string
  code: string
  state: string
}

export interface SocialUserPageReqVO extends PageParam {
  type?: number
  openid?: string
  nickname?: string
  createTime?: string[]
}

// 查询社交用户列表
export const getSocialUserPage = async (
  params: SocialUserPageReqVO
): Promise<PageResult<SocialUserVO[]>> => {
  return await request.get<PageResult<SocialUserVO[]>>({ url: `/system/social-user/page`, params })
}

// 查询社交用户详情
export const getSocialUser = async (id: number) => {
  return await request.get<SocialUserVO>({ url: `/system/social-user/get?id=` + id })
}
