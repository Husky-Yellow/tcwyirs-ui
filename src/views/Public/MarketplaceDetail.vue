<template>
  <div class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <AppHeader :is-scrolled="isScrolled" :custom-style="{ background: '#fff' }" />

    <main>
      <!-- 面包屑导航 -->
      <section class="py-16px bg-#F8F9FC">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="flex items-center gap-8px text-14px">
            <span class="text-#999">&lt;</span>
            <span
              @click="navigateTo('/marketplace')"
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
            <div class="flex-1 pr-60px">
              <h1 class="text-36px font-700 text-#1a1a1a mb-24px">
                {{ resourceDetail.title }}
              </h1>

              <p class="text-15px text-#666 mb-32px">
                {{ resourceDetail.description }}
              </p>

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
            <ResourceInfo :basic-info="resourceDetail.basicInfo" :data-info="resourceDetail.dataInfo" />
          </div>
        </div>
      </section>

      <!-- 评分及评论 -->
      <section class="pb-60px">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="bg-white rounded-8px p-32px">
            <h2 class="text-24px font-600 text-#1a1a1a mb-32px">评分及评论</h2>

            <div class="grid grid-cols-2 gap-40px mb-40px">
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

    <Footer :social-links="[]" @navigation="navigateTo" />
    <el-backtop :target="'.scroll-smooth'" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Download, QuestionFilled } from '@element-plus/icons-vue'
import CommentList from '@/components/CommentList/src/CommentList.vue'
import { ResourceInfo } from '@/components/ResourceInfo'
import { usePublic } from './composables/usePublic'
import { useMarketplaceDetailData } from './composables/useMarketplaceDetailData'

defineOptions({ name: 'MarketplaceDetail' })

const route = useRoute()
const { isScrolled, navigateTo } = usePublic()
const { resourceDetail } = useMarketplaceDetailData(route.params.id as string)

const handlePublishComment = (content: string) => {
  console.log('发布评论:', content)
  // TODO: 调用 API 发布评论
}

const handleReplyComment = (comment: any) => {
  console.log('回复评论:', comment)
  // TODO: 显示回复框或调用 API
}
</script>
