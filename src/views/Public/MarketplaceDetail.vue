<template>
  <div class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <AppHeader :is-scrolled="isScrolled" :custom-style="{ background: '#fff' }" />

    <main>
      <!-- 面包屑导航 -->
      <section class="pt-84px bg-#F8F9FC">
        <div class="max-w-1160px mx-auto flex items-center gap-8px text-14px">
          <span
            @click="navigateTo('/marketplace')"
            class="text-#000000a6 cursor-pointer hover:text-#409eff transition-colors font-['PingFang_SC'] font-normal text-[14px] leading-[22px] tracking-0 text-left"
          >
            <span class="text-#000000a6 cursor-pointer">&lt;</span>
            查看全部资源
          </span>
        </div>
      </section>

      <!-- Banner 区域 -->
      <section class="pt-38px pb-50px bg-#F8F9FC">
        <div class="max-w-1160px mx-auto">
          <div class="flex items-center justify-between">
            <div class="flex-1 pr-60px">
              <h1 class="text-36px font-700 text-#1a1a1a mb-20px">
                {{ resourceDetail.title }}
              </h1>

              <p class="font-['PingFang_SC'] font-normal text-[14px] leading-[22px] tracking-0 text-left text-black/65 w-[730px] border-b border-[#0000000f] border-solid border-x-0 border-t-0 pb-24px">
                {{ resourceDetail.description }}
              </p>

              <div class="flex items-center gap-24px mt-26px">
                <button
                  class="apply-btn flex items-center gap-10px pl-20px pr-12px py-8px text-white text-14px font-medium"
                >
                  申请资源
                  <span
                    class="arrow-icon flex items-center justify-center w-24px h-24px bg-white rounded-full"
                  >
                    <Icon icon="ep:arrow-right" class="text-14px text-#1677FF" />
                  </span>
                </button>
                <div
                  class="flex items-center gap-6px cursor-pointer text-#1677FF hover:opacity-80 transition-opacity"
                >
                  <Icon icon="ep:warning" class="text-16px" />
                  <span class="text-14px">问题反馈</span>
                </div>
              </div>
            </div>

            <div
              class="flex-shrink-0 w-340px h-210px bg-#f0f2f5 rounded-8px flex items-center justify-center"
            >
              <div class="text-#999 text-14px">资源图示</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据资源信息 -->
      <section class="max-w-1160px mx-auto bg-white rounded-8px py-60px">
        <ResourceInfo :basic-info="resourceDetail.basicInfo" :data-info="resourceDetail.dataInfo" />
      </section>

      <!-- 评分及评论 -->
      <section class="max-w-1160px mx-auto pb-60px">
        <h2
          class="border-b border-[#0000000f] border-solid border-x-0 border-t-0 font-['PingFang_SC'] font-medium text-[20px] leading-[24px] tracking-0 text-left text-black/85 pb-34px"
          >评分及评论</h2
        >

        <div class="grid grid-cols-2 pt-32px gap-40px pb-44px">
          <div>
            <h3 class="text-16px font-600 text-#1a1a1a pb-16px">好评</h3>
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
            <h3 class="text-16px font-600 text-#1a1a1a pb-16px">差评</h3>
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
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
