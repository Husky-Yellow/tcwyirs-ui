<template>
  <div>
    <!-- 页面标题 -->
    <h2 class="mb-24px text-20px text-[#303133] font-600">组件资源管理</h2>

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
            <el-option label="线路一" value="route1" />
            <el-option label="线路二" value="route2" />
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
        新增组件资源
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

    <!-- 新增/编辑抽屉 -->
    <Drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑组件资源' : '新增组件资源'"
      size="800px"
      direction="rtl"
      :close-on-click-modal="false"
      @close="handleDrawerClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <!-- 资源信息 -->
        <div class="form-section-title">资源信息</div>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资源名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源性质" prop="nature">
              <el-input v-model="formData.nature" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应方式" prop="supplyMethod">
              <el-input v-model="formData.supplyMethod" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="formData.contactPerson" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系方式" prop="contactInfo">
              <el-input v-model="formData.contactInfo" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总数量" prop="totalCount">
              <el-input v-model="formData.totalCount" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="引用说明" prop="referenceDesc">
          <el-input v-model="formData.referenceDesc" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="资源介绍" prop="introduction">
          <el-input
            v-model="formData.introduction"
            type="textarea"
            :rows="4"
            placeholder="请输入简介"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="介绍封面" prop="coverImage">
          <el-upload
            v-model:file-list="coverImageList"
            :action="uploadAction"
            list-type="picture-card"
            :limit="1"
          >
            <Icon icon="ep:plus" class="text-24px" />
            <template #tip>
              <div class="el-upload__tip">支持 png, jpg, jpeg 格式，不超过 20 MB</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="程式" prop="program">
          <el-input v-model="formData.program" placeholder="请输入简介" />
        </el-form-item>

        <!-- 数据提供 -->
        <div class="form-section-title mt-24px">数据提供</div>

        <el-form-item label="请求URL" prop="requestUrl">
          <el-input v-model="formData.requestUrl" placeholder="GET">
            <template #prepend>GET</template>
          </el-input>
        </el-form-item>

        <!-- 请求参数 -->
        <el-form-item label="请求参数">
          <div class="w-full">
            <el-table :data="formData.requestParams" border class="mb-12px">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="参数名称" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.name" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="参数类型" min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.type" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="参数说明" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.description" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="是否必填" width="100" align="center">
                <template #default="{ row }">
                  <el-checkbox v-model="row.required" />
                </template>
              </el-table-column>
              <el-table-column label="参数位置" min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.position" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="实现标准依据" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.standard" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="{ $index }">
                  <el-button link type="primary" size="small" @click="addRequestParam($index)">
                    添加下部
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="removeRequestParam($index)"
                    :disabled="formData.requestParams.length === 1"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button text @click="addRequestParam()">
              <Icon icon="ep:plus" class="mr-4px" />
              添加一行
            </el-button>
          </div>
        </el-form-item>

        <!-- 返回参数 -->
        <el-form-item label="返回参数">
          <div class="w-full">
            <el-table :data="formData.responseParams" border class="mb-12px">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="参数名称" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.name" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="参数类型" min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.type" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="参数说明" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.description" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="是否必填" width="100" align="center">
                <template #default="{ row }">
                  <el-checkbox v-model="row.required" />
                </template>
              </el-table-column>
              <el-table-column label="参数位置" min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.position" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="实现标准依据" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.standard" placeholder="请输入" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="{ $index }">
                  <el-button link type="primary" size="small" @click="addResponseParam($index)">
                    添加下部
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="removeResponseParam($index)"
                    :disabled="formData.responseParams.length === 1"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button text @click="addResponseParam()">
              <Icon icon="ep:plus" class="mr-4px" />
              添加一行
            </el-button>
          </div>
        </el-form-item>

        <!-- 示例代码 -->
        <el-form-item label="示例代码" prop="sampleCode">
          <el-input
            v-model="formData.sampleCode"
            type="textarea"
            :rows="8"
            placeholder="请输入示例代码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="handleDrawerClose">取消</el-button>
          <el-button type="primary" @click="handleSave(false)">保存</el-button>
          <el-button type="success" @click="handleSave(true)">直接提交上架</el-button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'
import { ResourceType } from '@/api/resource/types'
import {
  getResourceInfoPage,
  deleteResourceInfo,
  createResourceInfo,
  updateResourceInfo,
  type ResourceInfoVO
} from '@/api/resource/info'

defineOptions({ name: 'ComponentResource' })

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

// 抽屉状态
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const coverImageList = ref([])
const uploadAction = ref(import.meta.env.VITE_UPLOAD_URL || '/api/upload')

// 参数接口
interface ParamItem {
  name: string
  type: string
  description: string
  required: boolean
  position: string
  standard: string
}

