<template>
  <div class="min-h-screen">
    <BackHeader :title="pageTitle">
      <template #right>
        <div class="ml-auto flex items-center gap-12px">
          <el-button v-hasPermi="['resource:info:create']" @click.stop="handleEdit">编辑</el-button>
          <el-button type="danger" v-hasPermi="['resource:info:delete']" @click.stop="handleDelete">删除</el-button>
          <el-button type="danger" v-hasPermi="['resource:info:usage-status']" @click.stop="handleUpateStatus">停用</el-button>
          <el-button type="primary" v-hasPermi="['resource:publish-apply:publish']" @click.stop="handleToggleStatus">
            {{ resourceData?.baseInfo.publishStatus === 2 ? '下架' : '上架' }}
          </el-button>
          <el-button type="primary" @click.stop="handleConsult">咨询资源介绍</el-button>
        </div>
      </template>
    </BackHeader>

    <!-- 详情内容 -->
    <div v-loading="loading" class="min-h-500px">
      <!-- 根据资源类型动态加载对应的详情组件 -->
      <component
        :is="detailComponent"
        v-if="resourceData"
        :data="resourceData"
        @refresh="loadData"
      />
      <el-empty v-else description="暂无数据" />
    </div>

    <!-- 编辑表单 -->
    <DataResourceForm
      v-if="resourceData?.baseInfo.type === ResourceType.DATA"
      v-model="formVisible"
      :data="currentFormData"
      :is-edit="true"
      :tag-list="[]"
      @save="handleFormSave"
    />
    <ApplicationForm
      v-if="resourceData?.baseInfo.type === ResourceType.APPLICATION"
      v-model="formVisible"
      :data="currentFormData"
      :is-edit="true"
      @save="handleFormSave"
    />
    <SubassemblyForm
      v-if="resourceData?.baseInfo.type === ResourceType.COMPONENT"
      v-model="formVisible"
      :data="currentFormData"
      :is-edit="true"
      @save="handleFormSave"
    />

    <!-- 下架弹窗 -->
    <UnpublishDialog ref="unpublishDialogRef" @confirm="handleUnpublishConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BackHeader } from '@/layout/components/PageHeader'
import {
  getResourceDetail,
  deleteResourceInfo,
  createResourceInfo
} from '@/api/resource/info'
import {
  updateResourceUsageStatus
} from '@/api/resource/usage'
import type { ResourceDetailRespVO } from '@/api/resource/info'
import { ResourceType } from '@/api/resource/types'
import { createPublishApply, offlineResource } from '@/api/resource/publish-apply'
import ComponentDetail from './components/ComponentDetail.vue'
import DataDetail from './components/DataDetail.vue'
import ApplicationDetail from './components/ApplicationDetail.vue'
import DataResourceForm from '../data/components/DataResourceForm.vue'
import ApplicationForm from '../application/components/ApplicationForm.vue'
import SubassemblyForm from '../subassembly/SubassemblyForm.vue'
import UnpublishDialog from '../components/UnpublishDialog.vue'

defineOptions({ name: 'ResourceDetail' })

const route = useRoute()
const router = useRouter()

// 资源数据
const loading = ref(false)
const resourceData = ref<ResourceDetailRespVO | null>(null)

// 表单相关
const formVisible = ref(false)
const currentFormData = ref<any>(null)
const unpublishDialogRef = ref()

// 根据资源类型获取对应的详情组件
const detailComponent = computed(() => {
  if (!resourceData.value) return null

  switch (resourceData.value.baseInfo.type) {
    case ResourceType.DATA:
      return DataDetail
    case ResourceType.APPLICATION:
      return ApplicationDetail
    case ResourceType.COMPONENT:
      return ComponentDetail
    default:
      return null
  }
})

// 页面标题
const pageTitle = computed(() => {
  if (!resourceData.value) return '资源详情'

  const typeMap = {
    [ResourceType.DATA]: '数据资源详情',
    [ResourceType.APPLICATION]: '应用资源详情',
    [ResourceType.COMPONENT]: '组件资源详情'
  }

  return typeMap[resourceData.value.baseInfo.type] || '资源详情'
})
const handleBack = () => {
  router.back()
}

// 加载资源详情
const loadData = async () => {
  const id = route.query.id as string
  if (!id) {
    ElMessage.error('缺少资源ID')
    handleBack()
    return
  }

  loading.value = true
  try {
    resourceData.value = await getResourceDetail(Number(id))
  } catch (error) {
    console.error('加载资源详情失败:', error)
    ElMessage.error('加载资源详情失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  if (!resourceData.value) return
  currentFormData.value = { ...resourceData.value.baseInfo }
  formVisible.value = true
}

// 保存表单
const handleFormSave = async (data: any, publish: boolean) => {
  try {
    const saveData = {
      ...data,
      id: resourceData.value?.baseInfo.id,
      type: resourceData.value?.baseInfo.type,
      publishDirectly: publish
    }

    await createResourceInfo(saveData)
    ElMessage.success(publish ? '编辑并上架成功' : '编辑成功')
    formVisible.value = false
    await loadData()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 删除
const handleDelete = async () => {
  if (!resourceData.value) return

  try {
    await ElMessageBox.confirm(
      `确定要删除 "${resourceData.value.baseInfo.name}" 吗?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteResourceInfo(resourceData.value.baseInfo.id)
    ElMessage.success('删除成功!')
    router.back()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

//停用
const handleUpateStatus = async () => {
  if (!resourceData.value) return

  try {
    await ElMessageBox.confirm(
      `确定要停用 "${resourceData.value.baseInfo.name}" 吗?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await updateResourceUsageStatus (resourceData.value.baseInfo.id,3)
    ElMessage.success('停用成功!')
    router.back()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('停用失败:', error)
      ElMessage.error('停用失败')
    }
  }
}

// 上架/下架
const handleToggleStatus = async () => {
  if (!resourceData.value) return

  const isPublished = resourceData.value.baseInfo.publishStatus === 2

  if (isPublished) {
    // 下架操作：打开下架弹窗
    unpublishDialogRef.value?.open()
  } else {
    // 上架操作：创建发布申请
    try {
      await ElMessageBox.confirm(
        `确定要申请上架资源"${resourceData.value.baseInfo.name}"吗？`,
        '上架申请确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await createPublishApply({ resourceId: resourceData.value.baseInfo.id })
      ElMessage.success('上架申请已提交，等待审批')
      await loadData()
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('提交上架申请失败:', error)
        ElMessage.error('提交上架申请失败')
      }
    }
  }
}

// 处理下架确认
const handleUnpublishConfirm = async (formData: any) => {
  if (!resourceData.value) return

  try {
    await offlineResource({
      resourceId: resourceData.value.baseInfo.id,
      ...formData
    })

    ElMessage.success('下架成功')
    unpublishDialogRef.value?.close()
    unpublishDialogRef.value?.setLoading(false)
    await loadData()
  } catch (error) {
    console.error('下架失败:', error)
    ElMessage.error('下架失败')
    unpublishDialogRef.value?.setLoading(false)
  }
}

// 咨询资源介绍
const handleConsult = () => {
  // ElMessage.info('打开咨询对话框')
  router.push(`/marketplace/detail/${resourceData.value?.baseInfo.id}`).catch(err => {
    console.log('跳转失败：', err) // 查看错误原因
  })
  // TODO: 实现咨询功能
}

// 初始化
onMounted(() => {
  loadData()
})
</script>
