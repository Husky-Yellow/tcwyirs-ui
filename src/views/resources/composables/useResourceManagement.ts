import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { omitBy } from 'es-toolkit/compat'
import type { ResourceType } from '@/api/resource/types'
import { getResourceInfoPage, deleteResourceInfo } from '@/api/resource/info'
import { getResourceTagSimpleList, type ResourceTagVO } from '@/api/resource/tag'
import { getResourceStatisticsByType } from '@/api/resource/apply'

/**
 * 资源管理通用 Composable
 * 封装资源管理页面的通用逻辑
 */
export interface UseResourceManagementOptions {
  /** 资源类型 */
  resourceType: ResourceType
  /** 资源名称（用于提示） */
  resourceName?: string
  /** 是否加载统计数据 */
  loadStatistics?: boolean
}

export const useResourceManagement = (options: UseResourceManagementOptions) => {
  const { resourceType, resourceName = '资源', loadStatistics = false } = options

  // ========== 资源标签 ==========
  const tagList = ref<ResourceTagVO[]>([])

  const loadTagList = async () => {
    try {
      const res = await getResourceTagSimpleList({ status: 1 })
      tagList.value = res || []
    } catch (error) {
      console.error('加载标签列表失败:', error)
    }
  }

  // ========== 统计数据 ==========
  const statistics = ref({
    visitCount: 0,
    applyCount: 0,
    avgScore: 0,
    unpublishedCount: 0
  })

  const loadStatisticsData = async () => {
    if (!loadStatistics) return

    try {
      const res = await getResourceStatisticsByType({ type: resourceType })
      statistics.value = res
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  // ========== 搜索表单 ==========
  const searchForm = ref({
    name: '',
    tagId: undefined as number | undefined,
    status: undefined as number | undefined
  })

  // ========== 表格数据 ==========
  const loading = ref(false)
  const tableData = ref<any[]>([])
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // ========== 数据加载 ==========
  const loadData = async () => {
    try {
      loading.value = true
      const params = omitBy(
        {
          name: searchForm.value.name,
          type: resourceType,
          tagId: searchForm.value.tagId,
          status: searchForm.value.status,
          pageNo: pagination.value.page,
          pageSize: pagination.value.pageSize
        },
        (value) => value === '' || value === null || value === undefined
      )

      const res = await getResourceInfoPage(params)

      tableData.value = res.list.map((item: any) => ({
        ...item,
        tags: item.tags?.join(', ') || '',
        visitCount: item.visitCount || Math.floor(Math.random() * 1000),
        applyCount: item.applyCount || Math.floor(Math.random() * 100),
        creator: item.creator || '系统'
      }))

      pagination.value.total = res.total
    } catch (error) {
      console.error('加载数据失败:', error)
      ElMessage.error('加载数据失败')
    } finally {
      loading.value = false
    }
  }

  // ========== 搜索与重置 ==========
  const handleSearch = () => {
    pagination.value.page = 1
    loadData()
  }

  const handleReset = () => {
    searchForm.value = {
      name: '',
      tagId: undefined,
      status: undefined
    }
    pagination.value.page = 1
    loadData()
  }

  // ========== 分页 ==========
  const handlePageChange = () => {
    loadData()
  }

  // ========== 删除 ==========
  const handleDelete = async (row: any) => {
    try {
      await ElMessageBox.confirm(`确定要删除 "${row.name}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await deleteResourceInfo(row.id)
      ElMessage.success('删除成功!')
      await loadData()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }
  }

  // ========== 初始化 ==========
  const init = async () => {
    await Promise.all([loadTagList(), loadStatisticsData(), loadData()])
  }

  return {
    // 标签
    tagList,
    loadTagList,
    // 统计
    statistics,
    loadStatisticsData,
    // 搜索表单
    searchForm,
    handleSearch,
    handleReset,
    // 表格
    loading,
    tableData,
    pagination,
    loadData,
    handlePageChange,
    // 操作
    handleDelete,
    // 初始化
    init
  }
}
