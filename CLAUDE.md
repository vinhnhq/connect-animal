# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A web port of the Pikachu / Onet Connect animal-matching game. Match pairs of tiles whose connecting path has at most two turns. v1 is solo vs. a computer opponent. v2 will add online same-board racing.

Read these before making changes:

- [`__project__/docs/game-rules.md`](__project__/docs/game-rules.md) — exact rules, board sizes, scoring
- [`__project__/docs/architecture.md`](__project__/docs/architecture.md) — layering, state machine, what lives where
- [`__project__/docs/design.md`](__project__/docs/design.md) — locked visual system (V3 tokens), live storybook at `/preview`
- [`__project__/specs/v1-solo-vs-computer.md`](__project__/specs/v1-solo-vs-computer.md) — current acceptance criteria
- [`__project__/tasks/backlog.md`](__project__/tasks/backlog.md) — ordered TDD task list

## Stack

Next.js 15 (App Router, `src/` layout) · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Bun (PM + runtime + test runner) · Biome (lint + format) · ts-pattern · purify-ts.

## Commands

```bash
bun install
bun dev              # next dev
bun build            # next build
bun start            # next start (production)
bun test             # all tests (bun:test)
bun test path/to     # filter by path
bun test --watch     # TDD loop
bun lint             # biome check .
bun format           # biome check --write .
bun typecheck        # tsc --noEmit
bun e2e              # playwright (smoke only)
```

The repo is currently a docs-only scaffold; these commands describe the planned interface and will work once the Next app is created (task `0.1` in [`__project__/tasks/backlog.md`](__project__/tasks/backlog.md)).

## Folder layout

```
src/
  app/                       # Next App Router routes + UI
    (game)/                  # game-related routes share this segment
      page.tsx               # config screen ↔ game screen via <Activity>
      _components/           # game-specific UI (private to this segment)
  lib/
    game/                    # pure game logic — no React, no DOM, no fetch, no Date.now
      board.ts               # generation, pair placement, shuffle
      path.ts                # findPath: returns Maybe<Path>
      reducer.ts             # state machine via ts-pattern.match
      hint.ts                # findAnyValidPair
      types.ts
      __tests__/             # bun:test, fast, no DOM
    ai/                      # computer opponent — pure
      move.ts                # pickMove: Maybe<Move>
      cadence.ts
    ui/                      # shadcn primitives (auto-generated)
  hooks/                     # React glue
__project__/                 # docs, specs, tasks (never imported)
e2e/                         # Playwright smoke tests
```

## Architectural rules

These are non-negotiable; they keep the game logic testable and portable to the v2 server runtime.

1. **Pure boundary at `src/lib/game/` and `src/lib/ai/`.** No `react`, `next/*`, DOM globals, `fetch`, or `Date.now()` imports. Time and randomness enter as parameters (`now: number`, `rng: () => number`). Enforced by Biome `noRestrictedImports`.
2. **Functional error types, not exceptions.** Anything that can fail returns `Either<Err, Ok>` from purify-ts. Anything that can be absent returns `Maybe<T>`. No `throw` in `lib/`.
3. **State transitions through `ts-pattern`.** The reducer matches on `(state, event)` exhaustively. Adding a new state or event without handling it fails the type check.
4. **No `any`, no `as` casts** outside one isolated adapter helper for purify-ts ↔ external libraries.
5. **TDD.** Every change in `lib/` starts with a failing test. Component tests use `bun:test` + `happy-dom` + `@testing-library/react`. Playwright covers one happy-path smoke test per shipped mode.

## Game state machine

```
Configuring
  ──[StartGame(config)]──▶ Playing

Playing
  ──[Select(tile)]──────▶ Playing            (one tile selected)
  ──[Select(tile)]──────▶ Playing | Won      (pair valid → clear; board empty → Won)
  ──[Hint]──────────────▶ Playing            (highlights a valid pair if any)
  ──[Shuffle]───────────▶ Playing            (only when no moves remain)
  ──[Tick]──────────────▶ Playing            (advance timer)

Won | Lost
  ──[Restart]───────────▶ Configuring
```

Implemented as `match([state, event]).with(...).exhaustive()` in `src/lib/game/reducer.ts`.

## React 19 features in use

- **`<Activity mode="hidden">`** wraps the configuration screen during gameplay so re-opening it preserves form state without re-mounting.
- **`<ViewTransition>`** + `addTransitionType('config-to-play' | 'tile-clear' | 'game-end')` animates screen and state changes. See the `vercel-react-view-transitions` skill for patterns.
- **`prefers-reduced-motion: reduce`** is respected — animations shorten to ~50 ms but the path-flash on a successful match is preserved (it conveys correctness, not just polish).

## Computer opponent

Lives in `src/lib/ai/`. Pure — takes a board and returns `Maybe<Move>`. Three difficulties:

- **Easy** — picks a random valid pair, ignores hints.
- **Medium** — prefers shorter paths, occasional misses.
- **Hard** — picks the optimal pair (same path-finder used by the hint button).

Move cadence is a separate pure function (`nextDelayMs(difficulty, rng)`) and the React layer schedules it. The AI module itself is synchronous.

## Conventions

- File names: **kebab-case for everything**, including components — `board.tsx`, `tile.tsx`, `use-game.ts`, `find-path.ts`. Component identifiers exported from those files stay PascalCase (`export function Board() {}`). Unix-style filenames; no Windows-style PascalCase or spaces.
- Tests live next to source in `__tests__/` folders.
- Imports: absolute via `@/` (configured in `tsconfig.json`); no deep relative paths.
- shadcn components are committed under `src/lib/ui/` — if one needs customizing, edit it in place; don't wrap.
- Commits: small, one task per commit, Conventional Commits style (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## When you finish a task

1. Run `bun test`, `bun lint`, `bun typecheck` — all green before moving on.
2. Move the line from [`__project__/tasks/backlog.md`](__project__/tasks/backlog.md) to [`__project__/tasks/done.md`](__project__/tasks/done.md) with the date and commit SHA.
3. Commit. New commit, never amend.

## Pre-existing scaffold notes

The Claude Code skills configuration (`.claude/`, `.agents/skills/`, `skills-lock.json`) is unrelated to the app build. Don't touch it unless adding/removing skills. Two plugins are enabled — `frontend-design` and `agent-skills` — and the most relevant skills for this project are `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`, `web-design-guidelines`, `web-animation-design`, `accessibility`, `core-web-vitals`, `performance`, `seo`, `web-quality-audit`, `best-practices`, and `deploy-to-vercel`.
