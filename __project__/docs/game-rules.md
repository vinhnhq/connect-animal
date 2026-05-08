# Game rules — connect-animal

Reimplementation of the classic Pikachu / Onet Connect mechanic.

## Objective

Clear the board by matching all pairs of identical animal tiles. Your score is the time taken from the first move to the last clear.

## Board

- Tiles are placed in a rectangular grid surrounded by a one-cell empty border (paths can route through this border).
- Each tile has exactly one matching partner on the board.
- Distinct animals × 2 = total tiles.
- The board generator guarantees the initial state is solvable — at least one valid pair exists at start, and a guaranteed-solvable layout is used.

### Selectable sizes (config screen)

| Name   | Grid (cols × rows) | Pairs | Suggested for |
|--------|--------------------|-------|---------------|
| Small  | 8 × 6              | 24    | Quick games   |
| Medium | 10 × 8             | 40    | Default       |
| Large  | 12 × 10            | 60    | Long sessions |

The user picks size, animal set (defaults to emoji), and AI difficulty on the config screen, then taps **Start**.

## Matching rule

Two tiles match if and only if:

1. They show the **same animal**.
2. There exists a path between their centers that:
   - Travels only along grid lines (orthogonal moves between adjacent cell centers).
   - Crosses only **empty** cells, or cells of the one-cell border outside the grid.
   - Makes **at most two turns** (i.e. ≤ three straight segments).

A valid match clears both tiles.

## Aids

- **Hint** — highlights one valid pair if any exists. Zero penalty in v1.
- **Shuffle** — enabled only when no valid pair exists. Reshuffles remaining tiles into a state with at least one valid pair. Zero penalty in v1.

## End conditions

- **Won** — board is empty.
- **Lost** — only possible if the user enables a time limit (off by default in v1).

## Scoring

v1 scoring is intentionally simple: **"cleared in N seconds"**. Lower is better. No combos, no streaks, no leaderboard. Personal best per board size is stored in `localStorage`.

## Out of scope for v1

- Sound effects.
- Per-game leaderboards.
- Custom tile sets beyond the bundled emoji set.
- Tournaments or brackets.
- Time penalties for hint or shuffle use.
