<template>
  <!-- 申请后的中转页面 -->
  <ContentWrap>
    <!-- 面包屑 -->
    <div class="mb-32px text-14px text-[var(--el-text-color-secondary)]">
      <el-breadcrumb separator=">" class="mb-16px">
        <el-breadcrumb-item>智能资源管理后台</el-breadcrumb-item>
        <el-breadcrumb-item>智能资源消费门户</el-breadcrumb-item>
        <el-breadcrumb-item>我发起的</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 成功提示 -->
    <div class="flex flex-col items-center justify-center py-80px">
      <!-- 成功图标 -->
      <div class="mb-24px h-80px w-80px flex items-center justify-center rounded-full bg-green-500">
        <Icon icon="ep:check" class="text-48px text-white" />
      </div>

      <!-- 提示文本 -->
      <div class="mb-16px text-center">
        <div class="text-14px text-[var(--el-text-color-secondary)]">
          车辆管理系统-申请成功提交
        </div>
        <div class="mt-8px text-16px text-[var(--el-text-color-primary)] font-500">
          正在等待资源管理员审核，预计24小时内将有结果反馈
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-12px">
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" @click="handleView">查看</el-button>
      </div>
    </div>

    <!-- 申请详情 -->
    <div class="mt-40px">
      <div class="mb-16px text-16px font-600">车辆管理系统</div>
      <div class="grid grid-cols-3 gap-y-16px">
        <div>
          <div class="text-14px text-[var(--el-text-color-secondary)]">资源类型</div>
          <div class="mt-8px text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.resourceType }}
          </div>
        </div>
        <div>
          <div class="text-14px text-[var(--el-text-color-secondary)]">申请项目</div>
          <div class="mt-8px text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.projectName }}
          </div>
        </div>
        <div>
          <div class="text-14px text-[var(--el-text-color-secondary)]">天然联想抽</div>
          <div class="mt-8px text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.days }}
          </div>
        </div>
        <div>
          <div class="text-14px text-[var(--el-text-color-secondary)]">申请周期</div>
          <div class="mt-8px text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.period }}
          </div>
        </div>
        <div>
          <div class="text-14px text-[var(--el-text-color-secondary)]">申请原因1</div>
          <div class="mt-8px text-14px text-[var(--el-text-color-primary)]">
            {{ applicationInfo.reason }}
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ContentWrap } from '@/components/ContentWrap'

defineOptions({ name: 'ApprovalSuccess' })

const router = useRouter()
const route = useRoute()

// 申请信息
const applicationInfo = ref({
  resourceType: '数据资源',
  projectName: '天宫项目组',
  days: '14天',
  period: '2025-10-19~2028-10-31 (18天)',
  reason: '用于项目进展成果工作中使用'
})

// 返回
const handleBack = () => {
  router.back()
}

// 查看
const handleView = () => {
  router.push({
    name: 'ApprovalDetail',
    query: {
      status: 'pending',
      id: '1' // TODO: 使用实际的申请ID
    }
  })
}

// 初始化
onMounted(() => {
  // 可以从路由参数中获取申请信息
  const { applicationData } = route.query
  if (applicationData) {
    try {
      Object.assign(applicationInfo.value, JSON.parse(applicationData as string))
    } catch (error) {
      console.error('解析申请数据失败:', error)
    }
  }
})
</script>

<style scoped lang="scss">
// 自定义样式
</style>
