import type { MockConfig, ApiResponse } from '../../types'

interface ApplicationScenario {
  id: string
  title: string
  description: string
}

interface QualityResource {
  id: string
  category: string
  title: string
  description: string
}

interface DataStatistic {
  label: string
  value: number
}

const APPLICATION_SCENARIOS: ApplicationScenario[] = [
  {
    id: '01',
    title: '资源共享使用',
    description:
      '通过资源管理系统上架的资源，根据不同项目对资源的使用需求进行个性化分配，提高团队效率，便于对比选择。'
  },
  {
    id: '02',
    title: '项目管理便捷',
    description:
      '集中化管理项目资源、流程与协作，透明可追踪，降低沟通成本。'
  },
  {
    id: '03',
    title: '企业流程管理',
    description:
      '规范企业内部流程，沉淀最佳实践，助力数字化治理。'
  },
  {
    id: '04',
    title: '资源溯源',
    description:
      '支持资源来源、版本、使用的全链路追溯，提升可信度。'
  }
]

const QUALITY_RESOURCES: QualityResource[] = [
  { id: '1', category: '数据资源', title: '停车管理记录', description: '关于数据资源的介绍服务...' },
  { id: '2', category: '数据资源', title: '应用流量记录', description: '关于数据资源的介绍服务...' },
  { id: '3', category: '数据资源', title: '数据资源名称', description: '关于数据资源的介绍服务...' },
  { id: '4', category: '数据资源', title: '数据资源名称', description: '关于数据资源的介绍服务...' },
  { id: '5', category: '应用资源', title: '停车管理系统', description: '关于应用资源的介绍服务...' },
  { id: '6', category: '应用资源', title: '应用资源名称', description: '关于应用资源的介绍服务...' },
  { id: '7', category: '应用资源', title: '应用资源名称', description: '关于应用资源的介绍服务...' },
  { id: '8', category: '应用资源', title: '应用资源名称', description: '关于应用资源的介绍服务...' },
  { id: '9', category: '组件资源', title: '白名单人员配置', description: '关于组件资源的介绍服务...' },
  { id: '10', category: '组件资源', title: '组件资源名称', description: '关于组件资源的介绍服务...' },
  { id: '11', category: '组件资源', title: '组件资源名称', description: '关于组件资源的介绍服务...' },
  { id: '12', category: '组件资源', title: '组件资源名称', description: '关于组件资源的介绍服务...' }
]

const DATA_STATISTICS: DataStatistic[] = [
  { label: '累计资源总量', value: 3098 },
  { label: '数据资源数', value: 1298 },
  { label: '组件资源数', value: 898 },
  { label: '应用资源数', value: 698 }
]

const mockConfigs: MockConfig[] = [
  // 首页数据聚合
  {
    url: '/admin-api/public/homepage',
    type: 'get',
    response: (): ApiResponse<{
      applicationScenarios: ApplicationScenario[]
      qualityResources: QualityResource[]
      dataStatistics: DataStatistic[]
    }> => ({
      code: 0,
      data: {
        applicationScenarios: APPLICATION_SCENARIOS,
        qualityResources: QUALITY_RESOURCES,
        dataStatistics: DATA_STATISTICS
      },
      msg: ''
    })
  }
]

export default mockConfigs

