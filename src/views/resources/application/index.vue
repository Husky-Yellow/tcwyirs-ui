<template>
  <div>
    <!-- 页面标题 -->
    <h2 class="mb-24px text-20px text-[#303133] font-600">应用资源管理</h2>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 mb-24px gap-16px">
      <el-card shadow="hover">
        <div class="flex flex-col">
          <div class="mb-8px text-14px text-[#909399]">访问总量</div>
          <div class="text-24px text-[#303133] font-600">{{ statistics.visitCount }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex flex-col">
          <div class="mb-8px text-14px text-[#909399]">申请总量</div>
          <div class="text-24px text-[#303133] font-600">{{ statistics.applyCount }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex flex-col">
          <div class="mb-8px text-14px text-[#909399]">综合平均分</div>
          <div class="text-24px text-[#303133] font-600">{{ statistics.avgScore }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="flex flex-col">
          <div class="mb-8px text-14px text-[#909399]">未上架资源</div>
          <div class="text-24px text-[#303133] font-600">{{ statistics.unpublishedCount }}</div>
        </div>
      </el-card>
    </div>

    <!-- 搜索表单 -->
    <ContentWrap shadow="always" class="mb-16px">
      <el-form :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable class="!w-240px" />
        </el-form-item>
        <el-form-item label="资源标签">
          <el-select v-model="searchForm.type" placeholder="全部" clearable class="!w-240px">
            <el-option label="全部" value="" />
            <el-option label="数据库" value="database" />
            <el-option label="缓存" value="cache" />
            <el-option label="消息队列" value="mq" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable class="!w-240px">
            <el-option label="全部" value="" />
            <el-option label="未上架" :value="0" />
            <el-option label="上架中" :value="1" />
            <el-option label="已上架" :value="2" />
            <el-option label="已下架" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">
            <Icon icon="ep:refresh" class="mr-6px" />
            重置
          </el-button>
          <el-button type="primary" @click="handleSearch">
            <Icon icon="ep:search" class="mr-6px" />
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 资源列表 -->
    <div class="mb-16px flex items-center justify-between">
      <div class="text-16px text-[#303133] font-600">资源列表</div>
      <el-button type="primary" @click="handleCreate">
        <Icon icon="ep:plus" class="mr-6px" />
        新增应用资源
      </el-button>
    </div>

    <!-- 表格 -->
    <ContentWrap shadow="always">
      <el-table v-loading="loading" :data="tableData"   stripe border >
        <el-table-column prop="name" label="资源名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="tags" label="资源标签" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.tags">{{ row.tags }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visitCount" label="访问量" width="100" align="center" />
        <el-table-column prop="applyCount" label="申请量" width="100" align="center" />
        <el-table-column prop="status" label="上架状态" width="120" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-6px">
              <span class="h-6px w-6px rounded-full" :class="getStatusDotClass(row.status)"></span>
              <span class="text-14px" :class="getStatusTextClass(row.status)">
                {{ getStatusText(row.status) }}
              </span>
            </div>
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
            <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 2 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 2 ? '下架' : '上架' }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-16px flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'
import { ResourceType } from '@/api/resource/types'
import { getResourceInfoPage, deleteResourceInfo } from '@/api/resource/info'

defineOptions({ name: 'ApplicationResource' })

// 统计数据
const statistics = ref({
  visitCount: 2379,
  applyCount: 1326,
  avgScore: 81.6,
  unpublishedCount: 12
})

// 搜索表单
const searchForm = ref({
  name: '',
  type: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 状态映射
const STATUS_MAP = {
  0: { text: '未上架', dot: 'bg-[#909399]', color: 'text-[#909399]' },
  1: { text: '上架中', dot: 'bg-[#409eff]', color: 'text-[#409eff]' },
  2: { text: '已上架', dot: 'bg-[#67c23a]', color: 'text-[#67c23a]' },
  3: { text: '已下架', dot: 'bg-[#e6a23c]', color: 'text-[#e6a23c]' }
}

const getStatusText = (status: number) => STATUS_MAP[status]?.text || '未知'
const getStatusDotClass = (status: number) => STATUS_MAP[status]?.dot || 'bg-[#909399]'
const getStatusTextClass = (status: number) => STATUS_MAP[status]?.color || 'text-[#909399]'

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getResourceInfoPage({
      name: searchForm.value.name,
      type: ResourceType.APPLICATION,
      status: searchForm.value.status,
      pageNo: pagination.value.page,
      pageSize: pagination.value.pageSize
    })

    tableData.value = res.list.map((item: any) => ({
      ...item,
      tags: item.tags?.join(', ') || '标签一',
      visitCount: Math.floor(Math.random() * 1000),
      applyCount: Math.floor(Math.random() * 100),
      creator: item.creator || '小良'
    }))

    pagination.value.total = res.total
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.value = { name: '', type: '', status: '' }
  pagination.value.page = 1
  loadData()
}

// 分页
const handlePageChange = () => {
  loadData()
}

// 新增
const handleCreate = () => {
  ElMessage.info('新增应用资源')
}

// 详情
const handleDetail = (row: any) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑: ${row.name}`)
}

// 上架/下架
const handleToggleStatus = async (row: any) => {
  const action = row.status === 2 ? '下架' : '上架'
  ElMessage.info(`${action}: ${row.name}`)
}

// 删除
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

// 初始化
onMounted(() => {
  loadData()
})
</script>
