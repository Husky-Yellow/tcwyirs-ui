import { computedEager, useScroll } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Public 页面通用 Composable
 * 统一管理滚动状态和导航
 */
export const usePublic = () => {
  const scrollContainerRef = ref<HTMLElement>()
  const router = useRouter()

  const { y: scrollY } = useScroll(scrollContainerRef, {
    behavior: 'smooth',
    throttle: 16
  })

  const isScrolled = computedEager(() => scrollY.value > 100)

  const navigateTo = (path: string) => router.push(path)
  const navigateToDetail = (id: string) => router.push(`/marketplace/detail/${id}`)

  return {
    scrollContainerRef,
    scrollY,
    isScrolled,
    navigateTo,
    navigateToDetail
  }
}
