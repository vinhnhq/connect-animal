import { describe, expect, test } from "bun:test";
import { match } from "ts-pattern";
import {
  BOARD_DIMENSIONS,
  type Config,
  type Event,
  type GameState,
  type Player,
} from "@/lib/game/types";

const sampleConfig: Config = {
  boardSize: "medium",
  difficulty: "easy",
  animalSet: "default",
};

describe("game types", () => {
  test("BOARD_DIMENSIONS covers all sizes with the spec'd grids", () => {
    expect(BOARD_DIMENSIONS.small).toEqual({ cols: 8, rows: 6 });
    expect(BOARD_DIMENSIONS.medium).toEqual({ cols: 10, rows: 8 });
    expect(BOARD_DIMENSIONS.large).toEqual({ cols: 12, rows: 10 });
  });

  test("GameState is exhaustive across the four statuses", () => {
    const summarize = (s: GameState): string =>
      match(s)
        .with({ status: "Configuring" }, () => "config")
        .with({ status: "Playing" }, () => "play")
        .with({ status: "Won" }, () => "won")
        .with({ status: "Lost" }, () => "lost")
        .exhaustive();

    expect(summarize({ status: "Configuring", config: sampleConfig })).toBe("config");
  });

  test("Event is exhaustive across the seven kinds", () => {
    const label = (e: Event): string =>
      match(e)
        .with({ kind: "StartGame" }, () => "start")
        .with({ kind: "Select" }, () => "select")
        .with({ kind: "Match" }, () => "match")
        .with({ kind: "Hint" }, () => "hint")
        .with({ kind: "Shuffle" }, () => "shuffle")
        .with({ kind: "Tick" }, () => "tick")
        .with({ kind: "Restart" }, () => "restart")
        .exhaustive();

    expect(label({ kind: "StartGame", config: sampleConfig, now: 0, rng: Math.random })).toBe(
      "start",
    );
    expect(label({ kind: "Restart" })).toBe("restart");
    expect(
      label({ kind: "Match", player: "computer", a: { col: 0, row: 0 }, b: { col: 1, row: 0 } }),
    ).toBe("match");
  });

  test("Player is the human/computer pair", () => {
    const players: Player[] = ["human", "computer"];
    expect(players).toHaveLength(2);
  });
});
