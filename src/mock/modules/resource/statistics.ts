import type { MockConfig, ApiResponse } from '../../types'
import type { DashboardDataVO } from '@/api/resource/statistics'
import { calcDashboard } from './_data'

const mockConfigs: MockConfig[] = [
  {
    url: '/admin-api/resource/statistics/dashboard',
    type: 'get',
    response: (): ApiResponse<DashboardDataVO> => {
      return { code: 0, data: calcDashboard(), msg: '' }
    }
  }
]

export default mockConfigs
