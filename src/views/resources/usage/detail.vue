<template>
  <div class="usage-detail-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="handleBack">
          <Icon icon="ep:arrow-left" />
          返回
        </el-button>
        <span class="page-title">{{ pageTitle }}</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleUse">使用</el-button>
      </div>
    </div>

    <ContentWrap v-loading="loading">
      <!-- 资源信息卡片 -->
      <el-card class="info-card" shadow="never">
        <div class="info-row">
          <div class="info-item">
            <span class="label">资源名称：</span>
            <span class="value">{{ detail?.resourceName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">资源类型：</span>
            <span class="value">{{ getResourceTypeName(detail?.resourceType) }}</span>
          </div>
          <div class="info-item">
            <span class="label">资源状态：</span>
            <span class="value">{{ getResourceStatusName(detail?.status) }}</span>
          </div>
          <div class="info-item">
            <span class="label">上架时间：</span>
            <span class="value">{{ formatDateTime(detail?.publishTime) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 基本信息 -->
      <div class="section-title">基本信息</div>
      <el-card class="basic-info-card" shadow="never">
        <div class="basic-info-grid">
          <div class="info-item">
            <span class="label">使用项目：</span>
            <span class="value">{{ detail?.projectName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">项目经理：</span>
            <span class="value">{{ detail?.projectManager || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">申请人：</span>
            <span class="value">{{ detail?.userName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">使用状态：</span>
            <el-tag :type="getStatusTagType(detail?.status)" size="small">
              <span class="status-dot" :class="getStatusDotClass(detail?.status)"></span>
              {{ getUsageStatusName(detail?.status) }}
            </el-tag>
          </div>
          <div class="info-item full-width">
            <span class="label">资源使用期限：</span>
            <span class="value">
              {{ formatDateTime(detail?.startTime) }} ~ {{ formatDateTime(detail?.endTime) }}
              <span v-if="detail?.startTime && detail?.endTime" class="duration">
                ({{ calculateDuration(detail.startTime, detail.endTime) }})
              </span>
            </span>
          </div>
        </div>
      </el-card>

      <!-- 其他使用项目 -->
      <div class="section-title">
        其他使用项目
        <el-input
          v-model="searchKeyword"
          class="search-input"
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
          <el-table-column align="center" label="资源名称" prop="resourceName" show-overflow-tooltip />
          <el-table-column align="center" label="使用项目" prop="projectName" show-overflow-tooltip />
          <el-table-column align="center" label="描述" prop="resourceDescription" show-overflow-tooltip />
          <el-table-column align="center" label="使用状态" prop="status" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                <span class="status-dot" :class="getStatusDotClass(row.status)"></span>
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
              <el-button
                v-else
                link
                type="success"
                @click="handleEnable(row)"
              >
                启用
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
      </el-card>
    </ContentWrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Icon } from '@/components/Icon'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// 状态点样式类
const getStatusDotClass = (status?: number) => {
  return status === UsageStatus.ACTIVE ? 'active' : 'inactive'
}

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined) => {
  if (!dateTime) return '-'
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

// 格式化日期范围
const formatDateRange = (startTime: Date | string | undefined, endTime: Date | string | undefined) => {
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
  const id = Number(route.params.id)
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
    otherProjects.value = res.list.filter(item => item.id !== detail.value?.id)
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

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadOtherProjects()
}

// 查看详情
const handleViewDetail = (row: ResourceUsageVO) => {
  // 跳转到该记录的详情页
  router.push(`/resources/usage/detail/${row.id}`)
  // 重新加载数据
  loadDetail()
  loadOtherProjects()
}

// 停用
const handleStop = async (row: ResourceUsageVO) => {
  try {
    await ElMessageBox.confirm(`确定要停用"${row.projectName}"的资源使用吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await stopResourceUsage(row.id!)
    ElMessage.success('停用成功')
    await loadOtherProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('停用失败:', error)
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

<style lang="scss" scoped>
.usage-detail-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 16px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .page-title {
        font-size: 18px;
        font-weight: 500;
        color: #303133;
      }
    }
  }

  .info-card {
    margin-bottom: 20px;

    .info-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .info-item {
        display: flex;
        align-items: center;

        .label {
          color: #909399;
          margin-right: 8px;
          white-space: nowrap;
        }

        .value {
          color: #303133;
          font-weight: 500;
        }
      }
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin: 24px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-input {
      width: 240px;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .basic-info-card {
    margin-bottom: 20px;

    .basic-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px 40px;

      .info-item {
        display: flex;
        align-items: center;

        .label {
          color: #909399;
          margin-right: 8px;
          white-space: nowrap;
          min-width: 80px;
        }

        .value {
          color: #303133;
          flex: 1;

          .duration {
            color: #909399;
            margin-left: 8px;
          }
        }

        &.full-width {
          grid-column: 1 / -1;
        }
      }
    }
  }

  .status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;

    &.active {
      background-color: #67c23a;
    }

    &.inactive {
      background-color: #909399;
    }
  }
}
</style>
