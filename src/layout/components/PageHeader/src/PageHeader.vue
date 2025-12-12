<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import BackHeader from './BackHeader.vue'

defineOptions({ name: 'PageHeader' })

const route = useRoute()

// 从路由 meta 或 query 获取配置
// query 参数: _hb=1 显示面包屑, _hk=1 显示返回
const showBreadcrumb = computed(
  () => route.meta.showBreadcrumb !== false || route.query._hb !== '0'
)
const showBack = computed(() => route.meta.showBack === true || route.query._hk === '1')

// 是否显示 PageHeader
const showHeader = computed(() => showBreadcrumb.value || showBack.value)
</script>

<template>
  <div v-if="showHeader">
    <Breadcrumb v-if="showBreadcrumb" />
    <BackHeader v-if="showBack">
      <!-- 右侧扩展插槽，可在父组件中使用 -->
      <template #right>
        <slot name="action" />
      </template>
    </BackHeader>
  </div>
</template>
