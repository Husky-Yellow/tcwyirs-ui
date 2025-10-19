# MarkdownViewer 文档查看器组件

左右布局的文档查看器组件,左侧导航菜单,右侧展示 Markdown 内容。

## 功能特性

- ✅ 左右分栏布局
- ✅ 左侧树形导航菜单
- ✅ 支持二级菜单
- ✅ Markdown 内容渲染样式
- ✅ 响应式设计
- ✅ **使用 UnoCSS** 工具类
- ✅ TypeScript 类型支持
- ✅ 自定义菜单宽度和内容间距

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { MarkdownViewer } from '@/temp-components/MarkdownViewer'
import type { MenuItem } from '@/temp-components/MarkdownViewer'

const menuItems: MenuItem[] = [
  {
    label: '快速开始',
    value: 'quick-start',
    icon: 'ep:document'
  },
  {
    label: '组件',
    value: 'components',
    icon: 'ep:box',
    children: [
      { label: 'Button 按钮', value: 'button' },
      { label: 'Input 输入框', value: 'input' }
    ]
  }
]

const activeContent = ref('')

const handleMenuSelect = (key: string, item: MenuItem) => {
  console.log('Selected:', key, item)
  // 加载对应的 Markdown 内容
  activeContent.value = loadMarkdownContent(key)
}
</script>

<template>
  <MarkdownViewer
    :menu-items="menuItems"
    default-active-key="quick-start"
    @menu-select="handleMenuSelect"
  >
    <div v-html="activeContent"></div>
  </MarkdownViewer>
</template>
```

### 完整示例(文档系统)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MarkdownViewer } from '@/temp-components/MarkdownViewer'
import type { MenuItem } from '@/temp-components/MarkdownViewer'
import { marked } from 'marked' // 需要安装 marked 库

const menuItems: MenuItem[] = [
  {
    label: '介绍',
    value: 'intro',
    icon: 'ep:info-filled'
  },
  {
    label: '快速开始',
    value: 'quick-start',
    icon: 'ep:video-play'
  },
  {
    label: '基础组件',
    value: 'basic',
    icon: 'ep:box',
    children: [
      { label: 'Button 按钮', value: 'button', icon: 'ep:pointer' },
      { label: 'Icon 图标', value: 'icon', icon: 'ep:star' },
      { label: 'Link 链接', value: 'link', icon: 'ep:link' }
    ]
  },
  {
    label: '表单组件',
    value: 'form',
    icon: 'ep:edit',
    children: [
      { label: 'Input 输入框', value: 'input' },
      { label: 'Select 选择器', value: 'select' },
      { label: 'DatePicker 日期选择器', value: 'date-picker' }
    ]
  },
  {
    label: 'API 文档',
    value: 'api',
    icon: 'ep:document'
  }
]

// Markdown 内容映射
const mdContents = {
  intro: `
# 项目介绍

这是一个基于 Vue 3 + Element Plus 的组件库。

## 特性

- 🎨 简洁美观的设计
- 📦 开箱即用的组件
- 🔧 灵活的配置
- 📱 响应式支持
  `,
  'quick-start': `
# 快速开始

## 安装

\`\`\`bash
npm install your-package
\`\`\`

## 使用

\`\`\`vue
<template>
  <el-button type="primary">按钮</el-button>
</template>
\`\`\`
  `,
  button: `
# Button 按钮

常用的操作按钮。

## 基础用法

\`\`\`vue
<el-button>默认按钮</el-button>
<el-button type="primary">主要按钮</el-button>
<el-button type="success">成功按钮</el-button>
\`\`\`

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 类型 | string | default |
| size | 尺寸 | string | default |
  `
}

const currentContent = ref('')

const handleMenuSelect = (key: string) => {
  const mdContent = mdContents[key as keyof typeof mdContents] || '# 内容加载中...'
  // 使用 marked 库渲染 Markdown
  currentContent.value = marked(mdContent)
}

// 初始加载
onMounted(() => {
  handleMenuSelect('intro')
})
</script>

<template>
  <div class="h-screen">
    <MarkdownViewer
      :menu-items="menuItems"
      default-active-key="intro"
      menu-width="280px"
      content-padding="32px"
      @menu-select="handleMenuSelect"
    >
      <template #menu-header>
        <div class="flex items-center gap-8px mb-16px">
          <Icon icon="ep:document" :size="20" color="#409EFF" />
          <span class="text-18px font-700">项目文档</span>
        </div>
      </template>

      <div v-html="currentContent" class="markdown-body"></div>
    </MarkdownViewer>
  </div>
