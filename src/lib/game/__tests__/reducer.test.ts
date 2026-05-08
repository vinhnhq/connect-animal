import { describe, expect, test } from "bun:test";
import { reducer } from "@/lib/game/reducer";
import type {
  Board,
  Cell,
  Config,
  Configuring,
  Event,
  GameState,
  Lost,
  Playing,
  Position,
  Won,
} from "@/lib/game/types";
import { mulberry32 } from "./_helpers/rng";

const config: Config = {
  boardSize: "small",
  difficulty: "easy",
  animalSet: "default",
};

function configuring(): Configuring {
  return { status: "Configuring", config };
}

function startGame(state: Configuring, now = 1000): GameState {
  return reducer(state, { kind: "StartGame", config, now, rng: mulberry32(1) });
}

function asPlaying(state: GameState): Playing {
  if (state.status !== "Playing") throw new Error(`expected Playing, got ${state.status}`);
  return state;
}

function tinyBoard(rows: string[]): Board {
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

function tinyPlaying(rows: string[]): Playing {
  return {
    status: "Playing",
    config,
    board: tinyBoard(rows),
    selected: null,
    hint: null,
    scores: { human: 0, computer: 0 },
    startedAt: 1000,
    elapsedMs: 0,
  };
}

describe("reducer — Configuring", () => {
  test("StartGame transitions to Playing with a generated board", () => {
    const next = startGame(configuring());
    expect(next.status).toBe("Playing");
    const playing = asPlaying(next);
    expect(playing.startedAt).toBe(1000);
    expect(playing.elapsedMs).toBe(0);
    expect(playing.scores).toEqual({ human: 0, computer: 0 });
  });

  test.each<Event>([
    { kind: "Select", player: "human", at: { col: 0, row: 0 } },
    { kind: "Hint" },
    { kind: "Shuffle", rng: mulberry32(1) },
    { kind: "Tick", now: 5000 },
    { kind: "Restart" },
  ])("non-StartGame event $kind keeps Configuring", (e) => {
    const s = configuring();
    expect(reducer(s, e)).toEqual(s);
  });
});

describe("reducer — Playing → Select", () => {
  test("first select stores selection", () => {
    const s = tinyPlaying(["AB", "BA"]);
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 0, row: 0 } });
    expect(next.status).toBe("Playing");
    expect(asPlaying(next).selected).toEqual({ col: 0, row: 0 });
  });

  test("clicking the same tile twice deselects", () => {
    const s = { ...tinyPlaying(["AB", "BA"]), selected: { col: 0, row: 0 } };
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 0, row: 0 } });
    expect(asPlaying(next).selected).toBeNull();
  });

  test("selecting an empty cell is a no-op", () => {
    const s = tinyPlaying(["A.", ".A"]);
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 1, row: 0 } });
    expect(next).toEqual(s);
  });

  test("matching pair clears both tiles and increments score", () => {
    // A . A    row 0 — match between (0,0) and (2,0)
    // ...      row 1
    // B . B    row 2 — keeps board non-empty so we stay in Playing
    const s = { ...tinyPlaying(["A.A", "...", "B.B"]), selected: { col: 0, row: 0 } };
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 2, row: 0 } });
    const playing = asPlaying(next);
    expect(playing.board.cells[0]?.[0]).toBeNull();
    expect(playing.board.cells[0]?.[2]).toBeNull();
    expect(playing.selected).toBeNull();
    expect(playing.scores.human).toBe(1);
  });

  test("non-matching second tile changes the selection", () => {
    const s = { ...tinyPlaying(["AB", "BA"]), selected: { col: 0, row: 0 } };
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 1, row: 0 } });
    expect(asPlaying(next).selected).toEqual({ col: 1, row: 0 });
  });

  test("same animal but no path changes the selection (per spec)", () => {
    // A X A    row 0
    // X X X    row 1
    // X X X    row 2
    // X . X    row 3 — A is locked in by Xs and only a small empty hole prevents border route
    // wait, let's just block both A endpoints with X around them so no 2-turn
    // path exists. Use the fully fenced layout from the path tests.
    //
    //   A X A   row 0
    //   X X X   row 1   (A at (0,0) is fenced down by X(0,1))
    //   X X X   row 2
    //   . . .   row 3
    // Actually with column 0 having X at row 1 and 2 but row 3 empty, A(0,0)
    // can route down via border-left (-1) to row 3 then right — that's 2
    // turns. Hard to build a no-path 3x4. Use a known no-path config:
    //
    //   . . . . .
    //   . X . . .
    //   X A X A .   A at (1,2) and (3,2) with X fence around both
    //   . X . . .
    //   . . . . .
    const s = {
      ...tinyPlaying([".....", ".W...", "XAYA.", ".Z...", "....."]),
      selected: { col: 1, row: 2 } as Position,
    };
    const next = reducer(s, { kind: "Select", player: "human", at: { col: 3, row: 2 } });
    expect(asPlaying(next).selected).toEqual({ col: 3, row: 2 });
  });

  test("clearing the last pair transitions to Won", () => {
    const s = { ...tinyPlaying(["A.A"]), selected: { col: 0, row: 0 } };
    const next = reducer(s, { kind: "Select", player: "computer", at: { col: 2, row: 0 } });
    expect(next.status).toBe("Won");
    if (next.status === "Won") {
      expect(next.winner).toBe("computer");
      expect(next.scores.computer).toBe(1);
    }
  });
});

