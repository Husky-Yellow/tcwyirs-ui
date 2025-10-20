# Drawer 抽屉组件

基于 Element Plus `el-drawer` 封装的抽屉组件,提供更便捷的使用方式和插槽支持。

## 功能特性

- ✅ 基于 Element Plus ElDrawer 封装
- ✅ 支持 v-model 双向绑定
- ✅ 完整的插槽支持(header、default、footer)
- ✅ 可配置的抽屉方向(左、右、上、下)
- ✅ 自定义尺寸支持
- ✅ 完整的生命周期事件
- ✅ TypeScript 类型支持
- ✅ 响应式设计
- ✅ 符合项目代码规范

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'

const showDrawer = ref(false)

const handleOpen = () => {
  console.log('抽屉打开中...')
}

const handleClose = () => {
  console.log('抽屉关闭中...')
}
</script>

<template>
  <el-button @click="showDrawer = true">打开抽屉</el-button>

  <Drawer v-model="showDrawer" title="抽屉标题" @open="handleOpen" @close="handleClose">
    <p>这是抽屉的内容</p>
  </Drawer>
</template>
```

### 自定义头部

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'

const showDrawer = ref(false)
</script>

<template>
  <Drawer v-model="showDrawer">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-18px font-bold">自定义头部</span>
        <el-tag type="success">标签</el-tag>
      </div>
    </template>

    <p>自定义头部内容的抽屉</p>
  </Drawer>
</template>
```

### 带底部操作栏

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'

const showDrawer = ref(false)
const formData = ref({
  name: '',
  email: ''
})

const handleSubmit = () => {
  console.log('提交:', formData.value)
  showDrawer.value = false
}

const handleCancel = () => {
  showDrawer.value = false
}
</script>

<template>
  <Drawer v-model="showDrawer" title="编辑用户" size="500px">
    <!-- 内容区 -->
    <el-form :model="formData" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email" />
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </Drawer>
</template>
```

### 不同方向的抽屉

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'

const showRight = ref(false)
const showLeft = ref(false)
const showTop = ref(false)
const showBottom = ref(false)
</script>

<template>
  <div>
    <!-- 从右侧打开(默认) -->
    <el-button @click="showRight = true">从右侧打开</el-button>
    <Drawer v-model="showRight" title="右侧抽屉" direction="rtl">
      内容区域
    </Drawer>

    <!-- 从左侧打开 -->
    <el-button @click="showLeft = true">从左侧打开</el-button>
    <Drawer v-model="showLeft" title="左侧抽屉" direction="ltr">
      内容区域
    </Drawer>

    <!-- 从顶部打开 -->
    <el-button @click="showTop = true">从顶部打开</el-button>
    <Drawer v-model="showTop" title="顶部抽屉" direction="ttb" size="300px">
      内容区域
    </Drawer>

    <!-- 从底部打开 -->
    <el-button @click="showBottom = true">从底部打开</el-button>
    <Drawer v-model="showBottom" title="底部抽屉" direction="btt" size="300px">
      内容区域
    </Drawer>
  </div>
</template>
```

### 无头部抽屉

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'

const showDrawer = ref(false)
</script>

<template>
  <Drawer v-model="showDrawer" :with-header="false">
    <div class="p-20px">
      <h2>自定义内容区</h2>
      <p>这个抽屉没有标准头部,完全自定义内容</p>
    </div>
  </Drawer>
</template>
```

### 完整功能示例

```vue
<script setup lang="ts">
import { Drawer } from '@/components/Drawer'
import { ElMessage } from 'element-plus'

const showDrawer = ref(false)
const loading = ref(false)

const formData = ref({
  title: '',
  content: '',
  category: ''
})

const handleOpen = () => {
  console.log('抽屉打开中')
}

const handleOpened = () => {
  console.log('抽屉已打开')
}

const handleClose = () => {
  console.log('抽屉关闭中')
}

const handleClosed = () => {
  console.log('抽屉已关闭')
  // 重置表单
  formData.value = { title: '', content: '', category: '' }
}

