# 芋道管理后台技术规范

## 1. 技术架构概述

### 1.1 技术栈选型

**前端核心技术**:



*   **框架**: Vue 3.3.8 (Composition API)

*   **构建工具**: Vite 4.5.0

*   **编程语言**: TypeScript 5.2.2

*   **UI 组件库**: Element Plus 2.4.2

*   **状态管理**: Pinia 2.1.7

*   **路由管理**: Vue Router 4.2.5

*   **HTTP 客户端**: Axios 1.6.0+

*   **工具库**: VueUse 10.6.1

*   **国际化**: Vue I18n 9.6.5

**开发工具链**:



*   **代码检查**: ESLint 8.54.0+

*   **样式检查**: Stylelint 15.11.0+

*   **代码格式化**: Prettier 3.1.0+

*   **类型检查**: TypeScript Compiler

*   **构建工具**: Vite 4.5.0

*   **包管理**: pnpm 8.6.0+

### 1.2 架构设计原则



*   **模块化**: 按业务领域划分模块

*   **组件化**: 复用性和可维护性优先

*   **类型安全**: 全面使用 TypeScript

*   **响应式**: 基于 Vue 3 响应式系统

*   **声明式**: 声明式编程风格

*   **可测试**: 易于单元测试和集成测试

## 2. TypeScript 规范

### 2.1 类型定义规范

#### 2.1.1 基础类型使用



```
// ✅ 推荐使用

const userId: number = 1

const userName: string = 'admin'

const isActive: boolean = true

const userList: Array\<User> = \[]

// ❌ 避免使用

const userId: any = 1

const userName: Object = 'admin'
```

#### 2.1.2 接口定义



```
// ✅ 推荐使用

interface User {

&#x20; id: number

&#x20; name: string

&#x20; email: string

&#x20; status?: number

&#x20; createdAt: Date

}

// ✅ 扩展接口

interface AdminUser extends User {

&#x20; role: string

&#x20; permissions: string\[]

}
```

#### 2.1.3 类型别名



```
// ✅ 复杂类型使用type

type UserStatus = 'active' | 'inactive' | 'disabled'

type ApiResponse\<T = any> = {

&#x20; code: number

&#x20; message: string

&#x20; data: T

}

// ✅ 联合类型

type UserType = 'admin' | 'user' | 'guest'
```

#### 2.1.4 泛型使用



```
// ✅ 通用工具函数

function createArray\<T>(length: number, value: T): T\[] {

&#x20; return Array(length).fill(value)

}

// ✅ 泛型接口

interface ApiService\<T> {

&#x20; getById(id: number): Promise\<T>

&#x20; create(data: T): Promise\<T>

&#x20; update(id: number, data: Partial\<T>): Promise\<T>

&#x20; delete(id: number): Promise\<void>

}
```

### 2.2 类型检查严格模式



```
// tsconfig.json

{

&#x20; "compilerOptions": {

&#x20;   "strict": true,

&#x20;   "noImplicitAny": true,

&#x20;   "strictNullChecks": true,

&#x20;   "strictFunctionTypes": true,

&#x20;   "strictBindCallApply": true,

&#x20;   "strictPropertyInitialization": true,

&#x20;   "noImplicitThis": true,

&#x20;   "alwaysStrict": true

&#x20; }

}
```

### 2.3 类型守卫



```
// ✅ 类型守卫函数

function isUser(value: unknown): value is User {

&#x20; return typeof value === 'object' &&&#x20;

&#x20;        value !== null &&&#x20;

&#x20;        'id' in value &&&#x20;

&#x20;        'name' in value

}

// ✅ 类型断言

function getUserType(user: User): UserType {

&#x20; if (user.role === 'admin') {

&#x20;   return 'admin'

&#x20; }

&#x20; return 'user'

}
```

## 3. Vue 3 规范

### 3.1 组件定义规范

#### 3.1.1 单文件组件结构



```
\<!-- ✅ 推荐的组件结构 -->

\<template>

&#x20; \<div class="user-profile">

&#x20;   \<el-card :title="title">

&#x20;     \<user-avatar :user="user" />

&#x20;     \<div class="user-info">

&#x20;       \<span class="user-name">{{ user.name }}\</span>

&#x20;       \<span class="user-email">{{ user.email }}\</span>

&#x20;     \</div>

&#x20;   \</el-card>

&#x20; \</div>

\</template>

\<script setup lang="ts">

import { ref, computed } from 'vue'

import { ElCard } from 'element-plus'

import UserAvatar from './UserAvatar.vue'

interface User {

&#x20; id: number

&#x20; name: string

&#x20; email: string

&#x20; avatar?: string

}

interface Props {

&#x20; userId: number

&#x20; title?: string

}

const props = withDefaults(defineProps\<Props>(), {

&#x20; title: '用户信息'

})

const emit = defineEmits<{

&#x20; 'update:userId': \[id: number]

&#x20; 'user-change': \[user: User]

}>()

const user = ref\<User | null>(null)

const loading = ref(false)

const userName = computed(() => user.value?.name || '未知用户')

const fetchUser = async () => {

&#x20; loading.value = true

&#x20; try {

&#x20;   // 调用API获取用户信息

&#x20; } finally {

&#x20;   loading.value = false

&#x20; }

}

onMounted(() => {

&#x20; fetchUser()

})

\</script>

\<style scoped lang="scss">

.user-profile {

&#x20; padding: 20px;

&#x20;&#x20;

&#x20; .user-info {

&#x20;   margin-top: 16px;

&#x20;  &#x20;

&#x20;   .user-name {

&#x20;     font-size: 16px;

&#x20;     font-weight: 500;

&#x20;     color: #303133;

&#x20;   }

&#x20;  &#x20;

&#x20;   .user-email {

&#x20;     font-size: 14px;

&#x20;     color: #606266;

&#x20;     margin-left: 16px;

&#x20;   }

&#x20; }

}

\</style>
```

#### 3.1.2 Props 定义规范



```
// ✅ 完整的Props定义

interface Props {

&#x20; userId: number

&#x20; userName?: string

&#x20; userStatus?: 'active' | 'inactive'

&#x20; userRoles?: string\[]

&#x20; onUserUpdate?: (user: User) => void

}

const props = withDefaults(defineProps\<Props>(), {

&#x20; userName: '未知用户',

&#x20; userStatus: 'active',

&#x20; userRoles: () => \[]

})
```

#### 3.1.3 Emits 定义规范



```
// ✅ 类型安全的Emits

const emit = defineEmits<{

&#x20; 'update:userId': \[id: number]

&#x20; 'user-change': \[user: User]

&#x20; 'delete-user': \[id: number, confirm: boolean]

}>()

// ✅ 触发事件

const handleUserChange = (newUser: User) => {

&#x20; emit('user-change', newUser)

}
```

### 3.2 Composition API 使用规范

#### 3.2.1 响应式 API



```
// ✅ ref用于基本类型和单值对象

const count = ref(0)

const user = ref\<User | null>(null)

// ✅ reactive用于复杂对象

const form = reactive({

&#x20; name: '',

&#x20; email: '',

&#x20; password: ''

})

// ✅ computed用于计算属性

const fullName = computed(() => \`\${user.value?.firstName} \${user.value?.lastName}\`)

const isFormValid = computed(() => form.name && form.email && form.password)

// ✅ watch用于响应式数据监听

watch(count, (newValue, oldValue) => {

&#x20; console.log(\`Count changed from \${oldValue} to \${newValue}\`)

})

// ✅ watchEffect用于副作用

watchEffect(() => {

&#x20; if (user.value) {

&#x20;   // 执行副作用操作

&#x20; }

})
```

#### 3.2.2 生命周期钩子



```
// ✅ 生命周期钩子使用

onBeforeMount(() => {

&#x20; console.log('组件挂载前')

})

onMounted(() => {

&#x20; console.log('组件挂载完成')

&#x20; // 初始化数据

&#x20; fetchData()

})

onBeforeUpdate(() => {

&#x20; console.log('组件更新前')

})

onUpdated(() => {

&#x20; console.log('组件更新完成')

})

onBeforeUnmount(() => {

&#x20; console.log('组件卸载前')

&#x20; // 清理资源

})

onUnmounted(() => {

&#x20; console.log('组件卸载完成')

})
```

