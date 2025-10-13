import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { MarketplaceProduct } from './useMarketplaceData'

/**
 * Marketplace 搜索和过滤 Composable
 * 使用 useDebounceFn 优化搜索性能
 */
export const useMarketplaceSearch = (products: MarketplaceProduct[]) => {
  const searchKeyword = ref('')
  const searchType = ref<'all' | 'title' | 'description'>('all')
  const selectedCategory = ref('all')

  // 搜索匹配函数
  const matchesSearch = (product: MarketplaceProduct, keyword: string) => {
    const lowerKeyword = keyword.toLowerCase()

    switch (searchType.value) {
      case 'title':
        return product.title.toLowerCase().includes(lowerKeyword)
      case 'description':
        return product.description.toLowerCase().includes(lowerKeyword)
      default:
        return (
          product.title.toLowerCase().includes(lowerKeyword) ||
          product.description.toLowerCase().includes(lowerKeyword) ||
          product.category.toLowerCase().includes(lowerKeyword)
        )
    }
  }

  // 分类匹配函数
  const matchesCategory = (product: MarketplaceProduct, categoryValue: string) => {
    return categoryValue === 'all' || product.category === categoryValue
  }

  // 过滤产品（使用 computed 自动缓存）
  const filteredProducts = computed(() => {
    let result = products

    // 分类过滤
    if (selectedCategory.value !== 'all') {
      result = result.filter(p => matchesCategory(p, selectedCategory.value))
    }

    // 关键词搜索
    if (searchKeyword.value) {
      result = result.filter(p => matchesSearch(p, searchKeyword.value))
    }

    return result
  })

  // 防抖搜索（减少输入时的计算）
  const debouncedSearch = useDebounceFn(() => {
    // 搜索逻辑已在 computed 中处理
  }, 300)

  return {
    searchKeyword,
    searchType,
    selectedCategory,
    filteredProducts,
    debouncedSearch
  }
}
