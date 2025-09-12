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
                {level >= 2 && (onlyOneChild.meta?.icon || icon) && <Icon icon={onlyOneChild.meta?.icon || icon} class="menu-icon"></Icon>}
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
                  onClick={() => {
                    if (level >= 2 && hasChildren) {
                      toggleExpand(fullPath)
                    }
                  }}
                >
                  {/* 二级及以上菜单显示图标 */}
                  {level >= 2 && icon && <Icon icon={icon} class="menu-icon"></Icon>}
                  <span class="title-text">{t(title as string)}</span>
                  {/* 二级及以上菜单显示展开图标 */}
                  {level >= 2 && (
                    <i class={['expand-icon', isExpanded ? 'expanded' : '']}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 6L8 9.5L11.5 6H4.5Z"/>
                      </svg>
                    </i>
                  )}
                </div>
                {/* 一级菜单的子菜单(二级菜单)始终显示，二级及更深层级菜单的子菜单根据展开状态显示 */}
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
                {/* 二级及以上菜单项显示图标 */}
                {level >= 2 && icon && <Icon icon={icon} class="menu-icon"></Icon>}
                <span class="item-text">{t(title as string)}</span>
              </div>
            )
          }
        })
        .filter(Boolean) // 移除 null 值
    }

    const toggleCollapse = () => {
      appStore.setCollapse(!unref(collapse))
    }

    return () => (
      <div class={[`${prefixCls} custom-simple-menu`, { collapsed: unref(collapse) }]}>
        <div class="collapse-toggle" onClick={toggleCollapse}> 
          <Icon icon={unref(collapse) ? 'ep:expand' : 'ep:fold'} />
        </div>
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
  position: relative;
  
  &.collapsed {
    width: 64px;
    
    .menu-container {
      padding: 16px 8px;
    }
  }

  .collapse-toggle {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    transition: all 0.3s ease;
    z-index: 10;
    
    &:hover {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .icon {
      font-size: 14px;
      color: #333;
    }
  }

  &.collapsed .collapse-toggle {
    right: 20px;
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
      color: #333;
    }
    
    .title-text {
      color: #333;
      font-weight: normal;
      flex: 1;
    }

    .expand-icon {
      margin-left: auto;
      transition: transform 0.3s ease;
      color: #333;
      
      &.expanded {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background-color: #fff;
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
      color: #333;
    }
    
    .item-text {
      color: #333;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background-color: #fff;
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

  // 三级及更深层级菜单项 - 无图标，缩进递增
  .menu-item-level-3 {
    padding: 8px 20px 8px 60px;
    margin: 0 8px;
    .item-text {
      font-size: 14px;
    }
    
    &.active {
      margin: 0 8px;
    }
  }

  // 四级及更深层级菜单项 - 动态缩进
  @for $level from 4 through 10 {
    .menu-item-level-#{$level} {
      padding: 8px 20px 8px #{40px + ($level - 2) * 20px};
      margin: 0 8px;
      .item-text {
        font-size: 14px;
      }
      
      &.active {
        margin: 0 8px;
      }
    }
  }

  // 三级及更深层级菜单标题
  @for $level from 3 through 10 {
    .menu-title-level-#{$level} {
      padding: 8px 20px 8px #{40px + ($level - 2) * 20px};
      margin: 0 8px;
      .title-text {
        font-size: 14px;
      }
      
      &.active {
        margin: 0 8px;
      }
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
      color: #333;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background-color: #fff;
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
      color: #333;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    &.active {
      background-color: #fff;
      border-radius: 8px;
      
      .menu-icon {
        color: #333;
      }
    }
  }

  // 自定义滚动条样式
  :deep(.el-scrollbar__bar) {
    &.is-vertical {
      right: 2px;
      width: 6px;
      
      .el-scrollbar__thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
  
  :deep(.el-scrollbar__view) {
    padding: 0 0 16px 0;
  }
}
</style>