### 3.3 自定义 Hooks 规范

#### 3.3.1 Hooks 设计原则



```
// ✅ 自定义Hooks命名以use开头

export function useUserManagement() {

&#x20; const users = ref\<User\[]>(\[])

&#x20; const loading = ref(false)

&#x20; const error = ref\<string | null>(null)

&#x20; const fetchUsers = async () => {

&#x20;   loading.value = true

&#x20;   error.value = null

&#x20;   try {

&#x20;     const response = await userApi.getUsers()

&#x20;     users.value = response.data

&#x20;   } catch (err) {

&#x20;     error.value = err instanceof Error ? err.message : 'Failed to fetch users'

&#x20;   } finally {

&#x20;     loading.value = false

&#x20;   }

&#x20; }

&#x20; const createUser = async (userData: User) => {

&#x20;   // 创建用户逻辑

&#x20; }

&#x20; const updateUser = async (id: number, userData: Partial\<User>) => {

&#x20;   // 更新用户逻辑

&#x20; }

&#x20; const deleteUser = async (id: number) => {

&#x20;   // 删除用户逻辑

&#x20; }

&#x20; return {

&#x20;   users,

&#x20;   loading,

&#x20;   error,

&#x20;   fetchUsers,

&#x20;   createUser,

&#x20;   updateUser,

&#x20;   deleteUser

&#x20; }

}
```

#### 3.3.2 Hooks 使用示例



```
// ✅ 在组件中使用自定义Hooks

const {

&#x20; users,

&#x20; loading,

&#x20; error,

&#x20; fetchUsers,

&#x20; createUser

} = useUserManagement()

onMounted(() => {

&#x20; fetchUsers()

})
```

## 4. Pinia 状态管理规范

### 4.1 Store 定义规范

#### 4.1.1 Store 结构



```
// stores/user.ts

import { defineStore } from 'pinia'

import { userApi } from '@/api'

interface UserState {

&#x20; user: User | null

&#x20; token: string | null

&#x20; permissions: string\[]

&#x20; loading: boolean

&#x20; error: string | null

}

export const useUserStore = defineStore('user', {

&#x20; state: (): UserState => ({

&#x20;   user: null,

&#x20;   token: localStorage.getItem('token'),

&#x20;   permissions: \[],

&#x20;   loading: false,

&#x20;   error: null

&#x20; }),

&#x20; getters: {

&#x20;   isLoggedIn: (state) => !!state.token,

&#x20;   isAdmin: (state) => state.user?.role === 'admin',

&#x20;   hasPermission: (state) => (permission: string) =>&#x20;

&#x20;     state.permissions.includes(permission)

&#x20; },

&#x20; actions: {

&#x20;   async login(credentials: LoginCredentials) {

&#x20;     this.loading = true

&#x20;     this.error = null

&#x20;     try {

&#x20;       const response = await userApi.login(credentials)

&#x20;       this.token = response.token

&#x20;       this.user = response.user

&#x20;       this.permissions = response.permissions

&#x20;      &#x20;

&#x20;       localStorage.setItem('token', response.token)

&#x20;       return response.user

&#x20;     } catch (err) {

&#x20;       this.error = err instanceof Error ? err.message : 'Login failed'

&#x20;       throw err

&#x20;     } finally {

&#x20;       this.loading = false

&#x20;     }

&#x20;   },

&#x20;   async logout() {

&#x20;     try {

&#x20;       await userApi.logout()

&#x20;     } finally {

&#x20;       this.token = null

&#x20;       this.user = null

&#x20;       this.permissions = \[]

&#x20;       localStorage.removeItem('token')

&#x20;     }

&#x20;   },

&#x20;   async fetchCurrentUser() {

&#x20;     if (!this.token) return null

&#x20;    &#x20;

&#x20;     this.loading = true

&#x20;     try {

&#x20;       const user = await userApi.getCurrentUser()

&#x20;       this.user = user

&#x20;       this.permissions = user.permissions

&#x20;       return user

&#x20;     } catch (err) {

&#x20;       this.error = err instanceof Error ? err.message : 'Failed to fetch user'

&#x20;       this.logout()

&#x20;       throw err

&#x20;     } finally {

&#x20;       this.loading = false

&#x20;     }

&#x20;   }

&#x20; }

})
```

#### 4.1.2 Store 使用规范



```
// ✅ 在组件中使用Store

import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// ✅ 访问状态

const currentUser = userStore.user

const isLoggedIn = userStore.isLoggedIn

// ✅ 调用actions

const handleLogin = async (credentials) => {

&#x20; try {

&#x20;   const user = await userStore.login(credentials)

&#x20;   // 登录成功处理

&#x20; } catch (error) {

&#x20;   // 错误处理

&#x20; }

}

// ✅ 监听状态变化

watch(

&#x20; () => userStore.user,

&#x20; (newUser, oldUser) => {

&#x20;   if (newUser) {

&#x20;     // 用户信息变化处理

&#x20;   }

&#x20; }

)
```

### 4.2 状态管理最佳实践

#### 4.2.1 模块化 Store



```
stores/

├── index.ts                # Store出口

├── user.ts                 # 用户相关状态

├── app.ts                  # 应用相关状态

├── settings.ts             # 设置相关状态

├── permission.ts           # 权限相关状态

└── tagsView.ts             # 标签页相关状态
```

#### 4.2.2 状态持久化



```
// ✅ 状态持久化

export const useAppStore = defineStore('app', {

&#x20; state: () => ({

&#x20;   theme: localStorage.getItem('theme') || 'light',

&#x20;   language: localStorage.getItem('language') || 'zh-CN',

&#x20;   sidebar: {

&#x20;     opened: localStorage.getItem('sidebarStatus') === 'opened'

&#x20;   }

&#x20; }),

&#x20; actions: {

&#x20;   setTheme(theme: string) {

&#x20;     this.theme = theme

&#x20;     localStorage.setItem('theme', theme)

&#x20;   },

&#x20;   setLanguage(language: string) {

&#x20;     this.language = language

&#x20;     localStorage.setItem('language', language)

&#x20;   },

&#x20;   toggleSidebar() {

&#x20;     this.sidebar.opened = !this.sidebar.opened

&#x20;     localStorage.setItem('sidebarStatus', this.sidebar.opened ? 'opened' : 'closed')

&#x20;   }

&#x20; }

})
```

## 5. Vue Router 规范

### 5.1 路由配置规范

#### 5.1.1 路由定义



