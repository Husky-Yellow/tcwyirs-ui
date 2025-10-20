<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column align="center" label="资源名称" prop="name" show-overflow-tooltip />
      <el-table-column align="center" label="资源标签" prop="address" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag>{{ row.address }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="资源描述" prop="description" show-overflow-tooltip />
      <el-table-column align="center" label="浏览时间" prop="createTime" width="180" sortable>
        <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="showDeploy" link type="primary" @click="handleDeploy(row)">
            部署/编排
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
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'ResourceTable' })

interface ResourceData {
  id: string | number
  name: string
  address: string
  description: string
  createTime: string
  [key: string]: any
}

interface PaginationData {
  page: number
  pageSize: number
  total: number
}

interface Props {
  tableData?: ResourceData[]
  loading?: boolean
  showDeploy?: boolean
  paginationData?: PaginationData
}

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  loading: false,
  showDeploy: false,
  paginationData: () => ({ page: 1, pageSize: 10, total: 0 })
})

const emit = defineEmits<{
  (e: 'detail', row: ResourceData): void
  (e: 'edit', row: ResourceData): void
  (e: 'deploy', row: ResourceData): void
  (e: 'page-change', page: number, pageSize: number): void
}>()

const pagination = ref<PaginationData>({ ...props.paginationData })

watch(
  () => props.paginationData,
  (newVal) => {
    pagination.value = { ...newVal }
  },
  { deep: true }
)

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

const handleDetail = (row: ResourceData) => {
  emit('detail', row)
}

const handleEdit = (row: ResourceData) => {
  emit('edit', row)
}

const handleDeploy = (row: ResourceData) => {
  emit('deploy', row)
}

const handleSizeChange = (pageSize: number) => {
  emit('page-change', pagination.value.page, pageSize)
}

const handleCurrentChange = (page: number) => {
  emit('page-change', page, pagination.value.pageSize)
}
</script>
