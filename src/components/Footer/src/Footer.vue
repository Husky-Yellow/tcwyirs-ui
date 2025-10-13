<template>
  <!-- 页脚 -->
  <footer class="bg-gradient-to-br from-#2d3748 to-#1a202c text-white py-80px pb-30px relative">

    <div class="max-w-1200px mx-auto px-20px w-full">
      <div class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-50px mb-50px">
        <div>
          <div class="flex items-center mb-20px">
            <img
              src="@/assets/imgs/logo.png"
              alt="TCWYIRS"
              class="w-40px h-40px mr-12px rounded-8px"
            />
            <span
              class="font-700 text-18px bg-gradient-to-r from-#667eea to-#764ba2 bg-clip-text text-transparent"
              >{{ FOOTER_INFO.title }}</span
            >
          </div>
          <p class="text-16px text-#a0aec0 leading-1.6 mb-24px">
            {{ FOOTER_INFO.description }}
          </p>
        </div>

        <!-- 服务区块 -->
        <div
          v-for="section in serviceSections"
          :key="section.title"
          v-memo="[section.services]"
        >
          <h4
            class="text-18px font-700 mb-20px text-#e2e8f0 relative after:content-[''] after:absolute after:bottom--8px after:left-0 after:w-30px after:h-2px after:bg-gradient-to-r after:from-#667eea after:to-#764ba2 after:rounded-1px"
            >{{ section.title }}</h4
          >
          <ul class="list-none p-0">
            <li
              v-for="service in section.services"
              :key="service.name"
              class="text-15px text-#a0aec0 mb-12px cursor-pointer transition-all duration-300 ease py-4px relative hover:text-#e2e8f0 hover:translate-x-8px before:content-[''] before:absolute before:left--16px before:top-50% before:transform before:translate-y--50% before:w-4px before:h-4px before:bg-#667eea before:rounded-50% before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
              @click="hasValidPath(service.path) && handleNavigation(service.path)"
              >{{ service.name }}</li
            >
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

// Types
interface SocialLink {
  name: string
  icon: any
  url: string
}

interface Service {
  name: string
  path: string | null
}

interface ServiceSection {
  title: string
  services: Service[]
}

// Props
interface Props {
  socialLinks?: SocialLink[]
}

withDefaults(defineProps<Props>(), {
  socialLinks: () => []
})

// Emits
const emit = defineEmits<{
  navigation: [path: string]
}>()

// Constants - 使用 readonly 和 markRaw 优化性能
const FOOTER_INFO = readonly({
  title: '泰城万业信息资源共享平台',
  description: '致力于构建数字化生态平台，连接智能要素与创新需求'
})

// Data - 使用 shallowRef 优化大对象性能
const serviceSections = shallowRef<ServiceSection[]>([
  {
    title: '产品服务',
    services: markRaw([
      { name: '智能要素超市', path: '/marketplace' },
      { name: '数字化解决方案', path: null },
      { name: '技术咨询服务', path: null },
      { name: '平台运维支持', path: null }
    ])
  },
  {
    title: '服务支持',
    services: markRaw([
      { name: '帮助中心', path: null },
      { name: '技术支持', path: null },
      { name: '意见反馈', path: null },
      { name: '服务条款', path: null }
    ])
  }
])

// Computed - 使用 computed 缓存计算结果
const hasValidPath = (path: string | null): path is string => Boolean(path)

// Methods - 使用箭头函数和事件委托优化
const handleNavigation = (path: string) => {
  emit('navigation', path)
}
</script>
