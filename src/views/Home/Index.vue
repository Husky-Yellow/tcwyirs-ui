<template>
  <div>
    <IndexBanner />
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img src="@/assets/imgs/avatar.gif" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ '你好' }} {{ username }} {{ '祝你开心每一天!' }}1
                </div>
                <div class="mt-10px text-14px text-gray-500">
                  {{ '今日晴' }}，20℃ - 32℃！
                </div>
                <div class="mt-10px">
                  <el-button type="primary" size="small" @click="showReviewModal = true">
                    打开评分弹窗
                  </el-button>
                  <el-button type="success" size="small" class="ml-8px" @click="showDrawer = true">
                    打开抽屉
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="h-70px flex items-center justify-end lt-sm:mt-10px">
              <div class="px-8px text-right">
                <div class="mb-16px text-14px text-gray-400">{{ '项目数' }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.project"
                  :duration="2600"
                />
              </div>
              <el-divider direction="vertical" />
              <div class="px-8px text-right">
                <div class="mb-16px text-14px text-gray-400">{{ '待办' }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.todo"
                  :duration="2600"
                />
              </div>
              <el-divider direction="vertical" border-style="dashed" />
              <div class="px-8px text-right">
                <div class="mb-16px text-14px text-gray-400">{{ '项目访问' }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.access"
                  :duration="2600"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>
    <!--  -->
  </div>
</template>
<script lang="ts" setup>
import { set } from 'es-toolkit/compat'
import { EChartsOption } from 'echarts'
import { formatTime } from '@/utils'

import { useUserStore } from '@/store/modules/user'
// import { useWatermark } from '@/hooks/web/useWatermark'
import type { WorkplaceTotal, Project, Notice, Shortcut } from './types'
import IndexBanner from './components/banner.vue'
import { pieOptions, barOptions } from './echarts-data'
import { useRouter } from 'vue-router'
import { RatingReviewModal } from '@/components/RatingReviewModal'
import type { RatingReviewResult } from '@/components/RatingReviewModal'
import { Drawer } from '@/components/Drawer'

defineOptions({ name: 'Index' })

const router = useRouter()
const userStore = useUserStore()
// const { setWatermark } = useWatermark()
const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname
const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

// 评分弹窗状态
const showReviewModal = ref(false)

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

// 抽屉状态
const showDrawer = ref(false)
const drawerFormData = ref({
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  role: 'admin',
  bio: '这是一个测试用户的个人简介'
})

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

// 获取统计数
let totalSate = reactive<WorkplaceTotal>({
  project: 0,
  access: 0,
  todo: 0
})

const getCount = async () => {
  const data = {
    project: 40,
    access: 2340,
    todo: 10
  }
  totalSate = Object.assign(totalSate, data)
}

// 获取项目数
let projects = reactive<Project[]>([])
const getProject = async () => {
  const data = [
    {
      name: 'ruoyi-vue-pro',
      icon: 'simple-icons:springboot',
      message: 'github.com/YunaiV/ruoyi-vue-pro',
      personal: 'Spring Boot 单体架构',
      time: new Date('2025-01-02'),
      color: '#6DB33F'
    },
    {
      name: 'yudao-ui-admin-vue3',
      icon: 'ep:element-plus',
      message: 'github.com/yudaocode/yudao-ui-admin-vue3',
      personal: 'Vue3 + element-plus 管理后台',
      time: new Date('2025-02-03'),
      color: '#409EFF'
    },
    {
      name: 'yudao-ui-mall-uniapp',
      icon: 'icon-park-outline:mall-bag',
      message: 'github.com/yudaocode/yudao-ui-mall-uniapp',
      personal: 'Vue3 + uniapp 商城手机端',
      time: new Date('2025-03-04'),
      color: '#ff4d4f'
    },
    {
      name: 'yudao-cloud',
      icon: 'material-symbols:cloud-outline',
      message: 'github.com/YunaiV/yudao-cloud',
      personal: 'Spring Cloud 微服务架构',
      time: new Date('2025-04-05'),
      color: '#1890ff'
    },
    {
      name: 'yudao-ui-admin-vben',
      icon: 'devicon:antdesign',
      message: 'github.com/yudaocode/yudao-ui-admin-vben',
      personal: 'Vue3 + vben5(antd) 管理后台',
      time: new Date('2025-05-06'),
      color: '#e18525'
    },
    {
      name: 'yudao-ui-admin-uniapp',
      icon: 'ant-design:mobile',
      message: 'github.com/yudaocode/yudao-ui-admin-uniapp',
      personal: 'Vue3 + uniapp 管理手机端',
      time: new Date('2025-06-01'),
      color: '#2979ff'
    }
  ]
  projects = Object.assign(projects, data)
}

// 获取通知公告
let notice = reactive<Notice[]>([])
const getNotice = async () => {
  const data = [
    {
      title: '系统支持 JDK 8/17/21，Vue 2/3',
      type: '技术兼容性',
      keys: ['JDK', 'Vue'],
      date: new Date()
    },
    {
      title: '后端提供 Spring Boot 2.7/3.2 + Cloud 双架构',
      type: '架构灵活性',
      keys: ['Boot', 'Cloud'],
      date: new Date()
    },
    {
      title: '全部开源，个人与企业可 100% 直接使用，无需授权',
      type: '开源免授权',
      keys: ['无需授权'],
      date: new Date()
    },
    {
      title: '国内使用最广泛的快速开发平台，远超 10w+ 企业使用',
      type: '广泛企业认可',
      keys: ['最广泛', '10w+'],
      date: new Date()
    }
  ]
  notice = Object.assign(notice, data)
}

// 获取快捷入口
let shortcut = reactive<Shortcut[]>([])

const getShortcut = async () => {
  const data = [
    {
      name: '首页',
      icon: 'ion:home-outline',
      url: '/',
      color: '#1fdaca'
    },
    {
      name: '商城中心',
      icon: 'ep:shop',
      url: '/mall/home',
      color: '#ff6b6b'
    },
    {
      name: 'AI 大模型',
      icon: 'tabler:ai',
      url: '/ai/chat',
      color: '#7c3aed'
    },
    {
      name: 'ERP 系统',
      icon: 'simple-icons:erpnext',
      url: '/erp/home',
      color: '#3fb27f'
    },
    {
      name: 'CRM 系统',
      icon: 'simple-icons:civicrm',
      url: '/crm/backlog',
      color: '#4daf1bc9'
    },
    {
      name: 'IoT 物联网',
      icon: 'fa-solid:hdd',
      url: '/iot/home',
      color: '#1a73e8'
    }
  ]
  shortcut = Object.assign(shortcut, data)
}

// 用户来源
const getUserAccessSource = async () => {
  const data = [
    { value: 335, name: 'analysis.directAccess' },
    { value: 310, name: 'analysis.mailMarketing' },
    { value: 234, name: 'analysis.allianceAdvertising' },
    { value: 135, name: 'analysis.videoAdvertising' },
    { value: 1548, name: 'analysis.searchEngines' }
  ]
  set(
    pieOptionsData,
    'legend.data',
    data.map((v) => v.name)
  )
  pieOptionsData!.series![0].data = data.map((v) => {
    return {
      name: v.name,
      value: v.value
    }
  })
}
const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
  const data = [
    { value: 13253, name: 'analysis.monday' },
    { value: 34235, name: 'analysis.tuesday' },
    { value: 26321, name: 'analysis.wednesday' },
    { value: 12340, name: 'analysis.thursday' },
    { value: 24643, name: 'analysis.friday' },
    { value: 1322, name: 'analysis.saturday' },
    { value: 1324, name: 'analysis.sunday' }
  ]
  set(
    barOptionsData,
    'xAxis.data',
    data.map((v) => v.name)
  )
  set(barOptionsData, 'series', [
    {
      name: '活跃量',
      data: data.map((v) => v.value),
      type: 'bar'
    }
  ])
}

const getAllApi = async () => {
  await Promise.all([
    getCount(),
    getProject(),
    getNotice(),
    getShortcut(),
    getUserAccessSource(),
    getWeeklyUserActivity()
  ])
  loading.value = false
}

const handleProjectClick = (message: string) => {
  window.open(`https://${message}`, '_blank')
}

const handleShortcutClick = (url: string) => {
  router.push(url)
}

getAllApi()
</script>
