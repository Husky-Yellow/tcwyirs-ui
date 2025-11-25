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
            <span class="text-14px text-[#909399]">12</span>
          </div>
          <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-3 mb-14px gap-12px">
          <StatCard label="最近申请" :value="12" />
          <StatCard label="申请中" :value="6" />
          <StatCard label="即将到期" :value="2" />
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
          <StatCard label="数据资源" :value="12" />
          <StatCard label="应用资源" :value="6" />
          <StatCard label="组件资源" :value="10" />
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'

defineOptions({ name: 'BrowsedResourcesWidget' })

// 申请的资源列表数据
const applicationResources = ref([
  { name: '数据资源名称', status: 'applying', statusText: '申请中' },
  { name: '应用资源名称', status: 'success', statusText: '申请成功' },
  { name: '组件资源名称', status: 'failed', statusText: '申请失败' }
])

// 获取状态圆点的样式类
const getStatusDotClass = (status: string) => {
  const statusMap: Record<string, string> = {
    applying: 'bg-[#409EFF]', // 蓝色 - 申请中
    success: 'bg-[#67C23A]', // 绿色 - 申请成功
    failed: 'bg-[#F56C6C]' // 红色 - 申请失败
  }
  return statusMap[status] || 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status: string) => {
  const statusMap: Record<string, string> = {
    applying: 'text-[#409EFF]', // 蓝色
    success: 'text-[#67C23A]', // 绿色
    failed: 'text-[#F56C6C]' // 红色
  }
  return statusMap[status] || 'text-[#909399]'
}
</script>
