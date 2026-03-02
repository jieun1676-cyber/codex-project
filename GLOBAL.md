# GLOBAL.md

Broad collaboration guide for working with coding agents in this repository.

## 1) Collaboration Contract

- User defines goals and constraints.
- Agent executes, verifies, and reports concrete outputs.
- Every substantial change should end with test/lint/build status.

## 2) Preferred Request Template

Use this compact template when asking for work:

- Objective: single sentence outcome
- Scope: target folder or files
- Constraints: what to avoid
- Verification: exact commands or success checks

## 3) Execution Modes

- Build mode: direct implementation and verification.
- Analyze mode: gather evidence first, then implement.
- Search mode: broad pattern hunt, then synthesize into action.

## 4) Repository Defaults

- App location: `web/`
- Runtime/package manager: Bun
- Test framework: Vitest
- Build command: `bun run build`

## 5) Verify-First Checklist

Before finalizing any feature:

1. `bun run test`
2. `bun run lint`
3. `bun run build`
4. Confirm UI behavior manually in `bun run dev`

## 6) Data and API Work Rules

- Prefer deterministic transforms over ad-hoc runtime mutation.
- Keep source attribution in the dataset (`source`, `origin`).
- Handle missing API key with explicit fallback path.
- Never fabricate external data.

## 7) Security and Secret Handling

- Use env vars for secrets (`DATA_GO_KR_API_KEY`, `GITHUB_TOKEN`).
- Rotate tokens if ever exposed in conversation.
- Avoid committing secrets or generated credentials.

## 8) Git Best Practices for This Repo

- Use focused commit messages with clear intent.
- Verify before commit when code changed.
- Push from feature branch when change is non-trivial.
- Prefer PR-based merge flow for reviewable history.

## 9) Agent Reliability Hints

- If task is ambiguous, include one concrete example of expected output.
- If UI change requested, specify placement and default state.
- If deployment requested, specify platform and target repo/branch.

## 10) Daily Starter Commands

```bash
cd /Users/jieun.oh/codex-project/web
bun run dev
```

For refresh + verify:

```bash
export DATA_GO_KR_API_KEY="..."
export KR_RECIPE_MAX_ROWS=5000
bun run generate:recipes
bun run test
bun run lint
bun run build
```
