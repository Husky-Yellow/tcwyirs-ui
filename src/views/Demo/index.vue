<template>
  <div class="demo-page h-screen overflow-y-auto bg-[#f5f7fa]">
    <!-- 页面头部 -->
    <div class="border-b border-[var(--el-border-color-lighter)] bg-white">
      <div class="mx-auto max-w-1400px px-24px py-20px">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-12px">
            <Icon icon="ep:box" :size="32" color="#409EFF" />
            <div>
              <h1 class="mb-4px text-24px text-[var(--el-text-color-primary)] font-700">
                组件展示 Demo
              </h1>
              <p class="text-14px text-[var(--el-text-color-secondary)]"> Component Showcase </p>
            </div>
          </div>
          <el-button type="primary" @click="navigateToHome">
            <Icon icon="ep:home-filled" class="mr-6px" />
            返回首页
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="mx-auto max-w-1400px px-24px py-32px pb-60px">
      <!-- 组件展示卡片 -->
      <div class="grid grid-cols-1 gap-24px">
        <!-- 1. 评分/评论组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:star" :size="24" color="#409EFF" />
                <div>
                  <h2 class="text-18px font-600">RatingReviewModal - 评分/评论组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    支持标签选择和评论输入,实时显示已选择标签
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-button type="primary" @click="showReviewModal = true">
                <Icon icon="ep:star" class="mr-6px" />
                打开评分弹窗
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>标签选择(正面/负面) + 评论输入 + 已选标签展示</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>实时显示已选标签,可点击删除,表单验证</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/RatingReviewModal/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 2. 抽屉组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:menu" :size="24" color="#67C23A" />
                <div>
                  <h2 class="text-18px font-600">Drawer - 抽屉组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    基于 ElDrawer 封装,支持四个方向,使用 UnoCSS
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px flex flex-wrap gap-12px">
              <el-button type="success" @click="showDrawerRight = true"> 从右侧打开 </el-button>
              <el-button type="success" @click="showDrawerLeft = true"> 从左侧打开 </el-button>
              <el-button type="success" @click="showDrawerTop = true"> 从顶部打开 </el-button>
              <el-button type="success" @click="showDrawerBottom = true"> 从底部打开 </el-button>
            </div>

            <!-- 抽屉演示: 带表单的资源发布 -->
            <div class="mb-16px">
              <el-divider content-position="left">
                <span class="text-14px text-[var(--el-text-color-secondary)]">完整示例</span>
              </el-divider>
              <el-button type="success" plain @click="showResourceDrawer = true">
                <Icon icon="ep:upload" class="mr-6px" />
                快速资源发布 (带表单)
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>基于 ElDrawer,支持 ltr/rtl/ttb/btt 四个方向</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>完整插槽支持(header/default/footer),UnoCSS 样式</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/Drawer/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 3. SearchForm - 搜索表单组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:search" :size="24" color="#F56C6C" />
                <div>
                  <h2 class="text-18px font-600">SearchForm - 搜索表单组件</h2>
                  <p class="mt-4px text-12px text-[var(--el-text-color-secondary)]">
                    自适应布局,支持展开/收起,按钮固定在右下角
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-alert
                title="示例演示"
                type="info"
                :closable="false"
                description="下方是一个完整的搜索表单示例,包含 5 个搜索项,默认收起只显示 2 个"
                class="mb-16px"
              />

              <!-- 搜索表单示例 -->
              <SearchForm
                :schema="searchSchema"
                :model="searchModel"
                :cols-per-row="3"
                :show-expand="true"
                :default-expanded="false"
                @search="handleSearch"
                @reset="handleSearchReset"
              />
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>一行最多3个搜索项,超出自动收起,支持展开/收起切换</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>Grid布局,按钮固定右下角,支持多种表单组件</span>
              </div>
              <div class="demo-info-item">
                <span class="label">组件:</span>
                <span>Input, Select, DatePicker, DateRangePicker, InputNumber 等</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/SearchForm/</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 底部信息 -->
      <div class="mt-32px text-center">
        <el-divider />
        <p class="text-14px text-[var(--el-text-color-secondary)]">
          共 3 个组件 | 创建时间: 2025-10-19 |
          <span class="cursor-pointer text-[var(--el-color-primary)]" @click="showInfo"
            >查看详细信息</span
          >
        </p>
      </div>
    </div>

    <!-- 评分弹窗 -->
    <RatingReviewModal v-model="showReviewModal" title="组件评价" @submit="handleReviewSubmit" />

    <!-- 抽屉组件演示 -->
    <Drawer v-model="showDrawerRight" title="从右侧打开的抽屉" size="500px" direction="rtl">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">抽屉内容示例</h3>
        <p class="mb-16px text-14px text-[var(--el-text-color-regular)]">
          这是一个从右侧打开的抽屉,支持完整的插槽功能。
        </p>
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input placeholder="请输入邮箱" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showDrawerRight = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </Drawer>

    <Drawer v-model="showDrawerLeft" title="从左侧打开的抽屉" size="500px" direction="ltr">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">左侧抽屉</h3>
        <p>这是从左侧打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerTop" title="从顶部打开的抽屉" size="300px" direction="ttb">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">顶部抽屉</h3>
        <p>这是从顶部打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerBottom" title="从底部打开的抽屉" size="300px" direction="btt">
      <div class="demo-drawer-content">
        <h3 class="mb-12px text-16px font-600">底部抽屉</h3>
        <p>这是从底部打开的抽屉示例。</p>
      </div>
    </Drawer>

    <!-- 资源发布抽屉 (完整示例) -->
    <Drawer v-model="showResourceDrawer" title="快速资源发布" size="600px">
      <el-form :model="resourceForm" label-width="100px" label-position="top">
        <el-form-item label="资源名称">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源分类">
          <el-select v-model="resourceForm.category" placeholder="请选择分类" class="w-full">
            <el-option label="技术文档" value="doc" />
            <el-option label="开源项目" value="project" />
            <el-option label="在线工具" value="tool" />
            <el-option label="学习资源" value="learning" />
          </el-select>
        </el-form-item>

        <el-form-item label="资源链接">
          <el-input v-model="resourceForm.url" placeholder="请输入资源链接" />
        </el-form-item>

        <el-form-item label="资源描述">
          <el-input
            v-model="resourceForm.description"
            type="textarea"
            :rows="5"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="resourceForm.tags" multiple placeholder="请选择标签" class="w-full">
            <el-option label="热门" value="hot" />
            <el-option label="推荐" value="recommend" />
            <el-option label="新品" value="new" />
            <el-option label="免费" value="free" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showResourceDrawer = false">取消</el-button>
        <el-button type="primary" @click="handleResourceSubmit">发布资源</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RatingReviewModal } from '@/components/BusinessModal'
