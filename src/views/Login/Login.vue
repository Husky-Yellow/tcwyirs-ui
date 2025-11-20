<template>
  <div class="login-container min-h-screen relative bg-cover bg-center bg-no-repeat">
    <!-- 左侧插图区域 -->
    <Transition appear enter-active-class="animate__fadeInLeft">
      <div
        v-if="showIllustration"
        class="absolute left-[12.5%] top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <img
          alt="login illustration"
          class="w-full max-w-[480px] drop-shadow-[0_20px_60px_rgba(100,150,255,0.3)]"
          src="@/assets/imgs/bg/login/login_bg_icon.png"
        />
      </div>
    </Transition>

    <!-- 右侧登录表单卡片 -->
    <Transition appear enter-active-class="animate__fadeInRight">
      <div
        class="absolute right-[3.61%] top-1/2 -translate-y-1/2 w-full max-w-[480px] bg-white/95 rounded-24px p-48px shadow-[0_20px_80px_rgba(100,150,255,0.15),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-10px sm:right-[5%] sm:max-w-[400px] sm:p-32px md:right-[3.61%] md:max-w-[450px] md:p-40px lg:right-[3.61%] lg:max-w-[480px] lg:p-48px xl:right-[3.61%] xl:max-w-[480px] xl:p-48px max-sm:right-[4%] max-sm:left-[4%] max-sm:max-w-none max-sm:p-24px"
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
