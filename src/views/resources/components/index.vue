<template>
  <ResourcePageView
    :resource-type="ResourceType.COMPONENT"
    :type-options="typeOptions"
    :show-deploy="true"
  />
</template>

<script lang="ts" setup>
import ResourcePageView from './ResourcePageView.vue'
import { ResourceType } from '@/api/resource/types'

defineOptions({ name: 'ComponentResource' })

const typeOptions = [
  { label: '全部', value: '' },
  { label: '线路一', value: 'route1' },
  { label: '线路二', value: 'route2' }
]
</script>
