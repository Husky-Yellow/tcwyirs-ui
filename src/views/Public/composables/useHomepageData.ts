import { shallowReactive, onMounted } from 'vue'
import { getHomepageData } from '@/api/homepage'
export type { ApplicationScenario, QualityResource, DataStatistic } from '@/api/homepage'

/**
 * 首页数据管理 Composable（数据从 mock 接口获取）
 */
export const useHomepageData = () => {
  const applicationScenarios = shallowReactive<any[]>([])
  const qualityResources = shallowReactive<any[]>([])
  const dataStatistics = shallowReactive<any[]>([])

  const load = async () => {
    try {
      const data = await getHomepageData()
      applicationScenarios.splice(0, applicationScenarios.length, ...(data.applicationScenarios || []))
      qualityResources.splice(0, qualityResources.length, ...(data.qualityResources || []))
      dataStatistics.splice(0, dataStatistics.length, ...(data.dataStatistics || []))
    } catch (e) {
      console.warn('[useHomepageData] 加载 mock 数据失败:', e)
    }
  }

  onMounted(load)

  return {
    applicationScenarios,
    qualityResources,
    dataStatistics,
    reload: load
  }
}

