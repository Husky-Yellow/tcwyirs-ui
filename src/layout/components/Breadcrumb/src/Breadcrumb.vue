<script lang="tsx">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ref, watch, computed, unref, defineComponent, TransitionGroup, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { filterBreadcrumb } from './helper'
import { filter, treeToList } from '@/utils/tree'
import type { RouteLocationNormalizedLoaded, RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { computedEager, useMemoize } from '@vueuse/core'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('breadcrumb')
const appStore = useAppStore()

// 使用 computedEager 提前计算面包屑图标配置
const breadcrumbIcon = computedEager(() => appStore.getBreadcrumbIcon)

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const { currentRoute } = useRouter()
    const levelList = shallowRef<AppRouteRecordRaw[]>([])
    const permissionStore = usePermissionStore()

    const menuRouters = computedEager(() => {
      const routers = permissionStore.getRouters
      return filterBreadcrumb(routers)
    })

    // 使用 useMemoize 缓存路由过滤结果
    const memoizedFilter = useMemoize((path: string) => {
      return filter<AppRouteRecordRaw>(unref(menuRouters), (node: AppRouteRecordRaw) => {
        return node.path === path
      })
    })

    const getBreadcrumb = () => {
      const currentPath = currentRoute.value.matched.slice(-1)[0].path
      levelList.value = memoizedFilter(currentPath)
    }

    // 使用 computed 缓存 breadcrumbList，避免每次渲染都计算
    const breadcrumbList = computed(() => treeToList<AppRouteRecordRaw[]>(unref(levelList)))

    const renderBreadcrumb = () => {
      return breadcrumbList.value.map((v) => {
        const disabled = !v.redirect || v.redirect === 'noredirect'
        const meta = v.meta as RouteMeta
        return (
          <ElBreadcrumbItem to={{ path: disabled ? '' : v.path }} key={v.name}>
            {meta?.icon && breadcrumbIcon.value ? (
              <div class="flex items-center">
                <Icon icon={meta.icon} class="mr-[2px]" svgClass="inline-block" />
                {v?.meta?.title}
              </div>
            ) : (
              v?.meta?.title
            )}
          </ElBreadcrumbItem>
        )
      })
    }

    watch(
      () => currentRoute.value,
      (route: RouteLocationNormalizedLoaded) => {
        if (route.path.startsWith('/redirect/')) {
          return
        }
        getBreadcrumb()
      },
      {
        immediate: true
      }
    )

    return () => (
      <ElBreadcrumb separator="/" class={`${prefixCls} flex items-center h-full ml-[10px]`}>
        <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
          {renderBreadcrumb()}
        </TransitionGroup>
      </ElBreadcrumb>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$elNamespace}-breadcrumb;

.#{$prefix-cls} {
  :deep(.#{$prefix-cls}__item) {
    display: flex;
    .#{$prefix-cls}__inner {
      display: flex;
      align-items: center;
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.#{$prefix-cls}__item):not(:last-child) {
    .#{$prefix-cls}__inner {
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.#{$prefix-cls}__item):last-child {
    .#{$prefix-cls}__inner {
      display: flex;
      align-items: center;
      color: var(--el-text-color-placeholder);

      &:hover {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
