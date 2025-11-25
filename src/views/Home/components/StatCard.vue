<template>
  <div class="stat-card">
    <div class="font-pf-sc text-left text-12px text-black/45 font-normal leading-20px tracking-0">{{ label }}</div>
    <CountTo
      class="font-pf-sc tracking-0\.8px text-left text-18px text-black/85 font-medium leading-24px"
      :start-val="0"
      :end-val="value"
      :duration="2600"
    />
  </div>
</template>

<script lang="ts" setup>
import { CountTo } from '@/components/CountTo'

interface Props {
  label?: string
  value?: number
}

defineOptions({ name: 'StatCard' })

withDefaults(defineProps<Props>(), {
  label: '统计数据',
  value: 0,
})
</script>

<style lang="scss" scoped>
.stat-card {
  background-color: #00000005;
  border-radius: 8px;
  padding: 10px 24px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #E9ECF0;
  }

  &__label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  &__value {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    line-height: 1.2;
  }
}
</style>
