import { describe, expect, test } from "bun:test";
import { personalBestKey, readPersonalBest, writePersonalBest } from "@/lib/personal-best";

function fakeStorage(seed: Record<string, string> = {}): {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  data: Record<string, string>;
} {
  const data = { ...seed };
  return {
    data,
    getItem: (k) => (k in data ? (data[k] ?? null) : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

describe("personalBestKey", () => {
  test("keys are stable and per-size", () => {
    expect(personalBestKey("small")).toBe("connect-animal:pb:small");
    expect(personalBestKey("medium")).toBe("connect-animal:pb:medium");
    expect(personalBestKey("large")).toBe("connect-animal:pb:large");
  });
});

describe("readPersonalBest", () => {
  test("returns null when nothing stored", () => {
    expect(readPersonalBest(fakeStorage(), "small")).toBeNull();
  });

  test("returns the stored number", () => {
    const s = fakeStorage({ "connect-animal:pb:medium": "12345" });
    expect(readPersonalBest(s, "medium")).toBe(12345);
  });

  test("returns null for corrupt entries", () => {
    const s = fakeStorage({ "connect-animal:pb:small": "not-a-number" });
    expect(readPersonalBest(s, "small")).toBeNull();
  });

  test("returns null for negative or zero", () => {
    const s = fakeStorage({ "connect-animal:pb:small": "-5" });
    expect(readPersonalBest(s, "small")).toBeNull();
  });
});

describe("writePersonalBest", () => {
  test("writes a fresh value when no PB exists", () => {
    const s = fakeStorage();
    const result = writePersonalBest(s, "small", 10_000);
    expect(result).toBe("saved");
    expect(s.data["connect-animal:pb:small"]).toBe("10000");
  });

  test("writes when the new time is lower than the existing PB", () => {
    const s = fakeStorage({ "connect-animal:pb:small": "20000" });
    expect(writePersonalBest(s, "small", 15_000)).toBe("saved");
    expect(s.data["connect-animal:pb:small"]).toBe("15000");
  });

  test("keeps the existing PB when the new time is higher", () => {
    const s = fakeStorage({ "connect-animal:pb:small": "10000" });
    expect(writePersonalBest(s, "small", 25_000)).toBe("kept");
    expect(s.data["connect-animal:pb:small"]).toBe("10000");
  });

  test("rejects non-positive ms (no write, no error)", () => {
    const s = fakeStorage();
    expect(writePersonalBest(s, "small", 0)).toBe("kept");
    expect(writePersonalBest(s, "small", -1)).toBe("kept");
    expect(s.data["connect-animal:pb:small"]).toBeUndefined();
  });
});