```
// router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

export const constantRoutes: RouteRecordRaw\[] = \[

&#x20; {

&#x20;   path: '/redirect',

&#x20;   component: Layout,

&#x20;   name: 'RedirectRoot',

&#x20;   meta: {

&#x20;     hidden: true,

&#x20;     noTagsView: true

&#x20;   },

&#x20;   children: \[

&#x20;     {

&#x20;       path: '/redirect/:path(.\*)',

&#x20;       name: 'RedirectHandler',

&#x20;       component: () => import('@/views/Redirect/Redirect.vue'),

&#x20;       meta: {}

&#x20;     }

&#x20;   ]

&#x20; },

&#x20; {

&#x20;   path: '/login',

&#x20;   name: 'Login',

&#x20;   component: () => import('@/views/Login/Login.vue'),

&#x20;   meta: {

&#x20;     hidden: true,

&#x20;     noTagsView: true

&#x20;   }

&#x20; },

&#x20; {

&#x20;   path: '/404',

&#x20;   name: 'Error404',

&#x20;   component: () => import('@/views/Error/404.vue'),

&#x20;   meta: {

&#x20;     hidden: true,

&#x20;     noTagsView: true

&#x20;   }

&#x20; }

]

export const asyncRoutes: RouteRecordRaw\[] = \[

&#x20; {

&#x20;   path: '/',

&#x20;   component: Layout,

&#x20;   redirect: '/dashboard',

&#x20;   name: 'Dashboard',

&#x20;   meta: {

&#x20;     title: '首页',

&#x20;     icon: 'dashboard',

&#x20;     affix: true

&#x20;   },

&#x20;   children: \[

&#x20;     {

&#x20;       path: 'dashboard',

&#x20;       name: 'DashboardIndex',

&#x20;       component: () => import('@/views/Home/Home.vue'),

&#x20;       meta: {

&#x20;         title: '仪表盘',

&#x20;         icon: 'dashboard',

&#x20;         affix: true

&#x20;       }

&#x20;     }

&#x20;   ]

&#x20; },

&#x20; {

&#x20;   path: '/system',

&#x20;   component: Layout,

&#x20;   redirect: '/system/user',

&#x20;   name: 'System',

&#x20;   meta: {

&#x20;     title: '系统管理',

&#x20;     icon: 'system',

&#x20;     roles: \['admin']

&#x20;   },

&#x20;   children: \[

&#x20;     {

&#x20;       path: 'user',

&#x20;       name: 'UserManagement',

&#x20;       component: () => import('@/views/system/user/UserList.vue'),

&#x20;       meta: {

&#x20;         title: '用户管理',

&#x20;         icon: 'user',

&#x20;         roles: \['admin']

&#x20;       }

&#x20;     },

&#x20;     {

&#x20;       path: 'role',

&#x20;       name: 'RoleManagement',

&#x20;       component: () => import('@/views/system/role/RoleList.vue'),

&#x20;       meta: {

&#x20;         title: '角色管理',

&#x20;         icon: 'role',

&#x20;         roles: \['admin']

&#x20;       }

&#x20;     }

&#x20;   ]

&#x20; }

]

const router = createRouter({

&#x20; history: createWebHistory(import.meta.env.BASE\_URL),

&#x20; routes: constantRoutes,

&#x20; scrollBehavior(to, from, savedPosition) {

&#x20;   if (savedPosition) {

&#x20;     return savedPosition

&#x20;   } else {

&#x20;     return { top: 0 }

&#x20;   }

&#x20; }

})

export default router
```

#### 5.1.2 路由 Meta 配置



```
interface RouteMeta {

&#x20; title?: string                // 路由标题

&#x20; icon?: string                 // 图标名称

&#x20; hidden?: boolean              // 是否隐藏

&#x20; noTagsView?: boolean          // 是否不显示在标签页

&#x20; affix?: boolean               // 是否固定在标签页

&#x20; roles?: string\[]              // 访问角色

&#x20; permissions?: string\[]        // 访问权限

&#x20; alwaysShow?: boolean          // 是否总是显示

&#x20; breadcrumb?: boolean          // 是否显示面包屑

&#x20; activeMenu?: string           // 激活的菜单

&#x20; noCache?: boolean             // 是否不缓存

&#x20; followAuth?: string           // 跟随的权限

&#x20; showMenu?: boolean            // 是否显示菜单

&#x20; keepAlive?: boolean           // 是否缓存组件

}
```

### 5.2 路由守卫规范

#### 5.2.1 全局守卫



```
// permission.ts

import router from './router'

import { useUserStore } from '@/stores/user'

import { ElMessage } from 'element-plus'

router.beforeEach(async (to, from, next) => {

&#x20; const userStore = useUserStore()

&#x20; const token = userStore.token

&#x20; // 设置页面标题

&#x20; document.title = to.meta.title ? \`\${to.meta.title} - 芋道管理后台\` : '芋道管理后台'

&#x20; // 不需要登录的路由

&#x20; if (to.path === '/login' || to.path === '/404') {

&#x20;   if (token) {

&#x20;     next('/')

&#x20;   } else {

&#x20;     next()

&#x20;   }

&#x20;   return

&#x20; }

&#x20; // 需要登录的路由

&#x20; if (!token) {

&#x20;   ElMessage.error('请先登录')

&#x20;   next('/login')

&#x20;   return

&#x20; }

&#x20; // 已经登录，检查权限

&#x20; if (userStore.permissions.length === 0) {

&#x20;   try {

&#x20;     // 获取用户信息和权限

&#x20;     await userStore.fetchCurrentUser()

&#x20;    &#x20;

&#x20;     // 动态添加路由

&#x20;     const accessRoutes = await generateRoutes(userStore.permissions)

&#x20;     accessRoutes.forEach(route => {

&#x20;       router.addRoute(route)

&#x20;     })

&#x20;     // 重新导航到目标路由

&#x20;     next({ ...to, replace: true })

&#x20;   } catch (error) {

&#x20;     ElMessage.error('获取用户信息失败，请重新登录')

&#x20;     await userStore.logout()

&#x20;     next('/login')

&#x20;   }

&#x20; } else {

&#x20;   // 检查是否有权限访问

&#x20;   if (hasPermission(to, userStore.permissions)) {

&#x20;     next()

&#x20;   } else {

&#x20;     next('/404')

&#x20;   }

&#x20; }

})

router.afterEach(() => {

&#x20; // 路由跳转完成后的处理

})

router.onError((error) => {

&#x20; console.error('路由错误:', error)

&#x20; ElMessage.error('页面加载失败')

})
```

## 6. API 规范

### 6.1 API 设计规范

#### 6.1.1 RESTful API 设计



```
// api/user.ts

import request from '@/config/axios'

export interface User {

&#x20; id: number

&#x20; username: string

&#x20; email: string

&#x20; status: number

&#x20; createdAt: string

&#x20; updatedAt: string

}

export interface UserParams {

&#x20; page?: number

&#x20; size?: number

&#x20; keyword?: string

&#x20; status?: number

}

export interface UserForm {

&#x20; username: string

&#x20; email: string

&#x20; password?: string

&#x20; status?: number

&#x20; roleIds?: number\[]

}

export const userApi = {

&#x20; // 获取用户列表

&#x20; getUsers: (params?: UserParams) => {

&#x20;   return request.get\<ApiResponse\<PageResult\<User>>>('/api/v1/users', { params })

&#x20; },

&#x20; // 获取用户详情

&#x20; getUserById: (id: number) => {

&#x20;   return request.get\<ApiResponse\<User>>(\`/api/v1/users/\${id}\`)

&#x20; },

&#x20; // 创建用户

&#x20; createUser: (data: UserForm) => {

&#x20;   return request.post\<ApiResponse\<User>>('/api/v1/users', data)

&#x20; },

&#x20; // 更新用户

&#x20; updateUser: (id: number, data: Partial\<UserForm>) => {

&#x20;   return request.put\<ApiResponse\<User>>(\`/api/v1/users/\${id}\`, data)

&#x20; },

&#x20; // 删除用户

&#x20; deleteUser: (id: number) => {

&#x20;   return request.delete\<ApiResponse\<void>>(\`/api/v1/users/\${id}\`)

&#x20; },

&#x20; // 批量删除用户

&#x20; batchDeleteUsers: (ids: number\[]) => {

&#x20;   return request.delete\<ApiResponse\<void>>('/api/v1/users/batch', { data: { ids } })

&#x20; },

&#x20; // 更新用户状态

&#x20; updateUserStatus: (id: number, status: number) => {

&#x20;   return request.patch\<ApiResponse\<User>>(\`/api/v1/users/\${id}/status\`, { status })

&#x20; }

}
```

#### 6.1.2 Axios 配置



