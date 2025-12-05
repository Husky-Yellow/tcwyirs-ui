<template>
  <ContentWrap>
    <div class="pb-20px text-lg font-bold">基本信息</div>
    <!-- 第一行信息 -->
    <div class="mb-4 flex flex-wrap">
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目编号:</span>
        <span class="text-sm text-gray-800 font-medium">{{ projectDetail?.id || '-' }}</span>
      </div>
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目名称:</span>
        <span class="text-sm text-gray-800 font-medium">{{ projectDetail?.name || '-' }}</span>
      </div>
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目经理:</span>
        <span class="text-sm text-gray-800">{{ projectDetail?.leaderName || '-' }}</span>
      </div>
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目周期:</span>
        <span class="text-sm text-gray-800">{{ formatDateRange(projectDetail?.startTime, projectDetail?.endTime) }}</span>
      </div>
    </div>

    <!-- 第二行信息 -->
    <div class="mb-4 flex flex-wrap">
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目状态:</span>
        <span class="text-sm text-gray-800 flex items-center">
          <span class="mr-2 inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: getStatusColor(projectDetail?.status) }"></span>
          {{ getStatusText(projectDetail?.status) }}
        </span>
      </div>
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目类型:</span>
        <span class="text-sm text-gray-800">{{ projectDetail?.type || '-' }}</span>
      </div>
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/2 md:w-full">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目成员:</span>
        <span class="text-sm text-gray-800">{{ formatMembers(projectDetail?.members) }}</span>
      </div>
    </div>

    <!-- 第三行信息 -->
    <div class="flex flex-wrap">
      <div class="mb-3 w-full flex items-center md:mb-0 lg:w-1/4 md:w-1/2">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目来源:</span>
        <span class="text-sm text-gray-800">{{ projectDetail?.source || '-' }}</span>
      </div>
      <div class="w-full flex items-center lg:w-3/4 md:w-full">
        <span class="font-pingfang-sc mr-6px text-left align-top text-[14px] text-black/45 font-normal tracking-normal">项目说明:</span>
        <span class="text-sm text-gray-800">{{ projectDetail?.description || '-' }}</span>
      </div>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { formatDate } from '@/utils/formatTime'
import type { ProjectVO } from '@/api/resource/project'

defineOptions({ name: 'ProjectBasicInfo' })

interface Props {
  projectDetail?: ProjectVO
}

defineProps<Props>()

// 获取状态颜色
const getStatusColor = (status: number | undefined) => {
  const colorMap = {
    1: '#409eff', // 蓝色 - 进行中
    2: '#909399', // 灰色 - 已完成
    3: '#e6a23c'  // 橙色 - 已暂停
  }
  return colorMap[status || 1] || '#909399'
}

// 获取状态文本
const getStatusText = (status: number | undefined) => {
  const statusMap = {
    1: '进行中',
    2: '已完成',
    3: '已暂停'
  }
  return statusMap[status || 1] || '未知'
}

// 格式化项目成员
const formatMembers = (members: any) => {
  if (!members) return '-'
  if (Array.isArray(members)) {
    return members.join('，')
  }
  if (typeof members === 'string') {
    return members
  }
  return '-'
}

// 格式化日期范围
const formatDateRange = (startTime: Date | string | undefined, endTime: Date | string | undefined) => {
  const start = startTime ? formatDate(new Date(startTime), 'YYYY-MM-DD') : '-'
  const end = endTime ? formatDate(new Date(endTime), 'YYYY-MM-DD') : '-'
  return `${start} ~ ${end}`
}
</script>