const handleSave = async () => {
  loading.value = true

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('保存数据:', formData.value)
    ElMessage.success('保存成功!')
    showDrawer.value = false
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-button type="primary" @click="showDrawer = true">
    打开编辑器
  </el-button>

  <Drawer
    v-model="showDrawer"
    title="文章编辑器"
    size="600px"
    direction="rtl"
    :close-on-click-modal="false"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 自定义头部 -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-12px">
          <Icon icon="ep:edit" :size="20" />
          <span class="text-16px font-600">文章编辑器</span>
        </div>
        <el-tag type="warning">草稿</el-tag>
      </div>
    </template>

    <!-- 内容区 -->
    <el-form :model="formData" label-width="80px" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="分类">
        <el-select v-model="formData.category" placeholder="请选择分类" class="w-full">
          <el-option label="技术" value="tech" />
          <el-option label="生活" value="life" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="内容">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>

    <!-- 底部操作栏 -->
    <template #footer>
      <el-button @click="showDrawer = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">
        保存
      </el-button>
    </template>
  </Drawer>
</template>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 是否显示抽屉(支持 v-model) | `boolean` | `false` |
| title | 抽屉标题 | `string` | `''` |
| size | 抽屉尺寸 | `string \| number` | `'30%'` |
| direction | 抽屉打开方向 | `'ltr' \| 'rtl' \| 'ttb' \| 'btt'` | `'rtl'` |
| showClose | 是否显示关闭按钮 | `boolean` | `true` |
| modal | 是否显示遮罩层 | `boolean` | `true` |
| closeOnClickModal | 点击遮罩层是否关闭抽屉 | `boolean` | `true` |
| closeOnPressEscape | 按 ESC 键是否关闭抽屉 | `boolean` | `true` |
| destroyOnClose | 关闭时销毁子元素 | `boolean` | `true` |
| withHeader | 是否显示头部 | `boolean` | `true` |
| zIndex | 层级 | `number` | `2000` |

### Direction 说明

- `rtl` - 从右向左打开(默认)
- `ltr` - 从左向右打开
- `ttb` - 从上向下打开
- `btt` - 从下向上打开

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 抽屉显示状态变化时触发 | `(value: boolean) => void` |
| open | 抽屉打开动画开始时触发 | `() => void` |
| opened | 抽屉打开动画结束时触发 | `() => void` |
| close | 抽屉关闭动画开始时触发 | `() => void` |
| closed | 抽屉关闭动画结束时触发 | `() => void` |

## Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| default | 抽屉主体内容 | - |
| header | 自定义头部内容 | - |
| footer | 自定义底部内容 | - |

## 类型定义

```typescript
export interface DrawerProps {
  modelValue: boolean
  title?: string
  size?: string | number
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showClose?: boolean
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  destroyOnClose?: boolean
  withHeader?: boolean
  zIndex?: number
}
```

## 样式定制

组件使用了项目的 SCSS 变量和 Element Plus 主题变量,自动适配项目主题。

默认样式类:
- `.v-drawer` - 抽屉根容器
- `.v-drawer__header` - 头部容器
- `.v-drawer__title` - 标题文本
- `.v-drawer__body` - 主体内容区
- `.v-drawer__footer` - 底部操作区

自定义样式示例:

```scss
// 覆盖抽屉样式
.v-drawer {
  :deep(.el-drawer__header) {
    background-color: #f5f5f5;
  }

  :deep(.el-drawer__body) {
    padding: 30px;
  }
}
```

## 使用场景

1. **表单编辑** - 侧边栏表单编辑,不影响主界面
2. **详情展示** - 展示详细信息,支持快速关闭
3. **多级导航** - 嵌套抽屉实现多级内容
4. **筛选面板** - 高级筛选、配置面板
5. **消息通知** - 侧边消息、通知列表
6. **文件预览** - 文档、图片预览面板

## 注意事项

1. 组件已配置自动导入,无需手动 import
2. 基于 Element Plus `ElDrawer`,继承其所有功能
3. 默认开启 `destroyOnClose`,关闭后会销毁内容
4. 使用 `v-model` 进行双向绑定
5. 支持所有 Element Plus Drawer 的原生属性透传

## 最佳实践

### 1. 表单场景使用 footer 插槽

```vue
<Drawer v-model="visible" title="编辑">
  <el-form><!-- 表单内容 --></el-form>
  <template #footer>
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </template>
</Drawer>
```

### 2. 详情展示不需要 footer

```vue
<Drawer v-model="visible" title="详情">
  <div><!-- 详情内容 --></div>
</Drawer>
```

### 3. 需要防止误关闭时

```vue
<Drawer
  v-model="visible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
>
  <div><!-- 重要表单 --></div>
</Drawer>
```

### 4. 嵌套抽屉

```vue
<Drawer v-model="outerVisible" title="外层抽屉">
  <el-button @click="innerVisible = true">打开内层</el-button>

  <Drawer v-model="innerVisible" title="内层抽屉" :z-index="2001">
    内层内容
  </Drawer>
</Drawer>
```

## 文件结构

```
src/components/Drawer/
├── src/
│   ├── Drawer.vue    # 主组件
│   └── types.ts      # TypeScript 类型定义
├── index.ts          # 导出文件
└── README.md         # 使用文档
```

## 与 Dialog 组件的区别

| 特性 | Drawer | Dialog |
|------|--------|--------|
| 展示方式 | 从屏幕边缘滑入 | 居中弹出 |
| 适用场景 | 表单编辑、详情展示 | 确认提示、简单表单 |
| 空间利用 | 不遮挡主界面 | 完全遮挡 |
| 层级关系 | 更适合多级内容 | 更适合单层交互 |
| 用户体验 | 更流畅自然 | 更明确强调 |

根据实际场景选择合适的组件!
