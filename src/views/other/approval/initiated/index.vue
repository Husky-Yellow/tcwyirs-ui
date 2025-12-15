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
      <!-- 资源类型 -->
      <el-table-column
        v-if="columnConfig.resourceType.show"
        :label="columnConfig.resourceType.label"
        align="center"
        prop="resourceType"
        :width="columnConfig.resourceType.width"
      >
        <template #default="scope">
          {{ getResourceTypeText(scope.row.resourceType) }}
        </template>
      </el-table-column>

      <!-- 资源名称 -->
      <el-table-column
        v-if="columnConfig.resourceName.show"
        :label="columnConfig.resourceName.label"
        align="center"
        prop="resourceName"
        :min-width="columnConfig.resourceName.minWidth"
      >
        <template #default="scope">
          <el-link type="primary" :underline="false">{{ scope.row.resourceName }}</el-link>
        </template>
      </el-table-column>

      <!-- 描述 -->
      <el-table-column
        v-if="columnConfig.description.show"
        :label="columnConfig.description.label"
        align="center"
        prop="description"
        :min-width="columnConfig.description.minWidth"
      />

      <!-- 关联项目 -->
      <el-table-column
        v-if="columnConfig.projectName.show"
        :label="columnConfig.projectName.label"
        align="center"
        prop="projectName"
        :width="columnConfig.projectName.width"
      />

      <!-- 申请状态 -->
      <el-table-column
        v-if="columnConfig.status.show"
        :label="columnConfig.status.label"
        align="center"
        prop="status"
        :width="columnConfig.status.width"
      >
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

      <!-- 申请人 -->
      <el-table-column
        v-if="columnConfig.applicant.show"
        :label="columnConfig.applicant.label"
        align="center"
        prop="applicant"
        :width="columnConfig.applicant.width"
      />

      <!-- 上架人 -->
      <el-table-column
        v-if="columnConfig.publishUserName.show"
        :label="columnConfig.publishUserName.label"
        align="center"
        prop="publishUserName"
        :width="columnConfig.publishUserName.width"
      />

      <!-- 审批人 -->
      <el-table-column
        v-if="columnConfig.approver.show"
        :label="columnConfig.approver.label"
        align="center"
        prop="approver"
        :width="columnConfig.approver.width"
      />

      <!-- 申请周期 -->
      <el-table-column
        v-if="columnConfig.duration.show"
        :label="columnConfig.duration.label"
        align="center"
        prop="duration"
        :width="columnConfig.duration.width"
      >
        <template #default="scope">
          {{ scope.row.duration ? `${scope.row.duration}天` : '-' }}
        </template>
      </el-table-column>

      <!-- 申请时间 -->
      <el-table-column
        v-if="columnConfig.applyTime.show"
        :label="columnConfig.applyTime.label"
        align="center"
        prop="applyTime"
        :width="columnConfig.applyTime.width"
        sortable
      >
        <template #default="scope">
          {{ formatDate(scope.row.applyTime || scope.row.createTime) }}
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
import { getTodoPublishApplyPage } from '@/api/resource/publish-apply'
import { getTodoApplyPage, getMyResourceApplyPage } from '@/api/resource/apply'
import type { ResourcePublishApplyRespVO } from '@/api/resource/info'
import { formatDate } from '@/utils/formatTime'
import { FeedbackForm } from '@/components/FeedbackForm'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'ApprovalInitiated' })

const message = useMessage()
const router = useRouter()
const userStore = useUserStore()

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

/** 获取当前角色 */
const currentRole = computed(() => userStore.getCurrentRole)

/** 判断角色类型 */
const isResourceAdmin = computed(() => currentRole.value === 'resource_admin')
const isOperationAdmin = computed(() => currentRole.value === 'project_manager')
const isProjectMember = computed(() => ['admin', 'super_admin'].includes(currentRole.value))

/** 表格列配置 */
interface ColumnConfig {
  show: boolean
  label?: string
  prop?: string
  width?: string
  minWidth?: string
}

const columnConfig = computed(() => {
  if (isResourceAdmin.value) {
    // 资源管理员：资源名称，资源类型，描述，申请状态，申请人，申请时间
    return {
      resourceName: { show: true, label: '资源名称', minWidth: '150' },
      resourceType: { show: true, label: '资源类型', width: '120' },
      description: { show: true, label: '描述', minWidth: '200' },
      status: { show: true, label: '申请状态', width: '120' },
      applicant: { show: true, label: '申请人', width: '100' },
      applyTime: { show: true, label: '申请时间', width: '200' },
      // 不展示的列
      publishUserName: { show: false },
      projectName: { show: false },
      approver: { show: false },
      duration: { show: false }
    }
  } else if (isOperationAdmin.value) {
    // 运营管理员：资源名称，资源类型，上架人，审批状态，描述，申请时间
    return {
      resourceName: { show: true, label: '资源名称', minWidth: '150' },
      resourceType: { show: true, label: '资源类型', width: '120' },
      publishUserName: { show: true, label: '上架人', width: '100' },
      status: { show: true, label: '审批状态', width: '120' },
      description: { show: true, label: '描述', minWidth: '200' },
      applyTime: { show: true, label: '申请时间', width: '200' },
      // 不展示的列
      applicant: { show: false },
      projectName: { show: false },
      approver: { show: false },
      duration: { show: false }
    }
  } else {
    // 项目成员及项目经理：资源类型、资源名称、关联项目、申请状态、审批人、申请周期
    return {
      resourceType: { show: true, label: '资源类型', width: '120' },
      resourceName: { show: true, label: '资源名称', minWidth: '150' },
      projectName: { show: true, label: '关联项目', width: '150' },
      status: { show: true, label: '申请状态', width: '120' },
      approver: { show: true, label: '审批人', width: '100' },
      duration: { show: true, label: '申请周期', width: '120' },
      // 不展示的列
      description: { show: false },
      applicant: { show: false },
      publishUserName: { show: false },
      applyTime: { show: false }
    }
  }
})

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

    let res
    if (isResourceAdmin.value) {
      // 资源管理员：调用待办资源申请接口
      res = await getTodoApplyPage(params)
    } else if (isOperationAdmin.value) {
      // 运营管理员：调用待办发布申请接口
      res = await getTodoPublishApplyPage(params)
    } else {
      // 项目成员及项目经理：调用我的资源申请接口
      res = await getMyResourceApplyPage(params)
    }

    list.value = res.list || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取列表失败:', error)
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
