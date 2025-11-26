<template>
  <ContentWrap :body-style="{ padding: '0 20px' }">
      <!-- 主内容区 -->
      <div class="h-[calc(100vh-198px)] flex">
        <!-- 左侧文档列表 -->
        <div class="h-full w-258px overflow-y-auto border-0 border-r-1 border-[#0000000f] border-solid pr-24px pt-20px">
          <!-- 搜索框 -->
          <div class="border-0 border-b-1 border-[#0000000f] border-solid pb-18px pt-4px">
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

          <!-- 文档列表 -->
          <div class="px-8px py-16px">
            <div
              v-for="doc in filteredDocs"
              :key="doc.id"
              class="mb-4px cursor-pointer rounded-6px px-16px py-12px text-14px text-[#606266] transition-all duration-200"
              :class="selectedDocId === doc.id ? 'bg-[#ecf5ff] text-[#409eff] font-500' : 'hover:bg-[#f5f7fa] hover:text-[#303133]'"
              @click="selectDoc(doc)"
            >
              {{ doc.title }}
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
              修改时间：{{ currentDoc.updateTime }}
            </div>

            <!-- 文档内容 -->
            <div class="text-15px text-[#606266] leading-relaxed">
              <div v-html="currentDoc.content"></div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HelpDoc' })

const router = useRouter()

interface HelpDoc {
  id: number
  title: string
  updateTime: string
  content: string
}

// 搜索关键字
const searchKeyword = ref('')

// 选中的文档 ID
const selectedDocId = ref<number | null>(null)

// 文档列表
const docList = ref<HelpDoc[]>([
  {
    id: 1,
    title: '这是一个选中样式',
    updateTime: '2025-8-23 11:28',
    content: `
      <p style="margin-bottom: 20px;">产品的增长依赖于用户的群体扩大和深度使用，而用户的成长又依赖于产品功能的完善，设计者应建立系统设计思维，洞悉产品功能的价值，探索用户在不同场景下的需求，在价值和需求的理解，让产品价值被发现，帮助用户建立更有效，更高效的工作方式。</p>
      <p>产品的增长依赖于用户的群体扩大和深度使用，而用户的成长又依赖于产品功能的完善，设计者应建立系统设计思维，洞悉产品功能的价值，探索用户在不同场景下的需求，在价值和需求的理解，让产品价值被发现，帮助用户建立更有效，更高效的工作方式。</p>
    `
  },
  {
    id: 2,
    title: '这是一个悬浮样式',
    updateTime: '2025-8-22 15:30',
    content: `
      <p style="margin-bottom: 20px;">这是一个悬浮样式的文档内容示例。产品设计需要考虑用户体验的各个方面，包括界面的美观性、交互的流畅性以及功能的实用性。</p>
      <p>通过合理的设计，可以提升用户的满意度和产品的竞争力。</p>
    `
  },
  {
    id: 3,
    title: '这是一个文档名称',
    updateTime: '2025-8-21 09:15',
    content: `
      <p style="margin-bottom: 20px;">文档管理系统帮助团队更好地组织和分享知识。通过分类和搜索功能，用户可以快速找到需要的信息。</p>
      <p>良好的文档管理可以提高团队协作效率，减少沟通成本。</p>
    `
  },
  {
    id: 4,
    title: '这是一个文档名称',
    updateTime: '2025-8-20 16:45',
    content: `
      <p style="margin-bottom: 20px;">在现代软件开发中，文档是不可或缺的一部分。清晰的文档可以帮助开发者理解系统架构和业务逻辑。</p>
      <p>同时，文档也是新成员快速上手的重要资料。</p>
    `
  },
  {
    id: 5,
    title: '这是一个文档名称',
    updateTime: '2025-8-19 10:20',
    content: `
      <p style="margin-bottom: 20px;">用户手册是产品文档的重要组成部分。它应该包含产品的使用方法、常见问题解答以及故障排除指南。</p>
      <p>一份好的用户手册可以大大减少用户支持的工作量。</p>
    `
  },
  {
    id: 6,
    title: '这是一个文档名称',
    updateTime: '2025-8-18 14:30',
    content: `
      <p style="margin-bottom: 20px;">API 文档是开发者文档的核心。它应该详细描述每个接口的功能、参数、返回值以及使用示例。</p>
      <p>清晰的 API 文档可以帮助开发者快速集成和使用你的服务。</p>
    `
  },
  {
    id: 7,
    title: '这是一个默认样式',
    updateTime: '2025-8-17 11:00',
    content: `
      <p style="margin-bottom: 20px;">默认样式是设计系统的基础。通过定义一致的样式规范，可以确保产品界面的统一性和专业性。</p>
      <p>设计系统还应该包含组件库、颜色规范、字体规范等内容。</p>
    `
  },
  {
    id: 8,
    title: '这是一个文档名称',
    updateTime: '2025-8-16 13:45',
    content: `
      <p style="margin-bottom: 20px;">版本管理是软件开发的重要环节。通过版本控制系统，团队可以协同工作，追踪代码变更历史。</p>
      <p>Git 是目前最流行的版本控制系统，它提供了强大的分支管理和合并功能。</p>
    `
  },
  {
    id: 9,
    title: '这是一个文档名称',
    updateTime: '2025-8-15 09:30',
    content: `
      <p style="margin-bottom: 20px;">测试文档记录了测试计划、测试用例以及测试结果。完善的测试文档可以确保产品质量。</p>
      <p>自动化测试可以提高测试效率，减少人为错误。</p>
    `
  }
])

// 过滤后的文档列表
const filteredDocs = computed(() => {
  if (!searchKeyword.value) {
    return docList.value
  }
  return docList.value.filter((doc) =>
    doc.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 当前选中的文档
const currentDoc = computed(() => {
  return docList.value.find((doc) => doc.id === selectedDocId.value) || null
})

// 搜索处理
const handleSearch = () => {
  // 搜索后自动选中第一个结果
  if (filteredDocs.value.length > 0 && !selectedDocId.value) {
    selectedDocId.value = filteredDocs.value[0].id
  }
}

// 选择文档
const selectDoc = (doc: HelpDoc) => {
  selectedDocId.value = doc.id
}

// 返回
const goBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  // 默认选中第一个文档
  if (docList.value.length > 0) {
    selectedDocId.value = docList.value[0].id
  }
})
</script>
