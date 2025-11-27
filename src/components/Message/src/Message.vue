<script lang="ts" setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIntervalFn, useDebounceFn, useLocalStorage } from '@vueuse/core'
import * as NotifyMessageApi from '@/api/system/notify/message'
import { useUserStoreWithOut } from '@/store/modules/user'

defineOptions({ name: 'Message' })

// ================== 路由和状态管理 ==================
const { push } = useRouter()
const userStore = useUserStoreWithOut()

// ================== 响应式数据 ==================
const unreadCount = ref(0)

// ================== 用户偏好 ==================
const userPreferences = useLocalStorage('message-preferences', {
  autoRefresh: true,
  refreshInterval: 2 * 60 * 1000 // 2分钟
})

// ================== 计算属性 ==================
const isUserLoggedIn = computed(() => userStore.getIsSetUser)
const hasUnreadMessages = computed(() => unreadCount.value > 0)

// ================== 未读消息数获取 ==================
const getUnreadCount = async () => {
  if (!isUserLoggedIn.value) {
    unreadCount.value = 0
    return
  }

  try {
    const count = await NotifyMessageApi.getUnreadNotifyMessageCount()
    unreadCount.value = count
  } catch (err) {
    console.error('[Message] 获取未读消息数失败:', err)
  }
}

// ================== 防抖处理 ==================
const debouncedGetUnreadCount = useDebounceFn(getUnreadCount, 500)

// ================== 导航 ==================
const goMyList = () => {
  push('/workbench/message-center')
}

// ================== 轮询管理 ==================
const { pause: pausePolling, resume: resumePolling } = useIntervalFn(
  () => {
    if (isUserLoggedIn.value) {
      debouncedGetUnreadCount()
    } else {
      unreadCount.value = 0
    }
  },
  userPreferences.value.refreshInterval,
  { immediate: false }
)

// ================== 监听器 ==================
watchEffect(() => {
  if (isUserLoggedIn.value && userPreferences.value.autoRefresh) {
    resumePolling()
  } else {
    pausePolling()
  }
})

// ================== 生命周期 ==================
onMounted(() => {
  if (isUserLoggedIn.value) {
    debouncedGetUnreadCount()
  }

  if (userPreferences.value.autoRefresh) {
    resumePolling()
  }
})

onUnmounted(() => {
  pausePolling()
})
</script>
<template>
  <div class="message">
    <ElBadge :is-dot="hasUnreadMessages">
      <Icon
        :size="18"
        class="cursor-pointer transition-colors"
        icon="ep:bell"
        @click="goMyList"
      />
    </ElBadge>
  </div>
</template>
