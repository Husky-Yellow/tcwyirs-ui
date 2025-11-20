<template>
  <section class="py-60px bg-[#F8F9FC]">
    <div class="max-w-1160px mx-auto">
      <div class="text-center mb-49px">
        <h2 class="font-['PingFang_SC'] font-medium text-[32px] sm:text-[36px] md:text-[40px] leading-normal text-center text-black/85">优质资源共享</h2>
      </div>

      <div class="grid grid-cols-4 gap-16px">
        <QualityResourceCard
          v-for="resource in resources"
          :key="resource.id"
          :resource="resource"
          @click="$emit('resource-click', $event)"
        />
      </div>

      <div class="text-right mt-22px">
        <span
          class="text-14px text-#3b82f6 cursor-pointer hover:text-#2563eb transition-colors"
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
