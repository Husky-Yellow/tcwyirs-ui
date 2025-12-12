<template>
  <div class="pb-80px">
    <ContentWrap>
    <!-- 返回按钮 -->
    <div class="mb-16px">
      <el-button link @click="handleBack">
        <Icon icon="ep:arrow-left" class="mr-4px" />
        申请详情
      </el-button>
    </div>

    <!-- 详情内容 -->
    <div v-loading="loading" class="min-h-500px">
      <template v-if="applyData">
        <!-- 审批流程 Steps -->
        <div class="mb-32px rounded-8px bg-white p-24px">
          <div class="mb-24px text-16px font-600">审批流程</div>
          <el-steps :active="currentStep" :process-status="processStatus" align-center>
            <el-step title="提交申请" :description="stepDescriptions.submit" />
            <el-step title="审批中" :description="stepDescriptions.review" />
            <el-step :title="stepDescriptions.result.title" :description="stepDescriptions.result.time" />
          </el-steps>
        </div>

        <!-- 申请信息 -->
        <div class="mb-32px rounded-8px bg-white p-24px">
          <div class="mb-24px text-16px font-600">申请信息</div>
          <div class="grid grid-cols-2 gap-x-80px gap-y-20px">
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请资源项目：</span>
              <el-link type="primary" :underline="false" class="text-14px">
                {{ applyData.resourceName }}
              </el-link>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">资源类型：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ getResourceTypeText(applyData.resourceType) }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">关联项目：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.projectName || '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请时间：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.createTime ? new Date(applyData.createTime).toLocaleString('zh-CN') : '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请人：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.applicant || '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">审批状态：</span>
              <span class="text-14px" :style="{ color: getStatusColor(applyData.status) }">
                <span
                  class="mr-8px inline-block h-8px w-8px rounded-full"
                  :style="{ backgroundColor: getStatusColor(applyData.status) }"
                ></span>
                {{ getStatusText(applyData.status) }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请周期：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ formatDateRange(applyData.createTime, applyData.duration) }}
              </span>
            </div>
          </div>
          <div class="mt-20px">
            <span class="text-14px text-[var(--el-text-color-secondary)]">申请说明：</span>
            <span class="text-14px text-[var(--el-text-color-primary)]">
              {{ applyData.reason || '-' }}
            </span>
          </div>
        </div>

        <!-- 审批流程 Timeline -->
        <div class="mb-32px rounded-8px bg-white p-24px">
          <div class="mb-24px text-16px font-600">审批流程</div>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in approvalTimeline"
              :key="index"
              :color="getStatusColor(item.status)"
            >
              <!-- 上面是状态 -->
              <div class="text-14px font-500" :style="{ color: getStatusColor(item.status) }">
                {{ item.statusText }}
              </div>
              <!-- 下面是人 -->
              <div class="mt-8px text-13px text-[var(--el-text-color-secondary)]">
                {{ item.person }}
                <span v-if="item.time" class="ml-8px">{{ item.time }}</span>
              </div>
              <!-- 审批意见 -->
              <div
                v-if="item.remark"
                class="mt-8px text-13px text-[var(--el-text-color-regular)]"
              >
                审批意见：{{ item.remark }}
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </template>

      <el-empty v-else description="暂无数据" />
    </div>

    </ContentWrap>

    <!-- 底部悬浮返回按钮 -->
    <div
      class="fixed bottom-0 right-0 z-1 bg-white px-24px py-16px shadow-[0_-2px_8px_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="{
        'w-[calc(100%-var(--left-menu-min-width))]': isCollapsed && !isMobile,
        'w-[calc(100%-var(--custom-left-menu-max-width))]': !isCollapsed && !isMobile,
        'w-full': isMobile
      }"
    >
      <div class="text-right">
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'
import { getResourceApply, type ResourceApplyVO } from '@/api/resource/apply'
import { ApplyStatus } from '@/api/resource/types'

defineOptions({ name: 'ApprovalDetail' })

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 获取菜单收起状态和移动端状态
const isCollapsed = computed(() => appStore.getCollapse)
const isMobile = computed(() => appStore.getMobile)

// 加载状态
const loading = ref(false)

// 申请数据
const applyData = ref<ResourceApplyVO | null>(null)

