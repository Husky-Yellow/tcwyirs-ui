<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="资源名称:" prop="resourceName">
        <el-input
          v-model="queryParams.resourceName"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="资源类型:" prop="resourceType">
        <el-select v-model="queryParams.resourceType" placeholder="全部" clearable class="!w-240px">
          <el-option label="数据资源" :value="1" />
          <el-option label="应用资源" :value="2" />
          <el-option label="组件资源" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态:" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-240px">
          <el-option label="申请中" :value="0" />
          <el-option label="申请成功" :value="1" />
          <el-option label="申请失败" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetQuery">重 置</el-button>
        <el-button type="primary" @click="handleQuery">查 询</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-16px text-16px font-600">资源列表</div>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="资源类型" align="center" prop="resourceType" width="120">
        <template #default="scope">
          {{ getResourceTypeText(scope.row.resourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="资源名称" align="center" prop="resourceName" min-width="150">
        <template #default="scope">
          <el-link type="primary" :underline="false">{{ scope.row.resourceName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="资源标签" align="center" prop="resourceTag" width="120" />
      <el-table-column label="申请状态" align="center" prop="status" width="120">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <span
              class="inline-block h-8px w-8px rounded-full"
              :class="`bg-${getStatusConfig(scope.row.status).color}`"
            ></span>
            <span class="ml-8px">{{ getStatusConfig(scope.row.status).text }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上架人" align="center" prop="publishUserName" width="100" />
      <el-table-column label="申请时间" align="center" prop="applyTime" width="200" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.applyTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
          <el-divider direction="vertical" />
          <el-link type="primary" :underline="false" @click="handleFeedback(scope.row)"
            >反馈</el-link
          >
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

  <!-- 反馈弹窗 -->
  <FeedbackForm
    v-model="feedbackVisible"
    :resource-id="currentFeedbackRow?.resourceId"
    :resource-name="currentFeedbackRow?.resourceName"
    @success="handleFeedbackSuccess"
  />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getPublishApplyPage } from '@/api/resource/publish-apply'
import type { ResourcePublishApplyRespVO } from '@/api/resource/info'
import { formatDate } from '@/utils/formatTime'
import { FeedbackForm } from '@/components/FeedbackForm'

defineOptions({ name: 'ApprovalInitiated' })

const message = useMessage()
const router = useRouter()

const loading = ref(false)
const total = ref(0)
const list = ref<ResourcePublishApplyRespVO[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  resourceName: undefined,
  resourceType: undefined,
  status: undefined
})
const queryFormRef = ref()

// 反馈弹窗相关
const feedbackVisible = ref(false)
const currentFeedbackRow = ref<ResourcePublishApplyRespVO | null>(null)

/** 资源类型映射 */
const resourceTypeMap = {
  1: '数据资源',
  2: '应用资源',
  3: '组件资源'
}

/** 审批状态映射 */
const statusMap = {
  0: { text: '申请中', color: 'blue-500', value: 'pending' },
  1: { text: '申请成功', color: 'green-500', value: 'success' },
  2: { text: '申请失败', color: 'red-500', value: 'failed' }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      resourceName: queryParams.resourceName,
      resourceType: queryParams.resourceType ? Number(queryParams.resourceType) : undefined,
      status: queryParams.status !== undefined ? Number(queryParams.status) : undefined
    }

    const res = await getPublishApplyPage(params)
    list.value = res.list || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取上架申请列表失败:', error)
    message.error('获取列表失败')
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 获取资源类型文本 */
const getResourceTypeText = (type: number) => {
  return resourceTypeMap[type] || '未知类型'
}

/** 获取状态配置 */
const getStatusConfig = (status: number) => {
  return statusMap[status] || { text: '未知', color: 'gray-500', value: 'unknown' }
}

/** 详情操作 */
const handleDetail = (row: ResourcePublishApplyRespVO) => {
  router.push({
    name: 'ApprovalDetail',
    query: {
      status: row.status,
      id: row.id
    }
  })
}

/** 反馈操作 */
const handleFeedback = (row: ResourcePublishApplyRespVO) => {
  currentFeedbackRow.value = row
  feedbackVisible.value = true
}

/** 反馈提交成功 */
const handleFeedbackSuccess = () => {
  message.success('反馈提交成功')
  currentFeedbackRow.value = null
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
