import { match } from "ts-pattern";
import { generateBoard, shuffleRemaining } from "@/lib/game/board";
import { findAnyValidPair } from "@/lib/game/hint";
import { findPath } from "@/lib/game/path";
import type {
  Board,
  Cell,
  Config,
  Configuring,
  Event,
  GameState,
  Lost,
  Player,
  Playing,
  Position,
  Won,
} from "@/lib/game/types";

export function reducer(state: GameState, event: Event): GameState {
  return match(state)
    .with({ status: "Configuring" }, (s) => onConfiguring(s, event))
    .with({ status: "Playing" }, (s) => onPlaying(s, event))
    .with({ status: "Won" }, (s) => onTerminal(s, event))
    .with({ status: "Lost" }, (s) => onTerminal(s, event))
    .exhaustive();
}

function onConfiguring(state: Configuring, event: Event): GameState {
  return match(event)
    .with({ kind: "StartGame" }, (e) => startNewGame(e.config, e.now, e.rng))
    .with({ kind: "Select" }, () => state)
    .with({ kind: "Hint" }, () => state)
    .with({ kind: "Shuffle" }, () => state)
    .with({ kind: "Tick" }, () => state)
    .with({ kind: "Restart" }, () => state)
    .exhaustive();
}

function onPlaying(state: Playing, event: Event): GameState {
  return match(event)
    .with({ kind: "StartGame" }, () => state)
    .with({ kind: "Select" }, (e) => handleSelect(state, e.player, e.at))
    .with({ kind: "Hint" }, () => handleHint(state))
    .with({ kind: "Shuffle" }, (e) => ({
      ...state,
      board: shuffleRemaining(state.board, e.rng),
      selected: null,
      hint: null,
    }))
    .with({ kind: "Tick" }, (e) => ({
      ...state,
      elapsedMs: Math.max(0, e.now - state.startedAt),
    }))
    .with({ kind: "Restart" }, () => state)
    .exhaustive();
}

function onTerminal(state: Won | Lost, event: Event): GameState {
  return match(event)
    .with({ kind: "Restart" }, (): Configuring => ({ status: "Configuring", config: state.config }))
    .with({ kind: "StartGame" }, () => state)
    .with({ kind: "Select" }, () => state)
    .with({ kind: "Hint" }, () => state)
    .with({ kind: "Shuffle" }, () => state)
    .with({ kind: "Tick" }, () => state)
    .exhaustive();
}

function startNewGame(config: Config, now: number, rng: () => number): GameState {
  const result = generateBoard(config, rng);
  return result.caseOf<GameState>({
    Left: (): Configuring => ({ status: "Configuring", config }),
    Right: (board): Playing => ({
      status: "Playing",
      config,
      board,
      selected: null,
      hint: null,
      scores: { human: 0, computer: 0 },
      startedAt: now,
      elapsedMs: 0,
    }),
  });
}

function handleSelect(state: Playing, player: Player, at: Position): GameState {
  const cell = cellAt(state.board, at);
  if (!cell) return state;

  if (state.selected === null) {
    return { ...state, selected: at, hint: null };
  }

  if (eqPos(state.selected, at)) {
    return { ...state, selected: null };
  }

  const firstCell = cellAt(state.board, state.selected);
  if (!firstCell || firstCell.animal !== cell.animal) {
    return { ...state, selected: at };
  }

  const pathResult = findPath(state.selected, at, state.board);
  if (pathResult.isNothing()) {
    return { ...state, selected: at };
  }

  const newBoard = clearCells(state.board, [state.selected, at]);
  const newScores: Record<Player, number> = {
    ...state.scores,
    [player]: state.scores[player] + 1,
  };

  if (boardIsEmpty(newBoard)) {
    const won: Won = {
      status: "Won",
      config: state.config,
      board: newBoard,
      scores: newScores,
      totalMs: state.elapsedMs,
      winner: player,
    };
    return won;
  }

  return {
    ...state,
    board: newBoard,
    selected: null,
    hint: null,
    scores: newScores,
  };
}

function handleHint(state: Playing): Playing {
  const hint = findAnyValidPair(state.board)
    .map(([a, b]): readonly [Position, Position] => [a.position, b.position])
    .extract();
  return { ...state, hint: hint ?? null };
}

function cellAt(board: Board, p: Position): Cell {
  if (p.row < 0 || p.row >= board.rows || p.col < 0 || p.col >= board.cols) return null;
  return board.cells[p.row]?.[p.col] ?? null;
}

function eqPos(a: Position, b: Position): boolean {
  return a.col === b.col && a.row === b.row;
}

function clearCells(board: Board, positions: ReadonlyArray<Position>): Board {
  const cleared = new Set(positions.map((p) => `${p.col},${p.row}`));
  const cells: Cell[][] = board.cells.map((row, r) =>
    row.map((cell, c) => (cleared.has(`${c},${r}`) ? null : cell)),
  );
  return { cols: board.cols, rows: board.rows, cells };
}

function boardIsEmpty(board: Board): boolean {
  for (const row of board.cells) for (const cell of row) if (cell) return false;
  return true;
}
