<template>
  <ContentWrap>
    <div class="mb-16px flex items-center justify-between">
      <div class="text-16px text-[#303133] font-600">资源列表</div>
      <!-- 操作按钮插槽 -->
      <slot name="actions">
        <!-- 默认按钮 -->
        <el-button type="primary" @click="handleCreate">
          <Icon icon="ep:plus" class="mr-6px" />
          {{ createButtonText }}
        </el-button>
      </slot>
    </div>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="name" label="资源名称" min-width="180" show-overflow-tooltip />
      <el-table-column prop="tags" label="资源标签" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.tags">{{ row.tags }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="visitCount" label="访问量" width="100" align="center" />
      <el-table-column prop="applyCount" label="申请量" width="100" align="center" />
      <el-table-column label="上架状态" align="center" prop="publishStatus">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PRODUCT_LISTING_STATUS" :value="row.publishStatus" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="creator" label="创建人" width="100" />
      <el-table-column prop="createTime" label="上架时间" width="180" sortable>
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right" align="center">
        <template #default="{ row }">
          <!-- 详情按钮 - 所有状态都显示 -->
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>

          <!-- 待审批状态（上架中）：只显示详情 -->
          <template v-if="row.publishStatus === 1">
            <!-- 仅显示详情，无其他按钮 -->
          </template>

          <!-- 已发布状态（已上架）：显示下架 -->
          <template v-else-if="row.publishStatus === 2">
            <el-button link type="warning" @click="handleToggleStatus(row)">下架</el-button>
          </template>

          <!-- 其他状态（草稿/已下架/已驳回）：显示编辑、上架、删除 -->
          <template v-else>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handleToggleStatus(row)">上架</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-16px flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import type { ResourceTagVO } from '@/api/resource/tag'

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface Props {
  loading: boolean
  tableData: any[]
  pagination: Pagination
  tagList?: ResourceTagVO[]
  createButtonText?: string
}

interface Emits {
  (e: 'create'): void
  (e: 'detail', row: any): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'toggle-status', row: any): void
  (e: 'update:pagination', value: Pagination): void
}

const props = withDefaults(defineProps<Props>(), {
  createButtonText: '新增资源',
  tagList: () => []
})

const emit = defineEmits<Emits>()

// 可写的计算属性用于双向绑定
const currentPage = computed({
  get: () => props.pagination.page,
  set: (val) => {
    emit('update:pagination', { ...props.pagination, page: val })
  }
})

const pageSize = computed({
  get: () => props.pagination.pageSize,
  set: (val) => {
    emit('update:pagination', { ...props.pagination, pageSize: val, page: 1 })
  }
})

// 根据标签ID获取标签名称
const getTagName = (tagId: number | string | undefined) => {
  if (!tagId) return ''
  const tag = props.tagList?.find(t => t.id === Number(tagId))
  return tag?.name || ''
}

const handleCreate = () => {
  emit('create')
}

const handleDetail = (row: any) => {
  emit('detail', row)
}

const handleEdit = (row: any) => {
  emit('edit', row)
}

const handleDelete = (row: any) => {
  emit('delete', row)
}

const handleToggleStatus = (row: any) => {
  emit('toggle-status', row)
}
</script>
