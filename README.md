# TCWYIRS UI

基于 Vue3 + TypeScript + Vite5 + Element Plus 的现代化管理系统前端项目。

## 环境要求

- Node.js > 16.18.0
- pnpm > 8.6.0 (强制使用 pnpm)

## 技术栈

| 框架                                                                   | 说明               | 版本      |
|----------------------------------------------------------------------|------------------|---------|
| [Vue](https://staging-cn.vuejs.org/)                                 | Vue 框架           | 3.5.13  |
| [Vite](https://cn.vitejs.dev//)                                      | 开发与构建工具          | 5.1.4   |
| [Element Plus](https://element-plus.org/zh-CN/)                      | Element Plus     | 2.11.3  |
| [TypeScript](https://www.typescriptlang.org/docs/)                   | JavaScript 的超集   | 5.7.3   |
| [pinia](https://pinia.vuejs.org/)                                    | Vue 存储库 替代 vuex5 | 2.2.8   |
| [vueuse](https://vueuse.org/)                                        | 常用工具集            | 11.3.0  |
| [vue-i18n](https://kazupon.github.io/vue-i18n/zh/introduction.html/) | 国际化              | 10.0.6  |
| [vue-router](https://router.vuejs.org/)                              | Vue 路由           | 4.4.5   |
| [unocss](https://uno.antfu.me/)                                      | 原子 css           | 0.64.6  |
| [iconify](https://icon-sets.iconify.design/)                         | 在线图标库            | 3.1.1   |
| [wangeditor](https://www.wangeditor.com/)                            | 富文本编辑器           | 5.1.23  |

## 核心特性

- **最新技术栈**：使用 Vue3、Vite5 等前端前沿技术开发
- **TypeScript**：应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **国际化**：内置完善的国际化方案
- **权限**：内置完善的动态路由权限生成方案
- **组件**：二次封装了多个常用的组件
- **性能优化**：esbuild 快速构建、智能代码分割、ESLint 缓存

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
# 本地开发 (.env.local)
pnpm dev

# 开发服务器
pnpm dev-server
```

### 构建

```bash
# 本地构建
pnpm build:local

# 开发环境构建
pnpm build:dev

# 测试环境构建
pnpm build:test

# 预发布环境构建
pnpm build:stage

# 生产环境构建
pnpm build:prod
```

### 预览

```bash
# 开发环境预览
pnpm serve:dev

# 生产环境预览
pnpm serve:prod

# 通用预览
pnpm preview
```

### 代码质量

```bash
# TypeScript 类型检查
pnpm ts:check

# ESLint 检查
pnpm lint:eslint

# 样式检查
pnpm lint:style

# 代码格式化
pnpm format
```

### 清理

```bash
# 清理依赖和构建产物
pnpm clean

# 清理缓存
pnpm clean:cache
```

## 开发工具

推荐使用 VS Code 开发，配合以下插件：

| 插件名                           | 功能                  |
|-------------------------------|---------------------|
| Vue - Official                | Vue 与 TypeScript 支持 |
| unocss                        | unocss for vscode   |
| Iconify IntelliSense          | Iconify 预览和搜索       |
| i18n Ally                     | 国际化智能提示             |
| Stylelint                     | CSS 格式化             |
| ESLint                        | 脚本代码检查              |
| DotENV                        | env 文件高亮            |

## 项目结构

```
tcwyirs-ui/
├── build/              # Vite 构建配置
│   └── vite/
│       ├── index.ts    # 插件配置
│       └── optimize.ts # 依赖预构建
├── public/             # 静态资源
├── src/
│   ├── api/           # API 接口
│   ├── assets/        # 资源文件
│   ├── components/    # 全局组件
│   ├── directives/    # 自定义指令
│   ├── hooks/         # 组合式函数
│   ├── layout/        # 布局组件
│   ├── plugins/       # 插件配置
│   ├── router/        # 路由配置
│   ├── store/         # Pinia 状态管理
│   ├── styles/        # 全局样式
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── .env               # 环境变量（基础）
├── .env.local         # 环境变量（本地）
├── .env.dev           # 环境变量（开发）
├── .env.test          # 环境变量（测试）
├── .env.stage         # 环境变量（预发布）
├── .env.prod          # 环境变量（生产）
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目配置
```

## 性能优化

- **esbuild 构建**：使用 esbuild 代替 terser，构建速度提升 20-40 倍
- **智能代码分割**：自动将依赖分割为 8 个 vendor chunks，优化缓存策略
- **ESLint 缓存**：开发环境启用 ESLint 缓存，提升二次启动速度
- **环境分离**：开发和生产环境插件分离加载，减少不必要的开销
- **依赖预构建**：精心配置的依赖预构建列表，加快开发服务器启动

## 许可证

本项目采用 MIT 许可证。
