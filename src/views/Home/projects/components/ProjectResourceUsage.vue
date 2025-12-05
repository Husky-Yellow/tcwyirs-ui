<template>
  <ContentWrap>
    <div class="pb-20px text-lg font-bold">资源使用详情</div>
    <el-table
      :data="resourceUsageList"
      class="resource-table"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      stripe
    >
      <el-table-column
        align="center"
        label="资源名称"
        prop="resourceName"
        show-overflow-tooltip
        min-width="180"
      />
      <el-table-column align="center" label="使用人" prop="userName" width="120" />
      <el-table-column align="center" label="使用状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="plain">
            {{ row.status === 1 ? '使用中' : '已停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" prop="startTime" width="180">
        <template #default="{ row }">
          <div class="time-cell">
            <Icon icon="ep:clock" class="time-icon" />
            {{ formatDateTime(row.startTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间" prop="expireTime" width="180">
        <template #default="{ row }">
          <div class="time-cell">
            <Icon icon="ep:calendar" class="time-icon" />
            {{ formatDateTime(row.expireTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <!-- 详情，重新申请 -->
          <el-button link type="primary" @click="handleView(row)">详情</el-button>
          <el-button link type="primary" @click="handleReapply(row)">重新申请</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty
      v-if="resourceUsageList.length === 0"
      description="暂无资源使用记录"
      :image-size="120"
    />

  </ContentWrap>
  <!-- 延期申请表单 -->
  <ExtensionApplicationForm ref="extensionFormRef" @submit="handleExtensionSubmit" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'
import { ElMessage } from 'element-plus'
import type { ResourceUsageVO } from '@/api/resource/usage'
import { useRouter } from 'vue-router'
import ExtensionApplicationForm from '@/components/ExtensionApplicationForm/index.vue'
import type { ExtensionFormData } from '@/components/ExtensionApplicationForm/types'

defineOptions({ name: 'ProjectResourceUsage' })

interface Props {
  resourceUsageList: ResourceUsageVO[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()

// 延期申请表单引用
const extensionFormRef = ref<InstanceType<typeof ExtensionApplicationForm>>()

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined) => {
  if (!dateTime) return ' - '
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm:ss')
}

// 查看详情
const handleView = (row: ResourceUsageVO) => {
  // todo 这里跳转的是否正确
  router.push({ name: 'ResourceUsageDetail', params: { id: row.id?.toString() || '' } })
}

// 重新申请
const handleReapply = (row: ResourceUsageVO) => {
  extensionFormRef.value?.open()
}

// 处理延期申请提交
const handleExtensionSubmit = async (data: ExtensionFormData) => {
  try {
    // TODO: 调用延期申请 API
    console.log('延期申请数据:', data)
    ElMessage.success('延期申请提交成功')
    emit('refresh')
  } catch (error) {
    console.error('延期申请失败:', error)
    ElMessage.error('延期申请提交失败')
  }
}
</script>
