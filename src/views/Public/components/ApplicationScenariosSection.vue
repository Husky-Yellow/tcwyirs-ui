<template>
  <section class="py-80px bg-white">
    <div class="max-w-1200px mx-auto px-20px">
      <div class="text-center mb-60px">
        <h2 class="text-36px font-700 text-#1f2937 mb-16px">应用场景</h2>
      </div>

      <div class="grid grid-cols-2 gap-x-60px gap-y-40px">
        <div v-for="scenario in scenarios" :key="scenario.id" class="flex flex-col gap-20px">
          <div class="flex items-center gap-12px">
            <div class="w-48px h-48px rounded-full bg-#E8F3FF flex items-center justify-center">
              <span class="text-20px font-700 text-#409EFF">{{ scenario.id }}</span>
            </div>
          </div>

          <h3 class="text-18px font-600 text-#1f2937">{{ scenario.title }}</h3>

          <p class="text-14px text-#6b7280">
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
