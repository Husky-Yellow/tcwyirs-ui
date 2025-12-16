<template>
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
      <el-button @click="$emit('back')">返回</el-button>
    </div>

    <!-- 运营管理员：显示返回 + 审批操作按钮（审批未结束时显示操作按钮） -->
    <div v-else-if="isOperationAdmin" class="flex items-center justify-between">
      <el-button @click="$emit('back')">返回</el-button>
      <div v-if="showActionButtons" class="space-x-12px">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="danger" @click="$emit('reject')">驳回</el-button>
        <el-button type="warning" @click="$emit('transfer')">转交</el-button>
        <el-button type="success" @click="$emit('approve')" :loading="submitting">通过</el-button>
      </div>
    </div>

    <!-- 项目成员、项目经理：显示返回 + 撤回按钮（审批未结束时显示撤回按钮） -->
    <div v-else class="flex items-center justify-between">
      <el-button @click="$emit('back')">返回</el-button>
      <el-button v-if="canWithdraw && showActionButtons" type="warning" @click="$emit('withdraw')">撤回</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { BpmProcessInstanceStatus } from '@/utils/constants'

const props = defineProps<{
  submitting?: boolean
  canWithdraw?: boolean
  /** 审批流程状态：1-审批中 2-审批通过 3-审批驳回 4-已取消 */
  approvalStatus?: number
}>()

defineEmits<{
  back: []
  cancel: []
  reject: []
  transfer: []
  approve: []
  withdraw: []
}>()

const appStore = useAppStore()
const userStore = useUserStore()

const isCollapsed = computed(() => appStore.getCollapse)
const isMobile = computed(() => appStore.getMobile)
const currentRole = computed(() => userStore.getCurrentRole)

const isResourceAdmin = computed(() => currentRole.value === 'resource_admin')
const isOperationAdmin = computed(() => currentRole.value === 'operation_admin')

// 审批是否已结束（通过或已取消才视为结束，不显示操作按钮）
const isApprovalFinished = computed(() =>
  props.approvalStatus === BpmProcessInstanceStatus.APPROVE ||
  props.approvalStatus === BpmProcessInstanceStatus.CANCEL
)

// 是否显示操作按钮（数据已加载且审批未结束时显示）
const showActionButtons = computed(() =>
  props.approvalStatus !== undefined && !isApprovalFinished.value
)
</script>
