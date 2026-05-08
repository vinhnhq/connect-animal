# v1 — Solo vs. computer

## Goal

A complete, fast, well-tested single-player experience: a player can configure a game, play against a computer opponent on a shared board and timer, and see their result.

## Out of scope

- Online play in any form.
- Hot-seat (two humans, one screen).
- Persistent leaderboard, accounts, or server-side state.

## User stories and acceptance criteria

### S1. Configure a game

> As a player I want to pick board size, animal set, and AI difficulty so that I can tune the challenge.

**Acceptance:**

- [ ] Config screen has three controls: board size (Small / Medium / Large), animal set (default emoji), AI difficulty (Easy / Medium / Hard).
- [ ] Tapping **Start** transitions to the play screen with a `<ViewTransition>` animation typed `'config-to-play'`.
- [ ] Returning to config (back button or "Change settings") preserves the previous selections via `<Activity mode="hidden">`.
- [ ] The selected config persists across reloads via `localStorage`.

### S2. Play a round

> As a player I want to match pairs of animals by clicking two compatible tiles so that I can clear the board.

**Acceptance:**

- [ ] Selecting one tile highlights it. Selecting a second valid match clears both, briefly animating the connecting path.
- [ ] Selecting an invalid second tile selects the new tile (the first is deselected). Documented in `architecture.md`.
- [ ] Keyboard play: arrow keys move focus, **Space** / **Enter** selects, **Escape** deselects.
- [ ] `prefers-reduced-motion: reduce` shortens animations but the path flash still plays.

### S3. Compete with the computer

> As a player I want to race against a computer so that the game has stakes.

**Acceptance:**

- [ ] The computer makes moves on its own schedule; cadence depends on difficulty.
- [ ] The player and computer share the **same board** — clearing a pair removes those tiles for both.
- [ ] Whoever clears the **last** pair wins. The result screen names the winner and shows total time.
- [ ] At Easy/Medium difficulty the player should usually win; at Hard the computer should usually win. Confirmed by playtest, not asserted in tests.

### S4. Hint and shuffle

**Acceptance:**

- [ ] **Hint** highlights one valid pair when pressed; if none exist, the button is disabled and the **Shuffle** button is enabled in its place.
- [ ] **Shuffle** is enabled only when no valid pair exists; it reshuffles remaining tiles into a state with at least one valid pair.

### S5. End of game

**Acceptance:**

- [ ] Win/Lose screen shows time elapsed and who won.
- [ ] **Play again** restarts with the same config (one click, same `<ViewTransition>` typed `'game-end'`).
- [ ] **Change settings** returns to the config screen.
- [ ] Personal best per board size persists in `localStorage` and is shown next to the board-size selector.

## Non-functional

- [ ] All `src/lib/**` covered by `bun:test`; coverage gate ≥ 90% lines on `lib/`.
- [ ] One Playwright smoke test: configure Medium / Easy AI → make three valid matches → quit. Runs in CI.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on the play screen at Medium board.
- [ ] No `any`, no `as` outside the single isolated purify-ts adapter helper.