```
// config/axios/index.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { ElMessage, ElLoading } from 'element-plus'

import { useUserStore } from '@/stores/user'

interface ApiResponse\<T = any> {

&#x20; code: number

&#x20; message: string

&#x20; data: T

}

const request: AxiosInstance = axios.create({

&#x20; baseURL: import.meta.env.VITE\_API\_BASE\_URL,

&#x20; timeout: 10000,

&#x20; headers: {

&#x20;   'Content-Type': 'application/json'

&#x20; }

})

// 请求拦截器

request.interceptors.request.use(

&#x20; (config: AxiosRequestConfig) => {

&#x20;   const userStore = useUserStore()

&#x20;   const token = userStore.token

&#x20;   if (token) {

&#x20;     config.headers = config.headers || {}

&#x20;     config.headers.Authorization = \`Bearer \${token}\`

&#x20;   }

&#x20;   return config

&#x20; },

&#x20; (error) => {

&#x20;   return Promise.reject(error)

&#x20; }

)

// 响应拦截器

request.interceptors.response.use(

&#x20; (response: AxiosResponse\<ApiResponse>) => {

&#x20;   const { code, message, data } = response.data

&#x20;   // 成功响应

&#x20;   if (code === 200) {

&#x20;     return response.data

&#x20;   }

&#x20;   // 业务错误

&#x20;   ElMessage.error(message || '操作失败')

&#x20;   return Promise.reject(new Error(message || '操作失败'))

&#x20; },

&#x20; (error) => {

&#x20;   const response = error.response

&#x20;   if (response) {

&#x20;     const { status, data } = response

&#x20;     // 401: 未授权

&#x20;     if (status === 401) {

&#x20;       ElMessage.error('登录已过期，请重新登录')

&#x20;       const userStore = useUserStore()

&#x20;       userStore.logout()

&#x20;       window.location.href = '/login'

&#x20;     }

&#x20;     // 403: 权限不足

&#x20;     else if (status === 403) {

&#x20;       ElMessage.error('没有操作权限')

&#x20;     }

&#x20;     // 404: 资源不存在

&#x20;     else if (status === 404) {

&#x20;       ElMessage.error('请求的资源不存在')

&#x20;     }

&#x20;     // 500: 服务器错误

&#x20;     else if (status >= 500) {

&#x20;       ElMessage.error('服务器内部错误')

&#x20;     }

&#x20;     // 其他错误

&#x20;     else {

&#x20;       ElMessage.error(data?.message || '请求失败')

&#x20;     }

&#x20;   } else {

&#x20;     ElMessage.error('网络连接失败')

&#x20;   }

&#x20;   return Promise.reject(error)

&#x20; }

)

export default request
```

### 6.2 错误处理规范

#### 6.2.1 错误类型定义



```
// types/error.ts

export enum ErrorCode {

&#x20; SUCCESS = 200,

&#x20; PARAM\_ERROR = 400,

&#x20; UNAUTHORIZED = 401,

&#x20; FORBIDDEN = 403,

&#x20; NOT\_FOUND = 404,

&#x20; SERVER\_ERROR = 500,

&#x20; BUSINESS\_ERROR = 1000,

&#x20; VALIDATION\_ERROR = 1001,

&#x20; DUPLICATE\_ERROR = 1002,

&#x20; LIMIT\_ERROR = 1003

}

export interface ApiError {

&#x20; code: ErrorCode

&#x20; message: string

&#x20; detail?: any

}

export class BusinessException extends Error {

&#x20; code: ErrorCode

&#x20; detail?: any

&#x20; constructor(code: ErrorCode, message: string, detail?: any) {

&#x20;   super(message)

&#x20;   this.code = code

&#x20;   this.detail = detail

&#x20;   this.name = 'BusinessException'

&#x20; }

}
```

#### 6.2.2 错误处理工具



```
// utils/error-handler.ts

import { ElMessage, ElMessageBox } from 'element-plus'

import { ErrorCode, BusinessException } from '@/types/error'

export class ErrorHandler {

&#x20; static handleError(error: any): void {

&#x20;   if (error instanceof BusinessException) {

&#x20;     this.handleBusinessError(error)

&#x20;   } else if (error.response) {

&#x20;     this.handleHttpError(error.response)

&#x20;   } else if (error.request) {

&#x20;     this.handleNetworkError()

&#x20;   } else {

&#x20;     this.handleGenericError(error)

&#x20;   }

&#x20; }

&#x20; static handleBusinessError(error: BusinessException): void {

&#x20;   switch (error.code) {

&#x20;     case ErrorCode.VALIDATION\_ERROR:

&#x20;       ElMessage.warning(error.message)

&#x20;       break

&#x20;     case ErrorCode.DUPLICATE\_ERROR:

&#x20;       ElMessage.error(error.message)

&#x20;       break

&#x20;     case ErrorCode.LIMIT\_ERROR:

&#x20;       ElMessage.warning(error.message)

&#x20;       break

&#x20;     default:

&#x20;       ElMessage.error(error.message)

&#x20;   }

&#x20; }

&#x20; static handleHttpError(response: any): void {

&#x20;   const status = response.status

&#x20;   const data = response.data

&#x20;   switch (status) {

&#x20;     case 401:

&#x20;       ElMessageBox.confirm('登录已过期，请重新登录', '提示', {

&#x20;         confirmButtonText: '重新登录',

&#x20;         cancelButtonText: '取消',

&#x20;         type: 'warning'

&#x20;       }).then(() => {

&#x20;         const userStore = useUserStore()

&#x20;         userStore.logout()

&#x20;         window.location.href = '/login'

&#x20;       })

&#x20;       break

&#x20;     case 403:

&#x20;       ElMessage.error(data?.message || '没有操作权限')

&#x20;       break

&#x20;     case 404:

&#x20;       ElMessage.error('请求的资源不存在')

&#x20;       break

&#x20;     case 500:

&#x20;       ElMessage.error('服务器内部错误')

&#x20;       break

&#x20;     default:

&#x20;       ElMessage.error(data?.message || '请求失败')

&#x20;   }

&#x20; }

&#x20; static handleNetworkError(): void {

&#x20;   ElMessage.error('网络连接失败，请检查网络设置')

&#x20; }

&#x20; static handleGenericError(error: any): void {

&#x20;   console.error('未知错误:', error)

&#x20;   ElMessage.error('操作失败，请重试')

&#x20; }

}
```

## 7. 样式规范

### 7.1 SCSS 规范

#### 7.1.1 变量定义



```
// styles/variables.scss

// 颜色变量

\$primary-color: #409EFF !default;

\$success-color: #67C23A !default;

\$warning-color: #E6A23C !default;

\$danger-color: #F56C6C !default;

\$info-color: #909399 !default;

// 文本颜色

\$text-primary: #303133 !default;

\$text-secondary: #606266 !default;

\$text-placeholder: #C0C4CC !default;

\$text-disabled: #909399 !default;

// 背景颜色

\$bg-primary: #FFFFFF !default;

\$bg-secondary: #F5F7FA !default;

\$bg-tertiary: #E4E7ED !default;

// 边框颜色

\$border-color: #E4E7ED !default;

\$border-hover-color: #C0C4CC !default;

// 尺寸变量

\$border-radius: 4px !default;

\$border-width: 1px !default;

\$shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !default;

// 间距变量

\$spacing-xs: 4px !default;

\$spacing-sm: 8px !default;

\$spacing-md: 16px !default;

\$spacing-lg: 24px !default;

\$spacing-xl: 32px !default;

// 字体变量

\$font-family: "PingFang SC", "Microsoft YaHei", sans-serif !default;

\$font-size-xs: 12px !default;

\$font-size-sm: 13px !default;

\$font-size-base: 14px !default;

\$font-size-lg: 16px !default;

\$font-size-xl: 18px !default;

\$font-size-xxl: 20px !default;

// 行高变量

\$line-height-xs: 1.3 !default;

\$line-height-sm: 1.4 !default;

\$line-height-base: 1.5 !default;

\$line-height-lg: 1.6 !default;
```

#### 7.1.2 混合器和函数



