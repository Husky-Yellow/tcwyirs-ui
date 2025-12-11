<template>
  <ContentWrap :body-style="{ padding: '0 20px' }">
      <!-- 主内容区 -->
      <div class="h-[calc(100vh-218px)] flex">
        <!-- 左侧文档列表 -->
        <div class="relative h-full w-258px border-0 border-r-1 border-[#0000000f] border-solid pr-24px">
          <!-- 搜索框（悬浮固定） -->
          <div class="sticky top-0 z-10 border-0 border-b-1 border-[#0000000f] border-solid bg-white pb-18px pt-20px">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入名称关键字"
              clearable
              @input="handleSearch"
            >
              <template #suffix>
                <Icon icon="ep:search" class="text-[#909399]" />
              </template>
            </el-input>
          </div>

          <!-- 文档列表（可滚动） -->
          <div
            ref="listContainerRef"
            class="h-[calc(100%-80px)] overflow-y-auto"
            @scroll="handleScroll"
          >
            <div v-loading="loading" class="min-h-200px px-8px py-16px">
              <div
                v-for="doc in docList"
                :key="doc.id"
                class="mb-4px cursor-pointer rounded-6px px-16px py-12px text-14px text-[#606266] transition-all duration-200"
                :class="selectedDocId === doc.id ? 'bg-[#ecf5ff] text-[#409eff] font-500' : 'hover:bg-[#f5f7fa] hover:text-[#303133]'"
                @click="selectDoc(doc)"
              >
                {{ doc.name }}
              </div>

              <!-- 加载更多提示 -->
              <div v-if="hasMore && !loading" class="py-12px text-center text-14px text-[#909399]">
                滚动加载更多...
              </div>

              <!-- 没有更多数据 -->
              <div v-if="!hasMore && docList.length > 0 && !loading" class="py-12px text-center text-14px text-[#909399]">
                已加载全部文档
              </div>

              <!-- 无数据提示 -->
              <div v-if="!loading && docList.length === 0" class="py-40px text-center text-14px text-[#909399]">
                暂无文档
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧文档内容 -->
        <div class="h-full flex-1 overflow-y-auto">
          <div v-if="currentDoc" class="p-40px">
            <!-- 文档标题 -->
            <h2 class="mb-12px text-24px text-[#303133] font-600">
              {{ currentDoc.title }}
            </h2>

            <!-- 修改时间 -->
            <div class="mb-32px text-14px text-[#909399]">
              修改时间：{{ currentDoc.pushTime ? formatDate(currentDoc.pushTime) : (currentDoc.createTime ? formatDate(currentDoc.createTime) : '-') }}
            </div>

            <!-- 文档内容 -->
            <div v-loading="contentLoading" class="min-h-200px text-15px text-[#606266] leading-relaxed">
              <!-- PDF 文件 -->
              <iframe
                v-if="fileType === 'pdf' && currentDoc.url"
                :src="currentDoc.url"
                class="h-[calc(100vh-400px)] w-full border-1 border-[#dcdfe6] rounded-4px"
              />

              <!-- Markdown 文件 -->
              <MarkdownView
                v-else-if="fileType === 'markdown' && markdownContent"
                :content="markdownContent"
              />

              <!-- HTML 内容（向后兼容） -->
              <div v-else-if="currentDoc.content" v-html="currentDoc.content"></div>

              <!-- 无内容 -->
              <div v-else class="py-40px text-center text-[#909399]">
                暂无内容
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="h-full flex items-center justify-center">
            <el-empty description="请选择文档" />
          </div>
        </div>
      </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDocumentPage, getDocument, type DocumentVO } from '@/api/resource/document'
import { formatDate } from '@/utils/formatTime'
import { useDebounceFn } from '@vueuse/core'
import MarkdownView from '@/components/MarkdownView/index.vue'
import axios from 'axios'

defineOptions({ name: 'HelpDoc' })

const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)
const contentLoading = ref(false)

// 搜索关键字
const searchKeyword = ref('')

// 选中的文档 ID
const selectedDocId = ref<number | null>(null)

// 文档列表
const docList = ref<DocumentVO[]>([])

