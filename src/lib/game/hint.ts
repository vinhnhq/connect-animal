import { Just, type Maybe, Nothing } from "purify-ts";
import { findPath } from "@/lib/game/path";
import type { Board, Tile } from "@/lib/game/types";

export function findAnyValidPair(board: Board): Maybe<readonly [Tile, Tile]> {
  const byAnimal = new Map<string, Tile[]>();
  for (const row of board.cells) {
    for (const cell of row) {
      if (!cell) continue;
      const list = byAnimal.get(cell.animal) ?? [];
      list.push(cell);
      byAnimal.set(cell.animal, list);
    }
  }
  for (const list of byAnimal.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (!a || !b) continue;
        if (findPath(a.position, b.position, board).isJust()) {
          return Just([a, b] as const);
        }
      }
    }
  }
  return Nothing;
}
