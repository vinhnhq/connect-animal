import { describe, expect, test } from "bun:test";
import { generateBoard, shuffleRemaining } from "@/lib/game/board";
import { findPath } from "@/lib/game/path";
import type { Board, Cell, Config, Tile } from "@/lib/game/types";
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

function emptyMaskOf(board: Board): boolean[][] {
  return board.cells.map((row) => row.map((cell) => cell === null));
}

function animalCountsOf(board: Board): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of tilesOf(board)) counts.set(t.animal, (counts.get(t.animal) ?? 0) + 1);
  return counts;
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

function emptyBoard(cols: number, rows: number): Board {
  const cells: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );
  return { cols, rows, cells };
}

describe("shuffleRemaining", () => {
  test("preserves dimensions", () => {
    const board = generateBoard(baseConfig, mulberry32(1)).unsafeCoerce();
    const out = shuffleRemaining(board, mulberry32(2));
    expect(out.cols).toBe(board.cols);
    expect(out.rows).toBe(board.rows);
  });

  test("preserves the set of empty/non-empty positions", () => {
    const board = generateBoard(baseConfig, mulberry32(3)).unsafeCoerce();
    const out = shuffleRemaining(board, mulberry32(4));
    expect(emptyMaskOf(out)).toEqual(emptyMaskOf(board));
  });

  test("preserves the multiset of animals", () => {
    const board = generateBoard(baseConfig, mulberry32(5)).unsafeCoerce();
    const out = shuffleRemaining(board, mulberry32(6));
    expect(Object.fromEntries(animalCountsOf(out))).toEqual(
      Object.fromEntries(animalCountsOf(board)),
    );
  });

  test("result has at least one valid pair", () => {
    const board = generateBoard(baseConfig, mulberry32(7)).unsafeCoerce();
    for (let seed = 1; seed <= 20; seed++) {
      const out = shuffleRemaining(board, mulberry32(seed));
      expect(hasAnyConnectablePair(out)).toBe(true);
    }
  });

  test("identical RNG seed produces identical shuffle", () => {
    const board = generateBoard(baseConfig, mulberry32(8)).unsafeCoerce();
    const a = shuffleRemaining(board, mulberry32(99));
    const b = shuffleRemaining(board, mulberry32(99));
    expect(a).toEqual(b);
  });

  test("empty board is returned unchanged", () => {
    const board = emptyBoard(4, 4);
    const out = shuffleRemaining(board, mulberry32(1));
    expect(out).toEqual(board);
  });
});
