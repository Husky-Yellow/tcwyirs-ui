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
        <StatCard label="已上架" :value="publishedCount" />
        <StatCard label="审核中" :value="reviewingCount" />
        <StatCard label="已下架" :value="offlineCount" />
      </div>

      <!-- 资源列表 -->
      <ul class="space-y-8px">
        <li
          v-for="(item, index) in uploadedResources"
          :key="index"
          class="flex items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px"
        >
          <div class="text-14px text-[#606266]">{{ item.name }}</div>
          <div class="flex items-center gap-6px">
            <span class="h-6px w-6px rounded-full" :class="getStatusDotClass(item.status)"></span>
            <span class="text-14px" :class="getStatusTextClass(item.status)">
              {{ item.statusText }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 分隔线 -->
    <div class="my-24px h-1px bg-[#DCDFE6]"></div>

    <!-- 待我审批的资源 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">待我审批的资源</span>
          <span class="text-14px text-[#909399]">8</span>
        </div>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 mb-14px gap-12px px-48px pt-24px">
        <StatCard label="待处理" :value="5" />
        <StatCard label="今日新增" :value="3" />
      </div>

      <!-- 待审批资源列表 -->
      <ul class="space-y-8px">
        <li
          v-for="(item, index) in pendingApprovalResources"
          :key="index"
          class="flex items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px"
        >
          <div class="text-14px text-[#606266]">{{ item.name }}</div>
          <div class="flex items-center gap-6px">
            <span class="text-14px text-[#909399]">{{ item.submitter }}</span>
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
import { useStatusStyle } from '../../composables/useStatusStyle'
import {
  fetchResourceStats,
  getPublishApplicationPage,
  type ResourceStatsRespVO
} from '@/api/resource/info'

defineOptions({ name: 'MyUploadedResourcesWidget' })

const router = useRouter()
const { getStatusDotClass, getStatusTextClass } = useStatusStyle()

// 资源统计数据
const resourceStats = ref<ResourceStatsRespVO>({})
const totalCount = ref(24)
const publishedCount = ref(18)
const reviewingCount = ref(4)
const offlineCount = ref(2)

// 我上架的资源列表
const uploadedResources = ref([
  { name: '用户行为数据集', status: 'online', statusText: '已上架' },
  { name: '销售分析报表', status: 'reviewing', statusText: '审核中' },
  { name: '客户信息数据', status: 'offline', statusText: '已下架' }
])

// 待我审批的资源列表
const pendingApprovalResources = ref([
  { name: '市场营销数据', submitter: '张三' },
  { name: '产品使用统计', submitter: '李四' },
  { name: '财务报表数据', submitter: '王五' }
])

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

// 加载我上架的资源列表
const loadPublishedResources = async () => {
  try {
    // TODO: 需要传入当前用户ID
    const response = await getPublishApplicationPage({
      publishUserId: '', // 需要从用户store获取
      pageNo: 1,
      pageSize: 10
    })
    // TODO: 根据实际返回的数据结构更新列表
    console.log('上架资源列表:', response)
  } catch (error) {
    console.error('加载上架资源列表失败:', error)
  }
}

// 跳转到我上架的资源页面
const handleGoToPublished = () => {
  router.push('/workbench/my-published-resources')
}

// 组件挂载时加载数据
onMounted(() => {
  loadResourceStats()
  loadPublishedResources()
})
</script>
