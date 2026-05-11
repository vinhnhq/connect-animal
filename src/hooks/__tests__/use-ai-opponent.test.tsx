import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useAiOpponent } from "@/hooks/use-ai-opponent";
import { useGame } from "@/hooks/use-game";
import type { Config, Position } from "@/lib/game/types";

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

const FLUSH_MS = 30;

async function flush() {
  await new Promise<void>((resolve) => setTimeout(resolve, FLUSH_MS));
}

describe("useAiOpponent", () => {
  test("dispatches a Match for the computer when Playing", async () => {
    const rng = seeded(1);
    const captured: Array<{ a: Position; b: Position }> = [];

    const { result } = renderHook(() => {
      const game = useGame({ initialConfig: CONFIG, rng, now: () => 0 });
      useAiOpponent({
        state: game.state,
        match: (a, b) => {
          captured.push({ a, b });
          game.match("computer", a, b);
        },
        rng,
        getDelayMs: () => 5,
        enabled: true,
      });
      return { game };
    });

    act(() => result.current.game.start(CONFIG));
    await act(async () => {
      await flush();
    });

    expect(captured.length).toBeGreaterThanOrEqual(1);
  });

  test("does nothing when disabled", async () => {
    const rng = seeded(2);
    let calls = 0;

    const { result } = renderHook(() => {
      const game = useGame({ initialConfig: CONFIG, rng, now: () => 0 });
      useAiOpponent({
        state: game.state,
        match: () => {
          calls += 1;
        },
        rng,
        getDelayMs: () => 5,
        enabled: false,
      });
      return { game };
    });

    act(() => result.current.game.start(CONFIG));
    await act(async () => {
      await flush();
    });

    expect(calls).toBe(0);
  });

  test("does nothing when state is not Playing", async () => {
    const rng = seeded(3);
    let calls = 0;

    renderHook(() => {
      const game = useGame({ initialConfig: CONFIG, rng, now: () => 0 });
      useAiOpponent({
        state: game.state, // remains Configuring (we never call start)
        match: () => {
          calls += 1;
        },
        rng,
        getDelayMs: () => 5,
        enabled: true,
      });
      return { game };
    });

    await act(async () => {
      await flush();
    });

    expect(calls).toBe(0);
  });
});
