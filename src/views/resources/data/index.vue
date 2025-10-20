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
  <ResourceTable
    :actions="actions"
    :loading="loading"
    :pagination-data="pagination"
    :table-data="tableData"
    @page-change="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import type { FormSchema } from '@/types/form'
import ResourceTable from '../components/ResourceTable.vue'
import { useResourcePage } from '../composables/useResourcePage'
import type { TableDataItem, TableAction } from '../types'

defineOptions({ name: 'DataResource' })

// 搜索表单数据
const searchForm = ref({
  name: '',
  type: ''
})

// 搜索表单配置
const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'name',
    label: '资源名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true
    }
  },
  {
    field: 'type',
    label: '资源类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      options: [
        { label: '全部', value: '' },
        { label: '数据库', value: 'database' },
        { label: '数据仓库', value: 'warehouse' },
        { label: 'API', value: 'api' }
      ]
    }
  }
])

// 操作项配置（数据资源只有详情和编辑，没有部署）
const actions: TableAction[] = [
  {
    label: '详情',
    type: 'primary',
    onClick: (row: TableDataItem) => {
      console.log('查看详情:', row)
      // TODO: 实现详情逻辑
    }
  },
  {
    label: '编辑',
    type: 'primary',
    onClick: (row: TableDataItem) => {
      console.log('编辑:', row)
      // TODO: 实现编辑逻辑
    }
  }
]

// 使用通用逻辑
const {
  loading,
  tableData,
  pagination,
  handlePageChange,
  init
} = useResourcePage({ actions })

// 搜索
const handleSearch = (values: any) => {
  searchForm.value = values
  init()
}

// 重置
const handleReset = (values: any) => {
  searchForm.value = values
  init()
}

// 初始化
onMounted(() => {
  init()
})
</script>
