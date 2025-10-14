<template>
  <div :class="prefixCls" class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="login-shell w-full max-w-[1120px] flex flex-col gap-12 lg:flex-row">
      <Transition appear enter-active-class="animate__fadeInLeft">
        <div
          v-if="showIllustration"
          :class="${prefixCls}__illustration
          class="relative flex-1 overflow-hidden rounded-24px p-14 text-white"
        >
          <div class="flex items-center gap-4 text-white/90">
            <img alt="logo" class="h-60px w-60px" src="@/assets/imgs/logo.png" />
            <span class="text-24px font-semibold tracking-wide">{{ appTitle }}</span>
          </div>

          <div class="relative mt-14 flex flex-col gap-10">
            <img
              alt="login artwork"
              class="h-auto w-[380px] max-w-full self-start drop-shadow-xl"
              src="@/assets/svgs/login-box-bg.svg"
            />
            <div class="space-y-3">
              <p class="text-34px font-semibold leading-tight">安全稳定的数字服务平台</p>
              <p class="max-w-[340px] text-16px text-white/80">
                聚焦企业级业务管理，提供一体化数智解决方案，助力业务高效协同与决策。
              </p>
            </div>
          </div>

          <div class="gradient-glow" />
        </div>
      </Transition>

      <Transition appear enter-active-class="animate__fadeInRight">
        <div :class="${prefixCls}__card" class="mx-auto w-full max-w-[420px]">
          <LoginForm :is-mobile="isMobile" class="w-full" />
        </div>
      </Transition>
    </div>
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

useTitle(() => 登录 - )
</script>

<style lang="scss" scoped>
-cls: #{}-login;

.#{-cls} {
  background:
    radial-gradient(120% 120% at 5% 10%, rgba(73, 140, 255, 0.28), transparent 60%),
    linear-gradient(135deg, #f3f8ff 0%, #e9f1ff 45%, #f9fbff 100%);

  &__illustration {
    position: relative;
    background: linear-gradient(158deg, rgba(48, 120, 255, 0.92), rgba(88, 186, 255, 0.78));
    border: 1px solid rgba(255, 255, 255, 0.24);
    box-shadow: 0 36px 140px rgba(49, 104, 218, 0.38);

    .gradient-glow {
      position: absolute;
      inset: -30% -20% auto auto;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
      filter: blur(0);
      opacity: 0.9;
      pointer-events: none;
    }
  }

  &__card {
    background: #ffffff;
    border-radius: 24px;
    padding: clamp(24px, 6vw, 48px) clamp(20px, 5vw, 48px);
    border: 1px solid rgba(78, 115, 255, 0.12);
    box-shadow: 0 32px 90px rgba(64, 106, 214, 0.14);
  }
}
</style>
