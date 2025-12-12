<template>
  <AppCard class="mt-16px p-24px" v-loading="loading">
    <!-- 我的反馈 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <span class="text-16px text-[#303133] font-500">我的反馈</span>
        <span
          class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]"
          @click="handleViewAllFeedback"
        >
          全部
        </span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 mb-14px gap-12px">
        <StatCard label="待处理" :value="feedbackStats.pendingCount || 0" />
        <StatCard label="已处理" :value="feedbackStats.processedCount || 0" />
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="my-24px border-t border-[#DCDFE6]"></div>

    <!-- 我发起的审批 -->
    <div>
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <span class="text-16px text-[#303133] font-500">我发起的审批</span>
        <span
          class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]"
          @click="handleViewAllApprovals"
        >
          全部
        </span>
      </div>

      <!-- 审批列表 -->
      <ul v-if="approvalList.length > 0" class="space-y-8px">
        <li
          v-for="item in approvalList"
          :key="item.id"
          class="flex cursor-pointer items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px transition-shadow hover:shadow-sm"
          @click="handleViewDetail(item)"
        >
          <div class="flex-1 truncate text-14px text-[#606266]">{{ item.title }}</div>
          <div class="ml-8px flex items-center gap-6px">
            <span class="h-6px w-6px rounded-full" :class="getStatusDotClass(item.status)"></span>
            <span class="whitespace-nowrap text-14px" :class="getStatusTextClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
          </div>
        </li>
      </ul>
      <el-empty v-else description="暂无审批记录" :image-size="80" />
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'

defineOptions({ name: 'ApprovalWidget' })

const router = useRouter()

// 加载状态
const loading = ref(false)

// 反馈统计数据
interface FeedbackStatistics {
  pendingCount: number
  processedCount: number
}

const feedbackStats = ref<FeedbackStatistics>({
  pendingCount: 0,
  processedCount: 0
})

// 审批列表项
interface ApprovalItem {
  id: string | number
  title: string
  status: number
  createTime?: string
}

// 审批列表
const approvalList = ref<ApprovalItem[]>([])

// 加载反馈统计数据
const loadFeedbackStats = async () => {
  try {
    // TODO: 调用实际的 API
    // const res = await getFeedbackStatistics()
    // feedbackStats.value = res

    // 模拟数据
    feedbackStats.value = {
      pendingCount: 5,
      processedCount: 15
    }
  } catch (error) {
    console.error('加载反馈统计失败:', error)
  }
}

// 加载审批列表
const loadApprovalList = async () => {
  try {
    // TODO: 调用实际的 API
    // const res = await getMyApprovalPage({
    //   pageNo: 1,
    //   pageSize: 3
    // })
    // approvalList.value = res.list || []

    // 模拟数据
    approvalList.value = [
      { id: 1, title: '资源申请审批', status: 0, createTime: '2024-01-15' },
      { id: 2, title: '项目立项审批', status: 1, createTime: '2024-01-14' },
      { id: 3, title: '预算申请审批', status: 2, createTime: '2024-01-13' }
    ]
  } catch (error) {
    console.error('加载审批列表失败:', error)
    approvalList.value = []
  }
}

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    await Promise.all([loadFeedbackStats(), loadApprovalList()])
  } finally {
    loading.value = false
  }
}

// 获取状态圆点的样式类
const getStatusDotClass = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: 'bg-[#409EFF]', // 蓝色 - 待处理
    1: 'bg-[#E6A23C]', // 橙色 - 审批中
    2: 'bg-[#67C23A]', // 绿色 - 已通过
    3: 'bg-[#F56C6C]' // 红色 - 已拒绝
  }
  return status !== undefined ? statusMap[status] || 'bg-[#909399]' : 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: 'text-[#409EFF]', // 蓝色
    1: 'text-[#E6A23C]', // 橙色
    2: 'text-[#67C23A]', // 绿色
    3: 'text-[#F56C6C]' // 红色
  }
  return status !== undefined ? statusMap[status] || 'text-[#909399]' : 'text-[#909399]'
}

// 获取状态文字
const getStatusText = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: '待处理',
    1: '审批中',
    2: '已通过',
    3: '已拒绝'
  }
  return status !== undefined ? statusMap[status] || '未知' : '未知'
}

// 查看全部反馈
const handleViewAllFeedback = () => {
  router.push('/other/feedback/submitted')
}

// 查看全部审批
const handleViewAllApprovals = () => {
  router.push('/other/approval-center/initiated')
}

// 查看详情
const handleViewDetail = (item: ApprovalItem) => {
  // TODO: 跳转到审批详情页面
  console.log('查看审批详情:', item)
}

onMounted(() => {
  initData()
})
</script>
