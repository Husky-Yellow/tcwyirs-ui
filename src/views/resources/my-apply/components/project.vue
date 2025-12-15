<template>
  <div class="p-24px">
    <!-- 搜索表单 -->
    <ContentWrap shadow="always" class="mb-16px">
      <el-form :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="queryParams.resourceName" placeholder="请输入资源名称" clearable />
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-220px">
            <el-option label="待审批" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已驳回" :value="2" />
            <el-option label="已撤销" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <Icon icon="ep:search" class="mr-6px" />
            搜索
          </el-button>
          <el-button @click="handleReset">
            <Icon icon="ep:refresh" class="mr-6px" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 申请列表 -->
    <ContentWrap shadow="always">
      <el-table v-loading="loading" :data="applyList" border stripe>
        <el-table-column prop="resourceName" label="资源名称" min-width="180" />
        <el-table-column prop="projectName" label="所属项目" width="150" />
        <el-table-column prop="reason" label="申请原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="duration" label="使用期限" width="100">
          <template #default="{ row }">
            {{ row.duration }} 天
          </template>
        </el-table-column>
        <el-table-column prop="status" label="申请状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" width="120" />
        <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              <Icon icon="ep:view" class="mr-4px" />
              查看
            </el-button>
            <el-button
              v-if="row.status === 0"
              link
              type="warning"
              @click="handleCancel(row)"
            >
              <Icon icon="ep:close" class="mr-4px" />
              撤销
            </el-button>
            <el-button
              v-if="row.status === 2"
              link
              type="primary"
              @click="handleReapply(row)"
            >
              <Icon icon="ep:refresh" class="mr-4px" />
              重新申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-16px flex justify-end">
        <el-pagination
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import {
  getMyResourceApplyPage,
  cancelResourceApply,
  reapplyResource,
  type ResourceApplyVO,
  type ResourceApplyPageReqVO
} from '@/api/resource/apply'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'ProjectApplyView' })

// 加载状态
const loading = ref(false)

// 统计数据
const statistics = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

// 查询参数
const queryParams = ref<ResourceApplyPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  resourceName: '',
  status: undefined
})

// 申请列表
const applyList = ref<ResourceApplyVO[]>([])
const total = ref(0)

// 获取状态名称
const getStatusName = (status: number) => {
  const statusMap = { 0: '待审批', 1: '已通过', 2: '已驳回', 3: '已撤销' }
  return statusMap[status] || '未知'
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  const typeMap = { 0: 'warning', 1: 'success', 2: 'danger', 3: 'info' }
  return typeMap[status] || ''
}

// 加载申请列表
const loadData = async () => {
  try {
    loading.value = true
    const res = await getMyResourceApplyPage(queryParams.value)
    applyList.value = res.list
    total.value = res.total

    // 计算统计数据
    statistics.value = {
      total: res.total,
      pending: res.list.filter((item) => item.status === 0).length,
      approved: res.list.filter((item) => item.status === 1).length,
      rejected: res.list.filter((item) => item.status === 2).length
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryParams.value.pageNo = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    pageNo: 1,
    pageSize: 10,
    resourceName: '',
    status: undefined
  }
  loadData()
}

// 查看申请
const handleView = (row: ResourceApplyVO) => {
  ElMessage.info(`查看申请：${row.resourceName}`)
  // TODO: 打开申请详情弹窗或跳转到详情页
}

// 撤销申请
const handleCancel = async (row: ResourceApplyVO) => {
  try {
    await ElMessageBox.confirm(`确定要撤销对 "${row.resourceName}" 的申请吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelResourceApply(row.id!)
    ElMessage.success('撤销成功!')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('撤销失败:', error)
      ElMessage.error('撤销失败')
    }
  }
}

// 重新申请
const handleReapply = async (row: ResourceApplyVO) => {
  try {
    await ElMessageBox.confirm(`确定要重新申请 "${row.resourceName}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    await reapplyResource({
      resourceId: row.resourceId,
      reason: row.reason,
      projectId: row.projectId,
      duration: row.duration
    })
    ElMessage.success('重新申请成功!')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('重新申请失败:', error)
      ElMessage.error('重新申请失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>
