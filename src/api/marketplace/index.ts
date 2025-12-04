/**
 * Marketplace API - 使用资源模块接口
 */
import { getResourceInfo, getResourceInfoPage } from '@/api/resource/info'
import { getResourceTagList } from '@/api/resource/tag'
import { getResourceEvaluateList } from '@/api/resource/evaluate'
import type { ResourceInfoVO } from '@/api/resource/info'
import type { ResourceTagVO } from '@/api/resource/tag'
import type { ResourceEvaluateVO } from '@/api/resource/evaluate'

// 兼容旧的类型定义（用于前端展示）
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

// 获取资源详情（组合多个接口数据）
export const getMarketplaceDetail = async (id: string): Promise<ResourceDetail> => {
  const resourceId = Number(id)

  // 并行获取资源信息和评论列表
  const [resource, comments] = await Promise.all([
    getResourceInfo(resourceId),
    getResourceEvaluateList(resourceId)
  ])

  // 转换为前端需要的格式
  return transformToResourceDetail(resource, comments)
}

// 数据转换函数
function transformToResourceDetail(
  resource: ResourceInfoVO,
  evaluates: ResourceEvaluateVO[]
): ResourceDetail {
  // 计算评分统计
  const ratings = evaluates.filter(e => e.rating).map(e => e.rating!)
  const avgScore = ratings.length > 0
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 20) // 转换为100分制
    : 0

  // 提取好评和差评标签（这里简化处理）
  const positive: string[] = []
  const negative: string[] = []

  return {
    id: String(resource.id),
    title: resource.name,
    description: resource.description || '',
    basicInfo: {
      resourceName: resource.name,
      resourceTag: resource.tags?.[0]?.toString() || '',
      owner: resource.creator || '',
      creator: resource.creator || '',
      application: '',
      contact: '',
      descriptionText: resource.description || '',
      publishTime: resource.createTime ? new Date(resource.createTime).toLocaleString() : '',
      contactPhone: ''
    },
    dataInfo: {
      applications: '0',
      visits: '0',
      monthlyHits: '0'
    },
    reviews: {
      positive,
      negative,
      score: avgScore
    },
    comments: evaluates.map((e, idx) => ({
      id: String(e.id || idx),
      userName: e.evaluator || '匿名',
      time: e.createTime ? new Date(e.createTime).toLocaleString() : '',
      content: e.comment || '',
      score: e.rating ? e.rating * 20 : 0, // 转换为100分制
      showReplies: false,
      replies: (e.replies || []).map((r, ridx) => ({
        id: String(r.id || `${idx}-${ridx}`),
        userName: r.replier || '匿名',
        time: r.createTime ? new Date(r.createTime).toLocaleString() : '',
        content: r.content
      }))
    }))
  }
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

// 获取资源列表
export const getMarketplaceProducts = async (): Promise<MarketplaceProduct[]> => {
  const result = await getResourceInfoPage({
    pageNo: 1,
    pageSize: 100,
    status: 2 // 只获取已发布的资源
  })

  return (result.list || []).map(item => ({
    id: String(item.id),
    title: item.name,
    description: item.description || '',
    category: item.tags?.[0]?.toString() || ''
  }))
}

// 获取分类列表（使用标签作为分类）
export const getMarketplaceCategories = async (): Promise<CategoryItem[]> => {
  const tags = await getResourceTagList()

  return tags.map(tag => ({
    label: tag.name,
    value: String(tag.id)
  }))
}
