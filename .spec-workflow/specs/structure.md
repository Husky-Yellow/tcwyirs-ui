# 芋道管理后台项目结构规范

## 目录



1.  [项目概述](#项目概述)

2.  [目录结构](#目录结构)

3.  [核心目录详解](#核心目录详解)

4.  [编码规范](#编码规范)

5.  [命名约定](#命名约定)

6.  [版本控制规范](#版本控制规范)

7.  [部署规范](#部署规范)

8.  [文档规范](#文档规范)

## 项目概述

芋道管理后台 (yudao-ui-admin-vue3) 是一个基于 Vue 3、TypeScript、Element Plus 构建的企业级中后台管理系统模板。本规范文档旨在统一项目结构，提高代码可维护性和团队协作效率。

### 技术栈



*   **前端框架**: Vue 3.x (Composition API)

*   **类型系统**: TypeScript 5.x

*   **构建工具**: Vite 4.x

*   **UI 组件库**: Element Plus

*   **状态管理**: Pinia

*   **路由管理**: Vue Router 4.x

*   **HTTP 客户端**: Axios

*   **CSS 预处理器**: SCSS

## 目录结构



```
yudao-ui-admin-vue3/

├── .spec-workflow/                  # Spec-Workflow MCP 工作目录

├── docs/                            # 项目文档目录

│   └── specifications/              # 规范文档目录

├── public/                          # 静态资源目录

│   ├── favicon.ico                  # 网站图标

│   ├── index.html                   # HTML 模板

│   └── assets/                      # 公共静态资源

├── src/                            # 源代码目录

│   ├── api/                        # API 接口定义

│   │   ├── system/                 # 系统管理相关接口

│   │   ├── business/               # 业务相关接口

│   │   └── index.ts                # API 出口文件

│   ├── assets/                     # 编译时处理的资源

│   │   ├── images/                 # 图片资源

│   │   ├── styles/                 # 样式资源

│   │   └── icons/                  # 图标资源

│   ├── components/                 # 组件目录

│   │   ├── Base/                   # 基础组件

│   │   ├── Business/               # 业务组件

│   │   └── Global/                 # 全局组件

│   ├── composables/                # 组合式函数

│   │   ├── useAuth.ts              # 认证相关

│   │   ├── usePermission.ts        # 权限相关

│   │   └── index.ts                # 组合式函数出口

│   ├── config/                     # 项目配置

│   │   ├── app.ts                  # 应用配置

│   │   ├── router.ts               # 路由配置

│   │   └── index.ts                # 配置出口

│   ├── constants/                  # 常量定义

│   │   ├── system.ts               # 系统常量

│   │   ├── business.ts             # 业务常量

│   │   └── index.ts                # 常量出口

│   ├── directives/                 # 自定义指令

│   │   ├── permission.ts           # 权限指令

│   │   └── index.ts                # 指令出口

│   ├── hooks/                      # 钩子函数

│   │   ├── useRequest.ts           # 请求钩子

│   │   └── index.ts                # 钩子出口

│   ├── layouts/                    # 布局组件

│   │   ├── BasicLayout.vue         # 基础布局

│   │   ├── BlankLayout.vue         # 空白布局

│   │   └── components/             # 布局组件

│   ├── locales/                    # 国际化文件

│   │   ├── zh-CN/                  # 中文

│   │   ├── en-US/                  # 英文

│   │   └── index.ts                # 国际化配置

│   ├── router/                     # 路由配置

│   │   ├── modules/                # 路由模块

│   │   ├── guards/                 # 路由守卫

│   │   └── index.ts                # 路由出口

│   ├── stores/                     # Pinia 状态管理

│   │   ├── modules/                # 状态模块

│   │   └── index.ts                # 状态管理出口

│   ├── styles/                     # 全局样式

│   │   ├── index.scss              # 样式入口

│   │   ├── variables.scss          # 变量定义

│   │   └── mixins/                 # 样式混合

│   ├── types/                      # TypeScript 类型定义

│   │   ├── api.ts                  # API 类型

│   │   ├── component.ts            # 组件类型

│   │   └── index.ts                # 类型出口

│   ├── utils/                      # 工具函数

│   │   ├── request.ts              # 请求工具

│   │   ├── storage.ts              # 存储工具

│   │   └── index.ts                # 工具函数出口

│   ├── views/                      # 页面组件

│   │   ├── Dashboard/              # 仪表盘

│   │   ├── System/                 # 系统管理

│   │   └── Business/               # 业务页面

│   ├── App.vue                     # 根组件

│   ├── main.ts                     # 应用入口

│   └── shims-vue.d.ts              # Vue 类型声明

├── tests/                          # 测试文件

│   ├── unit/                       # 单元测试

│   └── e2e/                        # 端到端测试

├── .env                            # 环境变量

├── .env.development                # 开发环境变量

├── .env.production                 # 生产环境变量

├── .eslintrc.js                    # ESLint 配置

├── .gitignore                      # Git 忽略文件

├── .prettierrc                     # Prettier 配置

├── index.html                      # HTML 模板

├── package.json                    # 项目依赖

├── README.md                       # 项目说明

├── tsconfig.json                   # TypeScript 配置

└── vite.config.ts                  # Vite 配置
```

## 核心目录详解

### 1. src/api/- API 接口定义



```
// src/api/system/user.ts

import request from '@/utils/request'

import type { UserItem, UserParams, UserResult } from '@/types/api'

/\*\*

&#x20;\* 用户管理相关接口

&#x20;\*/

export const userApi = {

&#x20; /\*\*

&#x20;  \* 获取用户列表

&#x20;  \*/

&#x20; getUserList: (params: UserParams) => {

&#x20;   return request\<UserResult>({

&#x20;     url: '/system/user/list',

&#x20;     method: 'get',

&#x20;     params

&#x20;   })

&#x20; },

&#x20;&#x20;

&#x20; /\*\*

&#x20;  \* 获取用户详情

&#x20;  \*/

&#x20; getUserDetail: (id: number) => {

&#x20;   return request\<UserItem>({

&#x20;     url: \`/system/user/\${id}\`,

&#x20;     method: 'get'

&#x20;   })

&#x20; },

&#x20;&#x20;

&#x20; /\*\*

&#x20;  \* 创建用户

&#x20;  \*/

&#x20; createUser: (data: UserItem) => {

&#x20;   return request({

&#x20;     url: '/system/user',

&#x20;     method: 'post',

&#x20;     data

&#x20;   })

&#x20; }

}
```

### 2. src/components/- 组件目录

#### 基础组件 (Base/)

通用的、不包含业务逻辑的基础组件，如按钮、输入框、表格等。

#### 业务组件 (Business/)

包含特定业务逻辑的组件，如用户表单、订单列表等。

#### 全局组件 (Global/)

需要在全局注册的组件，通过 `app.component()` 注册。

### 3. src/composables/- 组合式函数



```
// src/composables/useAuth.ts

import { useUserStore } from '@/stores/modules/user'

import { computed } from 'vue'

export function useAuth() {

&#x20; const userStore = useUserStore()

&#x20;&#x20;

&#x20; const isLoggedIn = computed(() => !!userStore.token)

&#x20; const userInfo = computed(() => userStore.userInfo)

&#x20;&#x20;

&#x20; const hasPermission = (permission: string) => {

&#x20;   return userStore.permissions.includes(permission)

&#x20; }

&#x20;&#x20;

&#x20; return {

&#x20;   isLoggedIn,

&#x20;   userInfo,

&#x20;   hasPermission

&#x20; }

}
```

### 4. src/stores/- Pinia 状态管理



```
// src/stores/modules/user.ts

import { defineStore } from 'pinia'

import { userApi } from '@/api/system/user'

import type { UserState, UserInfo } from '@/types/store'

export const useUserStore = defineStore('user', {

&#x20; state: (): UserState => ({

&#x20;   token: localStorage.getItem('token') || '',

&#x20;   userInfo: {} as UserInfo,

&#x20;   permissions: \[] as string\[]

&#x20; }),

&#x20;&#x20;

&#x20; getters: {

&#x20;   isLoggedIn: (state) => !!state.token,

&#x20;   hasPermission: (state) => (permission: string) =>&#x20;

&#x20;     state.permissions.includes(permission)

&#x20; },

&#x20;&#x20;

&#x20; actions: {

&#x20;   /\*\*

&#x20;    \* 登录

&#x20;    \*/

&#x20;   async login(credentials: any) {

&#x20;     const response = await userApi.login(credentials)

&#x20;     this.token = response.token

&#x20;     localStorage.setItem('token', response.token)

&#x20;     return response

&#x20;   },

&#x20;  &#x20;

&#x20;   /\*\*

&#x20;    \* 获取用户信息

&#x20;    \*/

&#x20;   async getUserInfo() {

&#x20;     const response = await userApi.getUserInfo()

&#x20;     this.userInfo = response.userInfo

&#x20;     this.permissions = response.permissions

&#x20;     return response

&#x20;   },

&#x20;  &#x20;

&#x20;   /\*\*

&#x20;    \* 退出登录

&#x20;    \*/

&#x20;   logout() {

&#x20;     this.token = ''

&#x20;     this.userInfo = {} as UserInfo

&#x20;     this.permissions = \[]

&#x20;     localStorage.removeItem('token')

&#x20;   }

&#x20; }

})
```

### 5. src/router/- 路由配置



```
// src/router/modules/system.ts

import { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw\[] = \[

&#x20; {

&#x20;   path: '/system',

&#x20;   name: 'System',

&#x20;   component: () => import('@/layouts/BasicLayout.vue'),

&#x20;   meta: {

&#x20;     title: '系统管理',

&#x20;     icon: 'system',

&#x20;     permission: 'system:manage'

&#x20;   },

&#x20;   children: \[

&#x20;     {

&#x20;       path: 'user',

&#x20;       name: 'SystemUser',

&#x20;       component: () => import('@/views/System/User/index.vue'),

&#x20;       meta: {

&#x20;         title: '用户管理',

&#x20;         icon: 'user',

&#x20;         permission: 'system:user:view'

&#x20;       }

&#x20;     },

&#x20;     {

&#x20;       path: 'role',

&#x20;       name: 'SystemRole',

&#x20;       component: () => import('@/views/System/Role/index.vue'),

&#x20;       meta: {

&#x20;         title: '角色管理',

&#x20;         icon: 'role',

&#x20;         permission: 'system:role:view'

&#x20;       }

&#x20;     }

&#x20;   ]

&#x20; }

]

export default systemRoutes
```

## 编码规范

### 1. TypeScript 规范

#### 类型定义



*   使用 `interface` 定义对象类型

*   使用 `type` 定义联合类型、交叉类型

*   避免使用 `any` 类型，使用 `unknown` 替代

*   为所有函数参数和返回值指定类型



```
// 推荐

interface User {

&#x20; id: number

&#x20; name: string

&#x20; email: string

}

type Status = 'active' | 'inactive' | 'deleted'

// 避免

const user: any = {

&#x20; id: 1,

&#x20; name: 'John'

}
```

#### 变量声明



*   使用 `const` 声明不可变变量

*   使用 `let` 声明可变变量

*   避免使用 `var`

### 2. Vue 组件规范

#### SFC 结构



```
\<template>

&#x20; \<!-- 模板内容 -->

\</template>

\<script setup lang="ts">

// 组件逻辑

\</script>

\<style scoped lang="scss">

/\* 组件样式 \*/

\</style>
```

#### 组件命名



*   使用 PascalCase 命名组件文件

*   组件名应该是名词且具有描述性

*   避免使用简单的通用名称



```
// 推荐

UserProfile.vue

OrderList.vue

DataTable.vue

// 避免

User.vue

List.vue

Table.vue
```

### 3. 样式规范

#### SCSS 变量



```
// src/styles/variables.scss

\$primary-color: #409eff;

\$success-color: #67c23a;

\$warning-color: #e6a23c;

\$danger-color: #f56c6c;

\$border-radius: 4px;

\$box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
```

#### 样式作用域



*   使用 `scoped` 属性确保样式只作用于当前组件

*   避免使用全局样式污染

*   使用 CSS Modules 或 BEM 命名规范

## 命名约定

### 1. 文件命名

#### 组件文件



*   使用 PascalCase 命名

*   组件名应该是名词

*   多个单词组合时使用 PascalCase



```
UserList.vue

DataTable.vue

SearchInput.vue
```

#### TypeScript 文件



*   使用 camelCase 命名

*   工具函数文件使用 `use` 或 `utils` 前缀

*   常量文件使用 `constants` 后缀



```
userService.ts

useAuth.ts

apiConstants.ts
```

### 2. 变量命名

#### 普通变量



*   使用 camelCase 命名

*   变量名应该具有描述性

*   避免使用缩写（除非是广泛认知的缩写）



```
// 推荐

const userProfile = { name: 'John', age: 30 }

const isLoading = false

// 避免

const up = { name: 'John', age: 30 }

const il = false
```

#### 常量



*   使用 UPPER\_SNAKE\_CASE 命名

*   常量应该在 constants 目录集中管理



```
// src/constants/system.ts

export const API\_BASE\_URL = 'https://api.example.com'

export const PAGE\_SIZE = 20
```

### 3. 函数命名

#### 普通函数



*   使用 camelCase 命名

*   函数名应该是动词开头

*   具有描述性，清楚表达函数的作用



```
// 推荐

function getUserList() {}

function calculateTotalPrice() {}

function validateForm() {}

// 避免

function list() {}

function calc() {}

function check() {}
```

#### 异步函数



*   使用 `async` 前缀或 `Async` 后缀

*   或者使用具有异步含义的动词



```
async function fetchUserList() {}

function getUserInfoAsync() {}
```

## 版本控制规范

### 1. Git 分支策略

#### 分支命名



```
feature/用户管理模块

bugfix/修复登录问题

hotfix/紧急修复支付漏洞

release/v1.2.0
```

#### 提交信息格式



```
\<type>(\<scope>): \<subject>

\<body>

\<footer>
```

**Type 类型**:



*   `feat`: 新功能

*   `fix`: 修复 bug

*   `docs`: 文档更新

*   `style`: 代码格式调整

*   `refactor`: 代码重构

*   `test`: 测试相关

*   `chore`: 构建工具或辅助工具的变动

**示例**:



```
feat(用户管理): 添加用户导入功能

\- 支持 Excel 文件导入用户

\- 导入前进行数据验证

\- 显示导入进度和结果

Closes #123
```

### 2. 代码审查流程



1.  创建功能分支

2.  完成开发后提交 Pull Request

3.  至少一名团队成员审查通过

4.  通过 CI 检查

5.  合并到主分支

## 部署规范

### 1. 环境配置

#### 环境变量



```
\# .env.development

VITE\_API\_BASE\_URL=http://localhost:8080/api

VITE\_APP\_TITLE=芋道管理后台 - 开发环境

VITE\_ENABLE\_MOCK=true

\# .env.production

VITE\_API\_BASE\_URL=https://api.example.com

VITE\_APP\_TITLE=芋道管理后台

VITE\_ENABLE\_MOCK=false
```

### 2. 构建脚本



```
{

&#x20; "scripts": {

&#x20;   "dev": "vite",

&#x20;   "build": "vue-tsc && vite build",

&#x20;   "build:staging": "vue-tsc && vite build --mode staging",

&#x20;   "preview": "vite preview"

&#x20; }

}
```

### 3. 部署流程



1.  运行构建脚本生成静态文件

2.  部署到目标服务器

3.  运行数据库迁移脚本

4.  执行健康检查

## 文档规范

### 1. 代码注释

#### 函数注释



```
/\*\*

&#x20;\* 获取用户列表

&#x20;\* @param params 查询参数

&#x20;\* @param page 页码

&#x20;\* @param size 每页条数

&#x20;\* @returns 用户列表数据

&#x20;\*/

async function getUserList(

&#x20; params: UserQueryParams,

&#x20; page: number = 1,

&#x20; size: number = 20

): Promise\<UserListResult> {

&#x20; // 实现逻辑

}
```

#### 组件注释



```
\<script setup lang="ts">

/\*\*

&#x20;\* 用户列表组件

&#x20;\* @component

&#x20;\* @description 显示和管理系统用户的列表组件

&#x20;\* @props {number} pageSize - 每页显示条数

&#x20;\* @props {string} searchKeyword - 搜索关键词

&#x20;\* @emits {User} user-click - 用户点击事件

&#x20;\*/

interface Props {

&#x20; pageSize?: number

&#x20; searchKeyword?: string

}

interface Emits {

&#x20; 'user-click': \[user: User]

}

const props = withDefaults(defineProps\<Props>(), {

&#x20; pageSize: 20,

&#x20; searchKeyword: ''

})

const emit = defineEmits\<Emits>()

\</script>
```

### 2. API 文档

使用 Swagger 或其他 API 文档工具生成和维护 API 文档。

### 3. 项目文档



*   README.md: 项目说明、安装和启动指南

*   CHANGELOG.md: 版本变更记录

*   CONTRIBUTING.md: 贡献指南

*   docs/: 详细的项目文档

## 总结

本规范文档旨在建立统一的项目结构和开发标准，提高代码质量和团队协作效率。所有团队成员都应该严格遵守这些规范，并在实践中不断完善和改进。

定期回顾和更新本规范，确保其与项目发展保持同步。如有疑问或建议，请及时与团队讨论。



***

**文档版本**: 1.0.0

**最后更新**: 2025-09-24

**维护人员**: 前端团队

> (Note: This document may contain AI-generated content.)