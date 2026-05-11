import { Just, type Maybe, Nothing } from "purify-ts";
import { findPath } from "@/lib/game/path";
import type { Board, Difficulty, Move, Path, Tile } from "@/lib/game/types";

type Candidate = {
  a: Tile;
  b: Tile;
  path: Path;
};

export function pickMove(board: Board, difficulty: Difficulty, rng: () => number): Maybe<Move> {
  const candidates = allValidPairs(board);
  if (candidates.length === 0) return Nothing;

  const chosen = selectByDifficulty(candidates, difficulty, rng);
  return Just({
    player: "computer",
    a: chosen.a.position,
    b: chosen.b.position,
    path: chosen.path,
  });
}

function selectByDifficulty(
  candidates: ReadonlyArray<Candidate>,
  difficulty: Difficulty,
  rng: () => number,
): Candidate {
  if (difficulty === "hard") {
    return shortest(candidates);
  }
  if (difficulty === "easy") {
    return pickRandom(candidates, rng);
  }
  return pickWeightedShorter(candidates, rng);
}

function shortest(candidates: ReadonlyArray<Candidate>): Candidate {
  let best = candidates[0];
  if (!best) throw new Error("unreachable: empty candidates");
  for (const c of candidates) {
    if (pathLength(c.path) < pathLength(best.path)) best = c;
  }
  return best;
}

function pickRandom<T>(arr: ReadonlyArray<T>, rng: () => number): T {
  const i = Math.floor(rng() * arr.length);
  const item = arr[i] ?? arr[0];
  if (!item) throw new Error("unreachable: empty array");
  return item;
}

function pickWeightedShorter(candidates: ReadonlyArray<Candidate>, rng: () => number): Candidate {
  // weight = 1 / length^2 — short paths dominate, long paths still possible.
  const weights = candidates.map((c) => 1 / pathLength(c.path) ** 2);
  const total = weights.reduce((acc, w) => acc + w, 0);
  let pick = rng() * total;
  for (let i = 0; i < candidates.length; i++) {
    const w = weights[i] ?? 0;
    pick -= w;
    if (pick <= 0) {
      const c = candidates[i];
      if (c) return c;
    }
  }
  const last = candidates[candidates.length - 1];
  if (!last) throw new Error("unreachable: empty candidates");
  return last;
}

function pathLength(path: Path): number {
  let len = 0;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (!a || !b) continue;
    len += Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
  }
  return len;
}

function allValidPairs(board: Board): Candidate[] {
  const byAnimal = new Map<string, Tile[]>();
  for (const row of board.cells) {
    for (const cell of row) {
      if (!cell) continue;
      const list = byAnimal.get(cell.animal) ?? [];
      list.push(cell);
      byAnimal.set(cell.animal, list);
    }
  }
  const out: Candidate[] = [];
  for (const list of byAnimal.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (!a || !b) continue;
        const path = findPath(a.position, b.position, board);
        path.ifJust((p) => out.push({ a, b, path: p }));
      }
    }
  }
  return out;
}
