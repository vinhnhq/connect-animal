export type Difficulty = "easy" | "medium" | "hard";

export type BoardSize = "small" | "medium" | "large";

export type Config = {
  boardSize: BoardSize;
  difficulty: Difficulty;
  animalSet: string;
};

export const BOARD_DIMENSIONS = {
  small: { cols: 8, rows: 6 },
  medium: { cols: 10, rows: 8 },
  large: { cols: 12, rows: 10 },
} as const satisfies Record<BoardSize, { cols: number; rows: number }>;

export type Position = {
  col: number;
  row: number;
};

export type AnimalKind = string;

export type TileId = string;

export type Tile = {
  id: TileId;
  position: Position;
  animal: AnimalKind;
};

export type Cell = Tile | null;

export type Board = {
  cols: number;
  rows: number;
  cells: ReadonlyArray<ReadonlyArray<Cell>>;
};

export type Path = ReadonlyArray<Position>;

export type Player = "human" | "computer";

export type Move = {
  player: Player;
  a: Position;
  b: Position;
  path: Path;
};

export type BoardError =
  | { kind: "InvalidConfig"; reason: string }
  | { kind: "GenerationFailed"; reason: string };

export type MatchError =
  | { kind: "TileMissing"; at: Position }
  | { kind: "TilesNotEqual" }
  | { kind: "NoPath" };

export type Configuring = {
  status: "Configuring";
  config: Config;
};

export type Playing = {
  status: "Playing";
  config: Config;
  board: Board;
  selected: Position | null;
  hint: readonly [Position, Position] | null;
  scores: Record<Player, number>;
  startedAt: number;
  elapsedMs: number;
};

export type Won = {
  status: "Won";
  config: Config;
  board: Board;
  scores: Record<Player, number>;
  totalMs: number;
  winner: Player;
};

export type Lost = {
  status: "Lost";
  config: Config;
  board: Board;
  scores: Record<Player, number>;
  totalMs: number;
};

export type GameState = Configuring | Playing | Won | Lost;

export type Event =
  | { kind: "StartGame"; config: Config; now: number; rng: () => number }
  | { kind: "Select"; player: Player; at: Position }
  | { kind: "Match"; player: Player; a: Position; b: Position }
  | { kind: "Hint" }
  | { kind: "Shuffle"; rng: () => number }
  | { kind: "Tick"; now: number }
  | { kind: "Restart" };
