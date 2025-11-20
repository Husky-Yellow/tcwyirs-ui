import request from '@/config/axios'
import type { HomepageData } from './types'

export type { ApplicationScenario, QualityResource, DataStatistic, HomepageData } from './types'

// 获取首页展示数据（mock）
export const getHomepageData = (): Promise<HomepageData> => {
  return request.get<HomepageData>({ url: '/public/homepage' })
}
