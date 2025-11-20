import { shallowReactive, onMounted } from 'vue'
import type { MarketplaceProduct, CategoryItem } from '@/api/marketplace'
import { getMarketplaceProducts, getMarketplaceCategories } from '@/api/marketplace'

// 对外仍导出类型，保持现有引用不变
export type { MarketplaceProduct } from '@/api/marketplace'
export type { CategoryItem as Category } from '@/api/marketplace'

/**
 * Marketplace 数据管理 Composable（数据从 mock 接口获取）
 */
export const useMarketplaceData = () => {
  const categories = shallowReactive<CategoryItem[]>([])
  const products = shallowReactive<MarketplaceProduct[]>([])

  const load = async () => {
    try {
      const [cats, prods] = await Promise.all([
        getMarketplaceCategories(),
        getMarketplaceProducts()
      ])
      categories.splice(0, categories.length, ...cats)
      products.splice(0, products.length, ...prods)
    } catch (e) {
      console.warn('[useMarketplaceData] 加载 mock 数据失败:', e)
    }
  }

  onMounted(load)

  return {
    categories,
    products,
    reload: load
  }
}
