# 组件架构与设计模式

项目组件设计原则和架构模式。

## 组件分层

### 全局组件 (`src/components/`)

用于跨模块复用的基础组件。

```
src/components/
├── AppCard/           # 卡片容器
├── AppHeader/         # 应用头部
├── ContentWrap/       # 内容包装器
├── Dialog/            # 对话框
├── Form/              # 表单组件
├── Table/             # 表格组件
└── ...
```

**特点**：
- 自动注册（通过 `setupGlobCom`）
- 高度可复用
- 最小化依赖
- 完善的类型定义
- README.md 文件被排除在自动注册之外（避免命名冲突）

**创建规范**：
```
ComponentName/
├── src/
│   └── ComponentName.vue    # 主组件
├── index.ts                 # 导出入口
└── types.ts                 # 类型定义
```

### 页面组件 (`src/views/`)

特定业务模块的页面级组件。

```
src/views/
├── Home/
│   ├── Index.vue           # 页面入口
│   ├── components/         # 页面专用组件
│   │   ├── StatCard.vue
│   │   └── widgets/        # Widget 组件
│   ├── composables/        # 页面专用 hooks
│   ├── config/             # 配置文件
│   ├── types/              # 类型定义
│   └── utils/              # 工具函数
```

**特点**：
- 按功能模块组织
- 包含业务逻辑
- 可以依赖全局组件
- 模块内复用

## 组件设计原则

### 1. 单一职责

每个组件只负责一个功能。

```vue
<!-- ❌ 错误：一个组件做太多事 -->
<template>
  <div>
    <UserProfile />
    <UserSettings />
    <UserNotifications />
  </div>
</template>

<!-- ✅ 正确：拆分为独立组件 -->
<!-- UserDashboard.vue -->
<template>
  <div>
    <UserProfile />
    <UserSettings />
    <UserNotifications />
  </div>
</template>

<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <!-- 仅处理用户资料 -->
  </div>
</template>
```

### 2. Props Down, Events Up

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent
    :data="userData"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
// Props down: 父组件传递数据
const userData = ref({ name: 'John' })

// Events up: 子组件触发事件
const handleUpdate = (newData) => {
  userData.value = newData
}
</script>

<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  data: { name: string }
}

interface Emits {
  (e: 'update', data: { name: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleChange = () => {
  emit('update', { name: 'Jane' })
}
</script>
```

### 3. 组合优于继承

使用 Composables 而不是 mixins。

```typescript
// ❌ 避免：Mixins（难以追踪来源）
export default {
  mixins: [userMixin, authMixin]
}

// ✅ 推荐：Composables（清晰的来源）
<script setup lang="ts">
import { useUser } from '@/composables/useUser'
import { useAuth } from '@/composables/useAuth'

const { user, fetchUser } = useUser()
const { isAuthenticated, login } = useAuth()
</script>
```

## 配置驱动架构

### Home 页面布局系统

采用配置驱动的角色布局系统。

**架构流程**：
```
用户登录 → 获取角色 → 匹配布局配置 → 动态渲染组件
```

**核心文件**：

```typescript
// 1. types/layout.ts - 定义类型
export enum HomeComponentType {
  BANNER = 'Banner',
  STATS = 'Stats',
  RESOURCE_USAGE = 'ResourceUsage',
  MESSAGES = 'Messages',
  HELP_DOCS = 'HelpDocs',
  Feedback = 'Feedback'
}

export interface ComponentConfig {
  type: HomeComponentType
  title?: string
  showViewAll?: boolean
  hidden?: boolean
  order: number
  props?: Record<string, any>
}

export interface LayoutColumn {
  span: {
    xl: number
    lg: number
    md: number
    sm: number
    xs: number
  }
  components: ComponentConfig[]
}

export interface HomeLayoutConfig {
  left: LayoutColumn
  right: LayoutColumn
}

export type RoleLayoutConfigMap = Record<string, HomeLayoutConfig>
```

```typescript
// 2. utils/componentMap.ts - 注册组件
import { markRaw, type Component } from 'vue'
import Banner from '../components/banner.vue'
import StatCard from '../components/StatCard.vue'
import ResourceUsageCard from '../components/ResourceUsageCard.vue'

export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.BANNER]: markRaw(Banner),
  [HomeComponentType.STATS]: markRaw(StatCard),
  [HomeComponentType.RESOURCE_USAGE]: markRaw(ResourceUsageCard),
  [HomeComponentType.MESSAGES]: markRaw(MessagesWidget),
  [HomeComponentType.HELP_DOCS]: markRaw(HelpDocsWidget),
  [HomeComponentType.Feedback]: markRaw(Feedback)
}
```

```typescript
// 3. config/roleLayout.ts - 配置布局
const projectMemberLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      { type: HomeComponentType.BANNER, order: 0 },
      { type: HomeComponentType.MY_APPLICATIONS, order: 1 },
      { type: HomeComponentType.Feedback, order: 2 }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      { type: HomeComponentType.RESOURCE_USAGE, order: 1 },
      { type: HomeComponentType.MESSAGES, order: 2 },
      { type: HomeComponentType.HELP_DOCS, order: 3 }
    ]
  }
}

