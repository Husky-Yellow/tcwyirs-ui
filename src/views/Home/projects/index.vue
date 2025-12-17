<template>
  <ContentWrap>
    <!-- 搜索栏 -->
    <Search
      :schema="searchSchema"
      :model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />
  </ContentWrap>

  <!-- 项目列表 -->
  <ContentWrap shadow="always" class="mt-16px">
    <div class="flex justify-between pb-20px">
      <div class="text-lg font-bold">资源使用详情</div>
      <!-- 项目经理显示 -->
      <div>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增项目</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      @row-click="handleView"
      style="cursor: pointer"
    >
      <el-table-column align="center" label="项目名称" prop="name" show-overflow-tooltip />
      <el-table-column align="center" label="项目描述" prop="description" show-overflow-tooltip />
      <el-table-column align="center" label="负责人" prop="leaderName" />
      <el-table-column align="center" label="项目状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" prop="startTime" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="handleView(row)">详情</el-button>
          <!-- 项目经理 -->
          <el-button link type="primary" @click.stop="handleEdit(row)">编辑</el-button>
          <!-- 项目经理 -->
          <el-button link type="danger" @click.stop="handleDelete(row)">删除</el-button>
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

  <!-- 项目表单抽屉 -->
  <ProjectFormDrawer ref="projectFormDrawerRef" @success="handleSuccess" />
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import type { FormSchema } from '@/types/data'
import { formatDate } from '@/utils/formatTime'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProjectPage, deleteProject } from '@/api/resource/project'
import type { ProjectVO } from '@/api/resource/project'
import ProjectFormDrawer from './components/ProjectFormDrawer.vue'

defineOptions({ name: 'HomeProjects' })

const router = useRouter()

// 项目表单抽屉引用
const projectFormDrawerRef = ref<InstanceType<typeof ProjectFormDrawer>>()

// 搜索表单数据
const searchForm = ref({
  name: '',
  status: undefined
})

// 搜索表单配置
const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'name',
    label: '项目名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入项目名称',
      clearable: true
    }
  },
  {
    field: 'status',
    label: '项目状态',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      class: 'w-220px!',
      options: [
        { label: '全部', value: undefined },
        { label: '进行中', value: 1 },
        { label: '已完成', value: 2 },
        { label: '已暂停', value: 3 }
      ]
    }
  }
])

// 表格数据
const loading = ref(false)
const tableData = ref<ProjectVO[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取状态类型
const getStatusType = (status: number | undefined) => {
  const statusMap = {
    1: 'success',
    2: 'info',
    3: 'warning'
  }
  return statusMap[status || 1] || 'info'
}

// 获取状态文本
const getStatusText = (status: number | undefined) => {
  const statusMap = {
    1: '进行中',
    2: '已完成',
    3: '已暂停'
  }
  return statusMap[status || 1] || '未知'
}

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined) => {
  if (!dateTime) return '-'
  return formatDate(new Date(dateTime), 'YYYY-MM-DD')
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getProjectPage({
      ...searchForm.value,
      pageNo: pagination.page,
      pageSize: pagination.pageSize
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('加载项目列表失败:', error)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleView = (row: ProjectVO) => {
  router.push({
    name: 'ProjectDetail',
    params: { id: row.id }
  })
}

// 新增项目
const handleAdd = () => {
  projectFormDrawerRef.value?.open()
}

// 编辑项目
const handleEdit = (row: ProjectVO) => {
  projectFormDrawerRef.value?.open(row)
}

// 表单提交成功
const handleSuccess = () => {
  loadData()
}

// 删除项目
const handleDelete = async (row: ProjectVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除项目"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteProject(row.id!)
    ElMessage.success('删除成功')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 搜索
const handleSearch = (values: any) => {
  searchForm.value = values
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = (values: any) => {
  searchForm.value = values
  pagination.page = 1
  loadData()
}

// 分页改变
const handleSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  loadData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>
