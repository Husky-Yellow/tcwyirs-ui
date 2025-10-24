<template>
  <section class="py-60px bg-white">
    <div class="max-w-1200px mx-auto px-33px">
      <div class="grid grid-cols-4 gap-40px">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="flex flex-col items-center justify-center"
        >
          <div class="text-40px font-700 text-#3b82f6 mb-8px">
            {{ stat.value.toLocaleString() }}
          </div>
          <div class="text-16px text-#6b7280">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DataStatistic } from '../composables/useHomepageData'

defineOptions({ name: 'DataStatistics' })

interface Props {
  statistics: DataStatistic[]
}

defineProps<Props>()
</script>
