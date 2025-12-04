import { shallowReactive, onMounted } from 'vue'
import { getResourceInfoPage } from '@/api/resource/info'
import { getResourceTagList } from '@/api/resource/tag'

/** 市场资源产品 */
export interface MarketplaceProduct {
  id: string
  title: string
  description: string
  category: string
}

/** 分类项 */
export interface Category {
  label: string
  value: string
}

/**
 * Marketplace 数据管理 Composable（数据从资源模块接口获取）
 */
export const useMarketplaceData = () => {
  const categories = shallowReactive<Category[]>([])
  const products = shallowReactive<MarketplaceProduct[]>([])

  const load = async () => {
    try {
      const [tags, result] = await Promise.all([
        getResourceTagList(),
        getResourceInfoPage({
          pageNo: 1,
          pageSize: 100,
          status: 2 // 只获取已发布的资源
        })
      ])

      // 转换标签为分类
      const cats = tags.map(tag => ({
        label: tag.name,
        value: String(tag.id)
      }))

      // 转换资源为产品
      const prods = (result.list || []).map(item => ({
        id: String(item.id),
        title: item.name,
        description: item.description || '',
        category: item.tags?.[0]?.toString() || ''
      }))

      categories.splice(0, categories.length, ...cats)
      products.splice(0, products.length, ...prods)
    } catch (e) {
      console.warn('[useMarketplaceData] 加载数据失败:', e)
    }
  }

  onMounted(load)

  return {
    categories,
    products,
    reload: load
  }
}
