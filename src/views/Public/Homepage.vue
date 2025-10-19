<template>
  <div ref="scrollContainerRef" class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <PublicComponents ref="publicComponentsRef" />
    <Header :is-scrolled="isScrolled" @navigation="navigateTo" />

    <!-- 测试按钮区域 -->
    <div class="fixed bottom-80px right-40px z-1000 flex flex-col gap-12px">
      <el-button type="primary" circle size="large" @click="showReviewModal = true">
        <Icon icon="ep:star" :size="20" />
      </el-button>
      <el-button type="success" circle size="large" @click="showDrawer = true">
        <Icon icon="ep:menu" :size="20" />
      </el-button>
      <el-button type="warning" circle size="large" @click="showApprovalDrawer = true">
        <Icon icon="ep:document" :size="20" />
      </el-button>
    </div>

    <main class="pt-56px">
      <component :is="ReuseBanner" :on-navigate="() => navigateTo('/workspace')" />
      <component :is="ReuseDataStatistics" :statistics="dataStatistics" />
      <component
        :is="ReuseQualityResourcesSection"
        :resources="qualityResources"
        :on-resource-click="({ id }) => navigateToDetail(id)"
        :on-more-click="() => navigateTo('/marketplace')"
      />
      <component :is="ReuseApplicationScenariosSection" :scenarios="applicationScenarios" />
      <component :is="ReuseResourceSharingCTA" :on-navigate="() => navigateTo('/marketplace')" />
    </main>

    <Footer :social-links="[]" @navigation="navigateTo" />
    <el-backtop :target="'.scroll-smooth'" />

    <!-- 评分弹窗组件 -->
    <RatingReviewModal
      v-model="showReviewModal"
      title="评价资源"
      @submit="handleReviewSubmit"
      @cancel="handleReviewCancel"
    />

    <!-- 抽屉组件 -->
    <Drawer v-model="showDrawer" title="快速资源发布" size="600px" @close="handleDrawerClose">
      <el-form :model="resourceForm" label-width="100px" label-position="top">
        <el-form-item label="资源名称">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源分类">
          <el-select v-model="resourceForm.category" placeholder="请选择分类" class="w-full">
            <el-option label="技术文档" value="doc" />
            <el-option label="开源项目" value="project" />
            <el-option label="在线工具" value="tool" />
            <el-option label="学习资源" value="learning" />
          </el-select>
        </el-form-item>

        <el-form-item label="资源链接">
          <el-input v-model="resourceForm.url" placeholder="请输入资源链接" />
        </el-form-item>

        <el-form-item label="资源描述">
          <el-input
            v-model="resourceForm.description"
            type="textarea"
            :rows="5"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="resourceForm.tags" multiple placeholder="请选择标签" class="w-full">
            <el-option label="热门" value="hot" />
            <el-option label="推荐" value="recommend" />
            <el-option label="新品" value="new" />
            <el-option label="免费" value="free" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDrawer = false">取消</el-button>
        <el-button type="primary" @click="handleResourceSubmit">发布资源</el-button>
      </template>
    </Drawer>

    <!-- 审批流程抽屉 -->
    <Drawer v-model="showApprovalDrawer" title="审批流程详情" size="500px">
      <ApprovalProcess :steps="approvalSteps" title="请假审批流程" />

      <el-divider />

      <div class="flex flex-col gap-12px">
        <el-button @click="changeToCompleted">模拟:审批通过当前步骤</el-button>
        <el-button type="danger" @click="changeToRejected">模拟:拒绝审批</el-button>
        <el-button @click="resetApproval">重置流程</el-button>
      </div>

      <template #footer>
        <el-button @click="showApprovalDrawer = false">关闭</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import PublicComponents from './components/PublicComponents.vue'
import { useHomepageData } from './composables/useHomepageData'
import { usePublic } from './composables/usePublic'
import { RatingReviewModal } from '@/components/RatingReviewModal'
import type { RatingReviewResult } from '@/components/RatingReviewModal'
import { Drawer } from '@/components/Drawer'
import { ElMessage } from 'element-plus'
import { ApprovalProcess } from '@/temp-components/ApprovalProcess'
import type { ApprovalStep } from '@/temp-components/ApprovalProcess'

