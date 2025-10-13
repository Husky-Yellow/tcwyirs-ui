<template>
  <div class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <!-- 顶部导航栏 -->
    <Header :is-scrolled="isScrolled" @navigation="handleNavigation" :background-color="'fff'" activeNavItem="marketplace"/>

    <!-- 主要内容区域 -->
    <main class="pt-56px ">
      <!-- 面包屑导航 -->
      <section class="py-16px bg-#F8F9FC">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="flex items-center gap-8px text-14px">
            <span class="text-#999">&lt;</span>
            <span
              @click="handleNavigation('/marketplace')"
              class="text-#999 cursor-pointer hover:text-#409eff transition-colors"
            >
              查看全部资源
            </span>
          </div>
        </div>
      </section>

      <!-- Banner 区域 -->
      <section class="py-40px bg-#F8F9FC">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="flex items-center justify-between">
            <!-- 左侧内容 -->
            <div class="flex-1 pr-60px">
              <!-- 标题 -->
              <h1 class="text-36px font-700 text-#1a1a1a mb-24px">
                {{ resourceDetail.title }}
              </h1>

              <!-- 描述 -->
              <p class="text-15px text-#666 mb-32px">
                {{ resourceDetail.description }}
              </p>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-16px">
                <el-button type="primary" size="large" class="px-32px">
                  <el-icon class="mr-8px"><Download /></el-icon>
                  申请资源
                </el-button>
                <el-button size="large" class="px-24px" plain>
                  <el-icon class="mr-8px"><QuestionFilled /></el-icon>
                  问题反馈
                </el-button>
              </div>
            </div>

            <!-- 右侧插图 -->
            <div class="flex-shrink-0 w-280px h-200px bg-#f0f2f5 rounded-8px flex items-center justify-center">
              <div class="text-#999 text-14px">资源图示</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据资源信息 -->
      <section class="py-40px">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="bg-white rounded-8px p-32px">
            <h2 class="text-24px font-600 text-#1a1a1a mb-32px">数据资源信息</h2>

            <!-- 基本信息 -->
            <div class="mb-40px">
              <h3 class="text-18px font-600 text-#1a1a1a mb-24px">基本信息</h3>
              <div class="grid grid-cols-2 gap-x-80px gap-y-20px">
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">资源名称：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.resourceName }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">资源标签：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.resourceTag }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">归属方：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.owner }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">资源创建人：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.creator }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">归属应用：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.application }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">资源联系人：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.contact }}</span>
                </div>
                <div class="flex col-span-2">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">描述：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.descriptionText }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">资源上架时间：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.publishTime }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-100px flex-shrink-0">联系方式：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.basicInfo.contactPhone }}</span>
                </div>
              </div>
            </div>

            <!-- 数据信息 -->
            <div>
              <h3 class="text-18px font-600 text-#1a1a1a mb-24px">数据信息</h3>
              <div class="grid grid-cols-3 gap-40px">
                <div class="flex">
                  <span class="text-14px text-#999 w-80px flex-shrink-0">申请量：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.dataInfo.applications }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-80px flex-shrink-0">访问量：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.dataInfo.visits }}</span>
                </div>
                <div class="flex">
                  <span class="text-14px text-#999 w-80px flex-shrink-0">月度数数：</span>
                  <span class="text-14px text-#333">{{ resourceDetail.dataInfo.monthlyHits }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 评分及评论 -->
      <section class="pb-60px">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="bg-white rounded-8px p-32px">
            <h2 class="text-24px font-600 text-#1a1a1a mb-32px">评分及评论</h2>

            <!-- 好评和差评标签 -->
            <div class="grid grid-cols-2 gap-40px mb-40px">
              <!-- 好评 -->
              <div>
                <h3 class="text-16px font-600 text-#1a1a1a mb-16px">好评</h3>
                <div class="flex flex-wrap gap-12px">
                  <el-tag
                    v-for="tag in resourceDetail.reviews.positive"
                    :key="tag"
                    type="primary"
                    class="cursor-pointer"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>

              <!-- 差评 -->
              <div>
                <h3 class="text-16px font-600 text-#1a1a1a mb-16px">差评</h3>
                <div class="flex flex-wrap gap-12px">
                  <el-tag
                    v-for="tag in resourceDetail.reviews.negative"
                    :key="tag"
                    type="danger"
                    class="cursor-pointer"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 评论区 -->
            <CommentList
              :comments="resourceDetail.comments"
              :overall-score="resourceDetail.reviews.score"
              @publish="handlePublishComment"
              @reply="handleReplyComment"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <Footer :social-links="[]" @navigation="handleNavigation" />

    <!-- 返回顶部按钮 -->
    <el-backtop :target="'.scroll-smooth'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Download, QuestionFilled } from '@element-plus/icons-vue'
import CommentList from '@/components/CommentList/src/CommentList.vue'
import { usePublic } from './composables/usePublic'

defineOptions({ name: 'MarketplaceDetail' })

const route = useRoute()
const { isScrolled, navigateTo } = usePublic()

// 资源详情数据（实际应该从 API 获取）
const resourceDetail = ref({
  id: route.params.id as string,
  title: '停车缴费记录',
  description: '实时数据 Pulsar 消息推送基于 Apache Pulsar 分布式消息系统，能实现高吞吐、低延迟的实时数据推送，其支持多租户和高可用性，通过 Topic 分层机制，确保对应数据准确推送至不同的客户群体，通过分区保证同一分区内的消息有序性。结合 Exactly-Once 语义保证数据一致，同时提供多协议接入能力，无缝对接全球各类数据源。运维友好且高可靠，适应容灾等场景。',
  basicInfo: {
    resourceName: '近一年车辆进出停车场记录',
    resourceTag: '标签一',
    owner: 'hsakndaks',
    creator: '李存善',
    application: 'hsakndaks',
    contact: '小昱',
    descriptionText: '这是一段内容注这是一段内容注这是一段内容注这是一段内容注这是一段内容注',
    publishTime: '2018-10-31 23:12:00',
    contactPhone: '2178961893831'
  },
  dataInfo: {
    applications: '21234',
    visits: '123112',
    monthlyHits: '21'
  },
  reviews: {
    positive: [
      '资源内容丰富',
      '操作使用便捷',
      '符合日常需求',
      '资源数据精准',
      '这是一个好评',
      '这是一个很好的好评'
    ],
    negative: [
      '资源内容不符合描述',
      '体验不佳',
      '内容出错',
      '与业务场景不太匹配',
      '数据内容出现错误',
      '申请时常太久'
    ],
    score: 79
  },
  comments: [
    {
      id: '1',
      userName: '初灼辉',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了',
      score: 92,
      showReplies: false,
      replies: [
        {
          id: '1-1',
          userName: '小昱',
          time: '2025-10-01 14:25',
          content: '我也觉得好用，太赞了'
        }
      ]
    },
    {
      id: '2',
      userName: '初灼辉',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了，使用感极佳',
      score: 99,
      showReplies: false,
      replies: [
        {
          id: '2-1',
          userName: '张三',
          time: '2025-10-01 15:30',
          content: '确实不错，推荐使用'
        },
        {
          id: '2-2',
          userName: '李四',
          time: '2025-10-01 16:00',
          content: '同意，功能很强大'
        }
      ]
    },
    {
      id: '3',
      userName: '小昱A',
      time: '2025-10-01 14:20',
      content: '资源内容丰富，操作使用便捷，符合日常需求',
      score: 88,
      showReplies: false,
      replies: []
    },
    {
      id: '4',
      userName: '民本归',
      time: '2025-10-01 14:20',
      content: '这是一个只讲技术评分的样子',
      score: 75,
      showReplies: false,
      replies: []
    },
    {
      id: '5',
      userName: '酒酒',
      time: '2025-10-01 14:20',
      content: '这个资源使用起来一般，太一般',
      score: 46,
      showReplies: false,
      replies: [
        {
          id: '5-1',
          userName: '王五',
          time: '2025-10-01 17:00',
          content: '可能是使用方式不对吧'
        },
        {
          id: '5-2',
          userName: '赵六',
          time: '2025-10-01 17:30',
          content: '我觉得还可以'
        }
      ]
    }
  ]
})

// 方法
const handleNavigation = navigateTo

const handlePublishComment = (content: string): void => {
  console.log('发布评论:', content)
  // 这里应该调用 API 发布评论
}

const handleReplyComment = (comment: any): void => {
  console.log('回复评论:', comment)
  // 这里应该显示回复框或调用 API
}
</script>
