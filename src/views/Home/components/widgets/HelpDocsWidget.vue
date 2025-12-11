<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="flex items-center justify-between bg-[#ffffff99] px-20px py-11px shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)]">
        <span class="text-16px text-[#303133] font-500">帮助文档</span>
        <span class="cursor-pointer text-14px text-[#606266] hover:text-[#409eff]" @click="handleViewAll">全部</span>
      </div>
    </template>
    <ul v-if="helpDocs.length > 0" class="list-none px-20px pb-20px pt-8px space-y-8px">
      <li
        v-for="(item, index) in helpDocs"
        :key="index"
        class="flex cursor-pointer items-center justify-between pt-9px text-14px text-[#606266] hover:text-[#409eff]"
        @click="handleClick(item)"
      >
        {{ item.title || item.name }}
      </li>
    </ul>
    <el-empty v-else description="暂无帮助文档" />
  </AppCard>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard } from '@/components/AppCard'
import { ElMessage } from 'element-plus'
import { getDocumentPage, type DocumentVO } from '@/api/resource/document'

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

// 帮助文档列表
const helpDocs = ref<DocumentVO[]>([])
const loading = ref(false)

// 加载帮助文档数据
const loadHelpDocs = async () => {
  try {
    loading.value = true
    const { list } = await getDocumentPage({
      pageNo: 1,
      pageSize: 5,
      status: 1 // 只显示已发布的文档
    })
    helpDocs.value = list || []
  } catch (error) {
    console.error('加载帮助文档失败:', error)
  } finally {
    loading.value = false
  }
}

const handleClick = (item: DocumentVO) => {
  if (!item.id) {
    ElMessage.warning('文档ID不存在')
    return
  }
  // 跳转到文档详情页，通过查询参数传递文档ID
  router.push({
    path: '/workbench/help-doc',
    query: { id: item.id }
  })
}

// 跳转到帮助文档页面
const handleViewAll = () => {
  router.push({ name: 'HelpDoc' })
}

onMounted(() => {
  loadHelpDocs()
})
</script>
