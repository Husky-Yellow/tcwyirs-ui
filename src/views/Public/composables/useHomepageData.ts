import { shallowReactive } from 'vue'
import type { Component } from 'vue'
import { MessageBox } from '@element-plus/icons-vue'

// ================== 类型定义 ==================
export interface ApplicationScenario {
  id: string
  title: string
  description: string
}

export interface SocialLink {
  name: string
  icon: Component
  url: string
}

export interface QualityResource {
  id: string
  category: string
  title: string
  description: string
}

export interface DataStatistic {
  label: string
  value: number
}

// 静态数据常量
const APPLICATION_SCENARIOS: ApplicationScenario[] = [
  {
    id: '01',
    title: '资源共享使用',
    description:
      '通过资源管理系统上架的数据/应用/组件类的资源，根据不同项目团队对于资源的使用需求进行个性化部署分配，提高项目人员的工作效率，拥有更全面的数据/信息/资源对比选择力'
  },
  {
    id: '02',
    title: '项目管理便捷',
    description:
      '通过资源管理系统上架的数据/应用/组件类的资源，根据不同项目团队对于资源的使用需求进行个性化部署分配，提高项目人员的工作效率，拥有更全面的数据/信息/资源对比选择力'
  },
  {
    id: '03',
    title: '企业流程管理',
    description:
      '通过资源管理系统上架的数据/应用/组件类的资源，根据不同项目团队对于资源的使用需求进行个性化部署分配，提高项目人员的工作效率，拥有更全面的数据/信息/资源对比选择力'
  },
  {
    id: '04',
    title: '资源溯源',
    description:
      '通过资源管理系统上架的数据/应用/组件类的资源，根据不同项目团队对于资源的使用需求进行个性化部署分配，提高项目人员的工作效率，拥有更全面的数据/信息/资源对比选择力'
  }
]

const QUALITY_RESOURCES: QualityResource[] = [
  { id: '1', category: '数据资源', title: '停车管理记录', description: '这是一段关于数据资源的介绍服务...' },
  { id: '2', category: '数据资源', title: '某应用流量记录', description: '这是一段关于数据资源的介绍服务...' },
  { id: '3', category: '数据资源', title: '数据资源名称', description: '这是一段关于数据资源的介绍服务...' },
  { id: '4', category: '数据资源', title: '数据资源名称', description: '这是一段关于数据资源的介绍服务...' },
  { id: '5', category: '应用资源', title: '停车管理系统', description: '这是一段关于应用资源的介绍服务...' },
  { id: '6', category: '应用资源', title: '应用资源名称', description: '这是一段关于应用资源的介绍服务...' },
  { id: '7', category: '应用资源', title: '应用资源名称', description: '这是一段关于应用资源的介绍服务...' },
  { id: '8', category: '应用资源', title: '应用资源名称', description: '这是一段关于应用资源的介绍服务...' },
  { id: '9', category: '组件资源', title: '白名单人员配置', description: '这是一段关于应用资源的介绍服务...' },
  { id: '10', category: '组件资源', title: '组件资源名称', description: '这是一段关于应用资源的介绍服务...' },
  { id: '11', category: '组件资源', title: '组件资源名称', description: '这是一段关于应用资源的介绍服务...' },
  { id: '12', category: '组件资源', title: '组件资源名称', description: '这是一段关于应用资源的介绍服务...' }
]

const DATA_STATISTICS: DataStatistic[] = [
  { label: '累计资源总量', value: 3098 },
  { label: '数据资源量', value: 1298 },
  { label: '组件资源量', value: 898 },
  { label: '应用资源量', value: 698 }
]

/**
 * 首页数据管理 Composable
 * 使用 shallowReactive 提升性能，静态数据不需要深度响应
 */
export const useHomepageData = () => {
  return {
    applicationScenarios: shallowReactive(APPLICATION_SCENARIOS),
    qualityResources: shallowReactive(QUALITY_RESOURCES),
    dataStatistics: shallowReactive(DATA_STATISTICS)
  }
}

