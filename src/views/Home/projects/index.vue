<template>
  <div class="p-20px bg-#f5f6fa min-h-[calc(100vh-56px)]">
    <!-- 页面标题 -->
    <div class="text-20px font-600 text-#333 mb-20px">项目管理</div>

    <!-- 搜索表单区域 -->
    <div class="bg-white p-20px rounded-8px border-2 border-solid border-#1677ff mb-20px">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="项目名称:">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入"
            clearable
            class="!w-200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="项目状态:">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-200px">
            <el-option label="全部" value="" />
            <el-option label="进行中" value="1" />
            <el-option label="已完结" value="2" />
            <el-option label="已到期" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表区域 -->
    <div class="bg-white p-20px rounded-8px">
      <!-- 标题和新增按钮 -->
      <div class="flex justify-between items-center mb-20px">
        <span class="text-16px font-500 text-#333">项目列表</span>
        <el-button type="primary" @click="handleAdd">
          <el-icon class="mr-5px"><Plus /></el-icon>
          新增项目
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="projectList" stripe class="mb-20px">
        <el-table-column prop="projectNo" label="项目编号" width="150" />
        <el-table-column
          prop="projectName"
          label="项目名称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="projectType" label="项目类型" width="120" />
        <el-table-column prop="projectManager" label="项目经理" width="120" />
        <el-table-column label="项目状态" width="120">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              effect="plain"
              size="small"
              class="inline-flex items-center gap-6px rounded-4px"
            >
              <span
                class="w-6px h-6px rounded-50% inline-block"
                :class="getStatusDotClass(row.status)"
              ></span>
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="项目周期" width="220" sortable>
          <template #default="{ row }"> {{ row.startDate }}~{{ row.endDate }} </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-center mt-20px">
        <el-pagination
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="prev, pager, next"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

defineOptions({ name: 'ProjectManagement' })

// ================== 响应式数据 ==================
const loading = ref(false)
const total = ref(0)

// 查询参数
const queryParams = reactive({
  projectName: '',
  status: '',
  pageNo: 1,
  pageSize: 10
})

// 项目列表数据
const projectList = ref([
  {
    id: 1,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '1',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 2,
    projectNo: 'SZPID000001',
    projectName: '这是一个超长这是一个...',
    projectType: '类型1',
    projectManager: '利存续',
    status: '1',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 3,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '1',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 4,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '1',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 5,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '1',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 6,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '2',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 7,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '3',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 8,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '3',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  },
  {
    id: 9,
    projectNo: 'SZPID000001',
    projectName: '项目名称1',
    projectType: '类型1',
    projectManager: '段本初',
    status: '3',
    startDate: '2025-01-12',
    endDate: '2025-06-12'
  }
])

// ================== 方法 ==================
// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    '1': 'primary',
    '2': 'success',
    '3': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态点样式类
const getStatusDotClass = (status: string) => {
  const classMap: Record<string, string> = {
    '1': 'bg-#1677ff',
    '2': 'bg-#67c23a',
    '3': 'bg-#f56c6c'
  }
  return classMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    '1': '进行中',
    '2': '已完结',
    '3': '已到期'
  }
  return textMap[status] || '未知'
}

// 查询
const handleQuery = () => {
  loading.value = true
  // TODO: 调用API获取数据
  setTimeout(() => {
    total.value = 45
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  queryParams.projectName = ''
  queryParams.status = ''
  queryParams.pageNo = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开新增项目弹窗')
  // TODO: 实现新增项目功能
}

// 详情
const handleDetail = (row: any) => {
  ElMessage.info(`查看项目详情: ${row.projectName}`)
  // TODO: 实现查看详情功能
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑项目: ${row.projectName}`)
  // TODO: 实现编辑项目功能
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除项目"${row.projectName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    handleQuery()
  } catch (error) {
    // 用户取消
  }
}

// ================== 生命周期 ==================
onMounted(() => {
  handleQuery()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 400;
  color: #333;
}

:deep(.el-table__header) {
  th {
    background: #f5f7fa;
    color: #333;
    font-weight: 500;
  }
}
</style>
