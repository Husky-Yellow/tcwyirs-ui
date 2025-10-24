<template>
  <section class="py-80px bg-[#F8F9FC]">
    <div class="max-w-1200px mx-auto px-20px">
      <div class="text-center mb-60px">
        <h2 class="text-36px font-700 text-#1f2937 mb-16px">优质资源共享</h2>
      </div>

      <div class="grid grid-cols-4 gap-16px">
        <QualityResourceCard
          v-for="resource in resources"
          :key="resource.id"
          :resource="resource"
          @click="$emit('resource-click', $event)"
        />
      </div>

      <div class="text-center mt-40px">
        <span
          class="text-14px text-#3b82f6 cursor-pointer hover:text-#2563eb transition-colors"
          @click="$emit('more-click')"
        >
          更多资源 →
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
