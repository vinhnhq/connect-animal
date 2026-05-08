import { type Either, Left, Right } from "purify-ts";
import { findPath } from "@/lib/game/path";
import {
  BOARD_DIMENSIONS,
  type Board,
  type BoardError,
  type Cell,
  type Config,
  type Tile,
} from "@/lib/game/types";

const ANIMAL_SETS: Record<string, readonly string[]> = {
  default: [
    "🐱",
    "🐶",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
    "🐅",
    "🐆",
    "🦓",
    "🦍",
    "🦧",
    "🐘",
    "🦛",
    "🦏",
    "🐪",
    "🐫",
    "🦒",
    "🦘",
    "🦬",
    "🐃",
    "🐂",
    "🐄",
    "🐎",
  ],
};

const MAX_GENERATION_ATTEMPTS = 50;

export function generateBoard(config: Config, rng: () => number): Either<BoardError, Board> {
  const dims = BOARD_DIMENSIONS[config.boardSize];
  const total = dims.cols * dims.rows;
  if (total % 2 !== 0) {
    return Left({
      kind: "InvalidConfig",
      reason: `Total cells must be even: ${dims.cols}x${dims.rows}=${total}`,
    });
  }

  const pool = ANIMAL_SETS[config.animalSet] ?? ANIMAL_SETS.default;
  const pairs = total / 2;
  if (!pool || pool.length < pairs) {
    return Left({
      kind: "InvalidConfig",
      reason: `Animal set "${config.animalSet}" has fewer than ${pairs} entries`,
    });
  }

  const flat: string[] = [];
  for (let i = 0; i < pairs; i++) {
    const animal = pool[i];
    if (animal !== undefined) flat.push(animal, animal);
  }

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const shuffled = shuffle(flat, rng);
    const board = layOut(shuffled, dims.cols, dims.rows);
    if (hasAnyValidPair(board)) return Right(board);
  }

  return Left({
    kind: "GenerationFailed",
    reason: `No solvable layout in ${MAX_GENERATION_ATTEMPTS} attempts`,
  });
}

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a !== undefined && b !== undefined) {
      out[i] = b;
      out[j] = a;
    }
  }
  return out;
}

function layOut(flat: readonly string[], cols: number, rows: number): Board {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    const r: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      const animal = flat[row * cols + col];
      r.push(animal === undefined ? null : { id: `${row}-${col}`, position: { col, row }, animal });
    }
    cells.push(r);
  }
  return { cols, rows, cells };
}

const MAX_SHUFFLE_ATTEMPTS = 50;

export function shuffleRemaining(board: Board, rng: () => number): Board {
  const positions: { col: number; row: number }[] = [];
  const animals: string[] = [];
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const cell = board.cells[row]?.[col];
      if (cell) {
        positions.push({ col, row });
        animals.push(cell.animal);
      }
    }
  }
  if (positions.length === 0) return board;

  for (let attempt = 0; attempt < MAX_SHUFFLE_ATTEMPTS; attempt++) {
    const shuffled = shuffle(animals, rng);
    const next = redistribute(board, positions, shuffled);
    if (hasAnyValidPair(next)) return next;
  }
  return redistribute(board, positions, shuffle(animals, rng));
}

function redistribute(
  board: Board,
  positions: ReadonlyArray<{ col: number; row: number }>,
  animals: ReadonlyArray<string>,
): Board {
  const cells: Cell[][] = board.cells.map((row) => row.map(() => null));
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const animal = animals[i];
    if (!p || animal === undefined) continue;
    const row = cells[p.row];
    if (!row) continue;
    row[p.col] = {
      id: `${p.row}-${p.col}`,
      position: { col: p.col, row: p.row },
      animal,
    };
  }
  return { cols: board.cols, rows: board.rows, cells };
}

function hasAnyValidPair(board: Board): boolean {
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
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (!a || !b) continue;
        if (findPath(a.position, b.position, board).isJust()) return true;
      }
    }
  }
  return false;
}
