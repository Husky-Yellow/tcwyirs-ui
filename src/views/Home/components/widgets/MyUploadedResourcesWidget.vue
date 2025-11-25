<template>
  <AppCard class="mt-16px p-24px">
    <!-- 我上架的资源 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">我上架的资源</span>
          <span class="text-14px text-[#909399]">24</span>
        </div>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 mb-14px gap-12px">
        <StatCard label="已上架" :value="18" />
        <StatCard label="审核中" :value="4" />
        <StatCard label="已下架" :value="2" />
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
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'

defineOptions({ name: 'MyUploadedResourcesWidget' })

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

// 获取状态圆点的样式类
const getStatusDotClass = (status: string) => {
  const statusMap: Record<string, string> = {
    online: 'bg-[#67C23A]', // 绿色 - 已上架
    reviewing: 'bg-[#409EFF]', // 蓝色 - 审核中
    offline: 'bg-[#909399]' // 灰色 - 已下架
  }
  return statusMap[status] || 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status: string) => {
  const statusMap: Record<string, string> = {
    online: 'text-[#67C23A]', // 绿色
    reviewing: 'text-[#409EFF]', // 蓝色
    offline: 'text-[#909399]' // 灰色
  }
  return statusMap[status] || 'text-[#909399]'
}
</script>
