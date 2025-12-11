<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="flex items-center justify-between bg-[#ffffff99] px-20px py-11px shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
        <span class="text-16px text-[#303133] font-500">消息</span>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]" @click="handleViewAll">全部</span>
      </div>
    </template>

    <div v-loading="loading" class="min-h-120px">
      <ul v-if="messages.length > 0" class="list-none px-18px pb-18px pt-16px space-y-8px">
        <li
          v-for="item in messages"
          :key="item.id"
          class="cursor-pointer bg-white"
        >
          <div class="flex items-center justify-between gap-16px text-14px text-[#606266] hover:text-[#409eff]">
            <div class="flex-1 min-w-0 truncate">
              <span class="font-500">{{ item.type }}：</span>
              <span>{{ item.content }}</span>
            </div>
            <div class="flex-shrink-0 whitespace-nowrap font-pf-sc text-14px text-[#141414]/26 font-normal leading-22px">
              {{ item.time }}
            </div>
          </div>
        </li>
      </ul>
      <ElEmpty v-else-if="!loading" description="暂无消息" :image-size="80" />
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import * as NotifyMessageApi from '@/api/system/notify/message'
import type { NotifyMessageVO } from '@/api/system/notify/message'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'MessagesWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
  maxCount?: number
}

withDefaults(defineProps<Props>(), {
  title: '消息',
  showViewAll: true,
  maxCount: 5
})

interface MessageItem {
  id: number
  type: string
  content: string
  time: string
}

const router = useRouter()
const messages = ref<MessageItem[]>([])
const loading = ref(false)

// 获取消息数据
const fetchMessages = async () => {
  loading.value = true
  try {
    const res = await NotifyMessageApi.getMyNotifyMessagePage({
      pageNo: 1,
      pageSize: 5
    })

    // 转换数据格式
    messages.value = res.list.map((item: NotifyMessageVO) => ({
      id: item.id,
      type: item.templateNickname || '系统消息',
      content: item.templateContent,
      time: formatDate(item.createTime)
    }))
  } catch (error) {
    console.error('[MessagesWidget] 获取消息失败:', error)
    messages.value = []
  } finally {
    loading.value = false
  }
}

// 跳转到消息中心页面
const handleViewAll = () => {
  router.push({ name: 'MessageCenter' })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchMessages()
})
</script>
