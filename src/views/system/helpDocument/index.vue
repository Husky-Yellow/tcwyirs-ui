<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, computed, onMounted, watch, h, resolveComponent, defineComponent } from 'vue'
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'MarkdownViewer' })

interface MenuItem {
  label: string
  value: string
  icon?: string
  children?: MenuItem[]
}

interface MarkdownViewerProps {
  menuItems: MenuItem[]
  defaultActiveKey?: string
  menuWidth?: string
  contentPadding?: string
  loading?: boolean
}

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  defaultActiveKey: propTypes.string.def(''),
  menuWidth: propTypes.string.def('260px'),
  contentPadding: propTypes.string.def('24px'),
  loading: propTypes.bool.def(false)
})

const emit = defineEmits<{
  'menu-select': [key: string, item: MenuItem]
  'update:activeKey': [key: string]
}>()

// 当前激活的菜单项
const activeKey = ref(props.defaultActiveKey || props.menuItems?.[0]?.value || '')

// 缓存菜单项映射以提高查找性能
const menuItemMap = computed(() => {
  const map = new Map<string, MenuItem>()
  const buildMap = (items: MenuItem[]) => {
    if (!items || !Array.isArray(items)) return
    items.forEach((item) => {
      map.set(item.value, item)
      if (item.children?.length) {
        buildMap(item.children)
      }
    })
  }
  buildMap(props.menuItems || [])
  return map
})

// 优化后的菜单项查找
const findMenuItem = (key: string): MenuItem | undefined => {
  return menuItemMap.value.get(key)
}

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeKey.value = key
  const item = findMenuItem(key)
  if (item) {
    emit('menu-select', key, item)
    emit('update:activeKey', key)
  }
}

// 监听 menuItems 变化,重置 activeKey
watch(
  () => props.menuItems,
  (newItems) => {
    if (newItems && newItems.length && !findMenuItem(activeKey.value)) {
      activeKey.value = newItems[0]?.value || ''
    }
  },
  { deep: true }
)

// 监听 defaultActiveKey 变化
watch(
  () => props.defaultActiveKey,
  (newKey) => {
    if (newKey && findMenuItem(newKey)) {
      activeKey.value = newKey
    }
  }
)

// 初始化默认选中
onMounted(() => {
  if (activeKey.value) {
    const item = findMenuItem(activeKey.value)
    if (item) {
      emit('menu-select', activeKey.value, item)
      emit('update:activeKey', activeKey.value)
    }
  }
})

// 暴露方法供父组件调用
defineExpose({
  setActiveKey: (key: string) => {
    if (findMenuItem(key)) {
      handleMenuSelect(key)
    }
  },
  getActiveKey: () => activeKey.value
})

// 递归菜单项渲染组件
const MenuItemRenderer = defineComponent({
  name: 'MenuItemRenderer',
  props: {
    items: {
      type: Array as PropType<MenuItem[]>,
      required: true
    },
    level: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const iconSize = computed(() => (props.level === 0 ? 18 : 16))

    return () => {
      if (!props.items || !Array.isArray(props.items) || props.items.length === 0) {
        return null
      }

      return props.items.map((item) => {
        if (item.children?.length) {
          return h(
            resolveComponent('el-sub-menu'),
            {
              key: item.value,
              index: item.value
            },
            {
              title: () => [
                item.icon
                  ? h(resolveComponent('Icon'), {
                      icon: item.icon,
                      size: iconSize.value,
                      class: 'mr-8px'
                    })
                  : null,
                h('span', item.label)
              ],
              default: () =>
                h(MenuItemRenderer, {
                  items: item.children,
                  level: props.level + 1
                })
            }
          )
        } else {
          return h(
            resolveComponent('el-menu-item'),
            {
              key: item.value,
              index: item.value
            },
            {
              default: () => [
                item.icon
                  ? h(resolveComponent('Icon'), {
                      icon: item.icon,
                      size: iconSize.value,
                      class: 'mr-8px'
                    })
                  : null,
                h('span', item.label)
              ]
            }
          )
        }
      })
    }
  }
})
</script>

