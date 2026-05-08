# connect-animal

A web reimplementation of the **Pikachu / Onet Connect** tile-matching game. Match pairs of identical animal tiles where the path between them can be drawn with at most two turns. Clear the board as fast as you can — solo, against the computer, and (later) head-to-head online.

## Status

**v1 in progress** — solo vs. computer. Spec at [`__project__/specs/v1-solo-vs-computer.md`](__project__/specs/v1-solo-vs-computer.md).

v2 (online same-board race) is scoped but not built. See [`__project__/specs/v2-online-same-board.md`](__project__/specs/v2-online-same-board.md).

## Stack

- [Next.js 15](https://nextjs.org/) — App Router, `src/` layout
- [React 19](https://react.dev/) — `<Activity>` and View Transitions for screen and state animations
- [TypeScript](https://www.typescriptlang.org/) — strict
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Bun](https://bun.sh/) — package manager, runtime, test runner
- [Biome](https://biomejs.dev/) — lint and format (no ESLint, no Prettier)
- [ts-pattern](https://github.com/gvergnaud/ts-pattern) — exhaustive pattern matching for game state
- [purify-ts](https://gigobyte.github.io/purify/) — `Maybe` and `Either` for path-finding and partial functions

## Quick start

> The Next app is not scaffolded yet — these commands document the planned interface and will work after task `0.1` in [`__project__/tasks/backlog.md`](__project__/tasks/backlog.md).

```bash
bun install
bun dev          # start Next.js dev server at http://localhost:3000
bun test         # run all tests
bun test --watch # TDD loop
bun lint         # Biome check
bun format       # Biome write
bun typecheck    # tsc --noEmit
bun e2e          # Playwright smoke tests
```

## How to play

Full rules in [`__project__/docs/game-rules.md`](__project__/docs/game-rules.md). Short version:

1. Click two identical animal tiles.
2. If the path between them can be drawn with **at most two turns** (three line segments) and crosses only empty cells (or the border outside the grid), the pair clears.
3. Clear the whole board to win. Your score is the time it took.

## Project layout

See [`CLAUDE.md`](CLAUDE.md) for full architecture and conventions. The short version: pure game logic in `src/lib/game/`, UI in `src/app/`, no React imports allowed in game logic so the same code can run on the v2 server.

## Documentation index

- [`__project__/docs/game-rules.md`](__project__/docs/game-rules.md) — exact rules, board sizes, scoring
- [`__project__/docs/architecture.md`](__project__/docs/architecture.md) — layering, state machine, React 19 specifics
- [`__project__/docs/decisions/`](__project__/docs/decisions/) — short ADRs
- [`__project__/specs/`](__project__/specs/) — feature specs with acceptance criteria
- [`__project__/tasks/backlog.md`](__project__/tasks/backlog.md) — TDD-ordered task list

## License

Unspecified.
