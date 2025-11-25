# 创建 Vue 组件

创建一个符合项目规范的 Vue 3 组件，包括 TypeScript 类型定义和测试文件。

## 使用方法

```
/component <组件名称> [选项]
```

## 选项

- `--widget` - 创建 Home 页面的 Widget 组件
- `--global` - 创建全局组件（自动注册）
- `--test` - 同时生成测试文件（默认启用）

## 示例

```
/component UserProfile
/component ResourceCard --widget
/component AppDialog --global
```

## 生成内容

### 1. 组件文件 (`ComponentName.vue`)
```vue
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  // Props definition
}

interface Emits {
  // Emits definition
}

defineOptions({ name: 'ComponentName' })

withDefaults(defineProps<Props>(), {
  // Defaults
})

const emit = defineEmits<Emits>()

// Component logic
</script>

<style lang="scss" scoped>
.component-name {
  // Styles using SCSS variables or UnoCSS classes
}
</style>
```

### 2. 类型文件 (`types.ts`)
```typescript
export interface ComponentNameProps {
  // Prop types
}

export interface ComponentNameEmits {
  // Emit types
}
```

### 3. 导出文件 (`index.ts`)
```typescript
import ComponentName from './ComponentName.vue'

export { ComponentName }
export type { ComponentNameProps, ComponentNameEmits } from './types'
```

### 4. 测试文件 (`ComponentName.test.ts`)
```typescript
import { mount } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'

describe('ComponentName', () => {
  it('should render correctly', () => {
    const wrapper = mount(ComponentName)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## 文件位置

- **页面组件**: `src/views/[模块]/components/`
- **Widget 组件**: `src/views/Home/components/widgets/`
- **全局组件**: `src/components/[组件名]/`

## 命名规范

- 文件名: `kebab-case.vue`
- 组件名: `PascalCase`
- 类名: `kebab-case`
