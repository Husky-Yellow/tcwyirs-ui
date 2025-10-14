# Repository Guidelines

## Project Structure & Module Organization
Do most work in `src/`, which houses components, pages, hooks, services, and styling helpers in a feature-first layout. Colocate related stories or specs with their feature, keep shared assets in `src/assets/`, and place static public files in `public/`. Integration suites mirror `src/` inside `tests/`, shared declarations live in `types/`, design primitives sit in `ui/`, and `build/` contains generated output. Touch root configs (`package.json`, `tsconfig.json`, lint rules) only for cross-cutting changes.

## Build, Test, and Development Commands
Run `npm run dev` for the Vite dev server with hot updates. Use `npm run build` to emit production assets into `dist/`, then `npm run preview` for a local smoke test. Execute `npm test` for the Vitest suite (add `--watch` when iterating) and `npm run lint` plus `npm run format` before committing.

## Coding Style & Naming Conventions
Let Prettier drive formatting: 2-space indents, trailing commas where supported, and single quotes in TypeScript. Use `PascalCase` for components and classes, `camelCase` for variables and functions, and `SCREAMING_SNAKE_CASE` for shared constants. Author source files as `kebab-case.ts[x]`, lean on existing utilities and UnoCSS tokens, and prefer the path aliases defined in `tsconfig.json` over deep relative imports.

## Testing Guidelines
Place Vitest specs beside the code they protect using `*.test.ts` or `*.spec.tsx`. Exercise critical logic, regression cases, and visible UI behavior; add heavier integration tooling only when warranted. Run `npm test` before every PR and note any manual QA steps or known coverage gaps in the description.

## Commit & Pull Request Guidelines
Adopt Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`, etc.) and keep subjects imperative (e.g., `feat(auth): add refresh token flow`). Bundle focused commits and avoid stray formatting. PRs should link issues, outline impact, list manual test steps, and attach UI captures when visuals change.

## Security & Configuration Tips
Keep credentials out of git; load them through `.env`, `.env.local`, or environment-specific files and document required keys in PRs. Vet new dependencies for necessity and license compatibility, and notify reviewers early when Vite, UnoCSS, or lint configs need updates.
