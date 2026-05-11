import { describe, expect, test } from "bun:test";
import { CADENCE, nextDelayMs } from "@/lib/ai/cadence";
import { mulberry32 } from "@/lib/game/__tests__/_helpers/rng";

describe("nextDelayMs", () => {
  test("is deterministic for the same seed", () => {
    for (const d of ["easy", "medium", "hard"] as const) {
      const a = nextDelayMs(d, mulberry32(42));
      const b = nextDelayMs(d, mulberry32(42));
      expect(a).toBe(b);
    }
  });

  test("stays within the configured range for each difficulty", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const { minMs, maxMs } = CADENCE[difficulty];
      for (let seed = 1; seed <= 200; seed++) {
        const d = nextDelayMs(difficulty, mulberry32(seed));
        expect(d).toBeGreaterThanOrEqual(minMs);
        expect(d).toBeLessThanOrEqual(maxMs);
      }
    }
  });

  test("Easy is on average slower than Medium, which is slower than Hard", () => {
    const avg = (difficulty: "easy" | "medium" | "hard") => {
      let total = 0;
      for (let seed = 1; seed <= 500; seed++) {
        total += nextDelayMs(difficulty, mulberry32(seed));
      }
      return total / 500;
    };
    const e = avg("easy");
    const m = avg("medium");
    const h = avg("hard");
    expect(e).toBeGreaterThan(m);
    expect(m).toBeGreaterThan(h);
  });
});
