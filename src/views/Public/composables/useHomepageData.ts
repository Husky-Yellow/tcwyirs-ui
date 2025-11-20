import { shallowReactive, ref, onMounted } from 'vue'
import { getHomepageData } from '@/api/homepage'
export type { ApplicationScenario, QualityResource, DataStatistic } from '@/api/homepage'

/**
 * 首页数据管理 Composable
 */
export const useHomepageData = () => {
  const applicationScenarios = shallowReactive<any[]>([])
  const qualityResources = shallowReactive<any[]>([])
  const dataStatistics = shallowReactive<any[]>([])
  const isLoading = ref(false)

  const load = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const data = await getHomepageData()
      applicationScenarios.splice(
        0,
        applicationScenarios.length,
        ...(data.applicationScenarios || [])
      )
      qualityResources.splice(0, qualityResources.length, ...(data.qualityResources || []))
      dataStatistics.splice(0, dataStatistics.length, ...(data.dataStatistics || []))
    } catch (e) {
      console.warn('[useHomepageData] 加载数据失败:', e)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(load)

  return {
    applicationScenarios,
    qualityResources,
    dataStatistics,
    isLoading,
    reload: load
  }
}
