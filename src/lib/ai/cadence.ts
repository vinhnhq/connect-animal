import type { Difficulty } from "@/lib/game/types";

/**
 * Move-cadence window per difficulty (milliseconds). Easy gives the human room
 * to win the race; Hard pressures them. Tuned by playtest, not by tests — the
 * test suite only asserts the average lies in the right range.
 */
export const CADENCE: Record<Difficulty, { minMs: number; maxMs: number }> = {
  easy: { minMs: 2500, maxMs: 4500 },
  medium: { minMs: 1400, maxMs: 2600 },
  hard: { minMs: 700, maxMs: 1400 },
};

/**
 * Sample the next computer-move delay, uniformly inside `CADENCE[difficulty]`.
 * Pure — both pieces of state (the difficulty constant and the rng) come in
 * as arguments, so tests can pin both.
 */
export function nextDelayMs(difficulty: Difficulty, rng: () => number): number {
  const { minMs, maxMs } = CADENCE[difficulty];
  return Math.round(minMs + rng() * (maxMs - minMs));
}
