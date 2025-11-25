# Claude Code 使用指南

欢迎使用 tcwyirs-ui 项目的 Claude Code 智能开发助手！本文档将帮助你快速上手使用 `.claude` 配置。

## 📚 目录

- [快速开始](#快速开始)
- [Commands 使用](#commands-使用)
- [Skills 使用](#skills-使用)
- [实战案例](#实战案例)
- [常见问题](#常见问题)

## 🚀 快速开始

### 什么是 Claude Code？

Claude Code 是 Anthropic 官方推出的 CLI 工具，可以通过自然语言与 Claude AI 进行交互式开发。项目中的 `.claude/` 目录包含了：

- **Commands** - 快速代码生成指令（类似脚手架）
- **Skills** - 深度知识库（自动激活的最佳实践指南）

### 前置条件

1. 安装 Claude Code CLI
```bash
# 参考官方文档安装
# https://docs.claude.com/claude-code
```

2. 在项目根目录启动
```bash
cd /path/to/tcwyirs-ui
claude
```

## 🎯 Commands 使用

Commands 是预定义的快速指令，可以快速生成代码模板。

### 可用 Commands 列表

| Command | 用途 | 示例 |
|---------|------|------|
| `/store` | 创建 Pinia Store 模块 | `/store notification` |
| `/mock` | 创建 MSW Mock 数据 | `/mock system user` |
| `/route` | 添加路由配置 | `/route resource --icon=resource` |
| `/composable` | 创建 Composable | `/composable useCounter --global` |
| `/component` | 创建 Vue 组件 | `/component UserCard` |
| `/api` | 创建 API 接口 | `/api system user` |
| `/test` | 创建测试文件 | `/test src/components/Counter.vue` |
| `/permission` | 配置权限 | `/permission user --module=system` |
| `/enum` | 创建枚举/常量 | `/enum Status --values=pending,approved` |
| `/role-layout` | 添加角色布局 | `/role-layout 数据分析师 dataAnalyst` |

### 使用方法

#### 1. 创建 Pinia Store

```bash
# 基本用法
/store notification

# 启用持久化
/store theme --persist

# 禁用持久化
/store cache --no-persist

# 指定持久化字段
/store user --keys=token,userInfo,roles
```

**生成文件**：
- `src/store/modules/notification.ts` - Store 模块
- `src/store/modules/types/notification.ts` - 类型定义（可选）

**生成内容**：
```typescript
// 完整的 Pinia Store 模板
// 包含 state, getters, actions, persist 配置
// 自动生成 useXStoreWithOut 函数
```

#### 2. 创建 Mock 数据

```bash
# 创建 CRUD Mock
/mock system user

# 简单 Mock
/mock homepage banner --simple

# 添加延迟
/mock bpm process --delay=500
```

**生成文件**：
- `src/mock/modules/system/user.ts` - Mock handlers
- 自动注册到 `src/mock/handlers.ts`

**生成内容**：
```typescript
// 完整的 CRUD mock handlers
// 包含：分页查询、详情、创建、更新、删除、导出
// 支持过滤、排序、分页
```

#### 3. 添加路由

```bash
# 基本路由
/route resource

# 带图标和权限
/route resource --icon=resource --permission=resource:query

# 嵌套路由
/route user-detail --parent=/system/user --hidden --no-cache

# 首页路由
/route dashboard --path=/ --icon=dashboard
```

**生成文件**：
- `src/router/modules/resource.ts` - 路由配置
- `src/views/Resource/List.vue` - 页面组件

**生成内容**：
```typescript
// 完整的路由配置
// 包含 meta 配置、权限、缓存策略
// 自动处理懒加载
```

#### 4. 创建 Composable

```bash
# 全局 Composable
/composable useCounter --global

# 局部 Composable
/composable useStatusStyle --local=src/views/Home/composables

# 带测试
/composable usePagination --global --test
```

**生成文件**：
- `src/hooks/web/useCounter.ts` - Composable
- `src/hooks/web/useCounter.test.ts` - 测试文件（可选）

**生成内容**：
```typescript
// 完整的 Composable 模板
// 包含类型定义、响应式状态、方法
// 符合 Vue 3 Composition API 最佳实践
```

#### 5. 创建组件

```bash
# 普通组件
/component UserProfile

# Widget 组件
/component ResourceCard --widget

# 全局组件
/component AppDialog --global

# 不生成测试
/component SimpleCard --no-test
```

**生成文件**：
- `src/components/UserProfile/UserProfile.vue` - 组件
- `src/components/UserProfile/types.ts` - 类型定义
- `src/components/UserProfile/index.ts` - 导出
- `src/components/UserProfile/UserProfile.test.ts` - 测试文件

#### 6. 创建 API 接口

```bash
# 创建 API
/api system user

# 指定模块
/api bpm process

/api homepage banner
```

**生成文件**：
- `src/api/system/user.ts` - API 函数
- `src/api/system/types.ts` - 类型定义
- `src/mock/modules/system/user.ts` - Mock 数据

**生成内容**：
```typescript
// 完整的 CRUD API
// 包含：getPage, get, create, update, delete, export
// 类型安全的请求和响应
```

#### 7. 创建测试文件

```bash
# 组件测试
/test src/components/Counter/Counter.vue

# Composable 测试
/test src/hooks/web/useCounter.ts --type=composable

# 函数测试
/test src/utils/format.ts --type=function
```

**生成文件**：
- 对应的 `.test.ts` 文件
- 包含完整的测试用例模板

#### 8. 配置权限

```bash
# 基本权限
/permission user

# 指定模块
/permission resource --module=marketplace

# 指定操作
/permission report --actions=query,export

# 限制角色
/permission admin-panel --roles=admin,super_admin
```

**生成文件**：
- `src/permissions/system.ts` - 权限常量
- 路由配置中的权限设置
- Mock 用户权限配置

#### 9. 创建枚举

```bash
# 字符串枚举
/enum Status --values=pending,approved,rejected

# Const 常量
/enum UserType --type=const --values=admin,user,guest

# 数值枚举
/enum Priority --numeric --values=low,medium,high
```

**生成文件**：
- `src/enums/status.ts` - 枚举定义
- 包含标签映射、颜色映射、选项数组

#### 10. 添加角色布局

```bash
# 添加新角色布局
/role-layout 数据分析师 dataAnalyst

/role-layout 审计员 auditor
```

**生成内容**：
- Home 页面配置更新
- Widget 组件（如需要）
- Mock 测试账号

## 📖 Skills 使用

Skills 是深度知识库，当你编写相关代码时会**自动激活**，无需手动调用。

### 可用 Skills 列表

| Skill | 内容 | 自动激活场景 |
|-------|------|-------------|
| `vue-development.md` | Vue 3 开发模式 | 编写 Vue 组件时 |
| `typescript-patterns.md` | TypeScript 模式 | 编写 TypeScript 代码时 |
| `component-architecture.md` | 组件架构 | 设计组件结构时 |
| `state-management.md` | Pinia 状态管理 | 使用 Store 时 |
| `routing-permissions.md` | 路由与权限 | 配置路由或权限时 |
| `mock-service.md` | MSW Mock 服务 | 编写 Mock 数据时 |
| `styling.md` | 样式开发规范 | 编写样式时 |
| `testing.md` | 测试策略 | 编写测试时 |
| `performance.md` | 性能优化 | 优化性能时 |

### 如何触发 Skills

Skills 会根据你的问题和代码上下文自动激活，例如：

```bash
# 在 Claude Code 中提问
"如何创建一个 Pinia Store？"
# 自动激活 state-management.md skill

"这个组件性能不好，如何优化？"
# 自动激活 performance.md skill

"如何配置路由权限？"
# 自动激活 routing-permissions.md skill
```

### Skills 包含内容

每个 Skill 文件包含：

1. **核心概念** - 技术要点
2. **最佳实践** - 项目规范
3. **代码示例** - 实际案例
4. **常见问题** - 问题解决
5. **调试技巧** - 开发提示

## 🎓 实战案例

### 案例 1：添加新的资源管理功能

**需求**：添加"数据集管理"功能，包括列表、详情、创建、编辑、删除。

**步骤**：

```bash
# 1. 创建 API 接口
/api marketplace dataset
# 生成：src/api/marketplace/dataset.ts
#      src/api/marketplace/types.ts
#      src/mock/modules/marketplace/dataset.ts

# 2. 创建路由
/route dataset --icon=dataset --permission=dataset:query
# 生成：src/router/modules/dataset.ts
#      src/views/Dataset/List.vue

# 3. 创建枚举（数据集类型）
/enum DatasetType --values=text,image,video,audio
# 生成：src/enums/dataset-type.ts

# 4. 创建 Store（管理选中的数据集）
/store selectedDataset --persist
# 生成：src/store/modules/selectedDataset.ts

# 5. 配置权限
/permission dataset --module=marketplace --actions=query,create,update,delete,download
# 更新：src/permissions/marketplace.ts

# 6. 创建测试
/test src/views/Dataset/List.vue
# 生成：src/views/Dataset/List.test.ts
```

**完成！** 现在你可以手动完善业务逻辑和 UI。

### 案例 2：添加新用户角色的 Home 布局

**需求**：为"数据分析师"角色配置专属的 Home 页面布局。

**步骤**：

```bash
# 1. 添加角色布局配置
/role-layout 数据分析师 dataAnalyst

# Claude 会引导你：
# - 创建需要的 Widget 组件
# - 配置布局（左右分栏、响应式）
# - 注册组件映射
# - 添加测试账号

# 2. 测试
# 登录账号：dataAnalyst / admin123
# 查看专属 Home 页面
```

### 案例 3：优化列表性能

**问题**：列表页面有 1000 条数据，滚动卡顿。

**解决**：

```bash
# 在 Claude Code 中提问
"这个列表页面有 1000 条数据，滚动很卡，如何优化？"

# Claude 会：
# 1. 自动激活 performance.md skill
# 2. 提供虚拟滚动方案
# 3. 给出具体代码实现
# 4. 解释性能优化原理
```

### 案例 4：编写单元测试

**需求**：为 `useCounter` composable 编写测试。

**步骤**：

```bash
# 1. 创建测试文件
/test src/hooks/web/useCounter.ts --type=composable

# 2. Claude 会生成完整的测试模板
# 3. 手动补充特定业务逻辑的测试用例

# 4. 运行测试
pnpm test useCounter

# 5. 查看覆盖率
pnpm test:coverage
```

## 💡 使用技巧

### 1. 组合使用 Commands

```bash
# 一次性创建完整功能
/api system user && /route user --icon=user && /permission user
```

### 2. 利用 Skills 学习

```bash
# 提问触发 Skill
"如何使用 shallowRef 优化性能？"
# → 激活 performance.md

"v-auth 指令如何使用？"
# → 激活 routing-permissions.md

"如何编写 Composable？"
# → 激活 vue-development.md
```

### 3. 渐进式开发

```bash
# 步骤 1：先创建基础结构
/api resource resource
/route resource

# 步骤 2：Claude 帮你完善业务逻辑
"请帮我实现资源列表的搜索和过滤功能"

# 步骤 3：添加测试
/test src/views/Resource/List.vue

# 步骤 4：优化性能
"这个列表页面加载慢，如何优化？"
```

### 4. 参考现有代码

```bash
# 让 Claude 参考项目中的现有实现
"参考 User 模块的实现，帮我创建 Resource 模块"

"按照 Home 页面的布局模式，创建一个新的 Dashboard"
```

## ❓ 常见问题

### Q1: Commands 和 Skills 有什么区别？

- **Commands** - 快速生成代码模板（类似脚手架）
  - 主动调用：`/command-name`
  - 生成文件和代码
  - 适合重复性工作

- **Skills** - 深度知识库（自动激活）
  - 被动触发：根据上下文
  - 提供指导和最佳实践
  - 适合学习和问题解决

### Q2: 生成的代码可以直接使用吗？

大部分可以，但通常需要：
1. **基础结构** - 100% 可用（API、路由、Store 等）
2. **业务逻辑** - 需要根据具体需求完善
3. **UI 样式** - 需要调整以符合设计规范

### Q3: 如何查看所有可用的 Commands？

```bash
# 在 Claude Code 中输入
/help

# 或查看文档
ls .claude/commands/
```

### Q4: Skills 如何手动查看？

```bash
# 查看所有 Skills
ls .claude/skills/

# 用编辑器打开查看
code .claude/skills/state-management.md
```

### Q5: 生成的代码不符合预期怎么办？

```bash
# 方法 1：重新生成并指定详细参数
/api system user --actions=query,create,update,delete

# 方法 2：让 Claude 修改
"请修改 user.ts，添加批量删除功能"

# 方法 3：参考文档
"根据 api.md 的规范，重新生成 user API"
```

### Q6: 如何贡献新的 Commands 或 Skills？

1. 在 `.claude/commands/` 或 `.claude/skills/` 创建新文件
2. 参考现有文件的格式
3. 提交 Pull Request

### Q7: 为什么我的 Command 不生效？

检查：
1. 文件是否在 `.claude/commands/` 目录
2. 文件扩展名是否为 `.md`
3. 文件格式是否正确
4. 重启 Claude Code CLI

## 🔗 相关资源

- [Claude Code 官方文档](https://docs.claude.com/claude-code)
- [项目技术文档](./CLAUDE.md)
- [Commands 目录](./.claude/commands/)
- [Skills 目录](./.claude/skills/)

## 🎉 开始使用

现在你已经掌握了 Claude Code 的使用方法！

**推荐起步**：
1. 从简单的 Command 开始：`/enum Status --values=pending,approved`
2. 尝试创建一个完整功能：API + 路由 + 权限
3. 在编写代码时体验 Skills 的自动激活
4. 遇到问题时向 Claude 提问，获取针对性指导

**记住**：
- Commands 用于快速生成
- Skills 用于深度学习
- 结合使用效果最佳

祝你开发愉快！🚀
