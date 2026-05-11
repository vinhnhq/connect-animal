# Architecture

## Layering

```
┌──────────────────────────────────────────────────────┐
│  src/app/                                            │  UI layer
│    (game)/page.tsx, _components/*                    │  React 19, shadcn
└────────────────┬─────────────────────────────────────┘
                 │ uses
┌────────────────▼─────────────────────────────────────┐
│  src/hooks/                                          │  React glue
│    useGame, useTimer, useViewTransition              │
└────────────────┬─────────────────────────────────────┘
                 │ dispatches events to
┌────────────────▼─────────────────────────────────────┐
│  src/lib/game/                                       │  Pure logic
│    reducer.ts (ts-pattern), board.ts, path.ts, …     │  No React, no DOM
└────────────────┬─────────────────────────────────────┘
                 │ consulted by
┌────────────────▼─────────────────────────────────────┐
│  src/lib/ai/                                         │  Pure computer player
│    move.ts (Maybe<Move>), cadence.ts                 │
└──────────────────────────────────────────────────────┘
```

## Why these layers

The pure boundary at `src/lib/game/` is a hard rule, not a guideline. v2 will need the same logic to run on a server (online same-board race needs authoritative state). Anything that imports React, browser APIs, or `Date.now` directly cannot lift to that environment without a rewrite. We pay the price up-front.

## State machine

States: `Configuring | Playing | Won | Lost`.

Events: `StartGame | Select | Match | Hint | Shuffle | Tick | Restart`.

The reducer in `src/lib/game/reducer.ts` matches `(state, event)` exhaustively via `ts-pattern`. Invalid combinations are unreachable at the type level — adding a new event forces every state to handle (or explicitly ignore) it.

**`Match` vs `Select`.** The human flow uses `Select` (one-tile-at-a-time, with the reducer's `selected` slot tracking the pending first click). The AI uses `Match` — a precomputed pair-clear that doesn't touch `selected` and so doesn't clobber the human's in-flight selection. Both events run through the same path validation and score-update logic.

## Functional error handling

`purify-ts` types replace exceptions and nulls in `lib/`:

- `findPath(from, to, board): Maybe<Path>` — `Nothing` when no ≤2-turn path exists.
- `placeMatch(state, a, b): Either<MatchError, GameState>` — `Left` on invalid input.
- `generateBoard(config, rng): Either<BoardError, Board>` — `Left` if config is impossible.

UI code unwraps with `.caseOf({ Just, Nothing })` or `.caseOf({ Left, Right })` — never `.unsafeCoerce()`.

## React 19 specifics

The original plan was `<Activity mode="hidden">` plus `<ViewTransition>` + `addTransitionType`. Both are experimental in React 19.2 stable — `Activity` is exported as a symbol marker (not a usable JSX element), and `ViewTransition` / `addTransitionType` are not exported at all. v1 ships with the stable-React equivalents and will swap back when those APIs land:

- **Config-screen state preservation** uses the standard React behavior: the `<ConfigForm>` stays mounted across screens and its `useState` survives. The wrapper carries the `hidden` attribute when the user is in Playing/Won/Lost, which mirrors what `<Activity mode="hidden">` would do (DOM-present, inert, state preserved).
- **Screen-swap animation** opts into the browser's CSS View Transitions API directly via `document.startViewTransition(() => startTransition(fn))`. Equivalent to the planned `<ViewTransition>` wrapper for our needs — a smooth crossfade between config and play — without depending on experimental React exports. Falls back to a plain `startTransition` when `document.startViewTransition` is unavailable.
- **Path-flash on a successful match** is a regular CSS keyframe (`path-flash-fade` in `globals.css`) on a transient SVG overlay. The matched tiles disappear so no shared-element animation applies; the overlay draws the connecting polyline above the (now-empty) cells.
- **`prefers-reduced-motion: reduce`** shortens the path-flash from ~320 ms to ~50 ms but still plays it — the flash conveys correctness, not just polish.

## Accessibility

- Full keyboard play: arrow keys move focus, **Space** / **Enter** selects.
- Each tile has `aria-label` with the animal name and grid coords.
- `prefers-reduced-motion: reduce` shortens transitions to ~50 ms but doesn't remove the path flash (it conveys correctness, not just polish).
- Color is never the sole signal; selected tiles also get a thick outline and a focus ring.

## Design system

V3 brutalist (dialed-down) is the locked visual language for both the game and the future blog. Full token reference and component stories live at **`/preview`** ([`src/app/preview/page.tsx`](../../src/app/preview/page.tsx)). Short version in [`design.md`](design.md).

The page exists for visual reference only — it imports no game logic and is not wired into routing for end-users. Phase 3 UI work consumes the tokens from there.

## Determinism and testability

- All randomness flows through an injected `rng: () => number`. Tests pass a seeded PRNG; production passes `Math.random`.
- All time flows through an injected `now: () => number` or explicit `Tick` events with a numeric timestamp. The `lib/` never reads the clock itself.
- This means every test can pin both random and time inputs and assert exact outputs.

## Storage adapter

Personal-best times live in `src/lib/personal-best/`. The module exports a pure pair (`readPersonalBest(storage, size)`, `writePersonalBest(storage, size, ms)`) over an injected `StorageLike` interface — tests pass an in-memory fake. The React wrapper `usePersonalBests` (in `src/hooks/`) plugs `window.localStorage` in. v1 only uses this for PB-per-board-size; v2 can add user accounts and a server adapter without touching the pure functions.

## Hooks layer

`src/hooks/` is the only place React APIs reach the game logic. It contains:

- `useGame` — `useReducer` over the pure reducer, returning the state and typed dispatchers (`start`, `select`, `match`, `hint`, `shuffle`, `tick`, `restart`).
- `useAiOpponent` — schedules `pickMove` via `setTimeout(nextDelayMs)` and dispatches a `Match` event when a move exists. Re-schedules on board identity change so the cadence stays steady through unrelated UI events.
- `useReducedMotion` — single `matchMedia` listener for `prefers-reduced-motion`.
- `usePersonalBests` — wraps the pure PB adapter.
