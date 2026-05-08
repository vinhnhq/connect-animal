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

Events: `StartGame | Select | Hint | Shuffle | Tick | Restart`.

The reducer in `src/lib/game/reducer.ts` matches `(state, event)` exhaustively via `ts-pattern`. Invalid combinations are unreachable at the type level — adding a new event forces every state to handle (or explicitly ignore) it.

## Functional error handling

`purify-ts` types replace exceptions and nulls in `lib/`:

- `findPath(from, to, board): Maybe<Path>` — `Nothing` when no ≤2-turn path exists.
- `placeMatch(state, a, b): Either<MatchError, GameState>` — `Left` on invalid input.
- `generateBoard(config, rng): Either<BoardError, Board>` — `Left` if config is impossible.

UI code unwraps with `.caseOf({ Just, Nothing })` or `.caseOf({ Left, Right })` — never `.unsafeCoerce()`.

## React 19 specifics

- **`<Activity mode="hidden">`** wraps the config screen during gameplay so re-opening it preserves form state and avoids re-mount cost.
- **`<ViewTransition>`** marks the game-screen region. We use `addTransitionType('config-to-play' | 'tile-clear' | 'game-end')` to fork CSS pseudo-element rules.
- The path-flash on a successful match is a regular CSS transition on a transient overlay element, not a view transition (the matched tiles disappear, so no shared-element animation applies).

## Accessibility

- Full keyboard play: arrow keys move focus, **Space** / **Enter** selects.
- Each tile has `aria-label` with the animal name and grid coords.
- `prefers-reduced-motion: reduce` shortens transitions to ~50 ms but doesn't remove the path flash (it conveys correctness, not just polish).
- Color is never the sole signal; selected tiles also get a thick outline and a focus ring.

## Determinism and testability

- All randomness flows through an injected `rng: () => number`. Tests pass a seeded PRNG; production passes `Math.random`.
- All time flows through an injected `now: () => number` or explicit `Tick` events with a numeric timestamp. The `lib/` never reads the clock itself.
- This means every test can pin both random and time inputs and assert exact outputs.
