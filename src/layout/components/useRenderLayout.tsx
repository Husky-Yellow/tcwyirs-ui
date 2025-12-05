import { computedEager } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { CustomMenu } from '@/layout/components/CustomMenu'
import AppHeader from '@/components/AppHeader/src/AppHeader'
import AppView from './AppView.vue'
import { ElScrollbar } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('layout')
const appStore = useAppStore()

const TRANSITION_STYLE = 'transition: all var(--transition-time-02);'

// 使用 computedEager 提前计算，减少响应式开销
const pageLoading = computedEager(() => appStore.getPageLoading)
const tagsView = computedEager(() => appStore.getTagsView)
const collapse = computedEager(() => appStore.getCollapse)
const fixedHeader = computedEager(() => appStore.getFixedHeader)
const mobile = computedEager(() => appStore.getMobile)

export const useRenderLayout = () => {
  const renderCustom = () => {
    const isMobile = mobile.value
    const isCollapsed = collapse.value
    const isFixedHeader = fixedHeader.value

    // 提取重复的 class 计算
    const menuClasses = [
      'absolute top-[var(--top-tool-height)] left-0 h-[calc(100%-var(--top-tool-height))] layout-border__right',
      { '!fixed z-3000': isMobile }
    ]

    const contentClasses = [
      `${prefixCls}-content`,
      'absolute top-[var(--top-tool-height)] h-[calc(100%-var(--top-tool-height))]',
      {
        'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
          isCollapsed && !isMobile,
        'w-[calc(100%-var(--custom-left-menu-max-width))] left-[var(--custom-left-menu-max-width)]':
          !isCollapsed && !isMobile,
        'fixed !w-full !left-0': isMobile
      }
    ]

    const scrollbarClasses = [
      `${prefixCls}-content-scrollbar`,
      {
        '!h-[calc(100%)] mt-[calc(var(0))]': isFixedHeader
      }
    ]

    return (
      <div class="layout-bg h-full w-full from-[#E7F3FE] to-transparent bg-gradient-to-b">
        <div
          class={['fixed top-0 left-0 w-full z-20', { 'layout-border__bottom': !tagsView.value }]}
        >
          <AppHeader isScrolled={false} customStyle={{ background: 'rgba(255, 255, 255, 0.6)' }} />
        </div>

        <div class={menuClasses}>
          <CustomMenu class="h-full" />
        </div>

        <div class={contentClasses} style={TRANSITION_STYLE}>
          <ElScrollbar v-loading={pageLoading.value} class={scrollbarClasses}>
            <AppView />
          </ElScrollbar>
        </div>
      </div>
    )
  }

  return { renderCustom }
}
