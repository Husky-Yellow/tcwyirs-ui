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
            class="text-5 text-blue-500 font-bold"
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
import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'

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

// 根据角色获取统计数据
const statistics = computed<Statistic[]>(() => {
  const roles = userStore.getRoles

  // TODO: 这里应该从API获取实际数据，目前使用模拟数据
  // 可以调用 API 根据角色获取不同的统计信息

  // 资源管理员：4个图标
  if (roles.includes('resource_admin')) {
    return [
      { label: '上架资源次数', value: 226, icon: resourceStatsIcon },
      { label: '资源被申请次数', value: 1521, icon: resourceStatsIcon },
      { label: '待处理反馈', value: 12, icon: pendingFeedbackIcon },
      { label: '待审批的资源', value: 12, icon: pendingResourcesIcon }
    ]
  }

  // 运营管理员：3个图标
  if (roles.includes('operation_admin')) {
    return [
      { label: '已上架资源总数', value: 226, icon: resourceStatsIcon },
      { label: '成员总数', value: 1521, icon: projectStatsIcon },
      { label: '待处理反馈', value: 12, icon: pendingFeedbackIcon }
    ]
  }

  // 项目经理：2个图标
  if (roles.includes('project_manager')) {
    return [
      { label: '申请资源次数', value: 15, icon: resourceStatsIcon },
      { label: '已创建项目组', value: 3, icon: projectStatsIcon }
    ]
  }

  // 项目成员：2个图标（默认）
  return [
    { label: '申请资源次数', value: 15, icon: resourceStatsIcon },
    { label: '已加入项目组', value: 5, icon: projectStatsIcon }
  ]
})
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
