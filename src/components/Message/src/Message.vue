<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
import { useUserStoreWithOut } from '@/store/modules/user'

defineOptions({ name: 'Message' })

const { push } = useRouter()
const userStore = useUserStoreWithOut()
const activeName = ref('notice')
const unreadCount = ref(0) // 未读消息数量
const list = ref<any[]>([]) // 消息列表

// 获得消息列表
const getList = async () => {
  // 检查用户是否已登录
  if (!userStore.getIsSetUser) {
    list.value = []
    unreadCount.value = 0
    return
  }

  list.value = await NotifyMessageApi.getUnreadNotifyMessageList()
  // 强制设置 unreadCount 为 0，避免小红点因为轮询太慢，不消除
  unreadCount.value = 0
}

// 获得未读消息数
const getUnreadCount = async () => {
  // 检查用户是否已登录
  if (!userStore.getIsSetUser) {
    unreadCount.value = 0
    return
  }

  NotifyMessageApi.getUnreadNotifyMessageCount().then((data) => {
    unreadCount.value = data
  })
}

// 跳转我的站内信
const goMyList = () => {
  push({
    name: 'MyNotifyMessage'
  })
}

// ========== 初始化 =========
onMounted(() => {
  // 首次加载小红点 - 只有在用户已登录时才调用
  if (userStore.getIsSetUser) {
    getUnreadCount()
  }
  // 轮询刷新小红点
  setInterval(
    () => {
      if (userStore.getIsSetUser) {
        getUnreadCount()
      } else {
        unreadCount.value = 0
      }
    },
    1000 * 60 * 2
  )
})
</script>
<template>
  <div class="message">
    <ElPopover :width="400" placement="bottom" trigger="click">
      <template #reference>
        <ElBadge :is-dot="unreadCount > 0">
          <Icon :size="18" class="cursor-pointer" icon="ep:bell" @click="getList" />
        </ElBadge>
      </template>
      <ElTabs v-model="activeName">
        <ElTabPane label="我的站内信" name="notice">
          <el-scrollbar class="flex flex-col h-400px">
            <template v-for="item in list" :key="item.id">
              <div class="flex items-center py-20px border-b border-[var(--el-border-color-light)] last:border-none">
                <img alt="" class="w-40px h-40px mx-5px ml-5px mr-20px" src="@/assets/imgs/avatar.gif" />
                <div class="flex flex-col">
                  <span class="mb-5px">
                    {{ item.templateNickname }}：{{ item.templateContent }}
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
      <!-- 更多 -->
      <div class="mt-10px text-right">
        <XButton preIcon="ep:view" title="查看全部" type="primary" @click="goMyList" />
      </div>
    </ElPopover>
  </div>
</template>
