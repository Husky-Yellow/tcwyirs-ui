<template>
  <ResourcePageView
    :resource-type="ResourceType.DATA"
    :type-options="typeOptions"
    :show-deploy="false"
  />
</template>

<script lang="ts" setup>
import ResourcePageView from '../components/ResourcePageView.vue'
import { ResourceType } from '@/api/resource/types'

defineOptions({ name: 'DataResource' })

const typeOptions = [
  { label: '全部', value: '' },
  { label: '数据库', value: 'database' },
  { label: '数据仓库', value: 'warehouse' },
  { label: 'API', value: 'api' }
]
</script>
