# Backlog

Tasks are ordered. Each task is **red → green → refactor → commit**. A task is "done" only after `bun test`, `bun lint`, and `bun typecheck` pass and the line is moved to [`done.md`](done.md).

## Phase 0 — Scaffold

- [x] **0.1** Initialize Next.js 15 + TS + Tailwind v4 + Bun with `src/`. Verify `bun dev` serves the default page.
- [x] **0.2** Add Biome with strict rules (`noExplicitAny`, `useExhaustiveDependencies`, import sorting). `bun lint` passes on a fresh repo.
- [x] **0.3** Add `bun:test` config + `happy-dom` + `@testing-library/react` + a smoke test that imports a component and asserts it renders.
- [x] **0.4** Install shadcn/ui, generate `Button`, `Select`, `RadioGroup`, `Dialog`. Render them on a throwaway page.
- [x] **0.5** Add Playwright with one trivial test. Wire `bun e2e` script.
- [x] **0.6** Configure Biome `noRestrictedImports` to forbid `react`, `next/*`, and DOM globals from `src/lib/**`. Add a failing-then-passing test of the rule.
- [x] **0.7** Install `ts-pattern` and `purify-ts`. Add tsconfig path alias `@/*` → `src/*`.

## Phase 1 — Pure game core (no UI)

- [x] **1.1** `lib/game/types.ts` — `Tile`, `Board`, `GameState`, `Event` discriminated unions.
- [x] **1.2** `lib/game/path.ts` — TDD `findPath(from, to, board): Maybe<Path>`. Cases: same row, same column, one-turn, two-turn, blocked, border-route, identical points (Nothing).
- [x] **1.3** `lib/game/board.ts` — TDD `generateBoard(config, rng): Either<BoardError, Board>`. Property: every generated board has at least one valid pair.
- [x] **1.4** `lib/game/board.ts` — TDD `shuffleRemaining(board, rng): Board`. Property: result has at least one valid pair.
- [x] **1.5** `lib/game/reducer.ts` — TDD reducer via `ts-pattern.match`. Cover every `(state, event)` pair, including no-ops.
- [x] **1.6** `lib/game/hint.ts` — `findAnyValidPair(board): Maybe<[Tile, Tile]>`. Reuses `findPath`.
- [x] **1.7** Property tests with seeded RNG: 1000 random boards, all solvable from generation, none deadlock without shuffle being legal.

## Phase 2 — Computer opponent

- [x] **2.1** `lib/ai/move.ts` — TDD `pickMove(board, difficulty, rng): Maybe<Move>` for Easy / Medium / Hard.
- [ ] **2.2** `lib/ai/cadence.ts` — pure `nextDelayMs(difficulty, rng): number`.
- [ ] **2.3** Integration test: AI vs. board → eventually clears (bounded number of moves).

## Phase 3 — UI: configure → play

- [ ] **3.1** `app/(game)/page.tsx` — config screen with shadcn controls. Defaults from `localStorage`, persists on change.
- [ ] **3.2** `app/(game)/_components/board.tsx` — render board, tile selection, keyboard nav, focus ring.
- [ ] **3.3** Wire `useGame` hook bridging reducer + React state. Component test: dispatching `Select` twice on a valid pair clears them.
- [ ] **3.4** Path-flash overlay animation on successful match. Respect `prefers-reduced-motion`.
- [ ] **3.5** `<ViewTransition>` config↔play. `<Activity>` preserves config state.
- [ ] **3.6** AI loop: `useEffect` schedules `pickMove` and dispatches; cancel on unmount.

## Phase 4 — Polish

- [ ] **4.1** Hint button + Shuffle button (enabled state from reducer).
- [ ] **4.2** Win/Lose dialog with time, "Play again", "Change settings".
- [ ] **4.3** Personal-best storage per board size (localStorage adapter is a pure function + a thin wrapper).
- [ ] **4.4** Lighthouse pass (Performance ≥ 90, Accessibility ≥ 95).
- [ ] **4.5** Playwright smoke: configure Medium / Easy AI → make three valid matches → quit.

## Phase 5 — Docs

- [ ] **5.1** README "Quick start" verified end-to-end on a fresh clone.
- [ ] **5.2** Inline JSDoc on every exported symbol of `lib/game` and `lib/ai`.
- [ ] **5.3** Update `__project__/docs/architecture.md` with anything that drifted during build.
