<template>
  <div
    class="resource-share-card w-274px h-272px bg-white rounded-8px overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y--4px"
    @click="$emit('click', resource)"
  >
    <div class="w-full h-146px overflow-hidden">
      <img
        src="https://ts1.tc.mm.bing.net/th?id=OADD2.1234751583547257_1PVN4UXBJX2O895&pid=21.2&c=17&roil=0.0262&roit=0.1762&roir=0.9637&roib=0.6662&w=300&h=157&dynsize=1&qlt=90&dpr=2.00"
        :alt="resource.title"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="py-18px px-16px">
      <div class="flex items-center gap-8px mb-8px">
        <span class="w-[62px] h-[22px] flex items-center px-4px rounded-[2px] bg-[#F0F7FF] text-[12px] font-normal text-gray-600">
          {{ resource.category }}
        </span>
      </div>

      <div class="flex items-center justify-between mb-8px">
        <h3 class="text-16px font-600 text-#1f2937 truncate flex-1 mr-8px">
          {{ resource.title }}
        </h3>
        <span class="text-13px text-#3b82f6 hover:text-#2563eb transition-colors cursor-pointer whitespace-nowrap">
          详情
        </span>
      </div>

      <p class="text-13px text-#6b7280 truncate">
        {{ resource.description }}
      </p>
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
