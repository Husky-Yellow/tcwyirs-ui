<template>
  <div>
    <!-- 顶部导航 -->
    <BackHeader :title="pageTitle">
      <template #right>
        <div class="ml-auto">
          <el-button
            v-if="detail?.status === UsageStatus.ACTIVE"
            type="warning"
            @click="handleStopCurrent"
          >
            停用
          </el-button>
          <el-button v-else type="success" @click="handleEnableCurrent"> 启用 </el-button>
        </div>
      </template>
    </BackHeader>

    <div class="grid grid-cols-4 gap-16px">
      <div class="flex items-center">
        <span class="mr-8px whitespace-nowrap text-[#909399]">资源名称：</span>
        <span class="text-[#303133] font-500">{{ detail?.resourceName || '-' }}</span>
      </div>
      <div class="flex items-center">
        <span class="mr-8px whitespace-nowrap text-[#909399]">资源类型：</span>
        <span class="text-[#303133] font-500">{{ getResourceTypeName(detail?.resourceType) }}</span>
      </div>
      <div class="flex items-center">
        <span class="mr-8px whitespace-nowrap text-[#909399]">上架时间：</span>
        <span class="text-[#303133] font-500">{{ formatDateTime(detail?.publishTime) }}</span>
      </div>
    </div>

    <ContentWrap>
      <div class="grid grid-cols-2 gap-x-40px gap-y-16px">
        <div class="flex items-center">
          <span class="mr-8px min-w-80px whitespace-nowrap text-[#909399]">使用项目：</span>
          <span class="flex-1 text-[#303133]">{{ detail?.projectName || '-' }}</span>
        </div>
        <div class="flex items-center">
          <span class="mr-8px min-w-80px whitespace-nowrap text-[#909399]">项目经理：</span>
          <span class="flex-1 text-[#303133]">{{ detail?.projectManager || '-' }}</span>
        </div>
        <div class="flex items-center">
          <span class="mr-8px min-w-80px whitespace-nowrap text-[#909399]">申请人：</span>
          <span class="flex-1 text-[#303133]">{{ detail?.userName || '-' }}</span>
        </div>
        <div class="flex items-center">
          <span class="mr-8px min-w-80px whitespace-nowrap text-[#909399]">使用状态：</span>
          <el-tag :type="getStatusTagType(detail?.status)" size="small">
            <span
              class="mr-6px inline-block h-6px w-6px rd-50%"
              :class="detail?.status === UsageStatus.ACTIVE ? 'bg-[#67c23a]' : 'bg-[#909399]'"
            ></span>
            {{ getUsageStatusName(detail?.status) }}
          </el-tag>
        </div>
        <div class="col-span-2 flex items-center">
          <span class="mr-8px min-w-80px whitespace-nowrap text-[#909399]">资源使用期限：</span>
          <span class="flex-1 text-[#303133]">
            {{ formatDateTime(detail?.startTime) }} ~ {{ formatDateTime(detail?.endTime) }}
            <span v-if="detail?.startTime && detail?.endTime" class="ml-8px text-[#909399]">
              ({{ calculateDuration(detail.startTime, detail.endTime) }})
            </span>
          </span>
        </div>
      </div>
    </ContentWrap>

    <ContentWrap v-loading="loading">
      <!-- 其他使用项目 -->
      <div
        class="mb-16px mt-24px flex items-center justify-between text-16px text-[#303133] font-500"
      >
        其他使用项目
        <el-input
          v-model="searchKeyword"
          class="w-240px text-14px! font-400!"
          placeholder="请输入关键字"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <Icon icon="ep:search" class="cursor-pointer" @click="handleSearch" />
          </template>
        </el-input>
      </div>
      <el-card shadow="never">
        <el-table v-loading="tableLoading" :data="otherProjects">
          <el-table-column align="center" label="资源类型" prop="resourceType" width="120">
            <template #default="{ row }">
              {{ getResourceTypeName(row.resourceType) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="资源名称"
            prop="resourceName"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="使用项目"
            prop="projectName"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="描述"
            prop="resourceDescription"
            show-overflow-tooltip
          />
          <el-table-column align="center" label="使用状态" prop="status" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                <span
                  class="mr-6px inline-block h-6px w-6px rd-50%"
                  :class="row.status === UsageStatus.ACTIVE ? 'bg-[#67c23a]' : 'bg-[#909399]'"
                ></span>
                {{ getUsageStatusName(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请人" prop="userName" width="100" />
          <el-table-column align="center" label="使用周期" prop="startTime" width="200">
            <template #default="{ row }">
              {{ formatDateRange(row.startTime, row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
              <el-button
                v-if="row.status === UsageStatus.ACTIVE"
                link
                type="warning"
                @click="handleStop(row)"
              >
                停用
              </el-button>
              <el-button v-else link type="success" @click="handleEnable(row)"> 启用 </el-button>
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
      </el-card>
    </ContentWrap>

    <!-- 停用弹窗 -->
    <el-dialog
      v-model="stopDialogVisible"
      title="停用"
      width="480px"
      :close-on-click-modal="false"
      @close="resetStopForm"
    >
      <el-form
        ref="stopFormRef"
        :model="stopForm"
        :rules="stopFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="停用原因" prop="reason" required>
          <el-select v-model="stopForm.reason" placeholder="请选择停用原因" class="w-full">
            <el-option label="资源更新" value="资源更新" />
            <el-option label="项目结束" value="项目结束" />
            <el-option label="资源过期" value="资源过期" />
            <el-option label="其他原因" value="其他原因" />
          </el-select>
        </el-form-item>
        <el-form-item label="停用时间" prop="stopTime" required>
          <el-date-picker
            v-model="stopForm.stopTime"
            type="datetime"
            placeholder="请选择停用时间"
            class="w-full"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="原因描述" prop="description">
          <el-input
            v-model="stopForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入原因描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="stopDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmStop">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { BackHeader } from '@/layout/components/PageHeader'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import {
  getResourceUsage,
  getResourceUsagePage,
  stopResourceUsage,
  enableResourceUsage,
  type ResourceUsageVO
} from '@/api/resource/usage'
import { UsageStatus } from '@/api/resource/types'

defineOptions({ name: 'ResourceUsageDetail' })

const route = useRoute()
const router = useRouter()

// 详情数据
const loading = ref(false)
const detail = ref<ResourceUsageVO | null>(null)

// 页面标题
const pageTitle = computed(() => {
  if (!detail.value) return '资源使用详情'
  return `${detail.value.resourceName}（${detail.value.resourceDescription || ''}）`
})

// 其他使用项目
const tableLoading = ref(false)
const otherProjects = ref<ResourceUsageVO[]>([])
const searchKeyword = ref('')

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 停用弹窗
const stopDialogVisible = ref(false)
const stopFormRef = ref<FormInstance>()
const currentStopRow = ref<ResourceUsageVO | null>(null) // 当前要停用的记录
const stopForm = reactive({
  reason: '',
  stopTime: '',
  description: ''
})

// 停用表单验证规则
const stopFormRules: FormRules = {
  reason: [{ required: true, message: '请选择停用原因', trigger: 'change' }],
  stopTime: [{ required: true, message: '请选择停用时间', trigger: 'change' }]
}

// 重置停用表单
const resetStopForm = () => {
  stopForm.reason = ''
  stopForm.stopTime = ''
  stopForm.description = ''
  stopFormRef.value?.clearValidate()
  currentStopRow.value = null
}

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 // 禁用昨天之前的日期
}


// 资源类型映射
const getResourceTypeName = (type?: number) => {
  const typeMap: Record<number, string> = {
    1: '数据资源',
    2: '应用资源',
    3: '组件资源'
  }
  return type ? typeMap[type] || '-' : '-'
}

// 资源状态映射
const getResourceStatusName = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: '已停用',
    1: '使用中'
  }
  return status !== undefined ? statusMap[status] || '-' : '-'
}

// 使用状态映射
const getUsageStatusName = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: '已停用',
    1: '使用中'
  }
  return status !== undefined ? statusMap[status] || '-' : '-'
}

// 状态标签类型
const getStatusTagType = (status?: number) => {
  return status === UsageStatus.ACTIVE ? 'success' : 'info'
}

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined) => {
  if (!dateTime) return '-'
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

// 格式化日期范围
const formatDateRange = (
  startTime: Date | string | undefined,
  endTime: Date | string | undefined
) => {
  const start = startTime ? formatDate(new Date(startTime), 'YYYY-MM-DD') : '-'
  const end = endTime ? formatDate(new Date(endTime), 'YYYY-MM-DD') : '-'
  return `${start}~${end}`
}

// 计算时长
const calculateDuration = (startTime: Date | string, endTime: Date | string) => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  if (days < 30) {
    return `${days}天`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months}个月`
  } else {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    return months > 0 ? `${years}年${months}个月` : `${years}年`
  }
}

// 加载详情
const loadDetail = async () => {
  // 从 query 参数获取 ID（支持 ?id=xxx 格式）
  const id = Number(route.query.id)
  if (!id) {
    ElMessage.error('缺少资源ID')
    handleBack()
    return
  }

  loading.value = true
  try {
    detail.value = await getResourceUsage(id)
  } catch (error) {
    console.error('加载详情失败:', error)
    ElMessage.error('加载详情失败')
  } finally {
    loading.value = false
  }
}

// 加载其他使用项目
const loadOtherProjects = async () => {
  if (!detail.value?.resourceId) return

  tableLoading.value = true
  try {
    const res = await getResourceUsagePage({
      resourceId: detail.value.resourceId,
      projectName: searchKeyword.value || undefined,
      pageNo: pagination.page,
      pageSize: pagination.pageSize
    })

    // 过滤掉当前详情记录
    otherProjects.value = res.list.filter((item) => item.id !== detail.value?.id)
    pagination.total = res.total > 0 ? res.total - 1 : 0 // 减去当前记录
  } catch (error) {
    console.error('加载其他使用项目失败:', error)
    otherProjects.value = []
    pagination.total = 0
  } finally {
    tableLoading.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 使用资源
const handleUse = () => {
  ElMessage.info('使用功能开发中...')
}

// 停用当前资源
const handleStopCurrent = () => {
  if (!detail.value) return
  currentStopRow.value = detail.value
  stopDialogVisible.value = true
}

// 启用当前资源
const handleEnableCurrent = async () => {
  if (!detail.value) return

  try {
    await ElMessageBox.confirm(`确定要启用"${detail.value.projectName}"的资源使用吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    await enableResourceUsage(detail.value.id!)
    ElMessage.success('启用成功')
    await loadDetail()
    await loadOtherProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
      ElMessage.error('启用失败')
    }
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadOtherProjects()
}