export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  projectMember: projectMemberLayout,
  resourceAdmin: resourceAdminLayout,
  operationAdmin: operationAdminLayout
}
```

```vue
<!-- 4. Index.vue - 渲染布局 -->
<template>
  <el-row :gutter="16">
    <el-col v-bind="layout.left.span">
      <component
        v-for="config in sortedLeftComponents"
        :key="config.type"
        :is="getComponent(config.type)"
        v-bind="config.props"
      />
    </el-col>
    <el-col v-bind="layout.right.span">
      <component
        v-for="config in sortedRightComponents"
        :key="config.type"
        :is="getComponent(config.type)"
        v-bind="config.props"
      />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { ROLE_LAYOUT_CONFIG } from './config/roleLayout'
import { COMPONENT_MAP } from './utils/componentMap'

const userStore = useUserStoreWithOut()

const layout = computed(() => {
  const roles = userStore.getRoles
  const primaryRole = roles[0]
  return ROLE_LAYOUT_CONFIG[primaryRole] || ROLE_LAYOUT_CONFIG.projectMember
})

const getComponent = (type: HomeComponentType) => {
  return COMPONENT_MAP[type]
}

const sortedLeftComponents = computed(() =>
  layout.value.left.components
    .filter(c => !c.hidden)
    .sort((a, b) => a.order - b.order)
)

const sortedRightComponents = computed(() =>
  layout.value.right.components
    .filter(c => !c.hidden)
    .sort((a, b) => a.order - b.order)
)
</script>
```

### 添加新角色布局

**步骤**：

1. **创建 Widget 组件**（如需要）
   ```vue
   <!-- src/views/Home/components/widgets/MyWidget.vue -->
   <template>
     <AppCard class="mt-16px p-24px">
       <!-- Widget content -->
     </AppCard>
   </template>

   <script setup lang="ts">
   defineOptions({ name: 'MyWidget' })
   </script>
   ```

2. **添加组件类型枚举**
   ```typescript
   // src/views/Home/types/layout.ts
   export enum HomeComponentType {
     // ...
     MY_WIDGET = 'MyWidget',
   }
   ```

3. **注册组件**
   ```typescript
   // src/views/Home/utils/componentMap.ts
   import MyWidget from '../components/widgets/MyWidget.vue'

   export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
     // ...
     [HomeComponentType.MY_WIDGET]: markRaw(MyWidget),
   }
   ```

4. **配置角色布局**
   ```typescript
   // src/views/Home/config/roleLayout.ts
   const newRoleLayout: HomeLayoutConfig = {
     left: {
       span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
       components: [
         { type: HomeComponentType.MY_WIDGET, order: 1 }
       ]
     },
     right: {
       span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
       components: [
         { type: HomeComponentType.MESSAGES, order: 1 }
       ]
     }
   }

   export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
     // ...
     newRole: newRoleLayout,
   }
   ```

5. **添加测试账号**（可选）
   ```typescript
   // src/mock/modules/auth/login.ts
   const userConfigs: Record<string, UserConfig> = {
     // ...
     newRole: {
       user: {
         id: 6,
         nickname: '新角色',
         username: 'newRole',
         // ...
       },
       roles: ['newRole'],
       permissions: [/* ... */]
     }
   }
   ```

## 性能优化模式

### 1. 使用 markRaw

对于静态配置和组件注册，使用 `markRaw` 避免响应式开销。

```typescript
// ✅ 正确：组件映射使用 markRaw
export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.WIDGET]: markRaw(Widget)
}

