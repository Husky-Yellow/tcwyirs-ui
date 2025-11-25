<template>
  <AppCard class="mt-16px p-24px">
    <!-- 资源上架审批 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">资源上架审批</span>
          <span class="text-14px text-[#909399]">16</span>
        </div>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 mb-14px gap-12px">
        <StatCard label="待审批" :value="8" />
        <StatCard label="已通过" :value="6" />
        <StatCard label="已驳回" :value="2" />
      </div>

      <!-- 审批列表 -->
      <ul class="space-y-8px">
        <li
          v-for="(item, index) in approvalList"
          :key="index"
          class="flex items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px"
        >
          <div class="flex flex-col gap-4px">
            <div class="text-14px text-[#303133] font-500">{{ item.name }}</div>
            <div class="text-12px text-[#909399]">申请人：{{ item.applicant }}</div>
          </div>
          <div class="flex items-center gap-6px">
            <span class="h-6px w-6px rounded-full" :class="getStatusDotClass(item.status)"></span>
            <span class="text-14px" :class="getStatusTextClass(item.status)">
              {{ item.statusText }}
            </span>
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

defineOptions({ name: 'ApprovalPendingWidget' })

// 审批列表数据
const approvalList = ref([
  { name: '客户画像数据集', applicant: '张三', status: 'pending', statusText: '待审批' },
  { name: '电商交易数据', applicant: '李四', status: 'pending', statusText: '待审批' },
  { name: '用户反馈数据', applicant: '王五', status: 'approved', statusText: '已通过' },
  { name: '营销活动数据', applicant: '赵六', status: 'rejected', statusText: '已驳回' }
])

// 获取状态圆点的样式类
const getStatusDotClass = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'bg-[#E6A23C]', // 橙色 - 待审批
    approved: 'bg-[#67C23A]', // 绿色 - 已通过
    rejected: 'bg-[#F56C6C]' // 红色 - 已驳回
  }
  return statusMap[status] || 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'text-[#E6A23C]', // 橙色
    approved: 'text-[#67C23A]', // 绿色
    rejected: 'text-[#F56C6C]' // 红色
  }
  return statusMap[status] || 'text-[#909399]'
}
</script>
