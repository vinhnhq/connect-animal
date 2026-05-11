import { describe, expect, test } from "bun:test";
import { pickMove } from "@/lib/ai/move";
import { mulberry32 } from "@/lib/game/__tests__/_helpers/rng";
import { generateBoard } from "@/lib/game/board";
import type { Board, Cell, Config } from "@/lib/game/types";

const config: Config = {
  boardSize: "small",
  difficulty: "easy",
  animalSet: "default",
};

function parseBoard(rows: string[]): Board {
  const cells: Cell[][] = rows.map((row, rowIdx) =>
    [...row].map((ch, colIdx) =>
      ch === "."
        ? null
        : {
            id: `${rowIdx}-${colIdx}`,
            position: { col: colIdx, row: rowIdx },
            animal: ch,
          },
    ),
  );
  return { cols: rows[0]?.length ?? 0, rows: rows.length, cells };
}

describe("pickMove", () => {
  test("empty board returns Nothing for every difficulty", () => {
    const board = parseBoard([".....", "....."]);
    for (const d of ["easy", "medium", "hard"] as const) {
      expect(pickMove(board, d, mulberry32(1)).isNothing()).toBe(true);
    }
  });

  test("board with no valid pair returns Nothing", () => {
    // Fenced layout used elsewhere — A's cannot connect.
    const board = parseBoard([".....", ".W...", "XAYA.", ".Z...", "....."]);
    expect(pickMove(board, "hard", mulberry32(1)).isNothing()).toBe(true);
  });

  test("Easy picks any valid pair", () => {
    const board = parseBoard(["A.A"]);
    const result = pickMove(board, "easy", mulberry32(1));
    expect(result.isJust()).toBe(true);
    const move = result.unsafeCoerce();
    expect(move.player).toBe("computer");
    expect(move.a).toEqual({ col: 0, row: 0 });
    expect(move.b).toEqual({ col: 2, row: 0 });
    expect(move.path[0]).toEqual(move.a);
    expect(move.path[move.path.length - 1]).toEqual(move.b);
  });

  test("Easy is deterministic for the same RNG seed", () => {
    const board = generateBoard(config, mulberry32(10)).unsafeCoerce();
    const a = pickMove(board, "easy", mulberry32(42));
    const b = pickMove(board, "easy", mulberry32(42));
    expect(a.extract()).toEqual(b.extract());
  });

  test("Easy picks multiple different pairs across seeds when many exist", () => {
    // 4 valid pairs (A, B, C, D), each one a trivial 0-turn match.
    const board = parseBoard(["A.A.", "B.B.", "C.C.", "D.D."]);
    const picks = new Set<string>();
    for (let seed = 1; seed <= 50; seed++) {
      const m = pickMove(board, "easy", mulberry32(seed));
      if (m.isJust()) {
        const { a } = m.unsafeCoerce();
        picks.add(board.cells[a.row]?.[a.col]?.animal ?? "");
      }
    }
    expect(picks.size).toBeGreaterThan(1);
  });

  test("Hard picks the pair with the shortest path among all valid pairs", () => {
    // Two valid pairs: A-pair distance 2 (adjacent in row 0), B-pair distance 4 (corners)
    //   A A . . .   row 0
    //   . . . . .   row 1
    //   B . . . B   row 2
    const board = parseBoard(["AA...", ".....", "B...B"]);
    const move = pickMove(board, "hard", mulberry32(1)).unsafeCoerce();
    const animals = [move.a, move.b].map((p) => board.cells[p.row]?.[p.col]?.animal);
    expect(animals[0]).toBe("A");
    expect(animals[1]).toBe("A");
  });

  test("Hard is deterministic", () => {
    const board = generateBoard(config, mulberry32(11)).unsafeCoerce();
    const a = pickMove(board, "hard", mulberry32(1));
    const b = pickMove(board, "hard", mulberry32(1));
    expect(a.extract()).toEqual(b.extract());
  });

  test("Medium is deterministic for the same RNG seed", () => {
    const board = generateBoard(config, mulberry32(12)).unsafeCoerce();
    const a = pickMove(board, "medium", mulberry32(5));
    const b = pickMove(board, "medium", mulberry32(5));
    expect(a.extract()).toEqual(b.extract());
  });

  test("Medium leans toward shorter paths on average", () => {
    // Run many seeds; Medium should pick the short pair (A-A) more often than not.
    //   A A . . .   row 0   — short
    //   . . . . .   row 1
    //   B . . . B   row 2   — long
    const board = parseBoard(["AA...", ".....", "B...B"]);
    let short = 0;
    let long = 0;
    for (let seed = 1; seed <= 100; seed++) {
      const move = pickMove(board, "medium", mulberry32(seed)).unsafeCoerce();
      const animal = board.cells[move.a.row]?.[move.a.col]?.animal;
      if (animal === "A") short++;
      else long++;
    }
    expect(short).toBeGreaterThan(long);
  });
});
