<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="flex items-center justify-between bg-[#ffffff99] px-20px py-11px shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
        <span class="text-16px text-[#303133] font-500">消息</span>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]">全部</span>
      </div>
    </template>

    <ul class="list-none px-18px pb-18px pt-16px space-y-8px">
      <li
        v-for="(item, index) in messages"
        :key="index"
        class="cursor-pointer bg-white"
      >
        <div class="flex items-center justify-between text-14px text-[#606266] hover:text-[#409eff]">
          <div>
            <span>{{ item.type }}</span>
            <span>{{ item.content }}</span>
          </div>
          <div class="font-pf-sc text-left text-14px text-[#141414]/26 font-normal leading-22px tracking-0">{{ item.time }}</div>
        </div>
      </li>
    </ul>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'

defineOptions({ name: 'MessagesWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '消息',
  showViewAll: true
})

// TODO: 从 API 获取消息数据
const messages = ref<Array<{ id: number; type: string; content: string; time: string }>>([])
</script>
