# Lessons Learned - 2026-03-02

This note captures what worked today and how to work faster tomorrow with an AI coding agent.

## 1) What Went Well Today

- You gave clear goal-oriented requests (feature + outcome), which helped implementation speed.
- You asked verification-focused questions (count check, behavior check), which reduced hidden bugs.
- You moved from local development to deployment in one session, which is a strong workflow pattern.

## 2) Friction We Hit

- Local environment blockers (missing `git`, missing CLI tools) slowed push/deploy work.
- Secrets were shared in chat text instead of temporary env vars, which is a security risk.
- Large generated dataset increased bundle size and made build warnings more visible.

## 3) Better Prompt Pattern For Tomorrow

Use this 4-line format for implementation requests:

1. Goal: what user behavior should change
2. Scope: files or area (`web/src`, `scripts`, deploy)
3. Constraints: no AI generation, no design change, keep tests green, etc.
4. Done definition: what to verify (e.g., test/lint/build + screenshot or count)

Example:

"Goal: add image rendering from source API only. Scope: generator + list/detail UI. Constraints: no AI images, keep layout stable. Done: test/lint/build pass and confirm step image appears in expanded detail."

## 4) Fast Daily Workflow (Recommended)

- Start:
  - `cd /Users/jieun.oh/codex-project/web`
  - `bun run dev`
- Data refresh (if needed):
  - `export DATA_GO_KR_API_KEY="..."`
  - `export KR_RECIPE_MAX_ROWS=5000`
  - `bun run generate:recipes`
- Verify before push:
  - `bun run test`
  - `bun run lint`
  - `bun run build`

## 5) Security Rules You Should Keep

- Never leave PAT/API keys in chat history permanently.
- Prefer env vars (`export KEY=...`) and rotate exposed tokens immediately.
- For GitHub PAT, minimum permissions only (least privilege).

## 6) How To Get Better Output From Me

- Ask for "plan + execute + verify" in one message.
- If UI task: specify interaction flow and where detail should appear.
- If data task: specify target source, expected volume, and fallback behavior.
- If deploy task: specify target platform and whether branch/PR policy matters.

## 7) Suggested Next Improvements

- Split large `externalRecipes` payload by chunk or lazy-load to reduce bundle size.
- Add small runtime telemetry (count, source, fetch timestamp) in the admin/debug area.
- Add a single smoke e2e test for favorites persistence and inline detail expansion.