</template>
```

### 使用静态 Markdown 文件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MarkdownViewer } from '@/temp-components/MarkdownViewer'
import type { MenuItem } from '@/temp-components/MarkdownViewer'

const menuItems: MenuItem[] = [
  { label: 'README', value: 'readme', icon: 'ep:document' },
  { label: 'CHANGELOG', value: 'changelog', icon: 'ep:clock' },
  { label: 'LICENSE', value: 'license', icon: 'ep:reading' }
]

const currentFile = ref('')

const handleMenuSelect = async (key: string) => {
  try {
    // 动态导入 Markdown 文件
    const module = await import(`../docs/${key}.md?raw`)
    currentFile.value = module.default
  } catch (error) {
    currentFile.value = '# 文件加载失败'
  }
}
</script>

<template>
  <MarkdownViewer
    :menu-items="menuItems"
    @menu-select="handleMenuSelect"
  >
    <div v-html="currentFile"></div>
  </MarkdownViewer>
</template>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| menuItems | 菜单项数组 | `MenuItem[]` | **必填** |
| defaultActiveKey | 默认激活的菜单项 | `string` | 第一个菜单项的 value |
| menuWidth | 左侧菜单宽度 | `string` | `'260px'` |
| contentPadding | 右侧内容区内边距 | `string` | `'24px'` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| menu-select | 菜单项被选中时触发 | `(key: string, item: MenuItem) => void` |

## Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| default | 右侧内容区 | `{ activeKey: string }` |
| menu-header | 左侧菜单头部 | - |

## Types

### MenuItem

```typescript
interface MenuItem {
  label: string       // 菜单项标签
  value: string       // 菜单项唯一标识
  icon?: string       // 图标(可选)
  children?: MenuItem[] // 子菜单(可选)
}
```

## Markdown 渲染

组件内置了 Markdown 样式,支持以下元素:

- ✅ 标题 (h1-h6)
- ✅ 段落
- ✅ 代码块 (inline 和 block)
- ✅ 列表 (有序和无序)
- ✅ 引用
- ✅ 表格
- ✅ 链接
- ✅ 图片
- ✅ 分隔线

### Markdown 库推荐

1. **marked** - 轻量级,速度快
   ```bash
   npm install marked
   ```

2. **markdown-it** - 功能强大,可扩展
   ```bash
   npm install markdown-it
   ```

3. **vitepress/markdown-it** - VitePress 使用的版本
   ```bash
   npm install @mdit-vue/shared
   ```

## 样式定制

### 自定义菜单样式

```vue
<style>
.markdown-viewer-menu :deep(.el-menu-item.is-active) {
  background-color: #e6f0ff !important;
  color: #409EFF !important;
}
</style>
```

### 自定义 Markdown 样式

```vue
<style>
.markdown-viewer-content :deep(h1) {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.markdown-viewer-content :deep(code) {
  color: #e83e8c;
  background-color: #f5f5f5;
}
</style>
```

## 使用场景

1. **项目文档** - 展示项目的 README、CHANGELOG 等
2. **组件文档** - 组件库的 API 文档展示
3. **帮助中心** - 产品的帮助文档系统
4. **知识库** - 企业内部知识库
5. **教程系统** - 分步教程展示
6. **API 文档** - 接口文档查看器

## 最佳实践

### 1. 懒加载内容

```vue
<script setup>
const loadContent = async (key: string) => {
  // 只在选中时加载,避免一次性加载所有文档
  const response = await fetch(`/api/docs/${key}`)
  return await response.text()
}
</script>
```

### 2. 缓存已加载的内容

```vue
<script setup>
const contentCache = new Map<string, string>()

const handleMenuSelect = async (key: string) => {
  if (contentCache.has(key)) {
    currentContent.value = contentCache.get(key)!
  } else {
    const content = await loadContent(key)
    contentCache.set(key, content)
    currentContent.value = content
  }
}
</script>
```

### 3. 搜索功能

```vue
<template>
  <MarkdownViewer :menu-items="filteredMenuItems">
    <template #menu-header>
      <el-input
        v-model="searchText"
        placeholder="搜索文档"
        prefix-icon="ep:search"
        clearable
      />
    </template>
  </MarkdownViewer>
</template>

<script setup>
const searchText = ref('')
const filteredMenuItems = computed(() => {
  if (!searchText.value) return menuItems
  return filterMenuItems(menuItems, searchText.value)
})
</script>
```

## 注意事项

1. **Markdown 渲染**: 组件不包含 Markdown 解析器,需要自行使用 `marked` 或 `markdown-it`
2. **XSS 防护**: 使用 `v-html` 时注意内容安全,建议使用 DOMPurify 等库净化 HTML
3. **性能优化**: 大量文档时建议使用懒加载和缓存策略
4. **响应式**: 小屏幕下建议隐藏左侧菜单或使用抽屉模式
5. **临时组件**: 此组件位于 `temp-components` 文件夹,周一需要迁移

## 文件结构

```
temp-components/MarkdownViewer/
├── src/
│   ├── MarkdownViewer.vue  # 主组件
│   └── types.ts            # TypeScript 类型定义
├── index.ts                # 导出文件
└── README.md               # 使用文档
```

## 与第三方库集成

### 集成 marked

```bash
npm install marked
npm install @types/marked -D
```

```vue
<script setup lang="ts">
import { marked } from 'marked'

// 配置 marked
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true // 换行符转换为 <br>
})

const renderMarkdown = (md: string) => {
  return marked(md)
}
</script>
```

### 集成代码高亮

```bash
npm install highlight.js
```

```vue
<script setup lang="ts">
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})
</script>
```

---

**创建时间**: 2025-10-19
**组件位置**: `temp-components/MarkdownViewer/`
**状态**: ✅ 已完成
**备注**: 周一迁移到正式组件目录
