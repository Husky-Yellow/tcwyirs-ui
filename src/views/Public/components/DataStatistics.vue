<template>
  <section class="bg-white py-40px">
    <div
      class="mx-auto max-w-1134px flex items-center justify-between"
    >
      <div
        v-for="stat in statistics"
        :key="stat.label"
        class="flex flex-col items-center text-center font-['PingFang_SC']"
      >
        <CountTo
          class="text-[28px] text-[#165DFF] font-semibold leading-tight"
          :start-val="0"
          :end-val="stat.value"
          :duration="2600"
        />
        <p
          class="text-[14px] text-black/85 font-normal leading-[22px]"
        >
          {{ stat.label }}
        </p>
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
