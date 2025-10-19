<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { ApprovalStep } from './types'

defineOptions({ name: 'ApprovalProcess' })

const props = defineProps({
  steps: {
    type: Array as PropType<ApprovalStep[]>,
    required: true
  },
  title: propTypes.string.def('审批流程')
})

// 获取时间轴项的类型
const getTimelineType = (status: string) => {
  const typeMap = {
    completed: 'primary',
    processing: 'primary',
    waiting: 'info',
    rejected: 'danger'
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

// 获取时间轴项的图标
const getTimelineIcon = (status: string) => {
  const iconMap = {
    completed: 'ep:check',
    processing: 'ep:more-filled',
    waiting: 'ep:clock',
    rejected: 'ep:close'
  }
  return iconMap[status as keyof typeof iconMap]
}

// 获取时间轴项的颜色
const getTimelineColor = (status: string) => {
  const colorMap = {
    completed: '#409EFF',
    processing: '#409EFF',
    waiting: '#E4E7ED',
    rejected: '#F56C6C'
  }
  return colorMap[status as keyof typeof colorMap]
}
</script>

<template>
  <div class="approval-process bg-white rounded-4px">
    <!-- 标题 -->
    <div class="px-20px py-16px border-b border-[var(--el-border-color-lighter)]">
      <slot name="title">
        <div class="text-16px font-600 text-[var(--el-text-color-primary)]">{{ title }}</div>
      </slot>
    </div>

    <!-- 时间轴内容 -->
    <div class="px-20px py-24px">
      <el-timeline>
        <el-timeline-item
          v-for="(step, index) in steps"
          :key="index"
          :type="getTimelineType(step.status)"
          :color="getTimelineColor(step.status)"
          :hollow="step.status === 'waiting'"
          :size="step.status === 'processing' ? 'large' : 'normal'"
        >
          <template #dot>
            <div
              class="flex items-center justify-center w-32px h-32px rounded-full transition-all"
              :class="{
                'bg-[#409EFF] border-2 border-[#409EFF]': step.status === 'completed',
                'bg-white border-2 border-[#409EFF] shadow-[0_0_0_4px_rgba(64,158,255,0.1)]': step.status === 'processing',
                'bg-white border-2 border-[var(--el-border-color)]': step.status === 'waiting',
                'bg-[#F56C6C] border-2 border-[#F56C6C]': step.status === 'rejected'
              }"
            >
              <Icon
                v-if="getTimelineIcon(step.status)"
                :icon="getTimelineIcon(step.status)!"
                :size="16"
                :color="step.status === 'completed' || step.status === 'rejected' ? '#fff' : '#409EFF'"
              />
            </div>
          </template>

          <div class="flex flex-col gap-4px">
            <div
              class="text-14px font-500"
              :class="{
                'text-[var(--el-text-color-primary)] font-600': step.status === 'completed' || step.status === 'processing',
                'text-[#409EFF] font-600': step.status === 'processing',
                'text-[var(--el-text-color-regular)]': step.status === 'waiting',
                'text-[#F56C6C] font-600': step.status === 'rejected'
              }"
            >
              {{ step.title }}
            </div>

            <div v-if="step.time" class="text-12px text-[var(--el-text-color-secondary)]">
              {{ step.time }}
            </div>

            <div v-if="step.description" class="text-12px text-[var(--el-text-color-placeholder)] mt-4px">
              {{ step.description }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.approval-process {
  :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }

  :deep(.el-timeline-item__node) {
    display: none;
  }

  :deep(.el-timeline-item__tail) {
    left: 15px;
    border-left: 2px solid var(--el-border-color-lighter);
  }

  // 已完成步骤的连接线
  :deep(.el-timeline-item:has(.bg-\[\#409EFF\]) .el-timeline-item__tail) {
    border-left-color: #409EFF;
  }
}
</style>
