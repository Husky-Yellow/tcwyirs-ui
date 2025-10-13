<template>
  <div class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <PublicComponents ref="publicComponentsRef" />
    <Header :is-scrolled="isScrolled" @navigation="navigateTo" activeNavItem="marketplace" />

    <main class="pt-56px">
      <!-- Banner 区域 -->
      <section
        class="relative min-h-280px flex items-center overflow-hidden bg-cover bg-center"
        style="background-image: url('/src/assets/imgs/bg/Marketplace/MarketplaceBanner.png');"
      >
        <div class="max-w-1200px mx-auto px-20px w-full relative z-10">
          <h1 class="text-52px font-800 text-white mb-16px leading-tight">
            资源市场 | 智能要素超市
          </h1>
          <div class="mb-24px">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索智能要素..."
              class="input-with-select"
              style="max-width: 600px"
              @keyup.enter="debouncedSearch"
            >
              <template #prepend>
                <el-select v-model="searchType" placeholder="选择" style="width: 115px">
                  <el-option label="全部" value="all" />
                  <el-option label="标题" value="title" />
                  <el-option label="描述" value="description" />
                </el-select>
              </template>
              <template #append>
                <el-button :icon="Search" @click="debouncedSearch" />
              </template>
            </el-input>
          </div>
        </div>
      </section>

      <!-- 产品列表区域 -->
      <section class="products-section py-40px pb-80px bg-#F8F9FC">
        <div class="max-w-1200px mx-auto px-20px">
          <div class="flex">
            <span>资源展示</span>
            <span>我的收藏</span>
          </div>
          <div class="grid gap-16px" style="grid-template-columns: repeat(auto-fill, minmax(274px, 1fr));">
            <component
              :is="ReuseQualityResourceCard"
              v-for="product in filteredProducts"
              :key="product.id"
              :resource="product"
              :on-resource-click="({ id }) => navigateToDetail(id)"
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
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PublicComponents from './components/PublicComponents.vue'
import { usePublic } from './composables/usePublic'
import { useMarketplaceData } from './composables/useMarketplaceData'
import { useMarketplaceSearch } from './composables/useMarketplaceSearch'

defineOptions({ name: 'Marketplace' })

// 滚动和导航
const { isScrolled, navigateTo, navigateToDetail } = usePublic()

// 数据
const { products } = useMarketplaceData()

// 搜索和过滤
const { searchKeyword, searchType, filteredProducts, debouncedSearch } = useMarketplaceSearch(products)

// 可重用组件引用
const publicComponentsRef = ref<InstanceType<typeof PublicComponents>>()
const ReuseQualityResourceCard = computed(() => publicComponentsRef.value?.QualityResourceCard)
</script>
