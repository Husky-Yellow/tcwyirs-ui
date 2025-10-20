import { ref, reactive } from 'vue'
import type { ResourceItem, TableDataItem, PaginationData, TableAction } from '../types'

interface UseResourcePageOptions {
  actions?: TableAction[]
  loadDataFn?: (params: any) => Promise<{ list: TableDataItem[]; total: number }>
}

/**
 * 资源页面通用逻辑 Hook
 */
export const useResourcePage = (options: UseResourcePageOptions = {}) => {
  const { actions = [], loadDataFn } = options

  // 搜索表单
  const searchForm = ref({
    name: '',
    type: ''
  })

  // 左侧资源列表
  const selectedResourceId = ref<string | number>('')
  const resourceListItems = ref<ResourceItem[]>([
    { id: 1, name: '订一号车吉林分管理公司' },
    { id: 2, name: '订一号车哈尔滨管理公司' },
    { id: 3, name: '订一号车长春管理公司' },
    { id: 4, name: '订一号车沈阳管理公司' },
    { id: 5, name: '订一号车大连管理公司' },
    { id: 6, name: '订一号车辽宁管理公司' }
  ])

  // 表格数据
  const loading = ref(false)
  const tableData = ref<TableDataItem[]>([])

  // 分页
  const pagination = reactive<PaginationData>({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 加载表格数据
  const loadTableData = async () => {
    loading.value = true
    try {
      if (loadDataFn) {
        const res = await loadDataFn({
          ...searchForm.value,
          resourceId: selectedResourceId.value,
          page: pagination.page,
          pageSize: pagination.pageSize
        })
        tableData.value = res.list
        pagination.total = res.total
      } else {
        // 默认模拟数据
        tableData.value = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `订一号车吉林分管理公司${i + 1}`,
          address: '线路一默认版',
          description: '线路一默认版',
          createTime: '2017-10-31 23:12:00'
        }))
        pagination.total = 100
      }
    } catch (error) {
      console.error('加载数据失败:', error)
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
  const init = () => {
    if (resourceListItems.value.length > 0) {
      selectedResourceId.value = resourceListItems.value[0].id
    }
    loadTableData()
  }

  return {
    // 配置
    actions,

    // 数据
    searchForm,
    selectedResourceId,
    resourceListItems,
    loading,
    tableData,
    pagination,

    // 方法
    loadTableData,
    handleSearch,
    handleReset,
    handleResourceSelect,
    handlePageChange,
    init
  }
}
