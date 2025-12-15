<template>
  <div>
    <!-- 根据角色显示不同的视图 -->
    <!-- 资源管理员：显示资源申请视图 -->
    <ResourceApplyView v-if="isResourceAdmin" />

    <!-- 项目成员/项目经理：显示项目申请视图 -->
    <ProjectApplyView v-else-if="isProjectMember || isProjectManager" />

    <!-- 其他角色：默认显示项目申请视图 -->
    <ProjectApplyView v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import ResourceApplyView from './components/resource.vue'
import ProjectApplyView from './components/project.vue'

defineOptions({ name: 'MyApplyResources' })

const userStore = useUserStore()

/** 获取当前角色 */
const currentRole = computed(() => userStore.getCurrentRole)

/** 判断角色类型 */
const isResourceAdmin = computed(() => currentRole.value === 'resource_admin')
const isProjectMember = computed(() => currentRole.value === 'project_member')
const isProjectManager = computed(() => currentRole.value === 'project_manager')
</script>
