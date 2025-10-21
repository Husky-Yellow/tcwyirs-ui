export interface ApplicationScenario {
  id: string
  title: string
  description: string
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

export interface HomepageData {
  applicationScenarios: ApplicationScenario[]
  qualityResources: QualityResource[]
  dataStatistics: DataStatistic[]
}
