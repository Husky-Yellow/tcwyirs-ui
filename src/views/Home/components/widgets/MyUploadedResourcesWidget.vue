<template>
  <AppCard class="mt-16px p-24px">
    <!-- 我上架的资源 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">我上架的资源</span>
          <span class="text-14px text-[#909399]">{{ totalCount }}</span>
        </div>
        <span
          class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]"
          @click="handleGoToPublished"
        >
          全部
        </span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 mb-14px gap-12px">
        <StatCard label="数据资源" :value="resourceStats.dataResourceCount" />
        <StatCard label="组件资源" :value="resourceStats.componentResourceCount" />
        <StatCard label="应用资源" :value="resourceStats.appResourceCount" />
      </div>
    </div>

    <!-- 待我审批的资源 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">待我审批的资源</span>
          <span class="text-14px text-[#909399]">{{ pendingApprovalTotal }}</span>
        </div>
      </div>
      <!-- 待审批资源列表 -->
      <ul class="space-y-8px">
        <li
          v-for="(item, index) in pendingApprovalResources"
          :key="index"
          class="flex items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px"
        >
          <div class="text-14px text-[#606266]">{{ item.resourceName }}</div>
          <div class="flex items-center gap-6px">
            <span class="text-14px text-[#909399]">{{ item.applyUserName }}</span>
          </div>
        </li>
      </ul>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'
import {
  fetchResourceStats,
  getApplyTodoPage,
  type ResourceStatsRespVO,
  type ResourceApplyTodoRespVO
} from '@/api/resource/info'

defineOptions({ name: 'MyUploadedResourcesWidget' })

const router = useRouter()

// 资源统计数据
const resourceStats = ref<ResourceStatsRespVO>({})
const totalCount = ref(0)

// 待我审批的资源数据
const pendingApprovalTotal = ref(0)
const pendingApprovalResources = ref<ResourceApplyTodoRespVO[]>([])

// 加载资源统计数据
const loadResourceStats = async () => {
  try {
    const stats = await fetchResourceStats()

    resourceStats.value = stats
    // 计算总数
    const total =
      (stats.dataResourceCount || 0) +
      (stats.appResourceCount || 0) +
      (stats.componentResourceCount || 0)
    if (total > 0) {
      totalCount.value = total
    }
  } catch (error) {
    console.error('加载资源统计失败:', error)
  }
}

// 加载待我审批的资源列表
const loadPendingApprovalResources = async () => {
  try {
    const response = await getApplyTodoPage({
      pageNo: 1,
      pageSize: 5 // 只显示前5条
    })
    pendingApprovalResources.value = response.list || []
    pendingApprovalTotal.value = response.total || 0
  } catch (error) {
    console.error('加载待审批资源列表失败:', error)
  }
}

// 跳转到我上架的资源页面
const handleGoToPublished = () => {
  router.push('/workbench/my-published-resources')
}

// 组件挂载时加载数据
onMounted(() => {
  loadResourceStats()
  loadPendingApprovalResources()
})
</script>
