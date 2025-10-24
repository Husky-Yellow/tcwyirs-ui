# 首页配置化系统

## 📁 目录结构

```
src/views/Home/
├── Index.vue                          # 首页主文件（动态渲染）
├── README.md                          # 本文档
├── components/
│   ├── banner.vue                     # 横幅组件
│   ├── ResourceUsageCard.vue          # 资源使用看板
│   ├── StatCard.vue                   # 统计卡片
│   └── widgets/                       # 可配置的组件
│       ├── BrowsedResourcesWidget.vue      # 浏览资源组件
│       ├── FavoriteResourcesWidget.vue     # 收藏资源组件
│       ├── HelpDocsWidget.vue              # 帮助文档组件
│       ├── MessagesWidget.vue              # 消息组件
│       └── ResourceUsageWidget.vue         # 资源使用组件
├── composables/
│   └── useHomeLayout.ts               # 布局配置 Composable
├── config/
│   └── roleLayout.ts                  # 角色布局配置
├── types/
│   └── layout.ts                      # 类型定义
├── utils/
│   └── componentMap.ts                # 组件映射表
└── mock/
    └── data.ts                        # Mock 数据
```

## 🎯 核心概念

### 1. 多角色配置

系统支持根据不同角色展示不同的首页布局。每个角色可以配置：
- 左右列的宽度比例
- 显示哪些组件
- 组件的顺序
- 组件的标题和参数

### 2. 组件类型

所有可配置的组件类型定义在 `types/layout.ts`：

```typescript
export enum HomeComponentType {
  BROWSED_RESOURCES = 'BrowsedResources',      // 浏览资源统计
  FAVORITE_RESOURCES = 'FavoriteResources',    // 收藏资源
  HELP_DOCS = 'HelpDocs',                      // 帮助文档
  RESOURCE_USAGE = 'ResourceUsage',            // 资源使用看板
  MESSAGES = 'Messages',                       // 消息列表
  CUSTOM = 'Custom'                            // 自定义组件（预留）
}
```

## 🔧 使用方法

### 1. 配置角色布局

在 `config/roleLayout.ts` 中定义角色布局：

```typescript
const adminLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.BROWSED_RESOURCES,
        title: '我浏览过的资源',
        showViewAll: true,
        order: 1
      },
      {
        type: HomeComponentType.HELP_DOCS,
        title: '帮助文档',
        showViewAll: true,
        order: 2
      }
    ]
  },
  right: {
    span: { xl: 8, lg: 8, md: 24, sm: 24, xs: 24 },
    components: [
      {
        type: HomeComponentType.RESOURCE_USAGE,
        order: 1
      },
      {
        type: HomeComponentType.MESSAGES,
        title: '消息',
        showViewAll: true,
        order: 2
      }
    ]
  }
}

// 注册到角色配置映射
export const ROLE_LAYOUT_CONFIG: RoleLayoutConfigMap = {
  admin: adminLayout,
  user: userLayout,
  guest: guestLayout
}
```

### 2. 获取用户角色

在 `composables/useHomeLayout.ts` 中修改角色获取逻辑：

```typescript
const currentRole = computed(() => {
  // 从用户 store 获取角色
  return userStore.getUserInfo?.role || 'user'
})
```

**⚠️ 需要根据项目实际情况调整角色获取方式**

### 3. 添加新组件

#### 步骤 1: 创建 Widget 组件

在 `components/widgets/` 下创建新组件：

```vue
<!-- MyCustomWidget.vue -->
<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="py-11px px-20px">
        {{ title }}
        <el-link v-if="showViewAll" type="primary" :underline="false">全部</el-link>
      </div>
    </template>
    <!-- 你的内容 -->
  </AppCard>
</template>

<script lang="ts" setup>
defineOptions({ name: 'MyCustomWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '自定义组件',
  showViewAll: true
})
</script>
```

#### 步骤 2: 添加组件类型

在 `types/layout.ts` 中添加新类型：

```typescript
export enum HomeComponentType {
  // ... 现有类型
  MY_CUSTOM = 'MyCustom'  // 添加新类型
}
```

#### 步骤 3: 注册组件

