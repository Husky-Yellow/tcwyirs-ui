<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="px-20px py-11px">
        {{ title }}
        <el-link v-if="showViewAll" type="primary" :underline="false">全部</el-link>
      </div>
    </template>

    <div class="help-doc-list">
      <div
        v-for="item in helpDocs"
        :key="item.id"
        class="help-doc-item hover:text-primary cursor-pointer border-b border-gray-100 py-10px transition-colors last:border-b-0"
        @click="handleClick(item)"
      >
        <div class="text-14px">{{ item.title }}</div>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppCard } from '@/components/AppCard'
import { HELP_DOCS } from '../../mock/data'
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

const helpDocs = ref([...HELP_DOCS])

const handleClick = (item: any) => {
  ElMessage.info(`打开文档: ${item.title}`)
}
</script>
