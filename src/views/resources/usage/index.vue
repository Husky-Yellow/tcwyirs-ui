<template>
  <!-- 搜索栏 -->
  <ContentWrap>
    <Search
      :schema="searchSchema"
      :model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />
  </ContentWrap>

  <!-- 主体内容 -->
  <ContentWrap shadow="always">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column align="center" label="资源类型" prop="resourceName" show-overflow-tooltip />
      <el-table-column align="center" label="资源名称" prop="resourceName" show-overflow-tooltip />
      <el-table-column align="center" label="描述" prop="resourceName" show-overflow-tooltip />
      <el-table-column align="center" label="上架状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '使用中' : '已停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批人" prop="resourceName" show-overflow-tooltip />
      <el-table-column align="center" label="上架时间" prop="startTime" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
          <el-button
            link
            type="warning"
            @click="handleFeedback(row)"
          >
            反馈
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :total="pagination.total"
      background
      class="mt-4"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </ContentWrap>

  <!-- 反馈表单 -->
  <FeedbackForm
    v-model="feedbackFormVisible"
    :resource-id="currentResource?.resourceId"
    :resource-name="currentResource?.resourceName"
    @success="handleFeedbackSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { FeedbackForm } from '@/components/FeedbackForm'
import type { FormSchema } from '@/types/data'
import { formatDate } from '@/utils/formatTime'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getResourceUsagePage,
  stopResourceUsage,
  enableResourceUsage
} from '@/api/resource/usage'
import type { ResourceUsageVO } from '@/api/resource/usage'
import { UsageStatus } from '@/api/resource/types'

defineOptions({ name: 'ResourceUsage' })

const router = useRouter()

// 搜索表单数据
const searchForm = ref({
  resourceName: '',
  projectName: '',
  useStatus: undefined
})

// 搜索表单配置
const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'resourceName',
    label: '资源名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true
    }
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true
    }
  },
  {
    field: 'useStatus',
    label: '使用状态',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      class: 'w-240px!',
      options: [
        { label: '全部', value: undefined },
        { label: '使用中', value: UsageStatus.ACTIVE },
        { label: '已停用', value: UsageStatus.STOPPED }
      ]
    }
  }
])

// 表格数据
const loading = ref(false)
const tableData = ref<ResourceUsageVO[]>([])

// 反馈表单
const feedbackFormVisible = ref(false)
const currentResource = ref<ResourceUsageVO | null>(null)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getResourceUsagePage({
      ...searchForm.value,
      pageNo: pagination.page,
      pageSize: pagination.pageSize
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('加载数据失败:', error)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined) => {
  if (!dateTime) return '-'
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

// 查看详情
const handleDetail = (row: ResourceUsageVO) => {
  router.push(`/resources/usage/detail?id=${row.id}&_hb=1`)
}

// 打开反馈表单
const handleFeedback = (row: ResourceUsageVO) => {
  currentResource.value = row
  feedbackFormVisible.value = true
}

// 反馈提交成功
const handleFeedbackSuccess = () => {
  feedbackFormVisible.value = false
  currentResource.value = null
}

// 停用资源
const handleStop = async (row: ResourceUsageVO) => {
  try {
    await ElMessageBox.confirm(`确定要停用资源"${row.resourceName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await stopResourceUsage(row.id!)
    ElMessage.success('停用成功')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('停用失败:', error)
    }
  }
}

// 启用资源
const handleEnable = async (row: ResourceUsageVO) => {
  try {
    await ElMessageBox.confirm(`确定要启用资源"${row.resourceName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    await enableResourceUsage(row.id!)
    ElMessage.success('启用成功')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
    }
  }
}

// 搜索
const handleSearch = (values: any) => {
  searchForm.value = values
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = (values: any) => {
  searchForm.value = values
  pagination.page = 1
  loadData()
}

// 分页改变
const handleSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  loadData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped></style>
