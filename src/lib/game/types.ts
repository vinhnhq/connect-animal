/** Computer-opponent strength. Picked on the config screen, never changes mid-game. */
export type Difficulty = "easy" | "medium" | "hard";

/** Available board sizes. The actual dimensions live in `BOARD_DIMENSIONS`. */
export type BoardSize = "small" | "medium" | "large";

/** Choices made on the config screen before a round starts. */
export type Config = {
  boardSize: BoardSize;
  difficulty: Difficulty;
  /** Key into the animal-set pool inside `board.ts`. v1 ships one set: "default". */
  animalSet: string;
};

/**
 * Authoritative grid sizes per board variant. The generator pulls dims from
 * here; the UI shows them as a hint next to each radio. cols × rows must be
 * even (every tile needs a partner).
 */
export const BOARD_DIMENSIONS = {
  small: { cols: 8, rows: 6 },
  medium: { cols: 10, rows: 8 },
  large: { cols: 12, rows: 10 },
} as const satisfies Record<BoardSize, { cols: number; rows: number }>;

/** Integer cell coordinates (0-indexed). col is x, row is y. */
export type Position = {
  col: number;
  row: number;
};

/** Identifier for an animal tile (currently a single emoji glyph). */
export type AnimalKind = string;

/** Stable per-tile id, of the form `${row}-${col}`. */
export type TileId = string;

/** A live tile on the board, with its current grid position and its animal. */
export type Tile = {
  id: TileId;
  position: Position;
  animal: AnimalKind;
};

/** A grid cell — either a live `Tile` or `null` (empty / previously cleared). */
export type Cell = Tile | null;

/**
 * Board snapshot. Cells are stored row-major; `cells[row][col]`. Treat as
 * immutable — every reducer transition returns a new Board rather than
 * mutating cells.
 */
export type Board = {
  cols: number;
  rows: number;
  cells: ReadonlyArray<ReadonlyArray<Cell>>;
};

/**
 * The polyline of a valid match: starts at one tile, ends at the other,
 * with at most two intermediate corners (≤ 3 straight segments). The
 * intermediate points may lie on the one-cell border outside the grid.
 */
export type Path = ReadonlyArray<Position>;

/** Who's making a move. */
export type Player = "human" | "computer";

/** Result of `pickMove` — what the AI wants to do this turn. */
export type Move = {
  player: Player;
  a: Position;
  b: Position;
  path: Path;
};

/** `Left` of `generateBoard`. */
export type BoardError =
  | { kind: "InvalidConfig"; reason: string }
  | { kind: "GenerationFailed"; reason: string };

/** Reserved for future Either<MatchError, Playing> APIs; currently informational. */
export type MatchError =
  | { kind: "TileMissing"; at: Position }
  | { kind: "TilesNotEqual" }
  | { kind: "NoPath" };

/** Pre-game: showing the config form. The reducer enters this from Won/Lost via Restart. */
export type Configuring = {
  status: "Configuring";
  config: Config;
};

/** Mid-game. `selected` is the human's pending first click; the AI never uses it. */
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

/** Game over, board empty. `winner` is whoever cleared the last pair. */
export type Won = {
  status: "Won";
  config: Config;
  board: Board;
  scores: Record<Player, number>;
  totalMs: number;
  winner: Player;
};

/** Reserved for the future time-limit mode. v1 never enters this state. */
export type Lost = {
  status: "Lost";
  config: Config;
  board: Board;
  scores: Record<Player, number>;
  totalMs: number;
};

/** Discriminated union covering every possible game state. */
export type GameState = Configuring | Playing | Won | Lost;

/**
 * Every input the reducer accepts. Adding a kind here forces every state's
 * exhaustive `match()` in `reducer.ts` to handle it. Time and randomness are
 * passed in on the events that need them so the reducer stays pure.
 */
export type Event =
  | { kind: "StartGame"; config: Config; now: number; rng: () => number }
  | { kind: "Select"; player: Player; at: Position }
  | { kind: "Match"; player: Player; a: Position; b: Position }
  | { kind: "Hint" }
  | { kind: "Shuffle"; rng: () => number }
  | { kind: "Tick"; now: number }
  | { kind: "Restart" };
