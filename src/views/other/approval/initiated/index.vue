<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="74px"
    >
      <el-form-item label="资源名称:" prop="resourceName">
        <el-input
          v-model="queryParams.resourceName"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="资源类型:" prop="resourceType">
        <el-select v-model="queryParams.resourceType" placeholder="全部" clearable class="!w-220px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.RESOURCE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态:" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-220px">
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
      <!-- 动态渲染排序后的列 -->
      <template v-for="columnKey in sortedColumns" :key="columnKey">
        <!-- 资源类型 -->
        <el-table-column
          v-if="columnKey === 'resourceType'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="resourceType"
          :width="columnConfig[columnKey].width"
        >
          <template #default="scope">
            {{ getResourceTypeText(scope.row.resourceType) }}
          </template>
        </el-table-column>

        <!-- 资源名称 -->
        <el-table-column
          v-else-if="columnKey === 'resourceName'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="resourceName"
          :min-width="columnConfig[columnKey].minWidth"
        >
          <template #default="scope">
            <el-link type="primary" :underline="false">{{ scope.row.resourceName }}</el-link>
          </template>
        </el-table-column>

        <!-- 描述 -->
        <el-table-column
          v-else-if="columnKey === 'description'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="description"
          :min-width="columnConfig[columnKey].minWidth"
        />

        <!-- 关联项目 -->
        <el-table-column
          v-else-if="columnKey === 'projectName'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="projectName"
          :width="columnConfig[columnKey].width"
        />

        <!-- 申请状态 -->
        <el-table-column
          v-else-if="columnKey === 'status'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="status"
          :width="columnConfig[columnKey].width"
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
          v-else-if="columnKey === 'applicant'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="applicant"
          :width="columnConfig[columnKey].width"
        />

        <!-- 上架人 -->
        <el-table-column
          v-else-if="columnKey === 'publishUserName'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="publishUserName"
          :width="columnConfig[columnKey].width"
        />

        <!-- 审批人 -->
        <el-table-column
          v-else-if="columnKey === 'approver'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="approver"
          :width="columnConfig[columnKey].width"
        />

        <!-- 申请周期 -->
        <el-table-column
          v-else-if="columnKey === 'duration'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="duration"
          :width="columnConfig[columnKey].width"
        >
          <template #default="scope">
            {{ scope.row.duration ? `${scope.row.duration}天` : '-' }}
          </template>
        </el-table-column>

        <!-- 申请时间 -->
        <el-table-column
          v-else-if="columnKey === 'applyTime'"
          :label="columnConfig[columnKey].label"
          align="center"
          prop="applyTime"
          :width="columnConfig[columnKey].width"
          sortable
        >
          <template #default="scope">
            {{ formatDate(scope.row.applyTime || scope.row.createTime) }}
          </template>
        </el-table-column>
      </template>

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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getTodoPublishApplyPage } from '@/api/resource/publish-apply'
import { getMyResourcePublishApplyPage, getMyResourceApplyPage } from '@/api/resource/apply'
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
  order?: number // 显示顺序
}

const columnConfig = computed(() => {
  console.log('isResourceAdmin.value', isResourceAdmin.value);

  if (isResourceAdmin.value) {
    // 资源管理员：资源名称，资源类型，描述，申请状态，申请人，申请时间
    return {
      resourceName: { show: true, label: '资源名称', minWidth: '150', order: 1 },
      resourceType: { show: true, label: '资源类型', width: '120', order: 2 },
      description: { show: true, label: '描述', minWidth: '200', order: 3 },
      status: { show: true, label: '申请状态', width: '120', order: 4 },
      applicant: { show: true, label: '申请人', width: '100', order: 5 },
      applyTime: { show: true, label: '申请时间', width: '200', order: 6 },
      // 不展示的列
      publishUserName: { show: false, order: 99 },
      projectName: { show: false, order: 99 },
      approver: { show: false, order: 99 },
      duration: { show: false, order: 99 }
    }
  } else if (isOperationAdmin.value) {
    // 运营管理员：资源名称，资源类型，上架人，审批状态，描述，申请时间
    return {
      resourceName: { show: true, label: '资源名称', minWidth: '150', order: 1 },
      resourceType: { show: true, label: '资源类型', width: '120', order: 2 },
      publishUserName: { show: true, label: '上架人', width: '100', order: 3 },
      status: { show: true, label: '审批状态', width: '120', order: 4 },
      description: { show: true, label: '描述', minWidth: '200', order: 5 },
      applyTime: { show: true, label: '申请时间', width: '200', order: 6 },
      // 不展示的列
      applicant: { show: false, order: 99 },
      projectName: { show: false, order: 99 },
      approver: { show: false, order: 99 },
      duration: { show: false, order: 99 }
    }
  } else {
    // 项目成员及项目经理：资源类型、资源名称、关联项目、申请状态、审批人、申请周期
    return {
      resourceType: { show: true, label: '资源类型', width: '120', order: 1 },
      resourceName: { show: true, label: '资源名称', minWidth: '150', order: 2 },
      projectName: { show: true, label: '关联项目', width: '150', order: 3 },
      status: { show: true, label: '申请状态', width: '120', order: 4 },
      approver: { show: true, label: '审批人', width: '100', order: 5 },
      duration: { show: true, label: '申请周期', width: '120', order: 6 },
      // 不展示的列
      description: { show: false, order: 99 },
      applicant: { show: false, order: 99 },
      publishUserName: { show: false, order: 99 },
      applyTime: { show: false, order: 99 }
    }
  }
})

/** 按 order 排序的列配置 */
const sortedColumns = computed(() => {
  const config = columnConfig.value
  // 将配置对象转换为数组，并按 order 排序
  return Object.entries(config)
    .filter(([_, value]) => value.show)
    .sort((a, b) => (a[1].order || 999) - (b[1].order || 999))
    .map(([key]) => key)
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
      // 资源管理员：调用我的资源申请接口
      res = await getMyResourcePublishApplyPage(params)
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
