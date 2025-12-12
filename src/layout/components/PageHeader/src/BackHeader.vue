<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'

defineOptions({ name: 'BackHeader' })

interface Props {
  title?: string
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()

// 如果没有传入 title，则从路由 meta 获取
const displayTitle = computed(() => props.title || (route.meta.title as string))

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div
    class="flex items-center pb-24px pt-12px text-black/85 transition-colors hover:text-[var(--el-color-primary)]"
    @click="handleBack"
  >
    <div class="inline-flex items-center">
      <el-icon :size="18" class="cursor-pointer"><Back /></el-icon>
      <span class="ml-16px text-[20px] font-medium leading-[28px] font-['PingFang_SC']">{{
        displayTitle
      }}</span>
    </div>

    <!-- 右侧扩展插槽 -->
    <slot name="right" />
  </div>
</template>
