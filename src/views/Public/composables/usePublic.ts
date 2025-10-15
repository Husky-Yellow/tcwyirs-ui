import { computedEager, useScroll, useBreakpoints, breakpointsTailwind, useLocalStorage, useDebounceFn } from '@vueuse/core'
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Public 页面通用 Composable
 * 统一管理滚动状态和导航
 */
export const usePublic = () => {
  // ================== 滚动状态 ==================
  const scrollContainerRef = ref<HTMLElement>()

  const { y: scrollY, isScrolling, arrivedState } = useScroll(scrollContainerRef, {
    behavior: 'smooth',
    throttle: 16
  })

  const isScrolled = computedEager(() => scrollY.value > 100)
  const isAtTop = computedEager(() => arrivedState.top)
  const isAtBottom = computedEager(() => arrivedState.bottom)

  // ================== 响应式断点 ==================
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')
  const isTablet = breakpoints.between('sm', 'lg')
  const isDesktop = breakpoints.greater('lg')

  // ================== 导航 ==================
  const router = useRouter()

  const navigateTo = (path: string) => router.push(path)
  const navigateToDetail = (id: string) => router.push(`/marketplace/detail/${id}`)

  // ================== 用户偏好 ==================
  const userPreferences = useLocalStorage('public-page-preferences', {
    scrollBehavior: 'smooth' as 'smooth' | 'auto',
    showScrollIndicator: true,
    autoScrollToTop: false
  })

  // ================== 防抖滚动处理 ==================
  const debouncedScrollHandler = useDebounceFn(() => {
    // 滚动处理逻辑
    if (userPreferences.value.autoScrollToTop && isAtTop.value) {
      console.log('Reached top of page')
    }
  }, 100)

  // 监听滚动变化
  watchEffect(() => {
    if (isScrolling.value) {
      debouncedScrollHandler()
    }
  })

  // ================== 生命周期 ==================
  onMounted(() => {
    console.log('Public composable mounted')
  })

  onUnmounted(() => {
    console.log('Public composable unmounted')
  })

  return {
    // 滚动
    scrollContainerRef,
    scrollY,
    isScrolled,
    isAtTop,
    isAtBottom,
    isScrolling,
    // 断点
    isMobile,
    isTablet,
    isDesktop,
    // 导航
    navigateTo,
    navigateToDetail,
    // 用户偏好
    userPreferences
  }
}
