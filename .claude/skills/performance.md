# 性能优化技能

项目性能优化策略，涵盖构建优化、运行时优化和资源加载优化。

## 构建优化

### Vite 配置优化

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  build: {
    // 使用 esbuild 压缩（20-40x faster than terser）
    minify: 'esbuild',

    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // Element Plus
          'element-plus': ['element-plus'],

          // 图表库
          'echarts': ['echarts'],

          // 表单设计器
          'form-create': ['@form-create/element-ui'],
          'form-designer': ['@form-create/designer'],

          // 富文本编辑器
          'editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],

          // BPMN
          'bpmn': ['bpmn-js'],

          // 工具库
          'utils': ['lodash-es', 'dayjs', 'axios']
        }
      }
    },

    // chunk大小警告阈值
    chunkSizeWarningLimit: 1500,

    // 启用 CSS 代码分割
    cssCodeSplit: true,

    // Source map（生产环境关闭）
    sourcemap: false
  },

  // 依赖预构建
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'element-plus/es',
      'element-plus/es/components/form/style/index',
      'element-plus/es/components/form-item/style/index',
      // ... 其他常用依赖
    ],
    exclude: ['@iconify/json']
  },

  // 开发服务器
  server: {
    // 开启文件系统缓存
    fs: {
      strict: false
    }
  }
})
```

### 环境特定优化

```typescript
// build/vite/index.ts
import type { PluginOption } from 'vite'

export function createVitePlugins(env: ViteEnv, isBuild: boolean) {
  const plugins: PluginOption[] = [vue()]

  // 开发环境插件
  if (!isBuild) {
    plugins.push(
      // ESLint（仅开发环境，使用缓存）
      eslintPlugin({
        cache: true,
        cacheLocation: 'node_modules/.cache/eslint'
      })
    )
  }

  // 生产环境插件
  if (isBuild) {
    plugins.push(
      // 压缩
      viteCompression({
        verbose: true,
        disable: false,
        algorithm: 'gzip',
        ext: '.gz'
      }),

      // 分析
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      })
    )
  }

  return plugins
}
```

### 代码分割策略

```typescript
// 智能代码分割
manualChunks(id) {
  // node_modules 按包分割
  if (id.includes('node_modules')) {
    const match = id.match(/node_modules\/(.*?)\//)?.[1]

    // Vue 生态
    if (['vue', 'vue-router', 'pinia'].includes(match)) {
      return 'vue-vendor'
    }

    // Element Plus
    if (match.startsWith('@element-plus') || match === 'element-plus') {
      return 'element-plus'
    }

    // 大型库单独分割
    if (['echarts', 'bpmn-js', '@wangeditor'].some(lib => match.includes(lib))) {
      return match.split('/')[0]
    }

    // 其他依赖
    return 'vendor'
  }
}
```

## 运行时优化

### Vue 响应式优化

#### 1. 使用 shallowRef

```typescript
import { shallowRef } from 'vue'

// ✅ 大型对象使用 shallowRef
const bpmnModeler = shallowRef<BpmnModeler>()
const editorInstance = shallowRef<Editor>()
const largeDataset = shallowRef<DataItem[]>([])

// ❌ 避免：深度响应式大型对象
const largeDataset = ref<DataItem[]>([]) // 性能开销大
```

#### 2. 使用 markRaw

```typescript
import { markRaw } from 'vue'

// ✅ 静态配置使用 markRaw
export const COMPONENT_MAP = {
  [HomeComponentType.WIDGET]: markRaw(Widget)
}

// ✅ 第三方实例使用 markRaw
const chart = markRaw(echarts.init(el))

// ❌ 避免：不必要的响应式
const config = ref({
  options: { /* 大量静态配置 */ }
}) // 应使用 markRaw
```

#### 3. 使用 computedEager

```typescript
import { computedEager } from '@vueuse/core'

// ✅ 布局计算使用 computedEager
const pageLoading = computedEager(() => appStore.getPageLoading)
const collapse = computedEager(() => appStore.getCollapse)

// 减少响应式追踪开销
```

#### 4. v-memo 指令

```vue
<template>
  <!-- 列表项缓存 -->
  <div
    v-for="item in list"
    :key="item.id"
    v-memo="[item.id, item.selected]"
  >
    <!-- 仅当 id 或 selected 改变时重新渲染 -->
    {{ item.name }}
  </div>
</template>
```

### 组件优化

#### 1. 异步组件

```typescript
import { defineAsyncComponent } from 'vue'

// ✅ 重型组件懒加载
const HeavyChart = defineAsyncComponent(() =>
  import('./HeavyChart.vue')
)

// 带加载状态
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./Component.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200,
  timeout: 3000
})
```

#### 2. KeepAlive 优化

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews" :max="10">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()

// 限制缓存数量
const cachedViews = computed(() => {
  return Array.from(tagsViewStore.cachedViews).slice(0, 10)
})
</script>
```

