<template>
  <footer class="bg-[#181D23] py-60px text-white">
    <div class="mx-auto max-w-1160px">
      <div class="grid grid-cols-[240px_1fr_1fr] gap-80px">
        <!-- 左侧信息 -->
        <div class="w-[240px]">
          <div class="mb-16px flex items-center gap-8px">
            <div class="h-20px w-20px flex items-center justify-center rounded-4px">
              <span class="text-12px text-white font-bold">M</span>
            </div>
            <h3 class="text-[16px] text-white font-normal font-['PingFang_SC']">
              {{ FOOTER_INFO.title }}
            </h3>
          </div>
          <p class="text-[14px] text-white/60 font-normal leading-[20px] font-['PingFang_SC']">
            {{ FOOTER_INFO.description }}
          </p>
        </div>

        <!-- 产品服务 -->
        <div class="w-[400px]">
          <h4 class="mb-16px text-[16px] text-white font-normal font-['PingFang_SC']">
            产品服务
          </h4>
          <ul class="list-none space-y-16px">
            <li
              v-for="service in productServices"
              :key="service.name"
              class="cursor-pointer text-[14px] text-white/60 font-normal font-['PingFang_SC'] transition-colors hover:text-white"
              @click="hasValidPath(service.path) && handleNavigation(service.path)"
            >
              {{ service.name }}
            </li>
          </ul>
        </div>

        <!-- 服务支持 -->
        <div class="w-[400px]">
          <h4 class="mb-16px text-[16px] text-white font-normal font-['PingFang_SC']">
            服务支持
          </h4>
          <ul class="list-none space-y-16px">
            <li
              v-for="service in supportServices"
              :key="service.name"
              class="cursor-pointer text-[14px] text-white/60 font-normal font-['PingFang_SC'] transition-colors hover:text-white"
              @click="hasValidPath(service.path) && handleNavigation(service.path)"
            >
              {{ service.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Service {
  name: string
  path: string | null
}

interface Props {
  socialLinks?: any[]
}

withDefaults(defineProps<Props>(), {
  socialLinks: () => []
})

const emit = defineEmits<{
  navigation: [path: string]
}>()

const FOOTER_INFO = {
  title: import.meta.env.VITE_APP_TITLE,
  description: '领先的万物智联运营门户平台，提供全方位数据资源服务'
} as const

const productServices: Service[] = [
  { name: '智能要素超市', path: '/marketplace' },
  { name: '研发中台', path: null },
  { name: '生态合作', path: null },
  { name: '解决方案中心', path: null }
]

const supportServices: Service[] = [
  { name: '文档中心', path: null },
  { name: 'API 文档', path: null },
  { name: '服务协议', path: null },
  { name: '技术支持', path: null }
]

const hasValidPath = (path: string | null): path is string => Boolean(path)

const handleNavigation = (path: string) => {
  emit('navigation', path)
}
</script>