// 状态配置
const statusConfig = {
  [ApplyStatus.PENDING]: { label: '待审批', color: '#409EFF' },
  [ApplyStatus.APPROVED]: { label: '已通过', color: '#67C23A' },
  [ApplyStatus.REJECTED]: { label: '已驳回', color: '#F56C6C' },
  [ApplyStatus.CANCELLED]: { label: '已撤销', color: '#909399' }
}

// 审批流程数据 - 根据 API 数据构建
const approvalTimeline = computed(() => {
  if (!applyData.value) return []

  const timeline = [
    {
      status: ApplyStatus.APPROVED,
      statusText: '提交申请',
      person: applyData.value.applicant || '-',
      time: applyData.value.createTime ? new Date(applyData.value.createTime).toLocaleString('zh-CN') : '-',
      remark: ''
    }
  ]

  // 如果有审批人和审批时间，添加审批节点
  if (applyData.value.approver && applyData.value.approvalTime) {
    timeline.push({
      status: applyData.value.status || ApplyStatus.PENDING,
      statusText: getStatusText(applyData.value.status),
      person: applyData.value.approver,
      time: new Date(applyData.value.approvalTime).toLocaleString('zh-CN'),
      remark: applyData.value.approvalComment || ''
    })
  } else if (applyData.value.status === ApplyStatus.PENDING) {
    // 待审批状态
    timeline.push({
      status: ApplyStatus.PENDING,
      statusText: '待审批',
      person: applyData.value.approver || '待分配',
      time: '',
      remark: ''
    })
  }

  return timeline
})

// 当前步骤
const currentStep = computed(() => {
  if (!applyData.value) return 0
  const status = applyData.value.status
  if (status === ApplyStatus.PENDING) return 1
  if (status === ApplyStatus.APPROVED || status === ApplyStatus.REJECTED) return 2
  return 0
})

// 步骤状态
const processStatus = computed(() => {
  if (!applyData.value) return 'process'
  const status = applyData.value.status
  if (status === ApplyStatus.APPROVED) return 'success'
  if (status === ApplyStatus.REJECTED) return 'error'
  return 'process'
})

// 步骤描述
const stepDescriptions = computed(() => {
  if (!applyData.value) {
    return {
      submit: '',
      review: '',
      result: { title: '申请结果', time: '' }
    }
  }

  const status = applyData.value.status
  const createTime = applyData.value.createTime ? new Date(applyData.value.createTime).toLocaleString('zh-CN') : ''
  const approvalTime = applyData.value.approvalTime ? new Date(applyData.value.approvalTime).toLocaleString('zh-CN') : ''

  return {
    submit: createTime,
    review: createTime,
    result: {
      title: status === ApplyStatus.APPROVED ? '审批通过' : status === ApplyStatus.REJECTED ? '审批失败' : '申请结果',
      time: status === ApplyStatus.APPROVED || status === ApplyStatus.REJECTED ? approvalTime : ''
    }
  }
})

// 获取资源类型文本
const getResourceTypeText = (type?: number) => {
  const typeMap = {
    1: '数据资源',
    2: '应用资源',
    3: '组件资源'
  }
  return typeMap[type || 1] || '未知'
}

// 格式化日期范围
const formatDateRange = (startDate?: Date | string, duration?: number) => {
  if (!startDate) return '-'

  const start = new Date(startDate)
  const startStr = start.toLocaleDateString('zh-CN')

  if (!duration) return startStr

  const end = new Date(start)
  end.setDate(end.getDate() + duration)
  const endStr = end.toLocaleDateString('zh-CN')

  return `${startStr} ~ ${endStr} (${duration}天)`
}

// 获取状态文本
const getStatusText = (status?: ApplyStatus) => {
  if (status === undefined) return '未知'
  return statusConfig[status]?.label || '未知'
}

// 获取状态颜色
const getStatusColor = (status?: ApplyStatus) => {
  if (status === undefined) return '#909399'
  return statusConfig[status]?.color || '#909399'
}

// 加载申请详情
const loadData = async () => {
  const id = route.query.id as string
  if (!id) {
    ElMessage.error('缺少申请ID')
    handleBack()
    return
  }

  loading.value = true
  try {
    applyData.value = await getResourceApply(Number(id))
  } catch (error) {
    console.error('加载申请详情失败:', error)
    ElMessage.error('加载申请详情失败')
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
:deep(.el-step__title) {
  font-size: 14px;
}

:deep(.el-step__description) {
  font-size: 12px;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 13px;
}
</style>
