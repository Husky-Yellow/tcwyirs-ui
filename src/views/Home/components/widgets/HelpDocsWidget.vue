<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="flex items-center justify-between bg-[#ffffff99] px-20px py-11px shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
        <span class="text-16px text-[#303133] font-500">帮助文档</span>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]" @click="handleViewAll">全部</span>
      </div>
    </template>

    <ul class="list-none px-20px pb-20px pt-8px space-y-8px">
      <li
        v-for="(item, index) in helpDocs"
        :key="index"
        class="flex cursor-pointer items-center justify-between pt-9px text-14px text-[#606266] hover:text-[#409eff]"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </li>
    </ul>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'HelpDocsWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '帮助文档',
  showViewAll: true
})

const router = useRouter()

// TODO: 从 API 获取帮助文档数据
const helpDocs = ref<Array<{ id: number; title: string }>>([])

const handleClick = (item: any) => {
  ElMessage.info(`打开文档: ${item.title}`)
}

// 跳转到帮助文档页面
const handleViewAll = () => {
  router.push({ name: 'HelpDoc' })
}
</script>