```
// styles/mixins.scss

// 清除浮动

@mixin clearfix {

&#x20; &::after {

&#x20;   content: "";

&#x20;   display: table;

&#x20;   clear: both;

&#x20; }

}

// 弹性布局

@mixin flex(\$direction: row, \$justify: flex-start, \$align: stretch) {

&#x20; display: flex;

&#x20; flex-direction: \$direction;

&#x20; justify-content: \$justify;

&#x20; align-items: \$align;

}

// 网格布局

@mixin grid(\$columns: 12, \$gap: \$spacing-md) {

&#x20; display: grid;

&#x20; grid-template-columns: repeat(\$columns, 1fr);

&#x20; gap: \$gap;

}

// 响应式断点

\$breakpoints: (

&#x20; xs: 0,

&#x20; sm: 768px,

&#x20; md: 992px,

&#x20; lg: 1200px,

&#x20; xl: 1920px

);

@mixin responsive(\$breakpoint) {

&#x20; \$breakpoint-value: map-get(\$breakpoints, \$breakpoint);

&#x20; @media (min-width: \$breakpoint-value) {

&#x20;   @content;

&#x20; }

}

// 阴影效果

@mixin shadow(\$level: 1) {

&#x20; \$shadows: (

&#x20;   1: 0 2px 8px rgba(0, 0, 0, 0.08),

&#x20;   2: 0 4px 16px rgba(0, 0, 0, 0.12),

&#x20;   3: 0 8px 24px rgba(0, 0, 0, 0.16)

&#x20; );

&#x20; box-shadow: map-get(\$shadows, \$level);

}

// 过渡效果

@mixin transition(\$property: all, \$duration: 0.3s, \$timing: ease) {

&#x20; transition: \$property \$duration \$timing;

}

// 边框

@mixin border(\$color: \$border-color, \$width: \$border-width, \$style: solid) {

&#x20; border: \$width \$style \$color;

}

// 圆角

@mixin border-radius(\$radius: \$border-radius) {

&#x20; border-radius: \$radius;

}
```

#### 7.1.3 组件样式



```
// styles/components/user-card.scss

@import '../variables';

@import '../mixins';

.user-card {

&#x20; @include border-radius;

&#x20; @include shadow(1);

&#x20; background-color: \$bg-primary;

&#x20; border: 1px solid \$border-color;

&#x20; overflow: hidden;

&#x20; transition: all 0.3s ease;

&#x20; &:hover {

&#x20;   @include shadow(2);

&#x20;   border-color: \$primary-color;

&#x20; }

&#x20; .user-card-header {

&#x20;   padding: \$spacing-md;

&#x20;   border-bottom: 1px solid \$border-color;

&#x20;   background-color: \$bg-secondary;

&#x20;   .user-card-title {

&#x20;     font-size: \$font-size-lg;

&#x20;     font-weight: 500;

&#x20;     color: \$text-primary;

&#x20;     margin: 0;

&#x20;   }

&#x20; }

&#x20; .user-card-body {

&#x20;   padding: \$spacing-md;

&#x20;   .user-info {

&#x20;     @include flex(column, flex-start, flex-start);

&#x20;     gap: \$spacing-sm;

&#x20;     .user-avatar {

&#x20;       width: 64px;

&#x20;       height: 64px;

&#x20;       border-radius: 50%;

&#x20;       object-fit: cover;

&#x20;     }

&#x20;     .user-details {

&#x20;       @include flex(column, flex-start, flex-start);

&#x20;       gap: \$spacing-xs;

&#x20;       .user-name {

&#x20;         font-size: \$font-size-base;

&#x20;         font-weight: 500;

&#x20;         color: \$text-primary;

&#x20;       }

&#x20;       .user-email {

&#x20;         font-size: \$font-size-sm;

&#x20;         color: \$text-secondary;

&#x20;       }

&#x20;     }

&#x20;   }

&#x20; }

&#x20; .user-card-footer {

&#x20;   padding: \$spacing-md;

&#x20;   border-top: 1px solid \$border-color;

&#x20;   background-color: \$bg-secondary;

&#x20;   text-align: right;

&#x20; }

&#x20; // 响应式样式

&#x20; @include responsive(sm) {

&#x20;   .user-card-body .user-info {

&#x20;     @include flex(row, flex-start, center);

&#x20;   }

&#x20; }

}
```

### 7.2 CSS Modules 规范



```
// components/UserProfile.module.scss

.container {

&#x20; padding: 20px;

}

.card {

&#x20; background: white;

&#x20; border-radius: 8px;

&#x20; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

&#x20; padding: 24px;

&#x20; margin-bottom: 20px;

}

.title {

&#x20; font-size: 18px;

&#x20; font-weight: 500;

&#x20; color: #303133;

&#x20; margin-bottom: 16px;

}

.avatar {

&#x20; width: 80px;

&#x20; height: 80px;

&#x20; border-radius: 50%;

&#x20; margin-bottom: 16px;

}

.info {

&#x20; line-height: 1.6;

}

.name {

&#x20; font-size: 16px;

&#x20; font-weight: 500;

&#x20; color: #303133;

&#x20; margin-bottom: 8px;

}

.email {

&#x20; font-size: 14px;

&#x20; color: #606266;

&#x20; margin-bottom: 8px;

}

.buttonGroup {

&#x20; display: flex;

&#x20; gap: 12px;

&#x20; margin-top: 20px;

}

.editButton {

&#x20; background: #409eff;

&#x20; color: white;

&#x20; border: none;

&#x20; border-radius: 4px;

&#x20; padding: 8px 16px;

&#x20; cursor: pointer;

&#x20; transition: background 0.3s;

&#x20; &:hover {

&#x20;   background: #66b1ff;

&#x20; }

}

.deleteButton {

&#x20; background: #f56c6c;

&#x20; color: white;

&#x20; border: none;

&#x20; border-radius: 4px;

&#x20; padding: 8px 16px;

&#x20; cursor: pointer;

&#x20; transition: background 0.3s;

&#x20; &:hover {

&#x20;   background: #f78989;

&#x20; }

}
```

## 8. 代码质量规范

### 8.1 ESLint 配置



```
// .eslintrc.js

module.exports = {

&#x20; root: true,

&#x20; env: {

&#x20;   browser: true,

&#x20;   es2021: true,

&#x20;   node: true

&#x20; },

&#x20; extends: \[

&#x20;   'eslint:recommended',

&#x20;   '@vue/typescript/recommended',

&#x20;   '@vue/prettier',

&#x20;   '@vue/prettier/@typescript-eslint'

&#x20; ],

&#x20; parserOptions: {

&#x20;   ecmaVersion: 2021,

&#x20;   sourceType: 'module'

&#x20; },

&#x20; rules: {

&#x20;   // TypeScript规则

&#x20;   '@typescript-eslint/no-unused-vars': \['error', { argsIgnorePattern: '^\_' }],

&#x20;   '@typescript-eslint/explicit-function-return-type': 'off',

&#x20;   '@typescript-eslint/explicit-module-boundary-types': 'off',

&#x20;   '@typescript-eslint/no-explicit-any': 'warn',

&#x20;   '@typescript-eslint/ban-ts-comment': 'warn',

&#x20;  &#x20;

&#x20;   // Vue规则

&#x20;   'vue/component-name-in-template-casing': \['error', 'PascalCase'],

&#x20;   'vue/component-definition-name-casing': \['error', 'PascalCase'],

&#x20;   'vue/no-unused-vars': 'error',

&#x20;   'vue/script-setup-uses-vars': 'error',

&#x20;   'vue/no-mutating-props': 'error',

&#x20;   'vue/no-reserved-component-names': 'error',

&#x20;  &#x20;

&#x20;   // 通用规则

&#x20;   'no-console': process.env.NODE\_ENV === 'production' ? 'warn' : 'off',

&#x20;   'no-debugger': process.env.NODE\_ENV === 'production' ? 'warn' : 'off',

&#x20;   'no-unused-vars': \['error', { argsIgnorePattern: '^\_' }],

&#x20;   'prefer-const': 'error',

&#x20;   'no-var': 'error',

&#x20;   'arrow-body-style': \['error', 'as-needed'],

&#x20;   'prefer-arrow-callback': 'error'

&#x20; }

}
```

### 8.2 Prettier 配置