// 分页状态
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const hasMore = computed(() => docList.value.length < total.value)

// 列表容器引用
const listContainerRef = ref<HTMLElement | null>(null)

// 当前文档详情
const currentDocDetail = ref<DocumentVO | null>(null)

// Markdown 文件内容
const markdownContent = ref('')

// 计算文件类型
const fileType = computed(() => {
  const url = currentDocDetail.value?.url
  if (!url) return 'html'

  const ext = url.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'md' || ext === 'markdown') return 'markdown'
  return 'html'
})

// 当前选中的文档
const currentDoc = computed(() => {
  return currentDocDetail.value
})

// 加载文档列表
const loadDocList = async (append = false) => {
  // 如果没有更多数据且是追加模式，直接返回
  if (append && !hasMore.value) return

  try {
    loading.value = true
    const { list, total: totalCount } = await getDocumentPage({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      status: 1, // 只显示已发布的文档
      title: searchKeyword.value || undefined
    })

    // 更新总数
    total.value = totalCount

    // 追加或替换数据
    if (append) {
      docList.value = [...docList.value, ...(list || [])]
    } else {
      docList.value = list || []
    }
  } catch (error) {
    console.error('加载文档列表失败:', error)
    if (!append) {
      docList.value = []
    }
  } finally {
    loading.value = false
  }
}

// 加载文档详情
const loadDocDetail = async (id: number) => {
  try {
    currentDocDetail.value = await getDocument(id)

    // 如果是 Markdown 文件，需要加载文件内容
    if (currentDocDetail.value?.url) {
      const ext = currentDocDetail.value.url.split('.').pop()?.toLowerCase()
      if (ext === 'md' || ext === 'markdown') {
        await loadMarkdownContent(currentDocDetail.value.url)
      }
    }
  } catch (error) {
    console.error('加载文档详情失败:', error)
    currentDocDetail.value = null
  }
}

// 加载 Markdown 文件内容
const loadMarkdownContent = async (url: string) => {
  try {
    contentLoading.value = true
    const response = await axios.get(url, { responseType: 'text' })
    markdownContent.value = response.data
  } catch (error) {
    console.error('加载 Markdown 文件失败:', error)
    markdownContent.value = '加载文件失败'
  } finally {
    contentLoading.value = false
  }
}

// 搜索处理（防抖）
const handleSearch = useDebounceFn(async () => {
  // 重置分页
  currentPage.value = 1
  docList.value = []

  // 重新加载列表
  await loadDocList()

  // 搜索后自动选中第一个结果
  if (docList.value.length > 0 && docList.value[0].id) {
    selectDoc(docList.value[0])
  } else {
    selectedDocId.value = null
    currentDocDetail.value = null
  }
}, 300)

// 滚动处理 - 加载更多
const handleScroll = useDebounceFn((event: Event) => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 距离底部 100px 时触发加载
  if (scrollHeight - scrollTop - clientHeight < 100 && hasMore.value && !loading.value) {
    currentPage.value++
    loadDocList(true) // 追加模式
  }
}, 200)

// 选择文档
const selectDoc = (doc: DocumentVO) => {
  if (doc.id) {
    selectedDocId.value = doc.id
    loadDocDetail(doc.id)
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 初始化
onMounted(async () => {
  // 加载文档列表
  await loadDocList()

  // 如果 URL 中有 id 参数，则选中对应的文档
  const urlDocId = route.query.id
  if (urlDocId && docList.value.length > 0) {
    const targetDoc = docList.value.find(doc => doc.id === Number(urlDocId))
    if (targetDoc) {
      selectDoc(targetDoc)
      return
    }
  }

  // 否则默认选中第一个文档
  if (docList.value.length > 0 && docList.value[0].id) {
    selectDoc(docList.value[0])
  }
})

// 监听路由参数变化
watch(() => route.query.id, (newId) => {
  if (newId && docList.value.length > 0) {
    const targetDoc = docList.value.find(doc => doc.id === Number(newId))
    if (targetDoc) {
      selectDoc(targetDoc)
    }
  }
})
</script>
