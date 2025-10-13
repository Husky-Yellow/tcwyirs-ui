# Repository Guidelines
## Project Structure & Module Organization
- `src/` – application source (components, pages, hooks/utils, services, styles).
- `src/assets/` – static assets (images, fonts, icons).
- `public/` – static files served as-is (e.g., `index.html`).
- `tests/` – unit/integration tests; mirrors `src/` where possible.
- Root config – `package.json`, `tsconfig.json`/`jsconfig.json`, lint/format configs.
## Build, Test, and Development Commands
- `npm run dev` – start local dev server with HMR.
- `npm run build` – production build to `dist/`.
- `npm run preview` – serve the built output locally.
- `npm test` – run unit tests (watch in CI off).
- `npm run lint` / `npm run format` – check/fix code style.
## Coding Style & Naming Conventions
- Indentation: 2 spaces; line width per formatter.
- Use ESLint + Prettier; run before commits: `npm run lint && npm run format`.
- Naming: `PascalCase` for components/classes, `camelCase` for vars/functions, `SCREAMING_SNAKE_CASE` for constants.
- Filenames: `kebab-case.ts[x]/js[x]/vue`; component files live in `src/components/`.
- Keep modules small; co-locate tests and styles with feature code when helpful.
## Testing Guidelines
- Framework: Jest or Vitest (see `package.json` scripts).
- Test files: `*.test.ts[x]` or `*.spec.ts[x]` next to source or under `tests/` mirroring `src/`.
- Aim for practical coverage on core logic and critical UI flows.
- Run locally with `npm test`; add focused tests for bug fixes.
## Commit & Pull Request Guidelines
- Prefer Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `build:`.
- Keep messages imperative and scoped: `feat(auth): add refresh token flow`.
- PRs: include context, linked issues, test notes, and screenshots for UI changes.
- Keep diffs minimal; avoid unrelated reformatting.
## Security & Configuration
- Do not commit secrets. Use `.env` (see `.env.example` if present); document required vars in PRs.
- Review third-party libs for necessity; prefer built-ins/utilities already in the repo.
## Agent Notes
- Follow these rules repo-wide. Match existing patterns before introducing new ones.
- Touch only relevant files; preserve structure and configs. If unsure, open a small PR for discussion.
