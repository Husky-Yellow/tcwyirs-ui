<template>
  <!-- todo 根据角色调不同的列表 通过 roles 判断 -->
  <!-- 搜索表单 -->
  <ContentWrap>
    <Search
      :schema="searchSchema"
      :model="queryParams"
      :expand="true"
      expand-field="applicant"
      @search="handleSearch"
      @reset="handleReset"
    />
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="待审批的" name="pending"></el-tab-pane>
      <el-tab-pane label="已审批的" name="done"></el-tab-pane>
    </el-tabs>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="资源名称" align="center" prop="resourceName" min-width="150">
        <template #default="scope">
          <el-link type="primary" :underline="false">{{ scope.row.resourceName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" align="center" prop="resourceType" width="120">
        <template #default="scope">
          {{ getResourceTypeText(scope.row.resourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="申请项目" align="center" prop="projectName" width="150" />
      <el-table-column label="申请说明" align="center" prop="reason" min-width="150" show-overflow-tooltip />
      <el-table-column label="申请人" align="center" prop="applicant" width="100" />
      <el-table-column label="审批状态" align="center" prop="status" width="120">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <span
              class="mr-8px inline-block h-8px w-8px rounded-full"
              :style="{ backgroundColor: getStatusStyle(scope.row.status).dotColor }"
            ></span>
            <span :style="{ color: getStatusStyle(scope.row.status).textColor }">
              {{ getStatusStyle(scope.row.status).label }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请周期" align="center" prop="createTime" width="200">
        <template #default="scope">
          {{ formatDateRange(scope.row.createTime, scope.row.duration) }}
        </template>
      </el-table-column>
      <el-table-column label="申请期限" align="center" prop="duration" width="100">
        <template #default="scope">
          {{ scope.row.duration ? `${scope.row.duration}天` : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
          <template v-if="scope.row.status === 0">
            <el-divider direction="vertical" />
            <el-link type="success" :underline="false" @click="handleApprove(scope.row)">通过</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" :underline="false" @click="handleReject(scope.row)">驳回</el-link>
          </template>
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

  <!-- 审批对话框 -->
  <el-dialog
    v-model="approvalDialogVisible"
    :title="approvalType === 'approve' ? '通过申请' : '驳回申请'"
    width="500px"
  >
    <el-form :model="approvalForm" label-width="80px">
      <el-form-item label="审批意见:">
        <el-input
          v-model="approvalForm.comment"
          type="textarea"
          :rows="4"
          :placeholder="approvalType === 'approve' ? '请输入通过意见（可选）' : '请输入驳回原因'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="approvalDialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="confirmApproval"
        :loading="submitting"
      >
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getTodoPublishApplyPage } from '@/api/resource/publish-apply'
import { getTodoApplyPage } from '@/api/resource/apply'
import { approveResourceApply, rejectResourceApply } from '@/api/resource/approval'
import type { ResourceApplyVO, ResourceApplyPageReqVO } from '@/api/resource/apply'
import { ApplyStatus } from '@/api/resource/types'
import { useStatusStyle } from '@/views/Home/composables/useStatusStyle'
import { Search } from '@/components/Search'
import type { FormSchema } from '@/types/data'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'MyApproval' })

const message = useMessage()
const router = useRouter()
const userStore = useUserStore()

/** 获取当前角色 */
const currentRole = computed(() => userStore.getCurrentRole)

/** 判断是否为资源管理员 */
const isResourceAdmin = computed(() => currentRole.value === 'resource_admin')

// 状态样式
const { getStatusStyle: getApplyStatusStyle } = useStatusStyle({
  [ApplyStatus.PENDING]: { label: '待审批', dotColor: '#faad14', textColor: '#faad14' },
  [ApplyStatus.APPROVED]: { label: '已通过', dotColor: '#52c41a', textColor: '#52c41a' },
  [ApplyStatus.REJECTED]: { label: '已驳回', dotColor: '#ff4d4f', textColor: '#ff4d4f' },
  [ApplyStatus.CANCELLED]: { label: '已撤销', dotColor: '#d9d9d9', textColor: '#999999' }
})

const getStatusStyle = (status: ApplyStatus) => getApplyStatusStyle(status)

// 标签页
const activeTab = ref<'pending' | 'done'>('pending')
const pendingCount = ref(0)

// 列表相关
const loading = ref(false)
const total = ref(0)
const list = ref<ResourceApplyVO[]>([])
const queryParams = reactive<ResourceApplyPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  resourceName: undefined,
  resourceType: undefined,
  applicant: undefined,
  projectName: undefined,
  status: undefined
})

// 项目列表（用于下拉选择）
const projectList = ref([
  { id: 1, name: 'Smart City' },
  { id: 2, name: 'IoT Platform' }
])

// 搜索表单配置
const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'resourceName',
    label: '资源名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true,
      style: { width: '240px' }
    }
  },
  {
    field: 'resourceType',
    label: '资源类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      style: { width: '240px' },
      options: [
        { label: '数据资源', value: 1 },
        { label: '应用资源', value: 2 },
        { label: '组件资源', value: 3 }
      ]
    }
  },
  {
    field: 'applicant',
    label: '申请人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true,
      style: { width: '240px' }
    }
  },
  {
    field: 'projectName',
    label: '申请项目',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      style: { width: '240px' },
      options: projectList.value.map(p => ({ label: p.name, value: p.name }))
    }
  }
])

