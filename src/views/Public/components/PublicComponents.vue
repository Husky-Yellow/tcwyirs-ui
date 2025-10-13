<template>
  <!-- ================== 可重用模板定义 ================== -->
  <!-- Banner 模板 -->
  <DefineBanner v-slot="{ onNavigate }">
    <section
      class="relative min-h-500px flex items-center overflow-hidden"
      style="background-image: url('/src/assets/imgs/bg/homepage/banner-background.png'); background-size: cover; background-position: center;"
    >
      <div class="max-w-1200px mx-auto px-20px w-full">
        <div class="flex items-center justify-between gap-60px">
          <!-- 左侧内容 -->
          <div class="flex-1 max-w-600px">
            <!-- 主标题 -->
            <h1 class="text-50px mb-20px leading-tight">
              <span class="text-#409EFF font-alibaba">芯连万物</span>
              <span class="text-#1f2937">共创万物智联时代</span>
            </h1>

            <!-- 副标题 -->
            <p class="text-16px text-#6b7280 mb-40px leading-1.8">
              构筑互联互通的资源共享协作网络，实现企业级数智资源、应用资源、组建资源的高动共用
            </p>

            <!-- CTA 按钮 -->
            <button
              class="px-40px py-16px bg-#409EFF text-white text-16px font-500 rounded-8px cursor-pointer transition-all duration-300 hover:bg-#66b1ff hover:shadow-lg"
              @click="onNavigate"
            >
              进入工作台
            </button>
          </div>

          <!-- 右侧插图 -->
          <div class="flex-1 flex justify-end">
            <img
              src="/src/assets/imgs/bg/homepage/banner-illustration.png"
              alt="Banner Illustration"
              class="w-326px h-314px"
            />
          </div>
        </div>
      </div>
    </section>
  </DefineBanner>

  <!-- 优质资源卡片模板 -->
  <DefineQualityResourceCard v-slot="{ resource, onResourceClick }">
    <div
      class="resource-share-card w-274px h-272px bg-white rounded-8px overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y--4px"
      @click="onResourceClick(resource)"
    >
      <!-- 图片区域 -->
      <div class="relative w-full h-156px bg-gradient-to-br from-#e5e7eb to-#f3f4f6 overflow-hidden">
        <!-- 背景装饰图案 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute w-120px h-120px rounded-full bg-white/30 blur-20px"></div>
          <div class="absolute w-80px h-80px rounded-full bg-black/5 top-20px right-30px"></div>
        </div>

        <!-- 主图标/字母 A -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="relative flex items-center gap-8px">
            <!-- 装饰性几何图形 -->
            <div class="w-60px h-60px rounded-full border-2 border-#cbd5e1 bg-white/80"></div>
            <!-- 字母 A -->
            <div class="text-80px font-800 text-#1f2937" style="line-height: 1;">A</div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-16px">
        <!-- 标签 -->
        <div class="flex items-center gap-8px mb-8px">
          <span class="px-8px py-2px bg-#f0f9ff text-#0284c7 text-12px rounded-4px">
            {{ resource.category }}
          </span>
        </div>

        <!-- 标题 -->
        <h3 class="text-16px font-600 text-#1f2937 mb-8px truncate">
          {{ resource.title }}
        </h3>

        <!-- 描述 -->
        <p class="text-13px text-#6b7280 line-clamp-2 mb-8px" style="min-height: 36px;">
          {{ resource.description }}
        </p>

        <!-- 底部：详情链接 -->
        <div class="flex items-center justify-between">
          <span class="text-13px text-#3b82f6 hover:text-#2563eb transition-colors cursor-pointer">
            详情
          </span>
        </div>
      </div>
    </div>
  </DefineQualityResourceCard>

  <!-- 优质资源共享区域模板 -->
  <DefineQualityResourcesSection v-slot="{ resources, onResourceClick, onMoreClick }">
    <section class="py-80px bg-[#F8F9FC]">
      <div class="max-w-1200px mx-auto px-20px">
        <!-- 标题 -->
        <div class="text-center mb-60px">
          <h2 class="text-36px font-700 text-#1f2937 mb-16px">优质资源共享</h2>
        </div>

        <!-- 资源卡片网格 -->
        <div class="grid grid-cols-4 gap-16px">
          <ReuseQualityResourceCard
            v-for="resource in resources"
            :key="resource.id"
            :resource="resource"
            :on-resource-click="onResourceClick"
          />
        </div>

        <!-- 更多资源链接 -->
        <div class="text-center mt-40px">
          <span
            class="text-14px text-#3b82f6 cursor-pointer hover:text-#2563eb transition-colors"
            @click="onMoreClick"
          >
            更多资源 →
          </span>
        </div>
      </div>
    </section>
  </DefineQualityResourcesSection>

  <!-- 应用场景卡片模板 -->
  <DefineApplicationScenarioCard v-slot="{ scenario }">
    <div class="flex flex-col gap-20px">
      <!-- 编号图标 -->
      <div class="flex items-center gap-12px">
        <div class="w-48px h-48px rounded-full bg-#E8F3FF flex items-center justify-center">
          <span class="text-20px font-700 text-#409EFF">{{ scenario.id }}</span>
        </div>
      </div>

      <!-- 标题 -->
      <h3 class="text-18px font-600 text-#1f2937">{{ scenario.title }}</h3>

      <!-- 描述 -->
      <p class="text-14px text-#6b7280">
        {{ scenario.description }}
      </p>
    </div>
  </DefineApplicationScenarioCard>

  <!-- 应用场景区域模板 -->
  <DefineApplicationScenariosSection v-slot="{ scenarios }">
    <section class="py-80px bg-white">
      <div class="max-w-1200px mx-auto px-20px">
        <!-- 标题 -->
        <div class="text-center mb-60px">
          <h2 class="text-36px font-700 text-#1f2937 mb-16px">应用场景</h2>
        </div>

        <!-- 场景卡片网格 -->
        <div class="grid grid-cols-2 gap-x-60px gap-y-40px">
          <ReuseApplicationScenarioCard
            v-for="scenario in scenarios"
            :key="scenario.id"
            :scenario="scenario"
          />
        </div>
      </div>
    </section>
  </DefineApplicationScenariosSection>

  <!-- 数据统计模板 -->
  <DefineDataStatistics v-slot="{ statistics }">
    <section class="py-60px bg-white">
      <div class="max-w-1200px mx-auto px-33px">
        <!-- 统计数据网格 -->
        <div class="grid grid-cols-4 gap-40px">
          <div
            v-for="stat in statistics"
            :key="stat.label"
            class="flex flex-col items-center justify-center"
          >
            <!-- 数字 -->
            <div class="text-40px font-700 text-#3b82f6 mb-8px">
              {{ stat.value.toLocaleString() }}
            </div>
            <!-- 标签 -->
            <div class="text-16px text-#6b7280">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </DefineDataStatistics>

  <!-- 资源共享 CTA 模板 -->
  <DefineResourceSharingCTA v-slot="{ onNavigate }">
    <section
      class="py-100px relative overflow-hidden"
      style="
        background: linear-gradient(180deg, rgba(248, 249, 252, 0.95) 0%, rgba(243, 246, 255, 0.4) 100%);
      "
    >
      <!-- 背景图片 -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style="background-image: url('/src/assets/imgs/bg/homepage/resource-sharing-bg.png');"
      ></div>

      <!-- 内容 -->
      <div class="relative max-w-1200px mx-auto px-20px">
        <div class="flex flex-col items-start">
          <!-- 标题 -->
          <h2 class="text-32px font-700 text-#1f2937 mb-40px">
            资源共享，带你享受资源互连互通的便利性
          </h2>

          <!-- 按钮 -->
          <button
            class="px-32px py-14px bg-#409EFF text-white text-16px font-500 rounded-8px cursor-pointer transition-all duration-300 hover:bg-#66b1ff hover:shadow-lg"
            @click="onNavigate"
          >
            智能要素超市
          </button>
        </div>
      </div>
    </section>
  </DefineResourceSharingCTA>
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type {
  ApplicationScenario,
  QualityResource,
  DataStatistic
} from '../composables/useHomepageData'

