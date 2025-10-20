import { unref, type ComputedRef, type Ref } from 'vue'
import { isUrl } from '@/utils/is'
import { pathResolve } from '@/utils/routerHelper'
import { hasOneShowingChild } from '../helper'
import MenuItemRecursive from '../components/MenuItemRecursive'
import CollapsedMenuItem from '../components/CollapsedMenuItem'

interface RenderMenuOptions {
  routers: ComputedRef<AppRouteRecordRaw[]>
  activeMenu: ComputedRef<string>
  expandedMenus: Ref<Set<string>>
  collapse: ComputedRef<boolean>
  handleMenuClick: (path: string) => void
  toggleExpand: (path: string) => void
}

export const useMenuRenderer = (options: RenderMenuOptions) => {
  const { routers, activeMenu, expandedMenus, collapse, handleMenuClick, toggleExpand } = options

  const renderCollapsedMenu = () => {
    const allSecondLevelItems: JSX.Element[] = []

    unref(routers).forEach((firstLevel) => {
      if (firstLevel.children && !firstLevel.meta?.hidden) {
        const parentPath = isUrl(firstLevel.path)
          ? firstLevel.path
          : pathResolve('/', firstLevel.path)

        firstLevel.children
          .filter((secondLevel) => !secondLevel.meta?.hidden)
          .forEach((secondLevel) => {
            const { meta = {} } = secondLevel
            const { title, icon } = meta
            const { oneShowingChild, onlyOneChild } = hasOneShowingChild(
              secondLevel.children,
              secondLevel
            )
            const fullPath = isUrl(secondLevel.path)
              ? secondLevel.path
              : pathResolve(parentPath, secondLevel.path)
            const finalPath =
              oneShowingChild &&
              onlyOneChild &&
              (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
              !meta?.alwaysShow
                ? pathResolve(fullPath, onlyOneChild.path)
                : fullPath
            const isActive = unref(activeMenu) === finalPath
            const hasChildren =
              secondLevel.children && secondLevel.children.length > 0 && !oneShowingChild

            allSecondLevelItems.push(
              <CollapsedMenuItem
                key={finalPath}
                path={finalPath}
                title={title as string}
                icon={icon}
                isActive={isActive}
                hasChildren={hasChildren}
                onClick={hasChildren ? undefined : handleMenuClick}
              />
            )
          })
      }
    })

    return allSecondLevelItems
  }

  const renderMenuItems = (routes: AppRouteRecordRaw[], level = 1, parentPath = '/'): JSX.Element[] => {
    const isCollapsed = unref(collapse)

    // 折叠状态下使用专门的渲染函数
    if (isCollapsed && level === 1) {
      return renderCollapsedMenu()
    }

    return routes
      .filter((route) => !route.meta?.hidden)
      .map((route) => {
        const { meta = {}, children } = route
        const { title, icon } = meta
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(children, route)
        const fullPath = isUrl(route.path) ? route.path : pathResolve(parentPath, route.path)

        // 如果只有一个子项且符合条件，直接渲染该子项
        if (
          oneShowingChild &&
          onlyOneChild &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !meta?.alwaysShow
        ) {
          const childPath = pathResolve(fullPath, onlyOneChild.path)
          const isActive = unref(activeMenu) === childPath
          const itemIcon = (onlyOneChild.meta?.icon || icon) as string
          const itemTitle = (onlyOneChild.meta?.title || title) as string

          return (
            <MenuItemRecursive
              key={childPath}
              path={childPath}
              title={itemTitle}
              icon={itemIcon}
              level={level}
              isActive={isActive}
              hasChildren={false}
              onClick={handleMenuClick}
            />
          )
        }

        const isActive = unref(activeMenu) === fullPath
        const hasChildren = children && children.length > 0
        const isExpanded = expandedMenus.value.has(fullPath)

        // 统一使用 MenuItemRecursive 处理所有情况
        return (
          <MenuItemRecursive
            key={fullPath}
            path={fullPath}
            title={title as string}
            icon={icon}
            level={level}
            isActive={isActive}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onClick={handleMenuClick}
            onToggle={toggleExpand}
          >
            {hasChildren && renderMenuItems(children, level + 1, fullPath)}
          </MenuItemRecursive>
        )
      })
      .filter(Boolean) as JSX.Element[]
  }

  return {
    renderMenuItems
  }
}
