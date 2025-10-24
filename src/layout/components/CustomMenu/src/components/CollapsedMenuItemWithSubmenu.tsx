import { defineComponent, PropType, ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@/components/Icon'

interface SubMenuItem {
  path: string
  title: string
  icon?: string
  isActive: boolean
  children?: SubMenuItem[]
}

const MENU_WIDTH = 64
const HOVER_DELAY = 150
const BASE_INDENT = 16
const INDENT_INCREMENT = 16

export default defineComponent({
  name: 'CollapsedMenuItemWithSubmenu',
  props: {
    path: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
    children: { type: Array as PropType<SubMenuItem[]>, default: () => [] },
    onClick: { type: Function as PropType<(path: string) => void>, default: undefined }
  },
  setup(props) {
    const isHovering = ref(false)
    const menuItemRef = ref<HTMLElement>()
    const submenuPosition = ref({ top: 0, left: MENU_WIDTH })
    const expandedItems = ref<Set<string>>(new Set())
    let hoverTimer: NodeJS.Timeout | null = null

    const updateSubmenuPosition = () => {
      if (menuItemRef.value) {
        const rect = menuItemRef.value.getBoundingClientRect()
        submenuPosition.value = { top: rect.top, left: MENU_WIDTH }
      }
    }

    const clearHoverTimer = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }
    }

    const handleMouseEnter = () => {
      clearHoverTimer()
      hoverTimer = setTimeout(() => {
        updateSubmenuPosition()
        isHovering.value = true
      }, HOVER_DELAY)
    }

    const handleMouseLeave = () => {
      clearHoverTimer()
      hoverTimer = setTimeout(() => {
        isHovering.value = false
        expandedItems.value.clear()
      }, HOVER_DELAY)
    }

    const handleClick = () => {
      if (props.onClick && !props.hasChildren) {
        props.onClick(props.path)
      }
    }

    const toggleExpanded = (path: string) => {
      if (expandedItems.value.has(path)) {
        expandedItems.value.delete(path)
      } else {
        expandedItems.value.add(path)
      }
    }

    const handleSubMenuClick = (path: string, hasChildren: boolean) => {
      if (hasChildren) {
        toggleExpanded(path)
      } else if (props.onClick) {
        props.onClick(path)
        isHovering.value = false
        expandedItems.value.clear()
      }
    }

    const handleScroll = () => {
      if (isHovering.value) updateSubmenuPosition()
    }

    onMounted(() => window.addEventListener('scroll', handleScroll, true))
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll, true)
      clearHoverTimer()
    })

    const renderSubMenuItem = (item: SubMenuItem, level = 0): any => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.value.has(item.path)
      const paddingLeft = BASE_INDENT + level * INDENT_INCREMENT

      const itemClasses = [
        'py-10px flex items-center cursor-pointer transition-all duration-200 mx-8px my-2px rd-6px',
        item.isActive ? 'bg-#e8f4ff text-#409eff' : 'text-#606266 hover:bg-#f0f2f5'
      ]

      return (
        <div key={item.path}>
          <div
            class={itemClasses}
            style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '16px' }}
            onClick={() => handleSubMenuClick(item.path, hasChildren || false)}
          >
            {item.icon && (
              <Icon
                icon={item.icon}
                class={['mr-8px text-16px flex-shrink-0', item.isActive ? 'text-#409eff' : 'text-#909399']}
              />
            )}
            <span class={['text-14px font-normal whitespace-nowrap', hasChildren ? 'flex-1' : '']}>
              {item.title}
            </span>
            {hasChildren && (
              <Icon
                icon={isExpanded ? 'ep:arrow-down' : 'ep:arrow-right'}
                class="text-12px text-#909399 ml-8px flex-shrink-0"
              />
            )}
          </div>
          {hasChildren && isExpanded && (
            <div>{item.children!.map((child) => renderSubMenuItem(child, level + 1))}</div>
          )}
        </div>
      )
    }

    const mainItemClasses = [
      'py-10px px-12px flex items-center justify-center cursor-pointer transition-all duration-200 ease mx-8px my-4px rd-6px',
      props.isActive ? 'bg-#e8f4ff' : 'hover:bg-#f0f2f5'
    ]

    return () => (
      <div ref={menuItemRef} class="relative" onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave}>
        <div class={mainItemClasses} onClick={handleClick} title={props.title}>
          {props.icon && (
            <Icon icon={props.icon} class={['m-0 text-20px', props.isActive ? 'text-#409eff' : 'text-#909399']} />
          )}
          {props.hasChildren && (
            <div class="absolute right-2px top-50% transform -translate-y-50%">
              <Icon icon="ep:arrow-right" class="text-10px text-#909399" />
            </div>
          )}
        </div>

        {props.hasChildren && props.children.length > 0 && isHovering.value && (
          <div
            class="fixed bg-white shadow-lg rd-8px py-8px min-w-200px max-w-280px z-2000 border border-#e4e7ed max-h-500px overflow-y-auto"
            style={{ left: `${submenuPosition.value.left}px`, top: `${submenuPosition.value.top}px` }}
            onMouseenter={clearHoverTimer}
            onMouseleave={handleMouseLeave}
          >
            <div class="px-16px py-8px text-12px text-#909399 font-500 border-b border-#e4e7ed mb-4px">
              {props.title}
            </div>
            {props.children.map((child) => renderSubMenuItem(child, 0))}
          </div>
        )}
      </div>
    )
  }
})
