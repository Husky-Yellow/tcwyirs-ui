# 样式开发规范

项目样式系统使用指南，涵盖 UnoCSS、SCSS 和全局样式管理。

## 样式技术栈

- **UnoCSS** - 原子化 CSS 引擎（主要）
- **SCSS** - CSS 预处理器（辅助）
- **Element Plus** - UI 组件库主题
- **全局样式** - `src/styles/` 目录

## UnoCSS 优先原则

### 何时使用 UnoCSS

```vue
<template>
  <!-- ✅ 推荐：优先使用 UnoCSS utilities -->
  <div class="flex items-center justify-between p-16px">
    <span class="text-14px text-[#303133] font-500">标题</span>
    <el-button class="w-80px h-32px">按钮</el-button>
  </div>

  <!-- ❌ 避免：简单样式使用 scoped styles -->
  <div class="header">
    <span class="title">标题</span>
  </div>
</template>

<style lang="scss" scoped>
/* 不推荐：应使用 UnoCSS */
.header {
  display: flex;
  align-items: center;
  padding: 16px;
}

.title {
  font-size: 14px;
  color: #303133;
}
</style>
```

### 常用 UnoCSS Utilities

#### 布局

```html
<!-- Flexbox -->
<div class="flex flex-col items-center justify-between gap-16px">
  <!-- flex, flex-direction, align-items, justify-content, gap -->
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-16px">
  <!-- display: grid, grid-template-columns, gap -->
</div>

<!-- 定位 -->
<div class="relative">
  <div class="absolute top-0 right-0">
    <!-- position: relative / absolute, top, right -->
  </div>
</div>
```

#### 间距

```html
<!-- Padding -->
<div class="p-16px">         <!-- padding: 16px -->
<div class="px-16px py-8px"> <!-- padding-left/right: 16px, padding-top/bottom: 8px -->
<div class="pt-16px">        <!-- padding-top: 16px -->

<!-- Margin -->
<div class="m-16px">         <!-- margin: 16px -->
<div class="mx-auto">        <!-- margin-left/right: auto -->
<div class="mt-16px">        <!-- margin-top: 16px -->
```

#### 尺寸

```html
<!-- Width -->
<div class="w-full">         <!-- width: 100% -->
<div class="w-200px">        <!-- width: 200px -->
<div class="w-50%">          <!-- width: 50% -->

<!-- Height -->
<div class="h-full">         <!-- height: 100% -->
<div class="h-300px">        <!-- height: 300px -->
<div class="min-h-screen">   <!-- min-height: 100vh -->
```

#### 文字

```html
<!-- 字体大小 -->
<span class="text-14px">     <!-- font-size: 14px -->
<span class="text-16px">     <!-- font-size: 16px -->

<!-- 字体粗细 -->
<span class="font-400">      <!-- font-weight: 400 -->
<span class="font-500">      <!-- font-weight: 500 (medium) -->
<span class="font-600">      <!-- font-weight: 600 (semi-bold) -->

<!-- 颜色 -->
<span class="text-[#303133]">      <!-- color: #303133 -->
<span class="text-[#409EFF]">      <!-- color: #409EFF -->
```

#### 背景和边框

```html
<!-- 背景色 -->
<div class="bg-[#FFFFFF]">         <!-- background-color: #FFFFFF -->
<div class="bg-[#F2F3F5]">         <!-- background-color: #F2F3F5 -->

<!-- 边框 -->
<div class="border border-[#DCDFE6]">    <!-- border: 1px solid #DCDFE6 -->
<div class="border-t border-[#DCDFE6]">  <!-- border-top: 1px solid #DCDFE6 -->

<!-- 圆角 -->
<div class="rounded-4px">          <!-- border-radius: 4px -->
<div class="rounded-8px">          <!-- border-radius: 8px -->
```

#### 阴影和效果

```html
<!-- 阴影 -->
<div class="shadow-sm">            <!-- box-shadow: sm -->
<div class="shadow-md">            <!-- box-shadow: md -->

<!-- 透明度 -->
<div class="opacity-50">           <!-- opacity: 0.5 -->
<div class="opacity-80">           <!-- opacity: 0.8 -->

<!-- 过渡 -->
<div class="transition-all duration-300">
  <!-- transition: all 0.3s -->
</div>
```

#### 响应式

