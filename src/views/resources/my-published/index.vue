<template>
  <div>
    <!-- 搜索表单 -->
    <ContentWrap shadow="always" class="mb-16px">
      <el-form :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="queryParams.resourceName" placeholder="请输入资源名称" clearable />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select
            v-model="queryParams.resourceType"
            placeholder="全部"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.RESOURCE_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资源状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-240px">
            <el-option label="草稿" :value="0" />
            <el-option label="待审批" :value="1" />
            <el-option label="已发布" :value="2" />
            <el-option label="已下架" :value="3" />
            <el-option label="已驳回" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">
            <Icon icon="ep:refresh" class="mr-6px" />
            重置
          </el-button>
          <el-button type="primary" @click="handleQuery">
            <Icon icon="ep:search" class="mr-6px" />
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 操作栏 -->
    <!-- <div class="mb-16px flex items-center justify-between">
      <el-button type="primary" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-6px" />
        新增资源
      </el-button>
    </div> -->

    <!-- 资源列表 -->
    <ContentWrap shadow="always">
      <el-table v-loading="loading" :data="resourceList" stripe border>
        <el-table-column prop="type" label="资源类型" width="120">
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.PRODUCT_LISTING_STATUS" :value="row.type" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="资源名称" min-width="180" />

        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="上架状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="审批人" width="120" />
        <el-table-column prop="createTime" label="上架时间" width="180">
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
            <el-button link type="primary" @click="handleEdit(row)">
              <Icon icon="ep:edit" class="mr-4px" />
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              <Icon icon="ep:delete" class="mr-4px" />
              删除
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
  getPublishApplicationPage,
  deleteResourceInfo,
  type ResourceInfoVO,
  type PublishApplicationPageParamVO,
  type ResourcePublishApplyRespVO
} from '@/api/resource/info'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'MyPublishedResources' })

const userStore = useUserStore()

// 加载状态
const loading = ref(false)

// 查询参数
const queryParams = ref<PublishApplicationPageParamVO>({
  pageNo: 1,
  pageSize: 10,
  resourceName: '',
  resourceType: undefined,
  publishUserId: userStore.getUser?.id?.toString() || '',
  status: undefined
})

// 资源列表
const resourceList = ref<ResourcePublishApplyRespVO[]>([])
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

// 获取状态名称
const getStatusName = (status: number) => {
  const statusMap = { 0: '草稿', 1: '待审批', 2: '已发布', 3: '已下架', 4: '已驳回' }
  return statusMap[status] || '未知'
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  const typeMap = { 0: 'info', 1: 'warning', 2: 'success', 3: 'info', 4: 'danger' }
  return typeMap[status] || ''
}

// 加载资源列表
const loadData = async () => {
  try {
    loading.value = true
    const res = await getPublishApplicationPage(queryParams.value)
    resourceList.value = res.list || []
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
    resourceType: undefined,
    publishUserId: userStore.getUser?.id?.toString() || '',
    status: undefined
  }
  loadData()
}

// 新增资源
const handleCreate = () => {
  ElMessage.info('跳转到新增资源页面')
  // TODO: 跳转到新增资源页面
}

// 查看资源
const handleView = (row: ResourceInfoVO) => {
  ElMessage.info(`查看资源：${row.name}`)
  // TODO: 跳转到资源详情页面
}

// 编辑资源
const handleEdit = (row: ResourceInfoVO) => {
  ElMessage.info(`编辑资源：${row.name}`)
  // TODO: 跳转到编辑资源页面
}

// 删除资源
const handleDelete = async (row: ResourceInfoVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除资源 "${row.name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteResourceInfo(row.id!)
    ElMessage.success('删除成功!')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>
