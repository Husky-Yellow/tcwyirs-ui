<template>
  <div class="p-24px">
    <!-- 头部标题 -->
    <div class="mb-24px">
      <h2 class="text-20px text-[#303133] font-600">我收藏的资源</h2>
      <p class="mt-8px text-14px text-[#909399]">查看我收藏的所有资源</p>
    </div>

    <!-- 统计卡片 -->
    <div class="mb-24px grid grid-cols-4 gap-16px">
      <el-card shadow="hover">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-[#909399]">全部收藏</div>
            <div class="mt-8px text-24px text-[#303133] font-600">{{ statistics.total }}</div>
          </div>
          <Icon icon="ep:collection" :size="40" class="text-[#409eff]/20" />
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-[#909399]">数据资源</div>
            <div class="mt-8px text-24px text-[#67c23a] font-600">{{ statistics.dataResourceCount }}</div>
          </div>
          <Icon icon="ep:document" :size="40" class="text-[#67c23a]/20" />
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-[#909399]">应用资源</div>
            <div class="mt-8px text-24px text-[#e6a23c] font-600">{{ statistics.appResourceCount }}</div>
          </div>
          <Icon icon="ep:box" :size="40" class="text-[#e6a23c]/20" />
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-14px text-[#909399]">组件资源</div>
            <div class="mt-8px text-24px text-[#909399] font-600">{{ statistics.componentResourceCount }}</div>
          </div>
          <Icon icon="ep:grid" :size="40" class="text-[#909399]/20" />
        </div>
      </el-card>
    </div>

    <!-- 搜索表单 -->
    <ContentWrap shadow="always" class="mb-16px">
      <el-form :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="queryParams.resourceName" placeholder="请输入资源名称" clearable />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="queryParams.resourceType" placeholder="全部" clearable class="!w-240px">
            <el-option label="数据资源" :value="1" />
            <el-option label="应用资源" :value="2" />
            <el-option label="组件资源" :value="3" />
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

    <!-- 收藏列表 -->
    <ContentWrap shadow="always">
      <el-table v-loading="loading" :data="collectList" border stripe>
        <el-table-column prop="resourceType" label="资源类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.resourceType)">
              {{ getTypeName(row.resourceType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resourceName" label="资源名称" min-width="200" />
        <el-table-column prop="createTime" label="收藏时间" width="180">
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
            <el-button link type="danger" @click="handleCancelCollect(row)">
              <Icon icon="ep:delete" class="mr-4px" />
              取消收藏
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
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import {
  getCollectRecordPage,
  cancelCollect,
  getMyCollectStatistics,
  type CollectRecordVO,
  type CollectRecordPageReqVO
} from '@/api/resource/collect'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'MyCollectedResources' })

const router = useRouter()

// 加载状态
const loading = ref(false)

// 统计数据
const statistics = ref({
  total: 0,
  dataResourceCount: 0,
  appResourceCount: 0,
  componentResourceCount: 0
})

// 查询参数
const queryParams = ref<CollectRecordPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  resourceName: '',
  resourceType: undefined
})

// 收藏列表
const collectList = ref<CollectRecordVO[]>([])
const total = ref(0)

// 获取资源类型名称
const getTypeName = (type: number) => {
  const typeMap = { 1: '数据资源', 2: '应用资源', 3: '组件资源' }
  return typeMap[type] || '未知'
}

// 获取资源类型标签类型
const getTypeTagType = (type: number) => {
  const typeMap = { 1: 'success', 2: 'warning', 3: 'info' }
  return typeMap[type] || ''
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const stats = await getMyCollectStatistics()
    statistics.value = {
      total: (stats.dataResourceCount || 0) + (stats.appResourceCount || 0) + (stats.componentResourceCount || 0),
      dataResourceCount: stats.dataResourceCount || 0,
      appResourceCount: stats.appResourceCount || 0,
      componentResourceCount: stats.componentResourceCount || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载收藏列表
const loadData = async () => {
  try {
    loading.value = true
    const res = await getCollectRecordPage(queryParams.value)
    collectList.value = res.list || []
    total.value = res.total || 0
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
    resourceType: undefined
  }
  loadData()
}

// 查看资源详情
const handleView = (row: CollectRecordVO) => {
  router.push({
    path: '/resources/detail',
    query: { id: row.resourceId }
  })
}

// 取消收藏
const handleCancelCollect = async (row: CollectRecordVO) => {
  try {
    await ElMessageBox.confirm(`确定要取消收藏 "${row.resourceName}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelCollect(row.id!)
    ElMessage.success('取消收藏成功!')
    await loadData()
    await loadStatistics()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消收藏失败:', error)
      ElMessage.error('取消收藏失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadStatistics()
  loadData()
})
</script>
