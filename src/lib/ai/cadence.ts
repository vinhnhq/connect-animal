import type { Difficulty } from "@/lib/game/types";

export const CADENCE: Record<Difficulty, { minMs: number; maxMs: number }> = {
  easy: { minMs: 2500, maxMs: 4500 },
  medium: { minMs: 1400, maxMs: 2600 },
  hard: { minMs: 700, maxMs: 1400 },
};

export function nextDelayMs(difficulty: Difficulty, rng: () => number): number {
  const { minMs, maxMs } = CADENCE[difficulty];
  return Math.round(minMs + rng() * (maxMs - minMs));
}
