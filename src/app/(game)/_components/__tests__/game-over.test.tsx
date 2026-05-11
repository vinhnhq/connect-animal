import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameOver } from "@/app/(game)/_components/game-over";
import type { Config, Won } from "@/lib/game/types";

const CONFIG: Config = { boardSize: "small", difficulty: "easy", animalSet: "default" };

function won(winner: "human" | "computer", totalMs: number): Won {
  return {
    status: "Won",
    config: CONFIG,
    board: { cols: 2, rows: 1, cells: [[null, null]] },
    scores: winner === "human" ? { human: 1, computer: 0 } : { human: 0, computer: 1 },
    totalMs,
    winner,
  };
}

describe("GameOver", () => {
  test("announces a human win", () => {
    render(
      <GameOver state={won("human", 5_000)} onPlayAgain={() => {}} onChangeSettings={() => {}} />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/you won/i);
  });

  test("announces a computer win", () => {
    render(
      <GameOver
        state={won("computer", 5_000)}
        onPlayAgain={() => {}}
        onChangeSettings={() => {}}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/computer/i);
  });

  test("shows total time as mm:ss", () => {
    render(
      <GameOver state={won("human", 75_000)} onPlayAgain={() => {}} onChangeSettings={() => {}} />,
    );
    expect(screen.getByText("01:15")).toBeInTheDocument();
  });

  test("clicking play again fires onPlayAgain", () => {
    let calls = 0;
    render(
      <GameOver
        state={won("human", 0)}
        onPlayAgain={() => {
          calls += 1;
        }}
        onChangeSettings={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
    expect(calls).toBe(1);
  });

  test("clicking change settings fires onChangeSettings", () => {
    let calls = 0;
    render(
      <GameOver
        state={won("human", 0)}
        onPlayAgain={() => {}}
        onChangeSettings={() => {
          calls += 1;
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /change settings/i }));
    expect(calls).toBe(1);
  });
});
