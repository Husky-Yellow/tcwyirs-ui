<template>
  <div class="pb-40px">
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
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请资源详情：</span>
              <el-link type="primary" :underline="false" class="text-14px" @click="handleResourceDetail">
                {{ applyData.resourceName }}
              </el-link>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">资源类别：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                <dict-tag v-if="applyData.resourceType" :type="DICT_TYPE.RESOURCE_TYPE" :value="applyData.resourceType" />
                <span v-else>-</span>
              </span>
            </div>
            <div v-if="applyData.resourceTag">
              <span class="text-14px text-[var(--el-text-color-secondary)]">资源标签：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.resourceTag }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">上架人：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.publishUserName || '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">关联项目：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.projectName || '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请日期：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.applyTime || applyData.createTime || '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">审批类型：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.approvalDetail?.processDefinition?.name || '资源上架审批' }}
              </span>
            </div>
                        <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">审批状态：</span>
              <span class="text-14px" :style="{ color: getStatusColor(applyData.status) }">
                <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="`${applyData?.status}`" />
              </span>
            </div>
                      <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请周期：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.duration ? `${applyData.duration}天` : '-' }}
              </span>
            </div>
            <div>
              <span class="text-14px text-[var(--el-text-color-secondary)]">申请说明：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">
                {{ applyData.reason || '-' }}
              </span>
            </div>

          </div>
          <div v-if="applyData.rejectReason" class="mt-20px">
            <span class="text-14px text-[var(--el-text-color-secondary)]">驳回原因：</span>
            <span class="text-14px text-[var(--el-text-color-primary)]">
              {{ applyData.rejectReason }}
            </span>
          </div>
          <div v-if="applyData.reason" class="mt-20px">
            <span class="text-14px text-[var(--el-text-color-secondary)]">申请说明：</span>
            <span class="text-14px text-[var(--el-text-color-primary)]">
              {{ applyData.reason }}
            </span>
          </div>
        </div>

        <!-- 审批流程 Timeline -->
        <div v-if="applyData.approvalDetail?.activityNodes" class="mb-32px rounded-8px bg-white p-24px">
          <div class="mb-24px text-16px font-600">审批流程详情</div>
          <el-timeline>
            <el-timeline-item
              v-for="(node, index) in applyData.approvalDetail.activityNodes"
              :key="node.id || index"
              :color="getStatusColor(node.status)"
            >
              <div class="text-14px font-600 mb-8px">
                {{ node.name || (node.nodeType !== undefined ? nodeTypeMap[node.nodeType] : undefined) || '未知节点' }}
              </div>
              <div v-if="node.tasks && node.tasks.length > 0" class="bg-#f5f7fa rounded-4px p-16px">
                <div
                  v-for="(task, taskIndex) in node.tasks"
                  :key="task.id || taskIndex"
                  class="mb-12px last:mb-0"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-13px text-[var(--el-text-color-secondary)]">
                      <span class="font-500">审批人：</span>
                      {{ task.assigneeUserName || '待分配' }}
                    </div>
                    <div class="text-13px" :style="{ color: getStatusColor(task.status) }">
                      {{ (task.status !== undefined ? statusMap[task.status] : undefined) || '未知状态' }}
                    </div>
                  </div>
                  <div v-if="node.endTime || node.startTime" class="mt-4px text-12px text-[var(--el-text-color-placeholder)]">
                    {{ node.endTime || node.startTime }}
                  </div>
                  <div
                    v-if="task.reason"
                    class="mt-8px text-13px text-[var(--el-text-color-regular)]"
                  >
                    <span class="font-500">审批意见：</span>{{ task.reason }}
                  </div>
                </div>
              </div>
              <div v-else-if="node.candidateUsers && node.candidateUsers.length > 0" class="text-13px text-[var(--el-text-color-secondary)]">
                <span class="font-500">候选人：</span>
                {{ node.candidateUsers.map(u => u.nickname).join('、') }}
              </div>
              <div v-else class="text-13px text-[var(--el-text-color-placeholder)]">
                待分配审批人
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </template>

      <el-empty v-else description="暂无数据" />
    </div>

    </ContentWrap>

    <!-- 底部悬浮操作按钮 -->
    <div
      class="fixed bottom-0 right-0 z-1 bg-white px-24px py-16px shadow-[0_-2px_8px_rgba(0,0,0,0.1)] transition-all duration-300"
      :class="{
        'w-[calc(100%-var(--left-menu-min-width))]': isCollapsed && !isMobile,
        'w-[calc(100%-var(--custom-left-menu-max-width))]': !isCollapsed && !isMobile,
        'w-full': isMobile
      }"
    >

      <!-- 资源管理员：只显示返回 -->
      <div v-if="isResourceAdmin" class="text-right">
        <el-button @click="handleBack">返回</el-button>
      </div>

      <!-- 运营管理员：显示返回 + 审批操作按钮 -->
      <div v-else-if="isOperationAdmin" class="flex items-center justify-between">
        <el-button @click="handleBack">返回</el-button>
        <div class="space-x-12px">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="danger" @click="handleReject">驳回</el-button>
          <el-button type="warning" @click="handleTransfer">转交</el-button>
          <el-button type="success" @click="handleApproveDirectly" :loading="submitting">通过</el-button>
        </div>
      </div>

      <!-- 项目成员、项目经理：显示返回 + 撤回按钮 -->
      <div v-else class="flex items-center justify-between">
        <el-button @click="handleBack">返回</el-button>
        <el-button v-if="applyData?.status === 0" type="warning" @click="handleWithdraw">撤回</el-button>
      </div>
    </div>
  </div>

  <!-- 驳回对话框 -->
  <el-dialog v-model="rejectDialogVisible" title="驳回申请" width="500px">
    <el-form :model="rejectForm" label-width="100px">
      <el-form-item label="驳回原因:" required prop="rejectReason">
        <el-input
          v-model="rejectForm.rejectReason"
          type="textarea"
          :rows="4"
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="rejectDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmReject" :loading="submitting">确 定</el-button>
    </template>
  </el-dialog>

  <!-- 转交对话框 -->
  <el-dialog v-model="transferDialogVisible" title="转交申请" width="500px">
    <el-form :model="transferForm" label-width="80px">
      <el-form-item label="转交给:" required>
        <el-select v-model="transferForm.userId" placeholder="请选择审批人" class="w-full">
          <el-option
            v-for="user in approverList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转交说明:">
        <el-input
          v-model="transferForm.comment"
          type="textarea"
          :rows="3"
          placeholder="请输入转交说明（可选）"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="transferDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmTransfer" :loading="submitting">确 定</el-button>
    </template>
  </el-dialog>

  <!-- 通过对话框 -->
  <el-dialog v-model="approveDialogVisible" title="通过申请" width="500px">
    <el-form :model="approveForm" label-width="80px">
      <el-form-item label="审批意见:">
        <el-input
          v-model="approveForm.comment"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见（可选）"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="approveDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmApprove" :loading="submitting">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'
