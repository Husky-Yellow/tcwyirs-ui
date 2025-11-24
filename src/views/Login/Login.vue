<template>
  <div class="login-container relative min-h-screen bg-cover bg-center bg-no-repeat">
    <!-- 左侧插图区域 -->
    <Transition appear enter-active-class="animate__fadeInLeft">
      <div
        v-if="showIllustration"
        class="absolute left-[12.5%] top-1/2 hidden lg:block -translate-y-1/2"
      >
        <img
          alt="login illustration"
          class="max-w-[480px] w-full drop-shadow-[0_20px_60px_rgba(100,150,255,0.3)]"
          src="@/assets/imgs/bg/login/login_bg_icon.png"
        />
      </div>
    </Transition>

    <!-- 右侧登录表单卡片 -->
    <Transition appear enter-active-class="animate__fadeInRight">
      <div
        class="absolute right-[3.61%] top-1/2 max-w-[480px] w-full rounded-24px bg-white/95 p-48px shadow-[0_20px_80px_rgba(100,150,255,0.15),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-10px lg:right-[3.61%] max-sm:left-[4%] max-sm:right-[4%] md:right-[3.61%] sm:right-[5%] xl:right-[3.61%] lg:max-w-[480px] max-sm:max-w-none md:max-w-[450px] sm:max-w-[400px] xl:max-w-[480px] -translate-y-1/2 lg:p-48px max-sm:p-24px md:p-40px sm:p-32px xl:p-48px"
      >
        <LoginForm :is-mobile="isMobile" class="w-full" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTitle, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { LoginForm } from './components'

defineOptions({ name: 'Login' })

// 响应式断点检测
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
const showIllustration = breakpoints.greater('lg')

// 页面标题
const appTitle = computed(() => 'TCWYIRS 系统')
useTitle(() => `登录 - ${appTitle.value}`)

// 响应式状态
const isPageLoaded = ref(false)

// 生命周期
onMounted(() => {
  isPageLoaded.value = true
})

onUnmounted(() => {
  isPageLoaded.value = false
})
</script>

<style scoped>
.login-container {
  background-image: url('@/assets/imgs/bg/login/login_bg.png');
}
</style>
