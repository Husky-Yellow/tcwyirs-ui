import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { CustomMenu } from '@/layout/components/CustomMenu'
import { Collapse } from '@/layout/components/Collapse'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import Headers from '@/components/Header/src/Header.vue'
import AppView from './AppView.vue'
import { ElScrollbar } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

const pageLoading = computed(() => appStore.getPageLoading)

// 标签页
const tagsView = computed(() => appStore.getTagsView)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

// 固定头部
const fixedHeader = computed(() => appStore.getFixedHeader)

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 布局
const layout = computed(() => appStore.getLayout)

export const useRenderLayout = () => {
  const renderCustom = () => {
    return (
      <div
        class="h-full w-full bg-cover bg-center bg-no-repeat"
        style="background-image: url('/src/assets/imgs/project_bg.png')"
      >
        {/* ToolHeader 占满屏幕宽度 */}
        <div
          class={[
            'fixed top-0 left-0 w-full z-20',
            {
              'layout-border__bottom': !tagsView.value
            }
          ]}
        >
          <Headers isScrolled={false} backgroundColor="transparent" activeNavItem="" userInfo={{avatar: '', nickname: '', username: ''}} />
        </div>

        <div
          class={[
            'absolute top-[var(--top-tool-height)] left-0 h-[calc(100%-var(--top-tool-height))] layout-border__right',
            { '!fixed z-3000': mobile.value }
          ]}
        >
          <CustomMenu class="h-full"></CustomMenu>
        </div>
        <div
          class={[
            `${prefixCls}-content`,
            'absolute top-[var(--top-tool-height)] h-[calc(100%-var(--top-tool-height))]',
            {
              'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                collapse.value && !mobile.value && !mobile.value,
              'w-[calc(100%-var(--custom-left-menu-max-width))] left-[var(--custom-left-menu-max-width)]':
                !collapse.value && !mobile.value && !mobile.value,
              'fixed !w-full !left-0': mobile.value
            }
          ]}
          style="transition: all var(--transition-time-02);"
        >
          <ElScrollbar
            v-loading={pageLoading.value}
            class={[
              `${prefixCls}-content-scrollbar`,
              {
                '!h-[calc(100%-var(--tags-view-height))] mt-[calc(var(--tags-view-height))]':
                  fixedHeader.value
              }
            ]}
          >
            <div
              class={[
                'h-[var(--tags-view-height)] flex items-center px-4',
                {
                  'fixed top-[var(--top-tool-height)] z-10': fixedHeader.value,
                  'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                    collapse.value && fixedHeader.value && !mobile.value,
                  'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]':
                    !collapse.value && fixedHeader.value && !mobile.value,
                  '!w-full !left-0': mobile.value && fixedHeader.value
                }
              ]}
              style="transition: all var(--transition-time-02);"
            >
              {/* {hamburger.value && layout.value !== 'cutMenu' ? (
                <Collapse class="custom-hover mr-2" color="var(--top-header-text-color)"></Collapse>
              ) : undefined} */}
              {breadcrumb.value ? <Breadcrumb></Breadcrumb> : undefined}
            </div>

            <AppView></AppView>
          </ElScrollbar>
        </div>
      </div>
    )
  }
  return {
    renderCustom
  }
}
