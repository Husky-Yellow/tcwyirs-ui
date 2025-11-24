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
        class="flex cursor-pointer items-center gap-12px transition-transform duration-300 hover:scale-102"
        onClick={props.onClick}
      >
        <div class="h-36px w-36px flex items-center justify-center rounded-6px bg-#409eff">
          <img src={props.logoUrl} alt="Logo" class="h-full w-full rounded-6px object-contain" />
        </div>
        <span class="text-16px text-#333 font-600">{props.title}</span>
      </div>
    )
  }
})

