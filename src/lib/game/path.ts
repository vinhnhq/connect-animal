import { Just, type Maybe, Nothing } from "purify-ts";
import type { Board, Path, Position } from "@/lib/game/types";

function eq(a: Position, b: Position): boolean {
  return a.col === b.col && a.row === b.row;
}

function inGrid(board: Board, p: Position): boolean {
  return p.col >= 0 && p.col < board.cols && p.row >= 0 && p.row < board.rows;
}

function isEmpty(board: Board, p: Position): boolean {
  if (!inGrid(board, p)) {
    return p.col >= -1 && p.col <= board.cols && p.row >= -1 && p.row <= board.rows;
  }
  return board.cells[p.row]?.[p.col] === null;
}

function straightClear(board: Board, a: Position, b: Position): boolean {
  if (eq(a, b)) return true;
  if (a.col === b.col) {
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    for (let r = r1 + 1; r < r2; r++) {
      if (!isEmpty(board, { col: a.col, row: r })) return false;
    }
    return true;
  }
  if (a.row === b.row) {
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);
    for (let c = c1 + 1; c < c2; c++) {
      if (!isEmpty(board, { col: c, row: a.row })) return false;
    }
    return true;
  }
  return false;
}

function compress(points: ReadonlyArray<Position>): Path {
  const out: Position[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || !eq(last, p)) out.push(p);
  }
  return out;
}

export function findPath(from: Position, to: Position, board: Board): Maybe<Path> {
  if (eq(from, to)) return Nothing;
  if (!inGrid(board, from) || !inGrid(board, to)) return Nothing;

  if (straightClear(board, from, to)) {
    return Just([from, to]);
  }

  const c1: Position = { col: from.col, row: to.row };
  const c2: Position = { col: to.col, row: from.row };
  for (const c of [c1, c2]) {
    if (eq(c, from) || eq(c, to)) continue;
    if (!isEmpty(board, c)) continue;
    if (straightClear(board, from, c) && straightClear(board, c, to)) {
      return Just([from, c, to]);
    }
  }

  for (let R = -1; R <= board.rows; R++) {
    if (R === from.row || R === to.row) continue;
    const m1: Position = { col: from.col, row: R };
    const m2: Position = { col: to.col, row: R };
    if (!isEmpty(board, m1) || !isEmpty(board, m2)) continue;
    if (
      straightClear(board, from, m1) &&
      straightClear(board, m1, m2) &&
      straightClear(board, m2, to)
    ) {
      return Just(compress([from, m1, m2, to]));
    }
  }

  for (let C = -1; C <= board.cols; C++) {
    if (C === from.col || C === to.col) continue;
    const m1: Position = { col: C, row: from.row };
    const m2: Position = { col: C, row: to.row };
    if (!isEmpty(board, m1) || !isEmpty(board, m2)) continue;
    if (
      straightClear(board, from, m1) &&
      straightClear(board, m1, m2) &&
      straightClear(board, m2, to)
    ) {
      return Just(compress([from, m1, m2, to]));
    }
  }

  return Nothing;
}