// 表单数据
const formData = reactive({
  // ID（编辑时使用）
  id: undefined as number | undefined,
  // 资源信息
  name: '',
  nature: '',
  supplyMethod: '',
  contactPerson: '',
  contactInfo: '',
  totalCount: '',
  referenceDesc: '',
  introduction: '',
  coverImage: '',
  program: '',
  // 数据提供
  requestUrl: '',
  requestParams: [
    { name: '', type: '', description: '', required: false, position: '', standard: '' }
  ] as ParamItem[],
  responseParams: [
    { name: '', type: '', description: '', required: false, position: '', standard: '' }
  ] as ParamItem[],
  sampleCode: ''
})

// 表单验证规则
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' }
  ]
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
      type: ResourceType.COMPONENT,
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

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.name = ''
  formData.nature = ''
  formData.supplyMethod = ''
  formData.contactPerson = ''
  formData.contactInfo = ''
  formData.totalCount = ''
  formData.referenceDesc = ''
  formData.introduction = ''
  formData.coverImage = ''
  formData.program = ''
  formData.requestUrl = ''
  formData.requestParams = [
    { name: '', type: '', description: '', required: false, position: '', standard: '' }
  ]
  formData.responseParams = [
    { name: '', type: '', description: '', required: false, position: '', standard: '' }
  ]
  formData.sampleCode = ''
  coverImageList.value = []
}

// 添加请求参数
const addRequestParam = (index?: number) => {
  const newParam = { name: '', type: '', description: '', required: false, position: '', standard: '' }
  if (index !== undefined) {
    formData.requestParams.splice(index + 1, 0, newParam)
  } else {
    formData.requestParams.push(newParam)
  }
}

// 删除请求参数
const removeRequestParam = (index: number) => {
  if (formData.requestParams.length > 1) {
    formData.requestParams.splice(index, 1)
  }
}

// 添加返回参数
const addResponseParam = (index?: number) => {
  const newParam = { name: '', type: '', description: '', required: false, position: '', standard: '' }
  if (index !== undefined) {
    formData.responseParams.splice(index + 1, 0, newParam)
  } else {
    formData.responseParams.push(newParam)
  }
}

// 删除返回参数
const removeResponseParam = (index: number) => {
  if (formData.responseParams.length > 1) {
    formData.responseParams.splice(index, 1)
  }
}

// 新增
const handleCreate = () => {
  isEdit.value = false
  resetForm()
  drawerVisible.value = true
}

// 详情
const handleDetail = (row: any) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true
  // 加载表单数据
  formData.id = row.id
  formData.name = row.name || ''
  formData.nature = row.nature || ''
  formData.supplyMethod = row.supplyMethod || ''
  formData.contactPerson = row.contactPerson || ''
  formData.contactInfo = row.contactInfo || ''
  formData.totalCount = row.totalCount || ''
  formData.referenceDesc = row.referenceDesc || ''
  formData.introduction = row.introduction || row.description || ''
  formData.program = row.program || ''
  formData.requestUrl = row.componentExt?.requestUrl || ''
  formData.sampleCode = row.componentExt?.sampleCode || ''

  // 加载封面图片
  if (row.icon) {
    formData.coverImage = row.icon
    coverImageList.value = [{ name: '封面图片', url: row.icon }]
  }

  // 加载请求参数
  if (row.componentExt?.inputParamsJson?.length) {
    formData.requestParams = row.componentExt.inputParamsJson
  }

  // 加载返回参数
  if (row.componentExt?.outputParamsJson?.length) {
    formData.responseParams = row.componentExt.outputParamsJson
  }

  drawerVisible.value = true
}

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
  resetForm()
}

// 保存
const handleSave = async (publish: boolean) => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 构建请求数据
    const requestData: ResourceInfoVO = {
      name: formData.name,
      type: ResourceType.COMPONENT,
      description: formData.introduction,
      icon: formData.coverImage,
      componentExt: {
        requestMethod: 1, // 默认 GET
        requestUrl: formData.requestUrl,
        sampleCode: formData.sampleCode,
        inputParamsJson: formData.requestParams,
        outputParamsJson: formData.responseParams
      }
    }

    // 如果是编辑，添加 ID
    if (isEdit.value && formData.id) {
      requestData.id = formData.id
    }

    // 调用创建或更新接口
    if (isEdit.value) {
      await updateResourceInfo(requestData)
    } else {
      await createResourceInfo(requestData)
    }

    const action = publish ? '提交上架' : (isEdit.value ? '编辑' : '保存')
    ElMessage.success(`${action}成功!`)

    drawerVisible.value = false
    await loadData()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
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

<style scoped lang="scss">
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}

.mt-24px {
  margin-top: 24px;
}
</style>
