<template>
  <div class="home-container">
    <IndexBanner />

    <!-- 主内容区域 -->
    <el-row :gutter="16">
      <!-- 左侧列 - 占2份 -->
      <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24">
        <!-- 我浏览过的资源 + 我收藏的资源 -->
        <el-card shadow="never" class="mb-16px">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-600">我浏览过的资源</span>
              <el-link type="primary" :underline="false">全部</el-link>
            </div>
          </template>
          <el-row :gutter="16" class="mb-24px">
            <el-col :span="8">
              <div class="stat-item">
                <div class="text-14px text-gray-400 mb-8px">合规资源</div>
                <CountTo
                  class="text-24px font-600"
                  :start-val="0"
                  :end-val="browsedResources.compliant"
                  :duration="2600"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="text-14px text-gray-400 mb-8px">组件资源</div>
                <CountTo
                  class="text-24px font-600"
                  :start-val="0"
                  :end-val="browsedResources.component"
                  :duration="2600"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="text-14px text-gray-400 mb-8px">应用资源</div>
                <CountTo
                  class="text-24px font-600"
                  :start-val="0"
                  :end-val="browsedResources.application"
                  :duration="2600"
                />
              </div>
            </el-col>
          </el-row>

          <!-- 我收藏的资源部分 -->
          <div class="border-t border-gray-100 pt-16px">
            <div class="flex justify-between items-center mb-16px">
              <span class="text-16px font-600">我收藏的资源</span>
              <el-link type="primary" :underline="false">全部</el-link>
            </div>
            <el-row :gutter="16" class="mb-16px">
              <el-col :span="12">
                <div class="stat-item">
                  <div class="text-14px text-gray-400 mb-8px">最近浏览</div>
                  <div class="text-24px font-600">{{ favoriteResources.recent }}</div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="stat-item">
                  <div class="text-14px text-gray-400 mb-8px">全部数量</div>
                  <div class="text-24px font-600">{{ favoriteResources.total }}</div>
                </div>
              </el-col>
            </el-row>
            <div class="favorite-list">
              <div
                v-for="item in favoriteList"
                :key="item.id"
                class="favorite-item flex items-center py-8px cursor-pointer hover:bg-gray-50 transition-colors"
                @click="handleFavoriteClick(item)"
              >
                <Icon icon="carbon:user-avatar" class="text-20px text-primary mr-8px" />
                <span class="text-14px">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 帮助文档 -->
        <el-card shadow="never" class="mb-16px">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-600">帮助文档</span>
              <el-link type="primary" :underline="false">全部</el-link>
            </div>
          </template>
          <div class="help-doc-list">
            <div
              v-for="item in helpDocs"
              :key="item.id"
              class="help-doc-item py-10px border-b border-gray-100 last:border-b-0 cursor-pointer hover:text-primary transition-colors"
              @click="handleHelpDocClick(item)"
            >
              <div class="text-14px">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧列 - 占1份 -->
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <!-- 资源占比 -->
        <el-card shadow="never" class="mb-16px">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-600">资源占比</span>
              <el-link type="primary" :underline="false">全部</el-link>
            </div>
          </template>
          <div style="height: 300px; width: 100%">
            <Echart :options="resourcePieOptions" :height="300" width="100%" />
          </div>
          <div class="resource-legend mt-16px">
            <el-row :gutter="16">
              <el-col :span="12" v-for="item in resourceLegend" :key="item.name">
                <div class="flex items-center justify-between mb-8px">
                  <div class="flex items-center">
                    <span class="legend-dot mr-8px" :style="{ backgroundColor: item.color }"></span>
                    <span class="text-14px">{{ item.name }}</span>
                  </div>
                  <span class="text-14px font-600">{{ item.value }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 消息 -->
        <el-card shadow="never" class="mb-16px">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-600">消息</span>
              <el-link type="primary" :underline="false">全部</el-link>
            </div>
          </template>
          <div class="message-list">
            <div
              v-for="item in messages"
              :key="item.id"
              class="message-item py-12px border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
              @click="handleMessageClick(item)"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="text-14px mb-4px">{{ item.type }}</div>
                  <div class="text-14px text-gray-600">{{ item.content }}</div>
                </div>
                <div class="text-12px text-gray-400 ml-16px whitespace-nowrap">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评分弹窗 -->
    <RatingReviewModal
      v-model="showReviewModal"
      @submit="handleReviewSubmit"
      @cancel="handleReviewCancel"
    />

    <!-- 抽屉 -->
    <Drawer
      v-model="showDrawer"
      title="用户信息"
      @close="handleDrawerClose"
    >
      <template #default>
        <el-form :model="drawerFormData" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="drawerFormData.username" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="drawerFormData.email" />
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="drawerFormData.role" />
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="drawerFormData.bio" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="showDrawer = false">取消</el-button>
        <el-button type="primary" @click="handleDrawerSubmit">保存</el-button>
      </template>
    </Drawer>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { set } from 'es-toolkit/compat'
import { EChartsOption } from 'echarts'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import type { WorkplaceTotal } from './types'
import IndexBanner from './components/banner.vue'
import { RatingReviewModal } from '@/components/RatingReviewModal'
import type { RatingReviewResult } from '@/components/RatingReviewModal'
import { Drawer } from '@/components/Drawer'
import { Icon } from '@/components/Icon'
import { Echart } from '@/components/Echart'
import { CountTo } from '@/components/CountTo'

defineOptions({ name: 'Index' })

const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname

// 评分弹窗状态
const showReviewModal = ref(false)

// 抽屉状态
const showDrawer = ref(false)
const drawerFormData = ref({
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  role: 'admin',
  bio: '这是一个测试用户的个人简介'
})

// 获取统计数
let totalSate = reactive<WorkplaceTotal>({
  project: 40,
  access: 2340,
  todo: 10
})

// 我浏览过的资源
const browsedResources = reactive({
  compliant: 302,
  component: 30,
  application: 30
})

// 我收藏的资源
const favoriteResources = reactive({
  recent: 12,
  total: 19
})

// 收藏列表
const favoriteList = ref([
  { id: 1, name: '数据分析中台' },
  { id: 2, name: '物联网设备监控' },
  { id: 3, name: '高端提炼证据型' }
])

// 帮助文档列表
const helpDocs = ref([
  { id: 1, title: '帮助文档是什么' },
  { id: 2, title: '帮助文档是什么sdjke' },
  { id: 3, title: '帮助文档是saas' },
  { id: 4, title: '帮助文档是什么又如文档型啊' },
  { id: 5, title: '帮助文档是什么ssaA' },
  { id: 6, title: '帮助文档是什么dsaA' },
  { id: 7, title: '帮助文档是wqewf么' }
])

// 资源占比饼图配置
const resourcePieOptions = reactive<EChartsOption>({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    show: false
  },
  series: [
    {
      name: '资源占比',
      type: 'pie',
      radius: ['40%', '75%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        formatter: (params: any) => {
          // 在圆环上显示百分比
          return `${params.percent}%`
        },
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {
          value: 1442,
          name: '数据资源',
          itemStyle: { color: '#5B8FF9' },
          label: {
            show: true,
            position: 'inside'
          }
        },
        {
          value: 1442,
          name: '组件资源',
          itemStyle: { color: '#61DDAA' },
          label: {
            show: true,
            position: 'inside'
          }
        },
        {
          value: 1442,
          name: '应用资源',
          itemStyle: { color: '#65789B' },
          label: {
            show: true,
            position: 'inside'
          }
        }
      ]
    },
    {
      name: '中心文字',
      type: 'pie',
      radius: ['0%', '39%'],
      avoidLabelOverlap: false,
      silent: true,
      label: {
        show: true,
        position: 'center',
        formatter: () => {
          return '总资源\n19,430'
        },
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      },
      labelLine: {
        show: false
      },
      data: [{ value: 1, itemStyle: { color: 'transparent' } }]
    }
  ]
})

