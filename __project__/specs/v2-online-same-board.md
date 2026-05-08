# v2 — Online same-board race

> Scoped, not implemented. Locked-in decisions wait until v1 ships.

## Goal

Two players, separate browsers, same board. First to clear the last pair wins.

## Open questions (resolve at start of v2)

- **Realtime transport** — Partykit, Liveblocks, Supabase Realtime, or a custom Socket.IO server on Fly/Render. Vercel serverless can't hold sockets, so this is the central decision.
- **Authority** — client-authoritative (smaller server, exposes cheating) vs. server-authoritative (server runs `lib/game/reducer` — this is why the purity rule matters in v1). Default expectation: server-authoritative.
- **Lobby model** — shareable room URL vs. matchmaking queue. Default: room URL — simpler, no matching service.
- **Reconnect / desync** — full state replay on reconnect; ignore moves whose game version doesn't match.
- **Anti-cheat** — with server authority and a deterministic seed, the only attack is timing. Acceptable for v1 of online.

## Reuse from v1

Everything in `src/lib/game/` and `src/lib/ai/` lifts to the server unchanged — that's the payoff for the purity rule.

## Out of scope (still)

- Accounts, persistent ratings, replays, spectators, voice chat.
