import { computedEager, useScroll } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getAccessToken } from '@/utils/auth'

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

  /**
   * 导航到指定路径
   * 如果未登录且目标不是 marketplace，则提示登录
   */
  const navigateTo = async (path: string) => {
    // marketplace 页面无需登录，直接跳转
    if (path === '/marketplace') {
      router.push(path)
      return
    }

    // 检查是否已登录
    const hasToken = getAccessToken()
    if (!hasToken) {
      try {
        await ElMessageBox.confirm('请先登录后再访问', '提示', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 点击确认，跳转到登录页
        router.push('/login')
      } catch {
        // 点击取消，不做任何操作
      }
      return
    }

    // 已登录，正常跳转
    router.push(path)
  }

  const navigateToDetail = (id: string) => router.push(`/marketplace/detail/${id}`)

  return {
    scrollContainerRef,
    scrollY,
    isScrolled,
    navigateTo,
    navigateToDetail
  }
}
