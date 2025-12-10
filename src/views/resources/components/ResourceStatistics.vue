<template>
  <div class="grid grid-cols-4 mb-16px gap-14px">
    <div
      v-for="item in statisticsItems"
      :key="item.key"
      class="rounded-[10px] bg-[#fff] px-24px py-15px"
    >
      <div class="mb-8px text-14px text-[#909399]">{{ item.label }}</div>
      <CountTo
        class="text-24px text-[#303133] font-600"
        :start-val="0"
        :end-val="item.value"
        :duration="2600"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ResourceStatistics {
  visitCount: number
  applyCount: number
  avgScore: number
  unpublishedCount: number
}

interface Props {
  statistics: ResourceStatistics
}

const props = defineProps<Props>()

const statisticsItems = computed(() => [
  {
    key: 'visitCount',
    label: '访问总量',
    value: props.statistics.visitCount || 0
  },
  {
    key: 'applyCount',
    label: '申请总量',
    value: props.statistics.applyCount || 0
  },
  {
    key: 'avgScore',
    label: '综合平均分',
    value: props.statistics.avgScore || 0
  },
  {
    key: 'unpublishedCount',
    label: '未上架资源',
    value: props.statistics.unpublishedCount || 0
  }
])
</script>
