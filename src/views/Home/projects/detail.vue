<template>
  <ProjectBasicInfo :project-detail="projectDetail" />
  <ProjectResourceUsage :resource-usage-list="resourceUsageList" @refresh="loadResourceUsageList" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProject } from '@/api/resource/project'
import type { ProjectVO } from '@/api/resource/project'
import { getResourceUsagePage } from '@/api/resource/usage'
import type { ResourceUsageVO } from '@/api/resource/usage'
import ProjectBasicInfo from './components/ProjectBasicInfo.vue'
import ProjectResourceUsage from './components/ProjectResourceUsage.vue'

defineOptions({ name: 'ProjectDetail' })

const route = useRoute()

// 项目ID
const projectId = ref<number>(Number(route.params.id) || Number(route.query.id))

// 项目详情
const loading = ref(false)
const projectDetail = ref<ProjectVO>()

// 资源使用列表
const resourcesLoading = ref(false)
const resourceUsageList = ref<ResourceUsageVO[]>([])

// 加载项目详情
const loadProjectDetail = async () => {
  if (!projectId.value) {
    ElMessage.error('项目ID不存在')
    return
  }

  loading.value = true
  try {
    projectDetail.value = await getProject(projectId.value)
  } catch (error) {
    console.error('加载项目详情失败:', error)
    ElMessage.error('加载项目详情失败')
  } finally {
    loading.value = false
  }
}

// 加载资源使用列表
const loadResourceUsageList = async () => {
  if (!projectId.value) return

  resourcesLoading.value = true
  try {
    const res = await getResourceUsagePage({
      projectName: projectDetail.value?.name,
      pageNo: 1,
      pageSize: 100 // 获取所有资源
    })
    resourceUsageList.value = res.list
  } catch (error) {
    console.error('加载资源使用列表失败:', error)
    resourceUsageList.value = []
  } finally {
    resourcesLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadProjectDetail()
  await loadResourceUsageList()
})
</script>
