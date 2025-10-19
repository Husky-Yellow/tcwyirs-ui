<template>
  <div class="demo-page h-screen overflow-y-auto bg-[#f5f7fa]">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-[var(--el-border-color-lighter)]">
      <div class="max-w-1400px mx-auto px-24px py-20px">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-12px">
            <Icon icon="ep:box" :size="32" color="#409EFF" />
            <div>
              <h1 class="text-24px font-700 text-[var(--el-text-color-primary)] mb-4px">
                组件展示 Demo
              </h1>
              <p class="text-14px text-[var(--el-text-color-secondary)]">
                Component Showcase
              </p>
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
    <div class="max-w-1400px mx-auto px-24px py-32px pb-60px">
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
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
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
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
                    基于 ElDrawer 封装,支持四个方向,使用 UnoCSS
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px flex gap-12px flex-wrap">
              <el-button type="success" @click="showDrawerRight = true">
                从右侧打开
              </el-button>
              <el-button type="success" @click="showDrawerLeft = true">
                从左侧打开
              </el-button>
              <el-button type="success" @click="showDrawerTop = true">
                从顶部打开
              </el-button>
              <el-button type="success" @click="showDrawerBottom = true">
                从底部打开
              </el-button>
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

        <!-- 3. 审批流程组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:document" :size="24" color="#E6A23C" />
                <div>
                  <h2 class="text-18px font-600">ApprovalProcess - 审批流程组件</h2>
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
                    基于 el-timeline,展示审批流程状态
                  </p>
                </div>
              </div>
              <el-tag type="warning">临时组件</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-button type="warning" @click="showApprovalDrawer = true">
                <Icon icon="ep:document" class="mr-6px" />
                查看审批流程
              </el-button>
            </div>

            <div class="bg-white border border-[var(--el-border-color-lighter)] rounded-8px p-16px mb-16px">
              <ApprovalProcess :steps="demoApprovalSteps" title="请假审批流程示例" />
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>4种状态(completed/processing/waiting/rejected)</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>时间轴展示,状态图标,时间和描述信息</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">temp-components/ApprovalProcess/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 4. Markdown 查看器组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:reading" :size="24" color="#909399" />
                <div>
                  <h2 class="text-18px font-600">MarkdownViewer - 文档查看器组件</h2>
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
                    左右布局,左侧导航菜单,右侧 Markdown 内容展示
                  </p>
                </div>
              </div>
              <el-tag type="warning">临时组件</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <div class="mb-16px">
              <el-button @click="showMarkdownDrawer = true">
                <Icon icon="ep:reading" class="mr-6px" />
                打开文档查看器
              </el-button>
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>左右分栏布局,树形导航菜单,Markdown 内容渲染</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>支持二级菜单,图标显示,内置 Markdown 样式</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">temp-components/MarkdownViewer/</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 5. SearchForm - 搜索表单组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:search" :size="24" color="#F56C6C" />
                <div>
                  <h2 class="text-18px font-600">SearchForm - 搜索表单组件</h2>
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
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

        <!-- 6. TagCardList - 标签卡片列表组件 -->
        <el-card shadow="hover" class="demo-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-12px">
                <Icon icon="ep:collection-tag" :size="24" color="#E6A23C" />
                <div>
                  <h2 class="text-18px font-600">TagCardList - 标签卡片列表组件</h2>
                  <p class="text-12px text-[var(--el-text-color-secondary)] mt-4px">
                    卡片式布局,支持单选,带编辑删除操作
                  </p>
                </div>
              </div>
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>

          <div class="demo-content">
            <!-- 搜索区域 -->
            <div class="mb-16px">
              <SearchForm
                :schema="tagSearchSchema"
                :model="tagSearchModel"
                :cols-per-row="3"
                :show-expand="false"
                label-width="90px"
                @search="handleTagSearch"
                @reset="handleTagSearchReset"
              />
            </div>

            <!-- 卡片列表 -->
            <div class="mb-16px">
              <TagCardList
                v-model="selectedTagId"
                :data="tagCardData"
                :cols-per-row="4"
                @edit="handleTagEdit"
                @delete="handleTagDelete"
                @status-change="handleTagStatusChange"
              />
            </div>

            <div class="demo-info">
              <div class="demo-info-item">
                <span class="label">功能:</span>
                <span>el-card 卡片展示,每行4个,点击卡片选中</span>
              </div>
              <div class="demo-info-item">
                <span class="label">特性:</span>
                <span>右上角状态开关切换启用/停用,编辑/删除操作</span>
              </div>
              <div class="demo-info-item">
                <span class="label">样式:</span>
                <span>权重颜色标识(高权重红色/中权重蓝色/低权重绿色)</span>
              </div>
              <div class="demo-info-item">
                <span class="label">位置:</span>
                <span class="code">src/components/TagCardList/</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 底部信息 -->
      <div class="mt-32px text-center">
        <el-divider />
        <p class="text-14px text-[var(--el-text-color-secondary)]">
          共 6 个组件 | 创建时间: 2025-10-19 |
          <span class="text-[var(--el-color-primary)] cursor-pointer" @click="showInfo">查看详细信息</span>
        </p>
      </div>
    </div>

    <!-- 评分弹窗 -->
    <RatingReviewModal
      v-model="showReviewModal"
      title="组件评价"
      @submit="handleReviewSubmit"
    />

    <!-- 抽屉组件演示 -->
    <Drawer v-model="showDrawerRight" title="从右侧打开的抽屉" size="500px" direction="rtl">
      <div class="demo-drawer-content">
        <h3 class="text-16px font-600 mb-12px">抽屉内容示例</h3>
        <p class="text-14px text-[var(--el-text-color-regular)] mb-16px">
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
        <h3 class="text-16px font-600 mb-12px">左侧抽屉</h3>
        <p>这是从左侧打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerTop" title="从顶部打开的抽屉" size="300px" direction="ttb">
      <div class="demo-drawer-content">
        <h3 class="text-16px font-600 mb-12px">顶部抽屉</h3>
        <p>这是从顶部打开的抽屉示例。</p>
      </div>
    </Drawer>

    <Drawer v-model="showDrawerBottom" title="从底部打开的抽屉" size="300px" direction="btt">
      <div class="demo-drawer-content">
        <h3 class="text-16px font-600 mb-12px">底部抽屉</h3>
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

    <!-- 审批流程抽屉 -->
    <Drawer v-model="showApprovalDrawer" title="审批流程详情" size="500px">
      <ApprovalProcess :steps="approvalSteps" title="请假审批流程" />

      <el-divider />

      <div class="flex flex-col gap-12px">
        <el-alert
          title="交互演示"
          type="info"
          :closable="false"
          description="点击下方按钮可以模拟审批流程的状态变化"
        />
        <el-button @click="changeToCompleted">
          <Icon icon="ep:check" class="mr-6px" />
          模拟:审批通过当前步骤
        </el-button>
        <el-button type="danger" @click="changeToRejected">
          <Icon icon="ep:close" class="mr-6px" />
          模拟:拒绝审批
        </el-button>
        <el-button @click="resetApproval">
          <Icon icon="ep:refresh" class="mr-6px" />
          重置流程
        </el-button>
      </div>

      <template #footer>
        <el-button @click="showApprovalDrawer = false">关闭</el-button>
      </template>
    </Drawer>

    <!-- Markdown 查看器抽屉 -->
    <Drawer v-model="showMarkdownDrawer" title="文档查看器" size="80%" direction="rtl">
      <div class="h-700px">
        <MarkdownViewer
          :menu-items="markdownMenuItems"
          default-active-key="intro"
          @menu-select="handleMarkdownSelect"
        >
          <div class="markdown-content" v-html="currentMarkdownContent"></div>
        </MarkdownViewer>
      </div>

      <template #footer>
        <el-button @click="showMarkdownDrawer = false">关闭</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RatingReviewModal } from '@/components/RatingReviewModal'
