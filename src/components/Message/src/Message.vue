<script lang="ts" setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  useIntervalFn,
  useDebounceFn,
  useLocalStorage,
  useBreakpoints,
  breakpointsTailwind
} from '@vueuse/core'
import { formatDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
import { useUserStoreWithOut } from '@/store/modules/user'

defineOptions({ name: 'Message' })

// ================== 路由和状态管理 ==================
const { push } = useRouter()
const userStore = useUserStoreWithOut()

// ================== 响应式数据 ==================
const activeName = ref('notice')
const unreadCount = ref(0)
const list = ref<any[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// ================== 响应式断点 ==================
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
const isTablet = breakpoints.between('sm', 'lg')

// ================== 用户偏好 ==================
const userPreferences = useLocalStorage('message-preferences', {
  autoRefresh: true,
  refreshInterval: 2 * 60 * 1000, // 2分钟
  showLoadingIndicator: true,
  maxMessages: 50
})

// ================== 计算属性 ==================
const isUserLoggedIn = computed(() => userStore.getIsSetUser)
const hasUnreadMessages = computed(() => unreadCount.value > 0)
const hasMessages = computed(() => list.value.length > 0)
const popoverWidth = computed(() => {
  if (isMobile.value) return 320
  if (isTablet.value) return 360
  return 400
})

// ================== 消息列表获取 ==================
const getList = async () => {
  if (!isUserLoggedIn.value) {
    list.value = []
    unreadCount.value = 0
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const messages = await NotifyMessageApi.getUnreadNotifyMessageList()
    list.value = messages.slice(0, userPreferences.value.maxMessages)
    // 强制设置 unreadCount 为 0，避免小红点因为轮询太慢，不消除
    unreadCount.value = 0
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取消息列表失败'
    console.error('[Message] 获取消息列表失败:', err)
  } finally {
    isLoading.value = false
  }
}

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
const debouncedGetList = useDebounceFn(getList, 300)
const debouncedGetUnreadCount = useDebounceFn(getUnreadCount, 500)

// ================== 导航 ==================
const goMyList = () => {
  push({ name: 'MyNotifyMessage' })
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
    <ElPopover :width="popoverWidth" placement="bottom" trigger="click" :disabled="!isUserLoggedIn">
      <template #reference>
        <ElBadge :is-dot="hasUnreadMessages">
          <Icon
            :size="18"
            class="cursor-pointer transition-colors hover:text-blue-500"
            icon="ep:bell"
            @click="debouncedGetList"
          />
        </ElBadge>
      </template>

      <ElTabs v-model="activeName" class="w-full">
        <ElTabPane label="我的站内信" name="notice">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex items-center justify-center h-200px">
            <ElLoading />
          </div>

          <!-- 错误状态 -->
          <div
            v-else-if="error"
            class="flex flex-col items-center justify-center h-200px text-center p-20px"
          >
            <Icon icon="ep:warning" class="text-48px text-red-500 mb-16px" />
            <p class="text-14px text-gray-600 mb-16px">{{ error }}</p>
            <ElButton size="small" @click="debouncedGetList">重试</ElButton>
          </div>

          <!-- 空状态 -->
          <div
            v-else-if="!hasMessages"
            class="flex flex-col items-center justify-center h-200px text-center p-20px"
          >
            <Icon icon="ep:chat-dot-square" class="text-48px text-gray-400 mb-16px" />
            <p class="text-14px text-gray-600">暂无消息</p>
          </div>

          <!-- 消息列表 -->
          <el-scrollbar
            v-else
            class="flex flex-col"
            :style="{ height: isMobile ? '300px' : '400px' }"
          >
            <template v-for="item in list" :key="item.id">
              <div
                class="flex items-center py-20px border-b border-[var(--el-border-color-light)] last:border-none hover:bg-gray-50 transition-colors"
              >
                <img
                  alt="用户头像"
                  class="w-40px h-40px rounded-full mx-5px ml-5px mr-20px object-cover"
                  src="@/assets/imgs/avatar.gif"
                />
                <div class="flex flex-col flex-1 min-w-0">
                  <span class="mb-5px text-14px leading-1.4 break-words">
                    <span class="font-medium text-gray-800">{{ item.templateNickname }}</span
                    >：
                    <span class="text-gray-700">{{ item.templateContent }}</span>
                  </span>
                  <span class="text-12px text-[var(--el-text-color-secondary)]">
                    {{ formatDate(item.createTime) }}
                  </span>
                </div>
              </div>
            </template>
          </el-scrollbar>
        </ElTabPane>
      </ElTabs>

      <!-- 底部操作 -->
      <div class="mt-10px text-right border-t border-[var(--el-border-color-light)] pt-10px">
        <XButton preIcon="ep:view" title="查看全部" type="primary" size="small" @click="goMyList" />
      </div>
    </ElPopover>
  </div>
</template>
