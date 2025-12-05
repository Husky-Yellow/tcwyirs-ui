import { ref, reactive } from 'vue'
import type { ResourceItem, TableDataItem, PaginationData, TableAction } from '../types'
import type { SearchFormData, ListQueryParams, ListResponse } from '../types'

interface UseResourcePageOptions {
  actions?: TableAction[]
  /** 加载表格数据的函数 */
  loadDataFn?: (params: ListQueryParams) => Promise<ListResponse>
  /** 加载左侧资源列表的函数（可选，如果不提供则不显示左侧列表） */
  loadResourceListFn?: () => Promise<ResourceItem[]>
}

/**
 * 资源页面通用逻辑 Hook
 */
export const useResourcePage = (options: UseResourcePageOptions = {}) => {
  const { actions = [], loadDataFn, loadResourceListFn } = options

  // 搜索表单
  const searchForm = ref<SearchFormData>({
    name: '',
    type: ''
  })

  // 左侧资源列表
  const selectedResourceId = ref<string | number>('')
  const resourceListItems = ref<ResourceItem[]>([])
  const resourceListLoading = ref(false)

  // 表格数据
  const loading = ref(false)
  const tableData = ref<TableDataItem[]>([])

  // 分页
  const pagination = reactive<PaginationData>({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 加载左侧资源列表
  const loadResourceList = async () => {
    if (!loadResourceListFn) return

    resourceListLoading.value = true
    try {
      resourceListItems.value = await loadResourceListFn()
      // 默认选中第一项
      if (resourceListItems.value.length > 0) {
        selectedResourceId.value = resourceListItems.value[0].id
      }
    } catch (error) {
      console.error('加载资源列表失败:', error)
    } finally {
      resourceListLoading.value = false
    }
  }

  // 加载表格数据
  const loadTableData = async () => {
    if (!loadDataFn) {
      console.warn('未提供 loadDataFn，无法加载数据')
      return
    }

    loading.value = true
    try {
      const params: ListQueryParams = {
        ...searchForm.value,
        resourceId: selectedResourceId.value,
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      const res = await loadDataFn(params)
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

  // 搜索
  const handleSearch = () => {
    pagination.page = 1
    loadTableData()
  }

  // 重置
  const handleReset = () => {
    searchForm.value = { name: '', type: '' }
    pagination.page = 1
    loadTableData()
  }

  // 资源选择
  const handleResourceSelect = () => {
    pagination.page = 1
    loadTableData()
  }

  // 分页改变
  const handlePageChange = (page: number, pageSize: number) => {
    pagination.page = page
    pagination.pageSize = pageSize
    loadTableData()
  }

  // 初始化
  const init = async () => {
    await loadResourceList()
    await loadTableData()
  }

  return {
    // 配置
    actions,

    // 数据
    searchForm,
    selectedResourceId,
    resourceListItems,
    resourceListLoading,
    loading,
    tableData,
    pagination,

    // 方法
    loadResourceList,
    loadTableData,
    handleSearch,
    handleReset,
    handleResourceSelect,
    handlePageChange,
    init
  }
}
