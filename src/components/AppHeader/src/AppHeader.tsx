import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStoreWithOut } from '@/store/modules/user'
import { Message } from '@/components/Message'
import RouterSearch from '@/components/RouterSearch/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import HeaderLogo from './components/HeaderLogo'
import HeaderNav from './components/HeaderNav'
import HeaderUser from './components/HeaderUser'

interface Props {
  isScrolled?: boolean
  customStyle?: Record<string, any>
}

// 导航项配置
const NAV_ITEMS = [
  { key: '', label: '工作台', path: '/dashboard/index' },
  { key: 'marketplace', label: '智能要素超市', path: '/marketplace' }
] as const

export default defineComponent({
  name: 'AppHeader',
  props: {
    isScrolled: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: Props) {
    const router = useRouter()
    const userStore = useUserStoreWithOut()

    // 计算属性
    const activeNavItem = computed(() =>
      router.currentRoute.value.path.includes('/marketplace') ? 'marketplace' : ''
    )

    const isUserLoggedIn = computed(() => userStore.getIsSetUser)

    const userAvatar = computed(() =>
      isUserLoggedIn.value && userStore.user?.avatar ? userStore.user.avatar : '@/assets/imgs/logo.png'
    )

    const userName = computed(() =>
      isUserLoggedIn.value ? userStore.user?.nickname || '用户' : '点击登录'
    )

    // 事件处理
    const handleLogoClick = () => {
      router.push('/public/homepage')
    }

    const handleNavigation = (path: string) => {
      router.push(path)
    }

    const handleLogin = () => {
      router.push('/login')
    }

    const handleProfile = () => {
      router.push('/user/profile')
    }

    async function handleLogout() {
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await userStore.loginOut()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出登录失败:', error)
        }
      }
    }

    return () => (
      <header
        class={[
          'fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-1000 transition-all duration-300',
          { 'shadow-md': props.isScrolled }
        ]}
        style={props.customStyle}
      >
        <div class="w-full px-30px">
          <div class="flex items-center justify-between h-56px">
            <HeaderLogo onClick={handleLogoClick} />

            <div class="flex items-center gap-40px">
              <HeaderNav
                items={NAV_ITEMS}
                activeKey={activeNavItem.value}
                onNavigate={handleNavigation}
              />

              <div class="flex items-center gap-25px">
                <RouterSearch is-modal={false} is-input={true} />
                <Message class="custom-hover" color="var(--top-header-text-color)" />
                <HeaderUser
                  isLoggedIn={isUserLoggedIn.value}
                  userName={userName.value}
                  userAvatar={userAvatar.value}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onProfile={handleProfile}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
})
