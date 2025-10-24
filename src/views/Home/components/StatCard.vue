<template>
  <div class="stat-card">
    <div class="stat-card__label">{{ label }}</div>
    <CountTo
      class="stat-card__value"
      :start-val="0"
      :end-val="value"
      :duration="duration"
    />
  </div>
</template>

<script lang="ts" setup>
import { CountTo } from '@/components/CountTo'

interface Props {
  label: string
  value: number
  duration?: number
}

defineOptions({ name: 'StatCard' })

withDefaults(defineProps<Props>(), {
  duration: 2600
})
</script>

<style lang="scss" scoped>
.stat-card {
  text-align: center;
  padding: 16px 0;

  &__label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }

  &__value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
