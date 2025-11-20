<template>
  <section class="py-40px bg-white">
    <div
      class="max-w-1134px mx-auto flex justify-between items-center"
    >
      <div
        v-for="stat in statistics"
        :key="stat.label"
        class="flex flex-col items-center text-center font-['PingFang_SC']"
      >
        <CountTo
          class="font-semibold text-[28px] leading-tight text-[#165DFF]"
          :start-val="0"
          :end-val="stat.value"
          :duration="2600"
        />
        <p
          class="font-normal text-[14px] leading-[22px] text-black/85"
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