```
// prettier.config.js

module.exports = {

&#x20; semi: false,

&#x20; trailingComma: 'es5',

&#x20; singleQuote: true,

&#x20; printWidth: 80,

&#x20; tabWidth: 2,

&#x20; useTabs: false,

&#x20; bracketSpacing: true,

&#x20; arrowParens: 'avoid',

&#x20; endOfLine: 'lf',

&#x20; vueIndentScriptAndStyle: true,

&#x20; htmlWhitespaceSensitivity: 'ignore'

}
```

### 8.3 Stylelint 配置



```
// stylelint.config.js

module.exports = {

&#x20; root: true,

&#x20; extends: \[

&#x20;   'stylelint-config-standard',

&#x20;   'stylelint-config-rational-order',

&#x20;   'stylelint-config-prettier'

&#x20; ],

&#x20; plugins: \[

&#x20;   'stylelint-order',

&#x20;   'stylelint-scss'

&#x20; ],

&#x20; rules: {

&#x20;   'at-rule-no-unknown': null,

&#x20;   'scss/at-rule-no-unknown': true,

&#x20;   'declaration-block-trailing-semicolon': null,

&#x20;   'no-descending-specificity': null,

&#x20;   'selector-pseudo-element-no-unknown': \[

&#x20;     true,

&#x20;     {

&#x20;       ignorePseudoElements: \['v-deep']

&#x20;     }

&#x20;   ],

&#x20;   'selector-pseudo-class-no-unknown': \[

&#x20;     true,

&#x20;     {

&#x20;       ignorePseudoClasses: \['deep']

&#x20;     }

&#x20;   ],

&#x20;   'order/properties-order': \[

&#x20;     'position',

&#x20;     'top',

&#x20;     'right',

&#x20;     'bottom',

&#x20;     'left',

&#x20;     'z-index',

&#x20;     'display',

&#x20;     'float',

&#x20;     'width',

&#x20;     'height',

&#x20;     'max-width',

&#x20;     'max-height',

&#x20;     'min-width',

&#x20;     'min-height',

&#x20;     'padding',

&#x20;     'padding-top',

&#x20;     'padding-right',

&#x20;     'padding-bottom',

&#x20;     'padding-left',

&#x20;     'margin',

&#x20;     'margin-top',

&#x20;     'margin-right',

&#x20;     'margin-bottom',

&#x20;     'margin-left',

&#x20;     'margin-collapse',

&#x20;     'margin-top-collapse',

&#x20;     'margin-right-collapse',

&#x20;     'margin-bottom-collapse',

&#x20;     'margin-left-collapse',

&#x20;     'overflow',

&#x20;     'overflow-x',

&#x20;     'overflow-y',

&#x20;     'clip',

&#x20;     'clear',

&#x20;     'font',

&#x20;     'font-family',

&#x20;     'font-size',

&#x20;     'font-smoothing',

&#x20;     'osx-font-smoothing',

&#x20;     'font-style',

&#x20;     'font-weight',

&#x20;     'hyphens',

&#x20;     'src',

&#x20;     'line-height',

&#x20;     'letter-spacing',

&#x20;     'word-spacing',

&#x20;     'color',

&#x20;     'text-align',

&#x20;     'text-decoration',

&#x20;     'text-indent',

&#x20;     'text-overflow',

&#x20;     'text-rendering',

&#x20;     'text-size-adjust',

&#x20;     'text-shadow',

&#x20;     'text-transform',

&#x20;     'word-break',

&#x20;     'word-wrap',

&#x20;     'white-space',

&#x20;     'vertical-align',

&#x20;     'list-style',

&#x20;     'list-style-type',

&#x20;     'list-style-position',

&#x20;     'list-style-image',

&#x20;     'pointer-events',

&#x20;     'cursor',

&#x20;     'background',

&#x20;     'background-attachment',

&#x20;     'background-color',

&#x20;     'background-image',

&#x20;     'background-position',

&#x20;     'background-repeat',

&#x20;     'background-size',

&#x20;     'border',

&#x20;     'border-collapse',

&#x20;     'border-top',

&#x20;     'border-right',

&#x20;     'border-bottom',

&#x20;     'border-left',

&#x20;     'border-color',

&#x20;     'border-image',

&#x20;     'border-image-source',

&#x20;     'border-image-slice',

&#x20;     'border-image-width',

&#x20;     'border-image-outset',

&#x20;     'border-image-repeat',

&#x20;     'border-radius',

&#x20;     'border-style',

&#x20;     'border-width',

&#x20;     'outline',

&#x20;     'outline-offset',

&#x20;     'opacity',

&#x20;     'filter',

&#x20;     'visibility',

&#x20;     'size',

&#x20;     'zoom',

&#x20;     'transform',

&#x20;     'box-align',

&#x20;     'box-flex',

&#x20;     'box-orient',

&#x20;     'box-pack',

&#x20;     'box-shadow',

&#x20;     'box-sizing',

&#x20;     'table-layout',

&#x20;     'animation',

&#x20;     'animation-delay',

&#x20;     'animation-duration',

&#x20;     'animation-iteration-count',

&#x20;     'animation-name',

&#x20;     'animation-play-state',

&#x20;     'animation-timing-function',

&#x20;     'animation-fill-mode',

&#x20;     'transition',

&#x20;     'transition-delay',

&#x20;     'transition-duration',

&#x20;     'transition-property',

&#x20;     'transition-timing-function',

&#x20;     'background-clip',

&#x20;     'backface-visibility',

&#x20;     'resize',

&#x20;     'appearance',

&#x20;     'user-select',

&#x20;     'interpolation-mode',

&#x20;     'direction',

&#x20;     'marks',

&#x20;     'page',

&#x20;     'set-link-source',

&#x20;     'unicode-bidi',

&#x20;     'speak'

&#x20;   ]

&#x20; }

}
```

## 9. 构建和部署规范

### 9.1 Vite 配置



```
// vite.config.ts

import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

import AutoImport from 'unplugin-auto-import/vite'

import Components from 'unplugin-vue-components/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import UnoCSS from 'unocss/vite'

export default defineConfig(({ mode }) => {

&#x20; const env = loadEnv(mode, process.cwd())

&#x20; return {

&#x20;   base: env.VITE\_PUBLIC\_PATH || '/',

&#x20;   plugins: \[

&#x20;     vue(),

&#x20;     AutoImport({

&#x20;       resolvers: \[ElementPlusResolver()],

&#x20;       dts: true,

&#x20;       eslintrc: {

&#x20;         enabled: true

&#x20;       }

&#x20;     }),

&#x20;     Components({

&#x20;       resolvers: \[ElementPlusResolver()],

&#x20;       dts: true

&#x20;     }),

&#x20;     createSvgIconsPlugin({

&#x20;       iconDirs: \[resolve(process.cwd(), 'src/assets/icons')],

&#x20;       symbolId: 'icon-\[dir]-\[name]'

&#x20;     }),

&#x20;     UnoCSS()

&#x20;   ],

&#x20;   resolve: {

&#x20;     alias: {

&#x20;       '@': resolve(\_\_dirname, 'src'),

&#x20;       '@components': resolve(\_\_dirname, 'src/components'),

&#x20;       '@views': resolve(\_\_dirname, 'src/views'),

&#x20;       '@api': resolve(\_\_dirname, 'src/api'),

&#x20;       '@utils': resolve(\_\_dirname, 'src/utils'),

&#x20;       '@styles': resolve(\_\_dirname, 'src/styles'),

&#x20;       '@assets': resolve(\_\_dirname, 'src/assets'),

&#x20;       '@store': resolve(\_\_dirname, 'src/store'),

&#x20;       '@router': resolve(\_\_dirname, 'src/router')

&#x20;     }

&#x20;   },

&#x20;   css: {

&#x20;     preprocessorOptions: {

&#x20;       scss: {

&#x20;         additionalData: \`

&#x20;           @import "@/styles/variables.scss";

&#x20;           @import "@/styles/mixins.scss";

&#x20;         \`

&#x20;       }

&#x20;     }

&#x20;   },

&#x20;   server: {

&#x20;     port: Number(env.VITE\_PORT) || 8080,

&#x20;     host: true,

&#x20;     open: true,

&#x20;     cors: true,

&#x20;     proxy: {

&#x20;       '/api': {

&#x20;         target: env.VITE\_API\_BASE\_URL,

&#x20;         changeOrigin: true,

&#x20;         rewrite: path => path.replace(/^\\/api/, '')

&#x20;       }

&#x20;     }

&#x20;   },

&#x20;   build: {

&#x20;     outDir: 'dist',

&#x20;     assetsDir: 'assets',

&#x20;     rollupOptions: {

&#x20;       output: {

&#x20;         chunkFileNames: 'js/\[name]-\[hash].js',

&#x20;         entryFileNames: 'js/\[name]-\[hash].js',

&#x20;         assetFileNames: 'assets/\[name]-\[hash].\[ext]',

&#x20;         manualChunks: {

&#x20;           vendor: \['vue', 'vue-router', 'pinia'],

&#x20;           element: \['element-plus'],

&#x20;           utils: \['vueuse/core', 'axios']

&#x20;         }

&#x20;       }

&#x20;     },

&#x20;     terserOptions: {

&#x20;       compress: {

&#x20;         drop\_console: env.VITE\_ENV === 'production',

&#x20;         drop\_debugger: env.VITE\_ENV === 'production'

&#x20;       }

&#x20;     }

&#x20;   }

&#x20; }

})
```

