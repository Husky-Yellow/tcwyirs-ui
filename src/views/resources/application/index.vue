<template>
  <div class="resource-page">
    <!-- 搜索栏 -->
    <ResourceSearchBar
      v-model="searchForm"
      :type-options="typeOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 主体内容 -->
    <ContentWrap>
      <div class="resource-content">
        <!-- 右侧数据表格 -->
        <div class="resource-main">
          <ResourceTable
            :loading="loading"
            :pagination-data="pagination"
            :show-deploy="showDeploy"
            :table-data="tableData"
            @detail="handleDetail"
            @deploy="handleDeploy"
            @edit="handleEdit"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import ResourceSearchBar from '../components/ResourceSearchBar.vue'
import ResourceTable from '../components/ResourceTable.vue'
import { useResourcePage } from '../composables/useResourcePage'

defineOptions({ name: 'ApplicationResource' })

// 资源类型选项
const typeOptions = ref([
  { label: '全部', value: '' },
  { label: '数据库', value: 'database' },
  { label: '缓存', value: 'cache' },
  { label: '消息队列', value: 'mq' }
])

// 使用通用逻辑
const {
  showDeploy,
  searchForm,
  loading,
  tableData,
  pagination,
  handleSearch,
  handleReset,
  handlePageChange,
  handleDetail,
  handleEdit,
  handleDeploy,
  init
} = useResourcePage({ showDeploy: true })

// 初始化
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.resource-page {
  padding: 0;
}

.resource-content {
  display: flex;
  gap: 16px;
  min-height: 500px;
}

.resource-main {
  flex: 1;
  min-width: 0;
}
</style>