import { getResourcePublishApply, cancelResourceApply } from '@/api/resource/apply'
import {
  approveResourceApply,
  rejectResourceApply,
  transferResourceApply,
  cancelApproval,
  type ApprovalActionVO,
  type ApprovalTransferVO
} from '@/api/resource/approval'
import { getSimpleUserList, type UserVO } from '@/api/system/user'
import { useUserStore } from '@/store/modules/user'
import { ApplyStatus } from '@/api/resource/types'
import { DICT_TYPE } from '@/utils/dict'
import type { ResourcePublishApplyRespVO } from '@/api/resource/info'

defineOptions({ name: 'ApprovalDetail' })

// 节点类型映射
const nodeTypeMap: Record<number, string> = {
  10: '发起人节点',
  1: '结束节点',
  11: '审批节点'
}

// 状态映射
const statusMap: Record<number, string> = {
  0: '草稿',
  1: '审批中',
  2: '审批通过',
  3: '审批驳回',
  4: '已取消'
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// 获取菜单收起状态和移动端状态
const isCollapsed = computed(() => appStore.getCollapse)
const isMobile = computed(() => appStore.getMobile)

/** 获取当前角色 */
const currentRole = computed(() => userStore.getCurrentRole)

/** 判断角色类型 */
const isResourceAdmin = computed(() => currentRole.value === 'resource_admin')
const isOperationAdmin = computed(() => currentRole.value === 'operation_admin')
// 项目成员和项目经理（非资源管理员、非运营管理员）
const isProjectMember = computed(() => currentRole.value === 'project_member' || currentRole.value === 'project_manager')

// 加载状态
const loading = ref(false)

// 申请数据
const applyData = ref<ResourcePublishApplyRespVO | null>(null)

// 操作相关状态
const submitting = ref(false)

// 驳回对话框
const rejectDialogVisible = ref(false)
const rejectForm = ref<ApprovalActionVO>({
  id: 0,
  rejectReason: ''
})

// 转交对话框
const transferDialogVisible = ref(false)
const transferForm = ref<ApprovalTransferVO>({
  id: 0,
  userId: 0,
  comment: ''
})

// 通过对话框
const approveDialogVisible = ref(false)
const approveForm = ref<ApprovalActionVO>({
  id: 0,
  comment: ''
})

// 审批人列表（转交时使用）
const approverList = ref<UserVO[]>([])

// 状态配置
const statusConfig = {
  [ApplyStatus.PENDING]: { label: '待审批', color: '#409EFF' },
  [ApplyStatus.APPROVED]: { label: '已通过', color: '#67C23A' },
  [ApplyStatus.REJECTED]: { label: '已驳回', color: '#F56C6C' },
  [ApplyStatus.CANCELLED]: { label: '已撤销', color: '#909399' }
}

// 当前步骤 - 基于 activityNodes 计算
const currentStep = computed(() => {
  if (!applyData.value) return 0

  const activityNodes = applyData.value.approvalDetail?.activityNodes

  if (activityNodes && activityNodes.length > 0) {
    // 计算已完成的节点数量
    const completedCount = activityNodes.filter((node) => {
      // 节点状态：2-已完成
      return node.status === 2 || (node.endTime && node.endTime !== '')
    }).length

    // 步骤索引从 0 开始，如果有节点完成则至少是步骤 1
    return Math.min(completedCount, 2)
  }

  // 兼容旧数据格式
  const status = applyData.value.status
  if (status === ApplyStatus.PENDING) return 1
  if (status === ApplyStatus.APPROVED || status === ApplyStatus.REJECTED) return 2
  return 0
})

// 步骤状态
const processStatus = computed(() => {
  if (!applyData.value) return 'process'

  const activityNodes = applyData.value.approvalDetail?.activityNodes

  if (activityNodes && activityNodes.length > 0) {
    // 检查是否有驳回的节点
    const hasRejected = activityNodes.some((node) => {
      return node.tasks?.some((task) => task.status === 3) // 3-已驳回
    })
    if (hasRejected) return 'error'

    // 检查是否全部完成
    const allCompleted = activityNodes.every((node) => {
      return node.status === 2 || (node.endTime && node.endTime !== '')
    })
    if (allCompleted) return 'success'

    return 'process'
  }

  // 兼容旧数据格式
  const status = applyData.value.status
  if (status === ApplyStatus.APPROVED) return 'success'
  if (status === ApplyStatus.REJECTED) return 'error'
  return 'process'
})

// 步骤描述 - 基于 activityNodes 或 processInstance
const stepDescriptions = computed(() => {
  if (!applyData.value) {
    return {
      submit: '',
      review: '',
      result: { title: '申请结果', time: '' }
    }
  }

  const processInstance = applyData.value.approvalDetail?.processInstance
  const activityNodes = applyData.value.approvalDetail?.activityNodes

  // 获取开始时间
  const startTime = processInstance?.startTime || applyData.value.createTime || ''

  // 获取审批中的时间（第一个审批节点的开始时间）
  let reviewTime = startTime
  if (activityNodes && activityNodes.length > 0) {
    const firstApprovalNode = activityNodes.find((node) => node.startTime)
    reviewTime = firstApprovalNode?.startTime || startTime
  }

  // 获取结束时间和状态
  let endTime = processInstance?.endTime || ''
  let resultTitle = '申请结果'

  if (activityNodes && activityNodes.length > 0) {
    // 检查最后一个节点的状态
    const lastNode = activityNodes[activityNodes.length - 1]
    endTime = lastNode.endTime || endTime

    // 判断结果
    const hasRejected = activityNodes.some((node) =>
      node.tasks?.some((task) => task.status === 3)
    )
    const allCompleted = activityNodes.every((node) => node.status === 2)

    if (hasRejected) {
      resultTitle = '审批驳回'
    } else if (allCompleted) {
      resultTitle = '审批通过'
    }
  } else {
    // 兼容旧数据格式
    const status = applyData.value.status
    endTime = applyData.value.approvalTime || ''
    resultTitle =
      status === ApplyStatus.APPROVED
        ? '审批通过'
        : status === ApplyStatus.REJECTED
          ? '审批失败'
          : '申请结果'
  }

  return {
    submit: startTime,
    review: reviewTime,
    result: {
      title: resultTitle,
      time: endTime
    }
  }
})

// 获取状态颜色 - 支持节点状态和申请状态
const getStatusColor = (status?: number) => {
  if (status === undefined) return '#909399'

  // BpmTaskStatusEnum 节点状态映射
  const nodeStatusColors: Record<number, string> = {
    0: '#909399', // 未开始/草稿
    1: '#409EFF', // 进行中/审批中
    2: '#67C23A', // 已完成/审批通过
    3: '#F56C6C', // 已驳回
    4: '#E6A23C', // 已取消
    5: '#909399'  // 已终止
  }

  // 优先使用节点状态颜色
  if (nodeStatusColors[status]) {
    return nodeStatusColors[status]
  }

  // 兼容旧的申请状态
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
    applyData.value = await getResourcePublishApply(Number(id))
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

// 跳转到资源详情
const handleResourceDetail = () => {
  if (applyData.value?.resourceId) {
    router.push({
      path: '/resources/detail',
      query: {
        id: applyData.value.resourceId
      }
    })
  }
}

// 加载审批人列表
const loadApproverList = async () => {
  try {
    approverList.value = await getSimpleUserList()
  } catch (error) {
    console.error('加载审批人列表失败:', error)
  }
}

// 取消申请（运营管理员用）
const handleCancel = async () => {
  if (!applyData.value?.id) return

  try {
    await ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelApproval({ id: applyData.value.id })
    ElMessage.success('取消成功')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消申请失败:', error)
      ElMessage.error('取消申请失败')
    }
  }
}

// 撤回申请（项目成员、项目经理用）
const handleWithdraw = async () => {
  if (!applyData.value?.id) return

  try {
    await ElMessageBox.confirm('确定要撤回该申请吗？撤回后需要重新申请。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelResourceApply(applyData.value.id)
    ElMessage.success('撤回成功')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('撤回申请失败:', error)
      ElMessage.error('撤回申请失败')
    }
  }
}

// 驳回操作
const handleReject = () => {
  if (!applyData.value?.id) return
  rejectForm.value = {
    id: applyData.value.id,
    rejectReason: ''
  }
  rejectDialogVisible.value = true
}

// 确认驳回
const confirmReject = async () => {
  if (!rejectForm.value.rejectReason?.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  submitting.value = true
  rejectForm.value.type = applyData.value.type
  try {
    await rejectResourceApply(rejectForm.value)
    ElMessage.success('已驳回')
    rejectDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('驳回失败:', error)
    ElMessage.error('驳回失败')
  } finally {
    submitting.value = false
  }
}

// 转交操作
const handleTransfer = () => {
  if (!applyData.value?.id) return
  transferForm.value = {
    id: applyData.value.id,
    userId: 0,
    comment: ''
  }
  transferDialogVisible.value = true
}

// 确认转交
const confirmTransfer = async () => {
  if (!transferForm.value.userId) {
    ElMessage.warning('请选择转交对象')
    return
  }

  submitting.value = true
  try {
    await transferResourceApply(transferForm.value)
    ElMessage.success('转交成功')
    transferDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('转交失败:', error)
    ElMessage.error('转交失败')
  } finally {
    submitting.value = false
  }
}

// 通过操作（直接调用接口）
const handleApproveDirectly = async () => {
  if (!applyData.value?.id) return

  try {
    await ElMessageBox.confirm('确定要通过该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    submitting.value = true
    await approveResourceApply({ id: applyData.value.id })
    ElMessage.success('审批通过')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('审批失败:', error)
      ElMessage.error('审批失败')
    }
  } finally {
    submitting.value = false
  }
}

// 通过操作（打开对话框）
const handleApprove = () => {
  if (!applyData.value?.id) return
  approveForm.value = {
    id: applyData.value.id,
    comment: ''
  }
  approveDialogVisible.value = true
}

// 确认通过
const confirmApprove = async () => {
  submitting.value = true
  try {
    await approveResourceApply(approveForm.value)
    ElMessage.success('审批通过')
    approveDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('审批失败:', error)
    ElMessage.error('审批失败')
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  loadData()
  loadApproverList()
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
