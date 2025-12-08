<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <FeedbackSearchForm v-model="queryParams" @query="handleQuery" @reset="resetQuery" />
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px font-bold text-16px">反馈列表</div>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="反馈问题" prop="title" min-width="120" />
      <el-table-column label="反馈类别" prop="category" width="120">
        <template #default="scope">
          <el-link type="primary">{{ scope.row.category || '帮车服务端反' }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="问题描述" prop="description" min-width="150" show-overflow-tooltip />
      <el-table-column label="反馈人" prop="submitter" width="100" />
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
          <el-link type="primary" @click="handleDetail(scope.row.id)">详情</el-link>
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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FeedbackSearchForm from '../components/FeedbackSearchForm.vue'
import { useFeedbackStatus } from '../composables/useFeedbackStatus'
import * as FeedbackApi from '@/api/other/feedback'
import type { FeedbackVO, FeedbackQueryParams } from '../types'

defineOptions({ name: 'HandledFeedback' })

const { getStatusDotClass, getStatusTextClass, getStatusText } = useFeedbackStatus()

const loading = ref(true)
const total = ref(0)
const list = ref<FeedbackVO[]>([])
const queryParams = reactive<FeedbackQueryParams>({
  pageNo: 1,
  pageSize: 10,
  title: undefined,
  type: undefined,
  status: undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FeedbackApi.getHandledFeedbackPage(queryParams)
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
const handleDetail = (id: number | string) => {
  // TODO: 实现详情弹窗或跳转
  console.log('查看详情:', id)
  ElMessage.info('详情功能待实现')
}

onMounted(() => {
  getList()
})
</script>
