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
          <dict-tag :type="DICT_TYPE.RESOURCE_TYPE" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="上架人" align="center" prop="publishUserName" width="100" />
      <el-table-column prop="status" label="审批状态" width="120">
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.APPROVAL_STATUS" :value="row.status" />
          </template>
        </el-table-column>
      <el-table-column label="描述" align="center" prop="description" min-width="200" show-overflow-tooltip />
      <el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template #default="scope">
          {{ scope.row.applyTime || scope.row.createTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
          <!-- <template v-if="scope.row.status === 0">
            <el-divider direction="vertical" />
            <el-link type="success" :underline="false" @click="handleApprove(scope.row)">通过1</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" :underline="false" @click="handleReject(scope.row)">驳回</el-link>
          </template> -->
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
import { getTodoApplyPage, getResourcePublishApply } from '@/api/resource/apply'
import { approveResourceApply, rejectResourceApply } from '@/api/resource/approval'
import type { ResourceApplyVO, ResourceApplyPageReqVO } from '@/api/resource/apply'
import { ApplyStatus } from '@/api/resource/types'
import { DICT_TYPE } from '@/utils/dict'
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
      style: { width: '220px' }
    }
  },
  {
    field: 'resourceType',
    label: '资源类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      style: { width: '220px' },
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
      style: { width: '220px' }
    }
  },
  {
    field: 'projectName',
    label: '申请项目',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      style: { width: '220px' },
      options: projectList.value.map(p => ({ label: p.name, value: p.name }))
    }
  }
])

// 审批对话框
const approvalDialogVisible = ref(false)
const approvalType = ref<'approve' | 'reject'>('approve')
const approvalForm = reactive({
  id: 0,
  type: 2, // 审批类型：1-资源申请，2-上架申请
  taskId: '', // 任务ID
  comment: ''
})
const submitting = ref(false)

/**
 * 获取当前用户的待办任务ID
 * 1. 找到当前待审批的节点（activityNodes 中 status=1 的节点）
 * 2. 从该节点的 tasks 中找到 assigneeUserId 等于当前登录用户的任务
 * 3. 取该任务的 id 字段作为 taskId
 */
const getCurrentUserTaskId = (approvalDetail: any): string | undefined => {
  if (!approvalDetail?.activityNodes) {
    return undefined
  }

  const currentUserId = userStore.user.id
  const activityNodes = approvalDetail.activityNodes

  // 找到当前待审批的节点（status=1 表示待处理）
  const pendingNode = activityNodes.find((node: any) => node.status === 1)
  if (!pendingNode?.tasks?.length) {
    return undefined
  }

  // 从该节点的 tasks 中找到 assigneeUserId 等于当前登录用户的任务
  const userTask = pendingNode.tasks.find((task: any) => task.assigneeUserId === currentUserId)
  return userTask?.id
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
    const res = await api(params)

    list.value = res?.list || []
    total.value = res?.total || 0

    // 更新待审批数量
    if (activeTab.value === 'pending') {
      pendingCount.value = res?.total || 0
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
const handleDetail = (row: any) => {
  // 使用 publishApplyId（上架申请ID）而不是 resourceId
  const applyId = row.publishApplyId || row.id
  router.push({
    name: 'ApprovalDetail',
    query: {
      id: applyId
    }
  })
}

/** 通过操作 */
const handleApprove = async (row: ResourceApplyVO) => {
  try {
    loading.value = true
    // 获取申请详情以提取 taskId
    const detail = await getResourcePublishApply(row.id!)
    const taskId = getCurrentUserTaskId(detail?.approvalDetail)

    if (!taskId) {
      message.error('无法获取当前任务ID，请刷新页面重试')
      return
    }

    approvalType.value = 'approve'
    approvalForm.id = row.id!
    approvalForm.type = detail?.type || 2
    approvalForm.taskId = taskId
    approvalForm.comment = ''
    approvalDialogVisible.value = true
  } catch (error) {
    console.error('获取申请详情失败:', error)
    message.error('获取申请详情失败')
  } finally {
    loading.value = false
  }
}

/** 驳回操作 */
const handleReject = async (row: ResourceApplyVO) => {
  try {
    loading.value = true
    // 获取申请详情以提取 taskId
    const detail = await getResourcePublishApply(row.id!)
    const taskId = getCurrentUserTaskId(detail?.approvalDetail)

    if (!taskId) {
      message.error('无法获取当前任务ID，请刷新页面重试')
      return
    }

    approvalType.value = 'reject'
    approvalForm.id = row.id!
    approvalForm.type = detail?.type || 2
    approvalForm.taskId = taskId
    approvalForm.comment = ''
    approvalDialogVisible.value = true
  } catch (error) {
    console.error('获取申请详情失败:', error)
    message.error('获取申请详情失败')
  } finally {
    loading.value = false
  }
}

/** 确认审批 */
const confirmApproval = async () => {
  submitting.value = true
  try {
    const api = approvalType.value === 'approve' ? approveResourceApply : rejectResourceApply
    await api({
      id: approvalForm.id,
      type: approvalForm.type,
      taskId: approvalForm.taskId,
      reason: approvalForm.comment
    })

    debugger
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
