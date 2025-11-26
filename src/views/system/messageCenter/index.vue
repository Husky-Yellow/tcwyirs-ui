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
        <div v-if="filteredMessages.length > 0">
          <div
            v-for="message in paginatedMessages"
            :key="message.id"
            class="flex items-center border-0 border-b-1 border-[#0000000f] border-solid py-16px"
          >
            <!-- 消息状态标签 -->
            <div class="mr-16px flex">
              <el-tag v-if="message.isRead" type="info" size="small">已读</el-tag>
              <el-tag v-else type="primary" size="small">未读</el-tag>
            </div>

            <!-- 消息内容 -->
            <div class="flex-1 text-14px text-[#606266] [&_span]:font-500" v-html="message.content"></div>

            <!-- 时间和操作 -->
            <div class="flex flex-shrink-0 items-center gap-24px">
              <span class="whitespace-nowrap text-14px text-[#909399]">{{ message.createTime }}</span>
              <div class="flex gap-8px">
                <el-button v-if="message.isRead" link type="primary" @click="viewDetail(message)">
                  详情
                </el-button>
                <el-button link type="primary" @click="deleteMessage(message)">删除</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex items-center justify-center py-100px">
          <el-empty description="暂无消息" />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredMessages.length > 0" class="flex justify-end px-24px pb-24px">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredMessages.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next, sizes"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'MessageCenter' })

const router = useRouter()

interface Message {
  id: number
  content: string
  createTime: string
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

// 消息列表
const messageList = ref<Message[]>([
  {
    id: 1,
    content: '你已经被客服邀成功添加至【天宫项目】，成为项目组的一员。',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 2,
    content: '你已被从【天宫项目】项目中移除',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 3,
    content:
      '你所使用的数据资源【<span style="color: #409eff;">停车缴费记录</span>】已经到期，如果您需要继续使用该资源，需要点击左侧资源名称进入详情点击"重新申请"。',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 4,
    content:
      '你所使用的数据资源【<span style="color: #409eff;">停车缴费记录</span>】剩余30天即将到期，如果您需要继续使用该资源，需要点击左侧资源名称进入详情点击"延期申请"。',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 5,
    content: '你所使用的数据资源【停车缴费记录】已经被下架，下架原因是"资源更新"。',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 6,
    content: '你所使用的数据资源【停车缴费记录】已经被停用，停用原因是"这是一条被停用的原因"。',
    createTime: '2025-09-22 15:15',
    isRead: false
  },
  {
    id: 7,
    content:
      '你申请的数据资源【<span style="color: #67c23a;">停车缴费记录</span>】已发起申请，审批人利行缘，预计1~3个工作日审批成功。',
    createTime: '2025-09-22 15:15',
    isRead: true
  },
  {
    id: 8,
    content:
      '你申请的数据资源【停车缴费记录】<span style="color: #67c23a;">审批已通过</span>，审批人利行缘，你可以开始使用资源了～',
    createTime: '2025-09-22 15:15',
    isRead: true
  },
  {
    id: 9,
    content:
      '你申请的数据资源【停车缴费记录】<span style="color: #f56c6c;">审批未通过</span>，审批人利行缘，未通过原因是："这是一条未通过的原因"。',
    createTime: '2025-09-22 15:15',
    isRead: true
  },
  {
    id: 10,
    content:
      '你申请的数据资源【停车缴费记录】审批未通过，审批人利行缘，未通过原因是："这是一条未通过的超长原因，这是一条未通过的超长原因。"。',
    createTime: '2025-09-22 15:15',
    isRead: true
  }
])

// 过滤后的消息列表
const filteredMessages = computed(() => {
  let list = messageList.value

  // 按标签页筛选
  if (activeTab.value === 'unread') {
    list = list.filter((msg) => !msg.isRead)
  } else if (activeTab.value === 'read') {
    list = list.filter((msg) => msg.isRead)
  }

  // 按关键字搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter((msg) => {
      const plainContent = msg.content.replace(/<[^>]*>/g, '')
      return plainContent.toLowerCase().includes(keyword)
    })
  }

  return list
})

// 分页后的消息列表
const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMessages.value.slice(start, end)
})

// 标签页切换
const handleTabChange = () => {
  currentPage.value = 1
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 页码变化
const handlePageChange = () => {
  // 页码已经通过 v-model 自动更新
}

// 每页条数变化
const handleSizeChange = () => {
  currentPage.value = 1
}

// 查看详情
const viewDetail = (message: Message) => {
  ElMessageBox.alert(message.content, '消息详情', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定'
  })
}

// 删除消息
const deleteMessage = (message: Message) => {
  ElMessageBox.confirm('确定删除这条消息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = messageList.value.findIndex((msg) => msg.id === message.id)
      if (index !== -1) {
        messageList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 返回
const goBack = () => {
  router.back()
}
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
