import { defineComponent, PropType } from 'vue'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'MenuItemRecursive',
  props: {
    path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    level: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function as PropType<(path: string) => void>,
      default: undefined
    },
    onToggle: {
      type: Function as PropType<(path: string) => void>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    // 获取根据层级动态计算的 padding-left
    const getPaddingLeft = () => {
      if (props.level === 1) return 8
      if (props.level === 2) return 12
      if (props.level === 3) return 32
      return 32 + (props.level - 3) * 16
    }

    // Level 1 且有子项时作为分组标题
    if (props.level === 1 && props.hasChildren) {
      return () => (
        <div key={props.path} class="mb-0">
          <div class="mb-4px mt-16px px-12px py-8px text-12px text-#909399 font-normal">
            {props.title}
          </div>
          <div class="pl-0">{slots.default?.()}</div>
        </div>
      )
    }

    const handleClick = () => {
      if (props.hasChildren && props.onToggle && props.level >= 2) {
        props.onToggle(props.path)
      } else if (props.onClick && !props.hasChildren) {
        props.onClick(props.path)
      }
    }

    // 使用内联样式设置动态 padding-left
    const paddingLeft = getPaddingLeft()
    const itemStyle = props.level >= 2 ? { paddingLeft: `${paddingLeft}px` } : {}

    return () => {
      // 在渲染函数内动态计算 itemClasses，确保响应 props 变化
      const itemClasses = [
        'flex items-center cursor-pointer transition-all duration-200 ease rd-6px',
        props.isActive
          ? (props.level === 2 ? 'bg-white text-#409eff' : 'bg-#979797/80 text-#000/45 rd-8px')
          : (props.level === 2 ? 'text-#606266 hover:bg-#ecf5ff' : 'text-#606266 hover:bg-#f5f7fa')
      ]

      // 动态添加 padding
      if (props.level === 1) {
        itemClasses.push('py-10px my-4px ml-8px mr-8px pl-8px pr-8px')
      } else {
        itemClasses.push('py-8px my-2px ml-8px mr-8px pr-8px')
      }

      return (
        <div key={props.path} class="mb-0">
          <div class={itemClasses} style={itemStyle} onClick={handleClick}>
            {/* 显示图标 */}
            {props.icon && (
              <Icon
                icon={props.icon}
                class={[
                  'mr-8px text-18px',
                  props.isActive && props.level === 2 ? 'text-#409eff' : 'text-#909399'
                ]}
              ></Icon>
            )}
            <span class={['text-14px font-normal', props.hasChildren ? 'flex-1' : '']}>
              {props.title}
            </span>
            {/* 二级及以上可展开菜单显示展开图标 */}
            {props.level >= 2 && props.hasChildren && (
              <Icon
                icon={props.isExpanded ? 'ep:arrow-down' : 'ep:arrow-right'}
                size={12}
                class={['text-12px transition-transform duration-200', 'text-#909399']}
              />
            )}
          </div>
          {/* 渲染子菜单 */}
          {props.hasChildren && (props.level === 1 || props.isExpanded) && (
            <div class="pl-0">{slots.default?.()}</div>
          )}
        </div>
      )
    }
  }
})
