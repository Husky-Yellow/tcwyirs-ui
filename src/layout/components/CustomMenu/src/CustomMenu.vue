<script lang="tsx">
import { ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import { pathResolve } from '@/utils/routerHelper'
import { hasOneShowingChild } from './helper'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('CustomMenu')

export default defineComponent({
  name: 'CustomMenu',
  setup() {
    const { push, currentRoute } = useRouter()
    const permissionStore = usePermissionStore()
    const appStore = useAppStore()
    const { t } = useI18n()
    
    const routers = computed(() => permissionStore.getRouters)
    const expandedMenus = ref<Set<string>>(new Set())
    const collapse = computed(() => appStore.getCollapse)
    
    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const handleMenuClick = (path: string) => {
      if (isUrl(path)) {
        window.open(path)
      } else {
        push(path)
      }
    }

    const toggleExpand = (path: string) => {
      const expanded = expandedMenus.value
      if (expanded.has(path)) {
        expanded.delete(path)
      } else {
        expanded.add(path)
      }
    }

    const renderCollapsedMenu = () => {
      const allSecondLevelItems: JSX.Element[] = []
      
      unref(routers).forEach((firstLevel) => {
        if (firstLevel.children && !firstLevel.meta?.hidden) {
          const parentPath = isUrl(firstLevel.path) ? firstLevel.path : pathResolve('/', firstLevel.path)
          
          firstLevel.children
            .filter((secondLevel) => !secondLevel.meta?.hidden)
            .forEach((secondLevel) => {
              const { meta = {}} = secondLevel
              const { title, icon } = meta
              const { oneShowingChild, onlyOneChild } = hasOneShowingChild(secondLevel.children, secondLevel)
              const fullPath = isUrl(secondLevel.path) ? secondLevel.path : pathResolve(parentPath, secondLevel.path)
              const finalPath = oneShowingChild && onlyOneChild && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !meta?.alwaysShow
                ? pathResolve(fullPath, onlyOneChild.path)
                : fullPath
              const isActive = unref(activeMenu) === finalPath
              const hasChildren = secondLevel.children && secondLevel.children.length > 0 && !oneShowingChild
              
              if (!hasChildren) {
                allSecondLevelItems.push(
                  <div
                    key={finalPath}
                    class={['menu-item', 'menu-item-collapsed', { active: isActive }]}
                    onClick={() => handleMenuClick(finalPath)}
                    title={t(title as string)}
                  >
                    {icon && <Icon icon={icon} class="menu-icon"></Icon>}
                  </div>
                )
              } else {
                allSecondLevelItems.push(
                  <div key={fullPath} class="menu-group-collapsed">
                    <div 
                      class={['menu-title', 'menu-title-collapsed', { active: isActive }]}
                      title={t(title as string)}
                    >
                      {icon && <Icon icon={icon} class="menu-icon"></Icon>}
                    </div>
                  </div>
                )
              }
            })
        }
      })
      
      return allSecondLevelItems
    }

    const renderMenuItems = (routes: AppRouteRecordRaw[], level = 1, parentPath = '/') => {
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
          if (oneShowingChild && onlyOneChild && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !meta?.alwaysShow) {
            const childPath = pathResolve(fullPath, onlyOneChild.path)
            const isActive = unref(activeMenu) === childPath
            return (
              <div
                key={childPath}
                class={['menu-item', `menu-item-level-${level}`, { active: isActive }]}
                onClick={() => handleMenuClick(childPath)}
              >
                {level === 2 && (onlyOneChild.meta?.icon || icon) && <Icon icon={onlyOneChild.meta?.icon || icon} class="menu-icon"></Icon>}
                <span class="item-text">{t((onlyOneChild.meta?.title || title) as string)}</span>
              </div>
            )
          }
          
          const isActive = unref(activeMenu) === fullPath
          const hasChildren = children && children.length > 0
          const isExpanded = expandedMenus.value.has(fullPath)

          // 展开状态下的原有逻辑
          if (hasChildren) {
            return (
              <div key={fullPath} class="menu-group">
                <div 
                  class={['menu-title', `menu-title-level-${level}`, { active: isActive }]}
                  onClick={() => level >= 2 && toggleExpand(fullPath)}
                >
                  {/* 二级菜单显示图标 */}
                  {level === 2 && icon && <Icon icon={icon} class="menu-icon"></Icon>}
                  <span class="title-text">{t(title as string)}</span>
                  {/* 二级菜单显示展开图标 */}
                  {level === 2 && (
                    <i class={['expand-icon', isExpanded ? 'expanded' : '']}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 6L8 9.5L11.5 6H4.5Z"/>
                      </svg>
                    </i>
                  )}
                </div>
                {/* 一级菜单的子菜单(二级菜单)始终显示，二级菜单的子菜单(三级菜单)根据展开状态显示 */}
                {(level === 1 || isExpanded) && (
                  <div class="menu-children">
                    {renderMenuItems(children, level + 1, fullPath)}
                  </div>
                )}
              </div>
            )
          } else {
            return (
              <div
                key={fullPath}
                class={['menu-item', `menu-item-level-${level}`, { active: isActive }]}
                onClick={() => handleMenuClick(fullPath)}
              >
                {/* 二级菜单项显示图标，三级菜单项不显示图标 */}
                {level === 2 && icon && <Icon icon={icon} class="menu-icon"></Icon>}
                <span class="item-text">{t(title as string)}</span>
              </div>
            )
          }
        })
        .filter(Boolean) // 移除 null 值
    }

    return () => (
      <div class={[`${prefixCls} custom-simple-menu`, { collapsed: unref(collapse) }]}>
        <ElScrollbar>
            {renderMenuItems(unref(routers))}
        </ElScrollbar>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
.custom-simple-menu {
  width: 208px;
  height: 100%;
  background: transparent;
  transition: width 0.3s ease;
  
  &.collapsed {
    width: 64px;
    
    .menu-container {
      padding: 16px 8px;
    }
  }
  
  .menu-container {
    padding: 16px 0;
  }

  .menu-group {
    margin-bottom: 0;
  }

  .menu-title {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    .menu-icon {
      margin-right: 8px;
      font-size: 16px;
      color: var(--left-menu-text-color);
    }
    
    .title-text {
      color: var(--left-menu-text-color);
      font-weight: 500;
      flex: 1;
    }

    .expand-icon {
      margin-left: auto;
      transition: transform 0.3s ease;
      color: var(--left-menu-text-color);
      
      &.expanded {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .title-text, .menu-icon, .expand-icon {
        color: var(--left-menu-text-active-color);
      }
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      
      .title-text, .menu-icon, .expand-icon {
        color: #333;
      }
    }
  }

  // 一级菜单标题 - 字体较小
  .menu-title-level-1 {
    .title-text {
      font-size: 13px;
    }
  }

  // 二级菜单标题 - 字体较大，带图标和展开图标
  .menu-title-level-2 {
    .title-text {
      font-size: 15px;
    }
    padding: 8px 20px 8px 40px;
    margin: 0 8px;
    
    &.active {
      margin: 0 8px;
    }
  }

  .menu-children {
    padding-left: 0;
  }

  .menu-item {
    padding: 8px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    .menu-icon {
      margin-right: 8px;
      font-size: 16px;
      color: var(--left-menu-text-color);
    }
    
    .item-text {
      color: var(--left-menu-text-color);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .item-text, .menu-icon {
        color: var(--left-menu-text-active-color);
      }
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      
      .item-text, .menu-icon {
        color: #333;
      }
    }
  }

  // 一级菜单项 - 字体较小
  .menu-item-level-1 {
    .item-text {
      font-size: 13px;
    }
  }

  // 二级菜单项 - 字体较大，带图标
  .menu-item-level-2 {
    .item-text {
      font-size: 15px;
    }
    padding: 8px 20px 8px 40px;
    margin: 0 8px;
    
    &.active {
      margin: 0 8px;
    }
  }

  // 三级菜单项 - 无图标，缩进更多
  .menu-item-level-3 {
    padding: 6px 20px 6px 60px;
    margin: 0 8px;
    .item-text {
      font-size: 14px;
    }
    
    &.active {
      margin: 0 8px;
    }
  }

  // 折叠状态下的样式
  .menu-group-collapsed {
    margin-bottom: 4px;
  }

  .menu-title-collapsed {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 2px 8px;
    
    .menu-icon {
      margin: 0;
      font-size: 18px;
      color: var(--left-menu-text-color);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .menu-icon {
        color: var(--left-menu-text-active-color);
      }
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      
      .menu-icon {
        color: #333;
      }
    }
  }

  .menu-item-collapsed {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 2px 8px;
    
    .menu-icon {
      margin: 0;
      font-size: 18px;
      color: var(--left-menu-text-color);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      
      .menu-icon {
        color: var(--left-menu-text-active-color);
      }
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      
      .menu-icon {
        color: #333;
      }
    }
  }
}
</style>
