import { shallowReactive, ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { MarketplaceProduct } from '@/api/marketplace'
import { getMarketplaceProducts } from '@/api/marketplace'

/**
 * Marketplace 组合 Hook：数据获取 + 搜索过滤
 */
export const useMarketplace = () => {
  const products = shallowReactive<MarketplaceProduct[]>([])
  const searchKeyword = ref('')
  const searchType = ref<'all' | 'title' | 'description'>('all')
  const isLoading = ref(false)

  const load = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const prods = await getMarketplaceProducts()
      products.splice(0, products.length, ...prods)
    } catch (e) {
      console.warn('[useMarketplace] 加载数据失败:', e)
    } finally {
      isLoading.value = false
    }
  }

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

  const filteredProducts = computed(() => {
    if (!searchKeyword.value) return products as MarketplaceProduct[]
    return products.filter((p) => matchesSearch(p, searchKeyword.value))
  })

  const debouncedSearch = useDebounceFn(() => {
    // 搜索逻辑在 computed 中，防抖触发即可
  }, 300)

  onMounted(load)

  return {
    products,
    isLoading,
    searchKeyword,
    searchType,
    filteredProducts,
    debouncedSearch,
    reload: load
  }
}
