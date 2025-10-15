<template>
  <!-- 顶部导航栏 - 悬浮固定 -->
  <header
    class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-1000 transition-all duration-300"
    :class="{ 'shadow-md': isScrolled }"
    :style="
      backgroundColor
        ? `background: ${backgroundColor}`
        : 'background: linear-gradient(90deg, rgba(236, 238, 245, 0.85) 0%, rgba(243, 246, 255, 0.40) 100%);'
    "
  >
    <div class="w-full px-30px">
      <div class="flex items-center justify-between h-56px">
        <!-- 左侧：Logo + 平台名称 -->
        <div
          class="flex items-center gap-12px cursor-pointer transition-transform duration-300 hover:scale-102"
          @click="handleNavigation('/')"
        >
          <div class="w-36px h-36px bg-#409eff rounded-6px flex items-center justify-center">
            <img
              src="@/assets/imgs/logo.png"
              alt="Logo"
              class="w-full h-full object-contain rounded-6px"
            />
          </div>
          <span class="text-16px font-600 text-#333"> 吴兴区万物智联运营门户 </span>
        </div>

        <!-- 右侧：导航菜单 + 搜索框 + 通知 + 用户 -->
        <div class="flex items-center gap-40px">
          <!-- 导航菜单 -->
          <nav class="flex items-center gap-30px">
            <span
              class="text-14px cursor-pointer transition-all duration-300"
              :class="
                props.activeNavItem === 'workspace'
                  ? 'text-[#1677FF]'
                  : 'text-#666 hover:text-[#1677FF]'
              "
              @click="handleNavigation('/workspace')"
            >
              工作台
            </span>
            <span
              class="text-14px cursor-pointer transition-all duration-300"
              :class="
                props.activeNavItem === 'marketplace'
                  ? 'text-[#1677FF]'
                  : 'text-#666 hover:text-[#1677FF]'
              "
              @click="handleNavigation('/marketplace')"
            >
              智能要素超市
            </span>
          </nav>

          <div class="flex items-center gap-25px">
            <!-- 搜索框 -->
            <el-input
              v-model="searchText"
              placeholder="搜索"
              size="default"
              class="!w-260px"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>

            <!-- 通知图标 -->
            <Message class="custom-hover" color="var(--top-header-text-color)"/>

            <!-- 用户头像 -->
            <el-tooltip
              :content="isUserLoggedIn ? '点击进入个人中心' : '点击登录'"
              placement="bottom"
            >
              <div
                class="flex items-center gap-8px cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                @click="handleUserClick"
              >
                <el-avatar
                  :size="32"
                  :src="userAvatar"
                  class="transition-transform duration-200 hover:scale-105"
                />
                <span
                  class="text-14px transition-colors duration-200"
                  :class="isUserLoggedIn ? 'text-#333' : 'text-[#1677FF] hover:text-[#409EFF]'"
                >
                  {{ userName }}
                </span>
                <!-- 未登录状态下的登录图标 -->
                <el-icon
                  v-if="!isUserLoggedIn"
                  class="text-12px text-[#1677FF] ml-4px"
                >
                  <ArrowRight />
                </el-icon>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { Search, ArrowRight } from '@element-plus/icons-vue'
import { Message } from '@/components/Message'

defineOptions({ name: 'Header' })

// ================== 状态管理 ==================
const userStore = useUserStoreWithOut()

// ================== Props ==================
interface Props {
  isScrolled?: boolean
  backgroundColor?: string
  activeNavItem?: string
  userInfo?: {
    avatar?: string
    nickname?: string
    username?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  isScrolled: false,
  backgroundColor: '',
  activeNavItem: '',
  userInfo: () => ({})
})

// ================== Emits ==================
interface Emits {
  (e: 'navigation', path: string): void
}

const emit = defineEmits<Emits>()

// ================== 响应式数据 ==================
const searchText = ref('')

// ================== 计算属性 ==================
const isUserLoggedIn = computed(() => userStore.getIsSetUser)

const userAvatar = computed(() => {
  if (isUserLoggedIn.value && props.userInfo?.avatar) {
    return props.userInfo.avatar
  }
  return '@/assets/imgs/logo.png'
})

const userName = computed(() => {
  if (isUserLoggedIn.value) {
    return props.userInfo?.nickname || props.userInfo?.username || '用户'
  }
  return '点击登录'
})

// ================== 方法 ==================
const handleNavigation = (path: string) => {
  emit('navigation', path)
}

const handleUserClick = () => {
  if (isUserLoggedIn.value) {
    // 已登录，可以跳转到用户中心或个人设置
    handleNavigation('/profile')
  } else {
    // 未登录，跳转到登录页面
    handleNavigation('/login')
  }
}

// 搜索功能
const handleSearch = () => {
  if (searchText.value.trim()) {
    // 可以在这里实现搜索逻辑
    console.log('搜索:', searchText.value)
    // 可以跳转到搜索结果页面
    // handleNavigation(`/search?q=${encodeURIComponent(searchText.value)}`)
  }
}
</script>
