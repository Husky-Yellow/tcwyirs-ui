import { defineComponent, type PropType } from 'vue'

export interface NavItem {
  key: string
  label: string
  path: string
}

interface Props {
  items: readonly NavItem[]
  activeKey?: string
  onNavigate?: (path: string) => void
}

export default defineComponent({
  name: 'HeaderNav',
  props: {
    items: {
      type: Array as PropType<readonly NavItem[]>,
      required: true
    },
    activeKey: {
      type: String,
      default: ''
    },
    onNavigate: {
      type: Function as PropType<(path: string) => void>,
      default: undefined
    }
  },
  setup(props: Props) {
    const handleClick = (path: string) => {
      props.onNavigate?.(path)
    }

    return () => (
      <nav class="flex items-center gap-30px">
        {props.items.map(item => (
          <span
            key={item.key}
            class={[
              'text-14px cursor-pointer transition-all duration-300',
              props.activeKey === item.key ? 'text-[#1677FF]' : 'text-#666 hover:text-[#1677FF]'
            ]}
            onClick={() => handleClick(item.path)}
          >
            {item.label}
          </span>
        ))}
      </nav>
    )
  }
})
