import { defineComponent, type PropType } from 'vue'
import { ArrowRight, User, SwitchButton } from '@element-plus/icons-vue'
import {
  ElTooltip,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
  ElIcon
} from 'element-plus'

interface Props {
  isLoggedIn: boolean
  userName: string
  userAvatar: string
  onLogin?: () => void
  onLogout?: () => void
  onProfile?: () => void
}

export default defineComponent({
  name: 'HeaderUser',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String,
      required: true
    },
    onLogin: {
      type: Function as PropType<() => void>,
      default: undefined
    },
    onLogout: {
      type: Function as PropType<() => void>,
      default: undefined
    },
    onProfile: {
      type: Function as PropType<() => void>,
      default: undefined
    }
  },
  setup(props: Props) {
    const handleCommand = (command: string) => {
      if (command === 'profile') {
        props.onProfile?.()
      } else if (command === 'logout') {
        props.onLogout?.()
      }
    }

    return () => (
      <>
        {!props.isLoggedIn ? (
          <ElTooltip content="点击登录" placement="bottom">
            <div
              class="flex cursor-pointer items-center gap-8px whitespace-nowrap transition-opacity hover:opacity-80"
              onClick={props.onLogin}
            >
              <ElAvatar
                size={32}
                src={props.userAvatar}
                class="transition-transform duration-200 hover:scale-105"
              />
              <span class="text-14px transition-colors duration-200 hover:text-[#409EFF]">
                {props.userName}
              </span>
            </div>
          </ElTooltip>
        ) : (
          <ElDropdown trigger="click" onCommand={handleCommand}>
            {{
              default: () => (
                <div class="flex cursor-pointer items-center gap-8px whitespace-nowrap transition-opacity hover:opacity-80">
                  <ElAvatar
                    size={32}
                    src={props.userAvatar}
                    class="transition-transform duration-200 hover:scale-105"
                  />
                  <span class="text-14px text-#333">{props.userName}</span>
                  <ElIcon class="text-12px text-#666">
                    <ArrowRight />
                  </ElIcon>
                </div>
              ),
              dropdown: () => (
                <ElDropdownMenu>
                  <ElDropdownItem command="profile">
                    <ElIcon>
                      <User />
                    </ElIcon>
                    <span>个人信息</span>
                  </ElDropdownItem>
                  <ElDropdownItem command="logout" divided>
                    <ElIcon>
                      <SwitchButton />
                    </ElIcon>
                    <span>退出登录</span>
                  </ElDropdownItem>
                </ElDropdownMenu>
              )
            }}
          </ElDropdown>
        )}
      </>
    )
  }
})
