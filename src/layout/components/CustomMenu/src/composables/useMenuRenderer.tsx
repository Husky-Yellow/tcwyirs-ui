import { unref, type ComputedRef, type Ref, type VNode } from 'vue'
import { isUrl } from '@/utils/is'
import { pathResolve } from '@/utils/routerHelper'
import { hasOneShowingChild } from '../helper'
import MenuItemRecursive from '../components/MenuItemRecursive'
import CollapsedMenuItemWithSubmenu from '../components/CollapsedMenuItemWithSubmenu'

interface RenderMenuOptions {
  routers: ComputedRef<AppRouteRecordRaw[]>
  activeMenu: ComputedRef<string>
  expandedMenus: Ref<Set<string>>
  collapse: ComputedRef<boolean>
  handleMenuClick: (path: string) => void
  toggleExpand: (path: string) => void
}

interface SubMenuItem {
  path: string
  title: string
  icon?: string
  isActive: boolean
  children?: SubMenuItem[]
}

type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean }

const shouldUseOnlyChild = (
  oneShowingChild: boolean,
  onlyOneChild: OnlyOneChildType | undefined,
  meta?: AppRouteRecordRaw['meta']
): boolean => {
  return !!(
    oneShowingChild &&
    onlyOneChild &&
    (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
    !meta?.alwaysShow
  )
}

export const useMenuRenderer = (options: RenderMenuOptions) => {
  const { routers, activeMenu, expandedMenus, collapse, handleMenuClick, toggleExpand } = options

  const buildNestedChildren = (
    children: AppRouteRecordRaw[] | undefined,
    parentPath: string
  ): SubMenuItem[] => {
    if (!children || children.length === 0) return []

    return children
      .filter((child) => !child.meta?.hidden)
      .map((child) => {
        const childMeta = child.meta || {}
        const childFullPath = isUrl(child.path) ? child.path : pathResolve(parentPath, child.path)
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(child.children, child)

        if (shouldUseOnlyChild(oneShowingChild, onlyOneChild, childMeta)) {
          const onlyChildPath = pathResolve(childFullPath, onlyOneChild!.path)
          const onlyChildMeta = onlyOneChild!.meta || {}

          return {
            path: onlyChildPath,
            title: (onlyChildMeta.title || childMeta.title) as string,
            icon: (onlyChildMeta.icon || childMeta.icon) as string,
            isActive: unref(activeMenu) === onlyChildPath
          }
        }

        const menuItem: SubMenuItem = {
          path: childFullPath,
          title: childMeta.title as string,
          icon: childMeta.icon as string,
          isActive: unref(activeMenu) === childFullPath
        }

        if (child.children && child.children.length > 0) {
          const nestedChildren = buildNestedChildren(child.children, childFullPath)
          if (nestedChildren.length > 0) {
            menuItem.children = nestedChildren
          }
        }

        return menuItem
      })
  }

  const renderCollapsedMenu = () => {
    const allSecondLevelItems: VNode[] = []

    unref(routers).forEach((firstLevel) => {
      if (!firstLevel.children || firstLevel.meta?.hidden) return

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

          const finalPath = shouldUseOnlyChild(oneShowingChild, onlyOneChild, meta)
            ? pathResolve(fullPath, onlyOneChild!.path)
            : fullPath

          const isActive = unref(activeMenu) === finalPath
          const hasChildren =
            secondLevel.children && secondLevel.children.length > 0 && !oneShowingChild
          const children: SubMenuItem[] =
            hasChildren && secondLevel.children
              ? buildNestedChildren(secondLevel.children, fullPath)
              : []

          allSecondLevelItems.push(
            <CollapsedMenuItemWithSubmenu
              key={finalPath}
              path={finalPath}
              title={title as string}
              icon={(icon as string) || ''}
              isActive={isActive}
              hasChildren={hasChildren}
              children={children}
              onClick={handleMenuClick}
            />
          )
        })
    })

    return allSecondLevelItems
  }

  const renderMenuItems = (routes: AppRouteRecordRaw[], level = 1, parentPath = '/'): VNode[] => {
    if (unref(collapse) && level === 1) {
      return renderCollapsedMenu()
    }

    return routes
      .filter((route) => !route.meta?.hidden)
      .map((route) => {
        const { meta = {}, children } = route
        const { title, icon } = meta
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(children, route)
        const fullPath = isUrl(route.path) ? route.path : pathResolve(parentPath, route.path)

        if (shouldUseOnlyChild(oneShowingChild, onlyOneChild, meta)) {
          const childPath = pathResolve(fullPath, onlyOneChild!.path)
          const isActive = unref(activeMenu) === childPath
          const itemIcon = (onlyOneChild!.meta?.icon || icon) as string
          const itemTitle = (onlyOneChild!.meta?.title || title) as string

          return (
            <MenuItemRecursive
              key={childPath}
              path={childPath}
              title={itemTitle}
              icon={itemIcon || ''}
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

        return (
          <MenuItemRecursive
            key={fullPath}
            path={fullPath}
            title={title as string}
            icon={(icon as string) || ''}
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
      .filter(Boolean) as VNode[]
  }

  return { renderMenuItems }
}
