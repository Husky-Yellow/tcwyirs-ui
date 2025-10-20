import { defineComponent, PropType } from 'vue'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'MenuGroup',
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
    onToggle: {
      type: Function as PropType<(path: string) => void>,
      required: true
    }
  },
  setup(props, { slots }) {
    // Level 1 作为分组标题，不可点击
    if (props.level === 1) {
      return () => (
        <div key={props.path} class="mb-0">
          <div class="px-24px py-8px text-12px text-#909399 font-normal mt-16px mb-4px">
            {props.title}
          </div>
          <div class="pl-0">{slots.default?.()}</div>
        </div>
      )
    }

    const getTitleClasses = () => {
      const classes = [
        'flex items-center cursor-pointer transition-all duration-200 ease mx-12px rd-6px',
        props.isActive
          ? 'bg-#e8f4ff text-#409eff'
          : 'text-#606266 hover:bg-#f0f2f5'
      ]

      // Level-specific padding for title (level 2+)
      if (props.level === 2) {
        classes.push('py-8px pl-36px pr-12px my-2px')
      } else {
        const indent = 36 + (props.level - 2) * 16
        classes.push(`py-8px pr-12px my-2px pl-${indent}px`)
      }

      return classes
    }

    return () => (
      <div key={props.path} class="mb-0">
        <div
          class={getTitleClasses()}
          onClick={() => {
            if (props.level >= 2) {
              props.onToggle(props.path)
            }
          }}
        >
          {/* 二级及以上菜单显示图标 */}
          {props.level >= 2 && props.icon && (
            <Icon
              icon={props.icon}
              class={['mr-8px text-18px', props.isActive ? 'text-#409eff' : 'text-#909399']}
            ></Icon>
          )}
          <span class="text-14px font-normal flex-1">
            {props.title}
          </span>
          {/* 二级及以上菜单显示展开图标 */}
          {props.level >= 2 && (
            <Icon
              icon={props.isExpanded ? 'ep:arrow-down' : 'ep:arrow-right'}
              class={['text-12px transition-transform duration-200', props.isActive ? 'text-#409eff' : 'text-#909399']}
            />
          )}
        </div>
        {/* 一级菜单的子菜单始终显示，二级及更深层级菜单根据展开状态显示 */}
        {(props.level === 1 || props.isExpanded) && (
          <div class="pl-0">{slots.default?.()}</div>
        )}
      </div>
    )
  }
})