// 查看详情
const handleViewDetail = (row: ResourceUsageVO) => {
  // 跳转到资源的市场详情页
  router.push(`/marketplace/detail/${row.resourceId}`)
}

// 停用
const handleStop = (row: ResourceUsageVO) => {
  currentStopRow.value = row
  stopDialogVisible.value = true
}

// 确认停用
const confirmStop = async () => {
  if (!stopFormRef.value || !currentStopRow.value) return

  try {
    await stopFormRef.value.validate()

    // 调用停用接口，传递表单数据
    await stopResourceUsage({
      id: currentStopRow.value.id!,
      reason: stopForm.reason,
      stopTime: stopForm.stopTime,
      description: stopForm.description
    })
    ElMessage.success('停用成功')

    // 关闭弹窗并重置表单
    stopDialogVisible.value = false
    resetStopForm()

    // 刷新数据
    if (currentStopRow.value.id === detail.value?.id) {
      // 如果停用的是当前详情记录，重新加载详情
      await loadDetail()
    }
    await loadOtherProjects()
  } catch (error) {
    if (error !== 'cancel' && error !== false) {
      console.error('停用失败:', error)
      ElMessage.error('停用失败')
    }
  }
}

// 启用
const handleEnable = async (row: ResourceUsageVO) => {
  try {
    await ElMessageBox.confirm(`确定要启用"${row.projectName}"的资源使用吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    await enableResourceUsage(row.id!)
    ElMessage.success('启用成功')
    await loadOtherProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
    }
  }
}

// 分页
const handleSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  loadOtherProjects()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadOtherProjects()
}

// 初始化
onMounted(async () => {
  await loadDetail()
  await loadOtherProjects()
})
</script>