import type { RatingReviewResult } from '@/components/RatingReviewModal'
import { Drawer } from '@/components/Drawer'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'
import { TagCardList } from '@/components/TagCardList'
import type { TagCardItem } from '@/components/TagCardList'
import { ApprovalProcess } from '../../../temp-components/ApprovalProcess'
import type { ApprovalStep } from '../../../temp-components/ApprovalProcess'
import { MarkdownViewer } from '../../../temp-components/MarkdownViewer'
import type { MenuItem } from '../../../temp-components/MarkdownViewer'

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

// 审批流程演示
const showApprovalDrawer = ref(false)

const demoApprovalSteps = ref<ApprovalStep[]>([
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed',
    description: '申请人: 张三'
  },
  {
    title: '部门经理审批',
    time: '2025-10-24 11:20',
    status: 'completed',
    description: '审批人: 李四 - 已通过'
  },
  {
    title: '总经理审批',
    status: 'processing',
    description: '审批人: 王五 - 审批中'
  },
  {
    title: '完成',
    status: 'waiting'
  }
])

const approvalSteps = ref<ApprovalStep[]>([
  {
    title: '提交申请',
    time: '2025-10-24 10:32',
    status: 'completed',
    description: '申请人: 张三 | 请假3天'
  },
  {
    title: '审批中',
    time: '2025-10-24 10:32',
    status: 'processing',
    description: '审批人: 李四(部门经理)'
  },
  {
    title: '申请结果',
    status: 'waiting'
  }
])

