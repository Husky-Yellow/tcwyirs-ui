import { defineComponent, type PropType } from 'vue'

interface Props {
  title?: string
  logoUrl?: string
  onClick?: () => void
}

export default defineComponent({
  name: 'HeaderLogo',
  props: {
    title: {
      type: String,
      default: import.meta.env.VITE_APP_TITLE
    },
    logoUrl: {
      type: String,
      default: '@/assets/imgs/logo.png'
    },
    onClick: {
      type: Function as PropType<() => void>,
      default: undefined
    }
  },
  setup(props: Props) {
    return () => (
      <div
        class="flex items-center gap-12px cursor-pointer transition-transform duration-300 hover:scale-102"
        onClick={props.onClick}
      >
        <div class="w-36px h-36px bg-#409eff rounded-6px flex items-center justify-center">
          <img src={props.logoUrl} alt="Logo" class="w-full h-full object-contain rounded-6px" />
        </div>
        <span class="text-16px font-600 text-#333">{props.title}</span>
      </div>
    )
  }
})

