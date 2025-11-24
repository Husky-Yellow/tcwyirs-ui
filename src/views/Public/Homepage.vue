<template>
  <div
    ref="scrollContainerRef"
    class="h-screen w-full overflow-x-hidden overflow-y-auto scroll-smooth"
  >
    <AppHeader :is-scrolled="isScrolled" :showShadow="false" />

    <main>
      <HomepageBanner @navigate="navigateTo('/dashboard/index')" />
      <DataStatistics :statistics="dataStatistics" />
      <QualityResourcesSection
        :resources="qualityResources"
        @resource-click="(resource) => navigateToDetail(resource.id)"
        @more-click="navigateTo('/marketplace')"
      />
      <ApplicationScenariosSection :scenarios="applicationScenarios" />
      <ResourceSharingCTA @navigate="navigateTo('/marketplace')" />
    </main>

    <Footer :social-links="[]" @navigation="navigateTo" />
    <el-backtop :target="'.scroll-smooth'" />
  </div>
</template>

<script setup lang="ts">
import { useHomepageData } from './composables/useHomepageData'
import { usePublic } from './composables/usePublic'
import HomepageBanner from './components/HomepageBanner.vue'
import DataStatistics from './components/DataStatistics.vue'
import QualityResourcesSection from './components/QualityResourcesSection.vue'
import ApplicationScenariosSection from './components/ApplicationScenariosSection.vue'
import ResourceSharingCTA from './components/ResourceSharingCTA.vue'

defineOptions({ name: 'Homepage' })

const { qualityResources, applicationScenarios, dataStatistics } = useHomepageData()
const { scrollContainerRef, isScrolled, navigateTo, navigateToDetail } = usePublic()
</script>
