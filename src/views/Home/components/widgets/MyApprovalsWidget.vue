<template>
  <AppCard class="mt-16px p-24px">
    <!-- 我发起的审批 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <div class="flex items-center gap-8px">
          <span class="text-16px text-[#303133] font-500">我发起的审批</span>
          <span class="text-14px text-[#909399]">12</span>
        </div>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 mb-14px gap-12px px-48px pt-24px">
        <StatCard label="审批中" :value="6" />
        <StatCard label="已完成" :value="6" />
      </div>

      <!-- 审批列表 -->
      <ul class="space-y-8px">
        <li
          v-for="(item, index) in approvalList"
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
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'
import { useStatusStyle } from '../../composables/useStatusStyle'

defineOptions({ name: 'MyApprovalsWidget' })

const { getStatusDotClass, getStatusTextClass } = useStatusStyle()

// 审批列表数据
const approvalList = ref([
  { name: '资源申请审批', status: 'pending', statusText: '审批中' },
  { name: '权限变更审批', status: 'approved', statusText: '已通过' },
  { name: '数据访问审批', status: 'rejected', statusText: '已驳回' }
])
</script>
