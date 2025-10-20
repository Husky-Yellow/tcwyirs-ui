<template>
  <ContentWrap shadow="always">
      <el-table v-loading="loading" :data="tableData">
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
        <el-table-column v-if="actions && actions.length > 0" align="center" label="操作" :width="actionColumnWidth">
          <template #default="{ row }">
            <template v-for="(action, index) in actions" :key="index">
              <el-button
                v-if="isActionVisible(action, row)"
                :link="action.link !== false"
                :type="action.type || 'primary'"
                @click="action.onClick(row)"
              >
                {{ action.label }}
              </el-button>
            </template>
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
import type { TableAction } from '../types'

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
  actions?: TableAction[]
  paginationData?: PaginationData
  actionColumnWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  loading: false,
  actions: () => [],
  paginationData: () => ({ page: 1, pageSize: 10, total: 0 }),
  actionColumnWidth: 150
})

const emit = defineEmits<{
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

// 判断操作项是否显示
const isActionVisible = (action: TableAction, row: ResourceData) => {
  if (action.show) {
    return action.show(row)
  }
  return true
}

const handleSizeChange = (pageSize: number) => {
  emit('page-change', pagination.value.page, pageSize)
}

const handleCurrentChange = (page: number) => {
  emit('page-change', page, pagination.value.pageSize)
}
</script>