```html
<!-- 移动端 / 桌面端 -->
<div class="flex flex-col md:flex-row">
  <!-- 小屏垂直布局，中屏及以上水平布局 -->
</div>

<!-- 断点前缀 -->
sm:   <!-- @media (min-width: 640px) -->
md:   <!-- @media (min-width: 768px) -->
lg:   <!-- @media (min-width: 1024px) -->
xl:   <!-- @media (min-width: 1280px) -->
2xl:  <!-- @media (min-width: 1536px) -->
```

## SCSS 使用场景

### 何时使用 SCSS

```vue
<template>
  <div class="complex-component">
    <!-- 复杂样式、动画、伪类等使用 SCSS -->
  </div>
</template>

<style lang="scss" scoped>
/* ✅ 推荐场景 */

// 1. 复杂选择器
.complex-component {
  &:hover {
    .child-element {
      opacity: 0.8;
    }
  }

  &::before {
    content: '';
    display: block;
  }
}

// 2. CSS 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

// 3. 复杂计算
.dynamic-size {
  width: calc(100% - 200px);
  height: calc(100vh - 64px - 40px);
}

// 4. 主题变量引用
.themed-component {
  background-color: var(--el-color-primary);
  color: var(--el-text-color-primary);
}
</style>
```

### SCSS 变量和 Mixins

```scss
// src/styles/variables.scss

// 颜色
$primary-color: #409EFF;
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;

// 文字颜色
$text-color-primary: #303133;
$text-color-regular: #606266;
$text-color-secondary: #909399;
$text-color-placeholder: #C0C4CC;

// 边框颜色
$border-color-base: #DCDFE6;
$border-color-light: #E4E7ED;
$border-color-lighter: #EBEEF5;
$border-color-extra-light: #F2F6FC;

// 背景色
$background-color-base: #F5F7FA;
$background-color-light: #FAFAFA;

// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin multi-line-ellipsis($lines: 2) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $lines;
  overflow: hidden;
}

// 使用
.component {
  @include flex-center;

  .title {
    @include text-ellipsis;
    max-width: 200px;
  }

  .description {
    @include multi-line-ellipsis(3);
  }
}
```

## 全局样式

### 目录结构

```
src/styles/
├── index.scss          # 样式入口
├── variables.scss      # SCSS 变量
├── mixins.scss         # SCSS mixins
├── element.scss        # Element Plus 主题定制
├── transition.scss     # 过渡动画
└── common.scss         # 通用样式
```

### 样式入口 (`src/styles/index.scss`)

```scss
@import './variables.scss';
@import './mixins.scss';
@import './element.scss';
@import './transition.scss';
@import './common.scss';

// 全局样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Element Plus 主题定制

### 变量覆盖 (`src/styles/element.scss`)

```scss
// Element Plus CSS 变量覆盖
:root {
  // 主色
  --el-color-primary: #409EFF;
  --el-color-success: #67C23A;
  --el-color-warning: #E6A23C;
  --el-color-danger: #F56C6C;
  --el-color-info: #909399;

  // 文字颜色
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #C0C4CC;

  // 边框
  --el-border-color: #DCDFE6;
  --el-border-color-light: #E4E7ED;
  --el-border-color-lighter: #EBEEF5;
  --el-border-color-extra-light: #F2F6FC;
  --el-border-radius-base: 4px;

  // 背景
  --el-fill-color-blank: #FFFFFF;
  --el-fill-color: #F0F2F5;
  --el-fill-color-light: #F5F7FA;
  --el-fill-color-lighter: #FAFAFA;
  --el-fill-color-extra-light: #FAFCFF;

  // 字体
  --el-font-size-base: 14px;
  --el-font-size-small: 12px;
  --el-font-size-large: 16px;
  --el-font-size-extra-large: 18px;

  // 组件大小
  --el-component-size-large: 40px;
  --el-component-size: 32px;
  --el-component-size-small: 24px;
}

// 暗黑模式
.dark {
  --el-bg-color: #1D1E1F;
  --el-bg-color-page: #0A0A0A;
  --el-text-color-primary: #E5EAF3;
  --el-text-color-regular: #CFD3DC;
  --el-border-color: #4C4D4F;
}

// 组件样式覆盖
.el-button {
  // 自定义按钮样式
}

.el-table {
  // 自定义表格样式
}
```

## 过渡动画

### 内置过渡 (`src/styles/transition.scss`)

```scss
// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滑动
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

// 缩放
.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
```

### 使用过渡

```vue
<template>
  <transition name="fade">
    <div v-if="visible">内容</div>
  </transition>

  <transition-group name="slide">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </transition-group>
