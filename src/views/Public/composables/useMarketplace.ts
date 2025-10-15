import { shallowReactive, ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useDebounceFn, useLocalStorage, useBreakpoints, breakpointsTailwind, useScroll } from '@vueuse/core'
import type { MarketplaceProduct, CategoryItem } from '@/api/marketplace'
import { getMarketplaceProducts, getMarketplaceCategories } from '@/api/marketplace'

/**
 * Marketplace 组合 Hook：数据获取 + 搜索过滤
 */
export const useMarketplace = () => {
  // ================== 响应式数据 ==================
  const categories = shallowReactive<CategoryItem[]>([])
  const products = shallowReactive<MarketplaceProduct[]>([])

  // ================== 搜索与筛选 ==================
  const searchKeyword = ref('')
  const searchType = ref<'all' | 'title' | 'description'>('all')
  const selectedCategory = ref('all')
  const sortBy = ref<'relevance' | 'date' | 'popularity'>('relevance')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // ================== 加载状态 ==================
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastLoaded = ref<Date | null>(null)

  // ================== 响应式断点 ==================
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')
  const isTablet = breakpoints.between('sm', 'lg')
  const isDesktop = breakpoints.greater('lg')

  // ================== 用户偏好 ==================
  const userPreferences = useLocalStorage('marketplace-preferences', {
    defaultSearchType: 'all' as 'all' | 'title' | 'description',
    defaultSortBy: 'relevance' as 'relevance' | 'date' | 'popularity',
    itemsPerPage: 12,
    showFilters: true,
    autoRefresh: false
  })

  // ================== 数据加载 ==================
  const load = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const [cats, prods] = await Promise.all([
        getMarketplaceCategories(),
        getMarketplaceProducts()
      ])
      categories.splice(0, categories.length, ...cats)
      products.splice(0, products.length, ...prods)
      lastLoaded.value = new Date()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载数据失败'
      console.warn('[useMarketplace] 加载 mock 数据失败:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ================== 匹配函数 ==================
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

  // ================== 计算属性 ==================
  const filteredProducts = computed(() => {
    let result = products as MarketplaceProduct[]

    // 分类过滤
    if (selectedCategory.value !== 'all') {
      result = result.filter((p) => matchesCategory(p, selectedCategory.value))
    }

    // 搜索过滤
    if (searchKeyword.value) {
      result = result.filter((p) => matchesSearch(p, searchKeyword.value))
    }

    // 排序
    result = [...result].sort((a, b) => {
      switch (sortBy.value) {
        case 'date':
          return sortOrder.value === 'asc'
            ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'popularity':
          return sortOrder.value === 'asc'
            ? (a.views || 0) - (b.views || 0)
            : (b.views || 0) - (a.views || 0)
        default: // relevance
          return 0
      }
    })

    return result
  })

  const hasResults = computed(() => filteredProducts.value.length > 0)
  const totalResults = computed(() => filteredProducts.value.length)

  // ================== 防抖搜索 ==================
  const debouncedSearch = useDebounceFn(() => {
    // 过滤逻辑在 computed 中，防抖触发即可
    console.log('Search triggered:', { searchKeyword: searchKeyword.value, searchType: searchType.value })
  }, 300)

  // ================== 监听器 ==================
  watchEffect(() => {
    // 监听搜索关键词变化
    if (searchKeyword.value) {
      debouncedSearch()
    }
  })

  // ================== 生命周期 ==================
  onMounted(() => {
    load()
  })

  onUnmounted(() => {
    // 清理定时器等
  })

  return {
    // 数据
    categories,
    products,
    // 状态
    isLoading,
    error,
    hasResults,
    totalResults,
    // 断点
    isMobile,
    isTablet,
    isDesktop,
    // 用户偏好
    userPreferences,
    // 搜索
    searchKeyword,
    searchType,
    selectedCategory,
    sortBy,
    sortOrder,
    filteredProducts,
    debouncedSearch,
    // 方法
    reload: load
  }
}
