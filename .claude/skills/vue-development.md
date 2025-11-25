# Vue 3 开发技能

Vue 3 + Composition API 开发模式和最佳实践。

## Composition API 模式

### 基本结构

```vue
<template>
  <div class="component-name">
    <!-- 使用 UnoCSS utilities -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

defineOptions({ name: 'ComponentName' })

interface Props {
  // 定义 props
}

interface Emits {
  // 定义 emits
}

const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

const emit = defineEmits<Emits>()

// 组件逻辑
</script>

<style lang="scss" scoped>
// 仅在必要时使用，优先使用 UnoCSS
</style>
```

## 响应式优化

### 何时使用 shallowRef

适用场景：
- 大型第三方库实例（BPMN modeler, rich editors）
- 复杂对象不需要深度响应
- 性能敏感场景

```typescript
import { shallowRef } from 'vue'

// ✅ 正确：大型对象使用 shallowRef
const bpmnModeler = shallowRef<BpmnModeler>()
const editorInstance = shallowRef<Editor>()

// ❌ 错误：需要响应式的数据使用 shallowRef
const formData = shallowRef({ name: '', email: '' }) // 应使用 ref
```

### 何时使用 markRaw

适用场景：
- 静态配置对象
- 组件注册表
- 不需要响应式的第三方实例

```typescript
import { markRaw } from 'vue'

// ✅ 正确：静态组件映射
export const COMPONENT_MAP = {
  [HomeComponentType.WIDGET]: markRaw(Widget)
}

// ✅ 正确：第三方实例
const chart = markRaw(echarts.init(el))
```

## Composables 模式

### 创建可复用 Composable

```typescript
// src/views/Home/composables/useStatusStyle.ts
import { computed } from 'vue'

interface StatusColorMap {
  [key: string]: {
    dot: string
    text: string
  }
}

export const STATUS_COLORS: StatusColorMap = {
  pending: { dot: 'bg-[#409EFF]', text: 'text-[#409EFF]' },
  approved: { dot: 'bg-[#67C23A]', text: 'text-[#67C23A]' },
  rejected: { dot: 'bg-[#F56C6C]', text: 'text-[#F56C6C]' },
  default: { dot: 'bg-[#909399]', text: 'text-[#909399]' }
}

export const useStatusStyle = (colorMap?: StatusColorMap) => {
  const colors = colorMap || STATUS_COLORS

  const getStatusDotClass = (status: string): string => {
    return colors[status]?.dot || colors.default.dot
  }

  const getStatusTextClass = (status: string): string => {
    return colors[status]?.text || colors.default.text
  }

  return {
    getStatusDotClass,
    getStatusTextClass
  }
}
```

### 使用 Composable

```vue
<script setup lang="ts">
import { useStatusStyle } from '../composables/useStatusStyle'

// 使用默认颜色
const { getStatusDotClass, getStatusTextClass } = useStatusStyle()

// 或使用自定义颜色
const customColors = {
  pending: { dot: 'bg-[#E6A23C]', text: 'text-[#E6A23C]' }
}
const statusStyle = useStatusStyle(customColors)
</script>

<template>
  <span :class="getStatusDotClass(item.status)"></span>
  <span :class="getStatusTextClass(item.status)">{{ item.statusText }}</span>
</template>
```

## VueUse 集成

项目中常用的 VueUse 工具：

### 双向绑定

```typescript
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 自动处理 v-model
const value = useVModel(props, 'modelValue', emit)
```

### 防抖

```typescript
import { useDebounceFn } from '@vueuse/core'

const handleSearch = useDebounceFn((query: string) => {
  // 搜索逻辑
}, 300)
```

### 响应式布局

```typescript
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  xs: 0,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
})

const isMobile = breakpoints.smaller('md')
```

### 剪贴板

```typescript
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard()

const handleCopy = async () => {
  await copy(text)
  if (copied.value) {
    // 显示成功消息
  }
}
```

## defineAsyncComponent

### 路由级懒加载

```typescript
import { defineAsyncComponent } from 'vue'

// ✅ 推荐：使用 defineAsyncComponent
const AsyncComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// 带加载和错误状态
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorMessage,
  delay: 200,
  timeout: 3000
})
```

## 项目特定模式

### Home 页面配置驱动布局

```typescript
// 1. 定义组件类型
export enum HomeComponentType {
  MY_WIDGET = 'MyWidget'
}

// 2. 创建组件
// src/views/Home/components/widgets/MyWidget.vue

// 3. 注册组件
import MyWidget from '../components/widgets/MyWidget.vue'
export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.MY_WIDGET]: markRaw(MyWidget)
}

// 4. 配置角色布局
const roleLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      { type: HomeComponentType.MY_WIDGET, order: 1 }
    ]
  }
}

export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  roleName: roleLayout
}
```

### 使用项目 Hooks

```typescript
// 表格相关
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

// 消息提示
import { useMessage } from '@/hooks/web/useMessage'
const { createMessage } = useMessage()

// 设计系统
import { useDesign } from '@/hooks/web/useDesign'
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('component')

// 水印
import { useWatermark } from '@/hooks/web/useWatermark'
const { setWatermark } = useWatermark()
```

## 性能优化建议

1. **避免不必要的响应式**：对大型对象使用 `shallowRef` 或 `markRaw`
2. **懒加载重型组件**：使用 `defineAsyncComponent`
3. **优先使用 computedEager**：在布局计算中使用 `computedEager` 减少响应式开销
4. **使用 VueUse 工具**：避免重复造轮子
5. **提取公共 Composables**：复用逻辑，减少重复代码

## 常见陷阱

### ❌ 错误

```typescript
// 在 setup 外使用 computed/ref
const store = useStore()
const value = computed(() => store.value) // ❌ 错误

// 不必要的深度响应
const largeObject = ref(heavyData) // ❌ 应使用 shallowRef

// 重复的状态管理逻辑
// 每个组件都写一遍状态颜色映射 // ❌ 应抽取为 composable
```

### ✅ 正确

```typescript
// 在 setup 或 composable 中使用
export const useMyComposable = () => {
  const store = useStore()
  const value = computed(() => store.value) // ✅ 正确
  return { value }
}

// 性能优化
const largeObject = shallowRef(heavyData) // ✅ 正确

// 抽取可复用逻辑
const { getStatusClass } = useStatusStyle() // ✅ 正确
```
