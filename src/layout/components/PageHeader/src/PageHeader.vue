<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { Back } from '@element-plus/icons-vue'

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
  <div v-if="showHeader">
    <Breadcrumb v-if="showBreadcrumb" class="mb-12px" />
    <div
      v-if="showBack"
      class="inline-flex items-center py-24px cursor-pointer text-black/85 hover:text-[var(--el-color-primary)] transition-colors"
      @click="handleBack"
    >
      <el-icon :size="18"><Back /></el-icon>
      <span class="font-['PingFang_SC'] font-medium text-[20px] leading-[28px] ml-16px">{{ pageTitle }}</span>
    </div>
  </div>
</template>
