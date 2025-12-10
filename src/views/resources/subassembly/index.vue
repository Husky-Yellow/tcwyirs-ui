<template>
  <div>
    <!-- 页面标题 -->
    <h2 class="mb-24px text-20px text-[#303133] font-600">组件资源管理</h2>

    <!-- 统计卡片 -->
    <ResourceStatistics :statistics="statistics" />

    <!-- 搜索表单 -->
    <ResourceSearchForm
      v-model="searchForm"
      :tag-list="tagList"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 资源列表 -->
    <ResourceTable
      :loading="loading"
      :table-data="tableData"
      :pagination="pagination"
      :tag-list="tagList"
      create-button-text="新增组件资源"
      @create="handleCreate"
      @detail="handleDetail"
      @edit="handleEdit"
      @delete="handleDelete"
      @toggle-status="handleToggleStatus"
      @page-change="handlePageChange"
    />

    <!-- 新增/编辑表单 -->
    <SubassemblyForm
      v-model="drawerVisible"
      :data="currentRow"
      :is-edit="isEdit"
      :tag-list="tagList"
      @success="handleFormSuccess"
    />

    <!-- 下架弹窗 -->
    <UnpublishDialog ref="unpublishDialogRef" @confirm="handleUnpublishConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ResourceType } from '@/api/resource/types'
import { unpublishResourceInfo } from '@/api/resource/info'
import { createPublishApply, offlineResource } from '@/api/resource/publish-apply'
import { useResourceManagement } from '../composables/useResourceManagement'
import ResourceStatistics from '../components/ResourceStatistics.vue'
import ResourceSearchForm from '../components/ResourceSearchForm.vue'
import ResourceTable from '../components/ResourceTable.vue'
import SubassemblyForm from './SubassemblyForm.vue'
import UnpublishDialog from '../components/UnpublishDialog.vue'

defineOptions({ name: 'ComponentResource' })

// 使用资源管理 composable
const {
  tagList,
  statistics,
  searchForm,
  loading,
  tableData,
  pagination,
  handleSearch,
  handleReset,
  handlePageChange,
  handleDelete,
  init
} = useResourceManagement({
  resourceType: ResourceType.COMPONENT,
  resourceName: '组件资源',
  loadStatistics: false
})

// 抽屉状态
const drawerVisible = ref(false)
const isEdit = ref(false)
const currentRow = ref<any>(null)
const unpublishDialogRef = ref()
const currentToggleRow = ref<any>(null)

// 新增
const handleCreate = () => {
  isEdit.value = false
  currentRow.value = null
  drawerVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true
  currentRow.value = row
  drawerVisible.value = true
}

// 表单提交成功
const handleFormSuccess = async () => {
  drawerVisible.value = false
  await init()
}

// 上架/下架
const handleToggleStatus = async (row: any) => {
  const isPublished = row.status === 2 // status = 2 表示已发布

  if (isPublished) {
    // 下架操作：打开下架弹窗
    currentToggleRow.value = row
    unpublishDialogRef.value?.open()
  } else {
    // 上架操作：创建发布申请
    try {
      await ElMessageBox.confirm(
        `确定要申请上架资源"${row.name}"吗？`,
        '上架申请确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await createPublishApply({ resourceId: row.id })
      ElMessage.success('上架申请已提交，等待审批')
      await init()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('提交上架申请失败:', error)
        ElMessage.error('提交上架申请失败')
      }
    }
  }
}

// 处理下架确认
const handleUnpublishConfirm = async (formData: any) => {
  try {
    console.log('下架原因:', formData)

    await offlineResource({
      resourceId: currentToggleRow.value.id,
      ...formData
    })

    ElMessage.success('下架成功')
    unpublishDialogRef.value?.close()
    unpublishDialogRef.value?.setLoading(false)
    await init()
  } catch (error) {
    console.error('下架失败:', error)
    ElMessage.error('下架失败')
    unpublishDialogRef.value?.setLoading(false)
  }
}

// 初始化
onMounted(() => {
  init()
})
</script>
