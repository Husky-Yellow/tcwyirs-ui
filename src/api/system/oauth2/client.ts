import request from '@/config/axios'

export interface OAuth2ClientVO {
  id: number
  clientId: string
  secret: string
  name: string
  logo: string
  description: string
  status: number
  accessTokenValiditySeconds: number
  refreshTokenValiditySeconds: number
  redirectUris: string[]
  autoApprove: boolean
  authorizedGrantTypes: string[]
  scopes: string[]
  authorities: string[]
  resourceIds: string[]
  additionalInformation: string
  isAdditionalInformationJson: boolean
  createTime: Date
}

export interface OAuth2ClientPageReqVO extends PageParam {
  name?: string
  status?: number
}

// 查询 OAuth2 客户端的列表
export const getOAuth2ClientPage = (params: OAuth2ClientPageReqVO) => {
  return request.get<PageResult<OAuth2ClientVO[]>>({ url: '/system/oauth2-client/page', params })
}

// 查询 OAuth2 客户端的详情
export const getOAuth2Client = (id: number) => {
  return request.get<OAuth2ClientVO>({ url: '/system/oauth2-client/get?id=' + id })
}

// 新增 OAuth2 客户端
export const createOAuth2Client = (data: OAuth2ClientVO) => {
  return request.post<void>({ url: '/system/oauth2-client/create', data })
}

// 修改 OAuth2 客户端
export const updateOAuth2Client = (data: OAuth2ClientVO) => {
  return request.put<void>({ url: '/system/oauth2-client/update', data })
}

// 删除 OAuth2
export const deleteOAuth2Client = (id: number) => {
  return request.delete<void>({ url: '/system/oauth2-client/delete?id=' + id })
}
