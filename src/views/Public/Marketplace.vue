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
          <div class="search-container relative flex items-center bg-white rounded-8px overflow-hidden max-w-880px">
            <el-dropdown trigger="click" @command="handleCategoryChange">
              <div class="search-dropdown flex items-center gap-8px px-16px py-10px cursor-pointer">
                <span class="font-['PingFang_SC'] text-[14px] font-medium text-[#1677FF]">{{ selectedCategory }}</span>
                <Icon icon="ep:arrow-down" class="text-[#1677FF] text-12px" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :command="item.value"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <div class="w-[1px] h-[20px] bg-[#E8E8E8]"></div>
            <el-input
              v-model="searchKeyword"
              placeholder="请输入关键词"
              class="flex-1 search-input"
              @keyup.enter="debouncedSearch"
            >
              <template #suffix>
                <Icon
                  icon="ep:search"
                  class="text-[#1677FF] text-18px cursor-pointer hover:opacity-80 transition-opacity"
                  @click="debouncedSearch"
                />
              </template>
            </el-input>
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
import { ref } from 'vue'
import { usePublic } from './composables/usePublic'
import { useMarketplace } from './composables/useMarketplace'
import QualityResourceCard from './components/QualityResourceCard.vue'

defineOptions({ name: 'Marketplace' })

const { isScrolled, navigateTo, navigateToDetail } = usePublic()
const { searchKeyword, filteredProducts, debouncedSearch } = useMarketplace()

// 分类下拉
const selectedCategory = ref('全部资源')
const categoryOptions = [
  { label: '全部资源', value: 'all' },
  { label: '数据资源', value: 'data' },
  { label: '算法资源', value: 'algorithm' },
  { label: '模型资源', value: 'model' },
  { label: '工具资源', value: 'tool' }
]

const handleCategoryChange = (command: string) => {
  const selected = categoryOptions.find(item => item.value === command)
  if (selected) {
    selectedCategory.value = selected.label
    // TODO: 根据分类筛选资源
    console.log('Selected category:', command)
  }
}
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.marketplace-title {
  background: linear-gradient(90deg, #1677ff 0%, #16d4ff 50%, #1677ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-container {
  box-shadow: 0 2px 12px rgba(22, 119, 255, 0.15);
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #136FFF 1%, #01C8FF 39%, #136FFF 100%) border-box;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: none;
  padding: 10px 16px;
  background-color: transparent;
}

.search-input :deep(.el-input__inner) {
  font-family: 'PingFang SC';
  font-size: 14px;
  color: #000000d9;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #bfbfbf;
}

.search-input :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  padding-right: 8px;
}

.search-dropdown:hover {
  background-color: #f5f5f5;
}
</style>
