<template>
  <div class="h-screen w-full overflow-x-hidden overflow-y-auto scroll-smooth">
    <AppHeader :is-scrolled="isScrolled" :custom-style="{ background: '#fff' }" />

    <main>
      <!-- 面包屑导航 -->
      <section class="bg-#F8F9FC pt-84px">
        <div class="mx-auto max-w-1160px flex items-center gap-8px text-14px">
          <span
            @click="navigateTo('/marketplace')"
            class="cursor-pointer text-left text-[14px] text-#000000a6 font-normal leading-[22px] tracking-0 font-['PingFang_SC'] transition-colors hover:text-#409eff"
          >
            <span class="cursor-pointer text-#000000a6">&lt;</span>
            查看全部资源
          </span>
        </div>
      </section>

      <!-- Banner 区域 -->
      <section class="bg-#F8F9FC pb-50px pt-38px">
        <div class="mx-auto max-w-1160px">
          <div class="flex items-center justify-between">
            <div class="flex-1 pr-60px">
              <h1 class="mb-20px text-36px text-#1a1a1a font-700">
                {{ resourceDetail.title }}
              </h1>

              <p class="w-[730px] border-x-0 border-b border-t-0 border-[#0000000f] border-solid pb-24px text-left text-[14px] text-black/65 font-normal leading-[22px] tracking-0 font-['PingFang_SC']">
                {{ resourceDetail.description }}
              </p>

              <div class="mt-26px flex items-center gap-24px">
                <button
                  class="apply-btn flex items-center gap-10px py-8px pl-20px pr-12px text-14px text-white font-medium"
                >
                  申请资源
                  <span
                    class="arrow-icon h-24px w-24px flex items-center justify-center rounded-full bg-white"
                  >
                    <Icon icon="ep:arrow-right" class="text-14px text-#1677FF" />
                  </span>
                </button>
                <div
                  class="flex cursor-pointer items-center gap-6px text-#1677FF transition-opacity hover:opacity-80"
                  @click="handleFeedbackClick"
                >
                  <Icon icon="ep:warning" class="text-16px" />
                  <span class="text-14px">问题反馈</span>
                </div>
              </div>
            </div>

            <div
              class="h-210px w-340px flex flex-shrink-0 items-center justify-center rounded-8px bg-#f0f2f5"
            >
              <div class="text-14px text-#999">资源图示</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据资源信息 -->
      <section class="mx-auto max-w-1160px rounded-8px bg-white py-60px">
        <ResourceInfo :basic-info="resourceDetail.basicInfo" :data-info="resourceDetail.dataInfo" />
      </section>

      <!-- 评分及评论 -->
      <section class="mx-auto max-w-1160px pb-60px">
        <h2
          class="border-x-0 border-b border-t-0 border-[#0000000f] border-solid pb-34px text-left text-[20px] text-black/85 font-medium leading-[24px] tracking-0 font-['PingFang_SC']"
          >评分及评论</h2
        >

        <div class="grid grid-cols-2 gap-40px pb-44px pt-32px">
          <div>
            <h3 class="pb-16px text-16px text-#1a1a1a font-600">好评</h3>
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
            <h3 class="pb-16px text-16px text-#1a1a1a font-600">差评</h3>
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
      </section>
    </main>

    <Footer :social-links="[]" @navigation="navigateTo" />
    <el-backtop :target="'.scroll-smooth'" />

    <!-- 问题反馈抽屉 -->
    <FeedbackForm
      v-model="feedbackVisible"
      :resource-id="Number(route.params.id)"
      :resource-name="resourceDetail.title"
      @success="handleFeedbackSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import CommentList from '@/components/CommentList/src/CommentList.vue'
import { ResourceInfo } from '@/components/ResourceInfo'
import { FeedbackForm } from '@/components/FeedbackForm'
import { usePublic } from './composables/usePublic'
import { useMarketplaceDetailData } from './composables/useMarketplaceDetailData'
import { getAccessToken } from '@/utils/auth'

defineOptions({ name: 'MarketplaceDetail' })

const route = useRoute()
const { isScrolled, navigateTo } = usePublic()
const { resourceDetail } = useMarketplaceDetailData(route.params.id as string)

// 反馈抽屉显示状态
const feedbackVisible = ref(false)

// 点击问题反馈
const handleFeedbackClick = async () => {
  // 检查是否已登录
  const hasToken = getAccessToken()
  if (!hasToken) {
    try {
      await ElMessageBox.confirm('请先登录后再提交反馈', '提示', {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 点击确认，跳转到登录页
      navigateTo('/login')
    } catch {
      // 点击取消，不做任何操作
    }
    return
  }

  // 已登录，打开反馈抽屉
  feedbackVisible.value = true
}

// 反馈提交成功
const handleFeedbackSuccess = () => {
  // 可以在这里添加其他逻辑
  console.log('反馈提交成功')
}

const handlePublishComment = (content: string) => {
  console.log('发布评论:', content)
  // TODO: 调用 API 发布评论
}

const handleReplyComment = (comment: any) => {
  console.log('回复评论:', comment)
  // TODO: 显示回复框或调用 API
}
</script>

<style scoped>
.apply-btn {
  background: linear-gradient(90deg, #136fff 1%, #01c8ff 39%, #136fff 100%);
  transition: opacity 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 20px;
}

.apply-btn:hover {
  opacity: 0.85;
}

.apply-btn:disabled,
.apply-btn.is-disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
</style>
