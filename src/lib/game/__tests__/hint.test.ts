import { describe, expect, test } from "bun:test";
import { findAnyValidPair } from "@/lib/game/hint";
import type { Board, Cell } from "@/lib/game/types";

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

describe("findAnyValidPair", () => {
  test("empty board → Nothing", () => {
    const board = parseBoard([".....", "....."]);
    expect(findAnyValidPair(board).isNothing()).toBe(true);
  });

  test("returns the matchable pair as actual tiles", () => {
    const board = parseBoard(["A.A"]);
    const result = findAnyValidPair(board);
    expect(result.isJust()).toBe(true);
    const [a, b] = result.unsafeCoerce();
    expect(a.animal).toBe("A");
    expect(b.animal).toBe("A");
    expect(a.position).not.toEqual(b.position);
  });

  test("no path exists → Nothing", () => {
    // A fenced layout where A pairs cannot connect.
    const board = parseBoard([".....", ".W...", "XAYA.", ".Z...", "....."]);
    expect(findAnyValidPair(board).isNothing()).toBe(true);
  });

  test("ignores singleton animals (no partner)", () => {
    // A and B are singletons; only matching pair is C.
    const board = parseBoard(["AB.C", ".C.."]);
    const result = findAnyValidPair(board);
    expect(result.isJust()).toBe(true);
    const [a, b] = result.unsafeCoerce();
    expect(a.animal).toBe("C");
    expect(b.animal).toBe("C");
  });
});
