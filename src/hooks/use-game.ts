"use client";

import { useCallback, useReducer, useRef } from "react";
import { reducer } from "@/lib/game/reducer";
import type { Config, GameState, Player, Position } from "@/lib/game/types";

export type UseGameOptions = {
  initialConfig: Config;
  rng?: () => number;
  now?: () => number;
};

export type UseGameApi = {
  state: GameState;
  start: (config: Config) => void;
  select: (player: Player, at: Position) => void;
  match: (player: Player, a: Position, b: Position) => void;
  hint: () => void;
  shuffle: () => void;
  tick: () => void;
  restart: () => void;
};

function initialState(config: Config): GameState {
  return { status: "Configuring", config };
}

export function useGame({ initialConfig, rng, now }: UseGameOptions): UseGameApi {
  const rngRef = useRef(rng ?? Math.random);
  rngRef.current = rng ?? Math.random;
  const nowRef = useRef<() => number>(now ?? (() => Date.now()));
  nowRef.current = now ?? (() => Date.now());

  const [state, dispatch] = useReducer(reducer, initialConfig, initialState);

  const start = useCallback((config: Config) => {
    dispatch({ kind: "StartGame", config, now: nowRef.current(), rng: rngRef.current });
  }, []);
  const select = useCallback((player: Player, at: Position) => {
    dispatch({ kind: "Select", player, at });
  }, []);
  const matchPair = useCallback((player: Player, a: Position, b: Position) => {
    dispatch({ kind: "Match", player, a, b });
  }, []);
  const hint = useCallback(() => {
    dispatch({ kind: "Hint" });
  }, []);
  const shuffle = useCallback(() => {
    dispatch({ kind: "Shuffle", rng: rngRef.current });
  }, []);
  const tick = useCallback(() => {
    dispatch({ kind: "Tick", now: nowRef.current() });
  }, []);
  const restart = useCallback(() => {
    dispatch({ kind: "Restart" });
  }, []);

  return { state, start, select, match: matchPair, hint, shuffle, tick, restart };
}
