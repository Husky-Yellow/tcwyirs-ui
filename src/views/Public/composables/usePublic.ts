import { computedEager, useScroll } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Public 页面通用 Composable
 * 统一管理滚动状态和导航
 */
export const usePublic = () => {
  // ================== 滚动状态 ==================
  const scrollContainerRef = ref<HTMLElement>()

  const { y: scrollY } = useScroll(scrollContainerRef, {
    behavior: 'smooth'
  })

  const isScrolled = computedEager(() => scrollY.value > 100)

  // ================== 导航 ==================
  const router = useRouter()

  const navigateTo = (path: string) => router.push(path)
  const navigateToDetail = (id: string) => router.push(`/marketplace/detail/${id}`)

  return {
    // 滚动
    scrollContainerRef,
    scrollY,
    isScrolled,
    // 导航
    navigateTo,
    navigateToDetail
  }
}
