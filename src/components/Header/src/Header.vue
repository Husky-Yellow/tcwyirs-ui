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
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>

            <!-- 通知图标 -->
            <Message class="custom-hover" color="var(--top-header-text-color)"/>

            <!-- 用户头像 -->
            <div
              class="flex items-center gap-8px cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              <el-avatar
                :size="32"
                :src="userAvatar"
              />
              <span class="text-14px text-#333">
                {{ userName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Message } from '@/components/Message'
defineOptions({ name: 'Header' })

// Props
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

// Emits
interface Emits {
  (e: 'navigation', path: string): void
}

const emit = defineEmits<Emits>()

// Local state
const searchText = ref('')

// Computed properties for user info
const userAvatar = computed(() => props.userInfo?.avatar || '@/assets/imgs/logo.png')
const userName = computed(() => props.userInfo?.nickname || props.userInfo?.username || '点击登陆')

// Methods
const handleNavigation = (path: string) => {
  emit('navigation', path)
}
</script>
