import { describe, expect, test } from "bun:test";
import { pickMove } from "@/lib/ai/move";
import { mulberry32 } from "@/lib/game/__tests__/_helpers/rng";
import { generateBoard, shuffleRemaining } from "@/lib/game/board";
import type { Board, Cell, Difficulty, Position } from "@/lib/game/types";

function isEmpty(board: Board): boolean {
  for (const row of board.cells) for (const cell of row) if (cell) return false;
  return true;
}

function clear(board: Board, a: Position, b: Position): Board {
  const cells: Cell[][] = board.cells.map((row, r) =>
    row.map((cell, c) =>
      (a.col === c && a.row === r) || (b.col === c && b.row === r) ? null : cell,
    ),
  );
  return { cols: board.cols, rows: board.rows, cells };
}

function tileCount(board: Board): number {
  let n = 0;
  for (const row of board.cells) for (const cell of row) if (cell) n++;
  return n;
}

describe("AI vs. board — eventual clearance", () => {
  test.each<Difficulty>([
    "easy",
    "medium",
    "hard",
  ])("%s difficulty clears a Small board within bounded moves", (difficulty) => {
    for (let seed = 1; seed <= 10; seed++) {
      const rng = mulberry32(seed);
      let board = generateBoard(
        { boardSize: "small", difficulty, animalSet: "default" },
        rng,
      ).unsafeCoerce();

      const initialTiles = tileCount(board);
      const maxMoves = initialTiles; // every successful match removes exactly 2 tiles
      let moves = 0;
      let shuffles = 0;

      while (!isEmpty(board)) {
        const move = pickMove(board, difficulty, rng);
        if (move.isJust()) {
          const m = move.unsafeCoerce();
          board = clear(board, m.a, m.b);
          moves++;
          expect(moves).toBeLessThanOrEqual(maxMoves);
        } else {
          // No moves — shuffle and try again.
          board = shuffleRemaining(board, rng);
          shuffles++;
          expect(shuffles).toBeLessThan(20);
        }
      }

      expect(isEmpty(board)).toBe(true);
      // exactly initialTiles/2 pairs cleared
      expect(moves).toBe(initialTiles / 2);
    }
  });

  test("Hard never loses to a no-move state when one exists", () => {
    // For a board with at least one valid pair, pickMove("hard") must return Just.
    for (let seed = 1; seed <= 50; seed++) {
      const board = generateBoard(
        { boardSize: "small", difficulty: "hard", animalSet: "default" },
        mulberry32(seed),
      ).unsafeCoerce();
      expect(pickMove(board, "hard", mulberry32(seed)).isJust()).toBe(true);
    }
  });
});
