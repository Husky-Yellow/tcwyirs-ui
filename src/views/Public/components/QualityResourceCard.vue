<template>
  <div
    class="resource-share-card w-274px h-272px bg-white rounded-8px overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y--4px"
    @click="$emit('click', resource)"
  >
    <div class="relative w-full h-156px bg-gradient-to-br from-#e5e7eb to-#f3f4f6 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="absolute w-120px h-120px rounded-full bg-white/30 blur-20px"></div>
        <div class="absolute w-80px h-80px rounded-full bg-black/5 top-20px right-30px"></div>
      </div>

      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative flex items-center gap-8px">
          <div class="w-60px h-60px rounded-full border-2 border-#cbd5e1 bg-white/80"></div>
          <div class="text-80px font-800 text-#1f2937" style="line-height: 1">A</div>
        </div>
      </div>
    </div>

    <div class="p-16px">
      <div class="flex items-center gap-8px mb-8px">
        <span class="px-8px py-2px bg-#f0f9ff text-#0284c7 text-12px rounded-4px">
          {{ resource.category }}
        </span>
      </div>

      <h3 class="text-16px font-600 text-#1f2937 mb-8px truncate">
        {{ resource.title }}
      </h3>

      <p class="text-13px text-#6b7280 line-clamp-2 mb-8px" style="min-height: 36px">
        {{ resource.description }}
      </p>

      <div class="flex items-center justify-between">
        <span class="text-13px text-#3b82f6 hover:text-#2563eb transition-colors cursor-pointer">
          详情
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QualityResource } from '../composables/useHomepageData'

defineOptions({ name: 'QualityResourceCard' })

interface Props {
  resource: QualityResource
}

defineProps<Props>()
defineEmits<{ click: [resource: QualityResource] }>()
</script>