// ❌ 错误：不必要的响应式
export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  [HomeComponentType.WIDGET]: Widget // Vue 会尝试使其响应式
}
```

### 2. 使用 shallowRef

对于大型对象或第三方实例。

```typescript
import { shallowRef } from 'vue'

// ✅ 第三方库实例
const bpmnModeler = shallowRef<BpmnModeler>()
const editorInstance = shallowRef<Editor>()
```

### 3. 使用 computedEager

减少响应式追踪开销。

```typescript
import { computedEager } from '@vueuse/core'

// ✅ 布局计算使用 computedEager
const pageLoading = computedEager(() => appStore.getPageLoading)
const collapse = computedEager(() => appStore.getCollapse)
```

### 4. 组件懒加载

```typescript
import { defineAsyncComponent } from 'vue'

// 重型组件按需加载
const HeavyChart = defineAsyncComponent(() =>
  import('./HeavyChart.vue')
)
```

## 样式架构

### UnoCSS 优先

```vue
<template>
  <!-- ✅ 优先使用 UnoCSS utilities -->
  <div class="flex items-center justify-between p-16px">
    <span class="text-14px text-[#303133] font-500">Title</span>
  </div>

  <!-- ⚠️ 仅在必要时使用 scoped styles -->
  <div class="custom-component">
    <!-- 复杂样式逻辑 -->
  </div>
</template>

<style lang="scss" scoped>
// 仅用于复杂样式或动画
.custom-component {
  // SCSS 变量和 mixins
}
</style>
```

### 命名规范

- **文件名**: `kebab-case.vue`
- **组件名**: `PascalCase`
- **CSS 类名**: `kebab-case`
- **常量**: `SCREAMING_SNAKE_CASE`
- **函数/变量**: `camelCase`

## 组件通信模式

### 1. Props / Emits（父子）

```vue
<!-- Parent.vue -->
<template>
  <Child :value="data" @update="handleUpdate" />
</template>

<!-- Child.vue -->
<script setup lang="ts">
interface Props {
  value: string
}

interface Emits {
  (e: 'update', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
```

### 2. Provide / Inject（跨层级）

```vue
<!-- Ancestor.vue -->
<script setup lang="ts">
import { provide } from 'vue'

const theme = ref('dark')
provide('theme', theme)
</script>

<!-- Descendant.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const theme = inject<Ref<string>>('theme')
</script>
```

### 3. Pinia Store（全局状态）

```typescript
// store/modules/app.ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    collapse: false,
    pageLoading: false
  }),
  actions: {
    setCollapse(value: boolean) {
      this.collapse = value
    }
  }
})

// 组件中使用
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
appStore.setCollapse(true)
```

### 4. Event Bus（解耦通信）

```typescript
// utils/eventBus.ts
import mitt from 'mitt'

type Events = {
  'user:login': { id: number; name: string }
  'user:logout': void
}

export const eventBus = mitt<Events>()

// 发送事件
eventBus.emit('user:login', { id: 1, name: 'John' })

// 监听事件
eventBus.on('user:login', (user) => {
  console.log(user)
})
```

## 最佳实践总结

1. **保持组件小而专注** - 单一职责原则
2. **使用配置驱动** - 减少硬编码，提高灵活性
3. **性能优化** - 合理使用 markRaw, shallowRef, computedEager
4. **类型安全** - 完善的 TypeScript 类型定义
5. **样式优先级** - UnoCSS > SCSS variables > Scoped styles
6. **可测试性** - 抽取逻辑到 composables
7. **文档化** - 复杂组件添加注释和使用示例
