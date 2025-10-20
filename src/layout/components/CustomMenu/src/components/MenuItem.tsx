import { defineComponent, PropType } from 'vue'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'MenuItem',
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
    onClick: {
      type: Function as PropType<(path: string) => void>,
      required: true
    }
  },
  setup(props) {
    const getItemClasses = () => {
      const classes = [
        'flex items-center cursor-pointer transition-all duration-200 ease mx-12px rd-6px',
        props.isActive
          ? 'bg-#e8f4ff text-#409eff'
          : 'text-#606266 hover:bg-#f0f2f5'
      ]

      // Level-specific padding
      if (props.level === 1) {
        classes.push('py-10px px-12px my-4px')
      } else if (props.level === 2) {
        classes.push('py-8px pl-36px pr-12px my-2px')
      } else if (props.level === 3) {
        classes.push('py-8px pl-52px pr-12px my-2px')
      } else {
        const indent = 36 + (props.level - 2) * 16
        classes.push(`py-8px pr-12px my-2px pl-${indent}px`)
      }

      return classes
    }

    return () => (
      <div
        key={props.path}
        class={getItemClasses()}
        onClick={() => props.onClick(props.path)}
      >
        {props.level >= 2 && props.icon && (
          <Icon
            icon={props.icon}
            class={['mr-8px text-18px', props.isActive ? 'text-#409eff' : 'text-#909399']}
          ></Icon>
        )}
        <span class="text-14px font-normal">
          {props.title}
        </span>
      </div>
    )
  }
})