<template>
  <div class="markdown-viewer h-full flex bg-white">
    <!-- 左侧导航菜单 -->
    <div
      class="markdown-viewer-menu flex-shrink-0 overflow-y-auto border-r border-[var(--el-border-color-lighter)]"
      :style="{ width: menuWidth }"
      role="navigation"
      aria-label="文档导航"
    >
      <div class="p-16px">
        <slot name="menu-header">
          <div class="mb-16px text-16px text-[var(--el-text-color-primary)] font-600"> 目录 </div>
        </slot>
      </div>

      <el-menu :default-active="activeKey" class="border-none" @select="handleMenuSelect">
        <MenuItemRenderer :items="menuItems" />
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div
      class="markdown-viewer-content flex-1 overflow-y-auto"
      :style="{ padding: contentPadding }"
      role="main"
      aria-label="文档内容"
    >
      <div v-if="loading" class="flex items-center justify-center py-40px">
        <el-skeleton :rows="10" animated />
      </div>
      <slot v-else :active-key="activeKey">
        <div class="py-40px text-center text-[var(--el-text-color-placeholder)]">
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
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background-color: var(--el-fill-color-light) !important;
        color: var(--el-text-color-primary);
        transform: translateX(2px);
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

    :deep(.el-sub-menu) {
      .el-menu {
        background-color: transparent;
      }

      .el-menu-item {
        padding-left: 48px !important;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
      }
    }

    // 支持多级嵌套
    @for $i from 2 through 5 {
      :deep(.el-sub-menu) * .el-sub-menu:nth-child(#{$i}) .el-menu-item {
        padding-left: calc(48px + #{$i - 1} * 16px) !important;
      }
    }

    // 滚动条优化
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--el-border-color);
      border-radius: 3px;

      &:hover {
        background-color: var(--el-border-color-dark);
      }
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  &-content {
    // 滚动条优化
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--el-border-color);
      border-radius: 4px;

      &:hover {
        background-color: var(--el-border-color-dark);
      }
    }

    &::-webkit-scrollbar-track {
      background-color: var(--el-fill-color-lighter);
    }

    // Markdown 样式优化
    :deep(h1) {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--el-border-color-lighter);
      color: var(--el-text-color-primary);
    }

    :deep(h2) {
      font-size: 24px;
      font-weight: 600;
      margin-top: 32px;
      margin-bottom: 16px;
      color: var(--el-text-color-primary);
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background-color: var(--el-color-primary);
        border-radius: 2px;
      }
    }

    :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
    }

    :deep(h4) {
      font-size: 18px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 10px;
      color: var(--el-text-color-regular);
    }

    :deep(p) {
      line-height: 1.8;
      margin-bottom: 16px;
      color: var(--el-text-color-regular);
      text-align: justify;
    }

    :deep(code) {
      background-color: var(--el-fill-color-light);
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      color: var(--el-color-danger);
      border: 1px solid var(--el-border-color-lighter);
    }

    :deep(pre) {
      background-color: var(--el-fill-color);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
      border: 1px solid var(--el-border-color-lighter);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      code {
        background: none;
        padding: 0;
        color: var(--el-text-color-primary);
        border: none;
      }
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 28px;
      margin-bottom: 16px;

      li {
        line-height: 1.8;
        margin-bottom: 8px;
        color: var(--el-text-color-regular);

        &::marker {
          color: var(--el-color-primary);
        }
      }

      ul,
      ol {
        margin-top: 8px;
        margin-bottom: 8px;
      }
    }

    :deep(blockquote) {
      border-left: 4px solid var(--el-color-primary);
      padding: 12px 20px;
      margin: 20px 0;
      color: var(--el-text-color-secondary);
      background-color: var(--el-fill-color-lighter);
      border-radius: 4px;
      font-style: italic;

      p {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      th,
      td {
        border: 1px solid var(--el-border-color);
        padding: 12px 16px;
        text-align: left;
      }

      th {
        background-color: var(--el-fill-color-light);
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      td {
        color: var(--el-text-color-regular);
      }

      tr {
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-lighter);
        }

        &:nth-child(even) {
          background-color: var(--el-fill-color-blank);
        }
      }
    }

    :deep(a) {
      color: var(--el-color-primary);
      text-decoration: none;
      transition: all 0.2s;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 1px;
        background-color: var(--el-color-primary);
        transition: width 0.3s;
      }

      &:hover {
        color: var(--el-color-primary-light-3);

        &::after {
          width: 100%;
        }
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition:
        transform 0.3s,
        box-shadow 0.3s;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }
    }

    :deep(hr) {
      border: none;
      border-top: 2px solid var(--el-border-color-lighter);
      margin: 32px 0;
    }

    // 强调样式
    :deep(strong),
    :deep(b) {
      font-weight: 700;
      color: var(--el-text-color-primary);
    }

    :deep(em),
    :deep(i) {
      font-style: italic;
      color: var(--el-text-color-regular);
    }

    // 删除线
    :deep(del),
    :deep(s) {
      text-decoration: line-through;
      color: var(--el-text-color-placeholder);
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    flex-direction: column;

    &-menu {
      width: 100% !important;
      max-height: 200px;
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &-content {
      padding: 16px !important;

      :deep(h1) {
        font-size: 24px;
      }

      :deep(h2) {
        font-size: 20px;
      }

      :deep(h3) {
        font-size: 18px;
      }

      :deep(table) {
        font-size: 14px;

        th,
        td {
          padding: 8px;
        }
      }
    }
  }
}

// 打印样式
@media print {
  .markdown-viewer {
    &-menu {
      display: none;
    }

    &-content {
      padding: 0 !important;

      :deep(a) {
        color: inherit;
        text-decoration: underline;
      }

      :deep(img) {
        box-shadow: none;
      }
    }
  }
}
</style>