// 审批对话框
const approvalDialogVisible = ref(false)
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalForm = reactive({
  id: 0,
  comment: ''
})
const submitting = ref(false)

/** 获取资源类型文本 */
const getResourceTypeText = (type: number) => {
  const typeMap = {
    1: '数据资源',
    2: '应用资源',
    3: '组件资源'
  }
  return typeMap[type] || '-'
}

/** 格式化日期范围 */
const formatDateRange = (startDate: Date | string, duration?: number) => {
  if (!startDate) return '-'

  const start = new Date(startDate)
  const startStr = start.toISOString().split('T')[0]

  if (!duration) return startStr

  const end = new Date(start)
  end.setDate(end.getDate() + duration)
  const endStr = end.toISOString().split('T')[0]

  return `${startStr}~${endStr}`
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // taskType: 0或不传-全部 1-待审批 2-已审批
    const taskType = activeTab.value === 'pending' ? 1 : 2
    const params = {
      ...queryParams,
      taskType
    }

    // 根据角色调用不同的接口
    const api = isResourceAdmin.value ? getTodoApplyPage : getTodoPublishApplyPage
    const { data } = await api(params)
    list.value = data?.list || []
    total.value = data?.total || 0

    // 更新待审批数量
    if (activeTab.value === 'pending') {
      pendingCount.value = data?.total || 0
    }
  } finally {
    loading.value = false
  }
}

/** 获取待审批数量 */
const getPendingCount = async () => {
  try {
    // taskType: 1-待审批
    // 根据角色调用不同的接口
    const api = isResourceAdmin.value ? getTodoApplyPage : getTodoPublishApplyPage
    const { data } = await api({ pageNo: 1, pageSize: 1, taskType: 1 })
    pendingCount.value = data?.total || 0
  } catch (error) {
    console.error('获取待审批数量失败:', error)
  }
}

/** 标签页切换 */
const handleTabChange = () => {
  queryParams.pageNo = 1
  getList()
}

/** 搜索按钮操作 */
const handleSearch = (values: any) => {
  Object.assign(queryParams, values)
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const handleReset = (values: any) => {
  Object.assign(queryParams, values)
  queryParams.pageNo = 1
  getList()
}

/** 详情操作 */
const handleDetail = (row: ResourceApplyVO) => {
  router.push({
    name: 'ApprovalDetail',
    query: {
      id: row.id
    }
  })
}

/** 通过操作 */
const handleApprove = (row: ResourceApplyVO) => {
  approvalType.value = 'approve'
  approvalForm.id = row.id!
  approvalForm.comment = ''
  approvalDialogVisible.value = true
}

/** 驳回操作 */
const handleReject = (row: ResourceApplyVO) => {
  approvalType.value = 'reject'
  approvalForm.id = row.id!
  approvalForm.comment = ''
  approvalDialogVisible.value = true
}

/** 确认审批 */
const confirmApproval = async () => {
  submitting.value = true
  try {
    const api = approvalType.value === 'approve' ? approveResourceApply : rejectResourceApply
    await api({
      id: approvalForm.id,
      comment: approvalForm.comment
    })

    message.success(approvalType.value === 'approve' ? '审批通过' : '已驳回')
    approvalDialogVisible.value = false

    // 刷新列表
    await getList()
    // 如果当前 tab 不是 pending，需要额外更新待审批数量
    if (activeTab.value !== 'pending') {
      await getPendingCount()
    }
  } finally {
    submitting.value = false
  }
}

/** 初始化 */
onMounted(async () => {
  await getList()
  // 如果初始 tab 不是 pending，需要额外获取待审批数量
  if (activeTab.value !== 'pending') {
    await getPendingCount()
  }
})
</script>
