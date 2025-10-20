import { defineComponent, PropType } from 'vue'
import { Icon } from '@/components/Icon'

export default defineComponent({
  name: 'CollapsedMenuItem',
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
    isActive: {
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
    }
  },
  setup(props) {
    const itemClasses = [
      'py-10px px-12px flex items-center justify-center cursor-pointer transition-all duration-200 ease mx-8px my-4px rd-6px',
      props.isActive
        ? 'bg-#e8f4ff'
        : 'hover:bg-#f0f2f5'
    ]

    const handleClick = () => {
      if (props.onClick && !props.hasChildren) {
        props.onClick(props.path)
      }
    }

    return () => (
      <div
        key={props.path}
        class={props.hasChildren ? 'mb-2px' : ''}
      >
        <div
          class={itemClasses}
          onClick={handleClick}
          title={props.title}
        >
          {props.icon && (
            <Icon
              icon={props.icon}
              class={['m-0 text-20px', props.isActive ? 'text-#409eff' : 'text-#909399']}
            ></Icon>
          )}
        </div>
      </div>
    )
  }
})