#### 3. 虚拟滚动

```vue
<template>
  <!-- 大量数据使用虚拟滚动 -->
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="800"
    :height="600"
    fixed
  />
</template>
```

### 列表渲染优化

```vue
<template>
  <!-- ✅ 使用 key -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>

  <!-- ❌ 避免：使用 index 作为 key -->
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
  </div>

  <!-- ✅ 避免不必要的响应式 -->
  <div v-for="item in items" :key="item.id">
    <!-- 静态内容提取到变量 -->
    <span>{{ staticLabel }}</span>
    <span>{{ item.name }}</span>
  </div>
</template>
```

### 事件优化

```vue
<template>
  <!-- ✅ 使用事件修饰符 -->
  <button @click.stop="handleClick">点击</button>

  <!-- ✅ 使用 passive 优化滚动性能 -->
  <div @scroll.passive="handleScroll">
    <!-- 内容 -->
  </div>

  <!-- ❌ 避免：在模板中使用复杂表达式 -->
  <button @click="items.filter(i => i.active).map(i => i.id)">
    <!-- 应提取为 computed -->
  </button>
</template>
```

## 资源加载优化

### 路由懒加载

```typescript
// router/modules/system.ts
import { Layout } from '@/utils/routerHelper'

const route: RouteRecordRaw = {
  path: '/system',
  component: Layout,
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      // ✅ 动态导入
      component: () => import('@/views/System/User/Index.vue')
    }
  ]
}
```

### 图片优化

```vue
<template>
  <!-- ✅ 使用 loading="lazy" -->
  <img :src="imageUrl" loading="lazy" alt="Image" />

  <!-- ✅ 响应式图片 -->
  <picture>
    <source
      media="(min-width: 768px)"
      srcset="image-large.jpg"
    />
    <img src="image-small.jpg" alt="Responsive image" />
  </picture>

  <!-- ✅ 使用 WebP -->
  <picture>
    <source type="image/webp" srcset="image.webp" />
    <img src="image.jpg" alt="Image" />
  </picture>
</template>
```

### 字体优化

```css
/* ✅ 使用 font-display */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
  font-display: swap; /* 避免 FOIT */
}

/* ✅ 预加载关键字体 */
/* <link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin> */
```

### 预加载和预连接

```html
<!-- index.html -->
<head>
  <!-- 预连接到 CDN -->
  <link rel="dns-prefetch" href="https://cdn.example.com" />
  <link rel="preconnect" href="https://api.example.com" />

  <!-- 预加载关键资源 -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/critical.css" as="style" />

  <!-- 预获取下一页资源 -->
  <link rel="prefetch" href="/next-page.js" />
</head>
```

## 网络优化

### Axios 配置优化