import type { RatingReviewResult } from '@/components/BusinessModal'
import { Drawer } from '@/components/Drawer'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'

defineOptions({ name: 'DemoPage' })

const router = useRouter()

// 评分弹窗
const showReviewModal = ref(false)

const handleReviewSubmit = (data: RatingReviewResult) => {
  ElMessage.success(`提交成功! 选择了 ${data.tags.length} 个标签`)
  console.log('评价数据:', data)
}

// 抽屉演示
const showDrawerRight = ref(false)
const showDrawerLeft = ref(false)
const showDrawerTop = ref(false)
const showDrawerBottom = ref(false)

// 资源发布抽屉
const showResourceDrawer = ref(false)
const resourceForm = ref({
  name: '',
  category: '',
  url: '',
  description: '',
  tags: [] as string[]
})

const handleResourceSubmit = () => {
  console.log('发布资源:', resourceForm.value)
  ElMessage.success('资源发布成功!')
  showResourceDrawer.value = false
  // 重置表单
  resourceForm.value = {
    name: '',
    category: '',
    url: '',
    description: '',
    tags: []
  }
}

// SearchForm 搜索表单演示
const searchModel = ref({
  keyword: '',
  category: '',
  status: '',
  dateRange: [],
  priority: null
})

const searchSchema: SearchFormSchema[] = [
  {
    field: 'keyword',
    label: '关键词',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词'
    }
  },
  {
    field: 'category',
    label: '分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择分类',
      options: [
        { label: '技术文档', value: 'doc' },
        { label: '开源项目', value: 'project' },
        { label: '在线工具', value: 'tool' },
        { label: '学习资源', value: 'learning' }
      ]
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '进行中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
      ]
    }
  },
  {
    field: 'dateRange',
    label: '日期范围',
    component: 'DateRangePicker',
    componentProps: {
      placeholder: '请选择日期范围'
    }
  },
  {
    field: 'priority',
    label: '优先级',
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 5,
      placeholder: '1-5'
    }
  }
]

const handleSearch = (values: Recordable) => {
  console.log('搜索参数:', values)
  ElMessage.success('搜索成功!')
}

const handleSearchReset = () => {
  console.log('重置搜索')
  ElMessage.info('已重置搜索条件')
}

// 导航
const navigateToHome = () => {
  router.push('/')
}

// 显示详细信息
const showInfo = () => {
  ElMessageBox.alert(
    `
      <div style="line-height: 1.8;">
        <p><strong>组件总数:</strong> 3 个</p>
        <p><strong>创建时间:</strong> 2025-10-19</p>
        <p><strong>技术栈:</strong> Vue 3 + TypeScript + Element Plus + UnoCSS</p>
        <p><strong>组件列表:</strong> RatingReviewModal, Drawer, SearchForm</p>
      </div>
    `,
    '组件信息',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了'
    }
  )
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
}

.demo-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.demo-content {
  padding: 8px 0;
}

.demo-info {
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  padding: 16px;
}

.demo-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 600;
    color: var(--el-text-color-regular);
    min-width: 60px;
    margin-right: 12px;
  }

  .code {
    font-family: 'Consolas', 'Monaco', monospace;
    background: var(--el-fill-color);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--el-color-primary);
  }
}

.demo-drawer-content {
  padding: 0;
}
</style>
