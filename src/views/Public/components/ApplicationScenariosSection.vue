<template>
  <section class="bg-white py-60px">
    <div class="mx-auto max-w-1160px">
      <div class="mb-73px text-center">
        <h2 class="mb-16px text-[32px] text-black/85 font-medium leading-normal font-['PingFang_SC']">应用场景</h2>
      </div>

      <div class="grid grid-cols-2 gap-x-220px gap-y-60px">
        <div v-for="scenario in scenarios" :key="scenario.id" class="w-[470px] flex flex-col">
           <div class="text-[60px] text-[#1677FF] font-black font-['Alibaba_PuHuiTi_2.0'] opacity-15">
              {{ scenario.id }}
            </div>

          <h3 class="mt-[-34px] text-[22px] text-gray-900/85 font-medium leading-normal font-['PingFang_SC']">{{ scenario.title }}</h3>

          <p class="mt-24px text-[14px] text-black/65 font-normal leading-[26px] font-['PingFang_SC']">
            {{ scenario.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApplicationScenario } from '../composables/useHomepageData'

defineOptions({ name: 'ApplicationScenariosSection' })

interface Props {
  scenarios: ApplicationScenario[]
}

defineProps<Props>()
</script>
