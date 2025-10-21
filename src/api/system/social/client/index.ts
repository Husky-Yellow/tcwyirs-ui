import request from '@/config/axios'

export interface SocialClientVO {
  id: number
  name: string
  socialType: number
  userType: number
  clientId: string
  clientSecret: string
  agentId: string
  status: number
}

export interface SocialClientPageReqVO extends PageParam {
  name?: string
  socialType?: number
  userType?: number
  clientId?: string
  status?: number
}

// 查询社交客户端列表
export const getSocialClientPage = async (
  params: SocialClientPageReqVO
): Promise<PageResult<SocialClientVO[]>> => {
  return await request.get<PageResult<SocialClientVO[]>>({ url: `/system/social-client/page`, params })
}

// 查询社交客户端详情
export const getSocialClient = async (id: number) => {
  return await request.get<SocialClientVO>({ url: `/system/social-client/get?id=` + id })
}

// 新增社交客户端
export const createSocialClient = async (data: SocialClientVO) => {
  return await request.post<void>({ url: `/system/social-client/create`, data })
}

// 修改社交客户端
export const updateSocialClient = async (data: SocialClientVO) => {
  return await request.put<void>({ url: `/system/social-client/update`, data })
}

// 删除社交客户端
export const deleteSocialClient = async (id: number) => {
  return await request.delete<void>({ url: `/system/social-client/delete?id=` + id })
}