```typescript
// src/config/axios/service.ts
import axios from 'axios'

const service = axios.create({
  timeout: 10000,

  // 请求缓存
  adapter: cacheAdapterEnhancer(axios.defaults.adapter!, {
    enabledByDefault: false,
    cacheFlag: 'useCache'
  })
})

// 请求拦截器
service.interceptors.request.use((config) => {
  // 添加请求时间戳用于缓存控制
  if (config.useCache) {
    config.params = {
      ...config.params,
      _t: Math.floor(Date.now() / 60000) // 1分钟缓存
    }
  }

  return config
})

// 使用
getResourceApi({ useCache: true })
```

### 请求合并

```typescript
// 防抖请求
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn((query: string) => {
  searchApi(query)
}, 300)

// 节流请求
import { useThrottleFn } from '@vueuse/core'

const throttledFetch = useThrottleFn(() => {
  fetchDataApi()
}, 1000)
```

### 分页加载

```typescript
// 无限滚动
import { useInfiniteScroll } from '@vueuse/core'

export function useInfiniteList() {
  const list = ref<Item[]>([])
  const page = ref(1)
  const loading = ref(false)
  const finished = ref(false)

  const loadMore = async () => {
    if (loading.value || finished.value) return

    loading.value = true
    try {
      const { list: newItems, total } = await getPageApi({
        pageNo: page.value,
        pageSize: 20
      })

      list.value.push(...newItems)
      page.value++

      if (list.value.length >= total) {
        finished.value = true
      }
    } finally {
      loading.value = false
    }
  }

  useInfiniteScroll(
    document.querySelector('.scroll-container'),
    loadMore,
    { distance: 100 }
  )

  return {
    list,
    loading,
    finished,
    loadMore
  }
}
```

## 渲染优化

### CSS 性能

```scss
// ✅ 避免昂贵的选择器
.specific-class {
  color: red;
}

// ❌ 避免：通配符和深层嵌套
* {
  color: red; // 性能差
}

.a .b .c .d .e {
  color: red; // 选择器过深
}

// ✅ 使用 transform 代替 left/top
.element {
  transform: translateX(100px); // GPU 加速
}

// ❌ 触发重绘
.element {
  left: 100px; // 触发 layout
}

// ✅ 使用 will-change 提示浏览器
.animated {
  will-change: transform, opacity;
  transition: transform 0.3s, opacity 0.3s;
}
```

### 减少重绘和回流

```typescript
// ✅ 批量 DOM 操作
const fragment = document.createDocumentFragment()
for (const item of items) {
  const el = document.createElement('div')
  el.textContent = item.name
  fragment.appendChild(el)
}
container.appendChild(fragment)

// ❌ 避免：频繁 DOM 操作
for (const item of items) {
  const el = document.createElement('div')
  el.textContent = item.name
  container.appendChild(el) // 每次都触发回流
}

// ✅ 读写分离
const height1 = el1.offsetHeight // 读
const height2 = el2.offsetHeight // 读
el1.style.height = height1 + 10 + 'px' // 写
el2.style.height = height2 + 10 + 'px' // 写

// ❌ 避免：读写交叉
const height1 = el1.offsetHeight // 读
el1.style.height = height1 + 10 + 'px' // 写，触发回流
const height2 = el2.offsetHeight // 读，强制回流
el2.style.height = height2 + 10 + 'px' // 写
```

## 内存优化

### 避免内存泄漏

```typescript
// ✅ 清理事件监听
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize) // 必须清理
})

// ✅ 清理定时器
onMounted(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000)

  onUnmounted(() => {
    clearInterval(timer) // 必须清理
  })
})

// ✅ 清理 store 订阅
const unsubscribe = store.$subscribe(() => {
  // ...
})

onUnmounted(() => {
  unsubscribe() // 必须取消订阅
})
```

### WeakMap/WeakSet

```typescript
// ✅ 使用 WeakMap 避免内存泄漏
const cache = new WeakMap<Object, CachedData>()

function getCachedData(obj: Object) {
  if (cache.has(obj)) {
    return cache.get(obj)
  }

  const data = computeExpensiveData(obj)
  cache.set(obj, data)
  return data
}

// 当 obj 被回收时，cache 中的条目也会自动清理
```

