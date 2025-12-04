<template>
  <div
    class="resource-share-card h-272px w-274px cursor-pointer overflow-hidden rounded-8px bg-white transition-all duration-300 hover:translate-y--4px hover:shadow-lg"
    @click="$emit('click', resource)"
  >
    <div class="h-146px w-full overflow-hidden">
      <img
        src="https://ts1.tc.mm.bing.net/th?id=OADD2.1234751583547257_1PVN4UXBJX2O895&pid=21.2&c=17&roil=0.0262&roit=0.1762&roir=0.9637&roib=0.6662&w=300&h=157&dynsize=1&qlt=90&dpr=2.00"
        :alt="resource.title"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="px-16px py-18px">
      <div class="mb-8px flex items-center gap-8px">
        <span class="h-[22px] w-[62px] flex items-center justify-center rounded-[2px] bg-[#F0F7FF] text-[12px] text-gray-600 font-normal">
          {{ resource.category }}
        </span>
      </div>

      <div class="mb-8px flex items-center justify-between">
        <h3 class="mr-8px flex-1 truncate text-16px text-#1f2937 font-600">
          {{ resource.title }}
        </h3>
        <span class="cursor-pointer whitespace-nowrap text-13px text-#3b82f6 transition-colors hover:text-#2563eb">
          详情
        </span>
      </div>

      <p class="truncate text-13px text-#6b7280">
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
