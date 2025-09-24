<template>
  <div :class="prefixCls" class="h-full flex">
    <!-- 左侧背景区域 -->
    <div
      v-if="isLargeScreen"
      :class="`${prefixCls}__left`"
      class="flex-1 bg-gray-500/20 p-30px overflow-hidden"
    >
      <div class="flex items-center text-white mb-8">
        <img alt="logo" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
        <span class="text-20px font-bold">{{ appTitle }}</span>
      </div>
      <div class="h-[calc(100%-80px)] flex items-center justify-center">
        <TransitionGroup appear enter-active-class="animate__bounceInLeft" tag="div">
          <img key="1" alt="bg" class="w-350px" src="@/assets/svgs/login-box-bg.svg" />
          <div key="2" class="text-3xl text-white">欢迎使用</div>
          <div key="3" class="mt-5 text-14px text-white">企业级管理系统</div>
        </TransitionGroup>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="flex-1 flex items-center justify-center" :class="isMobile ? 'p-10px' : 'p-30px'">
      <Transition appear enter-active-class="animate__bounceInRight">
        <div class="w-full max-w-500px">
          <LoginForm class="w-full" />
        </div>
      </Transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTitle, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useDesign } from '@/hooks/web/useDesign'
import { LoginForm } from './components'

defineOptions({ name: 'Login' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')

const breakpoints = useBreakpoints(breakpointsTailwind)
const isLargeScreen = breakpoints.greater('xl')
const isMobile = breakpoints.smaller('sm')

const appTitle = computed(() => 'TCWYIRS 系统')

useTitle(() => `登录 - ${appTitle.value}`)
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  &__left {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: url('@/assets/svgs/login-bg.svg') center/cover no-repeat;
    }
  }
}
</style>
