<template>
  <div class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <AppHeader :is-scrolled="isScrolled" :showShadow="false" />

    <main>
      <!-- Banner 区域 -->
      <section class="marketplace-banner relative min-h-280px py-56px flex items-center overflow-hidden">
        <div class="max-w-1160px mx-auto w-full relative z-10">
          <h1 class="mb-32px flex items-center gap-18px">
            <span class="marketplace-title font-['Alibaba_PuHuiTi_2.0'] font-bold text-[32px]">
              资源市场
            </span>
            <div class="flex bg-[#00000040] h-[28px] w-[2px]"></div>
            <span class="font-['Alibaba_PuHuiTi_2.0'] font-bold text-[32px] leading-normal text-center text-black/85">
              智能要素超市
            </span>
          </h1>

          <!-- 搜索框 -->
          <div class="search-container flex items-center bg-white rounded-8px overflow-hidden max-w-880px">
            <div class="search-dropdown relative flex items-center gap-8px px-16px py-12px cursor-pointer border-r border-gray-200">
              <span class="font-['PingFang_SC'] text-[14px] text-[#1677FF]">全部资源</span>
              <Icon icon="ep:arrow-down" class="text-[#1677FF]" />
            </div>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="请输入关键词"
              class="flex-1 px-16px py-12px outline-none font-['PingFang_SC'] text-[14px]"
              @keyup.enter="debouncedSearch"
            />
            <button
              class="search-button px-20px py-12px bg-[#1677FF] hover:bg-[#0E5FD9] transition-colors"
              @click="debouncedSearch"
            >
              <Icon icon="ep:search" class="text-white text-20px" />
            </button>
          </div>
        </div>
      </section>

      <!-- 资源展示区域 -->
      <section class="py-40px pb-80px bg-[#F8F9FC]">
        <div class="max-w-1160px mx-auto">
          <h2 class="font-['PingFang_SC'] font-medium text-[32px] text-black/85 mb-40px">
            资源展示
          </h2>
          <div class="grid grid-cols-4 gap-16px">
            <QualityResourceCard
              v-for="product in filteredProducts"
              :key="product.id"
              :resource="product"
              @click="navigateToDetail($event.id)"
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
import { usePublic } from './composables/usePublic'
import { useMarketplace } from './composables/useMarketplace'
import QualityResourceCard from './components/QualityResourceCard.vue'

defineOptions({ name: 'Marketplace' })

const { isScrolled, navigateTo, navigateToDetail } = usePublic()
const { searchKeyword, filteredProducts, debouncedSearch } = useMarketplace()
</script>

<style scoped>
.marketplace-banner {
  /* background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); */
  position: relative;
}

.marketplace-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/src/assets/imgs/bg/Marketplace/MarketplaceBanner.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
}

.marketplace-title {
  background: linear-gradient(90deg, #1677ff 0%, #16d4ff 50%, #1677ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-container {
  box-shadow: 0 2px 12px rgba(22, 119, 255, 0.15);
}

.search-dropdown:hover {
  background-color: #f5f5f5;
}
</style>
