<template>
  <ContentWrap :body-style="{ padding: '0' }">
    <!-- 页面容器 -->
    <div class="overflow-hidden bg-white">
      <!-- 标签页和搜索 -->
      <div class="border-0 border-b-1 border-[#0000000f] border-solid pb-10px pt-12px">
        <div class="x flex items-center justify-between px-24px">
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="全部消息" name="all" />
            <el-tab-pane label="未读消息" name="unread" />
            <el-tab-pane label="已读消息" name="read" />
          </el-tabs>

          <el-input
            v-model="searchKeyword"
            placeholder="请输入关键字"
            clearable
            class="w-300px!"
            @input="handleSearch"
          >
            <template #suffix>
              <Icon icon="ep:search" class="text-[#909399]" />
            </template>
          </el-input>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="min-h-500px p-24px">
        <div v-if="filteredMessages.length > 0" v-loading="loading">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="flex items-center border-0 border-b-1 border-[#0000000f] border-solid py-16px"
          >
            <!-- 消息状态标签 -->
            <div class="mr-16px flex">
              <el-tag v-if="msg.isRead" type="info" size="small">已读</el-tag>
              <el-tag v-else type="primary" size="small">未读</el-tag>
            </div>

            <!-- 消息内容 -->
            <div class="flex-1 text-14px text-[#606266] [&_span]:font-500" v-html="msg.content"></div>

            <!-- 时间和操作 -->
            <div class="flex flex-shrink-0 items-center gap-24px">
              <span class="whitespace-nowrap text-14px text-[#909399]">{{ msg.createTime }}</span>
              <div class="flex gap-8px">
                <el-button link type="primary" @click="viewDetail(msg)">详情</el-button>
                <el-button link type="primary" @click="deleteMessage(msg)">删除</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="flex items-center justify-center py-100px">
          <el-empty description="暂无消息" />
        </div>

        <!-- 加载中 -->
        <div v-if="loading && filteredMessages.length === 0" class="flex items-center justify-center py-100px">
          <el-icon class="is-loading" :size="40">
            <Loading />
          </el-icon>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="!searchKeyword && total > 0" class="flex justify-end px-24px pb-24px">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next, sizes"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>

      <!-- 搜索时显示过滤结果数量 -->
      <div v-else-if="searchKeyword && filteredMessages.length > 0" class="flex justify-end px-24px pb-24px">
        <span class="text-14px text-[#909399]">共 {{ filteredMessages.length }} 条搜索结果</span>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMyNotifyMessagePage,
  updateNotifyMessageRead,
  updateAllNotifyMessageRead,
  deleteNotifyMessage,
  type NotifyMessageVO
} from '@/api/mq/notify-message'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'MessageCenter' })

const router = useRouter()
const message = useMessage()

interface Message extends NotifyMessageVO {
  content: string
  isRead: boolean
}

// 当前标签页
const activeTab = ref('all')

// 搜索关键字
const searchKeyword = ref('')

// 当前页码
const currentPage = ref(1)

// 每页条数
const pageSize = ref(10)

// 总数
const total = ref(0)

// 加载状态
const loading = ref(false)

// 是否已经调用过全部已读
const hasCalledMarkAllRead = ref(false)

// 消息列表
const messageList = ref<Message[]>([])

/** 查询消息列表 */
const getList = async () => {
  loading.value = true
  try {
    const params: any = {
      pageNo: currentPage.value,
      pageSize: pageSize.value
    }

    // 根据标签页筛选已读状态
    if (activeTab.value === 'unread') {
      params.readStatus = false
    } else if (activeTab.value === 'read') {
      params.readStatus = true
    }

    const { data } = await getMyNotifyMessagePage(params)

    // 转换数据格式
    messageList.value = (data?.list || []).map((item: NotifyMessageVO) => ({
      ...item,
      content: item.templateContent || '',
      isRead: item.readStatus || false,
      createTime: formatDate(item.createTime)
    }))

    total.value = data?.total || 0

    // 首次进入页面且有数据时，自动调用全部已读（只调用一次）
    if (!hasCalledMarkAllRead.value && data?.list && data.list.length > 0) {
      hasCalledMarkAllRead.value = true
      await handleMarkAllRead()
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
    message.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

/** 标记全部已读 */
const handleMarkAllRead = async () => {
  try {
    await updateAllNotifyMessageRead()
    // 静默更新消息状态，不刷新列表
    messageList.value.forEach((msg) => {
      msg.isRead = true
      msg.readStatus = true
    })
  } catch (error) {
    console.error('标记全部已读失败:', error)
  }
}

/** 标记单条已读 */
const markAsRead = async (msg: Message) => {
  if (msg.isRead) return

  try {
    await updateNotifyMessageRead(msg.id)
    msg.isRead = true
    msg.readStatus = true
  } catch (error) {
    console.error('标记已读失败:', error)
    message.error('标记已读失败')
  }
}

// 过滤后的消息列表（搜索）
const filteredMessages = computed(() => {
  let list = messageList.value

  // 按关键字搜索（前端过滤）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter((msg) => {
      const plainContent = msg.content.replace(/<[^>]*>/g, '')
      return plainContent.toLowerCase().includes(keyword)
    })
  }

  return list
})

// 标签页切换
const handleTabChange = () => {
  currentPage.value = 1
  getList()
}

// 搜索（不需要重新加载，使用前端过滤）
const handleSearch = () => {
  // 搜索使用计算属性 filteredMessages 自动过滤
}

// 页码变化
const handlePageChange = () => {
  getList()
}

// 每页条数变化
const handleSizeChange = () => {
  currentPage.value = 1
  getList()
}

// 查看详情
const viewDetail = async (msg: Message) => {
  // 标记为已读
  await markAsRead(msg)

  ElMessageBox.alert(msg.content, '消息详情', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定'
  })
}

// 删除消息
const deleteMessage = (msg: Message) => {
  ElMessageBox.confirm('确定删除这条消息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteNotifyMessage(msg.id)
        message.success('删除成功')
        // 刷新列表
        await getList()
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style>
/* Element Plus Tabs 样式覆盖 */
.el-tabs__nav-wrap::after {
  display: none;
}

.el-tabs__header {
  margin: 0;
}
</style>
