import { shallowReactive, onMounted, onUnmounted, ref, computed, watchEffect } from 'vue'
import { useLocalStorage, useDebounceFn, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { getHomepageData } from '@/api/homepage'
export type { ApplicationScenario, QualityResource, DataStatistic } from '@/api/homepage'

/**
 * 首页数据管理 Composable（数据从 mock 接口获取）
 */
export const useHomepageData = () => {
  // ================== 响应式数据 ==================
  const applicationScenarios = shallowReactive<any[]>([])
  const qualityResources = shallowReactive<any[]>([])
  const dataStatistics = shallowReactive<any[]>([])

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
  const userPreferences = useLocalStorage('homepage-preferences', {
    autoRefresh: false,
    refreshInterval: 30000, // 30秒
    showLoadingIndicator: true
  })

  // ================== 数据加载 ==================
  const load = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const data = await getHomepageData()
      applicationScenarios.splice(0, applicationScenarios.length, ...(data.applicationScenarios || []))
      qualityResources.splice(0, qualityResources.length, ...(data.qualityResources || []))
      dataStatistics.splice(0, dataStatistics.length, ...(data.dataStatistics || []))
      lastLoaded.value = new Date()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载数据失败'
      console.warn('[useHomepageData] 加载 mock 数据失败:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ================== 防抖加载 ==================
  const debouncedLoad = useDebounceFn(load, 300)

  // ================== 计算属性 ==================
  const hasData = computed(() =>
    applicationScenarios.length > 0 ||
    qualityResources.length > 0 ||
    dataStatistics.length > 0
  )

  const dataAge = computed(() => {
    if (!lastLoaded.value) return null
    return Date.now() - lastLoaded.value.getTime()
  })

  const shouldRefresh = computed(() => {
    if (!userPreferences.value.autoRefresh) return false
    if (!dataAge.value) return false
    return dataAge.value > userPreferences.value.refreshInterval
  })

  // ================== 监听器 ==================
  watchEffect(() => {
    if (shouldRefresh.value && !isLoading.value) {
      debouncedLoad()
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
    applicationScenarios,
    qualityResources,
    dataStatistics,
    // 状态
    isLoading,
    error,
    hasData,
    dataAge,
    // 断点
    isMobile,
    isTablet,
    isDesktop,
    // 用户偏好
    userPreferences,
    // 方法
    reload: load,
    refresh: debouncedLoad
  }
}
