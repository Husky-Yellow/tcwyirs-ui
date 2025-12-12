<script lang="tsx">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { watch, computed, unref, defineComponent, TransitionGroup, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { filterBreadcrumb } from './helper'
import { findPath, treeToList } from '@/utils/tree'
import type { RouteLocationNormalizedLoaded, RouteMeta, RouteRecordNormalized } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { computedEager, useMemoize } from '@vueuse/core'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('breadcrumb')

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const { currentRoute, getRoutes } = useRouter()
    const levelList = shallowRef<AppRouteRecordRaw[]>([])
    const permissionStore = usePermissionStore()

    // 获取接口返回的路由（动态路由）
    const menuRouters = computedEager(() => {
      const routers = permissionStore.getRouters
      return filterBreadcrumb(routers)
    })

    // 获取本地所有路由（静态路由）
    const allLocalRoutes = computedEager(() => {
      const routes = getRoutes()
      return filterBreadcrumb(routes as unknown as AppRouteRecordRaw[])
    })

    // 创建路由路径映射表（用于查找路由配置）
    const routeMap = computedEager(() => {
      const map = new Map<string, AppRouteRecordRaw>()

      // 递归收集所有路由（保持树形结构的同时建立映射）
      const collectRoutes = (routes: AppRouteRecordRaw[]) => {
        routes.forEach(route => {
          if (route.path) {
            // API路由优先，后添加会覆盖
            map.set(route.path, route)
          }
          if (route.children && route.children.length > 0) {
            collectRoutes(route.children)
          }
        })
      }

      // 先添加本地路由
      collectRoutes(unref(allLocalRoutes))
      // 再添加API路由（覆盖同名路由）
      collectRoutes(unref(menuRouters))

      return map
    })

    const getBreadcrumb = () => {
      // 获取当前路由的完整匹配路径（不包含 query 参数）
      const currentPath = currentRoute.value.path.split('?')[0]

      // 使用 route.matched 作为基础，从路由映射表中获取完整配置
      const breadcrumbPath = currentRoute.value.matched
        .filter((route) => route.meta?.title)
        .map((route) => {
          // 尝试从路由映射表中获取完整配置
          const fullRoute = routeMap.value.get(route.path)
          if (fullRoute) {
            // 只保留当前路由信息，不包含 children（避免 treeToList 展开子路由）
            return {
              path: fullRoute.path,
              name: fullRoute.name,
              meta: fullRoute.meta,
              redirect: fullRoute.redirect,
              children: []
            } as AppRouteRecordRaw
          }
          // 如果找不到，使用 matched 中的信息
          return {
            path: route.path,
            name: route.name,
            meta: route.meta,
            redirect: route.redirect,
            children: []
          } as AppRouteRecordRaw
        })

      levelList.value = breadcrumbPath
    }

    // 使用 computed 缓存 breadcrumbList，避免每次渲染都计算
    const breadcrumbList = computed(() => treeToList<AppRouteRecordRaw[]>(unref(levelList)))

    const renderBreadcrumb = () => {
      return breadcrumbList.value.map((v) => {
        const disabled = !v.redirect || v.redirect === 'noredirect'
        const meta = v.meta as RouteMeta
        return (
          <ElBreadcrumbItem to={{ path: disabled ? '' : v.path }} key={v.name} class={`mb-12px`}>
            {meta?.title}
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
      <ElBreadcrumb separator="/" class={`${prefixCls} h-full flex items-center`}>
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

  :deep(.#{$prefix-cls}__item):last-child {
    .#{$prefix-cls}__inner {
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.#{$prefix-cls}__item):not(:last-child) {
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
