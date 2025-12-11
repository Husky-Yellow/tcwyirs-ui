<template>
  <!-- 项目成员：左侧顶部卡片 -->
  <AppCard class="mt-16px p-24px" v-loading="loading">
    <!-- 反馈意见 -->
    <div class="">
      <!-- 标题栏 -->
      <div class="mb-16px flex items-center justify-between">
        <span class="text-16px text-[#303133] font-500">反馈意见</span>
        <span
          class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]"
          @click="handleViewAll"
        >
          全部
        </span>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 mb-14px gap-12px">
        <StatCard label="待处理" :value="statistics.recentCount || 0" />
        <StatCard label="已处理" :value="statistics.processingCount || 0" />
      </div>
    </div>

    <!-- 分隔线 -->

    <!-- 我发起的反馈 -->
    <div class="mt-24px">

      <!-- 反馈列表 -->
      <ul v-if="feedbackList.length > 0" class="space-y-8px">
        <li
          v-for="item in feedbackList"
          :key="item.id"
          class="flex cursor-pointer items-center justify-between border border-[0.5px] border-black/8 rounded-[8px] border-inset bg-white px-17px py-13px transition-shadow hover:shadow-sm"
          @click="handleViewDetail(item)"
        >
          <div class="flex-1 truncate text-14px text-[#606266]">{{ item.content }}</div>
          <div class="ml-8px flex items-center gap-6px">
            <span class="h-6px w-6px rounded-full" :class="getStatusDotClass(item.status)"></span>
            <span class="whitespace-nowrap text-14px" :class="getStatusTextClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
          </div>
        </li>
      </ul>
      <el-empty v-else description="暂无反馈记录" :image-size="80" />
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'
import {
  getFeedbackStatistics,
  getMyFeedbackPage,
  type FeedbackStatisticsVO,
  type FeedbackVO
} from '@/api/resource/feedback'

defineOptions({ name: 'FeedbackWidget' })

const router = useRouter()

// 加载状态
const loading = ref(false)

// 统计数据
const statistics = ref<FeedbackStatisticsVO>({
  recentCount: 0,
  processingCount: 0,
  handledCount: 0,
  totalCount: 0
})

// 反馈列表
const feedbackList = ref<FeedbackVO[]>([])

// 加载统计数据
const loadStatistics = async () => {
  try {
    statistics.value = await getFeedbackStatistics()
  } catch (error) {
    console.error('加载反馈统计失败:', error)
  }
}

// 加载反馈列表（只显示前3条）
const loadFeedbackList = async () => {
  try {
    const res = await getMyFeedbackPage({
      pageNo: 1,
      pageSize: 3
    })
    feedbackList.value = res.list || []
    statistics.value.totalCount = res.total

  } catch (error) {
    console.error('加载反馈列表失败:', error)
    feedbackList.value = []
  }
}

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    await Promise.all([loadStatistics(), loadFeedbackList()])
  } finally {
    loading.value = false
  }
}

// 获取状态圆点的样式类
const getStatusDotClass = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: 'bg-[#409EFF]', // 蓝色 - 待处理
    1: 'bg-[#E6A23C]', // 橙色 - 处理中
    2: 'bg-[#67C23A]', // 绿色 - 已解决
    3: 'bg-[#909399]' // 灰色 - 已关闭
  }
  return status !== undefined ? statusMap[status] || 'bg-[#909399]' : 'bg-[#909399]'
}

// 获取状态文字的样式类
const getStatusTextClass = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: 'text-[#409EFF]', // 蓝色
    1: 'text-[#E6A23C]', // 橙色
    2: 'text-[#67C23A]', // 绿色
    3: 'text-[#909399]' // 灰色
  }
  return status !== undefined ? statusMap[status] || 'text-[#909399]' : 'text-[#909399]'
}

// 获取状态文字
const getStatusText = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: '待处理',
    1: '处理中',
    2: '已解决',
    3: '已关闭'
  }
  return status !== undefined ? statusMap[status] || '未知' : '未知'
}

// 查看全部
const handleViewAll = () => {
  router.push('/other/feedback/submitted')
}

// 查看详情
const handleViewDetail = (item: FeedbackVO) => {
  // TODO: 跳转到反馈详情页面
  console.log('查看反馈详情:', item)
}

onMounted(() => {
  initData()
})
</script>
