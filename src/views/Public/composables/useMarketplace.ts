import { shallowReactive, ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { getResourceInfoPage } from '@/api/resource/info'

/** 市场资源产品 */
interface MarketplaceProduct {
  id: string
  title: string
  description: string
  category: string
}

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
      const result = await getResourceInfoPage({
        pageNo: 1,
        pageSize: 100,
        status: 2 // 只获取已发布的资源
      })

      const prods = (result.list || []).map(item => ({
        id: String(item.id),
        title: item.name,
        description: item.description || '',
        category: item.tags?.[0]?.toString() || ''
      }))

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
