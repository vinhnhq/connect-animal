# Retrospectives

Rolling log. Each retro is a section, newest at the top, delimited by its own title block (`> Date · Phases · Status · Snapshot`). Action items inside stay **Open** until they're pulled into the backlog or explicitly dropped — update the **Status** line when you do.

---

## Phase 3 + 4 + 5 — v1 ship

> **Date:** 2026-05-11
> **Phases covered:** 3 (UI: configure → play) · 4 (polish) · 5 (docs) · plus 4 retro items pulled forward
> **Status:** Closed for the shipped items. Remaining items from the prior retro stay Open.
> **Headcount snapshot:** 148 tests · 4,730 expects · all 14 v1 tasks shipped · 4 retro items also shipped · Lighthouse on prod build is **100 / 100 / 100 / 100** (Perf / A11y / Best Practices / SEO) · `bun lint` / `typecheck` / `test` / `e2e` / `build` all green at SHA `eae6131`.

### What went well

- **Pure-core boundary stayed honest.** Adding the `Match` event for the AI didn't leak React into `lib/`. The reducer's exhaustive `match()` caught one straggler (a types-test `match` over `Event` that needed the new variant), and TS+ts-pattern told us about it immediately.
- **Hint button as a Playwright crutch.** Finding a valid pair from the DOM is hard (random board + path-finder). Using the in-app Hint to surface a known-valid pair, then reading both `data-hinted` test-ids *before* the first click (the hint clears on Select), made the smoke test boring in the best way.
- **`document.startViewTransition` was a clean fallback** for the planned `<ViewTransition>`. Two extra lines, same effect, no experimental React dependency.
- **TDD held across UI work too.** Every component (ConfigForm, BoardView, Toolbar, GameOver, PathFlash) shipped with a red-first test. Where bun:test + happy-dom missed an assertion (the `expect.stringContaining` ↔ `toHaveAttribute` matcher choked), the fallback was a string `.toContain` — fast to diagnose.
- **Lighthouse 100s on first real run.** The Phase 4 prep (semantic HTML, focus rings, V3 contrast, metadata) translated 1:1. Only one issue surfaced — a `/favicon.ico` 404 — and fixing it with `src/app/icon.svg` brought every category to 100.

### What didn't go well / friction

