"use client";

import { useEffect, useRef } from "react";
import { nextDelayMs } from "@/lib/ai/cadence";
import { pickMove } from "@/lib/ai/move";
import type { Difficulty, GameState, Position } from "@/lib/game/types";

type Args = {
  state: GameState;
  match: (a: Position, b: Position) => void;
  rng?: () => number;
  getDelayMs?: (difficulty: Difficulty, rng: () => number) => number;
  enabled?: boolean;
};

export function useAiOpponent({ state, match, rng, getDelayMs, enabled = true }: Args): void {
  const matchRef = useRef(match);
  matchRef.current = match;
  const rngRef = useRef(rng ?? Math.random);
  rngRef.current = rng ?? Math.random;
  const delayRef = useRef(getDelayMs ?? nextDelayMs);
  delayRef.current = getDelayMs ?? nextDelayMs;

  // Re-schedule the AI's next move only when the board identity changes (a pair
  // was cleared) or when status / enabled flips. Ignoring selected/hint/elapsed
  // keeps the AI's cadence steady through unrelated UI events.
  const board = state.status === "Playing" ? state.board : null;
  const difficulty = state.status === "Playing" ? state.config.difficulty : null;

  useEffect(() => {
    if (!enabled) return;
    if (!board || !difficulty) return;

    const delay = delayRef.current(difficulty, rngRef.current);
    const id = setTimeout(() => {
      const move = pickMove(board, difficulty, rngRef.current);
      move.ifJust((m) => matchRef.current(m.a, m.b));
    }, delay);

    return () => clearTimeout(id);
  }, [enabled, board, difficulty]);
}
