import { shallowReactive, ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { MarketplaceProduct, CategoryItem } from '@/api/marketplace'
import { getMarketplaceProducts, getMarketplaceCategories } from '@/api/marketplace'

/**
 * Marketplace 组合 Hook：数据获取 + 搜索过滤
 */
export const useMarketplace = () => {
  // 数据
  const categories = shallowReactive<CategoryItem[]>([])
  const products = shallowReactive<MarketplaceProduct[]>([])

  // 搜索与筛选
  const searchKeyword = ref('')
  const searchType = ref<'all' | 'title' | 'description'>('all')
  const selectedCategory = ref('all')

  // 加载列表数据
  const load = async () => {
    try {
      const [cats, prods] = await Promise.all([
        getMarketplaceCategories(),
        getMarketplaceProducts()
      ])
      categories.splice(0, categories.length, ...cats)
      products.splice(0, products.length, ...prods)
    } catch (e) {
      console.warn('[useMarketplace] 加载 mock 数据失败:', e)
    }
  }

  // 匹配函数
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

  const matchesCategory = (product: MarketplaceProduct, categoryValue: string) => {
    return categoryValue === 'all' || product.category === categoryValue
  }

  const filteredProducts = computed(() => {
    let result = products as MarketplaceProduct[]
    if (selectedCategory.value !== 'all') {
      result = result.filter((p) => matchesCategory(p, selectedCategory.value))
    }
    if (searchKeyword.value) {
      result = result.filter((p) => matchesSearch(p, searchKeyword.value))
    }
    return result
  })

  const debouncedSearch = useDebounceFn(() => {
    // 过滤逻辑在 computed 中，防抖触发即可
  }, 300)

  onMounted(load)

  return {
    // 数据
    categories,
    products,
    reload: load,
    // 搜索
    searchKeyword,
    searchType,
    selectedCategory,
    filteredProducts,
    debouncedSearch
  }
}