const changeToCompleted = () => {
  const processingIndex = approvalSteps.value.findIndex(step => step.status === 'processing')
  if (processingIndex !== -1) {
    approvalSteps.value[processingIndex].status = 'completed'
    approvalSteps.value[processingIndex].time = new Date().toLocaleString('zh-CN')

    if (processingIndex + 1 < approvalSteps.value.length) {
      approvalSteps.value[processingIndex + 1].status = 'processing'
      approvalSteps.value[processingIndex + 1].time = new Date().toLocaleString('zh-CN')
    }

    ElMessage.success('审批通过!')
  } else {
    ElMessage.warning('流程已完成')
  }
}

const changeToRejected = () => {
  const processingIndex = approvalSteps.value.findIndex(step => step.status === 'processing')
  if (processingIndex !== -1) {
    approvalSteps.value[processingIndex].status = 'rejected'
    approvalSteps.value[processingIndex].description = '审批人: 李四 - 拒绝原因: 请假理由不充分'
    ElMessage.error('审批已拒绝')
  }
}

const resetApproval = () => {
  approvalSteps.value = [
    {
      title: '提交申请',
      time: '2025-10-24 10:32',
      status: 'completed',
      description: '申请人: 张三 | 请假3天'
    },
    {
      title: '审批中',
      time: '2025-10-24 10:32',
      status: 'processing',
      description: '审批人: 李四(部门经理)'
    },
    {
      title: '申请结果',
      status: 'waiting'
    }
  ]
  ElMessage.info('流程已重置')
}

// Markdown 查看器演示
const showMarkdownDrawer = ref(false)

const markdownMenuItems: MenuItem[] = [
  {
    label: '组件介绍',
    value: 'intro',
    icon: 'ep:info-filled'
  },
  {
    label: '评分组件',
    value: 'rating',
    icon: 'ep:star'
  },
  {
    label: '抽屉组件',
    value: 'drawer',
    icon: 'ep:menu'
  },
  {
    label: '审批流程',
    value: 'approval',
    icon: 'ep:document'
  },
  {
    label: 'Markdown查看器',
    value: 'markdown',
    icon: 'ep:reading'
  }
]

