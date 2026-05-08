import { describe, expect, test } from "bun:test";
import { generateBoard, shuffleRemaining } from "@/lib/game/board";
import { findAnyValidPair } from "@/lib/game/hint";
import type { Board, Cell, Config } from "@/lib/game/types";
import { mulberry32 } from "./_helpers/rng";

const config: Config = {
  boardSize: "small",
  difficulty: "easy",
  animalSet: "default",
};

function clear(
  board: Board,
  a: { col: number; row: number },
  b: { col: number; row: number },
): Board {
  const cells: Cell[][] = board.cells.map((row, r) =>
    row.map((cell, c) =>
      (a.col === c && a.row === r) || (b.col === c && b.row === r) ? null : cell,
    ),
  );
  return { cols: board.cols, rows: board.rows, cells };
}

function isEmpty(board: Board): boolean {
  for (const row of board.cells) for (const cell of row) if (cell) return false;
  return true;
}

describe("property — generation", () => {
  test("1000 seeded boards each contain at least one valid pair", () => {
    for (let seed = 1; seed <= 1000; seed++) {
      const result = generateBoard(config, mulberry32(seed));
      expect(result.isRight()).toBe(true);
      expect(findAnyValidPair(result.unsafeCoerce()).isJust()).toBe(true);
    }
  });
});

describe("property — play simulation with shuffle", () => {
  test("100 seeded boards play to completion using findAnyValidPair + shuffleRemaining", () => {
    for (let seed = 1; seed <= 100; seed++) {
      const rng = mulberry32(seed);
      let board = generateBoard(config, rng).unsafeCoerce();
      let safety = 1000;
      while (!isEmpty(board) && safety-- > 0) {
        const pair = findAnyValidPair(board);
        if (pair.isJust()) {
          const [a, b] = pair.unsafeCoerce();
          board = clear(board, a.position, b.position);
        } else {
          // Deadlock: shuffleRemaining must produce a board with a pair.
          board = shuffleRemaining(board, rng);
          expect(findAnyValidPair(board).isJust()).toBe(true);
        }
      }
      expect(isEmpty(board)).toBe(true);
    }
  });
});
