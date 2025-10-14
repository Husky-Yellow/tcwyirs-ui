import request from '@/config/axios'

export interface BasicInfo {
  resourceName: string
  resourceTag: string
  owner: string
  creator: string
  application: string
  contact: string
  descriptionText: string
  publishTime: string
  contactPhone: string
}

export interface DataInfo {
  applications: string
  visits: string
  monthlyHits: string
}

export interface Reviews {
  positive: string[]
  negative: string[]
  score: number
}

export interface ReplyItem {
  id: string
  userName: string
  time: string
  content: string
}

export interface CommentItem {
  id: string
  userName: string
  time: string
  content: string
  score: number
  showReplies: boolean
  replies: ReplyItem[]
}

export interface ResourceDetail {
  id: string
  title: string
  description: string
  basicInfo: BasicInfo
  dataInfo: DataInfo
  reviews: Reviews
  comments: CommentItem[]
}

export const getMarketplaceDetail = (id: string) => {
  // 实际请求路径：base_url + VITE_API_URL + '/marketplace/detail'
  // 例如：http://localhost:48080/admin-api/marketplace/detail?id=xxx
  return request.get<ResourceDetail>({ url: '/marketplace/detail', params: { id } })
}

// 列表页相关接口
export interface MarketplaceProduct {
  id: string
  title: string
  description: string
  category: string
}

export interface CategoryItem {
  label: string
  value: string
}

export const getMarketplaceProducts = () => {
  return request.get<MarketplaceProduct[]>({ url: '/marketplace/products' })
}

export const getMarketplaceCategories = () => {
  return request.get<CategoryItem[]>({ url: '/marketplace/categories' })
}
