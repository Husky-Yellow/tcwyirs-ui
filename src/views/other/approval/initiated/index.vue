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
          <el-option label="数据资源" value="data" />
          <el-option label="应用资源" value="application" />
          <el-option label="组件资源" value="component" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态:" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-240px">
          <el-option label="申请中" value="pending" />
          <el-option label="申请失败" value="failed" />
          <el-option label="申请成功" value="success" />
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
      <el-table-column label="资源类型" align="center" prop="resourceType" width="120" />
      <el-table-column label="资源名称" align="center" prop="resourceName" min-width="150">
        <template #default="scope">
          <el-link type="primary" :underline="false">{{ scope.row.resourceName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="关联项目" align="center" prop="projectName" width="120" />
      <el-table-column label="申请状态" align="center" prop="status" width="120">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <span
              class="inline-block h-8px w-8px rounded-full"
              :class="{
                'bg-blue-500': scope.row.status === 'pending',
                'bg-red-500': scope.row.status === 'failed',
                'bg-green-500': scope.row.status === 'success'
              }"
            ></span>
            <span class="ml-8px">{{ getStatusText(scope.row.status) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="approver" width="100" />
      <el-table-column label="申请时间" align="center" prop="applyTime" width="200" sortable>
        <template #default="scope">
          {{ scope.row.applyTime }}
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
</template>

<script lang="ts" setup>
defineOptions({ name: 'ApprovalInitiated' })

const message = useMessage()

const loading = ref(false)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  resourceName: undefined,
  resourceType: undefined,
  status: undefined
})
const queryFormRef = ref()

/** 模拟数据 */
const mockData = [
  {
    id: 1,
    resourceType: '数据资源',
    resourceName: '停车做费记录',
    projectName: '项目名称1',
    status: 'pending',
    approver: '段本',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 2,
    resourceType: '数据资源',
    resourceName: '停车做费记录',
    projectName: '项目名称2',
    status: 'pending',
    approver: '李杰',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 3,
    resourceType: '数据资源',
    resourceName: '停车做费记录',
    projectName: '项目名称1',
    status: 'failed',
    approver: '王丽',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 4,
    resourceType: '数据资源',
    resourceName: '停车做费记录',
    projectName: '项目名称1',
    status: 'failed',
    approver: '李媛',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 5,
    resourceType: '数据资源',
    resourceName: '停车做费记录',
    projectName: '项目名称1',
    status: 'failed',
    approver: '维也纳',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 6,
    resourceType: '应用资源',
    resourceName: '停车管理系统',
    projectName: '项目名称1',
    status: 'success',
    approver: '尹光',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 7,
    resourceType: '组件资源',
    resourceName: '组件资源名称',
    projectName: '项目名称1',
    status: 'success',
    approver: '宣群',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 8,
    resourceType: '组件资源',
    resourceName: '组件资源名称',
    projectName: '项目名称1',
    status: 'success',
    approver: '朱惠惠',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 9,
    resourceType: '组件资源',
    resourceName: '组件资源名称',
    projectName: '项目名称1',
    status: 'success',
    approver: '里莉莉',
    applyTime: '2017-10-31~2017-10-31'
  },
  {
    id: 10,
    resourceType: '组件资源',
    resourceName: '组件资源名称',
    projectName: '项目名称1',
    status: 'success',
    approver: '里莉莉',
    applyTime: '2017-10-31~2017-10-31'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 过滤数据
    let filteredData = [...mockData]

    if (queryParams.resourceName) {
      filteredData = filteredData.filter((item) =>
        item.resourceName.includes(queryParams.resourceName)
      )
    }

    if (queryParams.resourceType) {
      const typeMap = {
        data: '数据资源',
        application: '应用资源',
        component: '组件资源'
      }
      filteredData = filteredData.filter(
        (item) => item.resourceType === typeMap[queryParams.resourceType]
      )
    }

    if (queryParams.status) {
      filteredData = filteredData.filter((item) => item.status === queryParams.status)
    }

    total.value = filteredData.length

    // 分页
    const start = (queryParams.pageNo - 1) * queryParams.pageSize
    const end = start + queryParams.pageSize
    list.value = filteredData.slice(start, end)
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

/** 获取状态文本 */
const getStatusText = (status: string) => {
  const statusMap = {
    pending: '申请中',
    failed: '申请失败',
    success: '申请成功'
  }
  return statusMap[status] || status
}

/** 详情操作 */
const handleDetail = (row: any) => {
  message.info(`查看详情: ${row.resourceName}`)
}

/** 反馈操作 */
const handleFeedback = (row: any) => {
  message.info(`反馈: ${row.resourceName}`)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