// 资源图例
const resourceLegend = ref([
  { name: '数据资源', value: 1442, color: '#5B8FF9' },
  { name: '组件资源', value: 1442, color: '#61DDAA' },
  { name: '应用资源', value: 1442, color: '#65789B' }
])

// 消息列表
const messages = ref([
  { id: 1, type: '更新', content: '这是一个过计算用积分审核刑讯之...', time: '1周前' },
  { id: 2, type: '平台', content: '平台 1.0 正式发布', time: '2月前' },
  { id: 3, type: '平台', content: '平台 1.0 正式发布', time: '2月前' }
])

// 处理评分提交
const handleReviewSubmit = (data: RatingReviewResult) => {
  console.log('评分提交:', data)
  ElMessage.success(`提交成功! 选择了 ${data.tags.length} 个标签，评论: ${data.review || '无'}`)
}

// 处理评分取消
const handleReviewCancel = () => {
  console.log('用户取消了评分')
  ElMessage.info('已取消评分')
}

// 处理抽屉提交
const handleDrawerSubmit = () => {
  console.log('抽屉表单提交:', drawerFormData.value)
  ElMessage.success('保存成功!')
  showDrawer.value = false
}

// 处理抽屉关闭
const handleDrawerClose = () => {
  console.log('抽屉关闭')
}

// 处理收藏项点击
const handleFavoriteClick = (item: any) => {
  console.log('点击收藏项:', item)
  ElMessage.info(`打开: ${item.name}`)
}

// 处理帮助文档点击
const handleHelpDocClick = (item: any) => {
  console.log('点击帮助文档:', item)
  ElMessage.info(`打开文档: ${item.title}`)
}

// 处理消息点击
const handleMessageClick = (item: any) => {
  console.log('点击消息:', item)
  ElMessage.info(`查看消息: ${item.type}`)
}

// 初始化
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style lang="scss" scoped>
.home-container {
  padding: 16px;

  .stat-item {
    text-align: center;
    padding: 16px 0;
  }

  .favorite-list,
  .help-doc-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .legend-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .message-list {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
