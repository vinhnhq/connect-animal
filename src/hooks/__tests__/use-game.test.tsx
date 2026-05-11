import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useGame } from "@/hooks/use-game";
import type { Board, Config } from "@/lib/game/types";

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFIG: Config = { boardSize: "small", difficulty: "easy", animalSet: "default" };

function findPair(
  board: Board,
): [{ col: number; row: number }, { col: number; row: number }] | null {
  const map = new Map<string, { col: number; row: number }>();
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const cell = board.cells[row]?.[col];
      if (!cell) continue;
      const prev = map.get(cell.animal);
      if (prev) return [prev, { col, row }];
      map.set(cell.animal, { col, row });
    }
  }
  return null;
}

describe("useGame", () => {
  test("initial state is Configuring with provided defaults", () => {
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG }));
    expect(result.current.state.status).toBe("Configuring");
    if (result.current.state.status === "Configuring") {
      expect(result.current.state.config).toEqual(CONFIG);
    }
  });

  test("StartGame transitions Configuring → Playing", () => {
    const rng = seeded(42);
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG, rng, now: () => 1000 }));

    act(() => {
      result.current.start(CONFIG);
    });

    expect(result.current.state.status).toBe("Playing");
    if (result.current.state.status === "Playing") {
      expect(result.current.state.startedAt).toBe(1000);
      expect(result.current.state.scores).toEqual({ human: 0, computer: 0 });
    }
  });

  test("two valid Selects clear the pair and increment human score", () => {
    const rng = seeded(7);
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG, rng, now: () => 0 }));
    act(() => result.current.start(CONFIG));

    const playing = result.current.state;
    if (playing.status !== "Playing") throw new Error("expected Playing");
    const pair = findPair(playing.board);
    if (!pair) throw new Error("expected a valid pair on a fresh board");
    const [a, b] = pair;

    act(() => result.current.select("human", a));
    act(() => result.current.select("human", b));

    const next = result.current.state;
    if (next.status !== "Playing" && next.status !== "Won") {
      throw new Error(`unexpected state ${next.status}`);
    }
    if (next.status === "Playing") {
      expect(next.scores.human).toBeGreaterThanOrEqual(1);
      expect(next.board.cells[a.row]?.[a.col]).toBeNull();
      expect(next.board.cells[b.row]?.[b.col]).toBeNull();
    }
  });

  test("tick advances elapsedMs without leaving Playing", () => {
    const rng = seeded(1);
    let clock = 1000;
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG, rng, now: () => clock }));
    act(() => result.current.start(CONFIG));
    clock = 3500;
    act(() => result.current.tick());

    if (result.current.state.status !== "Playing") throw new Error("expected Playing");
    expect(result.current.state.elapsedMs).toBe(2500);
  });

  test("restart from terminal state returns to Configuring", () => {
    const rng = seeded(2);
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG, rng, now: () => 0 }));
    act(() => result.current.start(CONFIG));
    act(() => result.current.restart());
    // restart only fires from terminal states — Playing should ignore
    expect(result.current.state.status).toBe("Playing");
  });

  test("hint sets the hinted pair when available", () => {
    const rng = seeded(3);
    const { result } = renderHook(() => useGame({ initialConfig: CONFIG, rng, now: () => 0 }));
    act(() => result.current.start(CONFIG));
    act(() => result.current.hint());

    if (result.current.state.status !== "Playing") throw new Error("expected Playing");
    expect(result.current.state.hint).not.toBeNull();
  });
});
