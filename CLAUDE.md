# AGENT PLAYBOOK -- tcwyirs-ui

> 项目技术文档和开发指南 | [English](./README.md)

## 📖 文档导航

- **[快速开始](#install--run)** - 安装和运行
- **[技术栈](#tech-stack-snapshot)** - 技术选型
- **[Claude Code 使用](./.claude/USAGE.md)** - AI 辅助开发指南 ⭐
- **[快速参考](./.claude/QUICK-REFERENCE.md)** - 常用命令速查
- **[目录结构](#directory-compass)** - 项目结构
- **[Home 布局系统](#home-layout-system)** - 角色配置系统
- **[开发规范](#patterns--conventions)** - 编码规范

## 🤖 Claude Code 智能助手

本项目已配置 **Claude Code** 智能开发助手，提供：

- **📝 Commands** - 10+ 快速代码生成命令
  - `/store` - 创建 Pinia Store
  - `/mock` - 创建 Mock 数据
  - `/route` - 添加路由配置
  - `/api` - 创建 API 接口
  - `/component` - 创建 Vue 组件
  - [查看所有 Commands →](./.claude/USAGE.md#commands-使用)

- **📚 Skills** - 9+ 深度知识库（自动激活）
  - 状态管理、路由权限、Mock 服务
  - 样式规范、测试策略、性能优化
  - [查看所有 Skills →](./.claude/USAGE.md#skills-使用)

**快速开始**：
```bash
# 安装 Claude Code CLI（首次使用）
# https://docs.claude.com/claude-code

# 在项目中启动
claude

# 使用 Commands 快速生成代码
/store notification --persist
/api system user
/route resource --icon=resource

# 向 Claude 提问触发 Skills
"如何创建 Pinia Store？"
"v-auth 指令如何使用？"
"如何优化列表性能？"
```

详细使用指南：[.claude/USAGE.md](./.claude/USAGE.md)

---

## Tech Stack Snapshot
- Vue 3 + TypeScript with Vite 5.1.4 bundling and hot module replacement.
- Element Plus 2.11.3 UI kit, FormCreate designer, UnoCSS utilities, global SCSS, and SVG icon pipeline.
- Pinia state (with persisted storage) and Vue Router 4 for navigation and permissions.
- Axios-based service layer under `src/config/axios` for request/response interceptors, token injection, and tenant-aware error handling.
- Vitest + Vue Test Utils for unit tests; ESLint with caching enforces formatting and conventions.
- Build optimizations: esbuild minification (20-40x faster than terser), environment-based plugin loading, intelligent code splitting across 8 vendor chunks.
- Mock service: MSW (Mock Service Worker) enabled in dev mode for API mocking at `src/mock`.

## Install & Run
- Use `pnpm install` to sync dependencies (project published as `yudao-ui-admin-vue3`).
- Local dev defaults to `.env.local`: `pnpm dev` (alias for `vite --mode env.local`).
- Alternate environments: `pnpm dev-server`, `pnpm build:local|dev|test|stage|prod`, `pnpm serve:dev|prod`, `pnpm preview` (build + preview).
- Maintenance scripts: `pnpm clean`, `pnpm clean:cache`, `pnpm ts:check`, and lint commands (`pnpm lint:eslint`, `pnpm lint:style`, `pnpm format`).
- Dev performance: ESLint caching enabled at `node_modules/.cache/eslint` for faster linting on subsequent runs.

## Environment Profiles
- Base vars in `.env`, overrides in `.env.*`. Key flags: `VITE_APP_TITLE`, `VITE_PORT`, tenant and captcha toggles, default login credentials.
- Pick the correct mode via CLI (`--mode prod`, etc.). Never commit sensitive keys; keep secrets in deployment-specific vaults and document new env additions in PRs.
- Ensure API base URLs and tenant switches match the backend you target before building.

## Directory Compass
- `src/main.ts`: boot pipeline registering store (`setupStore`), global components, Element Plus, FormCreate, UnoCSS, directives, router, DOMPurify, MSW mock service (dev only), and welcome logging.
- `src/permission.ts`: global navigation guard managing token checks, white-list routes, async dict/user hydration, dynamic menu injection (`permissionStore.generateRoutes()`), NProgress/page loaders, and title sync.
- `src/router`: route modules. Respect existing meta (`title`, `permissions`, `keepAlive`) when adding pages.
- `src/store/modules`: Pinia modules (`user`, `permission`, `dict`, etc.) centralize state with persistence. Use `useXStoreWithOut` helpers outside setup functions.
- `src/api`: REST clients grouped by domain (`system`, `bpm`, `homepage`, `marketplace`). Follow existing request helpers and typing patterns.
- `src/plugins`: Element Plus configuration, UnoCSS, SVG icons, animate.css, FormCreate. Add new integrations via `setupX` functions for consistency.
- `src/components`: reusable/global components auto-registered through `setupGlobCom`. Note: README.md files are excluded from auto-import to avoid naming conflicts.
- `src/views`: feature-first page implementations. Keep nested modules inside their domain folder.
  - `src/views/Home`: Role-based dynamic home page with config-driven layout system. See [Home Layout System](#home-layout-system) below.
- Supporting utilities: `src/hooks`, `src/utils`, `src/directives`, `src/mock` (MSW handlers), `public` (static assets), `build/` (generated output).
- `build/vite`: Vite configuration split across `index.ts` (plugins), `optimize.ts` (dependency pre-bundling), with environment-aware plugin loading.

## Home Layout System
The home page uses a **role-based, config-driven layout system** for maximum flexibility:

### Architecture
- **Configuration**: `src/views/Home/config/roleLayout.ts` maps roles to layout configs
- **Types**: `src/views/Home/types/layout.ts` defines layout structure and component types
- **Component Registry**: `src/views/Home/utils/componentMap.ts` maps component types to Vue components
- **Composable**: `src/views/Home/composables/useHomeLayout.ts` resolves current user's layout
- **Rendering**: `src/views/Home/Index.vue` dynamically renders components based on configuration

### Supported Roles
| Role | Code | Layout Features |
|------|------|----------------|
| 项目成员/项目经理 | `admin`, `super_admin` | 我申请的资源、反馈意见、资源使用看板、消息、帮助文档 |
| 资源管理员 | `resourceAdmin` | 我上架的资源、待我审批的资源、反馈意见、资源使用看板、消息、帮助文档 |
| 运营管理员 | `operationAdmin` | 资源上架审批、反馈意见、消息、帮助文档 |
| 数据管理员 | `dataAdmin` | 资源使用看板、我浏览过的资源、系统通知 |
| 普通用户 | `user` | 我浏览过的资源、帮助文档、消息 |
| 访客 | `guest` | 帮助文档、公告 |

### Adding New Roles
1. Define component type in `types/layout.ts` enum `HomeComponentType`
2. Create widget component in `components/widgets/`
3. Register component in `utils/componentMap.ts`
4. Add role layout config in `config/roleLayout.ts`
5. Register in `ROLE_LAYOUT_CONFIG` mapping

### Example: Add New Widget
```typescript
// 1. Add component type
export enum HomeComponentType {
  MY_NEW_WIDGET = 'MyNewWidget',
  // ...
}

// 2. Register component
import MyNewWidget from '../components/widgets/MyNewWidget.vue'
export const COMPONENT_MAP = {
  [HomeComponentType.MY_NEW_WIDGET]: markRaw(MyNewWidget),
  // ...
}

// 3. Add to role layout
const customRoleLayout: HomeLayoutConfig = {
  left: {
    span: { xl: 16, lg: 16, md: 24, sm: 24, xs: 24 },
    components: [{ type: HomeComponentType.MY_NEW_WIDGET, order: 1 }]
  },
  // ...
}
```

## Mock Data & Development
- **MSW-based mocking**: `src/mock/` contains mock handlers auto-loaded in dev mode (`import.meta.env.DEV`)
- **Mock configs**: Organized by module (`auth/login.ts`, `system/role.ts`, etc.)
- **Test accounts**: Mock data includes pre-configured users for role testing:
  - `admin` / `admin123` → Super admin (项目成员/项目经理)
  - `resourceAdmin` / `admin123` → 资源管理员
  - `operationAdmin` / `admin123` → 运营管理员
  - `guest` / `admin123` → 访客
- **Adding mocks**: Create handler in `src/mock/modules/[domain]/`, export in `src/mock/handlers.ts`
- **Disable mocks**: Set `import.meta.env.DEV = false` or remove `setupMock()` call in `main.ts`

## Patterns & Conventions
- File naming: `kebab-case.vue/ts`. Components use `PascalCase` in templates; scripts use `camelCase`; shared constants use `SCREAMING_SNAKE_CASE`.
- Import paths: leverage `@/` aliases from `tsconfig.json` instead of deep relative paths.
- Networking: route all HTTP calls through the axios instance; reuse request configs in `src/config/axios/service.ts` to keep interceptors aligned (relogin prompts, token refresh, error notifications).
- Permissions: attach `meta.permissions` or `meta.roles` to route records and pair with the `v-auth` directive provided by `setupAuth`.
- Forms: prefer FormCreate schema configs; when hand-rolling forms, reuse Element Plus components and existing validation utilities.
- Persistence: Pinia modules persist via plugin; update storage keys deliberately to avoid breaking logout or tenant switching logic.
- Code splitting: production builds automatically separate dependencies into 8 vendor chunks (vue, element-plus, echarts, form-create, form-designer, editor, utils, bpmn) for optimal caching and parallel loading.
- **Composables**: Extract reusable logic into composables (e.g., `useStatusStyle` for status styling). Follow VueUse patterns.
- **UnoCSS First**: Prefer UnoCSS utility classes over custom styles. Only use `<style>` blocks for complex/dynamic styling.

## Vue 3 APIs & Hooks Snapshot
- Composition style: 138 of 382 `.vue` files (~36%) already use `<script setup>`. Favor it for new work unless Options API compatibility is required.
- Reactivity optimizations: `shallowRef` stabilizes heavy instances (BPMN modeler, sticky headers, rich editors) and `markRaw` locks static config in `components/Footer`. Reach for these when working with large third-party objects.
- Async loading: `defineAsyncComponent` powers dynamic route modules via `src/utils/routerHelper.ts` and the DIY editor palette loader. Reuse this pattern for lazy features.
- Custom composables: 17+ web hooks (`useCrudSchemas`, `useTable`, `useMessage`, `useWatermark`, `useStatusStyle`, etc.) plus `event/useScrollTo.ts` cover most UX needs. Extend these first before authoring new hooks.
- VueUse footprint: `useVModel(s)` appears in 32 components (~8% of Vue files) for two-way binding; `useDebounceFn` in 7 files (~2%), `useBreakpoints` in 6 (responsive public views), `useLocalStorage` in 5 (login and public caching), `useClipboard` in 4 (generator tooling), and smaller utilities (`useWindowSize`, `useEventListener`, `useWebSocket`, `useCssVar`, `useTemplateRefsList`) underpin layout and realtime features. Prefer VueUse primitives instead of bespoke utilities.
- DOM and styling helpers: `useCssVar` drives runtime theming (`useNProgress`, layout settings) while `useTemplateRefsList` coordinates dynamic tab refs in `layout/components/TagsView`. Adopt these patterns for DOM measurement and theme sync.

## UI & Styling
- Global styling lives in `src/styles/index.scss`; extend theme tokens there. Respect UnoCSS utilities and configure new ones via `uno.config.ts`.
- Icons rely on `src/plugins/svgIcon` and `@iconify` fallback. Drop custom SVGs into the icons directory to auto-register.
- Animations: reuse animate.css classes from `src/plugins/animate.css` to keep bundle size stable.
- Keep inline styles minimal; prefer SCSS variables, mixins, or UnoCSS classes.
- **Status styling**: Use `useStatusStyle` composable for consistent status indicators (dots + text colors). Supports custom color maps.

## Testing & Quality Gates
- Tests colocate with source (`*.test.ts`, `*.spec.tsx`). Use `pnpm test`, `pnpm test:run`, `pnpm test:coverage`, or `pnpm test:ui` (interactive).
- Static analysis: `pnpm lint:eslint` (with cache for performance), `pnpm lint:style`, `pnpm format`. Combine with `pnpm ts:check` before PRs.
- ESLint runs only in dev mode with caching enabled; production builds skip linting for faster deployment.
- Document coverage gaps or manual QA steps when automation is not feasible.

## Delivery Workflow
- Follow Conventional Commits (e.g., `feat(auth): add refresh token flow`). Keep commits scoped and avoid unrelated formatting.
- PR checklist: describe scope, reference issues, outline manual QA, include screenshots or GIFs for UI changes, note env toggles or migrations.
- For new routes or permissions, update router meta, menu definitions, and state modules together to keep guard logic intact.
- Run `pnpm build:prod` or environment-specific build pre-merge; smoke-test via `pnpm serve:prod` when possible.

## Release Readiness Checklist
- [ ] Environment files updated for target stage (tenant, captcha, API host).
- [ ] Permission guard aware of new routes or resources.
- [ ] Store, API contracts, and mock data adjusted and documented.
- [ ] Production build (`pnpm build:prod`) and preview (`pnpm serve:prod`) succeed locally.
- [ ] Quality gates pass (`pnpm test`, lint scripts, `pnpm ts:check`).
- [ ] Release notes and manual QA steps captured in the PR.

## File Organization Notes
- `AGENTS.md` is a symbolic link to `CLAUDE.md` for cross-platform compatibility
- Git symlinks enabled via `git config core.symlinks true`
- `.claude/` directory contains Commands and Skills for AI-assisted development

## 📚 Additional Resources

### Development Guides
- [Claude Code 使用指南](./.claude/USAGE.md) - 完整使用文档
- [快速参考卡片](./.claude/QUICK-REFERENCE.md) - 常用命令速查

### Commands Documentation
- [/store](./.claude/commands/store.md) - 创建 Pinia Store 模块
- [/mock](./.claude/commands/mock.md) - 创建 MSW Mock 数据
- [/route](./.claude/commands/route.md) - 添加路由配置
- [/composable](./.claude/commands/composable.md) - 创建 Composable
- [/component](./.claude/commands/component.md) - 创建 Vue 组件
- [/api](./.claude/commands/api.md) - 创建 API 接口
- [/test](./.claude/commands/test.md) - 创建测试文件
- [/permission](./.claude/commands/permission.md) - 配置权限
- [/enum](./.claude/commands/enum.md) - 创建枚举/常量
- [/role-layout](./.claude/commands/role-layout.md) - 添加角色布局

### Skills Documentation
- [State Management](./.claude/skills/state-management.md) - Pinia 状态管理
- [Routing & Permissions](./.claude/skills/routing-permissions.md) - 路由与权限
- [Mock Service](./.claude/skills/mock-service.md) - MSW Mock 服务
- [Vue Development](./.claude/skills/vue-development.md) - Vue 3 开发模式
- [TypeScript Patterns](./.claude/skills/typescript-patterns.md) - TypeScript 模式
- [Component Architecture](./.claude/skills/component-architecture.md) - 组件架构
- [Styling](./.claude/skills/styling.md) - 样式开发规范
- [Testing](./.claude/skills/testing.md) - 测试策略
- [Performance](./.claude/skills/performance.md) - 性能优化

### External Links
- [Claude Code Official Docs](https://docs.claude.com/claude-code)
- [Vue 3 Documentation](https://vuejs.org/)
- [Element Plus Documentation](https://element-plus.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [UnoCSS Documentation](https://unocss.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

**Happy Coding with Claude! 🚀**
