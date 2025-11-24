<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="px-20px py-11px">
        {{ title }}
        <el-link v-if="showViewAll" type="primary" :underline="false">全部</el-link>
      </div>
    </template>

    <el-row :gutter="16" class="mb-24px">
      <el-col :span="8">
        <StatCard label="合规资源" :value="browsedResources.compliant" />
      </el-col>
      <el-col :span="8">
        <StatCard label="组件资源" :value="browsedResources.component" />
      </el-col>
      <el-col :span="8">
        <StatCard label="应用资源" :value="browsedResources.application" />
      </el-col>
    </el-row>
  </AppCard>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { AppCard } from '@/components/AppCard'
import StatCard from '../StatCard.vue'
import { BROWSED_RESOURCES } from '../../mock/data'

defineOptions({ name: 'BrowsedResourcesWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '我浏览过的资源',
  showViewAll: true
})

const browsedResources = reactive({ ...BROWSED_RESOURCES })
</script>
