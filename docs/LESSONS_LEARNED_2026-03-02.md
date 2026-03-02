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

## 8) Coding Agent Best Practices - First-Time User Checklist

### Prompt Quality

- **Be specific, not vague**
  - ❌ "add tests for auth.ts"
  - ✅ "Write test cases for auth.ts covering: logout edge case, session expiry, token refresh. Use patterns from __tests__/. Avoid mocks."
  - Specificity dramatically improves output quality (Source: [Cursor Best Practices](https://cursor.com/blog/agent-best-practices))

- **Use Plan Mode for complex tasks**
  - Press Shift+Tab (or equivalent) to enable planning first
  - Agent researches, asks questions, creates implementation plan
  - Edit the plan directly before approval - reverting bad code is faster than fixing in progress

- **Reference files only when certain**
  - If you know the exact file, tag it
  - If uncertain, let agent find it via grep/semantic search
  - Irrelevant files add noise and confuse the agent

- **Start fresh conversations strategically**
  - New conversation when: switching tasks, agent gets confused, completed one logical unit
  - Continue when: iterating on same feature, debugging what agent just built
  - Long conversations degrade agent focus

### Verification Loop

- **Watch while agent works**
  - Monitor diff view in real-time
  - Press Escape to interrupt and redirect if heading wrong direction

- **Make testing explicit**
  - TDD workflow: write tests → confirm fail → implement → confirm pass
  - Tell agent explicitly: "run tests and confirm they fail, do not write implementation code"
  - Tests give agents clear targets to iterate against

- **Run verification commands after changes**
  - Always execute: lint, typecheck, tests
  - Don't assume agent ran them - be explicit: "run typecheck after changes"
  - Faster agent = more important your review

- **Use agent review features**
  - Run dedicated review pass post-completion
  - Compare against main branch before merging
  - AI review catches subtle issues human eyes miss

### Git Safety

- **Never give destructive prompts without thinking**
  - "archive repo" = actual archival, not "show me how"
  - Agents execute literally - frame questions as information requests, not commands
  - When in doubt, rephrase with "how would I..." instead of "do..." (Source: [Eric Ma - Safe Autonomous Work](https://ericmjl.github.io/blog/2025/11/8/safe-ways-to-let-your-coding-agent-work-autonomously/))

- **Use feature branches for all agent work**
  - Never work directly on main/master
  - Agent mistakes stay isolated and reversible

- **Commit incrementally**
  - Commit tests first, implementation second
  - Small, focused commits make rollback trivial
  - Clear commits = clear history

- **Use worktree for parallel agents**
  - When running multiple agents, use git worktrees
  - Each agent gets isolated files - no stepping on each other

- **Review diffs before any commit**
  - AI code can look right while being subtly wrong
  - Read every line change, don't just accept
  - The faster the agent works, the more critical your review

### Context Management

- **Use @Past Chats for continuity**
  - When starting new conversation but needing context
  - Agent selectively reads only needed history

- **Create project rules early**
  - Add .cursor/rules/ or equivalent for project-specific commands
  - Commands to run: build, typecheck, test
  - Code style patterns and canonical examples
  - Only add when you see repeated mistakes - don't over-optimize upfront

### Daily Workflow Pattern

**Morning:**
- Quick task → direct agent prompt
- Complex task → Plan Mode first

**During:**
- Watch diff, interrupt if needed
- Run verification: typecheck → lint → tests

**End of session:**
- Review all changes
- Commit in small increments
- Push to remote (never directly to main)
