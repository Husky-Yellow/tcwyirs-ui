<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <FeedbackSearchForm v-model="queryParams" @query="handleQuery" @reset="resetQuery" />
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px font-bold text-16px">反馈列表</div>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="反馈名称" prop="title" min-width="150">
        <template #default="scope">
          <el-link type="primary" @click="handleDetail(scope.row)">
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
     
      <el-table-column label="资源名称" prop="resourceName" min-width="150" >
        <template #default="scope">
          <span class="text-[#409EFF]">
            {{ scope.row.resourceName }}
           </span>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" prop="content" min-width="200" show-overflow-tooltip />
      <el-table-column label="反馈状态" prop="status" width="120">
        <template #default="scope">
          <div class="flex items-center">
            <span
              class="inline-block w-6px h-6px rounded-full mr-5px"
              :class="getStatusDotClass(scope.row.status)"
            />
            <span :class="getStatusTextClass(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="反馈时间" prop="createTime" width="180" sortable />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-link type="primary" @click="handleDetail(scope.row)">详情</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 反馈详情抽屉 -->
  <FeedbackDetail
    v-model="detailVisible"
    :data="detailData"
    @confirm="handleDetailConfirm"
    @cancel="handleDetailCancel"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FeedbackSearchForm from '../components/FeedbackSearchForm.vue'
import { useFeedbackStatus } from '../composables/useFeedbackStatus'
import { FeedbackDetail } from '../components/FeedbackDetail'
import * as FeedbackApi from '@/api/other/feedback'
import type { FeedbackVO, FeedbackQueryParams } from '../types'
import type { FeedbackDetail as FeedbackDetailType } from '../components/FeedbackDetail'
import { FeedbackQueryType } from '../types'

defineOptions({ name: 'SubmittedFeedback' })

const { getStatusDotClass, getStatusTextClass, getStatusText } = useFeedbackStatus()

const loading = ref(true)
const total = ref(0)
const list = ref<FeedbackVO[]>([])
const queryParams = reactive<FeedbackQueryParams>({
  pageNo: 1,
  pageSize: 10,
  queryType: FeedbackQueryType.SUBMITTED, // 我发起的反馈
  title: undefined,
  type: undefined,
  status: undefined
})

// 详情抽屉状态
const detailVisible = ref(false)
const detailData = ref<FeedbackDetailType>({
  id: '',
  status: 'pending',
  type: '',
  resource: '',
  time: '',
  description: '',
  replies: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FeedbackApi.getSubmittedFeedbackPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    ElMessage.error('获取反馈列表失败')
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.title = undefined
  queryParams.type = undefined
  queryParams.status = undefined
  handleQuery()
}

/** 查看详情 */
const handleDetail = async (row: FeedbackVO) => {
  try {
    // 先设置基本数据
    detailData.value = {
      id: row.id,
      status: convertStatus(row.status),
      type: row.type?.toString() || '',
      resource: row.category || '未知资源',
      time: row.createTime,
      description: row.description,
      screenshot: undefined,
      replies: []
    }

    // 加载对话详情（回复列表）
    const conversation = await FeedbackApi.getFeedbackConversation(row.id)
    if (conversation && Array.isArray(conversation)) {
      detailData.value.replies = conversation
    }

    detailVisible.value = true
  } catch (error) {
    console.error('加载对话详情失败:', error)
    // 即使加载失败也显示基本信息
    detailVisible.value = true
  }
}

/** 转换状态值 */
const convertStatus = (status: number): 'pending' | 'resolved' | 'unresolved' => {
  switch (status) {
    case 1:
      return 'pending' // 待处理
    case 2:
      return 'unresolved' // 处理中 -> 未解决
    case 3:
      return 'resolved' // 已处理 -> 已解决
    default:
      return 'pending'
  }
}

/** 详情确认 */
const handleDetailConfirm = (feedbackWay?: string, reply?: string) => {
  console.log('反馈方式:', feedbackWay)
  console.log('回复内容:', reply)
  // TODO: 调用回复接口
  ElMessage.success('回复成功')
  detailVisible.value = false
}

/** 详情取消 */
const handleDetailCancel = () => {
  detailVisible.value = false
}

onMounted(() => {
  getList()
})
</script>
