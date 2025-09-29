# 用户认证功能设计规范

## 1. 设计概述

### 1.1 设计目标
用户认证功能的设计旨在提供安全、便捷、直观的用户身份验证体验，确保系统安全性的同时优化用户操作流程。

### 1.2 设计原则
- **安全性优先**：所有设计决策都以安全性为第一考量
- **用户体验**：简化认证流程，减少用户操作步骤
- **一致性**：保持与整体系统设计风格的一致性
- **可访问性**：支持不同设备和用户群体的使用需求

## 2. 用户界面设计

### 2.1 登录页面设计

#### 2.1.1 页面布局
```
┌─────────────────────────────────────────────────────────┐
│                    顶部导航栏                            │
│  [Logo] 芋道管理后台                    [语言切换] [帮助] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │                 │    │                             │  │
│  │   左侧图片区域   │    │       登录表单区域          │  │
│  │                 │    │                             │  │
│  │   [产品介绍图]   │    │  ┌─────────────────────┐  │  │
│  │                 │    │  │   用户名输入框        │  │  │
│  │                 │    │  └─────────────────────┘  │  │
│  │                 │    │  ┌─────────────────────┐  │  │
│  │                 │    │  │   密码输入框        │  │  │
│  │                 │    │  └─────────────────────┘  │  │
│  │                 │    │  ┌─────────────────────┐  │  │
│  │                 │    │  │  □ 记住我  □ 自动登录│  │  │
│  │                 │    │  └─────────────────────┘  │  │
│  │                 │    │  ┌─────────────────────┐  │  │
│  │                 │    │  │    [登录按钮]        │  │  │
│  │                 │    │  └─────────────────────┘  │  │
│  │                 │    │  ┌─────────────────────┐  │  │
│  │                 │    │  │   [忘记密码] [注册]  │  │  │
│  │                 │    │  └─────────────────────┘  │  │
│  └─────────────────┘    └─────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    底部版权信息                          │
│        © 2025 芋道源码. All rights reserved.            │
└─────────────────────────────────────────────────────────┘
```

#### 2.1.2 视觉设计规范
- **主色调**：使用系统主色 #409EFF
- **背景色**：渐变背景 #f5f7fa 到 #ffffff
- **卡片样式**：圆角8px，阴影0 2px 12px rgba(0,0,0,0.1)
- **输入框样式**：边框1px solid #dcdfe6，聚焦时边框变为主色
- **按钮样式**：主按钮使用主色背景，次要按钮使用边框样式

#### 2.1.3 交互设计
- **表单验证**：实时验证用户输入，显示错误提示
- **加载状态**：登录过程中显示加载动画和禁用状态
- **错误处理**：清晰的错误信息提示和恢复指导
- **键盘导航**：支持Tab键切换，Enter键提交

### 2.2 密码管理界面设计

#### 2.2.1 密码修改页面
```
┌─────────────────────────────────────────────────────────┐
│  [面包屑导航] 首页 > 个人中心 > 密码修改                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   密码修改                          │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 当前密码: [输入框]                           │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 新密码: [输入框] [显示/隐藏密码]              │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 确认密码: [输入框]                          │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 密码强度指示器: [●●●○○] 强                  │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 密码要求:                                  │   │ │
│  │  │ • 至少8位字符                              │   │ │
│  │  │ • 包含字母和数字                           │   │ │
│  │  │ • 不能与当前密码相同                       │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │        [取消]        [确认修改]              │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 2.2.2 密码重置页面
```
┌─────────────────────────────────────────────────────────┐
│  [面包屑导航] 首页 > 忘记密码                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   密码重置                          │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 邮箱地址: [输入框] [发送验证码]               │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 验证码: [输入框] [重新发送(60s)]             │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 新密码: [输入框] [显示/隐藏密码]              │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 确认密码: [输入框]                          │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │        [返回登录]      [重置密码]            │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.3 多因素认证界面设计

#### 2.3.1 短信验证码登录
```
┌─────────────────────────────────────────────────────────┐
│  [面包屑导航] 首页 > 短信登录                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   短信验证码登录                      │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 手机号码: [输入框] [获取验证码]               │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ 验证码: [输入框] [重新发送(60s)]             │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │        [返回]        [登录]                  │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 2.3.2 第三方登录
```
┌─────────────────────────────────────────────────────────┐
│  [面包屑导航] 首页 > 第三方登录                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   第三方登录                         │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │ │
│  │  │  │  微信   │  │   QQ    │  │  微博   │    │   │ │
│  │  │  │ 登录    │  │  登录   │  │  登录   │    │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘    │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │  ┌─────────────────────────────────────┐   │   │ │
│  │  │  │  ┌─────────┐  ┌─────────┐        │   │   │ │
│  │  │  │  │  GitHub │  │  Google │        │   │   │ │
│  │  │  │  │  登录   │  │  登录   │        │   │   │ │
│  │  │  │  └─────────┘  └─────────┘        │   │   │ │
│  │  │  └─────────────────────────────────────┘   │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │        [返回]        [其他登录方式]          │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 3. 组件设计规范

### 3.1 登录表单组件

