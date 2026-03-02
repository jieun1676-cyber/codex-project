# AGENTS.md

Operational guide for autonomous coding agents in `/Users/jieun.oh/codex-project`.

## 1) Repository Layout (Verified)

- `docs/`
  - Product and requirement bundle: `docs/codex_documentation_bundle.md`
- `web/`
  - Vite + React + TypeScript MVP app
  - Core app files are under `web/src/`

Current app-relevant files:

- `web/package.json`
- `web/vite.config.ts`
- `web/eslint.config.js`
- `web/tsconfig.app.json`
- `web/src/App.tsx`
- `web/src/recommendation.ts`
- `web/src/recommendation.test.ts`

## 2) Cursor / Copilot Rules

Checked paths:

- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`

Result (current):

- No Cursor rules detected.
- No Copilot instruction file detected.

Policy:

- If any of the files above appears later, treat them as higher-priority local instructions.
- Reflect those constraints in this file in the same change.

## 3) Build, Lint, Test Commands

All project automation currently runs from `web/`.

### 3.1 Install

- `cd web && bun install`

Root alternative:

- `bun --cwd web install`

### 3.2 Run app locally

- `cd web && bun run dev`

### 3.3 Lint

- `cd web && bun run lint`

### 3.4 Test (full suite)

- `cd web && bun run test`

### 3.5 Single-test execution (important)

Single file:

- `cd web && bun run test -- src/recommendation.test.ts`

Single test case by name:

- `cd web && bun run test -- -t "ranks matching condition and texture higher"`

### 3.6 Typecheck + production build

- `cd web && bun run build`

Notes:

- Current `build` script is `tsc -b && vite build`.
- This command performs type-checking via TypeScript project references before bundling.

## 4) Tech Stack and Conventions (Observed)

### 4.1 Runtime and framework

- Bun package/runtime commands are used in this repo.
- Frontend stack is React 19 + TypeScript + Vite.
- Tests run with Vitest.

### 4.2 TypeScript rules

From `web/tsconfig.app.json`:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `moduleResolution: bundler`

Agent requirements:

- Keep type safety strict.
- Do not use `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Prefer explicit domain types (`interface`/`type`) for app logic.

### 4.3 ESLint rules

From `web/eslint.config.js`:

- Base: `@eslint/js` recommended
- TS: `typescript-eslint` recommended
- React hooks lint rules enabled
- React refresh/Vite lint rules enabled
- `dist/` is ignored

Implication:

- Follow Hooks rules strictly.
- Keep code compatible with fast refresh expectations.
- Run lint after meaningful edits.

### 4.4 Import and module style

Observed in `web/src/*.ts*`:

- ESM `import`/`export` syntax
- Named imports preferred
- Relative imports for local modules
- Type-only imports used (`import type`) where appropriate

### 4.5 Naming style

- Components: `PascalCase` (example: `App`)
- Variables/functions: `camelCase`
- Constants arrays/options: `camelCase` names with semantic labels
- Domain identifiers: short stable IDs (example: `r1`, `r2`)

### 4.6 Formatting and CSS

Observed style:

- No semicolons in TS/TSX source
- Single quotes in TS/TSX imports and strings
- Component-scoped styles in `web/src/App.css`
- Global styles in `web/src/index.css`

UI direction currently used:

- Bright, soft gradient background
- Serif heading font and sans-serif body font
- Mobile-aware responsive layout via CSS grid/flex and media query

### 4.7 Error handling and logic behavior

- Recommendation engine applies hard filters for:
  - age range match
  - allergy exclusion
  - cook-time cap
- Ranking is score-based after filtering.
- Empty result state is explicitly rendered in UI.

## 5) Testing Expectations

- For recommendation logic changes, update `web/src/recommendation.test.ts`.
- Add regression tests for bug fixes in ranking/filter behavior.
- Keep tests deterministic and independent from browser APIs.
- Prefer pure-function tests for scoring/filter units.

## 6) Agent Workflow in This Repo

- Read requirements from `docs/codex_documentation_bundle.md` first.
- Implement in `web/` unless user requests a different target.
- After edits, run:
  1) `bun run test`
  2) `bun run lint`
  3) `bun run build`
- If a verification step cannot run, report the exact blocker and impact.

## 7) Maintenance Policy for AGENTS.md

- Keep this file evidence-based, not aspirational.
- Update commands when scripts or tooling change.
- Update style guidance when lint/TS config changes.
- Mirror future Cursor/Copilot instructions here.

---

Last verified against:

- `docs/codex_documentation_bundle.md`
- `web/package.json`
- `web/eslint.config.js`
- `web/tsconfig.app.json`
- `web/vite.config.ts`