const markdownContents = {
  intro: `
<h1>组件展示 Demo</h1>
<p>本页面展示了项目中开发的所有自定义组件。</p>

<h2>组件列表</h2>
<ul>
  <li><strong>RatingReviewModal</strong> - 评分/评论组件</li>
  <li><strong>Drawer</strong> - 抽屉组件</li>
  <li><strong>ApprovalProcess</strong> - 审批流程组件</li>
  <li><strong>MarkdownViewer</strong> - 文档查看器组件</li>
</ul>

<h2>技术栈</h2>
<ul>
  <li>Vue 3 + TypeScript</li>
  <li>Element Plus</li>
  <li>UnoCSS</li>
  <li>Vite</li>
</ul>
  `,
  rating: `
<h1>RatingReviewModal - 评分/评论组件</h1>

<h2>功能特性</h2>
<ul>
  <li>✅ 标签选择(正面/负面)</li>
  <li>✅ 实时显示已选择标签</li>
  <li>✅ 可删除已选标签</li>
  <li>✅ 评论文本输入</li>
  <li>✅ 表单验证</li>
</ul>

<h2>使用示例</h2>
<pre><code>&lt;RatingReviewModal
  v-model="showModal"
  @submit="handleSubmit"
/&gt;</code></pre>

<h2>组件位置</h2>
<p><code>src/components/RatingReviewModal/</code></p>
  `,
  drawer: `
<h1>Drawer - 抽屉组件</h1>

<h2>功能特性</h2>
<ul>
  <li>✅ 支持四个方向(ltr/rtl/ttb/btt)</li>
  <li>✅ 完整插槽支持</li>
  <li>✅ 使用 UnoCSS</li>
  <li>✅ 基于 ElDrawer 封装</li>
</ul>

<h2>使用示例</h2>
<pre><code>&lt;Drawer v-model="visible" title="抽屉标题"&gt;
  &lt;div&gt;内容&lt;/div&gt;
&lt;/Drawer&gt;</code></pre>

<h2>组件位置</h2>
<p><code>src/components/Drawer/</code></p>
  `,
  approval: `
<h1>ApprovalProcess - 审批流程组件</h1>

<h2>功能特性</h2>
<ul>
  <li>✅ 4种审批状态</li>
  <li>✅ 时间轴展示</li>
  <li>✅ 状态图标</li>
  <li>✅ 基于 el-timeline</li>
</ul>

<h2>状态类型</h2>
<ul>
  <li><strong>completed</strong> - 已完成(蓝色✓)</li>
  <li><strong>processing</strong> - 审批中(蓝色⋯)</li>
  <li><strong>waiting</strong> - 等待中(灰色🕐)</li>
  <li><strong>rejected</strong> - 已拒绝(红色✕)</li>
</ul>

<h2>组件位置</h2>
<p><code>temp-components/ApprovalProcess/</code></p>
<p><em>⚠️ 临时组件,周一需迁移到正式目录</em></p>
  `,
  markdown: `
<h1>MarkdownViewer - 文档查看器组件</h1>

<h2>功能特性</h2>
<ul>
  <li>✅ 左右分栏布局</li>
  <li>✅ 树形导航菜单</li>
  <li>✅ 支持二级菜单</li>
  <li>✅ 内置 Markdown 样式</li>
  <li>✅ 使用 UnoCSS</li>
</ul>

<h2>使用示例</h2>
<pre><code>&lt;MarkdownViewer
  :menu-items="menuItems"
  @menu-select="handleSelect"
&gt;
  &lt;div v-html="content"&gt;&lt;/div&gt;
&lt;/MarkdownViewer&gt;</code></pre>

<h2>组件位置</h2>
<p><code>temp-components/MarkdownViewer/</code></p>
<p><em>⚠️ 临时组件,周一需迁移到正式目录</em></p>
  `
}

const currentMarkdownContent = ref(markdownContents.intro)

const handleMarkdownSelect = (key: string) => {
  currentMarkdownContent.value = markdownContents[key as keyof typeof markdownContents] || markdownContents.intro
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

// TagCardList 标签卡片列表演示
const selectedTagId = ref(1)

const tagSearchModel = ref({
  name: '',
  scoreType: '',
  weight: ''
})

const tagSearchSchema: SearchFormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入'
    }
  },
  {
    field: 'scoreType',
    label: '分数类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      options: [
        { label: '上降', value: 'up' },
        { label: '下降', value: 'down' }
      ]
    }
  },
  {
    field: 'weight',
    label: '分数权重',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      options: [
        { label: '高权重', value: 'high' },
        { label: '中权重', value: 'medium' },
        { label: '低权重', value: 'low' }
      ]
    }
  }
]

