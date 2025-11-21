<script lang="ts" setup>
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/layout/components/Footer'
import { PageHeader } from '@/layout/components/PageHeader'
import { computedEager } from '@vueuse/core'
import { ref, nextTick, provide } from 'vue'

defineOptions({ name: 'AppView' })

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()

// 使用 computedEager 提前计算，减少响应式开销
const footer = computedEager(() => appStore.getFooter)

// 使用 computedEager 优化 KeepAlive 缓存列表
const getCaches = computedEager((): string[] => tagsViewStore.getCachedViews)

// 无感刷新
const routerAlive = ref(true)
const reload = () => {
  routerAlive.value = false
  nextTick(() => (routerAlive.value = true))
}
provide('reload', reload)
</script>

<template>
  <section
    :class="[
      'p-[var(--app-content-padding)] w-full ',
      {
        '!min-h-[calc(100vh-var(--top-tool-height)-var(--tags-view-height)-var(--app-footer-height))] pb-0':
          footer
      }
    ]"
  >
    <PageHeader />
    <router-view v-if="routerAlive">
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
</template>
