<template>
  <div :class="prefixCls" class="min-h-screen relative">
    <!-- 左侧插图区域 -->
    <Transition appear enter-active-class="animate__fadeInLeft">
      <div
        v-if="showIllustration"
        :class="`${prefixCls}__illustration`"
        class="absolute left-[12.5%] top-1/2 -translate-y-1/2"
      >
        <img
          alt="login illustration"
          class="w-full max-w-[480px]"
          src="@/assets/imgs/bg/login/login_bg_icon.png"
        />
      </div>
    </Transition>

    <!-- 右侧登录表单卡片 -->
    <Transition appear enter-active-class="animate__fadeInRight">
      <div
        :class="`${prefixCls}__card`"
        class="absolute right-[3.61%] top-1/2 -translate-y-1/2 w-full max-w-[480px]"
      >
        <LoginForm :is-mobile="isMobile" class="w-full" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTitle, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useDesign } from '@/hooks/web/useDesign'
import { LoginForm } from './components'

defineOptions({ name: 'Login' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
const showIllustration = breakpoints.greater('lg')

const appTitle = computed(() => 'TCWYIRS 系统')

useTitle(() => `登录 - ${appTitle.value}`)
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  background-image: url('@/assets/imgs/bg/login/login_bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &__illustration {
    img {
      filter: drop-shadow(0 20px 60px rgba(100, 150, 255, 0.3));
    }
  }

  &__card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow:
      0 20px 80px rgba(100, 150, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
  }

  @media (max-width: 1024px) {
    .login-container {
      flex-direction: column;
      gap: 40px;
    }

    &__illustration {
      max-width: 400px;
    }
  }
}
</style>
