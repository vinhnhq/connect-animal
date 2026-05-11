import { type Either, Left, Right } from "purify-ts";
import { findAnyValidPair } from "@/lib/game/hint";
import {
  BOARD_DIMENSIONS,
  type Board,
  type BoardError,
  type Cell,
  type Config,
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

/**
 * Generate a fresh solvable board for the given config. Lays each animal-pair
 * onto the grid via the supplied `rng`, then verifies the board has at least
 * one valid (≤2-turn) pair using `findAnyValidPair`; retries up to 50 times.
 * Returns `Left(BoardError)` if the config is impossible (odd cell count,
 * insufficient animals) or if no solvable layout is found.
 */
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

/**
 * Reshuffle the remaining (non-cleared) tiles into the same positions, retrying
 * up to 50 times until the result has at least one valid pair. Preserves the
 * set of occupied positions and the set of animals — only their assignment is
 * permuted. Use when `findAnyValidPair` returns Nothing during play.
 */
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
  return findAnyValidPair(board).isJust();
}
