# 0001 — Stack choices

- **Date:** 2026-05-07
- **Status:** Accepted

## Context

Greenfield app. Owner wants modern Next.js with strong type-level guarantees and a fast feedback loop. v1 ships single-player vs. computer; v2 will add online same-board racing.

## Decisions

| Choice | Why | Alternative considered |
|---|---|---|
| **Next.js 15 App Router, `src/`** | Latest stable; App Router is the default direction; `src/` keeps repo root clean | Pages Router (rejected — legacy) |
| **React 19** | `<Activity>` and View Transitions are first-class, needed for the config↔play UX | React 18 (rejected — would need a third-party motion lib for transitions) |
| **TypeScript strict** | Required for ts-pattern exhaustiveness and purify-ts ergonomics | — |
| **Tailwind v4 + shadcn/ui** | Fastest path to a polished UI without designing a system from scratch | CSS modules (rejected — too much manual styling) |
| **Bun** (PM + runtime + test) | Single tool, fast installs and tests | npm + Vitest (rejected — extra moving parts) |
| **Biome** | One tool replaces ESLint + Prettier; faster | ESLint + Prettier (rejected — config sprawl) |
| **ts-pattern** | Exhaustive pattern matching for the game reducer; compile-time guarantee that all state×event pairs are handled | Hand-written switch (rejected — easy to miss cases) |
| **purify-ts** | `Maybe` and `Either` make path-finding and board generation honest about failure modes | Hand-rolled discriminated unions (rejected — duplicates a solved problem) |
| **Anonymous play, no auth** | v1 is single-player; auth would be premature | NextAuth (deferred to v2 if needed) |
| **No DB in v1** | All state is in memory or `localStorage` | SQLite/Postgres (deferred) |
| **TDD** | Game logic is the kind of code where tests are cheap and bugs are expensive | Test-after (rejected) |
| **Solo + computer first, online later** | Online same-board needs realtime infra (Partykit/Liveblocks/Supabase). Decoupling them lets v1 ship and v2 reuse the pure logic | Build both at once (rejected — slows v1) |

## Consequences

- The `lib/game` purity rule is load-bearing for the v2 server. If we ever break it, online same-board will require a rewrite.
- Bun's React DOM testing has occasional rough edges with Radix-based shadcn components. If `bun:test` + `happy-dom` proves unreliable for specific component tests, switching those tests to Vitest is allowed without revisiting this ADR.
- Choosing Tailwind v4 means we live on a relatively new release; if a regression blocks us, dropping to v3 is a half-day move and doesn't invalidate the rest of the stack.
