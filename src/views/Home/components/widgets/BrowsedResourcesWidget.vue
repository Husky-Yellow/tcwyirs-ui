<template>
  <!-- 项目成员：左侧顶部卡片 -->
  <AppCard class="mt-16px">
    <div class="p-24px">
      <!-- 我申请的资源 -->
      <div class="">
        <!-- 标题栏 -->
        <div class="mb-16px flex items-center justify-between">
          <div class="flex items-center gap-8px">
            <span class="text-16px text-[#303133] font-500">我申请的资源</span>
            <span class="text-14px text-[#909399]">{{ totalApplicationCount }}</span>
          </div>
          <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-3 mb-14px gap-12px">
          <StatCard label="最近申请" :value="recentApplicationCount" />
          <StatCard label="申请中" :value="applyingCount" />
          <StatCard label="即将到期" :value="expiringCount" />
        </div>

        <!-- 资源列表 -->
        <ul class="space-y-8px">
          <li
            v-for="(item, index) in applicationResources"
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

      <!-- 我收藏的资源 -->
      <div class="mt-24px">
        <!-- 标题栏 -->
        <div class="mb-16px flex items-center justify-between">
          <div class="flex items-center gap-8px">
            <span class="text-16px text-[#303133] font-500">我收藏的资源</span>
          </div>
          <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-3 gap-12px">
          <StatCard label="数据资源" :value="collectStats.dataResourceCount" />
          <StatCard label="应用资源" :value="collectStats.appResourceCount" />
          <StatCard label="组件资源" :value="collectStats.componentResourceCount" />
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'
import {
  getMyResourceApplyPage,
  type ResourceApplyVO
} from '@/api/resource/apply'
import {
  getMyCollectStatistics
} from '@/api/resource/collect'
import { ApplyStatus } from '@/api/resource/types'

defineOptions({ name: 'BrowsedResourcesWidget' })

// 申请的资源列表原始数据
const applicationResourcesData = ref<ResourceApplyVO[]>([])
const totalApplicationCount = ref(0)

// 收藏的资源统计数据
const collectStats = ref({
  dataResourceCount: 0,
  appResourceCount: 0,
  componentResourceCount: 0
})

// 转换申请资源数据为显示格式
interface DisplayResource {
  name: string
  status: string
  statusText: string
}

const applicationResources = computed<DisplayResource[]>(() => {
  return applicationResourcesData.value.map((item) => ({
    name: item.resourceName || '未命名资源',
    status: getStatusKey(item.status),
    statusText: getStatusText(item.status)
  }))
})

// 计算统计数据
const recentApplicationCount = computed(() => {
  // 最近7天的申请数量
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return applicationResourcesData.value.filter((item) => {
    if (!item.createTime) return false
    const createTime = new Date(item.createTime)
    return createTime >= sevenDaysAgo
  }).length
})

const applyingCount = computed(() => {
  return applicationResourcesData.value.filter(
    (item) => item.status === ApplyStatus.PENDING
  ).length
})

const expiringCount = computed(() => {
  // 30天内到期的资源数量
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

  return applicationResourcesData.value.filter((item) => {
    if (!item.approvalTime || !item.duration) return false
    if (item.status !== ApplyStatus.APPROVED) return false

    const approvalDate = new Date(item.approvalTime)
    const expiryDate = new Date(approvalDate)
    expiryDate.setDate(expiryDate.getDate() + item.duration)

    const now = new Date()
    return expiryDate > now && expiryDate <= thirtyDaysLater
  }).length
})

// 根据申请状态枚举获取状态键
const getStatusKey = (status?: ApplyStatus): string => {
  switch (status) {
    case ApplyStatus.PENDING:
      return 'applying'
    case ApplyStatus.APPROVED:
      return 'success'
    case ApplyStatus.REJECTED:
      return 'failed'
    case ApplyStatus.CANCELLED:
      return 'cancelled'
    default:
      return 'unknown'
  }
}

// 根据申请状态枚举获取状态文本
const getStatusText = (status?: ApplyStatus): string => {
  switch (status) {
    case ApplyStatus.PENDING:
      return '申请中'
    case ApplyStatus.APPROVED:
      return '申请成功'
    case ApplyStatus.REJECTED:
      return '申请失败'
    case ApplyStatus.CANCELLED:
      return '已撤销'
    default:
      return '未知'
  }
}

// 获取状态圆点的样式类
const getStatusDotClass = (status: string) => {
  const statusMap: Record<string, string> = {
    applying: 'bg-[#409EFF]', // 蓝色 - 申请中
    success: 'bg-[#67C23A]', // 绿色 - 申请成功
    failed: 'bg-[#F56C6C]', // 红色 - 申请失败
    cancelled: 'bg-[#909399]' // 灰色 - 已撤销
  }
  return statusMap[status] || 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status: string) => {
  const statusMap: Record<string, string> = {
    applying: 'text-[#409EFF]', // 蓝色
    success: 'text-[#67C23A]', // 绿色
    failed: 'text-[#F56C6C]', // 红色
    cancelled: 'text-[#909399]' // 灰色
  }
  return statusMap[status] || 'text-[#909399]'
}

// 加载申请的资源列表
const loadApplicationResources = async () => {
  try {
    const response = await getMyResourceApplyPage({
      pageNo: 1,
      pageSize: 5 // 只显示前5条
    })
    applicationResourcesData.value = response.list || []
    totalApplicationCount.value = response.total || 0
  } catch (error) {
    console.error('加载申请资源列表失败:', error)
  }
}

// 加载收藏的资源统计
const loadCollectStats = async () => {
  try {
    const stats = await getMyCollectStatistics()
    collectStats.value = {
      dataResourceCount: stats.dataResourceCount || 0,
      appResourceCount: stats.appResourceCount || 0,
      componentResourceCount: stats.componentResourceCount || 0
    }
  } catch (error) {
    console.error('加载收藏资源统计失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadApplicationResources()
  loadCollectStats()
})
</script>
