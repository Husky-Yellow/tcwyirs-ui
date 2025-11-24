<template>
  <section class="bg-[#F8F9FC] py-60px">
    <div class="mx-auto max-w-1160px">
      <div class="mb-49px text-center">
        <h2 class="text-center text-[32px] text-black/85 font-medium leading-normal font-['PingFang_SC'] md:text-[40px] sm:text-[36px]">优质资源共享</h2>
      </div>

      <div class="grid grid-cols-4 gap-16px">
        <QualityResourceCard
          v-for="resource in resources"
          :key="resource.id"
          :resource="resource"
          @click="$emit('resource-click', $event)"
        />
      </div>

      <div class="mt-22px text-right">
        <span
          class="cursor-pointer text-14px text-#3b82f6 transition-colors hover:text-#2563eb"
          @click="$emit('more-click')"
        >
          更多资源
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { QualityResource } from '../composables/useHomepageData'
import QualityResourceCard from './QualityResourceCard.vue'

defineOptions({ name: 'QualityResourcesSection' })

interface Props {
  resources: QualityResource[]
}

defineProps<Props>()
defineEmits<{
  'resource-click': [resource: QualityResource]
  'more-click': []
}>()
</script>
