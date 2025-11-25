<template>
  <div class="grid grid-cols-2 gap-12px px-48px pt-24px">
    <div v-for="item in items" :key="item.name" class="flex items-center justify-between">
      <div class="flex items-center">
        <span
          class="mr-2 inline-block h-3 w-3 rounded-full"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="text-sm text-[#606266]">{{ item.name }}</span>
      </div>
      <span class="text-sm text-[#303133] font-semibold">{{ item.value }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface LegendItem {
  name: string
  value: number
  color: string
}

interface Props {
  items: LegendItem[]
}

defineOptions({ name: 'LegendList' })

defineProps<Props>()
</script>