### 9.2 环境配置



```
// .env

VITE\_ENV=development

VITE\_PORT=8080

VITE\_PUBLIC\_PATH=/

VITE\_API\_BASE\_URL=http://localhost:8080/api

// .env.dev

VITE\_ENV=development

VITE\_API\_BASE\_URL=http://localhost:8080/api

// .env.test

VITE\_ENV=test

VITE\_API\_BASE\_URL=https://test-api.yudao.iocoder.cn

// .env.stage

VITE\_ENV=stage

VITE\_API\_BASE\_URL=https://stage-api.yudao.iocoder.cn

// .env.prod

VITE\_ENV=production

VITE\_API\_BASE\_URL=https://api.yudao.iocoder.cn
```

### 9.3 构建脚本



```
{

&#x20; "scripts": {

&#x20;   "dev": "vite",

&#x20;   "build": "vue-tsc && vite build",

&#x20;   "build:dev": "vue-tsc && vite build --mode dev",

&#x20;   "build:test": "vue-tsc && vite build --mode test",

&#x20;   "build:stage": "vue-tsc && vite build --mode stage",

&#x20;   "build:prod": "vue-tsc && vite build --mode prod",

&#x20;   "preview": "vite preview",

&#x20;   "preview:prod": "vite preview --mode prod",

&#x20;   "lint": "eslint src --ext .vue,.js,.ts,.jsx,.tsx",

&#x20;   "lint:fix": "eslint src --ext .vue,.js,.ts,.jsx,.tsx --fix",

&#x20;   "lint:style": "stylelint src/\*\*/\*.{css,scss,vue} --fix",

&#x20;   "type-check": "vue-tsc --noEmit",

&#x20;   "format": "prettier --write src/"

&#x20; }

}
```

## 10. 测试规范

### 10.1 单元测试



```
// tests/unit/components/UserCard.test.ts

import { mount } from '@vue/test-utils'

import { describe, it, expect, vi } from 'vitest'

import UserCard from '@/components/UserCard.vue'

import { useUserStore } from '@/stores/user'

vi.mock('@/stores/user')

describe('UserCard', () => {

&#x20; const mockUser = {

&#x20;   id: 1,

&#x20;   name: 'John Doe',

&#x20;   email: 'john@example.com',

&#x20;   avatar: 'https://example.com/avatar.jpg'

&#x20; }

&#x20; const mockStore = {

&#x20;   user: mockUser,

&#x20;   updateUser: vi.fn()

&#x20; }

&#x20; (useUserStore as vi.Mock).mockReturnValue(mockStore)

&#x20; it('renders user information correctly', () => {

&#x20;   const wrapper = mount(UserCard)

&#x20;  &#x20;

&#x20;   expect(wrapper.find('.user-name').text()).toBe(mockUser.name)

&#x20;   expect(wrapper.find('.user-email').text()).toBe(mockUser.email)

&#x20;   expect(wrapper.find('img').attributes('src')).toBe(mockUser.avatar)

&#x20; })

&#x20; it('emits user-change event when edit button is clicked', async () => {

&#x20;   const wrapper = mount(UserCard)

&#x20;  &#x20;

&#x20;   await wrapper.find('.edit-button').trigger('click')

&#x20;  &#x20;

&#x20;   expect(wrapper.emitted('user-change')).toBeTruthy()

&#x20;   expect(wrapper.emitted('user-change')?.\[0]).toEqual(\[mockUser])

&#x20; })

&#x20; it('calls store updateUser method when save button is clicked', async () => {

&#x20;   const wrapper = mount(UserCard)

&#x20;  &#x20;

&#x20;   await wrapper.find('.save-button').trigger('click')

&#x20;  &#x20;

&#x20;   expect(mockStore.updateUser).toHaveBeenCalledWith(mockUser)

&#x20; })

})
```

### 10.2 集成测试



```
// tests/integration/user-flow.test.ts

import { describe, it, expect, vi } from 'vitest'

import { userApi } from '@/api/user'

import { useUserStore } from '@/stores/user'

vi.mock('@/api/user')

describe('User Management Flow', () => {

&#x20; const mockUsers = \[

&#x20;   { id: 1, name: 'John Doe', email: 'john@example.com' },

&#x20;   { id: 2, name: 'Jane Smith', email: 'jane@example.com' }

&#x20; ]

&#x20; const mockUserApi = {

&#x20;   getUsers: vi.fn().mockResolvedValue({ data: mockUsers }),

&#x20;   createUser: vi.fn().mockResolvedValue({ data: { id: 3, name: 'New User', email: 'new@example.com' } })

&#x20; }

&#x20; (userApi as any) = mockUserApi

&#x20; it('should fetch and display users', async () => {

&#x20;   const userStore = useUserStore()

&#x20;  &#x20;

&#x20;   await userStore.fetchUsers()

&#x20;  &#x20;

&#x20;   expect(mockUserApi.getUsers).toHaveBeenCalled()

&#x20;   expect(userStore.users).toEqual(mockUsers)

&#x20; })

&#x20; it('should create a new user', async () => {

&#x20;   const userStore = useUserStore()

&#x20;   const newUser = { name: 'New User', email: 'new@example.com' }

&#x20;  &#x20;

&#x20;   const createdUser = await userStore.createUser(newUser)

&#x20;  &#x20;

&#x20;   expect(mockUserApi.createUser).toHaveBeenCalledWith(newUser)

&#x20;   expect(createdUser).toEqual({ id: 3, ...newUser })

&#x20;   expect(userStore.users.length).toBe(3)

&#x20; })

})
```

## 11. 性能优化规范

### 11.1 代码分割



```
// 路由懒加载

const routes = \[

&#x20; {

&#x20;   path: '/user',

&#x20;   name: 'User',

&#x20;   component: () => import('@/views/user/UserList.vue')

&#x20; },

&#x20; {

&#x20;   path: '/role',

&#x20;   name: 'Role',

&#x20;   component: () => import('@/views/role/RoleList.vue')

&#x20; }

]

// 组件懒加载

const UserDetail = defineAsyncComponent(() =>&#x20;

&#x20; import('@/components/UserDetail.vue')

)

// 工具函数按需导入

import { debounce } from 'lodash-es'

import { useDebounceFn } from '@vueuse/core'
```

### 11.2 虚拟滚动



```
\<template>

&#x20; \<el-table-v2

&#x20;   :columns="columns"

&#x20;   :data="virtualList"

&#x20;   :height="500"

&#x20;   :row-height="60"

&#x20; />

\</template>

\<script setup lang="ts">

import { useVirtualList } from '@vueuse/core'

import { ref, computed } from 'vue'

const allUsers = ref\<User\[]>(\[])

const { list: virtualList } = useVirtualList(

&#x20; allUsers,

&#x20; {

&#x20;   itemHeight: 60,

&#x20;   containerElement: ref(null)

&#x20; }

)

const columns = \[

&#x20; { key: 'name', title: 'Name', width: 200 },

&#x20; { key: 'email', title: 'Email', width: 300 },

&#x20; { key: 'status', title: 'Status', width: 120 }

]

\</script>
```

