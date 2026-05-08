import { describe, expect, test } from "bun:test";
import { findPath } from "@/lib/game/path";
import type { Board, Cell, Position } from "@/lib/game/types";

function parseBoard(rows: string[]): Board {
  const cells: Cell[][] = rows.map((row, rowIdx) =>
    [...row].map((ch, colIdx) => {
      if (ch === ".") return null;
      const position: Position = { col: colIdx, row: rowIdx };
      return { id: `${rowIdx}-${colIdx}`, position, animal: ch };
    }),
  );
  return { cols: rows[0]?.length ?? 0, rows: rows.length, cells };
}

function pos(col: number, row: number): Position {
  return { col, row };
}

describe("findPath", () => {
  test("identical points returns Nothing", () => {
    const board = parseBoard(["A.A"]);
    const result = findPath(pos(0, 0), pos(0, 0), board);
    expect(result.isNothing()).toBe(true);
  });

  test("same row, no obstacles between → 0-turn path", () => {
    const board = parseBoard(["A.B"]);
    const result = findPath(pos(0, 0), pos(2, 0), board);
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path).toEqual([pos(0, 0), pos(2, 0)]);
  });

  test("same column, no obstacles between → 0-turn path", () => {
    const board = parseBoard(["A", ".", "B"]);
    const result = findPath(pos(0, 0), pos(0, 2), board);
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path).toEqual([pos(0, 0), pos(0, 2)]);
  });

  test("adjacent same-row tiles → 0-turn path of length 2", () => {
    const board = parseBoard(["AB"]);
    const result = findPath(pos(0, 0), pos(1, 0), board);
    expect(result.isJust()).toBe(true);
    expect(result.unsafeCoerce()).toEqual([pos(0, 0), pos(1, 0)]);
  });

  test("same row, tile blocks the line → cannot use 0-turn", () => {
    // A X B at row 0 — middle has a tile, so 0-turn fails.
    // No 1-turn or 2-turn through the small grid either; must use border row.
    const board = parseBoard(["AXB"]);
    const result = findPath(pos(0, 0), pos(2, 0), board);
    // border row above (row=-1) is empty by definition, so a 2-turn path exists
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path[0]).toEqual(pos(0, 0));
    expect(path[path.length - 1]).toEqual(pos(2, 0));
  });

  test("1-turn (L-shape) when corner is empty", () => {
    // A . .
    // . . .
    // . . B
    const board = parseBoard(["A..", "...", "..B"]);
    const result = findPath(pos(0, 0), pos(2, 2), board);
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path[0]).toEqual(pos(0, 0));
    expect(path[path.length - 1]).toEqual(pos(2, 2));
    expect(path.length).toBe(3);
  });

  test("1-turn via the only open corner when the other corner is blocked", () => {
    // A . .
    // . . .
    // X . B
    // Corner (0,2) is X (blocked). Corner (2,0) is empty AND segments clear.
    const board = parseBoard(["A..", "...", "X.B"]);
    const result = findPath(pos(0, 0), pos(2, 2), board);
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path).toEqual([pos(0, 0), pos(2, 0), pos(2, 2)]);
  });

  test("2-turn through the grid interior", () => {
    // A . X . .
    // . . . . .
    // . . X . .
    // . . . . .
    // . . X . B
    // direct path blocked by X column; needs to detour
    const board = parseBoard(["A.X..", ".....", "..X..", ".....", "..X.B"]);
    const result = findPath(pos(0, 0), pos(4, 4), board);
    expect(result.isJust()).toBe(true);
  });

  test("border-route: tiles in the same column with full-column block use the border", () => {
    // A   row 0
    // X   row 1
    // X   row 2
    // X   row 3
    // B   row 4
    // No interior path between them; must route via the border column to the side.
    const board = parseBoard(["A", "X", "X", "X", "B"]);
    const result = findPath(pos(0, 0), pos(0, 4), board);
    expect(result.isJust()).toBe(true);
    const path = result.unsafeCoerce();
    expect(path[0]).toEqual(pos(0, 0));
    expect(path[path.length - 1]).toEqual(pos(0, 4));
    expect(path.length).toBeGreaterThan(2);
  });

  test("out-of-bounds target → Nothing", () => {
    const board = parseBoard(["A"]);
    expect(findPath(pos(0, 0), pos(5, 5), board).isNothing()).toBe(true);
  });

  test("fully surrounded tile cannot reach a partner → Nothing", () => {
    // A at (1,2) is fenced in on all four sides by X tiles, so no
    // 2-turn path can exit the cell.
    //
    //   . . . . .   row 0
    //   . X . . .   row 1
    //   X A X B .   row 2
    //   . X . . .   row 3
    //   . . . . .   row 4
    const board = parseBoard([".....", ".X...", "XAXB.", ".X...", "....."]);
    const result = findPath(pos(1, 2), pos(3, 2), board);
    expect(result.isNothing()).toBe(true);
  });
});