在 `utils/componentMap.ts` 中注册：

```typescript
import MyCustomWidget from '../components/widgets/MyCustomWidget.vue'

export const COMPONENT_MAP: Record<HomeComponentType, Component> = {
  // ... 现有映射
  [HomeComponentType.MY_CUSTOM]: markRaw(MyCustomWidget)
}
```

#### 步骤 4: 在配置中使用

在 `config/roleLayout.ts` 中使用新组件：

```typescript
components: [
  {
    type: HomeComponentType.MY_CUSTOM,
    title: '我的自定义组件',
    showViewAll: true,
    order: 1,
    props: {
      // 自定义参数
      customProp: 'value'
    }
  }
]
```

## 📊 内置角色配置

### Admin（管理员）
- **左侧**（16栏）：浏览资源 + 收藏资源 + 帮助文档
- **右侧**（8栏）：资源使用看板 + 消息

### User（普通用户）
- **左侧**（16栏）：浏览资源 + 帮助文档
- **右侧**（8栏）：消息

### Guest（访客）
- **左侧**（16栏）：帮助文档
- **右侧**（8栏）：公告

### DataAdmin（数据管理员）
- **左侧**（18栏）：资源使用看板 + 浏览资源
- **右侧**（6栏）：系统通知

## 🎨 组件配置选项

### HomeComponentConfig

```typescript
interface HomeComponentConfig {
  type: HomeComponentType       // 组件类型（必填）
  title?: string               // 组件标题（可选，覆盖默认标题）
  showViewAll?: boolean        // 是否显示"全部"链接（可选）
  props?: Record<string, any>  // 自定义参数（可选）
  hidden?: boolean             // 是否隐藏（可选）
  order?: number               // 排序权重，数字越小越靠前（可选）
}
```

### 列配置

```typescript
interface HomeColumnConfig {
  span: {
    xl: number   // 超大屏幕（≥1920px）
    lg: number   // 大屏幕（≥1200px）
    md: number   // 中等屏幕（≥992px）
    sm: number   // 小屏幕（≥768px）
    xs: number   // 超小屏幕（<768px）
  }
  components: HomeComponentConfig[]
}
```

## 🔄 数据流

```
用户登录
  ↓
获取角色信息 (useHomeLayout)
  ↓
根据角色获取布局配置 (getRoleLayoutConfig)
  ↓
解析配置，排序组件 (getSortedComponents)
  ↓
根据组件类型获取实际组件 (getComponentByType)
  ↓
动态渲染组件 (component :is)
```

## 🚀 优势

1. **灵活配置**：通过 JSON 配置控制布局，无需修改模板代码
2. **角色隔离**：不同角色看到不同内容，提升用户体验
3. **易于扩展**：添加新组件只需 3 步
4. **类型安全**：完整的 TypeScript 类型支持
5. **组件复用**：Widget 组件可独立使用
6. **性能优化**：使用 `markRaw` 避免不必要的响应式

## 📝 注意事项

1. **角色获取**：需要根据项目实际情况修改 `useHomeLayout.ts` 中的角色获取逻辑
2. **组件顺序**：使用 `order` 字段控制组件显示顺序，数字越小越靠前
3. **响应式布局**：通过 `span` 配置控制不同屏幕尺寸下的列宽
4. **组件隔离**：每个 Widget 组件应该是独立的，不依赖外部状态
5. **默认配置**：如果角色配置不存在，会使用 `user` 角色配置作为默认

## 🔍 调试技巧

```typescript
// 在 Index.vue 中添加调试信息
import { useHomeLayout } from './composables/useHomeLayout'

const { currentRole, layoutConfig } = useHomeLayout()

console.log('当前角色:', currentRole.value)
console.log('布局配置:', layoutConfig.value)
```

## 💡 最佳实践

1. **命名规范**：组件类型使用大写驼峰，组件文件使用 PascalCase
2. **配置分离**：将不同环境的配置分离到不同文件
3. **类型定义**：为自定义 props 定义清晰的类型
4. **错误处理**：在组件中添加数据加载失败的处理
5. **性能优化**：大型列表使用虚拟滚动
