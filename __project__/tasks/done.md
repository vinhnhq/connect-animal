# Done

Move tasks here from [`backlog.md`](backlog.md) as they finish, with the date and commit SHA.

Format:

```
- 2026-05-08 · `abc1234` · 0.1 Initialize Next.js 15 + TS + Tailwind v4 + Bun.
```

- 2026-05-08 · `69b1c5d` · 0.1 Initialize Next.js 15 + TS + Tailwind v4 + Bun.
- 2026-05-08 · `3f2eeec` · 0.2 Add Biome with strict rules.
- 2026-05-08 · `8611a71` · 0.3 Wire bun:test + happy-dom + Testing Library + smoke test.
- 2026-05-08 · `d5fa9c3` · 0.4 Install shadcn/ui with Button, Select, RadioGroup, Dialog.
- 2026-05-08 · `3f74835` · 0.5 Add Playwright with trivial home-page smoke.
- 2026-05-08 · `eb3b440` · 0.6 Enforce pure-lib boundary via Biome overrides + boundary test.
- 2026-05-08 · `601fdf3` · 0.7 Install ts-pattern and purify-ts.
- 2026-05-08 · `dedd192` · 1.1 Define core game types.
- 2026-05-08 · `d8c1f16` · 1.2 findPath (Maybe<Path>, ≤2-turn) with 11 TDD cases.
- 2026-05-08 · `7f5abd7` · 1.3 generateBoard (Either<BoardError, Board>, shuffle-and-verify).
- 2026-05-08 · `da9d4e3` · 1.4 shuffleRemaining preserves positions and animals.
- 2026-05-08 · `b438d85` · 1.5 Exhaustive reducer via ts-pattern (4×6 transitions).
- 2026-05-08 · `c6d37a6` · 1.6 findAnyValidPair returns Maybe<[Tile, Tile]>.
- 2026-05-08 · `d55d14b` · 1.7 Seeded property tests (1000 boards solvable, 100 play-to-completion).
- 2026-05-11 · `3f906cb` · 2.1 pickMove for Easy/Medium/Hard.
- 2026-05-11 · `4e61103` · 2.2 nextDelayMs cadence per difficulty.
- 2026-05-11 · `93f96f7` · 2.3 AI vs. board integration test (10 seeds × 3 difficulties).
- 2026-05-11 · `caa39db` · Design system locked — V3 brutalist (dialed down). Storybook at `/preview`, tokens documented in `docs/design.md`.
- 2026-05-11 · `3f0d187` · 3.1 Config screen with localStorage persistence.
- 2026-05-11 · `15a4fa0` · 3.3 useGame hook bridging reducer to React.
- 2026-05-11 · `ce09727` · 3.2 BoardView with keyboard navigation.
- 2026-05-11 · `80ea5fc` · 3.5 Wire config form ↔ board view via useGame (with `document.startViewTransition` and the `hidden` attribute as stable-React equivalents).
- 2026-05-11 · `5ddd96e` · 3.4 Path-flash overlay on successful match.
- 2026-05-11 · `5773423` · 3.6 AI opponent loop + `Match` reducer event.
- 2026-05-11 · `8ad269b` · 4.1 Hint + Shuffle + stats toolbar.
- 2026-05-11 · `3654e36` · 4.2 End-of-round dialog (Play again / Change settings).
- 2026-05-11 · `719444b` · 4.3 Personal-best per board size (pure adapter + React wrapper).
- 2026-05-11 · `e31cb39` · 4.5 Playwright smoke (configure → three matches → quit).
- 2026-05-11 · `bea5f8c` · 4.4 Metadata, theme color, viewport, focus rings (Lighthouse run is a manual step).
- 2026-05-11 · `5aedd51` · 5.1 README Quick Start refreshed for shipped v1.
- 2026-05-11 · `e1ff7dc` · 5.2 JSDoc on every exported symbol in lib/game and lib/ai.
- 2026-05-11 · `c9afb12` · 5.3 Record drift between planned and shipped v1 in architecture.md.
