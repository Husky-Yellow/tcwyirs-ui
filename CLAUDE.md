# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **tcwyirs-ui**, a modern Vue 3 admin dashboard UI project based on the Yudao Admin framework. The project is hosted on GitLab at `git@gitlab.tcwy.net:pangu/tcwyirs-ui.git`.

## Technology Stack

### Core Framework
- **Vue 3** - Modern Vue.js framework with Composition API
- **TypeScript** - Full TypeScript support for type safety
- **Vite** - Fast build tool and development server
- **Pinia** - State management (optimized with VueUse)
- **Vue Router** - Client-side routing with dynamic route generation

### UI Components & Styling
- **Element Plus** - Vue 3 UI component library
- **UnoCSS** - Instant on-demand atomic CSS engine
- **@vueuse/core** - Collection of Vue 3 composition utilities

### Development Tools
- **ESLint** - Code linting with auto-fix
- **Prettier** - Code formatting
- **Stylelint** - CSS/SCSS linting
- **PNPM** - Fast, disk space efficient package manager

## Development Commands

### Package Management
```bash
pnpm i                    # Install dependencies
pnpm clean               # Remove node_modules
pnpm clean:cache         # Clear build cache
```

### Development Server
```bash
pnpm dev                 # Start development server (local env)
pnpm dev-server          # Start development server (dev env)
```

### Building
```bash
pnpm build:local         # Build for local environment
pnpm build:dev           # Build for development environment
pnpm build:test          # Build for test environment
pnpm build:stage         # Build for staging environment
pnpm build:prod          # Build for production environment
```

### Preview & Serve
```bash
pnpm preview             # Build and preview locally
pnpm serve:dev           # Preview dev build
pnpm serve:prod          # Preview production build
```

### Code Quality
```bash
pnpm lint:eslint         # Run ESLint with auto-fix
pnpm lint:format         # Format code with Prettier
pnpm lint:style          # Lint CSS/SCSS with Stylelint
pnpm ts:check            # TypeScript type checking
```

### Spec Workflow (MCP Integration)
```bash
pnpm spec-work           # Launch Spec Workflow dashboard
```

## Project Structure

```
src/
├── api/                 # API service modules
├── components/          # Reusable Vue components
├── config/             # Configuration files
│   └── axios/          # Axios configuration (国际化已移除)
├── directives/         # Vue custom directives
├── hooks/              # Vue composition hooks
├── layout/             # Layout components
├── router/             # Vue Router configuration
├── store/              # Pinia store modules (使用 VueUse 优化)
├── styles/             # Global styles
├── utils/              # Utility functions (强类型化)
├── views/              # Page components
└── types/              # TypeScript type definitions
```

## Code Optimizations Applied

### 1. Authentication System (`src/utils/auth.ts`)
- ✅ **Vue 3 + VueUse Integration**: 使用 `createGlobalState`, `useStorage`, `useToggle`
- ✅ **Reactive State Management**: 全局响应式状态管理
- ✅ **Type Safety**: 完整的 TypeScript 类型定义
- ✅ **Backward Compatibility**: 保持原有 API 兼容性

### 2. Permission Store (`src/store/modules/permission.ts`)
- ✅ **VueUse State Management**: `createGlobalState`, `useAsyncState`, `whenever`
- ✅ **Performance Optimization**: 使用 `shallowRef` 优化大型路由数组
- ✅ **Enhanced Route Operations**: 新增路由添加、删除、重置功能
- ✅ **Async State Tracking**: 路由生成加载状态管理

### 3. HTTP Service (`src/config/axios/service.ts`)
- ✅ **去除国际化依赖**: 移除 `useI18n()` 调用，使用静态中文文本
- ✅ **Error Handling**: 完整的错误处理和用户提示

### 4. Type Utilities (`src/utils/is.ts`)
- ✅ **Zero `any` Types**: 完全移除 `any` 类型，使用精确的 TypeScript 类型
- ✅ **Enhanced Type Guards**: 新增 20+ 个类型守卫函数
- ✅ **Utility Functions**: 邮箱、手机号、身份证等验证函数

## MCP Integration

### Spec Workflow MCP
已配置 `@pimzino/spec-workflow-mcp` 用于项目规格管理和工作流程：

- **Auto Dashboard**: 自动启动工作流程仪表板
- **Project Path**: 配置为当前项目路径
- **Integration**: 与 Claude Code 深度集成

### MCP Servers
- `spec-workflow-mcp`: 基础规格工作流程
- `spec-workflow`: 项目特定工作流程（带自动启动仪表板）

## Environment Configuration

### Available Environments
- **local** (`env.local`) - 本地开发环境
- **dev** (`env.dev`) - 开发环境
- **test** (`env.test`) - 测试环境
- **stage** (`env.stage`) - 预发布环境
- **prod** (`env.prod`) - 生产环境

### Key Features Configured
- **Tenant System**: 多租户支持 (`VITE_APP_TENANT_ENABLE`)
- **API Mocking**: MockJS 集成
- **Captcha**: 验证码系统

## Repository Information

- **Remote**: `git@gitlab.tcwy.net:pangu/tcwyirs-ui.git`
- **Default Branch**: `main`
- **Current Branch**: `feature/release`
- **Package Manager**: PNPM
- **Node Version**: 指定版本请参考 `.nvmrc`

## Code Standards

### TypeScript Guidelines
- 使用严格的类型检查
- 避免使用 `any` 类型
- 优先使用类型守卫和联合类型
- 利用 Vue 3 的类型推断

### Vue 3 Best Practices
- 优先使用 Composition API
- 利用 VueUse 工具函数
- 使用响应式状态管理
- 保持向后兼容性

### Performance Optimizations
- 使用 `shallowRef` 处理大型数据结构
- 实现组件懒加载
- 利用 Vite 的代码分割
- 缓存优化策略

## Recent Updates

### 2025-09-25
- ✅ 完成认证系统 Vue 3 + VueUse 优化
- ✅ 权限管理系统现代化重构
- ✅ HTTP 服务去国际化处理
- ✅ 类型工具函数完全类型安全化
- ✅ MCP 工作流程集成配置

---

*This CLAUDE.md file reflects the current state of the tcwyirs-ui project with all recent optimizations and configurations.*