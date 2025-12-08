<template>
  <div
    class="banner relative h-196px w-full flex flex-col overflow-hidden rounded-[8px] px-32px py-24px"
  >
    <!-- Greeting title -->
      <div class="relative z-1 mb-22px">
        <h1 class="text-22px font-medium font-['PingFang_SC']">
          <span class="text-black">早上好,欢迎来到</span>
          <span class="text-blue-500">工作台</span>
        </h1>
      </div>

      <!-- Statistics cards below title -->
      <div class="relative z-1 flex items-center gap-72px">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="flex flex-col"
        >
          <div class="mb-10px h-32px w-32px flex items-center justify-center">
            <img :src="stat.icon" :alt="stat.label" class="h-full w-full object-contain" />
          </div>
          <CountTo
            class="text-5 font-bold"
            :start-val="0"
            :end-val="stat.value"
            :duration="2600"
          />
          <div class="text-3 text-gray-600">{{ stat.label }}</div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getWorkbenchStatistics, type WorkbenchStatisticsRespVO } from '@/api/resource/workbench'

// 图标导入
import pendingFeedbackIcon from '@/assets/imgs/home/banner/pending_feedback.png'
import pendingResourcesIcon from '@/assets/imgs/home/banner/pending_resources.png'
import projectStatsIcon from '@/assets/imgs/home/banner/project_stats.png'
import resourceStatsIcon from '@/assets/imgs/home/banner/resource_stats.png'

defineOptions({ name: 'IndexBanner' })

interface Statistic {
  label: string
  value: number
  icon: string
}

const userStore = useUserStore()
const statisticsData = ref<WorkbenchStatisticsRespVO>({})

// 角色统计配置
const ROLE_STATISTICS_MAP: Record<string, (data: WorkbenchStatisticsRespVO) => Statistic[]> = {
  resource_admin: (data) => [
    { label: '上架资源次数', value: data.publishCount || 0, icon: resourceStatsIcon },
    { label: '资源被申请次数', value: data.applyCount || 0, icon: resourceStatsIcon },
    { label: '待处理反馈', value: data.pendingFeedbackCount || 0, icon: pendingFeedbackIcon },
    { label: '待审批的资源', value: data.pendingApprovalCount || 0, icon: pendingResourcesIcon }
  ],
  operation_admin: (data) => [
    { label: '已上架资源总数', value: data.publishCount || 0, icon: resourceStatsIcon },
    { label: '成员总数', value: 1521, icon: projectStatsIcon }, // TODO: 需要从其他接口获取
    { label: '待处理反馈', value: data.pendingFeedbackCount || 0, icon: pendingFeedbackIcon }
  ],
  project_manager: (data) => [
    { label: '申请资源次数', value: data.applyCount || 0, icon: resourceStatsIcon },
    { label: '已创建项目组', value: 3, icon: projectStatsIcon } // TODO: 需要从其他接口获取
  ]
}

// 默认统计（项目成员）
const getDefaultStatistics = (data: WorkbenchStatisticsRespVO): Statistic[] => [
  { label: '申请资源次数', value: data.applyCount || 0, icon: resourceStatsIcon },
  { label: '已加入项目组', value: 5, icon: projectStatsIcon } // TODO: 需要从其他接口获取
]

// 根据角色获取统计数据
const statistics = computed<Statistic[]>(() => {
  const roles = userStore.getRoles
  const data = statisticsData.value

  // 查找匹配的角色配置
  for (const role of roles) {
    if (ROLE_STATISTICS_MAP[role]) {
      return ROLE_STATISTICS_MAP[role](data)
    }
  }

  return getDefaultStatistics(data)
})

// 加载统计数据
const loadStatistics = async () => {
  try {
    statisticsData.value = await getWorkbenchStatistics()
  } catch (error) {
    console.error('加载工作台统计数据失败:', error)
  }
}

onMounted(loadStatistics)
</script>

<style scoped>
.banner {
  position: relative;
  background-color: #fff;

}

.banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('@/assets/imgs/home/home_banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: inherit;
  z-index: 0;
}
</style>
