# Retrospective — Phase 0 + 1 + 2 + Design Lock

> **Date:** 2026-05-11
> **Phases covered:** 0 (scaffold) · 1 (pure game core) · 2 (computer opponent) · interim design exploration
> **Status:** Open · action items listed below are **not yet planned**. Review later and decide which (if any) to pull into a sprint.
> **Headcount snapshot:** 89 tests · 4,632 expects · 17 lib tasks shipped · 0 backlog tasks remaining for phases 0–2 · `bun lint` / `typecheck` / `test` / `build` all green at SHA `3a04b72`.

---

## What went well

- **TDD loop held without a single regression.** 14 lib tasks shipped through red → green → commit. No flaky tests, no skipped tests.
- **Pure-lib boundary is enforced by tooling, not discipline.** The Biome override plus the boundary test that *spawns* biome on fixture files is the kind of self-checking guardrail that survives the project growing.
- **Seeded property tests provide a fast, reproducible safety net.** 1,000 boards solvable + 100 played to completion = any future change to `findPath` / `generateBoard` / `shuffleRemaining` will fail loudly.
- **Conventional Commits + `done.md` log was friction-free.** Every task is one commit; `git log --oneline | head -20` reconstructs the build order at a glance.
- **Design exploration was unusually compact.** 6 variants → user pick → token cleanup → mobile pass → storybook → lock, all in one session. Each variant was tight (≤200 LOC) and hot reload made iteration cheap.
- **`mulberry32` paid off twice.** Deterministic boards for property tests; deterministic moves for AI integration tests. One 8-line function, two suites kept honest.

## What didn't go well / friction

- **Version pinning was guesswork at first.** TS `5.9.0` and `@types/react-dom@19.2.14` didn't exist (had to use `^5.9.3` and `^19.2.3`). Look up real versions before pinning.
- **`bun:test` + `happy-dom` + Testing Library wiring is fragile.** The "import happy-dom *before* importing testing-library" preload-order trick is non-obvious; a cosmetic refactor of `test-setup.ts` could break it. Fix lives in a comment, not a structural guarantee.
- **Biome rule taxonomy surprises.** `noRestrictedGlobals` lives under `style`, not `correctness`. `tailwindDirectives: true` for v4 isn't in basic docs. Each cost ~5–10 minutes to figure out.
- **`bun run build` while `bun run dev` is running clobbers `.next`.** Happened twice; each fix was `pkill + rm -rf .next + restart dev`. Real productivity tax.
- **One bogus test sneaked through.** The "1-turn fails when both corners blocked" case in `path.test.ts` was self-contradictory (one corner was actually empty). Caught while running, but a quieter version of the same mistake might pass for the wrong reason.

## Surprises and insights

- **`shadcn init` defaulted to `base-nova` style, not Radix.** Components ended up on `@base-ui/react`, not `@radix-ui/react-*`. Minor but worth knowing.
- **Path-finding via row/col sweep over `[-1..rows]` and `[-1..cols]` is enough.** Treating the border as "always-empty by definition" collapses the border-route case into the same code as the interior 2-turn case. No special-casing.
- **Reducer fit cleanly into nested `match`.** Outer on state, inner on event, two helpers for Configuring vs Terminal. ~140 lines, every transition typed and exhaustive.
- **Medium-difficulty AI weight `1/length²` works on first try.** Short paths dominate, long paths still surface occasionally. No tuning needed.

## Risks / debt entering Phase 3

- **React 19 features (`<Activity>`, `<ViewTransition>`, `addTransitionType`) are untested in this project.** Architecture doc relies on them; we haven't proven the APIs match expectations in `react@19.2.6`.
- **shadcn primitives still ship default styles.** Need restyling to V3 tokens before any screen ships, or the game will look schizophrenic.
- **No CI.** Lint/test/typecheck run locally; nothing blocks a broken commit from landing on `main`.
- **Mobile breakpoints are DevTools-verified only.** Tap targets, font rendering, touch behavior all need a real-device pass.
- **`useGame` hook is not built yet.** Bridging the pure reducer to React with proper `useReducer` + side-effect dispatch (timer ticks, AI moves) is on the Phase 3 critical path.
- **Cadence tests check averages only.** A regression that always returns `minMs` would still pass.
- **No game e2e yet.** Playwright is wired but only smokes the home page.

## Proposed action items (open — not yet planned)

> Pull any of these into the backlog when you decide. None are commitments yet.

1. **Spike `<Activity>` + `<ViewTransition>`** on a throwaway page before relying on them in `app/(game)/page.tsx`. ~30 min of risk reduction.
2. **Add minimal CI** — `.github/workflows/ci.yml` running `bun install` + `bun lint` + `bun typecheck` + `bun test`. ~15 lines.
3. **Pre-commit hook** (or rely on CI) for lint + typecheck. Prevents the editor/CLI formatter drift class of bugs.
4. **Separate build output dir** so `bun run build` doesn't fight `bun run dev`. Either `next build --distDir=.next-prod` or just don't build while dev is up.
5. **Restyle shadcn primitives once** (Dialog, Select, RadioGroup, Button) to V3 tokens — a single CSS or wrapper layer reused everywhere.
6. **Real-device mobile pass** of `/preview` before building the actual game UI on the same tokens. Cheaper to fix in mocks than wired UI.
7. **Harden `test-setup.ts` preload order.** Split into two files (happy-dom preload + matchers extension) or add a runtime assertion so a future refactor fails loudly.
8. **Tighten cadence tests** — add specific-value or per-decile distribution checks, not just averages.

---

## Decision space

When you come back to this file, the question to answer is: **which of items 1–8 should be tasks in the next sprint, and in what order?** They are not interdependent — each can be picked up or skipped on its own.
