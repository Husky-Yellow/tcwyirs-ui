<template>
  <ResourcePageView
    :resource-type="ResourceType.APPLICATION"
    :type-options="typeOptions"
    :show-deploy="true"
  />
</template>

<script lang="ts" setup>
import ResourcePageView from '../components/ResourcePageView.vue'
import { ResourceType } from '@/api/resource/types'

defineOptions({ name: 'ApplicationResource' })

const typeOptions = [
  { label: '全部', value: '' },
  { label: '数据库', value: 'database' },
  { label: '缓存', value: 'cache' },
  { label: '消息队列', value: 'mq' }
]
</script>