defineOptions({ name: 'PublicComponents' })

// 1. Banner 模板
const [DefineBanner, Banner] = createReusableTemplate<{
  onNavigate: () => void
}>()

// 2. 优质资源卡片模板
const [DefineQualityResourceCard, ReuseQualityResourceCard] = createReusableTemplate<{
  resource: QualityResource
  onResourceClick: (resource: QualityResource) => void
}>()

// 3. 优质资源共享区域模板
const [DefineQualityResourcesSection, QualityResourcesSection] = createReusableTemplate<{
  resources: QualityResource[]
  onResourceClick: (resource: QualityResource) => void
  onMoreClick: () => void
}>()

// 4. 应用场景卡片模板
const [DefineApplicationScenarioCard, ReuseApplicationScenarioCard] = createReusableTemplate<{
  scenario: ApplicationScenario
}>()

// 5. 应用场景区域模板
const [DefineApplicationScenariosSection, ApplicationScenariosSection] = createReusableTemplate<{
  scenarios: ApplicationScenario[]
}>()

// 6. 数据统计模板
const [DefineDataStatistics, DataStatistics] = createReusableTemplate<{
  statistics: DataStatistic[]
}>()

// 7. 资源共享 CTA 模板
const [DefineResourceSharingCTA, ResourceSharingCTA] = createReusableTemplate<{
  onNavigate: () => void
}>()

// 导出组件供外部使用
defineExpose({
  Banner,
  QualityResourceCard: ReuseQualityResourceCard,
  QualityResourcesSection,
  ApplicationScenariosSection,
  DataStatistics,
  ResourceSharingCTA
})
</script>
