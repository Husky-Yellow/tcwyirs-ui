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
              <!-- 申请资源详情 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">申请资源详情：</span>
                <el-link type="primary" :underline="false" class="text-14px" @click="handleResourceDetail">
                  {{ applyData.resourceName }}
                </el-link>
              </div>

              <!-- 资源类别 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">资源类别：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">
                  <dict-tag v-if="applyData.resourceType" :type="DICT_TYPE.RESOURCE_TYPE" :value="applyData.resourceType" />
                  <span v-else>-</span>
                </span>
              </div>

              <!-- 资源标签 -->
              <div v-if="applyData.resourceTag">
                <span class="text-14px text-[var(--el-text-color-secondary)]">资源标签：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.resourceTag }}</span>
              </div>

              <!-- 上架人 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">上架人：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.publishUserName || '-' }}</span>
              </div>

              <!-- 关联项目 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">关联项目：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.projectName || '-' }}</span>
              </div>

              <!-- 申请日期 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">申请日期：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.applyTime || applyData.createTime || '-' }}</span>
              </div>

              <!-- 审批类型 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">审批类型：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.approvalDetail?.processDefinition?.name || '资源上架审批' }}</span>
              </div>

              <!-- 审批状态 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">审批状态：</span>
                <span class="text-14px" :style="{ color: getStatusColor(applyData.status) }">
                  <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="`${applyData?.status}`" />
                </span>
              </div>

              <!-- 申请周期 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">申请周期：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.duration ? `${applyData.duration}天` : '-' }}</span>
              </div>

              <!-- 申请说明 -->
              <div>
                <span class="text-14px text-[var(--el-text-color-secondary)]">申请说明：</span>
                <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.reason || '-' }}</span>
              </div>
            </div>

            <!-- 驳回原因 -->
            <div v-if="applyData.rejectReason" class="mt-20px">
              <span class="text-14px text-[var(--el-text-color-secondary)]">驳回原因：</span>
              <span class="text-14px text-[var(--el-text-color-primary)]">{{ applyData.rejectReason }}</span>
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
                  {{ node.name || BpmNodeTypeMap[node.nodeType] || '未知节点' }}
                </div>
                <div v-if="node.tasks?.length" class="bg-#f5f7fa rounded-4px p-16px">
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
                        {{ BpmTaskStatusMap[task.status] || '未知状态' }}
                      </div>
                    </div>
                    <div v-if="node.endTime || node.startTime" class="mt-4px text-12px text-[var(--el-text-color-placeholder)]">
                      {{ node.endTime || node.startTime }}
                    </div>
                    <div v-if="task.reason" class="mt-8px text-13px text-[var(--el-text-color-regular)]">
                      <span class="font-500">审批意见：</span>{{ task.reason }}
                    </div>
                  </div>
                </div>
                <div v-else-if="node.candidateUsers?.length" class="text-13px text-[var(--el-text-color-secondary)]">
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
    <ActionBar
      :submitting="submitting"
      :can-withdraw="applyData?.status === 0"
      @back="handleBack"
      @cancel="handleCancel"
      @reject="handleReject"
      @transfer="handleTransfer"
      @approve="handleApprove"
      @withdraw="handleWithdraw"
    />

    <!-- 驳回对话框 -->
    <RejectDialog
      ref="rejectDialogRef"
      v-model="rejectDialogVisible"
      :apply-id="applyData?.id"
      :apply-type="applyData?.type"
      @confirm="confirmReject"
    />

    <!-- 转交对话框 -->
    <TransferDialog
      ref="transferDialogRef"
      v-model="transferDialogVisible"
      :apply-id="applyData?.id"
      :user-list="approverList"
      @confirm="confirmTransfer"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
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
import { DICT_TYPE } from '@/utils/dict'
import type { ResourcePublishApplyRespVO } from '@/api/resource/info'
import { BpmNodeTypeMap, BpmTaskStatusMap } from '@/utils/constants'
import {
  getStatusColor,
  calculateCurrentStep,
  calculateProcessStatus,
  calculateStepDescriptions
} from './utils'
import ActionBar from './components/ActionBar.vue'
import RejectDialog from './components/RejectDialog.vue'
import TransferDialog from './components/TransferDialog.vue'

defineOptions({ name: 'ApprovalDetail' })

const router = useRouter()
const route = useRoute()

// 数据状态
const loading = ref(false)
const applyData = ref<ResourcePublishApplyRespVO | null>(null)
const submitting = ref(false)

// 对话框状态
const rejectDialogVisible = ref(false)
const transferDialogVisible = ref(false)

// 对话框引用
const rejectDialogRef = ref()
const transferDialogRef = ref()

const approverList = ref<UserVO[]>([])

// 计算属性：使用工具函数
const currentStep = computed(() => calculateCurrentStep(applyData.value))
const processStatus = computed(() => calculateProcessStatus(applyData.value))
const stepDescriptions = computed(() => calculateStepDescriptions(applyData.value))

// 加载数据
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

// 加载审批人列表
const loadApproverList = async () => {
  try {
    approverList.value = await getSimpleUserList()
  } catch (error) {
    console.error('加载审批人列表失败:', error)
  }
}

// 导航操作
const handleBack = () => router.back()

const handleResourceDetail = () => {
  if (applyData.value?.resourceId) {
    router.push({
      path: '/resources/detail',
      query: { id: applyData.value.resourceId }
    })
  }
}

// 取消申请（运营管理员）
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

// 撤回申请（项目成员、项目经理）
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
  rejectDialogVisible.value = true
}

const confirmReject = async (data: ApprovalActionVO) => {
  rejectDialogRef.value?.setLoading(true)
  try {
    await rejectResourceApply(data)
    ElMessage.success('已驳回')
    rejectDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('驳回失败:', error)
    ElMessage.error('驳回失败')
  } finally {
    rejectDialogRef.value?.setLoading(false)
  }
}

// 转交操作
const handleTransfer = () => {
  transferDialogVisible.value = true
}

const confirmTransfer = async (data: ApprovalTransferVO) => {
  transferDialogRef.value?.setLoading(true)
  try {
    await transferResourceApply(data)
    ElMessage.success('转交成功')
    transferDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('转交失败:', error)
    ElMessage.error('转交失败')
  } finally {
    transferDialogRef.value?.setLoading(false)
  }
}

// 通过操作
const handleApprove = async () => {
  if (!applyData.value?.id) return

  try {
    await ElMessageBox.confirm('确定要通过该申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    submitting.value = true
    await approveResourceApply({
      id: applyData.value.id,
      type: applyData.value.type
    })
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


