<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { Icon } from '@/components/Icon'

defineOptions({ name: 'PageHeader' })

const route = useRoute()
const router = useRouter()

// 从路由 meta 或 query 获取配置
// query 参数: _hb=1 显示面包屑, _hk=1 显示返回
const showBreadcrumb = computed(
  () => route.meta.showBreadcrumb !== false && route.query._hb !== '0'
)
const showBack = computed(() => route.meta.showBack === true || route.query._hk === '1')
const pageTitle = computed(() => route.meta.title as string)

// 是否显示 PageHeader
const showHeader = computed(() => showBreadcrumb.value || showBack.value)

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div v-if="showHeader" class="p-3 bg-white rounded-2 mb-3">
    <!-- 面包屑 -->
    <div v-if="showBreadcrumb" class="mb-2">
      <Breadcrumb />
    </div>
    <!-- 返回按钮 + 标题 -->
    <div v-if="showBack" class="flex items-center gap-2">
      <span
        class="flex items-center justify-center cursor-pointer text-gray-500 hover:text-[var(--el-color-primary)] transition-colors"
        @click="handleBack"
      >
        <Icon icon="ep:arrow-left" :size="18" />
      </span>
      <span class="text-4 font-500 text-gray-800">{{ pageTitle }}</span>
    </div>
  </div>
</template>
