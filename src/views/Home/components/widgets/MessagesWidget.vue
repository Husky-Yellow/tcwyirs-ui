<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="px-20px py-11px">
        {{ title }}
        <el-link v-if="showViewAll" type="primary" :underline="false">全部</el-link>
      </div>
    </template>

    <div class="message-list">
      <div
        v-for="item in messages"
        :key="item.id"
        class="message-item cursor-pointer border-b border-gray-100 py-12px transition-colors last:border-b-0 hover:bg-gray-50"
        @click="handleClick(item)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="text-14px text-gray-600">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'
import { MESSAGES } from '../../mock/data'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'MessagesWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '消息',
  showViewAll: true
})

const messages = ref([...MESSAGES])

const handleClick = (item: any) => {
  ElMessage.info(`查看消息: ${item.type}`)
}
</script>
