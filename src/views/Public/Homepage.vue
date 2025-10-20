<template>
  <div ref="scrollContainerRef" class="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
    <PublicComponents ref="publicComponentsRef" />
    <Header :is-scrolled="isScrolled" @navigation="navigateTo" />
    <main class="pt-56px">
      <component :is="ReuseBanner" :on-navigate="() => navigateTo('/workspace')" />
      <component :is="ReuseDataStatistics" :statistics="dataStatistics" />
      <component
        :is="ReuseQualityResourcesSection"
        :resources="qualityResources"
        :on-resource-click="({ id }) => navigateToDetail(id)"
        :on-more-click="() => navigateTo('/marketplace')"
      />
      <component :is="ReuseApplicationScenariosSection" :scenarios="applicationScenarios" />
      <component :is="ReuseResourceSharingCTA" :on-navigate="() => navigateTo('/marketplace')" />
    </main>

    <Footer :social-links="[]" @navigation="navigateTo" />
    <el-backtop :target="'.scroll-smooth'" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import PublicComponents from './components/PublicComponents.vue'
import { useHomepageData } from './composables/useHomepageData'
import { usePublic } from './composables/usePublic'

defineOptions({ name: 'Homepage' })

// 数据
const { qualityResources, applicationScenarios, dataStatistics } = useHomepageData()

// 滚动和导航
const { scrollContainerRef, isScrolled, navigateTo, navigateToDetail } = usePublic()

// 可重用组件引用
const publicComponentsRef = ref<InstanceType<typeof PublicComponents>>()
const ReuseBanner = computed(() => publicComponentsRef.value?.Banner as Component | undefined)
const ReuseQualityResourcesSection = computed(() => publicComponentsRef.value?.QualityResourcesSection as Component | undefined)
const ReuseApplicationScenariosSection = computed(() => publicComponentsRef.value?.ApplicationScenariosSection as Component | undefined)
const ReuseDataStatistics = computed(() => publicComponentsRef.value?.DataStatistics as Component | undefined)
const ReuseResourceSharingCTA = computed(() => publicComponentsRef.value?.ResourceSharingCTA as Component | undefined)
</script>