defineOptions({ name: 'Homepage' })

// 数据
const { qualityResources, applicationScenarios, dataStatistics } = useHomepageData()

// 滚动和导航
const { scrollContainerRef, isScrolled, navigateTo, navigateToDetail } = usePublic()

// 可重用组件引用
const publicComponentsRef = ref<InstanceType<typeof PublicComponents>>()
const ReuseBanner = computed(() => publicComponentsRef.value?.Banner as Component | undefined)
const ReuseQualityResourcesSection = computed(() => publicComponentsRef.value?.QualityResourcesSection as Component | undefined)
const ReuseApplicationScenariosSection = computed(() => publicComponentsRef.value?.ApplicationScenariosSection as Component | undefined)
const ReuseDataStatistics = computed(() => publicComponentsRef.value?.DataStatistics as Component | undefined)
const ReuseResourceSharingCTA = computed(() => publicComponentsRef.value?.ResourceSharingCTA as Component | undefined)

// 评分弹窗状态
const showReviewModal = ref(false)

// 处理评分提交
const handleReviewSubmit = (data: RatingReviewResult) => {
  console.log('评价资源:', data)
  ElMessage.success(`感谢您的评价! 选择了 ${data.tags.length} 个标签`)
}

// 处理评分取消
const handleReviewCancel = () => {
  ElMessage.info('已取消评价')
}

// 抽屉状态
const showDrawer = ref(false)
const resourceForm = ref({
  name: '',
  category: '',
  url: '',
  description: '',
  tags: [] as string[]
})

// 处理资源提交
const handleResourceSubmit = () => {
  console.log('发布资源:', resourceForm.value)
  ElMessage.success('资源发布成功!')
  showDrawer.value = false
  // 重置表单
  resourceForm.value = {
    name: '',
    category: '',
    url: '',
    description: '',
    tags: []
  }
}

// 处理抽屉关闭
const handleDrawerClose = () => {
  console.log('抽屉关闭')
}

// 审批流程抽屉状态
const showApprovalDrawer = ref(false)
const approvalSteps = ref<ApprovalStep[]>([
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed',
    description: '申请人: 张三 | 请假3天'
  },
  {
    title: '审批中',
    time: '2025-10-24 10:32',
    status: 'processing',
    description: '审批人: 李四(部门经理)'
  },
  {
    title: '申请结果',
    status: 'waiting'
  }
])

// 模拟审批通过
const changeToCompleted = () => {
  const processingIndex = approvalSteps.value.findIndex(step => step.status === 'processing')
  if (processingIndex !== -1) {
    approvalSteps.value[processingIndex].status = 'completed'
    approvalSteps.value[processingIndex].time = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    // 下一步改为 processing
    if (processingIndex + 1 < approvalSteps.value.length) {
      approvalSteps.value[processingIndex + 1].status = 'processing'
      approvalSteps.value[processingIndex + 1].time = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    ElMessage.success('审批通过!')
  } else {
    ElMessage.warning('流程已完成')
  }
}

// 模拟拒绝审批
const changeToRejected = () => {
  const processingIndex = approvalSteps.value.findIndex(step => step.status === 'processing')
  if (processingIndex !== -1) {
    approvalSteps.value[processingIndex].status = 'rejected'
    approvalSteps.value[processingIndex].description = '审批人: 李四 - 拒绝原因: 请假理由不充分'
    ElMessage.error('审批已拒绝')
  }
}

// 重置审批流程
const resetApproval = () => {
  approvalSteps.value = [
    {
      title: '提交申请',
      time: '2025-10-24 10:32',
      status: 'completed',
      description: '申请人: 张三 | 请假3天'
    },
    {
      title: '审批中',
      time: '2025-10-24 10:32',
      status: 'processing',
      description: '审批人: 李四(部门经理)'
    },
    {
      title: '申请结果',
      status: 'waiting'
    }
  ]
  ElMessage.info('流程已重置')
}
</script>
