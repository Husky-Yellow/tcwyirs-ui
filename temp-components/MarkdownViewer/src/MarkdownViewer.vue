<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { MenuItem } from './types'

defineOptions({ name: 'MarkdownViewer' })

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  defaultActiveKey: propTypes.string.def(''),
  menuWidth: propTypes.string.def('260px'),
  contentPadding: propTypes.string.def('24px')
})

const emit = defineEmits<{
  'menu-select': [key: string, item: MenuItem]
}>()

// 当前激活的菜单项
const activeKey = ref(props.defaultActiveKey || props.menuItems[0]?.value || '')

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeKey.value = key
  const item = findMenuItem(props.menuItems, key)
  if (item) {
    emit('menu-select', key, item)
  }
}

// 递归查找菜单项
const findMenuItem = (items: MenuItem[], key: string): MenuItem | undefined => {
  for (const item of items) {
    if (item.value === key) return item
    if (item.children) {
      const found = findMenuItem(item.children, key)
      if (found) return found
    }
  }
  return undefined
}

// 初始化默认选中
onMounted(() => {
  if (activeKey.value) {
    const item = findMenuItem(props.menuItems, activeKey.value)
    if (item) {
      emit('menu-select', activeKey.value, item)
    }
  }
})
</script>

<template>
  <div class="markdown-viewer flex h-full bg-white">
    <!-- 左侧导航菜单 -->
    <div
      class="markdown-viewer-menu flex-shrink-0 border-r border-[var(--el-border-color-lighter)] overflow-y-auto"
      :style="{ width: menuWidth }"
    >
      <div class="p-16px">
        <slot name="menu-header">
          <div class="text-16px font-600 text-[var(--el-text-color-primary)] mb-16px">
            目录
          </div>
        </slot>
      </div>

      <el-menu
        :default-active="activeKey"
        class="border-none"
        @select="handleMenuSelect"
      >
        <template v-for="item in menuItems" :key="item.value">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.value">
            <template #title>
              <Icon v-if="item.icon" :icon="item.icon" :size="18" class="mr-8px" />
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.value"
              :index="child.value"
            >
              <Icon v-if="child.icon" :icon="child.icon" :size="16" class="mr-8px" />
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.value">
            <Icon v-if="item.icon" :icon="item.icon" :size="18" class="mr-8px" />
            <span>{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="markdown-viewer-content flex-1 overflow-y-auto" :style="{ padding: contentPadding }">
      <slot :active-key="activeKey">
        <div class="text-center text-[var(--el-text-color-placeholder)] py-40px">
          请在左侧选择内容查看
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.markdown-viewer {
  &-menu {
    :deep(.el-menu) {
      border-right: none;
      background-color: transparent;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 42px;
      line-height: 42px;
      margin: 2px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--el-fill-color-light) !important;
        color: var(--el-text-color-primary);
      }

      &.is-active {
        background-color: var(--el-color-primary-light-9) !important;
        color: var(--el-color-primary) !important;
        font-weight: 600;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background-color: var(--el-color-primary);
          border-radius: 0 2px 2px 0;
        }
      }
    }

    :deep(.el-menu-item) {
      position: relative;
    }
  }

  &-content {
    // Markdown 样式
    :deep(h1) {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(h2) {
      font-size: 24px;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    :deep(p) {
      line-height: 1.8;
      margin-bottom: 12px;
      color: var(--el-text-color-regular);
    }

    :deep(code) {
      background-color: var(--el-fill-color-light);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      color: var(--el-color-danger);
    }

    :deep(pre) {
      background-color: var(--el-fill-color);
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 16px;

      code {
        background: none;
        padding: 0;
        color: var(--el-text-color-primary);
      }
    }

    :deep(ul), :deep(ol) {
      padding-left: 24px;
      margin-bottom: 12px;

      li {
        line-height: 1.8;
        margin-bottom: 6px;
      }
    }

    :deep(blockquote) {
      border-left: 4px solid var(--el-color-primary);
      padding-left: 16px;
      margin: 16px 0;
      color: var(--el-text-color-secondary);
      background-color: var(--el-fill-color-lighter);
      padding: 12px 16px;
      border-radius: 4px;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;

      th, td {
        border: 1px solid var(--el-border-color);
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background-color: var(--el-fill-color-light);
        font-weight: 600;
      }

      tr:hover {
        background-color: var(--el-fill-color-lighter);
      }
    }

    :deep(a) {
      color: var(--el-color-primary);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      border-radius: 6px;
      margin: 12px 0;
    }

    :deep(hr) {
      border: none;
      border-top: 1px solid var(--el-border-color-lighter);
      margin: 24px 0;
    }
  }
}
</style>
