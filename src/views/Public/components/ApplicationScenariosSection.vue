<template>
  <section class="py-60px bg-white">
    <div class="max-w-1160px mx-auto">
      <div class="text-center mb-73px">
        <h2 class="mb-16px font-['PingFang_SC'] font-medium text-[32px] leading-normal text-black/85">应用场景</h2>
      </div>

      <div class="grid grid-cols-2 gap-x-220px gap-y-60px">
        <div v-for="scenario in scenarios" :key="scenario.id" class="flex flex-col w-[470px]">
           <div class="font-['Alibaba_PuHuiTi_2.0'] font-black text-[60px] text-[#1677FF] opacity-15">
              {{ scenario.id }}
            </div>

          <h3 class="font-['PingFang_SC'] font-medium text-[22px] leading-normal text-gray-900/85 mt-[-34px]">{{ scenario.title }}</h3>

          <p class="mt-24px font-['PingFang_SC'] font-normal text-[14px] leading-[26px] text-black/65">
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