- **Experimental React APIs aren't usable in stable 19.2.** `<Activity>` is a symbol marker only, `<ViewTransition>` / `addTransitionType` aren't exported. The architecture doc had committed to them. Cost: rewriting that section after the fact and shipping the stable equivalents (`hidden` attribute + `document.startViewTransition`).
- **shadcn primitives were dead weight.** Phase 0 generated four primitives (Dialog, Select, RadioGroup, Button), Phase 3 built the game UI without them, and they sat as committed-but-unimported code until R10 deleted them along with `@base-ui/react`, `lucide-react`, `class-variance-authority`, `tw-animate-css`, and `shadcn`. The lesson: don't generate primitives until something is about to consume one.
- **`Activity`-as-symbol error surfaces only at build time.** `typeof Activity === 'symbol'` is fine in Node, fine in bun test, fine in `next dev`. Production `next build` is where `Element type is invalid` fires. Tests didn't catch it.
- **Next 15 rewrites `tsconfig.json` during build.** R4 (separate build dir) tripped on this — biome flagged the reformatted file. A `pre-commit` hook would mask the fix; explicit `bun format` is fine.
- **Lighthouse needs a real headless Chrome.** `bunx lighthouse` works locally (Playwright's chromium counts) but a fresh CI container would need `--with-deps`. Worth flagging if we ever wire Lighthouse into CI.

### Resolved (from prior retro)

- **Item 1** (Spike `<Activity>` + `<ViewTransition>`) — resolved by discovery. Documented in architecture.md.
- **Item 2** (Minimal CI) — shipped at `eeb2738`. `.github/workflows/ci.yml` runs lint + typecheck + test, plus an e2e job that installs chromium.
- **Item 4** (Separate build output dir) — shipped at `7a7d046`. `NEXT_BUILD_DIR=.next-prod next build` keeps dev and prod artifacts apart.
- **Item 5** (Restyle shadcn primitives) — replaced by **R10: delete them**, shipped at `57fd8a9`. The retro's framing was wrong — restyling something nobody imports is busywork.
- **New item 9** (Run Lighthouse for real) — shipped at `eae6131`. 100/100/100/100.

### Still Open (from prior retro)

- **Item 3** Pre-commit hook for lint + typecheck. Mostly subsumed by CI now; pull in if local-vs-CI drift becomes a real problem.
- **Item 6** Real-device mobile pass — now applies to both `/preview` *and* the wired game UI. Needs a human and a phone.
- **Item 7** Harden `test-setup.ts` preload order. Untouched.
- **Item 8** Tighten cadence tests (per-decile, not just averages). Untouched.

### New Open items

- **Item 11** When React 19.x stable exposes `<Activity>` and `<ViewTransition>` + `addTransitionType`, swap back. We get explicit transition types (`config-to-play`, `tile-clear`, `game-end`) and the lint-friendly JSX form. Mostly cosmetic — current implementation works.
- **Item 12** Wire Lighthouse into CI (separate job, build → start → audit → assert score thresholds). Useful regression net for Phase 6+.

---

## Phase 0 + 1 + 2 + Design Lock

> **Date:** 2026-05-11
> **Phases covered:** 0 (scaffold) · 1 (pure game core) · 2 (computer opponent) · interim design exploration
> **Status:** Open · action items listed below are **not yet planned**. Review later and decide which (if any) to pull into a sprint.
> **Headcount snapshot:** 89 tests · 4,632 expects · 17 lib tasks shipped · 0 backlog tasks remaining for phases 0–2 · `bun lint` / `typecheck` / `test` / `build` all green at SHA `3a04b72`.

### What went well

- **TDD loop held without a single regression.** 14 lib tasks shipped through red → green → commit. No flaky tests, no skipped tests.
- **Pure-lib boundary is enforced by tooling, not discipline.** The Biome override plus the boundary test that *spawns* biome on fixture files is the kind of self-checking guardrail that survives the project growing.
- **Seeded property tests provide a fast, reproducible safety net.** 1,000 boards solvable + 100 played to completion = any future change to `findPath` / `generateBoard` / `shuffleRemaining` will fail loudly.
- **Conventional Commits + `done.md` log was friction-free.** Every task is one commit; `git log --oneline | head -20` reconstructs the build order at a glance.
- **Design exploration was unusually compact.** 6 variants → user pick → token cleanup → mobile pass → storybook → lock, all in one session. Each variant was tight (≤200 LOC) and hot reload made iteration cheap.
- **`mulberry32` paid off twice.** Deterministic boards for property tests; deterministic moves for AI integration tests. One 8-line function, two suites kept honest.

### What didn't go well / friction

- **Version pinning was guesswork at first.** TS `5.9.0` and `@types/react-dom@19.2.14` didn't exist (had to use `^5.9.3` and `^19.2.3`). Look up real versions before pinning.
- **`bun:test` + `happy-dom` + Testing Library wiring is fragile.** The "import happy-dom *before* importing testing-library" preload-order trick is non-obvious; a cosmetic refactor of `test-setup.ts` could break it. Fix lives in a comment, not a structural guarantee.
- **Biome rule taxonomy surprises.** `noRestrictedGlobals` lives under `style`, not `correctness`. `tailwindDirectives: true` for v4 isn't in basic docs. Each cost ~5–10 minutes to figure out.
- **`bun run build` while `bun run dev` is running clobbers `.next`.** Happened twice; each fix was `pkill + rm -rf .next + restart dev`. Real productivity tax.
- **One bogus test sneaked through.** The "1-turn fails when both corners blocked" case in `path.test.ts` was self-contradictory (one corner was actually empty). Caught while running, but a quieter version of the same mistake might pass for the wrong reason.

### Surprises and insights

- **`shadcn init` defaulted to `base-nova` style, not Radix.** Components ended up on `@base-ui/react`, not `@radix-ui/react-*`. Minor but worth knowing.
- **Path-finding via row/col sweep over `[-1..rows]` and `[-1..cols]` is enough.** Treating the border as "always-empty by definition" collapses the border-route case into the same code as the interior 2-turn case. No special-casing.
- **Reducer fit cleanly into nested `match`.** Outer on state, inner on event, two helpers for Configuring vs Terminal. ~140 lines, every transition typed and exhaustive.
- **Medium-difficulty AI weight `1/length²` works on first try.** Short paths dominate, long paths still surface occasionally. No tuning needed.

### Risks / debt entering Phase 3

- **React 19 features (`<Activity>`, `<ViewTransition>`, `addTransitionType`) are untested in this project.** Architecture doc relies on them; we haven't proven the APIs match expectations in `react@19.2.6`.
- **shadcn primitives still ship default styles.** Need restyling to V3 tokens before any screen ships, or the game will look schizophrenic.
- **No CI.** Lint/test/typecheck run locally; nothing blocks a broken commit from landing on `main`.
- **Mobile breakpoints are DevTools-verified only.** Tap targets, font rendering, touch behavior all need a real-device pass.
- **`useGame` hook is not built yet.** Bridging the pure reducer to React with proper `useReducer` + side-effect dispatch (timer ticks, AI moves) is on the Phase 3 critical path.
- **Cadence tests check averages only.** A regression that always returns `minMs` would still pass.
- **No game e2e yet.** Playwright is wired but only smokes the home page.

### Proposed action items (open — not yet planned)

> Pull any of these into the backlog when you decide. None are commitments yet.

1. **Spike `<Activity>` + `<ViewTransition>`** on a throwaway page before relying on them in `app/(game)/page.tsx`. ~30 min of risk reduction.
2. **Add minimal CI** — `.github/workflows/ci.yml` running `bun install` + `bun lint` + `bun typecheck` + `bun test`. ~15 lines.
3. **Pre-commit hook** (or rely on CI) for lint + typecheck. Prevents the editor/CLI formatter drift class of bugs.
4. **Separate build output dir** so `bun run build` doesn't fight `bun run dev`. Either `next build --distDir=.next-prod` or just don't build while dev is up.
5. **Restyle shadcn primitives once** (Dialog, Select, RadioGroup, Button) to V3 tokens — a single CSS or wrapper layer reused everywhere.
6. **Real-device mobile pass** of `/preview` before building the actual game UI on the same tokens. Cheaper to fix in mocks than wired UI.
7. **Harden `test-setup.ts` preload order.** Split into two files (happy-dom preload + matchers extension) or add a runtime assertion so a future refactor fails loudly.
8. **Tighten cadence tests** — add specific-value or per-decile distribution checks, not just averages.

### Decision space

When you come back to this file, the question to answer is: **which of items 1–8 should be tasks in the next sprint, and in what order?** They are not interdependent — each can be picked up or skipped on its own.
