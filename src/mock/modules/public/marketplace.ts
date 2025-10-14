import type { MockConfig, ApiResponse } from '../../types'

interface BasicInfo {
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

interface DataInfo {
  applications: string
  visits: string
  monthlyHits: string
}

interface Reviews {
  positive: string[]
  negative: string[]
  score: number
}

interface ReplyItem {
  id: string
  userName: string
  time: string
  content: string
}

interface CommentItem {
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

const DEFAULT_DETAIL: Omit<ResourceDetail, 'id'> = {
  title: '停车缴费记录',
  description:
    '实时数据 Pulsar 消息推送，基于 Apache Pulsar 分布式消息系统，支持高吞吐、低延迟的实时数据推送；支持多租户与高可用，通过 Topic 分层和分区保证消息有序；Exactly-Once 语义保证一致性；多协议接入，便于对接各类数据源；运维友好且高可靠，适应容灾场景。',
  basicInfo: {
    resourceName: '近一年车辆进出停车场记录',
    resourceTag: '标签一',
    owner: 'hsakndaks',
    creator: '李存',
    application: 'hsakndaks',
    contact: '小昱',
    descriptionText: '这是一段内容注释，这是一段内容注释，这是一段内容注释。',
    publishTime: '2018-10-31 23:12:00',
    contactPhone: '2178961893831'
  },
  dataInfo: {
    applications: '21234',
    visits: '123112',
    monthlyHits: '21'
  },
  reviews: {
    positive: ['资源内容丰富', '操作使用便捷', '符合日常需求', '资源数据精准', '这是一个好资源', '这是一个很好的好评'],
    negative: ['资源内容不符合描述', '体验不佳', '内容出错', '与业务场景不太匹配', '数据内容出现错误', '申请时长太久'],
    score: 79
  },
  comments: [
    {
      id: '1',
      userName: '初灼',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了！',
      score: 92,
      showReplies: false,
      replies: [
        { id: '1-1', userName: '小昱', time: '2025-10-01 14:25', content: '我也觉得好用，太赞了' }
      ]
    },
    {
      id: '2',
      userName: '初灼',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了，使用感极佳。',
      score: 99,
      showReplies: false,
      replies: [
        { id: '2-1', userName: '张三', time: '2025-10-01 15:30', content: '确实不错，推荐使用' },
        { id: '2-2', userName: '李四', time: '2025-10-01 16:00', content: '同意，功能很强大' }
      ]
    },
    {
      id: '3',
      userName: '小昱A',
      time: '2025-10-01 14:20',
      content: '资源内容丰富，操作使用便捷，符合日常需求。',
      score: 88,
      showReplies: false,
      replies: []
    },
    {
      id: '4',
      userName: '民本',
      time: '2025-10-01 14:20',
      content: '这是一个只讲技术评分的样子',
      score: 75,
      showReplies: false,
      replies: []
    },
    {
      id: '5',
      userName: '酒酒',
      time: '2025-10-01 14:20',
      content: '这个资源使用起来一般，太一般了。',
      score: 46,
      showReplies: false,
      replies: [
        { id: '5-1', userName: '王五', time: '2025-10-01 17:00', content: '可能是使用方式不对吧' },
        { id: '5-2', userName: '赵六', time: '2025-10-01 17:30', content: '我觉得还可以' }
      ]
    }
  ]
}

// 列表数据（用于市场页）
interface MarketplaceProduct {
  id: string
  title: string
  description: string
  category: string
}

interface CategoryItem {
  label: string
  value: string
}

const PRODUCTS: MarketplaceProduct[] = [
  { id: '1', title: '智能数据库管理系统', description: '高效的数据库管理和优化工具，支持多种数据库类型，提供可视化界面与性能监控', category: '数据管理' },
  { id: '2', title: '云计算弹性伸缩平台', description: '弹性可扩展的云计算解决方案，提供 IaaS 与 PaaS，支持自动伸缩', category: '云计算' },
  { id: '3', title: 'AI 智能算法集', description: '涵盖机器学习、深度学习等多个领域的前沿算法，提供 API 服务', category: '人工智能' },
  { id: '4', title: '物联网设备接入平台', description: '支持海量设备接入，提供设备管理、数据采集与远程控制', category: '物联网' },
  { id: '5', title: '区块链开发框架', description: '简化智能合约开发与部署流程，支持多种区块链网络', category: '区块链' },
  { id: '6', title: '大数据实时分析平台', description: '支持实时流处理与批量分析，提供可视化报表', category: '大数据' },
  { id: '7', title: '网络安全防护系统', description: '威胁检测、防护与应急响应，保护企业数字资产', category: '网络安全' },
  { id: '8', title: '跨平台移动应用开发套件', description: '一次开发多端部署，支持 iOS/Android 等平台', category: '移动开发' }
]

const CATEGORIES: CategoryItem[] = [
  { label: '全部', value: 'all' },
  { label: '数据管理', value: 'database' },
  { label: '云计算', value: 'cloud' },
  { label: '人工智能', value: 'ai' },
  { label: '物联网', value: 'iot' },
  { label: '区块链', value: 'blockchain' },
  { label: '大数据', value: 'bigdata' },
  { label: '网络安全', value: 'security' },
  { label: '移动开发', value: 'mobile' }
]

const mockConfigs: MockConfig[] = [
  // 获取资源详情（根据 id）
  {
    url: '/admin-api/marketplace/detail',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceDetail> => {
      const { id = '1' } = query || {}
      return {
        code: 0,
        data: { id: String(id), ...DEFAULT_DETAIL },
        msg: ''
      }
    }
  },
  // 获取 Marketplace 产品列表
  {
    url: '/admin-api/marketplace/products',
    type: 'get',
    response: (): ApiResponse<MarketplaceProduct[]> => ({
      code: 0,
      data: PRODUCTS,
      msg: ''
    })
  },
  // 获取 Marketplace 分类
  {
    url: '/admin-api/marketplace/categories',
    type: 'get',
    response: (): ApiResponse<CategoryItem[]> => ({
      code: 0,
      data: CATEGORIES,
      msg: ''
    })
  }
]

export default mockConfigs