const tagCardData = ref<TagCardItem[]>([
  {
    id: 1,
    title: '资源内容丰富',
    icon: 'ep:document',
    status: '启用中',
    scoreType: '上降',
    weight: '高权重'
  },
  {
    id: 2,
    title: '操作使用便捷',
    icon: 'ep:finished',
    status: '启用中',
    scoreType: '上降',
    weight: '中权重'
  },
  {
    id: 3,
    title: '资源数据精准',
    icon: 'ep:data-line',
    status: '启用中',
    scoreType: '上降',
    weight: '中权重'
  },
  {
    id: 4,
    title: '符合需求',
    icon: 'ep:circle-check',
    status: '启用中',
    scoreType: '上降',
    weight: '低权重'
  },
  {
    id: 5,
    title: '体验不佳',
    icon: 'ep:circle-close',
    status: '启用中',
    scoreType: '下降',
    weight: '高权重'
  },
  {
    id: 6,
    title: '内容出错',
    icon: 'ep:warning',
    status: '启用中',
    scoreType: '下降',
    weight: '中权重'
  },
  {
    id: 7,
    title: '与业务场景大不匹配',
    icon: 'ep:close',
    status: '启用中',
    scoreType: '下降',
    weight: '中权重'
  },
  {
    id: 8,
    title: '数据出现报错',
    icon: 'ep:warning-filled',
    status: '停用',
    scoreType: '下降',
    weight: '低权重'
  },
  {
    id: 9,
    title: '体验不佳',
    icon: 'ep:circle-close',
    status: '启用中',
    scoreType: '下降',
    weight: '高权重'
  }
])

const handleTagSearch = (values: Recordable) => {
  console.log('标签搜索:', values)
  ElMessage.success('搜索成功!')
}

const handleTagSearchReset = () => {
  console.log('重置标签搜索')
}

const handleTagEdit = (item: TagCardItem) => {
  console.log('编辑标签:', item)
  ElMessage.info(`编辑: ${item.title}`)
}

const handleTagDelete = (item: TagCardItem) => {
  ElMessageBox.confirm(`确定要删除 "${item.title}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tagCardData.value.findIndex((t) => t.id === item.id)
    if (index > -1) {
      tagCardData.value.splice(index, 1)
      ElMessage.success('删除成功!')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleTagStatusChange = (item: TagCardItem, status: boolean) => {
  const tag = tagCardData.value.find((t) => t.id === item.id)
  if (tag) {
    tag.status = status ? '启用中' : '停用'
    ElMessage.success(`${item.title}: 已${status ? '启用' : '停用'}`)
  }
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
        <p><strong>组件总数:</strong> 6 个</p>
        <p><strong>创建时间:</strong> 2025-10-19</p>
        <p><strong>技术栈:</strong> Vue 3 + TypeScript + Element Plus + UnoCSS</p>
        <p><strong>正式组件:</strong> RatingReviewModal, Drawer, SearchForm, TagCardList</p>
        <p><strong>临时组件:</strong> ApprovalProcess, MarkdownViewer</p>
        <hr style="margin: 12px 0;" />
        <p style="color: #909399; font-size: 12px;">
          临时组件位于 temp-components 文件夹,周一需迁移到正式目录
        </p>
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

.markdown-content {
  :deep(h1) {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--el-border-color);
  }

  :deep(h2) {
    font-size: 20px;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 12px;
  }

  :deep(p) {
    line-height: 1.8;
    margin-bottom: 12px;
  }

  :deep(ul) {
    padding-left: 24px;
    margin-bottom: 12px;

    li {
      line-height: 1.8;
      margin-bottom: 6px;
    }
  }

  :deep(code) {
    background: var(--el-fill-color-light);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: var(--el-color-danger);
  }

  :deep(pre) {
    background: var(--el-fill-color);
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 16px;

    code {
      background: none;
      padding: 0;
      color: var(--el-text-color-primary);
    }
  }

  :deep(em) {
    color: var(--el-color-warning);
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid var(--el-border-color);
    margin: 12px 0;
  }
}
</style>
