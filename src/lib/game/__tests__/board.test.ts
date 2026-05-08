import { describe, expect, test } from "bun:test";
import { generateBoard } from "@/lib/game/board";
import { findPath } from "@/lib/game/path";
import type { Board, Config, Tile } from "@/lib/game/types";
import { mulberry32 } from "./_helpers/rng";

const baseConfig: Config = {
  boardSize: "small",
  difficulty: "easy",
  animalSet: "default",
};

function tilesOf(board: Board): Tile[] {
  const out: Tile[] = [];
  for (const row of board.cells) for (const cell of row) if (cell) out.push(cell);
  return out;
}

function hasAnyConnectablePair(board: Board): boolean {
  const tiles = tilesOf(board);
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const a = tiles[i];
      const b = tiles[j];
      if (!a || !b || a.animal !== b.animal) continue;
      if (findPath(a.position, b.position, board).isJust()) return true;
    }
  }
  return false;
}

describe("generateBoard", () => {
  test("Small produces an 8x6 board fully populated with 48 tiles", () => {
    const result = generateBoard(baseConfig, mulberry32(1));
    expect(result.isRight()).toBe(true);
    const board = result.unsafeCoerce();
    expect(board.cols).toBe(8);
    expect(board.rows).toBe(6);
    expect(tilesOf(board)).toHaveLength(48);
  });

  test("Medium produces a 10x8 board with 80 tiles", () => {
    const result = generateBoard({ ...baseConfig, boardSize: "medium" }, mulberry32(2));
    expect(result.isRight()).toBe(true);
    expect(tilesOf(result.unsafeCoerce())).toHaveLength(80);
  });

  test("Large produces a 12x10 board with 120 tiles", () => {
    const result = generateBoard({ ...baseConfig, boardSize: "large" }, mulberry32(3));
    expect(result.isRight()).toBe(true);
    expect(tilesOf(result.unsafeCoerce())).toHaveLength(120);
  });

  test("every animal appears exactly twice", () => {
    const result = generateBoard({ ...baseConfig, boardSize: "medium" }, mulberry32(42));
    const board = result.unsafeCoerce();
    const counts = new Map<string, number>();
    for (const t of tilesOf(board)) counts.set(t.animal, (counts.get(t.animal) ?? 0) + 1);
    for (const count of counts.values()) expect(count).toBe(2);
  });

  test("at least one valid pair exists at start (single seed)", () => {
    const board = generateBoard(baseConfig, mulberry32(7)).unsafeCoerce();
    expect(hasAnyConnectablePair(board)).toBe(true);
  });

  test("at least one valid pair exists at start (50 seeds)", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const result = generateBoard(baseConfig, mulberry32(seed));
      expect(result.isRight()).toBe(true);
      expect(hasAnyConnectablePair(result.unsafeCoerce())).toBe(true);
    }
  });

  test("identical seeds produce identical boards", () => {
    const a = generateBoard(baseConfig, mulberry32(99)).unsafeCoerce();
    const b = generateBoard(baseConfig, mulberry32(99)).unsafeCoerce();
    expect(a).toEqual(b);
  });

  test("unknown animal set falls back to default", () => {
    const result = generateBoard({ ...baseConfig, animalSet: "nonexistent" }, mulberry32(1));
    expect(result.isRight()).toBe(true);
  });
});
