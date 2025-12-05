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

    <!-- 审批流程 Steps -->
    <div class="mb-32px rounded-8px bg-white p-24px">
      <div class="mb-24px text-16px font-600">审批流程2</div>
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
            {{ applicationInfo.resourceName }}
          </el-link>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">资源类型：</span>
          <span class="text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.resourceType }}
          </span>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">关联项目：</span>
          <span class="text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.projectName }}
          </span>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">申请时间：</span>
          <span class="text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.applyTime }}
          </span>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">资源类型：</span>
          <span class="text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.resourceType2 }}
          </span>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">审批状态：</span>
          <span class="text-14px" :style="{ color: getStatusColor(applicationInfo.status) }">
            <span
              class="mr-8px inline-block h-8px w-8px rounded-full"
              :style="{ backgroundColor: getStatusColor(applicationInfo.status) }"
            ></span>
            {{ getStatusText(applicationInfo.status) }}
          </span>
        </div>
        <div>
          <span class="text-14px text-[var(--el-text-color-secondary)]">申请周期：</span>
          <span class="text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.period }}
          </span>
        </div>
      </div>
      <div class="mt-20px">
        <span class="text-14px text-[var(--el-text-color-secondary)]">申请说明：</span>
        <span class="text-14px text-[var(--el-text-color-primary)]">
          {{ applicationInfo.description }}
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
          :color="getTimelineColor(item.status)"
        >
          <div class="text-14px text-[var(--el-text-color-primary)] font-500">
            {{ item.nodeName }}
          </div>
          <div class="mt-8px text-13px text-[var(--el-text-color-secondary)]">
            {{ item.approver }} {{ item.time }}
            <el-link
              v-if="item.hasAttachment"
              type="primary"
              :underline="false"
              class="ml-8px text-13px"
            >
              唯一下
            </el-link>
          </div>
          <div
            v-if="item.remark"
            class="mt-8px text-13px"
            :style="{ color: getTimelineColor(item.status) }"
          >
            {{ item.remark }}
          </div>
        </el-timeline-item>
      </el-timeline>
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
import { ContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'ApprovalDetail' })

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 获取菜单收起状态和移动端状态
const isCollapsed = computed(() => appStore.getCollapse)
const isMobile = computed(() => appStore.getMobile)

// 审批状态类型
type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// 申请信息
const applicationInfo = ref({
  resourceName: '停车数据记录',
  resourceType: '数据资源',
  resourceType2: '数据资源',
  projectName: '天宫项目组',
  applyTime: '2025-10-24 10:32',
  status: 'pending' as ApprovalStatus,
  period: '2025-10-12~2028-10-11 (3年)',
  description: '用于项目提供成果工作中使用，对于车辆管理深度研究能力'
})

// 审批流程数据
const approvalTimeline = ref([
  {
    nodeName: '审批节点',
    approver: '首道',
    time: '2025-07-30 12:32:02',
    status: 'approved' as ApprovalStatus,
    hasAttachment: true,
    remark: '附件中从精神审核结果详情，已完成权限分析'
  },
  {
    nodeName: '审批节点',
    approver: '首道',
    time: '2025-07-31 12:32:02',
    status: 'approved' as ApprovalStatus,
    hasAttachment: false,
    remark: '审批通过'
  },
  {
    nodeName: '审批节点',
    approver: '李纱绫',
    time: '2025-10-24 10:32',
    status: 'pending' as ApprovalStatus,
    hasAttachment: false,
    remark: '等待处理'
  }
])

// 当前步骤
const currentStep = computed(() => {
  const status = applicationInfo.value.status
  if (status === 'pending') return 1
  if (status === 'approved' || status === 'rejected') return 2
  return 0
})

// 步骤状态
const processStatus = computed(() => {
  const status = applicationInfo.value.status
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'error'
  return 'process'
})

// 步骤描述
const stepDescriptions = computed(() => {
  const status = applicationInfo.value.status
  return {
    submit: '2025-10-24 10:32',
    review: '2025-10-24 10:32',
    result: {
      title: status === 'approved' ? '审批通过' : status === 'rejected' ? '审批失败' : '申请结果',
      time: status === 'approved' || status === 'rejected' ? '2025-10-24 10:32' : ''
    }
  }
})

// 获取状态文本
const getStatusText = (status: ApprovalStatus) => {
  const statusMap = {
    pending: '审批中',
    approved: '审批通过',
    rejected: '审批失败'
  }
  return statusMap[status] || '未知'
}

// 获取状态颜色
const getStatusColor = (status: ApprovalStatus) => {
  const colorMap = {
    pending: '#409EFF',
    approved: '#67C23A',
    rejected: '#F56C6C'
  }
  return colorMap[status] || '#909399'
}

// 获取时间线颜色
const getTimelineColor = (status: ApprovalStatus) => {
  return getStatusColor(status)
}

// 返回
const handleBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  // 从路由参数中获取状态
  const { status, id } = route.query
  if (status) {
    applicationInfo.value.status = status as ApprovalStatus

    // 根据状态更新审批流程数据
    if (status === 'approved') {
      approvalTimeline.value = approvalTimeline.value.map((item) => ({
        ...item,
        status: 'approved',
        remark: '审批通过'
      }))
    } else if (status === 'rejected') {
      approvalTimeline.value[2] = {
        ...approvalTimeline.value[2],
        status: 'rejected',
        remark: '审批失败：资源不满足申请条件'
      }
    }
  }

  // TODO: 根据 id 从后端获取详细数据
  console.log('申请详情 ID:', id)
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