## 监控和分析

### 性能监控

```typescript
// 页面加载性能
if (window.performance) {
  const timing = window.performance.timing

  // DNS 查询耗时
  const dnsTime = timing.domainLookupEnd - timing.domainLookupStart

  // TCP 连接耗时
  const tcpTime = timing.connectEnd - timing.connectStart

  // 请求耗时
  const requestTime = timing.responseEnd - timing.requestStart

  // DOM 解析耗时
  const domTime = timing.domComplete - timing.domLoading

  // 白屏时间
  const whiteTime = timing.domLoading - timing.fetchStart

  // 首屏时间
  const firstScreenTime = timing.domContentLoadedEventEnd - timing.fetchStart

  console.log({
    dnsTime,
    tcpTime,
    requestTime,
    domTime,
    whiteTime,
    firstScreenTime
  })
}
```

### Bundle 分析

```bash
# 安装分析工具
pnpm add -D rollup-plugin-visualizer

# 构建并生成分析报告
pnpm build

# 查看 dist/stats.html
```

### Lighthouse 审计

```bash
# 使用 Chrome DevTools Lighthouse
# 或使用 CLI
npm install -g lighthouse

lighthouse http://localhost:5173 --view
```

## 优化检查清单

### 构建优化
- [ ] 启用代码分割
- [ ] 配置合理的 chunk 策略
- [ ] 启用 tree-shaking
- [ ] 使用 esbuild 压缩
- [ ] 启用 gzip/brotli 压缩
- [ ] 移除 source map（生产环境）
- [ ] 分析 bundle 大小

### 运行时优化
- [ ] 大型对象使用 shallowRef
- [ ] 静态配置使用 markRaw
- [ ] 布局计算使用 computedEager
- [ ] 重型组件使用 defineAsyncComponent
- [ ] 大列表使用虚拟滚动
- [ ] 列表渲染使用正确的 key
- [ ] 合理使用 v-memo
- [ ] 限制 keepAlive 缓存数量

### 资源优化
- [ ] 图片懒加载
- [ ] 使用 WebP 格式
- [ ] 字体使用 font-display: swap
- [ ] 预加载关键资源
- [ ] CDN 加速静态资源
- [ ] 启用 HTTP/2

### 网络优化
- [ ] 请求防抖/节流
- [ ] 启用请求缓存
- [ ] 合并相似请求
- [ ] 使用分页加载
- [ ] 压缩请求/响应体

### 渲染优化
- [ ] 避免昂贵的 CSS 选择器
- [ ] 使用 transform 代替 left/top
- [ ] 批量 DOM 操作
- [ ] 减少重绘和回流
- [ ] 使用 will-change 提示

### 内存优化
- [ ] 清理事件监听器
- [ ] 清理定时器
- [ ] 取消 store 订阅
- [ ] 使用 WeakMap/WeakSet
- [ ] 避免闭包陷阱

## 性能目标

- **首屏加载** < 2s
- **白屏时间** < 1s
- **Lighthouse 评分** > 90
- **FCP (First Contentful Paint)** < 1.8s
- **LCP (Largest Contentful Paint)** < 2.5s
- **TTI (Time to Interactive)** < 3.8s
- **CLS (Cumulative Layout Shift)** < 0.1
- **Bundle 大小** < 500KB (gzipped)

## 常见性能问题

**Q: 页面加载慢？**
- 检查 bundle 大小
- 启用代码分割
- 优化图片资源
- 使用 CDN

**Q: 滚动卡顿？**
- 使用虚拟滚动
- 避免复杂计算
- 使用 passive 事件监听
- 优化 CSS 选择器

**Q: 内存泄漏？**
- 清理事件监听器
- 清理定时器
- 取消订阅
- 检查闭包

**Q: 响应慢？**
- 使用防抖/节流
- 优化计算逻辑
- 使用 Web Worker
- 启用请求缓存