</template>
```

## 响应式设计

### 断点定义

```scss
// UnoCSS 断点（默认）
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

// 使用
@media (min-width: 768px) {
  .component {
    flex-direction: row;
  }
}
```

### 响应式 Utilities

```html
<!-- 隐藏/显示 -->
<div class="hidden md:block">
  <!-- 小屏隐藏，中屏及以上显示 -->
</div>

<!-- 布局变化 -->
<div class="flex flex-col md:flex-row">
  <!-- 小屏垂直布局，中屏及以上水平布局 -->
</div>

<!-- 间距变化 -->
<div class="p-16px md:p-24px lg:p-32px">
  <!-- 不同屏幕不同padding -->
</div>

<!-- 文字大小 -->
<h1 class="text-20px md:text-24px lg:text-28px">
  <!-- 响应式字体大小 -->
</h1>
```

## 样式最佳实践

### 1. 命名规范

```scss
// ✅ 推荐：BEM 命名
.user-card {
  &__header {
    // user-card__header
  }

  &__body {
    // user-card__body
  }

  &--featured {
    // user-card--featured (modifier)
  }
}

// ❌ 避免：随意命名
.card {
  .header {
    // 太通用，易冲突
  }
}
```

### 2. 避免深层嵌套

```scss
// ✅ 推荐：最多 3 层
.component {
  .header {
    .title {
      // 3 层，合理
    }
  }
}

// ❌ 避免：超过 3 层
.component {
  .wrapper {
    .container {
      .header {
        .title {
          // 5 层，过深
        }
      }
    }
  }
}
```

### 3. 使用 scoped

```vue
<style lang="scss" scoped>
/* ✅ 组件样式使用 scoped */
.component {
  /* 仅作用于当前组件 */
}
</style>

<style lang="scss">
/* ⚠️ 全局样式慎用（仅在必要时） */
.global-utility {
  /* 影响全局 */
}
</style>
```

### 4. CSS 变量优先

```scss
// ✅ 推荐：使用 CSS 变量
.component {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-blank);
}

// ❌ 避免：硬编码颜色
.component {
  color: #303133;
  background: #FFFFFF;
}
```

### 5. 避免 !important

```scss
// ✅ 推荐：提高选择器优先级
.component.is-active {
  color: red;
}

// ❌ 避免：滥用 !important
.component {
  color: red !important;
}
```

## 暗黑模式支持

### 切换暗黑模式

```typescript
// src/hooks/web/useDark.ts
import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})

export const toggleDark = useToggle(isDark)
```

### 暗黑模式样式

```scss
// 自动适配
.component {
  background: var(--el-fill-color-blank); // 自动切换
  color: var(--el-text-color-primary); // 自动切换
}

// 手动适配
.component {
  background: #FFFFFF;

  .dark & {
    background: #1D1E1F;
  }
}
```

## 性能优化

### 1. 避免昂贵选择器

```scss
// ❌ 避免：通配符
* {
  margin: 0;
}

// ✅ 推荐：具体选择器
.component {
  margin: 0;
}
```

### 2. 减少重绘

```scss
// ✅ 使用 transform 而不是 left/top
.element {
  transform: translateX(100px);
}

// ❌ 触发重绘
.element {
  left: 100px;
}
```

### 3. 使用 will-change

```scss
.animated-element {
  will-change: transform, opacity;
  transition: transform 0.3s, opacity 0.3s;
}
```

## 调试技巧

### 1. 查看应用的 CSS 变量

```javascript
// 浏览器控制台
getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary')
```

### 2. UnoCSS Dev Tools

```
npm run dev
```
访问 `http://localhost:5173/__unocss` 查看生成的 CSS。

### 3. 样式隔离检查

使用浏览器开发者工具检查元素的 `data-v-xxx` 属性确认 scoped 生效。

## 常见问题

**Q: UnoCSS utilities 不生效？**
- 检查 `uno.config.ts` 配置
- 重启开发服务器
- 清除缓存 `pnpm clean:cache`

**Q: Element Plus 主题不生效？**
- 确认 CSS 变量覆盖在 `:root` 下
- 检查是否有优先级更高的样式覆盖

**Q: scoped 样式影响子组件？**
- 使用 `:deep()` 穿透
```scss
:deep(.child-class) {
  color: red;
}
```

**Q: 全局样式被覆盖？**
- 提高选择器优先级
- 使用更具体的选择器
- 检查样式加载顺序