describe("reducer — Playing → Hint / Shuffle / Tick", () => {
  test("Hint sets the hint pair when one exists", () => {
    const next = reducer(tinyPlaying(["A.A"]), { kind: "Hint" });
    const playing = asPlaying(next);
    expect(playing.hint).not.toBeNull();
    if (playing.hint) {
      const animals = playing.hint.map((p) => playing.board.cells[p.row]?.[p.col]?.animal);
      expect(animals[0]).toBe(animals[1]);
    }
  });

  test("Hint clears to null when no valid pair exists", () => {
    // A fenced board with no pair.
    const s = tinyPlaying([".....", ".W...", "XAYA.", ".Z...", "....."]);
    const next = reducer(s, { kind: "Hint" });
    expect(asPlaying(next).hint).toBeNull();
  });

  test("Shuffle replaces the board with a new layout that has a pair", () => {
    const s = tinyPlaying(["AB", "BA"]);
    const next = reducer(s, { kind: "Shuffle", rng: mulberry32(42) });
    const playing = asPlaying(next);
    expect(playing.board.cols).toBe(2);
    expect(playing.board.rows).toBe(2);
  });

  test("Tick advances elapsedMs based on now - startedAt", () => {
    const next = reducer(tinyPlaying(["AB", "BA"]), { kind: "Tick", now: 1234 });
    expect(asPlaying(next).elapsedMs).toBe(234);
  });

  test("StartGame and Restart in Playing are no-ops", () => {
    const s = tinyPlaying(["AB", "BA"]);
    expect(reducer(s, { kind: "StartGame", config, now: 0, rng: mulberry32(1) })).toEqual(s);
    expect(reducer(s, { kind: "Restart" })).toEqual(s);
  });
});

describe("reducer — Won / Lost terminal states", () => {
  const won: Won = {
    status: "Won",
    config,
    board: tinyBoard([".."]),
    scores: { human: 1, computer: 0 },
    totalMs: 5000,
    winner: "human",
  };
  const lost: Lost = {
    status: "Lost",
    config,
    board: tinyBoard([".."]),
    scores: { human: 0, computer: 1 },
    totalMs: 5000,
  };

  test("Won + Restart returns to Configuring with the same config", () => {
    const next = reducer(won, { kind: "Restart" });
    expect(next.status).toBe("Configuring");
    if (next.status === "Configuring") expect(next.config).toEqual(config);
  });

  test("Lost + Restart returns to Configuring", () => {
    const next = reducer(lost, { kind: "Restart" });
    expect(next.status).toBe("Configuring");
  });

  test.each<Event>([
    { kind: "StartGame", config, now: 0, rng: mulberry32(1) },
    { kind: "Select", player: "human", at: { col: 0, row: 0 } },
    { kind: "Hint" },
    { kind: "Shuffle", rng: mulberry32(1) },
    { kind: "Tick", now: 6000 },
  ])("Won + non-Restart event $kind is a no-op", (e) => {
    expect(reducer(won, e)).toEqual(won);
  });

  test.each<Event>([
    { kind: "StartGame", config, now: 0, rng: mulberry32(1) },
    { kind: "Select", player: "human", at: { col: 0, row: 0 } },
    { kind: "Hint" },
    { kind: "Shuffle", rng: mulberry32(1) },
    { kind: "Tick", now: 6000 },
  ])("Lost + non-Restart event $kind is a no-op", (e) => {
    expect(reducer(lost, e)).toEqual(lost);
  });
});
