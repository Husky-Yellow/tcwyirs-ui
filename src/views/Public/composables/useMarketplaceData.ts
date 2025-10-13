import { shallowReactive } from 'vue'

// 产品接口定义
export interface MarketplaceProduct {
  id: string
  title: string
  description: string
  category: string
}

// 分类接口定义
export interface Category {
  label: string
  value: string
}

// 静态数据常量
const CATEGORIES: Category[] = [
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

const PRODUCTS: MarketplaceProduct[] = [
  { id: '1', title: '智能数据库管理系统', description: '高效的数据库管理和优化工具，支持多种数据库类型，提供可视化管理界面和性能监控功能', category: '数据管理' },
  { id: '2', title: '云计算弹性伸缩平台', description: '弹性可扩展的云计算解决方案，提供全面的基础设施即服务和平台即服务，支持自动伸缩', category: '云计算' },
  { id: '3', title: 'AI智能算法库', description: '丰富的AI算法集合，涵盖机器学习、深度学习等多个领域的前沿算法，提供API调用服务', category: '人工智能' },
  { id: '4', title: '物联网设备接入平台', description: '支持海量设备接入的物联网平台，提供设备管理、数据采集、远程控制等核心功能', category: '物联网' },
  { id: '5', title: '区块链开发框架', description: '开箱即用的区块链开发工具，简化智能合约开发和部署流程，支持多种区块链网络', category: '区块链' },
  { id: '6', title: '大数据实时分析平台', description: '强大的大数据处理和分析平台，支持实时数据流处理和批量数据分析，提供可视化报表', category: '大数据' },
  { id: '7', title: '网络安全防护系统', description: '全方位的网络安全解决方案，提供威胁检测、防护和应急响应能力，保护企业数字资产', category: '网络安全' },
  { id: '8', title: '跨平台移动应用开发套件', description: '跨平台移动应用开发解决方案，支持iOS、Android等多个平台，一次开发多端部署', category: '移动开发' }
]

/**
 * Marketplace 数据管理 Composable
 * 使用 shallowReactive 提升性能，静态数据不需要深度响应
 */
export const useMarketplaceData = () => {
  return {
    categories: shallowReactive(CATEGORIES),
    products: shallowReactive(PRODUCTS)
  }
}