#### 3.1.1 LoginForm.vue
```vue
<template>
  <div class="login-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          prefix-icon="User"
          size="large"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          size="large"
          show-password
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-form-item>
        <div class="form-options">
          <el-checkbox v-model="form.rememberMe">
            记住我
          </el-checkbox>
          <el-checkbox v-model="form.autoLogin">
            自动登录
          </el-checkbox>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSubmit"
          class="login-button"
        >
          {{ loading ? '登录中...' : '登录' }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="form-footer">
      <el-link type="primary" @click="handleForgotPassword">
        忘记密码？
      </el-link>
      <el-link type="primary" @click="handleRegister">
        立即注册
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
  autoLogin: boolean
}

const authStore = useAuthStore()
const router = useRouter()

const formRef = ref()
const loading = ref(false)

const form = reactive<LoginForm>({
  username: '',
  password: '',
  rememberMe: false,
  autoLogin: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login(form)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const handleRegister = () => {
  router.push('/register')
}
</script>

<style scoped lang="scss">
.login-form {
  width: 100%;
  max-width: 400px;

  .form-options {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
```

### 3.2 密码强度指示器组件

#### 3.2.1 PasswordStrength.vue
```vue
<template>
  <div class="password-strength">
    <div class="strength-bar">
      <div
        v-for="(level, index) in levels"
        :key="index"
        :class="[
          'strength-level',
          { active: index < strengthLevel }
        ]"
      />
    </div>
    <div class="strength-text">
      {{ strengthText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  password: string
}

const props = defineProps<Props>()

const levels = [1, 2, 3, 4, 5]

const strengthLevel = computed(() => {
  const password = props.password
  if (!password) return 0

  let score = 0

  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // 字符类型检查
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  return Math.min(score, 5)
})

const strengthText = computed(() => {
  const level = strengthLevel.value
  const texts = ['很弱', '弱', '一般', '强', '很强']
  return level > 0 ? texts[level - 1] : ''
})
</script>

<style scoped lang="scss">
.password-strength {
  margin-top: 8px;

  .strength-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;

    .strength-level {
      height: 4px;
      background-color: #e4e7ed;
      border-radius: 2px;
      flex: 1;
      transition: background-color 0.3s;

      &.active {
        background-color: #67c23a;
      }
    }
  }

  .strength-text {
    font-size: 12px;
    color: #606266;
  }
}
</style>
```

### 3.3 权限控制组件

#### 3.3.1 PermissionWrapper.vue
```vue
<template>
  <div v-if="hasPermission" class="permission-wrapper">
    <slot />
  </div>
  <div v-else-if="showFallback" class="permission-fallback">
    <slot name="fallback">
      <el-empty description="暂无权限访问此内容" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'

interface Props {
  permission?: string | string[]
  role?: string | string[]
  mode?: 'all' | 'any'
  showFallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'any',
  showFallback: false
})

const { hasPermission: checkPermission, hasRole: checkRole } = usePermission()

const hasPermission = computed(() => {
  if (props.permission) {
    if (Array.isArray(props.permission)) {
      return props.mode === 'all'
        ? props.permission.every(p => checkPermission(p))
        : props.permission.some(p => checkPermission(p))
    }
    return checkPermission(props.permission)
  }

  if (props.role) {
    if (Array.isArray(props.role)) {
      return props.mode === 'all'
        ? props.role.every(r => checkRole(r))
        : props.role.some(r => checkRole(r))
    }
    return checkRole(props.role)
  }

  return true
})
</script>

<style scoped lang="scss">
.permission-wrapper {
  // 权限组件样式
}

.permission-fallback {
  // 无权限时的样式
}
</style>
```

## 4. 响应式设计

### 4.1 断点设置
```scss
// 响应式断点
$breakpoints: (
  xs: 0,
  sm: 768px,
  md: 992px,
  lg: 1200px,
  xl: 1920px
);

// 媒体查询混合器
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### 4.2 移动端适配
```scss
// 移动端登录页面样式
.login-page {
  @include respond-to(sm) {
    .login-container {
      flex-direction: column;

      .login-image {
        display: none;
      }

      .login-form {
        width: 100%;
        padding: 20px;
      }
    }
  }
}
```

## 5. 无障碍设计

### 5.1 键盘导航
- 支持Tab键在表单元素间切换
- 支持Enter键提交表单
- 支持Esc键关闭弹窗和提示

### 5.2 屏幕阅读器支持
- 为所有交互元素添加适当的aria-label
- 提供清晰的错误信息提示
- 使用语义化的HTML结构

### 5.3 颜色对比度
- 确保文字与背景的对比度符合WCAG 2.1 AA标准
- 错误信息使用红色，成功信息使用绿色
- 提供高对比度模式选项

## 6. 动画和过渡效果

### 6.1 页面切换动画
```scss
// 页面切换动画
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
```

### 6.2 表单验证动画
```scss
// 表单验证动画
.form-item {
  .el-form-item__error {
    animation: shake 0.3s ease-in-out;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### 6.3 加载状态动画
```scss
// 加载按钮动画
.loading-button {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: loading 1.5s infinite;
  }
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

## 7. 主题定制

### 7.1 颜色主题
```scss
// 主题颜色变量
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;

  --text-primary: #303133;
  --text-secondary: #606266;
  --text-placeholder: #c0c4cc;

  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --border-color: #dcdfe6;
}
```

### 7.2 暗色主题
```scss
// 暗色主题
[data-theme="dark"] {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;

  --text-primary: #e4e7ed;
  --text-secondary: #c0c4cc;
  --text-placeholder: #909399;

  --bg-primary: #1d1e1f;
  --bg-secondary: #2d2d2d;
  --border-color: #4c4d4f;
}
```

---

**文档版本**：1.0
**创建时间**：2025-01-25
**维护人员**：设计团队
**审核状态**：待审核
