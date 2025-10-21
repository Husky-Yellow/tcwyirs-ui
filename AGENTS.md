# AGENT PLAYBOOK -- tcwyirs-ui

## Tech Stack Snapshot
- Vue 3 + TypeScript with Vite 4 bundling and hot module replacement.
- Element Plus UI kit, FormCreate designer, UnoCSS utilities, global SCSS, and SVG icon pipeline.
- Pinia state (with persisted storage) and Vue Router 4 for navigation and permissions.
- Axios-based service layer under `src/config/axios` for request/response interceptors, token injection, and tenant-aware error handling.
- Vitest + Vue Test Utils for unit tests; ESLint, Stylelint, and Prettier enforce formatting and conventions.

## Install & Run
- Use `pnpm install` to sync dependencies (project published as `yudao-ui-admin-vue3`).
- Local dev defaults to `.env.local`: `pnpm dev` (alias for `vite --mode env.local`).
- Alternate environments: `pnpm dev-server`, `pnpm build:local|dev|test|stage|prod`, `pnpm serve:dev|prod`, `pnpm preview` (build + preview).
- Maintenance scripts: `pnpm clean`, `pnpm clean:cache`, `pnpm ts:check`, and lint bundles (`pnpm lint:eslint`, `pnpm lint:style`, `pnpm lint:format`).

## Environment Profiles
- Base vars in `.env`, overrides in `.env.*`. Key flags: `VITE_APP_TITLE`, `VITE_PORT`, tenant and captcha toggles, default login credentials.
- Pick the correct mode via CLI (`--mode prod`, etc.). Never commit sensitive keys; keep secrets in deployment-specific vaults and document new env additions in PRs.
- Ensure API base URLs and tenant switches match the backend you target before building.

## Directory Compass
- `src/main.ts`: boot pipeline registering store (`setupStore`), global components, Element Plus, FormCreate, UnoCSS, directives, router, DOMPurify, and welcome logging.
- `src/permission.ts`: global navigation guard managing token checks, white-list routes, async dict/user hydration, dynamic menu injection (`permissionStore.generateRoutes()`), NProgress/page loaders, and title sync.
- `src/router`: route modules. Respect existing meta (`title`, `permissions`, `keepAlive`) when adding pages.
- `src/store/modules`: Pinia modules (`user`, `permission`, `dict`, etc.) centralize state with persistence. Use `useXStoreWithOut` helpers outside setup functions.
- `src/api`: REST clients grouped by domain (`system`, `bpm`, `homepage`, `marketplace`). Follow existing request helpers and typing patterns.
- `src/plugins`: Element Plus configuration, UnoCSS, SVG icons, animate.css, FormCreate. Add new integrations via `setupX` functions for consistency.
- `src/components`: reusable/global components auto-registered through `setupGlobCom`.
- `src/views`: feature-first page implementations. Keep nested modules inside their domain folder.
- Supporting utilities: `src/hooks`, `src/utils`, `src/directives`, `src/mock` (enable via `mockXHR`), `public` (static assets), `build/` (generated output).

## Patterns & Conventions
- File naming: `kebab-case.vue/ts`. Components use `PascalCase` in templates; scripts use `camelCase`; shared constants use `SCREAMING_SNAKE_CASE`.
- Import paths: leverage `@/` aliases from `tsconfig.json` instead of deep relative paths.
- Networking: route all HTTP calls through the axios instance; reuse request configs in `src/config/axios/service.ts` to keep interceptors aligned (relogin prompts, token refresh, error notifications).
- Permissions: attach `meta.permissions` or `meta.roles` to route records and pair with the `v-auth` directive provided by `setupAuth`.
- Forms: prefer FormCreate schema configs; when hand-rolling forms, reuse Element Plus components and existing validation utilities.
- Persistence: Pinia modules persist via plugin; update storage keys deliberately to avoid breaking logout or tenant switching logic.

## Vue 3 APIs & Hooks Snapshot
- Composition style: 138 of 382 `.vue` files (~36%) already use `<script setup>`. Favor it for new work unless Options API compatibility is required.
- Reactivity optimizations: `shallowRef` stabilizes heavy instances (BPMN modeler, sticky headers, rich editors) and `markRaw` locks static config in `components/Footer`. Reach for these when working with large third-party objects.
- Async loading: `defineAsyncComponent` powers dynamic route modules via `src/utils/routerHelper.ts` and the DIY editor palette loader. Reuse this pattern for lazy features.
- Custom composables: 17 web hooks (`useCrudSchemas`, `useTable`, `useMessage`, `useWatermark`, etc.) plus `event/useScrollTo.ts` cover most UX needs. Extend these first before authoring new hooks.
- VueUse footprint: `useVModel(s)` appears in 32 components (~8% of Vue files) for two-way binding; `useDebounceFn` in 7 files (~2%), `useBreakpoints` in 6 (responsive public views), `useLocalStorage` in 5 (login and public caching), `useClipboard` in 4 (generator tooling), and smaller utilities (`useWindowSize`, `useEventListener`, `useWebSocket`, `useCssVar`, `useTemplateRefsList`) underpin layout and realtime features. Prefer VueUse primitives instead of bespoke utilities.
- DOM and styling helpers: `useCssVar` drives runtime theming (`useNProgress`, layout settings) while `useTemplateRefsList` coordinates dynamic tab refs in `layout/components/TagsView`. Adopt these patterns for DOM measurement and theme sync.

## UI & Styling
- Global styling lives in `src/styles/index.scss`; extend theme tokens there. Respect UnoCSS utilities and configure new ones via `uno.config.ts`.
- Icons rely on `src/plugins/svgIcon` and `@iconify` fallback. Drop custom SVGs into the icons directory to auto-register.
- Animations: reuse animate.css classes from `src/plugins/animate.css` to keep bundle size stable.
- Keep inline styles minimal; prefer SCSS variables, mixins, or UnoCSS classes.

## Testing & Quality Gates
- Tests colocate with source (`*.test.ts`, `*.spec.tsx`). Use `pnpm test`, `pnpm test:run`, `pnpm test:coverage`, or `pnpm test:ui` (interactive).
- Static analysis: `pnpm lint:eslint`, `pnpm lint:style`, `pnpm lint:format`. Combine with `pnpm ts:check` before PRs.
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