### 11.3 缓存策略



```
// utils/cache.ts

export class CacheManager {

&#x20; private cache = new Map\<string, { data: any; expires: number }>()

&#x20; private defaultTTL = 5 \* 60 \* 1000 // 5分钟

&#x20; set\<T>(key: string, data: T, ttl = this.defaultTTL): void {

&#x20;   const expires = Date.now() + ttl

&#x20;   this.cache.set(key, { data, expires })

&#x20; }

&#x20; get\<T>(key: string): T | null {

&#x20;   const item = this.cache.get(key)

&#x20;   if (!item) return null

&#x20;  &#x20;

&#x20;   if (Date.now() > item.expires) {

&#x20;     this.cache.delete(key)

&#x20;     return null

&#x20;   }

&#x20;  &#x20;

&#x20;   return item.data as T

&#x20; }

&#x20; delete(key: string): void {

&#x20;   this.cache.delete(key)

&#x20; }

&#x20; clear(): void {

&#x20;   this.cache.clear()

&#x20; }

&#x20; has(key: string): boolean {

&#x20;   return this.cache.has(key) && Date.now() <= this.cache.get(key)!.expires

&#x20; }

}

export const cache = new CacheManager()
```

## 12. 安全规范

### 12.1 XSS 防护



```
// utils/sanitize.ts

import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {

&#x20; return DOMPurify.sanitize(html, {

&#x20;   ADD\_ATTR: \['target'],

&#x20;   ALLOWED\_TAGS: \[

&#x20;     'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3',&#x20;

&#x20;     'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p',&#x20;

&#x20;     'pre', 'span', 'strong', 'table', 'tbody', 'td', 'th',&#x20;

&#x20;     'thead', 'tr', 'ul'

&#x20;   ]

&#x20; })

}

export function escapeHtml(text: string): string {

&#x20; const map: Record\<string, string> = {

&#x20;   '&': '\&amp;',

&#x20;   '<': '\&lt;',

&#x20;   '>': '\&gt;',

&#x20;   '"': '\&quot;',

&#x20;   "'": '\&#39;'

&#x20; }

&#x20; return text.replace(/\[&<>"']/g, m => map\[m])

}
```

### 12.2 CSRF 防护



```
// config/axios/csrf.ts

import { getCookie, setCookie } from '@/utils/cookie'

export function setupCSRFProtection(axiosInstance: any): void {

&#x20; // 请求拦截器添加CSRF token

&#x20; axiosInstance.interceptors.request.use(config => {

&#x20;   const csrfToken = getCookie('XSRF-TOKEN')

&#x20;   if (csrfToken) {

&#x20;     config.headers\['X-XSRF-TOKEN'] = csrfToken

&#x20;   }

&#x20;   return config

&#x20; })

&#x20; // 响应拦截器处理CSRF token更新

&#x20; axiosInstance.interceptors.response.use(response => {

&#x20;   const csrfToken = response.headers\['x-csrf-token']

&#x20;   if (csrfToken) {

&#x20;     setCookie('XSRF-TOKEN', csrfToken)

&#x20;   }

&#x20;   return response

&#x20; })

}
```

### 12.3 输入验证



```
// utils/validation.ts

import { ElMessage } from 'element-plus'

export interface ValidationRule {

&#x20; required?: boolean

&#x20; message?: string

&#x20; validator?: (value: any) => boolean | string

&#x20; pattern?: RegExp

&#x20; min?: number

&#x20; max?: number

&#x20; type?: 'string' | 'number' | 'boolean' | 'array' | 'object'

}

export class Validator {

&#x20; static validate(value: any, rules: ValidationRule\[]): string | null {

&#x20;   for (const rule of rules) {

&#x20;     // 必填验证

&#x20;     if (rule.required && (value === undefined || value === null || value === '')) {

&#x20;       return rule.message || '此字段为必填项'

&#x20;     }

&#x20;     // 类型验证

&#x20;     if (rule.type) {

&#x20;       const type = typeof value

&#x20;       if (rule.type === 'array' && !Array.isArray(value)) {

&#x20;         return rule.message || '此字段必须为数组'

&#x20;       }

&#x20;       if (rule.type !== 'array' && type !== rule.type) {

&#x20;         return rule.message || \`此字段必须为\${rule.type}类型\`

&#x20;       }

&#x20;     }

&#x20;     // 长度验证

&#x20;     if (rule.min !== undefined || rule.max !== undefined) {

&#x20;       const length = Array.isArray(value) ? value.length : String(value).length

&#x20;       if (rule.min !== undefined && length < rule.min) {

&#x20;         return rule.message || \`长度不能小于\${rule.min}\`

&#x20;       }

&#x20;       if (rule.max !== undefined && length > rule.max) {

&#x20;         return rule.message || \`长度不能大于\${rule.max}\`

&#x20;       }

&#x20;     }

&#x20;     // 正则验证

&#x20;     if (rule.pattern && !rule.pattern.test(String(value))) {

&#x20;       return rule.message || '格式不正确'

&#x20;     }

&#x20;     // 自定义验证器

&#x20;     if (rule.validator) {

&#x20;       const result = rule.validator(value)

&#x20;       if (result !== true) {

&#x20;         return typeof result === 'string' ? result : rule.message || '验证失败'

&#x20;       }

&#x20;     }

&#x20;   }

&#x20;   return null

&#x20; }

&#x20; static validateForm(form: Record\<string, any>, rules: Record\<string, ValidationRule\[]>): boolean {

&#x20;   let isValid = true

&#x20;  &#x20;

&#x20;   for (const \[field, fieldRules] of Object.entries(rules)) {

&#x20;     const value = form\[field]

&#x20;     const error = this.validate(value, fieldRules)

&#x20;    &#x20;

&#x20;     if (error) {

&#x20;       ElMessage.error(\`\${field}: \${error}\`)

&#x20;       isValid = false

&#x20;     }

&#x20;   }

&#x20;  &#x20;

&#x20;   return isValid

&#x20; }

}

// 常用验证规则

export const ValidationRules = {

&#x20; required: (message = '此字段为必填项'): ValidationRule => ({

&#x20;   required: true,

&#x20;   message

&#x20; }),

&#x20;&#x20;

&#x20; email: (message = '请输入正确的邮箱格式'): ValidationRule => ({

&#x20;   pattern: /^\[^\s@]+@\[^\s@]+\\.\[^\s@]+\$/,

&#x20;   message

&#x20; }),

&#x20;&#x20;

&#x20; phone: (message = '请输入正确的手机号'): ValidationRule => ({

&#x20;   pattern: /^1\[3-9]\d{9}\$/,

&#x20;   message

&#x20; }),

&#x20;&#x20;

&#x20; url: (message = '请输入正确的URL格式'): ValidationRule => ({

&#x20;   pattern: /^https?:\\/\\/(\[\da-z.-]+)\\.(\[a-z.]{2,6})(\[\\/\w .-]\*)\*\\/?\$/,

&#x20;   message

&#x20; }),

&#x20;&#x20;

&#x20; number: (message = '请输入数字'): ValidationRule => ({

&#x20;   pattern: /^\d+\$/,

&#x20;   message

&#x20; }),

&#x20;&#x20;

&#x20; password: (message = '密码长度至少8位，包含字母和数字'): ValidationRule => ({

&#x20;   pattern: /^(?=.\*\[A-Za-z])(?=.\*\d)\[A-Za-z\d@\$!%\*#?&]{8,}\$/,

&#x20;   message

&#x20; })

}
```



***

**文档版本**: 1.0

**创建时间**: 2025-09-24

**维护人员**: 芋道源码团队

**更新频率**: 季度更新

> (Note: This document may contain AI-generated content.)